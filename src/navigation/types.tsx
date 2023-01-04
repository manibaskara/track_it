import {GeolocationResponse} from '@react-native-community/geolocation';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';

export type HomeStackParamsList = {
  Tasks: undefined;
  Map: {location: GeolocationResponse};
};

export type SummaryStackParamsList = {
  TaskSummary: undefined;
};

export type MapScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamsList, 'Map'>;
  route: RouteProp<HomeStackParamsList, 'Map'>;
};
