import axios from 'axios';
import { Plant } from '../models/plant';

const URL_ENDPOINT = "https://apimocha.com/alvatross-backend/";

export default function getPlants() {
    return axios.get<Plant[]>(`${URL_ENDPOINT}/plants`);
}