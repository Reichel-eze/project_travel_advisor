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
            'x-rapidapi-key': 'efebdf920dmsh5852510317600f6p153f2ajsnae004f5e3bf3',
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
                appid: '1b0078fec396085028120c9457384e6f',
                units: 'metric', // 🌡️ Magia extra: esto hace que la temperatura venga en Celsius
          }
        }); 
        return data;
    } catch (error) {
        console.log('Error buscando clima:', error);
        return null;
    }
}