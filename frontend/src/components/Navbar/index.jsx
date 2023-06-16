import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './style.scss';

export default function Navbar() {
    const jwt = JSON.parse(localStorage.getItem('jwt'));
    const isLoggedIn = jwt !== null;
    const navigate = useNavigate();

    const handleLogout = (e) => {
        const res = window.confirm('Deseja mesmo sair?');
        if(res) {
            localStorage.removeItem('jwt');
            e.preventDefault();
            navigate('/login');
        }
    }

    return (
        <>
            <div className='navbar'>
                <Link to={'/'} className='title'>POKÉDEX</Link>
                <div className='links'>
                    <Link to={'/'}>Pokédex</Link>
                    <Link to={'/daily-pokemon'}>Daily Pokémon</Link>
                    <Link to={'/companions'}>Companions</Link>
                    {isLoggedIn ?
                        <Link onClick={handleLogout}>Logout</Link>
                        : <>
                            <Link to={'/login'}>Login</Link>
                            <Link to={'/register'}>Register</Link>
                        </>
                    }
                </div>
            </div>
            <div className='black-stripe'>
                <div className='pokeball-circle'>
                    <div className='pokeball-innercircle' />
                </div>
            </div>
        </>
    );
}