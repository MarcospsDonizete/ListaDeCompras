import React, { useState } from "react"
import { Col, Row, Alert, Input, Button, FormGroup, Label } from "reactstrap"
import api from './api'

export default function Produto() {
    const [nome, setNome] = useState('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [produtos, setProdutos] = useState([])

    const busca = (buscar) => {
        if (buscar === "") {
            setProdutos('')
        }
        else {
            api.post('/selectproduto', { nome: buscar })
                .then(response => {
                    if (!response.data.erro)
                        setProdutos(response.data.result)
                    console.log(response.data.result)
                })
                .catch(e => console.log(e.message))
        }
    }

    const insert = () => {
        setErro('')
        setSucesso('')
        if (nome.trim() === '')
            setErro('Forneça o nome')
        else {
            api.post('/insertproduto', { nome })
                .then(response => {

                    if (response.data.erro)
                        setErro(response.data.erro)
                    else {
                        setSucesso('Produto registrado com sucesso')
                        clear()
                    }
                })
                .catch(e => console.log(e.message))
        }
    }

    const clear = () => {
        setNome('')
    }
    return (
        <>
            <Row>
                <Col sm='12' className='mb-2'>
                    <h6>Cadastro de Produto</h6>
                </Col>
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
                <Col lg='4' md='6' sm='12'>
                    <Label for='nome'>Nome</Label>
                    <Input bssize="sm" type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} />
                </Col>

                <Col sm='12'>
                    <Button style={{ margin: '15px 0px 15px' }} onClick={insert}>Cadastrar</Button>
                </Col>
            </Row>

            <Row>
                <Col lg='4' md='6' sm='12'>
                    <FormGroup>
                        <Label for='buscar'>Buscar produtos</Label>
                        <Input type="text" id="buscar" onChange={e => busca(e.target.value)} />
                    </FormGroup>
                </Col>
            </Row>
            {produtos.length > 0 &&
                <Row className="mt-4">
                    <Col sm='12' className='mb-2'>
                        <h6>Lista de Produtos</h6>
                    </Col>
                    <Col lg='4' sm='6' className="border overflow-auto" style={{ maxHeight: 200 }}>
                        {produtos.map(item => <div key={item.idproduto} className='pt-2 pb-1'>{item.nome}</div>)}
                    </Col>
                </Row>}
        </>

    )
}
