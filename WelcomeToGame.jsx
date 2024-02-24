//WelcomeToGame.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Pressable, TouchableOpacity, SafeAreaView, StyleSheet, Image, BackHandler, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { app } from "./firebaseConfig"
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import MusicImage from './assets/music.png';
import Constants from 'expo-constants';

const Welcome = () => {
    const [roundsNumber, setRoundsNumber] = useState(0)
    const [disableBeginRound1, setDisableBeginRound1] = useState(true)
    const [participantsNumber, setParticipantsNumber] = useState(0)
    const [onlinePlayers, setOnlinePlayers] = useState([])
    const gameName = useSelector((state) => state.gameToPlay.nameOfGamePlaying);
    const individualUser = useSelector((state) => state.userThings.userName);
    const gameCode = useSelector((state) => state.gameToPlay.nameOfCode);
    const userEmail = useSelector((state) => state.userThings.userEmail);
    const firestore = getFirestore(app);
    const navigation = useNavigation();

    //console.log(onlinePlayers.length + " online players")
    //console.log(participantsNumber + " participants number")

    useEffect(() => {
        if (participantsNumber === onlinePlayers.length && participantsNumber > 0) {
            setDisableBeginRound1(false)
        }
    }, [onlinePlayers])

    async function getTotalParticipantsAndRounds() {
        try {
            const specificDocRef = doc(firestore, `${gameCode}/gameDetails`)
            const snapshot = await getDoc(specificDocRef);
            if (snapshot.exists()) {
                const data = snapshot.data();
                //console.log(data);
                const participantsNumber = data.participantsNumber;
                const roundsNumber = data.rounds;
                setParticipantsNumber(participantsNumber);
                setRoundsNumber(roundsNumber);
            } else {
                console.log('Document does not exist.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    getTotalParticipantsAndRounds()

    useEffect(() => {
        const handleBackButton = () => {
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);


    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(firestore, `${gameCode}/onlinePlayers/trackingOnlinePlayers`),
            (querySnapshot) => {
                let updatedOnlinePlayers = [];
                querySnapshot.forEach((doc) => {
                    const eachItem = doc.data();
                    if (eachItem.online) {
                        updatedOnlinePlayers.push(eachItem.userName);
                    }
                });
                setOnlinePlayers(updatedOnlinePlayers);
            }
        );
        return () => unsubscribe();
    }, []);


    async function leaveGame() {
        console.log("hello")
        try {
            console.log('leave game')
            console.log("individualEmail is " + userEmail)
            console.log("gameCode is " + gameCode)
            navigation.navigate('Main');

            const theDocument = doc(firestore, `${gameCode}/onlinePlayers/trackingOnlinePlayers/${userEmail}`);
            const snapshot = await getDoc(theDocument);
            if (snapshot.exists()) {
                //console.log(snapshot.data());
                const theData = snapshot.data();
                console.log(theData.online);
                const updatedData = { online: false };
                await updateDoc(theDocument, updatedData);
            } else {
                console.log('Document does not exist.');
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }


    async function goOnline() {
        //console.log("useEffect")
        try {
            const theDocument = doc(firestore, `${gameCode}/onlinePlayers/trackingOnlinePlayers/${userEmail}`);
            const snapshot = await getDoc(theDocument);
            if (snapshot.exists()) {
                //console.log(snapshot.data());
                const theData = snapshot.data();
                ///console.log(theData.online);
                const updatedData = { online: true };
                await updateDoc(theDocument, updatedData);
            } else {
                console.log('Document does not exist.');
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    useEffect(() => {
        goOnline();
    }, []);



    function goToRound1() {
        console.log("goToRound1")
        console.log(participantsNumber)
        console.log(onlinePlayers)
        navigation.navigate("Go to Round 1", {
            screen: "NestedRound1",
            params: {}
        })
    }

    const theButtonStyle = {
        backgroundColor: disableBeginRound1 ? 'grey' : 'blue',
        padding: 15,
        borderRadius: 8,
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'pink', paddingTop: Constants.statusBarHeight }}>
        <View style={{ flex: 1 }}>
                        <Text style={{ marginTop: 40, fontFamily: 'TINTIN', fontSize: 34, textAlign: 'center', padding : 10 }}>RUBRIKAL SONG CONTEST</Text>


                        <Text style={{ fontFamily: 'RobotoCondensed', marginTop: 10, fontSize: 20, color: 'red', left: 10 }}>
    <Text style={{ color: 'blue' }}>{individualUser}</Text> are you ready?
</Text>


 <View style={{ flex: 1, marginTop : 10, alignItems: 'center', fontSize: 24 }}>

 <Text style={{ fontSize: 24, color: '#FF5733', fontWeight: 'bold' }}>{gameName}</Text>

            <Text style={{ fontSize: 18, marginBottom: 10, marginTop: 15,  marginHorizontal: 15}}>
                Expecting  {participantsNumber} players.
                The following are now online:
            </Text>

            <View style={{ alignItems: 'center' }}>
                {onlinePlayers.map((player, index) => (
                    <Text key={index} style={{ fontSize: 24, marginVertical: 5 }}>
                        {player}
                    </Text>
                ))}
            </View>

            <View>
            <TouchableOpacity
            onPress={() => {
                goToRound1(); // Call the function here
            }}
            style={theButtonStyle}
            disabled={disableBeginRound1}
        >
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>
                Begin Round 1
            </Text>
        </TouchableOpacity>
            </View>
            </View>

            <Image source={MusicImage} style={styles.theImage}   />




<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
                style={{
                    backgroundColor: 'blue',
                    padding: 10,
                    borderRadius: 5,
                    position: 'absolute',
                    bottom: 20,
                    
                }}
                onPress={() => {
                    { leaveGame() }
                }}>
                <Text style={{ color: 'white' }}>Leave Game</Text>
            </TouchableOpacity>
           </View>
        </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    theImage: {
        bottom: '12%',
        width:75,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 10,
        position: 'absolute',
        justifyContent: 'center',
        alignSelf: 'center',
      },
      
    })
    

export default Welcome;

