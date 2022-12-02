import axios from 'axios';
import { Plant } from '../models/plant';
import { Room } from '../models/room';

const URL_ENDPOINT = "https://apimocha.com/alvatross-backend/";

export function getPlants() {
    return axios.get<Plant[]>(`${URL_ENDPOINT}/plants`);
}

export function getRooms(plantId: number) {
    return axios.get<Room[]>(`${URL_ENDPOINT}/plant/${plantId}/rooms`);
}