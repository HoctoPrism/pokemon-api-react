import axios from "axios";

let results = [];

export const getAllGenerations = async () => {
    await axios.get('https://pokeapi.co/api/v2/generation').then((data) => {
        data = data.data.results;
        data.map((result) => {
            let id = result.url.split('/')[6];
            results.push({"id": id,"url": result.url, "name": result.name});
        })
    })
    return results
}


export default {getAllGenerations}

