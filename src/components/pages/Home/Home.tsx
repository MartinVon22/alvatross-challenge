import { useEffect, useState } from 'react';
import { Plant } from '../../../core/models/plant';
import { Room } from '../../../core/models/room';
import getPlants from '../../../core/services/roomsService';
import { Loader } from '../../../shared/components/Loader/Loader';
import './Home.css';

export const Home = () => {

    const [plants, setPlants] = useState<Plant[]>();
    const [plantSelected, setPlantSelected] = useState(0);
    const [rooms, setRooms] = useState<Room[]>();
    const [roomsLoading, setRoomsLoading] = useState(false);

    useEffect(() => {
        getPlants().then((res) => {
            if (res.status === 200) {
                setPlants(res.data);
            }
        })
    }, [])

    const handleChange = (e: any) => {
        setPlantSelected(e.target.value);
    }

    return (
        <div className="homeContainer">

                <div className="header">
                    <h1>Salas</h1>
                    {!plants && <p>Cargando listado de Plantas..</p>}
                    {plants && (
                        <select name="plantList" value={plantSelected} onChange={handleChange}>
                            <option value={0}>Seleccione una opción</option>
                            {plants.map((plant) => (
                                <option value={plant.id}>{ plant.name }</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="boxRooms">
                    {rooms && rooms.map((room) => (
                        <p>Seleccione una opción para visualizar las Salas disponibles.</p>        
                    ))}
                    {!rooms && (
                        <p style={{ textAlign: 'center' }}>Seleccione una Planta para visualizar las Salas disponibles de la misma.</p>
                    )}
                    {roomsLoading && <Loader />}
                </div>
        </div>
    )
}