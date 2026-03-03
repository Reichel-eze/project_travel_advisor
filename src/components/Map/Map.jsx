import React from "react";
// 1. Importamos useMapEvents
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corregir el icono por defecto de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// 2. Creamos este nuevo componente que "escucha" al mapa
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

const Map = ({ setCoordinates, setBounds, coordinates }) => {
    const zoom = 13;

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
            
            {/* 3. Insertamos nuestro detector de eventos dentro del MapContainer */}
            <MapEvents setCoordinates={setCoordinates} setBounds={setBounds} />

            <Marker position={coordinates}>
                <Popup>
                    Ubicación actual
                </Popup>
            </Marker>
        </MapContainer>
    );
}

export default Map;