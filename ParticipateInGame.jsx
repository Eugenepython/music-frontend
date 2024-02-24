//ParticipateInGame.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Pressable, SafeAreaView, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { app } from "./firebaseConfig"
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { setGameToPlay, nameOfTheCode } from './actions/gamePlayingActions';
import firebase from 'firebase/app';
import 'firebase/firestore';
import MusicImage from './assets/myNotes.png';
import Constants from 'expo-constants';



const HeavensAbove = () => {
    const [rejection, setRejection] = useState('')
    const [message, setMessage] = useState('')
    const emailId = useSelector((state) => state.userThings.userEmail);
    const userName = useSelector((state) => state.userThings.userName);
    const [inputText, setInputText] = React.useState('');
    const [gameTitle, setGameTitle] = React.useState('')
    const [theCollection, setCollection] = useState('')
    const firestore = getFirestore(app);
    const navigation = useNavigation();
    const [gameCode, setGameCode] = useState('')

    const dispatch = useDispatch();

    const handleInputChange = (text) => {
        setInputText(text);
    }

    const handleButtonPress = async () => {
        const trimmedInput = inputText.trim();
        if (!trimmedInput) {
            console.error('Input is empty');
            return;
        }
        const collectionRef = collection(firestore, trimmedInput);
        try {
            const querySnapshot = await getDocs(collectionRef);
            if (querySnapshot.size === 0) {
                console.log('Collection does not exist');
                setMessage('Code does not match any existing games')
                setGameTitle('')
                return;
            }
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            console.log('Documents in collection:', documents);
            console.log(documents[0].data.gameCode)
            setGameCode(documents[0].data.gameCode)
            console.log(documents[0].data.gameTitle + "asflkjdsafjsadlkfjdsaf!!!!!!!!!!!!!!!!!!!")
            for (let i = 0; i < documents.length; i++) {
                let obj = documents[i];

                if (obj.data.gameCode) {
                    console.log(obj.data.gameTitle)
                    setGameTitle(obj.data.gameTitle)
                }
            }
            setMessage('')
            setCollection(trimmedInput)

            return documents;
        } catch (error) {
            console.error('Error getting documents from collection:', error.message);
            return [];
        }
    };



    const proceedToGame = async () => {
        let participantsNumber
       // console.log('proceed to gamehu dsfafdsdsf')
      //  console.log(emailId + ' is the email address')
      //  console.log(userName + ' is the username')
       // console.log(theCollection + ' is the collection')
        dispatch(setGameToPlay(gameTitle));
        dispatch(nameOfTheCode(theCollection));
        const mainCollectionRef = collection(firestore, theCollection);
        const onlinePlayersDocRef = doc(mainCollectionRef, 'onlinePlayers');
        await setDoc(onlinePlayersDocRef, {});

        try {
            //const playerDocRef = doc(trackingOnlinePlayersCollectionRef, emailId);
            //const playerDocRef = doc(onlinePlayersDocRef, emailId);
            //const playerDocRef = doc(mainCollectionRef, emailId) //this creates a document
            const trackingOnlinePlayersCol = collection(onlinePlayersDocRef, 'trackingOnlinePlayers');
            const docRef = doc(firestore, `${gameCode}/gameDetails`);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                // Now you can access the data
                participantsNumber = data.participantsNumber;
                console.log(participantsNumber + ' is the number of participants')
              } else {
                console.log('Document does not exist');
              }
            const querySnapshot = await getDocs(trackingOnlinePlayersCol);
            const numberOfDocuments = querySnapshot.size;
            console.log('Number of documents in the subcollection:', numberOfDocuments);
            // this creates a collection within the document of onlinePlayers
            const playerDocRef = doc(trackingOnlinePlayersCol, emailId);  // this creates the document within te subcollection of trackingOnlinePlayers if it does not exist
            const playerDoc = await getDoc(playerDocRef); // this creates the document if it does not exist

            if (playerDoc.exists()) {
                console.log('Player with the same emailId already exists. Do not add a new one.');
                return;
            }
            console.log(participantsNumber + ' is the number of participants')
            console.log(numberOfDocuments + ' is the number of documents')
            
            if (numberOfDocuments + 1 <= participantsNumber) {
                                console.log('all allowed in?????????????????????????????????????????????????????');
            await setDoc(playerDocRef, {
                emailId: emailId,
                userName: userName,
                online: true,
                orderNumber: numberOfDocuments + 1,
            });
            console.log('Player document added with ID:', playerDocRef.id);
            navigation.navigate("Go to welcome", {
                screen: "NestedWelcomeAll",
                params: {}
            })
        } else {
            console.log('No more players allowed');
            setRejection("All player positions filled")
            // navigate somewhere else to show that no more players are allowed
            return;
        }

        } catch (error) {
            console.error('Error adding player document:', error.message);
        }
    };



    return (
        <SafeAreaView style={styles.container}>
        <Text style={{ fontFamily: 'TINTIN', fontSize: 34, top: '5%', textAlign: 'center', position: 'absolute',}}>RUBRIKAL SONG CONTEST</Text>
        <View style={{ flex: 1,  alignItems: 'center' }}>
        
            <TextInput
                style={{
                    height: 100,
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 10,
                    paddingHorizontal: 8,
                    marginTop: 100,
                    fontSize: 28,
                    textAlign: 'center',
                }}
                placeholder="Type the code in here"
                onChangeText={handleInputChange}
                value={inputText}
            />
       <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <TouchableOpacity onPress={handleButtonPress} style={{ padding: 10, backgroundColor: 'blue', borderRadius: 10}}>
                <Text style={{ fontSize: 24, textAlign: 'center', color : 'white' }}>Submit</Text>
            </TouchableOpacity>
        </View>

            {gameTitle &&
                <View>
             <Text style={{ fontSize: 36, fontWeight: 'bold', marginTop: 20, color: 'blue', textAlign: 'center'}}>
    {gameTitle}
</Text>

                    <Pressable
                        style={({ pressed }) => [
                            {
                                backgroundColor: pressed ? '#2E3B4E' : '#4CAF50',
                                borderRadius: 8,
                                padding: 10,
                                marginTop: 20,
                                marginBottom: 40,
                            },
                            pressed ? { opacity: 0.8 } : null
                        ]}
                        onPress={() => proceedToGame()}
                    >
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', padding : 10, textAlign: 'center' }}>
                            Join Game
                        </Text>
                    </Pressable>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, color: 'blue', textAlign: 'center'}}>{rejection}</Text>
                </View>
            }
            <View style={{marginBottom: 30}} >
     <Text style={{marginBottom: 30, fontSize: 28, fontWeight: 'bold', marginTop: 20, color: 'red', textAlign: 'center', fontStyle: 'italic', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 }}>
    {message}
</Text>
</View>
<Image source={MusicImage} style={styles.secondBottomImage} />
        </View>
       

        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor:  '#FFB6C1',
          alignItems: "center",
          justifyContent: "center",
          paddingTop: Constants.statusBarHeight
        },
firstContainer: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: 'orange',
},
secondBottomImage: {
    marginTop: 10,
    bottom: '10%',
    width: 170,
    height: 150,
    //resizeMode: 'cover',
    borderRadius: 10,
    //justifyContent: 'center',
    alignSelf: 'center',
  }
})


export default HeavensAbove;
