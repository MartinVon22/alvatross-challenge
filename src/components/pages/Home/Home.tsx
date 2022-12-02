import { useEffect, useState } from 'react';
import { Plant } from '../../../core/models/plant';
import { Room } from '../../../core/models/room';
import {getPlants, getRooms} from '../../../core/services/roomsService';
import { Loader } from '../../../shared/components/Loader/Loader';
import './Home.css';

export const Home = () => {

    const [plants, setPlants] = useState<Plant[]>();
    const [plantSelected, setPlantSelected] = useState<Plant>();
    const [rooms, setRooms] = useState<Room[]>();
    const [roomsLoading, setRoomsLoading] = useState(false);

    useEffect(() => {
        getPlants().then((res) => {
            if (res.status === 200) {
                setPlants(res.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }, [])

    const handleChange = (e: any) => {
        const plantId = Number(e.target.value);
        if (plantId !== 0) {
            setRoomsLoading(true);

            getRooms(plantId).then((res) => {
                if (res.status === 200) {
                    setRoomsLoading(false);
                    setRooms(res.data);
                    setPlantSelected(plants?.find(plant => plant.id === plantId));
                }
            }).catch(err => {
                console.log(err);
                setRoomsLoading(false);
                setPlantSelected(undefined);
            })

        } else {
            setRoomsLoading(false);
            setRooms(undefined);
            setPlantSelected(undefined);
        }
    }

    return (
        <div className="homeContainer">

                <div className="header">
                    <h1>Salas</h1>
                    {!plants && (
                        <>
                            <div className="loadingContainer">
                                <Loader />
                                <p>Cargando Plantas...</p>
                            </div>
                        </>
                    )}
                    {plants && (
                        <select name="plantList" onChange={handleChange} disabled={roomsLoading}>
                            <option value={0}>Seleccione una opción</option>
                            {plants.map((plant) => (
                                <option value={plant.id}>{ plant.name }</option>
                            ))}
                        </select>
                    )}
                    <hr style={{ margin: '20px 10px', border: '1px solid #f1f1f1' }}/>
                </div>
                <div className="boxRooms">
                    {plantSelected && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ marginLeft: '10px' }}>{plantSelected.name}</h4>
                                </div>
                                <div>
                                    <button className="btn btn-create">Añadir sala</button>
                                </div>
                            </div>
                        </>
                    )}

                    {rooms && rooms.map((room) => (
                        <>
                            <div className="room">
                                <h4 style={{ marginLeft: '20px', color: '#2E344D' }}>{room.name}</h4>

                                <div className="informationRoom">
                                    <div>
                                        <h5 style={{ color: '#2E344D' }}>Capacidad máxima</h5>
                                        <input type="text" name="maximumCapacity" placeholder={`${room.maximumCapacity}`} value={room.maximumCapacity} style={{ width: '130px' }}/>
                                    </div>
                                    <div>
                                        <h5 style={{ color: '#2E344D' }}>Ocupación</h5>
                                        <input type="text" name="ocupation" placeholder={`${room.ocupation} %`} value={`${room.ocupation} %`} style={{ width: '130px' }}/>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <button className="btn btn-modify">Modificar</button>
                                </div>
                            </div>            
                        </>
                    ))}
                    {!rooms && !roomsLoading && (
                        <p style={{ textAlign: 'center', fontFamily: 'Helvetica Bold' }}>Seleccione una Planta para visualizar las Salas disponibles de la misma.</p>
                    )}
                    {roomsLoading && (
                        <>
                            <div className="loadingContainer">
                                <Loader />
                                <p>Cargando Salas...</p>
                            </div>
                        </>
                    )}
                </div>
        </div>
    )
}