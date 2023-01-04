import React from 'react';
import {Platform, View, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import MapView from 'react-native-maps';
import {MapScreenProps} from '../../navigation/types';

const MapScreen: React.FC<MapScreenProps> = ({route}) => {
  const {latitude, longitude} = route?.params?.location?.coords;
  return (
    <>
      {Platform.OS === 'ios' ? (
        <MapView
          style={styles.container}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        />
      ) : (
        <View style={styles.container}>
          <Text style={styles.textStyle}>Latitude: {latitude}</Text>
          <Text style={styles.textStyle}>Longitude: {longitude}</Text>
          <Text style={styles.textStyle}>
            {'\n'}
            Not showing map because of unavailability of API_KEY for Google map
            API {'\n'}
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: 'center',
  },
  textStyle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
});

export default MapScreen;
