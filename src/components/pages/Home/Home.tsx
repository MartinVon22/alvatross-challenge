import { useEffect, useState } from 'react';
import { Plant } from '../../../core/models/plant';
import { Room } from '../../../core/models/room';
import {createRoom, getPlants, getRooms} from '../../../core/services/roomsService';
import { Loader } from '../../../shared/components/Loader/Loader';
import './Home.css';

export const Home = () => {

    const [plants, setPlants] = useState<Plant[]>();
    const [plantSelected, setPlantSelected] = useState<Plant>();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [activeCreateRoomPage, setActiveCreateRoomPage] = useState(false);
    const [creatingRoomStep, setCreatingRoomStep] = useState(0);
    const [countRedirectPage, setCountRedirectPage] = useState(3);

    /* states for new rooms  */
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomMaximumCapacity, setNewRoomMaximumCapacity] = useState('');
    const [newRoomOcupation, setNewRoomOcupation] = useState('');

    useEffect(() => {
        getPlants().then((res) => {
            if (res.status === 200) {
                setPlants(res.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }, [])

    useEffect(() => {

        if (creatingRoomStep === 2) {
            let count = 3;
            let interval = setInterval(() => {
                count--;
                setCountRedirectPage((currentCountRedirectPage) => --currentCountRedirectPage); // Por alguna razón esto solo se actualiza para la vista pero si quiero hacer esto: countRedirectPage === 0 el valor siempre es 3.
    
                // Entonces prefiero usar un state para que se muestre el conteo en la vista y usar una variable local que se reste y hacer la comprobación con la misma.
                if (count === 0) {
                    clearInterval(interval);
                    setActiveCreateRoomPage(false);
                    setCreatingRoomStep(0);
                    setCountRedirectPage(3);
                }    
            }, 1000);
        }    
    }, [creatingRoomStep])

    const handleChange = (e: any) => {
        setRooms([]);
        setPlantSelected(undefined);
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
            setRooms([]);
            setPlantSelected(undefined);
        }
    }

    const handleCreateRoom = () => {
        if (plantSelected) {
            setCreatingRoomStep(1);
            createRoom(plantSelected?.id).then(res => {
                if (res.status === 201) {

                    let newRoom: Room = {
                        name: newRoomName,
                        maximumCapacity: Number(newRoomMaximumCapacity),
                        ocupation: Number(newRoomOcupation)
                    }

                    setRooms(current => [...current, newRoom]);

                    setCreatingRoomStep(2);
                }
            }).catch(err => {
                console.log(err);
                setCreatingRoomStep(0);
            })
        }

    }

    return (
        <>
            {!activeCreateRoomPage && (
                <div className="homeContainer">

                        <>
                            <div className="header">
                                <h1 style={{ color: '#2E344D' }}>Salas</h1>
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
                                                <button className="btn btn-create" onClick={() => setActiveCreateRoomPage(!activeCreateRoomPage)}>Añadir sala</button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {rooms.length !== 0 && rooms.map((room) => (
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
                                {rooms.length === 0 && !roomsLoading && (
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
                        </>
                </div>
            )}
            {activeCreateRoomPage && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <div className="room" style={{ height: '50%' }}>
                        <h4 style={{ marginLeft: '20px', color: '#2E344D' }}>Agregar nueva sala a la Planta {plantSelected?.id}</h4>

                        <div className="informationRoom">
                            <div>
                                <h5 style={{ color: '#2E344D' }}>Nombre de la Sala</h5>
                                <input type="text" name="maximumCapacity" placeholder='Ingrese un Nombre' onKeyUp={(e) => setNewRoomName(e.currentTarget.value)} style={{ width: '130px' }}/>
                            </div>
                            <div>
                                <h5 style={{ color: '#2E344D' }}>Capacidad máxima</h5>
                                <input type="number" name="ocupation" placeholder='Ingrese un valor' onKeyUp={(e) => setNewRoomMaximumCapacity(e.currentTarget.value)} style={{ width: '130px' }}/>
                            </div>
                            <div>
                                <h5 style={{ color: '#2E344D' }}>Ocupación</h5>
                                <input type="number" name="ocupation" placeholder='Ingrese un valor' onKeyUp={(e) => setNewRoomOcupation(e.currentTarget.value)} style={{ width: '130px' }}/>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>

                            {creatingRoomStep === 1 && (
                                <div className="loadingContainer">
                                    <Loader />
                                    <p>Creando Sala...</p>
                                </div>
                            )}

                            {creatingRoomStep === 2 && (
                                <p>Sala Creada. Redireccionando en <strong>{countRedirectPage}</strong></p>
                            )}

                            {creatingRoomStep === 0 && (
                                <button className="btn" onClick={handleCreateRoom}>Crear sala</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}