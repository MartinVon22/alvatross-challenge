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

export function createRoom(plantId: number) {
    return axios.post<Room>(`${URL_ENDPOINT}/plant/${plantId}/room`);
}

export function updateRoom(roomId: number) {
    return axios.put<Room>(`${URL_ENDPOINT}/room/${roomId}`);
}