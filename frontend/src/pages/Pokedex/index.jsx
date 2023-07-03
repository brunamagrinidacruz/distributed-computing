import React, {useEffect, useState} from "react";

import {get_user_id, getUserPokemons} from "../../api/backend";

import Navbar from "../../components/Navbar";

import './style.scss';
import {batchGetPokemonByIds} from "../../api/pokeApi";
import Pokemon from "../../components/Pokemon";

export default function Pokedex() {
    /** @type {number[]} */
    const pokemonDexes = Array.from({length: 1010}, (value, index) => index + 1);

    const [userPokemons, setUserPokemons] = useState(/** @type Any */ {});

    const [pokemons, setPokemons] = useState(/** @type Array.<Pokemon> */ []);

    const [fetchedPokemons, setFetchedPokemons] = useState( {});

    useEffect(() => {
        const fetchUserPokemons = async () => {
            const userId = get_user_id();
            const fetchedUserPokemons = await getUserPokemons(userId);
            setUserPokemons(fetchedUserPokemons);
        }

        const fetchPokemons = async () => {
            const batchSize = 200;
            const delay = 500;

            const batches = [];
            for (let i = 0; i < pokemonDexes.length; i += batchSize) {
                const batch = pokemonDexes.slice(i, i + batchSize);
                batches.push(batch);
            }

            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                const pokemons_ = await batchGetPokemonByIds(batch);

                setFetchedPokemons(existingPokemons => ({
                    ...existingPokemons,
                    [i]: pokemons_
                }));

                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        fetchUserPokemons();
        fetchPokemons();
    }, []);

    useEffect(() => {
        const pokemons_ = [];

        for (const key in fetchedPokemons) {
            pokemons_.push(...fetchedPokemons[key]);
        }

        setPokemons(pokemons_);
    }, [fetchedPokemons]);


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
                    {pokemons.map(pokemon =>
                        <div key={`${pokemon.id}-${Math.random()}`} className="pokemon-card-container">
                            <Pokemon renderDisabled={userHasPokemon(pokemon.id)} pokemon={pokemon} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
