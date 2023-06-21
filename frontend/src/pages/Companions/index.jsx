import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { get_user_id, api } from '../../api/backend';

import './style.scss';

export default function Companions() {
    const [users, setUsers] = useState([]);
    const [region, setRegion] = useState("AM");

    useEffect(() => {
        const effect = async () => {
            let user_id = get_user_id()
            let token = localStorage.getItem('jwt')
            token = token.slice(1, token.length-1);
            let user_companions = await api.get(`/companions/${user_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(user_companions.data);
            let user_region = await api.get('/region');
            setRegion(user_region.data);
        };
        effect();

    }, [])
    return (
        <>
            <Navbar />
            <div className="table-container">
                <table>
                    <caption>Usuários - {region}</caption>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">E-mail</th>
                            <th scope="col">Region</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => 
                            <tr key={index}>
                                <th scope="row">{index+1}</th>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.region}</td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}