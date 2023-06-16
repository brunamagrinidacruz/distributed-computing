import React, { useEffect, useState } from 'react';

import Navbar from '../../components/Navbar';

import './style.scss';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/backend';

export default function Register() {
    const jwt = JSON.parse(localStorage.getItem('jwt'));
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();
    
    useEffect(() => {
        if (jwt !== null) {
            navigate('/');
        }
    }, [jwt]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await api.post('signup', formData);
            console.log(res.data);
            alert('Conta criada com sucesso! Por favor faça login.');
            navigate('/login');
        } catch (err) {
            alert(err);
        }
    };

    const handleFieldUpdate = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Navbar />
            <form className='register' onSubmit={handleSubmit}>
                <span className='title'>Register</span>
                <input name='username' type="text" className="forms-input" placeholder="Username"
                    value={formData.username} onChange={handleFieldUpdate} required />
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