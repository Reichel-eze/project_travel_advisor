import React, { useState, useEffect, useRef } from "react";
import { AppBar, Toolbar, Typography, InputBase, Box, alpha, Paper, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Header = ({ setSearchedLocation }) => {
    const [searchInput, setSearchInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceTimer = useRef(null);

    // Función para buscar lugares usando Photon (gratuito, CORS habilitado, sin API key)
    const searchPlace = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsLoading(true);
        setShowSuggestions(true);
        
        try {
            // Photon es un servicio gratuito basado en OpenStreetMap
            // Permite CORS y no requiere API key
            const response = await fetch(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
            );
            const data = await response.json();
            
            // Transformar respuesta de Photon al formato que usamos
            const formattedResults = data.features?.map(feature => {
                const props = feature.properties;
                let name = props.name || '';
                
                // Construir nombre descriptivo con ciudad/país
                if (props.city) name += `, ${props.city}`;
                if (props.country) name += `, ${props.country}`;
                
                return {
                    display_name: name,
                    lat: feature.geometry.coordinates[1],
                    lon: feature.geometry.coordinates[0],
                };
            }) || [];
            
            setSuggestions(formattedResults);
        } catch (error) {
            console.error("Error searching places:", error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce: esperar 500ms después de que el usuario deje de escribir
    useEffect(() => {
        // Limpiar timer anterior
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Crear nuevo timer
        debounceTimer.current = setTimeout(() => {
            searchPlace(searchInput);
        }, 500);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchInput]);

    // Manejar el cambio en el input
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        // El debounce se encarga de llamar a searchPlace
    };

    // Manejar la selección de una sugerencia
    const handleSelectPlace = (place) => {
        setSearchedLocation({
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon),
        });
        setSearchInput(place.display_name);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{
                display: "flex",
                justifyContent: "space-between",
            }}>
                <Typography 
                    variant="h5" 
                    sx={{
                        display: 'none',
                        '@media (min-width: 600px)': {
                            display: 'block',
                        },
                    }}
                >
                    Travel Advisor
                </Typography>
                <Box display="flex" sx={{ gap: 2, alignItems: 'center' }}>
                    <Typography 
                        variant="h6" 
                        sx={{
                            display: 'none',
                            '@media (min-width: 600px)': {
                                display: 'block',
                            },
                        }}
                    >
                        Explore new places
                    </Typography>
                    <Box sx={{
                        position: 'relative',
                        borderRadius: 1,
                        backgroundColor: alpha('#fff', 0.15),
                        '&:hover': { backgroundColor: alpha('#fff', 0.25) },
                        width: '100%',
                        '@media (min-width: 600px)': { width: 'auto' },
                    }}>
                        <Box sx={{
                            padding: 1,
                            height: '100%',
                            position: 'absolute',
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <SearchIcon />
                        </Box>
                        <InputBase 
                            placeholder="Search location..."
                            value={searchInput}
                            onChange={handleInputChange}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            sx={{
                                color: 'inherit',
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    padding: 1,
                                    paddingLeft: (theme) => `calc(1em + ${theme.spacing(4)})`,
                                    transition: (theme) => theme.transitions.create('width'),
                                    width: '100%',
                                    '@media (min-width: 960px)': { width: '20ch' },
                                },
                            }}
                        />
                        
                        {/* Panel de sugerencias */}
                        {showSuggestions && (
                            <Paper sx={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                marginTop: 1,
                                zIndex: 1000,
                                maxHeight: '300px',
                                overflow: 'auto',
                            }}>
                                {isLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                ) : suggestions.length > 0 ? (
                                    <List disablePadding>
                                        {suggestions.map((suggestion, index) => (
                                            <ListItem
                                                key={index}
                                                button
                                                onClick={() => handleSelectPlace(suggestion)}
                                                sx={{
                                                    '&:hover': { backgroundColor: alpha('#000', 0.05) },
                                                    padding: '8px 16px',
                                                }}
                                            >
                                                <ListItemText
                                                    primary={suggestion.display_name}
                                                    primaryTypographyProps={{ variant: 'body2' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Box sx={{ padding: 2 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            No results found
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        )}
                    </Box>
                </Box>
            </Toolbar>    
        </AppBar>
    );
}

export default Header;