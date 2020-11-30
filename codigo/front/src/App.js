import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Header from './Header'
import Lista from "./Lista"
import Erro from "./Erro"
import Produto from './Produto'
import Supermercado from './Supermercado'
import NoMatch from "./NoMatch"
import { Container, Row, Col } from 'reactstrap'
import api from './api'

export default function App() {
  const [login, setLogin] = useState({ idusuario:0,nome: '', mail: '' })

  useEffect(() => {
    api.get('/currentuser')
      .then(response => setLogin(response.data))
      .catch(e => console.log(e.message))
  }, []);

  return (
    <Container>
      <BrowserRouter>
        <Header login={login} setLogin={setLogin} />
        <Row className='bg-light mb-4'>
          <Col>
            <Link to='/produto' className='mr-4'>Produto</Link>
            <Link to='/supermercado' className='mr-4'>Supermercado</Link>
            <Link to='/lista' className='mr-4'>Lista de Compras</Link>
          </Col>
        </Row>
        <Switch>
          <Route
            path="/"
            exact={true}
            component={() => <Lista login={login} />}
          />
          <Route
            path="/lista"
            exact={true}
            component={() => <Lista login={login}/>}
          />
          <Route
            path="/supermercado"
            exact={true}
            component={() => <Supermercado login={login} />}
          />
          <Route
            path="/produto"
            exact={true}
            component={() => <Produto />}
          />
          <Route
            path="/erro"
            exact={true}
            component={() => <Erro />}
          />
          <Route
            path="*"
            component={() => <NoMatch />}
          />
        </Switch>
      </BrowserRouter>
    </Container>
  );
}

