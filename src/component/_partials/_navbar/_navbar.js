import {AppBar, Box, Button} from "@mui/material";
import {SwitchModeButton} from "../_theme/_switchModeButton";
import {useEffect} from "react";
import logo from "../../../assets/img/logo.png";

export function Navbar() {

    useEffect(() => {
    }, [])

    const Logo = () => {
        return (
            <Box sx={{ marginLeft: "20px" }}>
                <Box component="img" src={logo} alt="logo" sx={{ width: "40px", height: "40px" }}/>
            </Box>
        );
    };

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar className='header'>
                <Logo/>
                <Box sx={{m: 5, flexGrow: 1}} component="div">{document.title}</Box>
                <Box sx={{display: 'flex', justifyContent: "flex-end", alignItems: "center"}}>
                    <Button color="secondary" href='/'>Accueil</Button>
                    <SwitchModeButton/>
                </Box>
            </AppBar>
        </Box>
    )
}