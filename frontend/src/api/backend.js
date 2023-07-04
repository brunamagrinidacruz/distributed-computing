import axios from "axios";

// const baseUrl = 'https://pokeapi.co/api/v2';

export const api = axios.create({
    baseURL: 'http://161.35.30.200'
})

/**
 *
 * @returns {Object}
 */
export function get_user_id() {
    let token = localStorage.getItem("jwt");

    if (!token) {
        return null;
    }

    let base64Url = token.split('.')[1];

    if (!base64Url) {
        return null;
    }

    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    jsonPayload = JSON.parse(jsonPayload);

    return jsonPayload.id;
}

/**
 *
 * @param {string} cname
 * @param {string} cvalue
 * @param {number} exdays
 */
export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * 
 * @param {string} cname 
 * @returns {string}
 */
export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

/**
 *
 * @param {number} userId
 * @returns {Any}
 */
export async function getUserPokemons(userId) {
    const jwt = localStorage.getItem('jwt')
    const token = jwt.slice(1, jwt.length-1);

    const res = await api.get(`user/${userId}/pokemon`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return res.data;
}
