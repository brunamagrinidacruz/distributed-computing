import React, { useState } from 'react';

import Navbar from '../../components/Navbar';

import './style.scss';
import { Link } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData)
    };

    const handleFieldUpdate = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Navbar />
            <form className='login' onSubmit={handleSubmit}>
                <span className='title'>Login</span>
                <input name='email' type="text" className="forms-input" placeholder="Email"
                    value={formData.email} onChange={handleFieldUpdate} required />
                <input name='password' type="password" className="forms-input" placeholder="Password"
                    value={formData.password} onChange={handleFieldUpdate} required />
                <span className='register-link'>
                    Don't have an account yet? <Link to={'/register'}>Register</Link>
                </span>
                <button type="submit" className="forms-button">Login</button>
            </form>
        </>
    );
}