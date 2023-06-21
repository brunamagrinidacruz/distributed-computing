import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Pokemon from "../../components/Pokemon";
import { useNavigate } from "react-router-dom";
import { get_user_id, api, setCookie, getCookie } from '../../api/backend';

import './style.scss';

export default function DailyPokemon() {
    const [available, setAvailable] = useState(getCookie('available'));
    const [pokemon, setPokemon] = useState(getCookie('pokemon'));

    useEffect(() => {
        console.log("available " + available)
        console.log("pokemon " + pokemon)
        console.log(pokemon.length == 0)
    })

    // function that sets pokemon by getting from API Call
    async function getRandomPokemon() {
        console.log(pokemon);
        let token = localStorage.getItem('jwt')
        token = token.slice(1, token.length-1);
        console.log(token);
        let user_id = get_user_id();
        let dex = await api.post(`/user/${user_id}/pokemon`, {
            data: {}
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(dex.data);
        const tomorrow = new Date();
        tomorrow.setHours(24, 0, 0, 0);
        setCookie('available', 'false', tomorrow);
        setCookie('pokemon', dex.data, tomorrow);
        setPokemon(dex.data);
        setAvailable('false');
    }

    let navigate = useNavigate(); 
    const gotoPokedex = () =>{
        navigate('/');
    }

    return (
        <>
            <Navbar />
            {
                available != 'false' && pokemon.length == 0 ?
                <div className="page-container">
                    <h1 className="dailyPokemon">Get ready to win a new pokémon!</h1>
                    <img className="pokemon-card" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4f7705ec-8c49-4eed-a56e-c21f3985254c/dah43cy-a8e121cb-934a-40f6-97c7-fa2d77130dd5.png/v1/fill/w_759,h_1053/pokemon_card_backside_in_high_resolution_by_atomicmonkeytcg_dah43cy-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQyMCIsInBhdGgiOiJcL2ZcLzRmNzcwNWVjLThjNDktNGVlZC1hNTZlLWMyMWYzOTg1MjU0Y1wvZGFoNDNjeS1hOGUxMjFjYi05MzRhLTQwZjYtOTdjNy1mYTJkNzcxMzBkZDUucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.9GzaYS7sd8RPY5FlHca09J9ZQZ9D9zI69Ru-BsbkLDA" alt="" />
                    <button type="submit" className="forms-button" onClick={() => getRandomPokemon()}>Let`s Go!</button>
                </div>
                :
                <div className="page-container">
                    <h1 className="dailyPokemon">Congratulations, you've won a new daily pokemon!</h1>
                    <Pokemon pokemonDex={parseInt(pokemon)} renderDisabled={false} className="pokemon-card" />
                    <button type="submit" className="forms-button" onClick={gotoPokedex}>See Pokédex</button>
                </div>
            }
        </>
    )
}