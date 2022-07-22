import {Box, Button, Card, Grid, List, ListItem, Modal, Paper, Typography} from "@mui/material";
import {useState} from "react";
import '../../assets/css/component/_home.scss'
import {colors} from "./color";

function Detail(props) {

    const [detailShow, setShowDetail] = useState(false);

    return (<Box>
        <Button variant="contained" onClick={() => setShowDetail(true)}>Détails</Button>
        <Modal
            hideBackdrop
            open={detailShow}
            onClose={() => setShowDetail(false)}
            aria-labelledby="new-type-title"
            aria-describedby="child-modal-description"
        >
            <Grid container spacing={2} className="modal-type" sx={{bgcolor: 'background.default'}}>
                <Grid item xs={6}>
                    <Typography>n°{props.pokemon.id}</Typography>
                    <Typography>Nom : {props.pokemon.name}</Typography>
                    <Typography>Taille : {props.pokemon.height}</Typography>
                    <Typography>Poids : {props.pokemon.weight}</Typography>
                </Grid>
                <Grid item xs={6} className="card-pokemon">
                    <Box component='img' src={props.pokemon.sprites.front_default}></Box>
                </Grid>
                <Grid item xs={12}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 20, marginTop: 5 }}>Stats:</Typography>
                    <List className='card-pokemon'>
                        {props.pokemon.stats.map((stat) => (
                            <ListItem sx={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
                                <Typography sx={{ fontWeight: 'bold' }}>{stat.stat.name}</Typography>
                                <Typography>{stat.base_stat}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={12}>
                    <List sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 20 }}>Types:</Typography>
                        {props.pokemon.types.map((gen) => (
                            <ListItem sx={{ width: 'auto' }}>
                                <Card sx={{ p:3, backgroundColor: colors[gen.type.name]}} >{gen.type.name.toUpperCase()}</Card>
                            </ListItem>
                        ))}
                    </List>
                    <Button sx={{ float: "right", marginTop: 10 }} variant="contained" onClick={() => setShowDetail(false)}>Fermer</Button>
                </Grid>

            </Grid>
        </Modal>
    </Box>

    )
}

export default Detail;