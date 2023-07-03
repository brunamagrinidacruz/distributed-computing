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

/**
 *
 * @param {Array.<number>} ids
 * @returns {Promise<Array.<Pokemon>>}
 */
export async function batchGetPokemonByIds(ids) {
    const requests = ids.map(id => axios.get(`${baseUrl}/pokemon/${id}/`));

    try {
        const responses = await Promise.all(requests);
        return responses.map(res => res.data);
    } catch (e) {
        console.log({error: e});
    }
}
