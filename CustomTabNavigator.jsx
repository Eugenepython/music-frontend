// CustomTabNavigator.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './App.js'; // Import your HomeScreen or adjust the import as needed

const Tab = createBottomTabNavigator();

const CustomTabNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
                tabBarLabel: 'Home',
                headerShown: false,
                tabBarVisible: false,

            }}
        />
        {/* Add more screens as needed */}
    </Tab.Navigator>
);

export default CustomTabNavigator;
