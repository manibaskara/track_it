import React from 'react';
import Summary from '../features/tasks/Summary';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TaskScreen from '../features/tasks/TaskScreen';
import {AppPrimaryColor} from '../components/constants';
import MapScreen from '../features/tasks/MapScreen';
import {HomeStackParamsList, SummaryStackParamsList} from './types';

const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator<HomeStackParamsList>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="Tasks">
      <HomeStack.Screen name="Tasks" component={TaskScreen} />
      <HomeStack.Screen name="Map" component={MapScreen} />
    </HomeStack.Navigator>
  );
}

const SummaryStack = createNativeStackNavigator<SummaryStackParamsList>();

function SummaryStackScreen() {
  return (
    <SummaryStack.Navigator>
      <SummaryStack.Screen name="TaskSummary" component={Summary} />
    </SummaryStack.Navigator>
  );
}

const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'ios-home' : 'ios-home-outline';
            } else {
              iconName = focused ? 'analytics' : 'analytics-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: AppPrimaryColor,
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Summary" component={SummaryStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
