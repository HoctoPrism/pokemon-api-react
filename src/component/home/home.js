import React, {useEffect, useRef, useState} from "react";
import '../../App.css';
import {Box, Container, Grid, Paper} from "@mui/material";
import inconnu from "../../assets/img/inconnu.png";
import {LoadingButton} from "@mui/lab";
import {Autorenew} from "@mui/icons-material";
import axios from "axios";
import '../../assets/css/component/_home.scss'


function Home() {

    document.title = 'Page d\'accueil'

    const [pokemons, setPokemons] = useState([]);
    const [pokemonLoaded, setPokemonLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [next, setNext] = useState("");
    const ref = useRef()

    function handleClick() {
        setLoading(true);
        fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=100`)
            .then((response) => response.json())
            .then((actualData) => {
                setNext(actualData.next)

                for (let i = 0; i < actualData.results.length; i++) {
                    fetch(actualData.results[i].url)
                        .then((response) => response.json())
                        .then(result => {
                            setPokemons(prevArray => [...prevArray, result]);
                        })
                }
            })
            .catch((err) => {
                setPokemons([]);
            })
            .finally(() => {
                setPokemonLoaded(true);
                setLoading(false);
            });
    }

    const handleWheel = (e) => {
        const heightBound = Math.floor(e.target.offsetTop * 1.2);
        const heightContainer = ref.current.scrollHeight;
        console.log({'height': heightBound, 'screen': heightContainer})
        if (heightBound > heightContainer) {
            setLoading(true);
            axios.get(next).then((actualData) => {
                setNext(actualData.data.next)
                for (let i = 0; i < actualData.data.results.length; i++) {
                    axios.get(actualData.data.results[i].url).then(result => {
                        setPokemons(prevArray => [...prevArray, result.data]);
                    })
                }
            })
        }
    }

    useEffect(() => {
    }, []);

    return <Container maxWidth="lg" onWheel={ e => handleWheel(e) } ref={ref}>
        <Box sx={{ paddingBottom: 30 }}>
            <LoadingButton
                color="primary"
                onClick={handleClick}
                loading={loading}
                loadingPosition="start"
                startIcon={<Autorenew/>}
                variant="contained"
                sx={{ marginY: 4 }}
            >
                Charger la liste des pokemons
            </LoadingButton>
            {pokemonLoaded ? (
                <Grid container spacing={2}>
                    {pokemons.map((pokemon, index) => (
                        <Grid item xs={2} key={index} sx={{textAlign: "center"}}>
                            <Paper className="card-pokemon">
                                {pokemon.sprites.front_default ? (
                                    <Box component="img" src={pokemon.sprites.front_default} alt={"image de " + pokemon.name} className="img-pokemon"/>
                                ) : (
                                    <Box component="img" src={inconnu} alt={"image de " + pokemon.name} className="img-pokemon"/>
                                )}
                                {pokemon.name}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box></Box>
            )}
        </Box>
    </Container>
}


export default Home;