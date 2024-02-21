// NewGameScreen.jsx
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Text, Pressable, Alert, View, ScrollView, } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const NewGameScreen = () => {



    const [number, onChangeNumber] = React.useState('');
    const [titleText, onChangeTitle] = React.useState('');
    const [players, setPlayers] = React.useState(0);
    const [isNextPressed, setIsNextPressed] = useState(false);
    const [isNameReady, setIsNameReady] = useState(false);
    const [isPlayersNumberReady, setIsPlayersNumberReady] = useState(false);
    const [gameName, setGameName] = useState('');
    const [numberOfPlayers, setNumberOfPlayers] = useState('');
    const [isRoundsReady, setIsRoundsReady] = useState(false);
    const [rounds, setRounds] = React.useState(0);
    const [numberOfRounds, setNumberOfRounds] = useState('');


    const navigation = useNavigation();

    const handleSubmit = () => {
        const isValid = /^[2-5]$/.test(numberOfPlayers);
        if (isValid) {
            setPlayers(numberOfPlayers);
            setNumberOfPlayers('');
            //onChangeNumber('');
            setIsPlayersNumberReady(true);
        } else {
            Alert.alert('Error', 'Please enter a valid number of players - max 5.');
        }
    };

    const handleTitle = () => {
        console.log("hlloe")
        console.log(titleText)
        setIsNameReady(true);
        setGameName(titleText);
        onChangeTitle('');
        console.log(gameName)
    };

    const goToNextPage = () => {
        navigation.navigate('Home');
    };



    const handleSubmitRounds = () => {
        const isValid = /^[2-5]$/.test(numberOfRounds);
        if (isValid) {
            setRounds(numberOfRounds)
            setNumberOfRounds('');
            //onChangeNumber('');
            setIsRoundsReady(true);
        } else {
            Alert.alert('Error', 'Please enter a valid number of rounds between 2 and 5 ');
        }
    };

    const goToEnteringEmailsScreen = () => {
        navigation.navigate("Email Invitations", {
            screen: "NestedEnteringEmailsScreen",
            params: { number: players, gameName: gameName, rounds: rounds }
        })
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'lightyellow' }}>
               <ScrollView  >
            <View style={{ marginTop: 40, marginLeft: 5, marginRight: 5}}>
            <Text style={{ fontFamily: 'TINTIN', fontSize: 34, textAlign: 'center', padding : 10 }}>RUBRIKAL SONG CONTEST</Text>

                <Text style={{ fontFamily: 'RobotoCondensed', fontSize: 18, marginTop: 8, margin: 2 }}>Give this game a group name</Text>

                <TextInput
                    style={styles.input}
                    onChangeText={onChangeTitle}
                    value={titleText}
                    placeholder="Game title"
                    keyboardType="default"
                />
                <Pressable
                    style={{
                        backgroundColor: 'lightgreen',
                        padding: 5,
                        borderRadius: 5,
                        alignSelf: 'center',
                        marginTop: 5,
                        marginBottom: 5,
                        fontSize: 18,
                    }}
                    onPress={handleTitle}
                >
                    <Text style={{ fontSize: 18}}>Set Name</Text>
                </Pressable>
                <View style={styles.centeredContainer}>
                    <Text style={styles.centeredText}>
                        <Text style={styles.boldText}>Game title:</Text>
                        {' '}
                        <Text style={styles.coolFontText}>{gameName}</Text>
                    </Text>

                </View>
                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 18, marginTop: 8, margin: 2 }}>How many players are there?</Text>

                    <TextInput
                        style={styles.input}
                        //onChangeText={onChangeNumber}
                        onChangeText={(text) => setNumberOfPlayers(text)}
                        //value={number}
                        value={numberOfPlayers}
                        placeholder="maximum 5 players"
                        keyboardType="numeric"
                    />
                    <Pressable
                        style={{
                            backgroundColor: 'lightgreen',
                            padding: 5,
                            borderRadius: 5,
                            alignSelf: 'center',
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                        onPress={handleSubmit}
                    >
                        <Text style={{ fontSize: 18}}>Confirm no of players</Text>
                    </Pressable>
                    <View style={styles.centeredContainer}>
                        <Text style={styles.centeredText}>
                            <Text style={styles.coolFontText}> {players}</Text>
                            {' '}
                            <Text style={styles.boldText}>Players</Text>

                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 18, marginTop: 8, margin: 2 }}>Choose number of rounds 2 - 5</Text>

                    <TextInput
                        style={styles.input}
                        //onChangeText={onChangeNumber}
                        onChangeText={(text) => setNumberOfRounds(text)}
                        //value={number}
                        value={numberOfRounds}
                        placeholder="max 5, min 2"
                        keyboardType="numeric"
                    />
                    <Pressable
                        style={{
                            backgroundColor: 'lightgreen',
                            padding: 5,
                            borderRadius: 5,
                            alignSelf: 'center',
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                        onPress={handleSubmitRounds}
                    >
                        <Text style={{ fontSize: 18}}>Confirm no of rounds</Text>
                    </Pressable>
                    <View style={styles.centeredContainer}>
                        <Text style={styles.centeredText}>
                            <Text style={styles.coolFontText}> {rounds}</Text>
                            {' '}
                            <Text style={styles.boldText}>Rounds</Text>
                        </Text>
                    </View>
                </View>


                {isNameReady && isPlayersNumberReady && isRoundsReady && (
                    <Pressable
                        onPress={goToEnteringEmailsScreen}
                        style={{
                            backgroundColor: 'darkblue',
                            padding: 10,
                            borderRadius: 5,
                            alignSelf: 'center',
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                    >
                        <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Confirm and Continue</Text>

                    </Pressable>
                )}
            </View>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    input: {
        height: 50,
        margin: 2,
        borderWidth: 1,
        padding: 10,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 18,
    },
    centeredContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginBottom: 20,
    },
    centeredText: {
        textAlign: 'center',
    },
    centeredText: {
        textAlign: 'center',
        fontSize: 18,
    },
    boldText: {
        fontWeight: 'bold',
    },
    coolFontText: {
        color: 'purple',
        fontWeight: 'bold',
    },
});


export default NewGameScreen;

