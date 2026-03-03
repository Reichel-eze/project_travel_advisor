import React, { useState, useEffect } from "react";
import { CssBaseline, Grid, ThemeProvider, createTheme, Box } from "@mui/material";

import { getPlacesData } from "./api";

import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import PlaceDetails from "./components/PlaceDetails/PlaceDetails";

const theme = createTheme();

const App = () => {

    const [places, setPlaces] = useState([]);

    const [coordinates, setCoordinates] = useState({}); // Coordenadas del centro del mapa
    const [bounds, setBounds] = useState(null);         // Límites del mapa para filtrar los lugares

    useEffect(() => {
        // Obtener la ubicación actual del usuario al cargar la aplicación
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude });
        });
    }, []);

    useEffect(() => {
        console.log(coordinates, bounds); // Verificar que las coordenadas y los límites se actualizan correctamente
        
        getPlacesData()
            .then((data) => {
                console.log(data);
                setPlaces(data);
            })
    }, [coordinates, bounds]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
                <Box sx={{ flex: "0 0 33.333%", overflow: "auto", borderRight: "1px solid #e0e0e0" }}>
                    <List />
                </Box>
                <Box sx={{ flex: "1", overflow: "hidden" }}>
                    <Map 
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                    />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;