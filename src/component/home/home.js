import React, {useEffect, useRef, useState} from "react";
import '../../App.css';
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography
} from "@mui/material";
import inconnu from "../../assets/img/inconnu.png";
import axios from "axios";
import '../../assets/css/component/_home.scss'
import {Search} from "@mui/icons-material";
import {getAllTypes} from "../pokemon/type";
import {getAllGenerations} from "../pokemon/generation";
import {getAllPokemons} from "../pokemon/pokemon";
import Detail from "../pokemon/detail";

function Home() {

    document.title = 'Page d\'accueil'

    const [pokemons, setPokemons] = useState([]);
    const [types, setTypes] = useState([]);
    const [type, setType] = useState('');
    const [generations, setGenerations] = useState([]);
    const [generation, setGeneration] = useState('');

    const [searched, setSearched] = useState({});
    const [toDisplay, setToDisplay] = useState([]);
    const [next, setNext] = useState("");

    const [loading, setLoading] = useState(false);
    const ref = useRef()

    useEffect(() => {
        setLoading(true)

        getAllGenerations().then((data) => {
            setGenerations(data);
        })

        getAllTypes().then((data) => {
            setTypes(data)
        })

        getAllPokemons().then((data) => {
            setNext(data.next);
            for (let i = 0; i < data.results.length; i++) {
                axios.get(data.results[i].url).then( result => {
                    setPokemons(prevArray => [...prevArray, result.data]);
                })
            }
        })

        setLoading(false)
    }, []);

    const handleWheelResult = (e) => {
        setLoading(true);
        const heightBound = Math.floor(e.target.offsetTop * 1.2);
        const heightContainer = ref.current.scrollHeight;
        if (heightBound > heightContainer) {
            setLoading(true);
            axios.get(next).then((actualData) => {
                setNext(actualData.data.next)
                actualData = actualData.data;
                for (let i = 0; i < actualData.results.length; i++) {
                    axios.get(actualData.results[i].url).then(result => {
                        setPokemons(prevArray => [...prevArray, result.data]);
                    })
                }
            })
        }
        setLoading(false)
    }

    const handleTypeChange = (e) => {
        setType(e.target.value);
    }

    const handleGenerationChange = (e) => {
        setGeneration(e.target.value);
    }

    const handleSearch = () => {
        setLoading(true);
        if (generation){
            const foundItem = generations.find(x => x.name === generation);
            axios.get(foundItem.url).then((actualData) => {
                actualData = actualData.data;
                let temp = [];
                actualData.pokemon_species.map(( item ) => {
                    axios.get(item.url.replace('-species', '')).then(result => {
                        if (type){
                            result.data.types.map(( typeItem ) => {
                                if (typeItem.type.name === type) {
                                    temp.push(result.data);
                                    setSearched({"type": type, "generation": generation})
                                }
                            })
                        } else {
                            temp.push(result.data);
                            setSearched({"generation": generation})
                        }
                    })
                })
                setToDisplay(temp)
            })
            setLoading(false);
        } else {
            const foundItem = types.find(x => x.name === type);
            axios.get(foundItem.url).then((actualData) => {
                actualData = actualData.data;
                let temp = [];
                actualData.pokemon.map(( item ) => {
                    axios.get(item.pokemon.url).then(result => {
                        temp.push(result.data);
                        setSearched({"type": type})
                    })
                })
                setToDisplay(temp)
            })
            setLoading(false);
        }
    }

    return <Container maxWidth="lg" ref={ref}>
        <Typography variant="h1" sx={{ fontSize: 45, textAlign: 'center' }}>Pokémons</Typography>
        <Box sx={{ marginBottom: 20 }}>
            <Typography variant="h2" sx={{ fontSize: 35, mb: 5}}>Filtrer les pokémons</Typography>
            <form>
                <FormControl sx={{ m: 1, minWidth: 200 }} variant="standard">
                    <InputLabel id="type-pokemon">Type</InputLabel>
                    <Select
                      labelId="type-pokemon"
                      id="type-pokemon-select"
                      value={type}
                      onChange={handleTypeChange}
                      autoWidth
                      label="Type"
                    >
                    {types.map((type) => (
                        <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }} variant="standard">
                    <InputLabel id="generation-pokemon">Génération</InputLabel>
                    <Select
                      labelId="generation-pokemon"
                      id="generation-pokemon-select"
                      value={generation}
                      onChange={handleGenerationChange}
                      autoWidth
                      label="Generation"
                    >
                    {generations.map((generation) => (
                        <MenuItem key={generation.id} value={generation.name}>{generation.name}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <Button onClick={handleSearch} variant="contained" sx={{ marginTop: 5 }} size="small"><Search />Envoyer</Button>
            </form>
        </Box>
        <Box sx={{ paddingBottom: 30 }} onWheel={e => handleWheelResult(e)}>
            {!loading ? (
                <Box>
                    {searched.type || searched.generation ? (
                        <Typography variant="h3" sx={{ fontSize: 25, mb: 5}}>Trié par : {searched.type}  {searched.generation} </Typography>
                    ) : (
                        <Box></Box>
                    )}

                    {toDisplay.length > 0 ? (
                        <Grid container spacing={2}>
                            {toDisplay.map((pokemon, index) => (
                                <Grid item xs={2} key={index} sx={{textAlign: "center"}}>
                                    <Paper className="card-pokemon" sx={{ flexDirection: 'column', padding: 5 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {pokemon.sprites.front_default ? (
                                                <Box component="img" src={pokemon.sprites.front_default} alt={"image de " + pokemon.name} />
                                            ) : (
                                                <Box component="img" src={inconnu} alt={"image de " + pokemon.name} sx={{ width:'96px', height:'96px' }} />
                                            )}
                                            {pokemon.name}
                                        </Box>
                                        <Detail pokemon={pokemon}/>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Grid container spacing={2}>
                            {pokemons.map((pokemon, index) => (
                                <Grid item xs={2} key={index} sx={{textAlign: "center"}}>
                                    <Paper className="card-pokemon" sx={{ flexDirection: 'column', padding: 5 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {pokemon.sprites.front_default ? (
                                                <Box component="img" src={pokemon.sprites.front_default} alt={"image de " + pokemon.name} />
                                            ) : (
                                                <Box component="img" src={inconnu} alt={"image de " + pokemon.name} sx={{ width:'96px', height:'96px' }} />
                                            )}
                                            {pokemon.name}
                                        </Box>
                                        <Detail pokemon={pokemon}/>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            ) : (
                <Box>Chargement...</Box>
            )}
        </Box>
    </Container>
}


export default Home;