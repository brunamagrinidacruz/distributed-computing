import axios from "axios";

// const baseUrl = 'https://pokeapi.co/api/v2';

export const api = axios.create({
    baseURL: 'http://161.35.30.200'
})


/**
 *
 * @param {number} userId
 * @returns {Any}
 */
export async function getUserPokemons(userId) {
    return {
        "23": 2,
        "24": 3,
        "25": 1
    }
}
