import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Navbar from '../../components/Navbar';
import { api } from '../../api/backend';
import './style.scss';


export default function Login() {
    const jwt = JSON.parse(localStorage.getItem('jwt'));
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    
    useEffect(() => {
        if (jwt !== null) {
            navigate('/');
        }
    }, [jwt]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await api.post('signin', formData);
            localStorage.setItem('jwt', JSON.stringify(res.data))
            navigate('/');
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
            <form className='login' onSubmit={handleSubmit}>
                <span className='title'>Login</span>
                <input name='username' type="text" className="forms-input" placeholder="Username"
                    value={formData.username} onChange={handleFieldUpdate} required />
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