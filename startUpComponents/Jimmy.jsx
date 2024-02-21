
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, SafeAreaView, Button, BackHandler} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setGameName, setRandomString } from '../actions/codeActions';
import { useNavigation } from '@react-navigation/native';
import { app } from "../firebaseConfig"
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import MusicImage from '../assets/myNotes.png';
import * as Clipboard from 'expo-clipboard';
import { extra as expoConfigExtra } from "../expoConfig";





function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    //console.log(app)

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}


const GoodnessGracious = () => {
    const [copiedText, setCopiedText] = React.useState('');

    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [successArray, setSuccessArray] = useState([])
    const [failureArray, setFailureArray] = useState([])
    const route = useRoute();
    const dispatch = useDispatch();
    //console.log(route.params)
    const randomString = generateRandomString(8);
    const [codeToEmail, setCodeToEmail] = useState('');
    const addresses = route.params.addresses
    const gameName = route.params.gameName
    const rounds = route.params.rounds
    const navigation = useNavigation();
    const apiEndpoint= expoConfigExtra.flower
  

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(codeToEmail);
      };


 
console.log("the api endpoint is " + apiEndpoint)  //  https://music-backend-production-017c.up.railway.app

      useEffect(() => {
        const handleBackButton = () => {
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);

    const sendDataToBackend = async () => {
        setCodeToEmail(randomString);
        setIsLoading(true);
        //console.log('Game Name:', gameName)
        //console.log('Total Submitted Values:', addresses);
        try {
            const dataToSend = {
                gameTitle: gameName,
                emails: addresses,
                gameCode: randomString,
                rounds: rounds
            };
            console.log("the random string is " + randomString)
            const firestore = getFirestore(app);
            const gameCollection = collection(firestore, randomString);
            const specificDocRef = doc(gameCollection, 'gameDetails');
            const roundsValue = Number(dataToSend.rounds);
            await setDoc(specificDocRef, {
                gameTitle: dataToSend.gameTitle,
                gameCode: dataToSend.gameCode,
                participantsNumber: addresses.length,
                rounds: roundsValue
            });
            axios.defaults.debug = true;

            const response = await axios.post(`${apiEndpoint}/inviteApi`, dataToSend);

           // const response = await axios.post('https://192.168.1.142:3001/inviteApi', dataToSend); // my private IP address
            //const response = await axios.post('http://86.140.153.193:3001/inviteApi', dataToSend);
            //const response = await axios.post('https://[2a00:23c5:403:4e01:21f4:fb2:e95d:3032]:3001/inviteApi', dataToSend);


            console.log('Response from backend:', response.data);
            //console.log('URL:', 'http://86.140.153.193:3001/inviteApi');
            console.log('Data to Send:', dataToSend);

            dispatch(setGameName(gameName));
            dispatch(setRandomString(randomString));
            setIsVisible(false);
            setSuccessArray(response.data.successes)
            setFailureArray(response.data.failures)

            //clear everything
            //set out who was sent to who
            //navigate to the home screen

        } catch (error) {
            console.error('Error communicating with the backend:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderedList = ({ item }) => (
        <View style={{ padding: 8 }}>
            <Text style={{ padding: 2, fontSize : 24 }}>{item}</Text>
        </View>
    );


    const backToHome = () => {
        navigation.navigate('Main');
    };



    return isVisible ? (
<SafeAreaView style={{ flex: 1, backgroundColor: 'pink' }}>
        
            <View style={styles.container}>
            <Text style={{ fontFamily: 'TINTIN', fontSize: 34, textAlign: 'center', padding : 10 }}>RUBRIKAL SONG CONTEST</Text>
                <Text style={styles.mainText}>
                    
                    The following will be invited to join{' '}
                    <Text style={styles.gameName}>{gameName}</Text>
                </Text>
            </View>
            <FlatList
                style={{ padding: 16, backgroundColor: 'pink' }}
                data={addresses}
                renderItem={({ item, index }) => (
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10, color: 'blue' }} key={index}>
                        {item}
                    </Text>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: 'gray' }} />}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={sendDataToBackend} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Send out Invites!</Text>
                )}
            </TouchableOpacity>
            <Image source={MusicImage} style={styles.bottomImage} />
        
        </SafeAreaView>
    ) : (
        <SafeAreaView  style={{ flex: 1, backgroundColor: 'pink' }}>
            <View style={styles.container}>
             <Text style={{ fontFamily: 'TINTIN', fontSize: 34, textAlign: 'center', padding : 10 }}>RUBRIKAL SONG CONTEST</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Invites were sent successfully to:</Text>
            <FlatList
                data={successArray}
                renderItem={renderedList}
                keyExtractor={(item) => item}
                style={{ marginBottom: 10 }}
            />
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>-----------------------------</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Invites failed to be sent to the following:</Text>
            <FlatList
                data={failureArray}
                renderItem={renderedList}
                keyExtractor={(item) => item}
                style={{ marginBottom: 10 }}
            />
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10, backgroundColor: 'lightblue', padding: 5 }}>
                If you are satisifed with the invites sent out, go back to the main page and log into "Been invited? Join in Game." 
            </Text>
           
           

            <View style={{ backgroundColor: 'lightblue', padding: 10, marginTop: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        The Game Code is: 
        <Text> </Text>
        <TouchableOpacity 
          onPress={copyToClipboard} 
          style={{ backgroundColor: 'red', borderRadius: 5 }}
        >
          <Text style={{ color: 'white', fontSize: 24 }}>{codeToEmail}</Text>
        </TouchableOpacity>
        <Text>, which has been included in the emails.</Text>
      </Text>
    </View>



            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={backToHome}>
                <Text style={styles.buttonText}>Go the game home page</Text>
            </TouchableOpacity>
          
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    firstContainer: {
        flex: 1,
        padding: 20,
        marginTop: 40,
        backgroundColor: 'orange',
    },
    container: {
        padding: 16,
        backgroundColor: 'pink',
        marginTop: 25,
    },
    mainText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    gameName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'blue',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: '15%',
        alignSelf: 'center',
        backgroundColor: 'green',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
        marginHorizontal: 25,
    },

    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomImage: {
        bottom: '30%',
        width: 170,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 10,
        position: 'absolute',
        justifyContent: 'center',
        alignSelf: 'center',
      },
      secondBottomImage: {
        bottom: '30%',
        width: 170,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 10,
        position: 'absolute',
        justifyContent: 'center',
        alignSelf: 'center',
      }
});

export default GoodnessGracious;


