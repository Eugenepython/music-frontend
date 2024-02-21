// HomeScreen.jsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';

const HomeScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home Screen</Text>
            <Pressable onPress={() => console.log('Hello')}>
                <Text>Press me</Text>
            </Pressable>
        </View>
    );
};

export default HomeScreen;

