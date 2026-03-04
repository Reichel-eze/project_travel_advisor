import React, { useState, useEffect, createRef } from "react";
import { CircularProgress, Typography, InputLabel, MenuItem, FormControl, Select, Box, Grid } from "@mui/material";
import PlaceDetails from "../PlaceDetails/PlaceDetails";

import useStyles from './styles.js';

const List = ({ places, childClicked, isLoading, type, setType, rating, setRating }) => {
    const classes = useStyles();
    const [elRefs, setElRefs] = useState([]);

    useEffect(() => {
        // 1. Agregamos "|| 0" como escudo de seguridad por si places está vacío
        const refs = Array(places?.length || 0).fill().map((_, i) => elRefs[i] || createRef());
        setElRefs(refs);
    }, [places]);

    return (
        <Box sx={{ padding: '25px' }}>
            {/* 1. Título - Primero y secuencial */}
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>Restaurants, Hotels & Attractions around you</Typography>
            
            {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                <>
            {/* 2. Contenedor de Filtros - SEPARADO y justo debajo del título */}
            <Box sx={{ display: 'flex', gap: '15px', marginBottom: 2, alignItems: 'center' }}>
                
                {/* Estilos de formControl actualizados y simplificados para variante standard */}
                <FormControl sx={{ minWidth: 120, flex: 1 }} variant="standard">
                    <InputLabel>Type</InputLabel>
                    <Select value={type} onChange={(e) => setType(e.target.value)}>
                        <MenuItem value="restaurants">Restaurants</MenuItem>
                        <MenuItem value="hotels">Hotels</MenuItem>
                        <MenuItem value="attractions">Attractions</MenuItem>
                    </Select>
                </FormControl>
                
                {/* Estilos de formControl actualizados y simplificados para variante standard */}
                <FormControl sx={{ minWidth: 120, flex: 1 }} variant="standard">
                    <InputLabel>Rating</InputLabel>
                    <Select value={rating} onChange={(e) => setRating(e.target.value)}>
                        <MenuItem value={0}>All</MenuItem>
                        <MenuItem value={3}>Above 3.0</MenuItem>
                        <MenuItem value={4}>Above 4.0</MenuItem>
                        <MenuItem value={4.5}>Above 4.5</MenuItem>
                        <MenuItem value={5}>5 Stars</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            
            {/* 3. Contenedor de la Lista - SEPARADO y al final, fuera del contenedor flexible */}
            <Grid container spacing={3} direction="column" wrap="nowrap" sx={{ height: '75vh', overflow: 'auto' }}>
                {places?.map((place, i) => (
                    <Grid item key={i}> 
                        <PlaceDetails 
                            place={place}
                            selected={Number(childClicked) === i}
                            refProp={elRefs[i]}
                        />
                    </Grid>
                ))}
            </Grid>
            </>
            )}
        </Box>
    );
}

export default List;