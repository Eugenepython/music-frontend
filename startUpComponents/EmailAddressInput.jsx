//EmailAddressInput.jsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MusicImage from '../assets/myNotes.png';


const AnyName = () => {
    const route = useRoute();
    const navigation = useNavigation();
    //console.log("Nested route params:", route.params);
    const numbers = route.params.number;
    const gameName = route.params.gameName;
    const rounds = route.params.rounds;
    const [inputValues, setInputValues] = useState(Array.from({ length: numbers }, () => ''));
    const [enteredValues, setEnteredValues] = useState([]);
    const [allBoxesSubmitted, setAllBoxesSubmitted] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);


    useEffect(() => {
        const isAllSubmitted = enteredValues.every(value => value !== '');
        setAllBoxesSubmitted(isAllSubmitted);
    }, [enteredValues]);


    const handleInputChange = (index, value) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };

    const handleInputSubmit = (index) => {
        const existingPlayerIndex = enteredValues.findIndex((_, i) => i === index);
        if (existingPlayerIndex !== -1) {
            const newEnteredValues = [...enteredValues];
            newEnteredValues[existingPlayerIndex] = inputValues[index];
            setEnteredValues(newEnteredValues);
        } else {
            setEnteredValues([...enteredValues, inputValues[index]]);
        }
        const newInputValues = [...inputValues];
        newInputValues[index] = '';
        setInputValues(newInputValues);
        const nextIndex = index + 1;
        if (nextIndex < inputValues.length) {
            setActiveIndex(nextIndex);
        }
    };
// i 
    function sendEmails() {
        console.log('Game Name:', gameName)
        console.log('Total Submitted Values:', enteredValues);
        console.log('Total Number of Rounds:', rounds);
        navigation.navigate("Confirm invitations", {
            screen: "NestedSendingOutInvites",
            params: { addresses: enteredValues, gameName: gameName, rounds: rounds }
        })
    }


    return (
        <SafeAreaView style={styles.container} >
        <View>
        <View style={{ marginTop: 40, marginLeft: 5, marginRight: 5}}>
        <Text style={{ fontFamily: 'TINTIN', fontSize: 34, textAlign: 'center', padding : 10 }}>RUBRIKAL SONG CONTEST</Text>
        </View>
                        <Text style={styles.enteredValuesText}>Email Addreses of players: please also remember to include your own!</Text>
            {inputValues.map((value, index) => (
                <View key={index} style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={(text) => handleInputChange(index, text)}
                        placeholder={`Enter email of player`}
                    />
                    <TouchableOpacity
                        onPress={() => handleInputSubmit(index)}
                        style = {{ padding: 10, backgroundColor: 'lightgreen', borderRadius: 5, alignSelf: 'center', marginTop: 5, marginBottom: 5, marginRight: 5}}
                    >
                    <Text style={{fontSize: 18}}>Submit</Text>
                    </TouchableOpacity>
                </View>
            ))}
            {enteredValues.map((value, index) => (
                <Text key={index}>
                    <Text style={styles.playerText}>{`Player ${index + 1}:`}</Text>
                    <Text style={styles.emailText}>{` ${value}`}</Text>
                </Text>
            ))}
            {allBoxesSubmitted && enteredValues.length == numbers && (
                <View >
                    <Text style={styles.confirmation}>Are you happy all email addresses are correct? If so, continue...</Text>
                    <TouchableOpacity
                        onPress={sendEmails}
                        style={styles.button}
                    >
                            <Text style={styles.buttonText}>
                            Send out invites to play the game of - {gameName}
                         </Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style= {{ marginTop: 50}}>
              <Image source={MusicImage} style={styles.bottomImage} />
              </View>

        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: 'lightcoral',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        marginLeft: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        marginRight: 10,
        padding: 5,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 23,
    },
    button: {
        backgroundColor: 'darkblue',
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
      },
    enteredValuesText: {
        marginTop: 20,
        fontWeight: 'bold',
        fontSize:18,
        marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
    },
    emailText: {
        fontSize: 24,
    },
    playerText: {
        fontWeight: 'bold',
        color: 'blue',
        fontSize: 24,
    },
    confirmation: {
        marginTop: 15,
        fontSize: 18,
    },
    bottomImage: {
        //bottom: '15%',
        width: 170,
        height: 150,
        //resizeMode: 'cover',
        //position: 'absolute',
        //justifyContent: 'center',
        alignSelf: 'center',
      },
});

export default AnyName;



