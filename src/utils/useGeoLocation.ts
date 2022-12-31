import {useState, useEffect} from 'react';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';

type UseGeoLocationType = {
  getCurrentPosition: () => void;
  position: GeolocationResponse | null;
};

const useGeoLocation = (): UseGeoLocationType => {
  const [position, setPosition] = useState<GeolocationResponse | null>(null);

  const getCurrentPosition = () => {
    Geolocation.requestAuthorization(
      () => {
        Geolocation.getCurrentPosition(
          pos => {
            setPosition(pos);
          },
          () => {},
          {enableHighAccuracy: true},
        );
      },
      () => {},
    );
  };

  useEffect(getCurrentPosition, []);

  return {getCurrentPosition, position};
};

export default useGeoLocation;
