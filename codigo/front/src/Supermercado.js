import React, { useState, useEffect } from "react"
import { Col, FormGroup, Row, Form, Label, Input, Button, Alert } from "reactstrap"
import api from './api'

export default function Supermercado(props) {
    const [nome, setNome] = useState('')
    const [logradouro, setLogradouro] = useState('')
    const [bairro, setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [uf, setUf] = useState('')
    const [nro, setNro] = useState('')
    const latitude = ''
    const longitude = ''    
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [supermercados, setSupermercados] = useState([])

    useEffect(() => load(), []);

    const load = () => {
        api.post('/selectsupermercado')
            .then(response => {
                if (!response.data.erro)
                    setSupermercados(response.data.result)
            })
            .catch(e => console.log(e.message))
    }

    const insert = () => {
        setErro('')
        setSucesso('')
        if (nome.trim() === '')
            setErro('Forneça o nome do supermercado')
        else
            api.post('/insertsupermercado', { nome, logradouro, bairro, cidade, uf, nro, latitude, longitude })
                .then(response => {
                    console.log(response.data)
                    if (response.data.erro)
                        setErro(response.data.erro)
                    else {
                        setSucesso('Supermercado registrado com sucesso')
                        clear()
                        load()
                    }
                })
                .catch(e => console.log(e.message))
    }

    const clear = () => {
        setNome('')
        setLogradouro('')
        setBairro('')
        setCidade('')
        setUf('')
        setNro('')

    }

    return (

        <>
            <Form>
                <Row>
                    <Col sm='12' className='mb-2'>
                        <h6>Cadastro de supemercado</h6>
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
                        <FormGroup>
                            <Label for='nome'>Nome</Label>
                            <Input bssize="sm" type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col lg='4' md='6' sm='12'>
                        <FormGroup>
                            <Label for='logradouro'>Logradouro</Label>
                            <Input bssize="sm" type="text" id="logradouro" value={logradouro} onChange={e => setLogradouro(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col lg='4' md='6' sm='12'>
                        <FormGroup>
                            <Label for='bairro'>Bairro</Label>
                            <Input bssize="sm" type="text" id="bairro" value={bairro} onChange={e => setBairro(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col lg='4' md='6' sm='12'>
                        <FormGroup>
                            <Label for='cidade'>Cidade</Label>
                            <Input bssize="sm" type="text" id="cidade" value={cidade} onChange={e => setCidade(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col lg='2' md='4' sm='12'>
                        <FormGroup>
                            <Label for='uf'>UF</Label>
                            <Input bssize="sm" type="select" id="uf" value={uf} onChange={e => setUf(e.target.value)}>
                                {['', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(item => <option key={item}>{item}</option>)}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col lg='2' md='4' sm='12'>
                        <FormGroup>
                            <Label for='nro'>Nro</Label>
                            <Input bssize="sm" type="text" id="nro" value={nro} onChange={e => setNro(e.target.value.replace(/\D/, ''))} />
                        </FormGroup>
                    </Col>
                    <Col sm='12'>
                        <Button bssize="sm" onClick={insert}>Cadastrar</Button>
                    </Col>
                </Row>
            </Form>
            {supermercados.length > 0 &&
                <Row className="justify-content-center mt-4">
                    <Col sm='12' className='mb-2'>
                        <h6>Lista de supemercados</h6>
                    </Col>
                    <Col sm='12' className="border overflow-auto" style={{ maxHeight: 200 }}>
                        {supermercados.map((item) => <div key={item.idsupermercado} className='pt-2 pb-1'>{item.nome}</div>)}
                    </Col>
                </Row>}
        </>
    )
}