import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Button
} from 'reactstrap';
import api from './api';

export default function Header(props) {

    const logout = () => {
        api.get('/logout')
            .then(response => {
                console.log(response.data)
                props.setLogin(response.data)
            })
            .catch(e => console.log(e.message))
    }

    return (
        <Navbar>
            <NavbarBrand>Lista de compras</NavbarBrand>
            <div>
                {props.login.nome === '' &&
                    <a href='http://localhost:3101/login'>Login</a>
                }
                {props.login.nome !== '' && (
                    <>
                        <span>{props.login.nome}</span>
                        <Button onClick={() => logout()} className="ml-2" color='link'>Sair</Button>
                    </>
                )}
            </div>
        </Navbar>
    )
}



