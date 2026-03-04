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
    const [filteredPlaces, setFilteredPlaces] = useState([]); // Para almacenar los lugares filtrados por rating
    const [childClicked, setChildClicked] = useState(null); // Para saber qué lugar se ha clickeado en el mapa

    const [coordinates, setCoordinates] = useState({}); // Coordenadas del centro del mapa
    const [bounds, setBounds] = useState({});         // Límites del mapa para filtrar los lugares

    const [isLoading, setIsLoading] = useState(false);   // Para mostrar un spinner mientras cargan los datos

    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');


    // Este useEffect se ejecutará solo una vez al cargar la aplicación para obtener la ubicación del usuario
    useEffect(() => {
        // Obtener la ubicación actual del usuario al cargar la aplicación
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude });
        });
    }, []);

    // Este useEffect se ejecutará cada vez que cambie el rating O los lugares
    useEffect(() => {
        // ESCUDO: El signo '?' evita que la app explote si places es undefined.
        // También usamos Number() para asegurarnos de comparar números matemáticamente.
        const filtered = places?.filter((place) => Number(place.rating) > rating);
        
        // Si por algún motivo 'filtered' queda undefined, mandamos un arreglo vacío '[]'
        setFilteredPlaces(filtered || []);
    }, [rating, places]); // <-- Faltaba agregar 'places' a las dependencias


    // Este useEffect se ejecutará cada vez que cambie el tipo de lugar, las coordenadas o los límites del mapa
    useEffect(() => {
        // ESCUDO: Solo ejecutamos la búsqueda si bounds existe y tiene las esquinas
        if (bounds && bounds.sw && bounds.ne) {
            console.log(coordinates, bounds); 
            
            setIsLoading(true); // Empezamos a cargar los datos
            getPlacesData(type, bounds.sw, bounds.ne)
                .then((data) => {
                    console.log(data);
                    setPlaces(data);
                    setFilteredPlaces([]); // Limpiamos los lugares filtrados al cargar nuevos datos
                    setIsLoading(false); // Terminamos de cargar los datos
                })
        }
    }, [type, coordinates, bounds]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
                <Box sx={{ flex: "0 0 33.333%", overflow: "auto", borderRight: "1px solid #e0e0e0" }}>
                    <List 
                        places={filteredPlaces.length ? filteredPlaces : places} // Si hay lugares filtrados, los mostramos; si no, mostramos todos
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    /> 
                </Box>
                <Box sx={{ flex: "1", overflow: "hidden" }}>
                    <Map 
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredPlaces.length ? filteredPlaces : places} // Si hay lugares filtrados, los mostramos; si no, mostramos todos
                        setChildClicked={setChildClicked}
                    />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;