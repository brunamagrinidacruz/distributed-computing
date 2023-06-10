import React, {useEffect, useState} from "react";

import './style.scss';
import {getPokemonById} from "../../api/pokeApi";

/**
 *
 * @param {{pokemonDex: number, renderDisabled: boolean}} props
 * @returns {JSX.Element}
 * @constructor
 */

export default function Pokemon(props) {
	const { pokemonDex , renderDisabled } = props;

	const [pokemon, setPokemon] = useState(/** @type {Pokemon | null} */null);

	useEffect(() => {
		const fetchPokemon = async () => {
			const fetchedPokemon = await getPokemonById(pokemonDex);
			setPokemon(fetchedPokemon);
		}

		fetchPokemon();
	}, []);

	return (
		<div className="pokemon">
			<div className={`container render-disabled-${renderDisabled}`}>
				<div className="pokemon-image-container">
					<img src={pokemon && pokemon.sprites.front_default} alt="Pokemon" />
				</div>

				<div className="name-container">
					<span>{pokemon ? pokemon.name.toUpperCase() : "Piplup"}</span>
				</div>

				<div className="types-container">
					{pokemon && pokemon.types.map(type =>
						<div key={`${pokemon.name}-${type.type.name}`} className={`type-container container-${type.type.name}`}>
							<span className="type">{type.type.name}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}