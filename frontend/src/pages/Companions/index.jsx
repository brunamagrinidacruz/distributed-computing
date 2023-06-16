import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

import './style.scss';

export default function Companions() {
    const [users, setUsers] = useState();
    const [region, setRegion] = useState("AM");

    useEffect(() => {
        // set region here
        // set users here
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
                        <tr>
                            <th scope="row">1</th>
                            <td>kibon</td>
                            <td>kibon@gmail.com</td>
                            <td>AM</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>sorvete</td>
                            <td>sorvete@gmail.com</td>
                            <td>AM</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>otto</td>
                            <td>otto@gmail.com</td>
                            <td>AM</td>
                        </tr>
                        <tr>
                            <th scope="row">4</th>
                            <td>yas</td>
                            <td>yas@gmail.com</td>
                            <td>AM</td>
                        </tr>
                        <tr>
                            <th scope="row">5</th>
                            <td>magrini</td>
                            <td>magrini@gmail.com</td>
                            <td>AM</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}