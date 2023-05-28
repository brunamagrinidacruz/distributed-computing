import React from 'react';
import { Link } from 'react-router-dom';

import './style.scss';

export default function Navbar() {
    const isLoggedIn = false;

    return (
        <>
            <div className='navbar'>
                <Link to={'/'} className='title'>POKÉDEX</Link>
                <div className='links'>
                    <Link to={'/'}>Pokédex</Link>
                    <Link to={'/daily-pokemon'}>Daily Pokémon</Link>
                    {isLoggedIn ?
                        <Link to={'/'}>Logout</Link>
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