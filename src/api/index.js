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