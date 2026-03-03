import { wait } from '@testing-library/user-event/dist/utils';
import axios from 'axios'; // libreria que nos permite hacer peticiones http

const URL = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary';

export const getPlacesData = async (sw, ne) => {
    try {
        const { data: { data } } = await axios.get(URL, {
          params: {
            bl_latitude: sw.lat,
            tr_latitude: ne.lat,
            bl_longitude: sw.lng,
            tr_longitude: ne.lng,
          },
          headers: {
            'x-rapidapi-key': '84c37f9881msh960f92c4d4a8dbbp12173cjsn5b399c110d97',
            'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
          }
        });

        return data;
    } catch (error) {
        console.log(error);
    }
}