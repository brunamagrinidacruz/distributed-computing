import React, {useEffect, useState} from "react";

import {get_user_id, getUserPokemons} from "../../api/backend";

import Navbar from "../../components/Navbar";

import './style.scss';
import {batchGetPokemonByIds} from "../../api/pokeApi";
import Pokemon from "../../components/Pokemon";

export default function Pokedex() {
    const [userPokemons, setUserPokemons] = useState(/** @type Any */ {});

    const [pokemons, setPokemons] = useState(/** @type Array.<Pokemon> */ []);

    const [reachedEnd, setReachedEnd] = useState(true);

    const [dexOffset, setDexOffset] = useState(0);

    const [endScrolling, setEndScrolling] = useState(false);

    const batchSize = 200;

    const fetchUserPokemons = async () => {
        const userId = get_user_id();

        if (!userId) {
            return;
        }

        const fetchedUserPokemons = await getUserPokemons(userId);
        setUserPokemons(fetchedUserPokemons);
    }

    const fetchPokemons = async () => {
        console.log("Hello");
        const batch = Array.from({length: batchSize}, (value, index) => index + dexOffset + 1);

        const newPokemons = await batchGetPokemonByIds(batch);

        setPokemons(existingPokemons => ([
            ...existingPokemons,
            ...newPokemons
        ]));
    }

    useEffect(() => {
        fetchUserPokemons();
    }, []);

    useEffect(() => {
        fetchPokemons();
        setReachedEnd(false);
    }, [userPokemons]);

    useEffect(() => {
        const nextDex = dexOffset + batchSize;

        if (nextDex > 1010 - batchSize) {
            setEndScrolling(true);
        } else {
            setDexOffset(nextDex);
        }
    }, [pokemons])

    const handleScroll = () => {
        const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
        const componentHeight = document.documentElement.offsetHeight;

        if (scrollPosition >= componentHeight && !reachedEnd && !endScrolling) {
            setReachedEnd(true);
            fetchPokemons();
            setReachedEnd(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pokemons]);


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
                    {pokemons.map((pokemon, index) =>
                        <div key={index} className="pokemon-card-container">
                            <Pokemon renderDisabled={userHasPokemon(pokemon.id)} pokemon={pokemon} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
