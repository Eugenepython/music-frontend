//ScorePage.jsx
import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, SafeAreaView, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Linking, Pressable, BackHandler, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { getTopSongsBySum } from '../someFunctions';
import { app } from "../firebaseConfig"
import { getFirestore, collection, deleteField, getDocs, doc, setDoc, getDoc, query, updateDoc, onSnapshot, arrayUnion, deleteDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';





const ScorePage = () => {
    const [showResults, setShowResults] = useState(false);
    const [winnerResults, setWinnerResults] = useState([]);
    const [runnerUpResults, setRunnerUpResults] = useState([]);
    const [thirdPlaceResults, setThirdPlaceResults] = useState([]);
    const [loserResults, setLoserResults] = useState([]);
    const route = useRoute();
    const navigation = useNavigation();
    const gameCode = useSelector((state) => state.gameToPlay.nameOfCode);
    const rounds = route.params.rounds;
    const [theEmails, setTheEmails] = useState([]);
    const [freezeResults, setFreezeResults] = useState(false)
    const [hideResultsButton, setHideResultsButton] = useState(true)
    const [playerRankings, setPlayerRankings] = useState([])

    const firestore = getFirestore(app);

    useEffect(() => {
        const handleBackButton = () => {
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);

    function groupedByPlayerName(y) {
        return y.reduce((acc, item) => {
          const playerName = item.playerName || 'No Player Name';
          if (!acc[playerName]) {
            acc[playerName] = [];
          }
          acc[playerName].push(item);
          return acc;
        }, {});
      }
      
      function arrangeScores(y){
      const theObj = groupedByPlayerName(y)
      //console.log(theObj)
      const keysArray = Object.keys(theObj);
      //console.log(keysArray)
      let objArray = []
      for (let i = 0; i < keysArray.length; i ++){
        let eachName = keysArray[i]
       let eachArray = (theObj[eachName])
       let sum = 0;
       for (let j=0; j < eachArray.length; j++){
         //console.log(eachArray[j].sum)
         //console.log(eachArray[j].playerName)
          sum += eachArray[j].sum;
       }
       const newObj = { [eachName]: sum };
      objArray.push(newObj)
      }
      const sortedData = objArray.sort((a, b) => {
        const aValue = Object.values(a)[0];
        const bValue = Object.values(b)[0];
        return bValue - aValue;
      });
      return sortedData
      }

    async function getScores() {
        let scoresArray = []
        //console.log(theEmails)
        for (const email of theEmails) {
            //console.log(email)
            for (let i = 0; i < rounds; i++) {
                const eachSongArray = [];
                let sum = 0;
                let artist = "";
                let song = "";
                let url = "";
                let playerName = "";
                const eachRound = `round ${i + 1}`;
                const eachSongScoreDoc = `${gameCode}/onlinePlayers/trackingOnlinePlayers/${email}/${eachRound}/${email}/scores/${email}`;
                const eachSongTitleDoc = `${gameCode}/onlinePlayers/trackingOnlinePlayers/${email}/${eachRound}/${email}`;
                const eachPlayerNameDoc = `${gameCode}/onlinePlayers/trackingOnlinePlayers/${email}`;
                const docSongScoreRef = doc(firestore, eachSongScoreDoc);
                const docSongTitleRef = doc(firestore, eachSongTitleDoc);
                const docPlayerNameRef = doc(firestore, eachPlayerNameDoc);
                try {
                    const docPlayerSnap = await getDoc(docPlayerNameRef);
                    if (docPlayerSnap.exists()) {
                        //console.log("Scores Document data:", docPlayerSnap.data());
                        playerName = docPlayerSnap.data().userName;
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error getting document:", error);
                }
                try {
                    const docScoreSnap = await getDoc(docSongScoreRef);
                    if (docScoreSnap.exists()) {
                        //console.log("Scores Document data:", docScoreSnap.data());
                        let objects = docScoreSnap.data();
                        let valuesArray = [];
                        for (let key in objects) {
                            if (objects.hasOwnProperty(key)) {
                                let value = objects[key];
                                valuesArray.push(value);
                            }
                        }
                        //console.log(valuesArray);
                        sum = valuesArray.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue;
                        }, 0);
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error getting document:", error);
                }
                try {
                    const docTitleSnap = await getDoc(docSongTitleRef);
                    if (docTitleSnap.exists()) {
                        //console.log("Song Document data:", docTitleSnap.data());
                        artist = docTitleSnap.data().artist;
                        song = docTitleSnap.data().song;
                        url = docTitleSnap.data().url;
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error getting document:", error);
                }
                //console.log(playerName, artist, song, url, sum);
                const resultObject = {
                    playerName: playerName,
                    artist: artist,
                    song: song,
                    url: url,
                    sum: sum
                };
                scoresArray.push(resultObject);
                setWinnerResults([...winnerResults, resultObject]);
                setRunnerUpResults([...runnerUpResults, resultObject]);
                setThirdPlaceResults([...thirdPlaceResults, resultObject]);
                setLoserResults([...loserResults, resultObject]);
            }
        }
        console.log(scoresArray, "scoresArray")
        setShowResults(true);
        setPlayerRankings(arrangeScores(scoresArray))
        return getTopSongsBySum(scoresArray)
    }

//console.log(playerRankings, "playerRankings")

const theRankings = playerRankings.map((item, index) => (
    <View key={index} style={styles.itemContainer}>
      <Text style={styles.itemText}>{Object.keys(item)[0]}</Text>
      <Text style={styles.itemText}>{Object.values(item)[0]}</Text>
    </View>
    ));

    async function getEachPlayer() {
        console.log(rounds, "rounds")
        let emptyArray = []
        const initialPath = `${gameCode}/onlinePlayers/trackingOnlinePlayers`;
        const q = query(collection(firestore, initialPath))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            //console.log(doc.id, " => ", doc.data());
            const eachOne = doc.data();
            emptyArray.push(eachOne.emailId)
        });
        setTheEmails(emptyArray)
        getScores()
        setHideResultsButton(false)
    }


    async function setOutTheScores() {
        const outCome = await getScores();
        console.log(outCome, "outCome")
        setWinnerResults(outCome.topSongs)
        setRunnerUpResults(outCome.secondTopSongs)
        setThirdPlaceResults(outCome.thirdTopSongs)
        setLoserResults(outCome.lowestSongs)
        setFreezeResults(true)
    }


    useEffect(() => {
        if (showResults) {
            setOutTheScores();
        }
    }, [showResults]);



    async function leaveGame() {
        try {
            navigation.navigate('Main');
            const theDocument = doc(firestore, `${gameCode}/onlinePlayers/trackingOnlinePlayers/${userEmail}`);
            const snapshot = await getDoc(theDocument);
            if (snapshot.exists()) {
                const updatedData = { online: false };
                await updateDoc(theDocument, updatedData);
            } else {
                console.log('Document does not exist.');
            }
        } catch (error) {
            console.error('Error fetching document:', error)
        }
    }

    const handleLinkPress = async (url) => {
        try {
          await Linking.openURL(url);
        } catch (error) {
          console.error('Error opening URL:', error);
        }
      };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#5C6BC0'}}>
            <Text style={{ fontFamily: 'TINTIN', fontSize: 34,  textAlign: 'center', marginTop : 40}}>RUBRIKAL SONG CONTEST</Text>

            
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}>
                <View style={{ flex: 1, marginTop: 30 }}>

                    <View style={styles.theHeader}>
                <Text style={styles.heading}>Final Scores</Text>
                {showResults && freezeResults && <View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'red',
                            padding: 5,
                            borderRadius: 5,
                            alignSelf: 'flex-end',
                            marginRight: 20,
                        }}
                        onPress={leaveGame}>
                        <Text style={{ color: 'white' }}>Go Home</Text>
                    </TouchableOpacity>
                    </View>}
                </View>

                     { hideResultsButton &&  <View>
                    <Pressable
                        onPress={() => getEachPlayer()}
                    >
                        <Text style={styles.pressMeButton}>Press Me</Text>
                    </Pressable>
                    </View>     }


                    {showResults && freezeResults && <View style={styles.resultsContainer}>

<View>
  
    {theRankings}
    </View>

                    <View style={[styles.container, { borderColor: 'gold' }]}>
                    
                        <Text><FontAwesome name="trophy" color="gold" size={20} />First</Text>
                        <Text>{winnerResults[0].sum} points</Text>
                        {winnerResults.map((result, index) => (
                                 
                            <View key={index} style={styles.winnerText}>
                                <Text style = {{ maxWidth: '48%'}}>{result.song}</Text>
                                <Text style = {{ maxWidth: '48%'}}>Player: {result.playerName}</Text>
                                <Text style = {{ maxWidth: '48%'}}>Artist: {result.artist} </Text>
                                <TouchableOpacity onPress={() => handleLinkPress(result.url)}>
                                    <Text style={styles.linkText}>Listen Again</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        
                        </View>


                        <View style={[styles.container, { borderColor: 'silver' }]}>
<Text><FontAwesome name="trophy" color="grey" size={20} />Second</Text>
<Text>{runnerUpResults[0].sum} points</Text>
                        {runnerUpResults.map((result, index) => (
                            <View key={index} style={styles.secondText}>
                                <Text style = {{ maxWidth: '48%'}}>{result.song}</Text>
                               <Text style = {{ maxWidth: '48%'}}>Player: {result.playerName}</Text>
                                <Text style = {{ maxWidth: '48%'}}>Artist: {result.artist} </Text>
                                <TouchableOpacity onPress={() => handleLinkPress(result.url)}>
                                    <Text style={styles.linkText}>Listen Again</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        </View>

                        <View style={[styles.container, { borderColor: 'brown' }]}>                        
                        <Text><FontAwesome name="trophy" color="brown" size={20} />Third</Text>
                        <Text>{thirdPlaceResults[0].sum} points</Text>
                        {thirdPlaceResults.map((result, index) => (
                            <View key={index} style={styles.thirdText}>
                                  <Text style = {{ maxWidth: '48%'}}>{result.song}</Text>
                                 <Text style = {{ maxWidth: '48%'}}>Player: {result.playerName}</Text>
                                <Text style = {{ maxWidth: '48%'}}>Artist: {result.artist} </Text>
                                <TouchableOpacity onPress={() => handleLinkPress(result.url)}>
                                    <Text style={styles.linkText}>Listen Again</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        </View>

                        <View style={[styles.container, { borderColor: 'black' }]}>
<Text><FontAwesome name="caret-down" color="black" size={20} /> Last</Text>
<Text>{loserResults[0].sum} points</Text>
                        {loserResults.map((result, index) => (
                            <View key={index} style={styles.lastText}>
                               <Text style = {{color: 'white', maxWidth: '48%' }}>{result.song}</Text>
                                <Text style = {{color: 'white', maxWidth: '48%'}}>Player: {result.playerName} </Text>
                                <Text style = {{color: 'white', maxWidth: '48%'}}>Artist: {result.artist} </Text>
                                <TouchableOpacity onPress={() => handleLinkPress(result.url)}>
                                    <Text style={styles.linkText}>Listen Again</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        </View>


                    </View>}
<View style ={{height: 120, backgroundcolor: '#5C6BC0'}}>

</View>


                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

export default ScorePage;
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    pressMeButton: {
        backgroundColor: 'blue',
        color: 'white',
        padding: 10,
        textAlign: 'center',
        margin: 10,
    },
   theHeader :{
    flex: 1,
    flexDirection: 'row', // Set flexDirection to 'row' for horizontal layout
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Distribute items along the row
    paddingHorizontal: 20, // Add padding for better spacing
   },
    scoresParagraph: {
        margin: 20,
    },
    resultsContainer: {
        fontFamily: 'RobotoCondensed',
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'blue',
    },
    winnerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green', // Change color for the winner
        backgroundColor: 'gold', // Set your desired background color
        borderRadius: 10, // Set border radius to create soft corners
        borderWidth: 1, // Set border width
        borderColor: 'gray', // Set border color
        padding: 10, // Adjust padding as needed
        marginVertical: 10, // Adjust margin as needed
        width: '75%',
    },
    secondText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'blue', // Change color for the second place
        backgroundColor: 'silver', // Set your desired background color
    borderRadius: 10, // Set border radius to create soft corners
    borderWidth: 1, // Set border width
    borderColor: 'gray', // Set border color
    padding: 10, // Adjust padding as needed
    marginVertical: 10, // Adjust margin as needed
    width: '75%',
    },
    thirdText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'orange', // Change color for the third place
        backgroundColor: '#b87333', // Set your desired background color
        borderRadius: 10, // Set border radius to create soft corners
        borderWidth: 1, // Set border width
        borderColor: 'gray', // Set border color
        padding: 10, // Adjust padding as needed
        marginVertical: 10, // Adjust margin as needed
        width: '75%',
    },
    lastText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white', // Change color for the last place
        backgroundColor: 'black', // Set your desired background color
        borderRadius: 10, // Set border radius to create soft corners
        borderWidth: 1, // Set border width
        borderColor: 'gray', // Set border color
        padding: 10, // Adjust padding as needed
        marginVertical: 10, // Adjust margin as needed
        width: '75%',
    },
    linkText: {
        color: 'blue', // Set the desired color for the link text
        textDecorationLine: 'underline', // Underline the text to indicate it's a link
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        marginVertical: 10,
        marginLeft: windowWidth * 0.03, // 3% of the screen width (15px for a standard 500px wide screen)
        marginRight: windowWidth * 0.03, // 3% of the screen width (15px for a standard 500px wide screen)
      },
      borderContainer: {
        backgroundColor: 'lightorange', // Set your desired background color
        borderRadius: 20, // Set border radius to 90%
        padding: 20, // Adjust padding as needed
      },
      linkText: {
        // Styles for the "Listen Again" link
        color: 'blue',
        textDecorationLine: 'underline',
      },
      itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginHorizontal: 40,
      },
      itemText: {
        fontSize: 16,
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10, // Add margin at the bottom for separation
        marginHorizontal: 40,
      },
});

