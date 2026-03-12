import { wait } from '@testing-library/user-event/dist/utils';
import axios from 'axios'; // libreria que nos permite hacer peticiones http

// hola, probando si puedo hacer commmit

export const getPlacesData = async (type, sw, ne) => {
    try {
        const { data: { data } } = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
          params: {
            bl_latitude: sw.lat,
            tr_latitude: ne.lat,
            bl_longitude: sw.lng,
            tr_longitude: ne.lng,
          },
          headers: {
            'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TRAVEL_API_KEY,
            'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
          }
        });

        return data;
    } catch (error) {
        console.log(error);
    }
}

export const getWeatherData = async (lat, lng) => {
    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
                lat: lat,
                lon: lng,
                appid: process.env.REACT_APP_OPENWEATHERMAP_API_KEY,
                units: 'metric', // 🌡️ Magia extra: esto hace que la temperatura venga en Celsius
          }
        }); 
        return data;
    } catch (error) {
        console.log('Error buscando clima:', error);
        return null;
    }
}