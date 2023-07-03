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
	const { renderDisabled, pokemon } = props;

	return (
		<div className="pokemon">
			<div className={`container render-disabled-${renderDisabled}`}>
				<div className="pokemon-image-container">
					<img src={pokemon && pokemon.sprites.front_default} alt="Pokemon" />
				</div>

				<div className="name-container">
					<span>{pokemon.name.toUpperCase()}</span>
				</div>

				<div className="dex-container">
					<span>#{pokemon.id}</span>
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