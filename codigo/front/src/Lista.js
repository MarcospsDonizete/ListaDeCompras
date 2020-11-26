import React, { useState } from "react"
import { Col, Row, FormGroup, Label, Input, } from "reactstrap"
import { Link } from 'react-router-dom'
import CurrencyFormat from "react-currency-format";


export default function Lista() {
  const [nome, setNome] = useState('')
  const [supermercado, setSupermercado] = useState('')
  const [valor, setValor] = useState(0)

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
          <Input bssize="sm" type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} />
          <Label for='supermercado'>Supermercado</Label>
          <Input bssize="sm" type="text" id="supermercado" value={supermercado} onChange={e => setSupermercado(e.target.value)} />

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
