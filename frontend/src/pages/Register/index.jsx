import React, { useState } from 'react';

import Navbar from '../../components/Navbar';

import './style.scss';
import { Link } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

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
            <form className='register' onSubmit={handleSubmit}>
                <span className='title'>Register</span>
                <input name='name' type="text" className="forms-input" placeholder="Name"
                    value={formData.name} onChange={handleFieldUpdate} required />
                <input name='email' type="email" className="forms-input" placeholder="Email"
                    value={formData.email} onChange={handleFieldUpdate} required />
                <input name='password' type="password" className="forms-input" placeholder="Password"
                    value={formData.password} onChange={handleFieldUpdate} required />
                <span className='login-link'>
                    Already have an account? <Link to={'/login'}>Login</Link>
                </span>
                <button type="submit" className="forms-button">Register</button>
            </form>
        </>
    );
}