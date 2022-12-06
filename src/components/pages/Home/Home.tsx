import { useEffect, useState } from 'react';
import { Plant } from '../../../core/models/plant';
import { Room } from '../../../core/models/room';
import {createRoom, getPlants, getRooms, updateRoom} from '../../../core/services/roomsService';
import { Alert } from '../../../shared/components/Alert/Alert';
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
    const [alertMsg, setAlertMsg] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [editingRoom, setEditingRoom] = useState(-1);

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

    useEffect(() => {

        if (showAlert) {
            setTimeout(() => {
                setAlertMsg('');
                setShowAlert(false);
            }, 2000)
        }

    }, [showAlert])

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

            if (newRoomName.length && Number(newRoomMaximumCapacity) !== 0 && Number(newRoomOcupation) !== 0) {
                setCreatingRoomStep(1);
                createRoom(plantSelected?.id).then(res => {
                    if (res.status === 201) {
    
                        let newRoom: Room = {
                            id: rooms[rooms.length - 1].id + 1,
                            name: newRoomName,
                            maximumCapacity: Number(newRoomMaximumCapacity),
                            ocupation: Number(newRoomOcupation)
                        }
    
                        setRooms(current => [...current, newRoom]);
                        setCreatingRoomStep(2);
                        setAlertMsg('');
                        setNewRoomOcupation('');
                        setNewRoomMaximumCapacity('');
                        setNewRoomName('');
                    }
                }).catch(err => {
                    console.log(err);
                    setCreatingRoomStep(0);
                    setAlertMsg('Ha ocurrido un error.');
                })
            } else {
                setAlertMsg('Has dejado campos sin completar.')
            }
        }
    }

    const handleModify = (room: Room) => {
        if (plantSelected) {
            if (room.name.length && Number(room.maximumCapacity) !== 0 && Number(room.ocupation) !== 0) {
                setEditingRoom(room.id);
                updateRoom(room.id).then((res) => {
                    if (res.status === 200) {
                        
                        let roomUpdated: Room = {
                            id: room.id,
                            name: room.name,
                            maximumCapacity: Number(room.maximumCapacity),
                            ocupation: Number(room.ocupation)
                        }

                        let idxToUpd = rooms.findIndex(r => r.id === room.id);
                        rooms[idxToUpd] = roomUpdated;

                        setShowAlert(true);
                        setAlertMsg('La Sala ha sido actualizada con éxito.');
                        setEditingRoom(-1);
                    }
                }).catch(err => {
                    console.log(err);
                    setAlertMsg('');
                    setShowAlert(true);
                    setAlertMsg('Ha ocurrido un error.');
                })
            } else {
                setShowAlert(true);
                setAlertMsg('Has dejado campos sin completar o hay valores en 0');
            }
        }
    }

    const goBack = () => {
        setActiveCreateRoomPage(false); 
        setShowAlert(false);
        setAlertMsg('');
    }

    return (
        <>
            {!activeCreateRoomPage && (
                <div className="homeContainer">
                        {!activeCreateRoomPage && showAlert && <Alert title={alertMsg} success={true}/>}
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
                                                    <input type="number" name="maximumCapacity" min={0} placeholder={`${room.maximumCapacity}`} defaultValue={room.maximumCapacity} onChange={e => room.maximumCapacity = Number(e.target.value)} style={{ width: '130px' }}/>
                                                </div>
                                                <div>
                                                    <h5 style={{ color: '#2E344D' }}>Ocupación</h5>
                                                    <span className='percent'>%</span>
                                                    <input type="number" name="ocupation" min={0} placeholder={`${room.ocupation} %`} defaultValue={room.ocupation} onChange={e => room.ocupation = Number(e.target.value)} style={{ width: '130px' }}/>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'end' }}>
                                                <button className="btn btn-modify" disabled={editingRoom === room.id} onClick={() => handleModify(room)}>{editingRoom === room.id ? 'Espere, por favor..' : 'Modificar'}</button>
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
                    <div className="room" style={{ height: '55%' }}>
                        <p style={{ textAlign: 'center', color: '#ff664d' }}>{activeCreateRoomPage && alertMsg.length !== 0 && alertMsg}</p>
                        <h4 style={{ marginLeft: '20px', color: '#2E344D' }}>Agregar nueva sala a la Planta {plantSelected?.id}</h4>

                        <div className="informationRoom">
                            <div>
                                <h5 style={{ color: '#2E344D' }}>Nombre de la Sala</h5>
                                <input type="text" name="maximumCapacity" placeholder='Ingrese un Nombre' onKeyUp={(e) => setNewRoomName(e.currentTarget.value)} style={{ width: '130px' }} required/>
                            </div>
                            <div>
                                <h5 style={{ color: '#2E344D' }}>Capacidad máxima</h5>
                                <input type="number" name="ocupation" min={1} placeholder='Ingrese un valor' onChange={(e) => setNewRoomMaximumCapacity(e.currentTarget.value)} style={{ width: '130px' }} required/>
                            </div>
                            <div>
                                <h5 style={{ color: '#2E344D' }}>Ocupación</h5>
                                <input type="number" name="ocupation" min={1} placeholder='Ingrese un valor' onChange={(e) => setNewRoomOcupation(e.currentTarget.value)} style={{ width: '130px' }} required/>
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
                                <>
                                    <div>
                                        <button className="btn" onClick={handleCreateRoom}>Crear sala</button>
                                        <p style={{ textAlign: 'center', lineHeight: '60px' }}>
                                            <a href='#' onClick={goBack} >Volver atrás</a>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}