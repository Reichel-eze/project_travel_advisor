import React, { useEffect, useRef } from "react";
// 1. Importamos useMapEvents y useMap
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocationOnOutlined } from "@mui/icons-material";
import { Paper, Typography, useMediaQuery } from "@mui/material";
import Rating from "@mui/material/Rating";

import useStyles from './styles.js';

// Corregir el icono por defecto de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// 2. Creamos este nuevo componente que actualiza el centro del mapa solo con cambios significativos
const MapUpdater = ({ coordinates }) => {
    const map = useMap();
    const prevCoordinates = useRef(null);

    useEffect(() => {
        if (coordinates && coordinates.lat && coordinates.lng) {
            // Calcular la distancia desde la posición anterior
            let shouldUpdate = false;
            
            if (!prevCoordinates.current) {
                shouldUpdate = true; // Primera vez
            } else {
                // Calcular distancia aproximada (en grados, diferencia > 0.1 es significativa)
                const latDiff = Math.abs(coordinates.lat - prevCoordinates.current.lat);
                const lngDiff = Math.abs(coordinates.lng - prevCoordinates.current.lng);
                
                // Solo actualizar si la distancia es mayor a 0.1 grados (~11km)
                shouldUpdate = latDiff > 0.1 || lngDiff > 0.1;
            }
            
            if (shouldUpdate) {
                prevCoordinates.current = coordinates;
                // flyTo anima el movimiento hacia las nuevas coordenadas
                map.flyTo([coordinates.lat, coordinates.lng], 13, {
                    duration: 2 // segundos
                });
            }
        }
    }, [coordinates, map]);

    return null; // No renderiza nada visual
};

// 4. Creamos un componente para mostrar el clima como widget flotante
const WeatherWidget = ({ weatherData }) => {
    const map = useMap();

    // Crea un control personalizado en la esquina superior derecha
    useEffect(() => {
        if (!weatherData || !weatherData.weather) return;

        // Crear un elemento HTML personalizado para el widget
        const weatherControl = L.control({ position: 'topright' });

        weatherControl.onAdd = (map) => {
            const div = L.DomUtil.create('div', 'weather-widget');
            div.style.backgroundColor = 'white';
            div.style.padding = '12px';
            div.style.borderRadius = '8px';
            div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            div.style.textAlign = 'center';
            div.style.fontFamily = 'Arial, sans-serif';
            div.style.minWidth = '120px';

            div.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 4px; font-size: 18px;">${Math.round(weatherData.main.temp)}°C</div>
                <div style="font-size: 12px; color: #666; margin-bottom: 8px; text-transform: capitalize;">
                    ${weatherData.weather[0].description}
                </div>
                <img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="weather" style="width: 80px; height: 80px;" />
            `;

            // Prevenir que los clicks en el widget afecten al mapa
            L.DomEvent.disableClickPropagation(div);

            return div;
        };

        weatherControl.addTo(map);

        return () => {
            weatherControl.remove();
        };
    }, [weatherData, map]);

    return null;
};
const MapEvents = ({ setCoordinates, setBounds }) => {
    useMapEvents({
        moveend: (e) => {
            const map = e.target;
            
            // Replicamos el comportamiento de setCoordinates del tutorial
            const center = map.getCenter();
            setCoordinates({ lat: center.lat, lng: center.lng });
            
            // Replicamos el comportamiento de setBounds del tutorial
            const bounds = map.getBounds();
            setBounds({
                ne: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
                sw: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng },
            });
        }
    });
    return null; // No renderiza nada visual, solo trabaja en segundo plano
};

const Map = ({ setCoordinates, setBounds, coordinates, places, setChildClicked, weatherData }) => {
    const zoom = 13;
    const isDesktop = useMediaQuery('(min-width:600px)');
    const classes = useStyles();

    // 🛡️ EL ESCUDO: Si el objeto está vacío (no tiene latitud), mostramos un texto de carga
    if (!coordinates || coordinates.lat === undefined) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <p>Calculando tu ubicación...</p>
            </div>
        );
    }

    // Si ya tenemos la latitud, dibujamos el mapa de Leaflet
    return (
        <MapContainer
            center={coordinates}
            zoom={zoom}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* 4. Insertamos nuestro actualizador de coordenadas dentro del MapContainer */}
            <MapUpdater coordinates={coordinates} />
            
            {/* 5. Insertamos nuestro detector de eventos dentro del MapContainer */}
            <MapEvents setCoordinates={setCoordinates} setBounds={setBounds} />
            
            {/* 6. Insertamos el widget del clima */}
            <WeatherWidget weatherData={weatherData} />

            <Marker position={coordinates}>
                <Popup>
                    <Typography variant="subtitle2">
                        Tu ubicación
                    </Typography>
                </Popup>
            </Marker>

            {/* Iteramos sobre los lugares de RapidAPI */}
            {places?.map((place, i) => {
                // 🛡️ ESCUDO DE SEGURIDAD: A veces la API devuelve lugares "basura" sin coordenadas. 
                // Si no filtramos esto, Leaflet explota al intentar leer un 'undefined'
                if (!place.latitude || !place.longitude) return null;

                return (
                    <Marker
                        key={i}
                        // Leaflet exige un array [latitud, longitud] con números reales
                        position={[Number(place.latitude), Number(place.longitude)]}
                        // 👇 Agregamos esta propiedad de Leaflet para detectar el clic
                        eventHandlers={{
                            click: () => {
                                setChildClicked(i);
                            },
                        }}
                    >
                        {/* El Popup es el globito que se abre al hacer clic en el marcador */}
                        <Popup>
                            {
                                !isDesktop ? (
                                    <Typography variant="subtitle2">{place.name}</Typography>
                                ) : (
                                    <Paper elevation={3} className={classes.paper}>
                                        <Typography className={classes.typography} variant="subtitle2" gutterBottom>
                                            {place.name}
                                        </Typography>
                                        <img
                                            className={classes.pointer}
                                            style={{ width: '100%' }} // Aseguramos que la foto no se desborde
                                            src={place.photo ? place.photo.images.large.url : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"}
                                            alt={place.name}
                                        />
                                        <Rating size="small" value={Number(place.rating)} readOnly />
                                    </Paper>
                                )
                            }
                        </Popup>
                    </Marker>
                );
            })}

        </MapContainer>
    );
}

export default Map;