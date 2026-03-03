import React from "react";
import { Automplete } from "@react-google-maps/api";
import { AppBar, Toolbar, Typography, InputBase, Box, alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Header = () => {

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
                <Box display="flex" sx={{ gap: 2 }}>
                    <Typography 
                        variant="h6" 
                        sx={{
                            display: 'none',
                            '@media (min-width: 600px)': {
                                display: 'block',
                            },
                        }}
                    >
                        Explorer new places
                    </Typography>
                    {/*<Autocomplete>*/}
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
                                placeholder="Search ..."
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
                        </Box>
                    {/*<Autocomplete>*/}
                </Box>
            </Toolbar>    
        </AppBar>

    );
}

export default Header;