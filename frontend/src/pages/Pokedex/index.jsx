import React, {useEffect, useState} from "react";

import {getUserPokemons} from "../../api/backend";

import Navbar from "../../components/Navbar";
import Pokemon from "../../components/Pokemon";

import './style.scss';

export default function Pokedex() {
    /** @type {number[]} */
    const pokemonDexes = Array.from({length: 50}, (value, index) => index + 20);

    const [userPokemons, setUserPokemons] = useState(/** @type Any */ {});

    useEffect(() => {
        const fetchUserPokemons = async () => {
            const fetchedUserPokemons = await getUserPokemons(1);
            setUserPokemons(fetchedUserPokemons);
        }

        fetchUserPokemons();
    }, []);


    /**
     * @param dex string
     * @returns boolean
     */
    const userHasPokemon = dex => {
        return userPokemons[dex] === undefined;
    }

    return (
        <div className="pokedex-page">
            <Navbar />
            <div className="pokemon-list-container">
                <div>
                    {pokemonDexes.map(dex =>
                        <div key={dex} className="pokemon-card-container">
                            <Pokemon pokemonDex={dex} renderDisabled={userHasPokemon(dex)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
