import React, { useState, useEffect } from "react"
import { Col, Row, FormGroup, Label, Input, Button, Alert } from "reactstrap"
import { Link } from 'react-router-dom'
import CurrencyFormat from "react-currency-format";
import api from './api'

export default function Lista(props) {
  const [nomeSupermercado, setNomeSupermercado] = useState('')
  const [nomeProduto, setNomeProduto] = useState('')
  const [supermercados, setSupermercado] = useState([])
  const [valor, setValor] = useState(0)
  const [produtos, setProdutos] = useState([])
  const [listaCompras, setListaCompras] = useState([])
  const [idsupermercado, setIdSupermercado] = useState(0)
  const [idProduto, setIdProduto] = useState(0)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [lista, setLista] = useState([])
  const [total, setTotal] = useState(0)
  const [temp, setTemp] = useState(0)

  const [flagLista, setFlagLista] = useState(Boolean)

  useEffect(() => load(), []);
  useEffect(() => load2(), []);

  const load = () => {
    api.post('/selectsupermercado')
      .then(response => {
        if (!response.data.erro)
          setSupermercado(response.data.result)
      })
      .catch(e => console.log(e.message))
  }

  const load2 = () => {
    api.post('/selectlista', { id: props.login.id })
      .then(response => {
        if (!response.data.erro)
          setListaCompras(response.data.result)
      })
      .catch(e => console.log(e.message))
  }


  const busca = (buscar) => {
    setNomeProduto(buscar)
    if (produtos.length > 0) {
      let idproduto = produtos.find(item => item.nome.toLowerCase().trim() === buscar.toLowerCase().trim());
      if (idproduto)
        setIdProduto(idproduto.idproduto)
      else
        setIdProduto(-1)
    }

    api.post('/selectproduto', { nome: buscar.trim() })
      .then(response => {
        if (!response.data.erro)
          setProdutos(response.data.result)
      })
      .catch(e => console.log(e.message))
  }

  const pegaId = (supermercado) => {
    setNomeSupermercado(supermercado)
    if (supermercado.length > 0) {
      let market = supermercados.find(item => item.nome.toLowerCase().trim() === supermercado.toLowerCase().trim());
      if (market)
        setIdSupermercado(market.idsupermercado)
      else
        setIdSupermercado(-1)
    }
  }

  const salvaLista = () => {
    if (nomeSupermercado.trim().length < 1 || idsupermercado === -1) {
      error("Supermercado não encontrado")
    }
    else if (nomeProduto.trim().length < 1) {
      error("A lista deve iniciar com ao menos 1 produto")
    }
    else if (idProduto === -1) {
      error("Produto não encontrado")
    }
    else {
      api.post('/insertlista', { idsupermercado: idsupermercado })
        .then(response => {
          addProdutoLista(response.data.idlista)
          if (response.data.erro)
            error(response.data.erro)
          else {
            sucess('Lista registrada com sucesso')
            load()
            load2()
            clear()
          }
        })
        .catch(e => console.log(e.message))
    }
  }
  const addProdutoLista = (idLista) => {
    if (produtos.length > 1) {
      sucess('Especifique o produto')
    } else {

      api.post('/insertprodutoporlista', { idlista: idLista, idproduto: idProduto, valor: valor })
        .then(response => {
          if (response.data.erro)
            error(response.data.erro)
        })
    }
  }

  const clear = () => {
    setNomeProduto('')
    setNomeSupermercado('')
    setValor(0)
    setProdutos([])
    setLista([])
  }

  const salvar = () => {
    setFlagLista(false)
    clear()
  }

  const updatelista = () => {
    setFlagLista(false)
    clear()
  }

  const montaLista = (key) => {
    setFlagLista(true)

    api.post('/selectprodutoporlista', { idlista: key })
      .then(response => {
        if (!response.data.erro)
          setLista(response.data.result)
      })
      .catch(e => console.log(e.message))
  }

  const error = (error) => {
    setErro(error)
    setTimeout(function () { setErro(''); }, 3000);
  }

  const sucess = (sucess) => {
    setSucesso(sucess)
    setTimeout(function () { setSucesso(''); }, 3000);
  }

  const verifica = (v) => {
    console.log(lista)

  }

  const set = () => {
    let coisa = 0
    setTimeout(() => {
      lista.map(item => coisa = item.valor + coisa)
      setTotal(coisa)
    }, 30)
  }

  return (
    <>
      <Row>
        <Col md='6' sm='12' >
          <Row>
            <Col className='font-weight-bold m-2' >Lista de compras</Col>
          </Row>
          {erro !== '' &&
            <Col sm='12'>
              <Alert color="danger">{erro}</Alert>
            </Col>
          }
          {sucesso !== '' &&
            <Col sm='12'>
              <Alert color="success">{sucesso}</Alert>
            </Col>
          }
          <Col md='10' sm='12'>
            <FormGroup>
              <Label for='listaSupermercado' className='m-2'>Supermercado</Label>
              <Input type="text" id="listaSupermercado" list='supermercado' value={nomeSupermercado} onChange={e => (pegaId(e.target.value.replace("  ", " ")))} />
              <datalist id='supermercado'>
                {supermercados.map((item, key) => <option key={key.idsupermercado} value={item.nome} />)}
              </datalist>

              {!flagLista &&
                <Row className='m-0'>
                  <Label for='listaProduto' >Produto</Label>
                  <Input type="text" id="listaProduto" list='produtos' value={nomeProduto} onChange={e => busca(e.target.value.replace("  ", " "))} />
                  <datalist id='produtos'>
                    {produtos.map((item, key) => <option key={key.idprodutos} value={item.nome} />)}
                  </datalist>

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
                  <Button style={{ margin: '15px 0px 15px' }} onClick={salvaLista}>Cadastrar nova lista</Button>
                </Row>}
            </FormGroup>
            <Col sm='12'>
            </Col>
          </Col>
        </Col>
        <Col md='6' sm='12'>
          {lista.length > 0 &&
            <Row>
              <Col sm='6'>
                <h6>Lista de Compras</h6>
              </Col>
              <Col sm='6' className='font-weight-bold'>Nome da Lista</Col>
              {flagLista &&
                <Row className='m-0'>
                  <Label for='listaProduto' >Produto</Label>
                  <Input type="text" id="listaProduto" list='produtos' value={nomeProduto} onChange={e => busca(e.target.value.replace("  ", " "))} />
                  <datalist id='produtos'>
                    {produtos.map((item, key) => <option key={key.idprodutos} value={item.nome} />)}
                  </datalist>

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
                </Row>}
              <Row>
                <Button style={{ margin: '15px 15px 15px' }} onClick={updatelista}>Adiciona produto</Button>
                <Button style={{ margin: '15px 15px 15px' }} onClick={salvar}>Salvar Lista</Button>
              </Row>
              <Col sm="12" className="border" style={{ maxHeight: 200 }}>
                {lista.map(item => <Row className='border-bottom pt-2 pb-1'>
                  <Col className='font-weight-bold' sm='5'>{item.nome}</Col>
                  <Col sm='3'>R${item.valor}</Col>
                  <Col sm='2'><Link>Editar</Link></Col>
                  <Col sm='2'><Link>Excluir</Link></Col>
                </Row>)}
                {set()}
                <Row sm='12' className='font-weight-bold pt-2 pb-1'>
                  <Col sm='5'>Total</Col>
                  <Col sm='5'>R${total}</Col>
                </Row>
              </Col>
            </Row>}

        </Col>
      </Row>
      <Row sm='12'>
        {listaCompras.length > 0 &&
          <Col className="mt-4">
            <Row className='mb-2'>
              <h6>Listas Cadastradas</h6>
            </Row>
            {listaCompras.map(item => <Row key={item.idlista} className='pt-2 pb-1 border' onClick={e => montaLista(e.target.id)}>
              <Col id={item.idlista}>
                {item.nome}
              </Col>
              <Col className="float-right" id={item.idlista}>
                {item.datahorario}
              </Col>
            </Row>)}
          </Col>}
      </Row>
      <Button style={{ margin: '15px 0px 15px' }} onClick={verifica}>Cveriahsgd</Button>
    </>
  )
}
