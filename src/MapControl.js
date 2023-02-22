
import { useMap } from 'react-leaflet';


function MapControl({markerA, markerB}) {
    const map = useMap();
    if (markerA === undefined ) {
        return null;
    }
    
    let posA = [markerA.lat, markerA.lng];
    let posB = [markerB.lat, markerB.lng];
  
    map.fitBounds([posA, posB], {
        padding: [50, 50]
    });
    return null
}

export default MapControl;