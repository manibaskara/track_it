import React from 'react';
import Summary from '../features/summary/Summary';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TaskScreen from '../features/tasks/TaskScreen';

const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Tasks" component={TaskScreen} />
    </HomeStack.Navigator>
  );
}

const SummaryStack = createNativeStackNavigator();

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
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Summary') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Summary" component={SummaryStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
