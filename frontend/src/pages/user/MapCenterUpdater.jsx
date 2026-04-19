import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapCenterUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
  }, [center, map]);
  return null;
};

export default MapCenterUpdater;