import * as Location from "expo-location";
import { useEffect, useState } from 'react';
import { Alert, Text, View } from "react-native";
import MapView, { MapViewProps } from 'react-native-maps';
import { Colors } from "../constants/Colors";

type Coords = {
  latitude: number;
  longitude: number;
};

interface MapProps extends MapViewProps {
  error?: string;
}

export const Maps = ({error, ...props}: MapProps) => {
  const [currentLocation, setCurrentLocation] = useState<Coords | null>(null);

  const getMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Habilite a permissão para obter localização!");
      return;
    }
    const location = await Location.getCurrentPositionAsync();
    setCurrentLocation(location.coords);
  }

  useEffect(() => {
    getMyLocation();
  }, []);


  return (
    <View>
      <View
        style={{
          width: '100%',
          height: 200,
          overflow: 'hidden',
          borderColor: Colors.primary,
          borderRadius: 10,
          borderWidth: 1,
          backgroundColor: Colors.inputBackground,
        }}
      >
        {currentLocation && (
          <MapView
            {...props}
            style={{ flex: 1 }}
            showsUserLocation
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
          />
        )}
      </View>
      {error && <Text style={{ color: Colors.danger }}>{error}</Text>}
    </View>
  );
}