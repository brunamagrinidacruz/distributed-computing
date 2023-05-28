import React from 'react';

import Navbar from '../../components/Navbar';

import './style.scss';
import { Link } from 'react-router-dom';

export default function Register() {
    return (
        <>
            <Navbar />
            <div className='register'>
                <span className='title'>Register</span>
                <input type="text" class="forms-input" placeholder="Name" />
                <input type="email" class="forms-input" placeholder="Email" />
                <input type="password" class="forms-input" placeholder="Password" />
                <span className='login-link'>Already have an account? <Link to={'/login'}>Login</Link></span>
                <button type="submit" class="forms-button">Register</button>
            </div>
        </>
    );
}