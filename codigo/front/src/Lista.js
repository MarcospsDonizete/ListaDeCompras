import React, { useState, useEffect } from "react"
import { Col, Row, FormGroup, Label, Input, } from "reactstrap"
import { Link } from 'react-router-dom'
import CurrencyFormat from "react-currency-format";
import datalist from "datalist-polyfill";
import api from './api'

export default function Lista() {
  const [nome, setNome] = useState('')
  const [supermercado, setSupermercado] = useState([])
  const [valor, setValor] = useState(0)
  const [produtos, setProdutos] = useState([])

  useEffect(() => load(), []);

  const load = () => {
    api.post('/selectsupermercado')
      .then(response => {
        if (!response.data.erro)
          setSupermercado(response.data.result)
      })
      .catch(e => console.log(e.message))
  }

  const busca = (buscar) => {
    if (buscar === "") {
      setProdutos([])
      console.log("oi leticia né?")
    }
    else {
      api.post('/selectproduto', { nome: buscar })
        .then(response => {
          if (!response.data.erro)
            setProdutos(response.data.result)
        })
        .catch(e => console.log(e.message))
    }
  }
  const clear = () => {
    setNome('')
    setValor(0)
  }


  return (
    <>
      <Row>
        <Col>Lista de compras</Col>
      </Row>
      <Col lg='4' md='6' sm='12'>
        <FormGroup>
          <Label for='nome'>Nome</Label>
          <Input bssize="sm" title="nome" type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} />
          <Label for='supermercado'>Supermercado</Label>
          <Input type="text" id="listaSupermercado" list='supermercado' />
          <datalist id='supermercado'>
            {supermercado.map((item, key) =><option key={key.idsupermercado} value={item.nome} />)}
          </datalist>
          <Label for='supermercado'>Produto</Label>
          <Input type="text" id="listaProduto" list='produtos' onChange={e => busca(e.target.value)}/>
          <datalist id='produtos'>
            {produtos.map((item, key) =><option key={key.idprodutos}  value={item.nome} />)}
          </datalist>

        </FormGroup>
      </Col>
      <Col lg='4' md='6' sm='12'>
        <FormGroup>
          <Label for='valor'>Valor</Label>
          <CurrencyFormat
            className="form-control"
            value={valor}
            displayType={"input"}
            prefix={"R$ "}
            decimalSeparator={","}
            decimalScale={2}
            fixedDecimalScale={false}
            allowNegative={false}
            onValueChange={values => {
              const { floatValue } = values;
              setValor(floatValue);
            }}
          />
        </FormGroup>
      </Col>

    </>
  )
}
