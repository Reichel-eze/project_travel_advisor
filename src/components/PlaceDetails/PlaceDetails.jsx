import React from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Chip, Rating } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

import useStyles from "./styles";

const PlaceDetails = ({ place }) => {
    
    const classes = useStyles();
    
    console.log(place);

    return (
        <Card elevation={6}>
            <CardMedia
                style={{ height: 350 }}
                image={place.photo ? place.photo.images.large.url : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"}
                title={place.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5">{place.name}</Typography>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1">Price</Typography>
                    <Typography gutterBottom variant="subtitle1">{place.price_level}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1">Ranking</Typography>
                    <Typography gutterBottom variant="subtitle1">{place.ranking}</Typography>
                </Box>
                
                {/* Mapeo de premios corregido y seguro */}
                {place?.awards?.map((award, index) => (
                    // 1. Agregamos el 'key' usando el nombre del premio o el índice
                    <Box key={index} my={1} display="flex" justifyContent="space-between" alignItems="center">
                        {/* 2. Agregamos el '?' a images por si la API no manda la foto del premio */}
                        <img src={award.images?.small} alt={award.display_name} />
                        <Typography variant="subtitle2" color="textSecondary">{award.display_name}</Typography>
                    </Box>
                ))}

                {/* El tipo/estilo de comida que tiene */}
                {place?.cuisine?.map(({ name }) => (
                    <Chip key={name} size="small" label={name} className={classes.chip} />
                ))}

                {/* La direccion */}
                {place?.address && (
                    <Typography gutterBottom variant="subtitle2" color="textSecondary" className={classes.subtitle}>
                        <LocationOnIcon /> {place.address}
                    </Typography>
                )}

                {/* El telefono */}
                {place?.phone && (
                    <Typography variant="subtitle2" color="textSecondary" className={classes.spacing}>
                        <PhoneIcon /> {place.phone}
                    </Typography>
                )}

                {/* Para ir al sitio web o trip advisor */}
                <CardActions>
                    <Button size="small" color="primary" onClick={() => window.open(place.web_url, "_blank")}>
                        Trip Advisor
                    </Button>
                    <Button size="small" color="primary" onClick={() => window.open(place.website, "_blank")}>
                        Website
                    </Button>
                </CardActions>
            </CardContent>
        </Card>
    );
}

export default PlaceDetails;