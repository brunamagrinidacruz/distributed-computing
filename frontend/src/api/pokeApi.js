import axios from "axios";

const baseUrl = 'https://pokeapi.co/api/v2';

/**
 * @typedef {Object} Sprite
 * @property {string} front_default
 */

/**
 * @typedef {Object} PokemonType
 * @property {number} slot
 * @property {{name: string, url: string}} type
 */


/**
 * @typedef {Object} Pokemon
 * @property {number} id
 * @property {string} name
 * @property {Sprite} sprites
 * @property {Array.<PokemonType>} types
 */

/**
 *
 * @param {number} id
 * @returns {Pokemon}
 */
export async function getPokemonById(id) {
    try {
        if(Number.isInteger(id)) {
            const response = await axios.get(`${baseUrl}/pokemon/${id}/`);
            return response.data;
        }
    } catch (e) {
        console.log(e);
    }
}
