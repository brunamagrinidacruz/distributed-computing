import React from 'react';

import Navbar from '../../components/Navbar';

import './style.scss';
import { Link } from 'react-router-dom';

export default function Login() {
    return (
        <>
            <Navbar />
            <div className='login'>
                <span className='title'>Login</span>
                <input type="text" class="forms-input" placeholder="Email" />
                <input type="password" class="forms-input" placeholder="Password" />
                <span className='register-link'>Don't have an account yet? <Link to={'/register'}>Register</Link></span>
                <button type="submit" class="forms-button">Login</button>
            </div>
        </>
    );
}