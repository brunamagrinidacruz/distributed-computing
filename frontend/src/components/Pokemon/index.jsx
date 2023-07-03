import React, {useEffect, useState} from "react";

import './style.scss';
import {getPokemonById} from "../../api/pokeApi";

/**
 *
 * @param {{pokemonDex: number, renderDisabled: boolean, pokemon: Pokemon}} props
 * @returns {JSX.Element}
 * @constructor
 */

export default function Pokemon(props) {
	const { pokemonDex , renderDisabled, pokemon } = props;

	const [renderedPokemon, setRenderedPokemon] = useState(/** @type {Pokemon | null} */null);

	useEffect(() => {
		const fetchPokemon = async () => {
			try {
				const fetchedPokemon = await getPokemonById(pokemonDex);
				setRenderedPokemon(fetchedPokemon);
			} catch (error) {
				console.log(error);
			}
		}

		if (!pokemon) {
			fetchPokemon();
		} else {
			setRenderedPokemon(pokemon);
		}
	}, []);

	return (
		<div className="pokemon">
			<div className={`container render-disabled-${renderDisabled}`}>
				<div className="pokemon-image-container">
					<img src={renderedPokemon && renderedPokemon.sprites.front_default} alt="Pokemon" />
				</div>

				<div className="name-container">
					<span>{renderedPokemon && renderedPokemon.name.toUpperCase()}</span>
				</div>

				<div className="dex-container">
					<span>#{renderedPokemon && renderedPokemon.id}</span>
				</div>

				<div className="types-container">
					{renderedPokemon && renderedPokemon.types.map(type =>
						<div key={`${renderedPokemon.name}-${type.type.name}`} className={`type-container container-${type.type.name}`}>
							<span className="type">{type.type.name}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}