import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import styles from './Map.module.css'
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import {useGeolocation} from "../hooks/useGeoLocation";
import Button from "./Button"
import { useUrlPosition } from '../hooks/useUrlPosition';


function Map() {
    const [mapLat, mapLng] = useUrlPosition()
    const [mapPosition, setMapPosition] = useState([28.57265730000353,77.21181353798227])
    const {cities} = useCities();
    const {
        isLoading: isLoadingPosition, 
        position:geolocationPosition, 
        getPosition
    } = useGeolocation();
    

    //this is called for DetectClick and unmount
    useEffect(function(){
        if(mapLat && mapLng) setMapPosition([mapLat,mapLng])
    }, [mapLat,mapLng])

    //this is called for Button component
    useEffect(function(){
        if(geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
    },[geolocationPosition])

    return (
        <div className={styles.mapContainer} 
            // onClick={()=>{navigate("form")}}
        >
            {!geolocationPosition && <Button onClick={getPosition} type="position"> {isLoadingPosition?"Loading..."
            :"use your position"} </Button>}
            <MapContainer center={mapPosition} zoom={5} scrollWheelZoom={true} className={styles.map}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" 
                />
                    {
                        cities.map( (city,i)=>(
                            <Marker position= {[city.position.lat, city.position.lng]} key={i}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker>
                        ))
                    }
                    <ChangePosition position={mapPosition}/>
                    <DetectClick />
        </MapContainer>
        </div>
    )
}

function ChangePosition({position}){
    const map = useMap()
    map.setView(position)
    return null;
}

function DetectClick(){
    const navigate = useNavigate();
    useMapEvent({
        click: e=> navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    })
}

export default Map
