import axios from "axios";

let pokemons = [];

export const getAllPokemons = async () => {
    await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=100`).then((actualData) => {
        actualData = actualData.data;
        pokemons = actualData
    })
    return pokemons
}

export const handleWheel = (e, next, ref, parent) => {
    e.preventDefault();
    const heightBound = Math.floor(e.target.offsetTop * 1.2);
    const heightContainer = ref.current.scrollHeight;
    if (heightBound > heightContainer) {
        axios.get(next).then((actualData) => {
            actualData = actualData.data;
            pokemons = actualData
        })
    }
    return parent(pokemons)
}


export default {getAllPokemons, handleWheel}