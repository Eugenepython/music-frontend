//round1.jsx
import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, SafeAreaView, View, Text, TextInput, Button, Pressable, StyleSheet, TouchableOpacity, Linking, BackHandler, Image, StatusBar} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { app } from "../firebaseConfig"
import { getFirestore, collection, deleteField, addDoc, getDocs, doc, setDoc, getDoc, exists, query, subcollection, where, updateDoc, onSnapshot, arrayUnion, deleteDoc  } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native'
import * as Font from 'expo-font';
import myNotesImage from '../assets/myNotes.png';
import Constants from 'expo-constants';



const Round1 = () => {
    const [showRoundChoicesButton, setShowRoundChoicesButton] = useState(true);
    const [theStarters, setTheStarters] = useState([])
    const [isSecondButtonDisabled, setIsSecondButtonDisabled] = useState(false);
    const [theMissingPlayers, setTheMissingPlayers] = useState([]);
    const [showShowRound1Score, setShowShowRound1Score] = useState(false)
    const [eachPlayerDone, setEachPlayerDone] = useState(false);
    const [checkOthersHaveFinished, setCheckOthersHaveFinished] = useState(false)
    const [everyoneScored, setEveryOneScored] = useState(0)
    const [readyForRound2, setReadyForRound2] = useState(false)
    const [scoreSongObject, setScoreSongObject] = useState({})
    const [endOfRound, setEndOfRound] = useState(false)
    const [nearlyEndOfRound, setNearlyEndOfRound] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [showScore, setShowScore] = useState(false)
    const [played, setPlayed] = useState(false);
    const [eachPlayersRound, setEachPlayersRound] = useState([]);
    const [boxNumbers, setBoxNumbers] = useState(0);
    const [playedIndexes, setPlayedIndexes] = useState([0]);
    const allDone = playedIndexes[playedIndexes.length - 1]
    const [activeIndex, setActiveIndex] = useState(0);
    const [secondBox, setSecondBox] = useState(false);
    const [thirdBox, setThirdBox] = useState(false);
    const [whoseTurn, setWhoseTurn] = useState(0);
    const gameCode = useSelector((state) => state.gameToPlay.nameOfCode);
    const [titleValue, setTitleValue] = useState('');
    const [artistValue, setArtistValue] = useState('');
    const [URLValue, setURLValue] = useState('');
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [URL, setURL] = useState('');
    const [revealPlayersChoices, setRevealPlayersChoices] = useState(false);
    const userEmail = useSelector((state) => state.userThings.userEmail);
    const individualUser = useSelector((state) => state.userThings.userName);
    const [selectedScore, setSelectedScore] = useState(0); // Use a state to track the selected score
    const navigation = useNavigation();
    const path = `${gameCode}/onlinePlayers/trackingOnlinePlayers/${userEmail}`;
    const [funModal, setFunModal] = useState(false)
    const [yourOrderNumber, setYourOrderNumber] = useState(0);
    const [playerInfo, setPlayerInfo] = useState([]);
    const [disableButton, setDisableButton] = useState(true);
    const [hiddenStates, setHiddenStates] = useState([]);
    const sortedSubmissions = eachPlayersRound.sort((a, b) => a.orderNumber - b.orderNumber);
    //const [hiddenStates, setHiddenStates] = useState(new Array(sortedSubmissions.length).fill(true));


    const firestore = getFirestore(app);


    const handleInputTitle = (text) => {
        setTitleValue(text);
    };

    const handleInputArtist = (text) => {
        setArtistValue(text);
    };

    const handleInputURL = (text) => {
        setURLValue(text);
    };

    const handleTitlePress = () => {
        //console.log('Input Value', titleValue);
        setTitle(titleValue);
    }

    const handleArtistPress = () => {
        //console.log('Input Value', artistValue);
        setArtist(artistValue);
    }

    const handleURLPress = () => {
        //console.log('Input Value', URLValue);
        setURL(URLValue);
    }

    //console.log(sortedSubmissions);

    useEffect(() => {
        if (sortedSubmissions.length > 0) {
            setHiddenStates(sortedSubmissions.map(() => true));
        }
    }, [sortedSubmissions]);

    useEffect(() => {
        Font.loadAsync({
          'TINTIN': require('../assets/fonts/TINTIN.ttf'),
          'RobotoCondensed': require('../assets/fonts/RobotoCondensed-VariableFont_wght.ttf')
        });
      }, []);

    useEffect(() => {
        const handleBackButton = () => {
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);

    const theBoxes = sortedSubmissions.map((eachSubmission, index) => {
        const isHidden = hiddenStates[index];
        const hasPlayed = playedIndexes.includes(index);
        playedIndexes.includes(index)

        return (
     
            <View
                key={eachSubmission.orderNumber}
                style={styles.container}>
                <View style={styles.userNameContainer}>
                    <Text style={styles.userNameText}>{eachSubmission.userName}</Text>
                </View>
                <View style={styles.bottomContainer}>

                    {hasPlayed || index === 0 ? (
                        <View style={[styles.textContainer, { flex: 2 / 3 }]}>
                            <Text style = {{ fontSize: 20,     fontWeight: 'bold',     color: 'black',     marginLeft: 10, }}>{eachSubmission.song}</Text>
                            <Text style = {{ fontSize: 20,     fontWeight: 'bold',     color: 'black',     marginLeft: 10, }}>{eachSubmission.artist}</Text>
                            <TouchableOpacity onPress={() => openURL(sortedSubmissions[index].url)}>
                            <Text style = {{ fontSize: 20,     fontWeight: 'bold',     color: 'blue',     marginLeft: 10, }}>{sortedSubmissions[index].url}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={[styles.textContainer, { flex: 2 / 3 }]}>
                            <Text style = {{ fontSize: 20,     fontWeight: 'bold',     color: 'black',     marginLeft: 10, }}>Song</Text>
                            <Text style = {{ fontSize: 20,     fontWeight: 'bold',     color: 'black',     marginLeft: 10, }}>Artist</Text>
                            <Text style = {{ fontSize: 20,     fontWeight: 'bold',     color: 'black',     marginLeft: 10, }}>YouTube link</Text>
                        </View>
                    )}
                    {index === whoseTurn ? (
                        <View style={[styles.buttonContainer, { flex: 1 / 3 }]}>
                            <TouchableOpacity 
                           style={styles.eachButton}
                            onPress={() => playSong(index)} 
                            >
                                <Text style = {{color : 'white', textAlign: 'center'}}>FINISH LISTENING?</Text>
                                </TouchableOpacity>
                            {showScore &&  <TouchableOpacity 
                                            style={styles.eachButton}
                                            onPress={() => scoreSong(index)} >
                                            <Text style = {{color : 'white', textAlign: 'center'}}>SCORE SONG</Text>
                                            </TouchableOpacity>
                                            }
                        </View>
                    ) : (
                        <View style={[styles.musicContainer, { flex: 1 / 3 }]}>
                            <Image
                            source={myNotesImage}
                            style={styles.smallImage}
                            />
                        </View>
                    )}
                </View>
            </View>
          
        )
    })





    useEffect(() => {
        const docRef = doc(firestore, `${gameCode}/gameDetails`);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            //console.log("Document data:", doc.data());
            const data = doc.data();
            const theStarters = data.starters ? data.starters : [];
            const participantsNumber = data.participantsNumber;
            if (theStarters.length === participantsNumber && theStarters.length > 0) {
                setDisableButton(false)
            } else {
                //setDisableButton(false)
                //console.log("oh no thisis the ^^^^^^ probem ")
            }
            //theStarters.length === participantsNumber && theStarters.length > 0 ? setDisableButton(false) : setDisableButton(true)
           // console.log("hey everyone, the John of Gaunt");
            setTheStarters(theStarters);
        });
        return () => unsubscribe();
    }, []);

    const startersList = theStarters.map((starter, index) => (
        <Text key={index}>{starter} has now chosen</Text>
    ));


    async function addRoundCollection() {
        try {
            let path = `${gameCode}/onlinePlayers/trackingOnlinePlayers`;
            //  console.log(userEmail + "  userEmail in the zoo of Berlin which houses the animals of the world")
            const shortPath = `${gameCode}/gameDetails`;
            let trackingOnlinePlayersCollectionRef = collection(firestore, path);
            let userDocRef = doc(trackingOnlinePlayersCollectionRef, userEmail);
            let round1CollectionRef = collection(userDocRef, 'round 1');
            let userRound1DocRef = doc(round1CollectionRef, userEmail);
            const shortDocRef = doc(firestore, shortPath);
            const docSnapshot = await getDoc(shortDocRef);
            if (docSnapshot.exists()) {
                await updateDoc(shortDocRef, {
                    starters: arrayUnion(individualUser)
                });
            } else {
                await setDoc(shortDocRef, { starters: [individualUser] });
            }
            //console.log(`${individualUser} added to finishers`);
            await setDoc(userRound1DocRef, {
                song: title,
                artist: artist,
                url: URL,
                round1Done: false
            });
            setRevealPlayersChoices(true);
        } catch (error) {
            console.error('Error:', error);
        }
    }







    async function findEachSubmission() {
        //console.log("hi")
        const emptyArray = []
        const mainCollectionRef = collection(firestore, gameCode);
        const onlinePlayersDocRef = doc(mainCollectionRef, 'onlinePlayers');
        try {
            const trackingOnlinePlayersCol = await getDocs(collection(onlinePlayersDocRef, 'trackingOnlinePlayers'));
            for (const doc of trackingOnlinePlayersCol.docs) {
                const round1Subcollection = await getDocs(collection(doc.ref, 'round 1'));
                let eachObjName = doc.id;
                for (const round1Doc of round1Subcollection.docs) {
                    const round1Data = round1Doc.data();
                    ///console.log(`Document data in 'round1' subcollection for ${doc.id}:`, round1Data);
                    for (let j = 0; j < playerInfo.length; j++) {
                        const player = playerInfo[j];
                        //console.log(player)
                        const playerEmail = Object.keys(player)[0];
                        //console.log(playerEmail)
                        if (playerEmail === eachObjName) {
                            const playerOrderNumber = player[playerEmail].orderNumber;
                            const playerUserName = player[playerEmail].userName;
                            const playerEmailId = player[playerEmail].emailId;
                            const playerSong = round1Data.song;
                            const playerArtist = round1Data.artist;
                            const playerURL = round1Data.url;
                            const playerSubmission = {
                                orderNumber: playerOrderNumber,
                                userName: playerUserName,
                                emailId: playerEmailId,
                                song: playerSong,
                                artist: playerArtist,
                                url: playerURL
                            }
                            //console.log(playerSubmission)
                            emptyArray.push(playerSubmission)
                           // console.log(emptyArray)
                            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                            setEachPlayersRound((prevPlayerInfo) => [...prevPlayerInfo, playerSubmission]);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error finding submissions:", error);
        }
    }



    async function revealOrder() {
        setDisableButton(true);
        setShowRoundChoicesButton(false);
        const mainCollectionRef = collection(firestore, gameCode);
        const onlinePlayersDocRef = doc(mainCollectionRef, 'onlinePlayers');
        const trackingOnlinePlayersCol = collection(onlinePlayersDocRef, 'trackingOnlinePlayers');
        const querySnapshot = await getDocs(trackingOnlinePlayersCol);
        const numberOfDocuments = querySnapshot.size;
        setBoxNumbers(numberOfDocuments);
        // console.log('Number of documents in the subcollection:', numberOfDocuments);
        const path = `${gameCode}/onlinePlayers/trackingOnlinePlayers`;
        const docRef = doc(firestore, path, userEmail);// i need to get to t
        const emptyArray = []
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setYourOrderNumber(data.orderNumber)
        } else {
            console.log("No such document!");
        }
        const q = query(collection(firestore, path));
        const querySnapshot2 = await getDocs(q);
        querySnapshot2.forEach((doc) => {
            const initialInfo = {
                [doc.data().emailId]: {
                    orderNumber: doc.data().orderNumber,
                    userName: doc.data().userName,
                    emailId: doc.data().emailId,
                },
            };
            emptyArray.push(initialInfo)
        })
        setPlayerInfo((prevPlayerInfo) => [...prevPlayerInfo, ...emptyArray]);
    }

    useEffect(() => {
        //console.log('playerInfo has changed:', playerInfo);
        if (playerInfo.length > 0) {
            findEachSubmission();
        }
    }, [playerInfo]);


    async function leaveGame() {
        console.log(theMissingPlayers + "  theMissingPlayers")
        if (theMissingPlayers.includes(individualUser)) {            
            setTheMissingPlayers(theMissingPlayers.filter(player => player !== individualUser));
        } else {
            console.log("was never there")
        }
        navigation.navigate('Main');
        try{
            const trackingOnlinePlayersPath = `${gameCode}/onlinePlayers/trackingOnlinePlayers`
            const thePath = `${gameCode}/gameDetails`;
            const playerDocRef = doc(firestore, trackingOnlinePlayersPath, userEmail);
const docPlayerSnapshot = await getDoc(playerDocRef);
if (docPlayerSnapshot.exists()) {
    await updateDoc(playerDocRef, {
       online: false,
    });
    console.log("it should be deleting")
    await deleteDoc(playerDocRef);
} else {
    console.log("Document does not exist.");
}
            const docRef = doc(firestore, thePath);
            const docSnapshot = await getDoc(docRef);
            const theGameDetails = docSnapshot.data();
            //onsole.log(theGameDetails + "  theGameDetails")
            const participantsNumber = theGameDetails.participantsNumber;
//console.log(participantsNumber + "  participantsNumber")   
if (theGameDetails.starters) {
    let deleteDocument = false
    console.log(individualUser + "  individualUser")
    if (theGameDetails.starters.length === 1) {
        deleteDocument = true;
    }
   let OldStarters = theGameDetails.starters
   let updatedStarters = OldStarters.filter(player => player !== individualUser);
   console.log(updatedStarters)
   if (deleteDocument) {
    await updateDoc(docRef, {
        starters: deleteField(),
    });
} else {
    await updateDoc(docRef, {
        starters: updatedStarters
    });
}
} else {
    console.log("no starters");
}
if (theGameDetails.finishers) {
    let deleteDocument = false;
    console.log(individualUser + "  individualUser");
    if (theGameDetails.finishers.length === 1) {
        deleteDocument = true;
    }
    let oldFinishers = theGameDetails.finishers;
    let updatedFinishers = oldFinishers.filter(player => player !== individualUser);
    console.log(updatedFinishers);
    if (deleteDocument) {
        await updateDoc(docRef, {
            finishers: deleteField(),
        });
    } else {
        await updateDoc(docRef, {
            finishers: updatedFinishers,
        });
    }
} else {
    console.log("no finishers");
}
 const newParticipantsNumber = participantsNumber - 1;
            await updateDoc(docRef, {
                participantsNumber: newParticipantsNumber
            });
  } catch (error) {
            console.error("Error updating document: ", error);
        }
        findEachSubmission();
    }

    



    const handleScoreChange = (itemValue) => {
        const numericValue = parseInt(itemValue, 10);
        setSelectedScore(numericValue);
    };


    function playSong(index) {
        const emptyArray = []
        emptyArray.push(sortedSubmissions[index])
        setShowScore(true)
        //const howLong = playerInfo.length;
        setPlayedIndexes([...playedIndexes, index]);
        //console.log(index + "  index")
        index === 0 ? setSecondBox(true) : null
        index === 1 ? setThirdBox(true) : null
        //console.log(sortedSubmissions[index].orderNumber);
        //console.log(hiddenStates[index] + "4444444");
        const updatedHiddenStates = [...hiddenStates];
        updatedHiddenStates[index] = false;
        setHiddenStates(updatedHiddenStates);
    }


    function scoreSong(y) {
        setShowScore(false)
        sortedSubmissions[y].userName !== individualUser ? setModalVisible(true) : setFunModal(true)
        setPlayedIndexes([...playedIndexes, y + 1]);
        // console.log(sortedSubmissions[y].userName + "  userName")
        // console.log(individualUser + "  individualUser")
        //setShowScore(false);
        //console.log('After setShowScore');
        setWhoseTurn(y + 1);
        if (y === playerInfo.length - 1) {
            console.log("round over")
            setNearlyEndOfRound(true)
        }
    }

    // const onlinePlayersDocRef = doc(gameCode, 'onlinePlayers', 'trackingOnlinePlayers', sortedSubmissions[theOrder].userName, 'round 1',);


    async function scoreModal() {
        const theOrder = playedIndexes[playedIndexes.length - 2];
        if (selectedScore) {
            setSelectedScore(0);
            //    console.log(individualUser + " gave a score of " + selectedScore + " for " + sortedSubmissions[theOrder].userName + "'s song called "
            // + sortedSubmissions[theOrder].song + " by " + sortedSubmissions[theOrder].artist)
            try {
                const thePath = `${gameCode}/onlinePlayers/trackingOnlinePlayers/${sortedSubmissions[theOrder].emailId}/round 1/${sortedSubmissions[theOrder].emailId}`
                const mainDocRef = doc(firestore, thePath);
                const scoresCollectionRef = collection(mainDocRef, 'scores');
                const scoreDocRef = doc(scoresCollectionRef, sortedSubmissions[theOrder].emailId);
                const scorer = individualUser
                const scoreDocSnapshot = await getDoc(scoreDocRef);
                if (scoreDocSnapshot.exists()) {
                    await updateDoc(scoreDocRef, {
                        [scorer]: selectedScore
                    });
                } else {
                    await setDoc(scoreDocRef, {
                        [scorer]: selectedScore
                    });
                }

            } catch (error) {
                console.error('Error updating document: ', error);
            }
            setModalVisible(!modalVisible);
            { nearlyEndOfRound && setEndOfRound(true) }
        } else {
            console.error('Please select a score');
        }
    }

    function closeFunModal() {
        setFunModal(!funModal);
        //  console.log(nearlyEndOfRound + "  nearlyEndOfRound")
        //  console.log(endOfRound + "  endOfRound")
        { nearlyEndOfRound && setEndOfRound(true) }
    }

    const theFunModal = <Modal
        animationType="slide"
        transparent={true}
        visible={funModal}
        onRequestClose={() => {
            setFunModal(!funModal);
        }}
    >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>

                <Text>Hope the others enjoy your song as much as you do!</Text>


                <Button title="Close" onPress={() => closeFunModal()} />

            </View>
        </View>
    </Modal>


    const theModal = <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}
    >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>

            <Text style= {{fontSize: 18}}>Select your score out of 10:</Text>
                <Text style= {{fontSize: 18}}>{selectedScore}/10</Text>
                <Picker
                    selectedValue={selectedScore}
                    onValueChange={handleScoreChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    {/* Create Picker.Item for each score option */}
                    {Array.from({ length: 11 }, (_, index) => (
                        <Picker.Item key={index} label={index.toString()} value={index.toString()} />
                    ))}
                </Picker>

                <Button title="Score and close" onPress={() => scoreModal()} />

            </View>
        </View>
    </Modal>



    async function updateRound1Done() {
        if (endOfRound) {
            //   console.log("hot dogs are free!!!!!!!!!!!!!!")
            const path = `${gameCode}/onlinePlayers/trackingOnlinePlayers/${userEmail}/round 1/${userEmail}`;
            const docRef = doc(firestore, path);
            try {
                await updateDoc(docRef, {
                    round1Done: true
                })
                console.log('Document successfully updated!');
                setCheckOthersHaveFinished(true)
            } catch (error) {
                console.error('Error updating document: ', error);
            }
        };
    }
    useEffect(() => {
        updateRound1Done();
    }, [endOfRound]);



    const checkDoneStatus = async () => {
        const allPlayersLong = sortedSubmissions.length;
        const doneArray = [];
        const theFinishers = []
        const unsubscribeCallbacks = [];
        const snapshotPromises = sortedSubmissions.map(async (submission, i) => {
            const theEmail = submission.emailId;
            const eachPath = `${gameCode}/onlinePlayers/trackingOnlinePlayers/${theEmail}/round 1/${theEmail}`;
            return new Promise((resolve, reject) => {
                const unsubscribe = onSnapshot(doc(firestore, eachPath), (doc) => {
                    if (doc.exists()) {
                        const currentData = doc.data();
                        //    console.log(currentData.round1Done + "  currentData")
                        if (currentData && currentData.round1Done === true) {
                            doneArray.push(i);
                            //      console.log("its good its good hurrah       " + i)
                            //    console.log(sortedSubmissions[i].userName + "  sortedSubmissions[i].userName")
                        }
                        resolve(); // Resolve the promise once onSnapshot is complete
                    } else {
                        console.log("Document does not exist");
                        reject(); // Reject the promise if the document doesn't exist
                    }
                }, (error) => {
                    console.error("Error in onSnapshot:", error);
                    reject(error); // Reject the promise in case of an error
                });

                unsubscribeCallbacks.push(unsubscribe);
            });
        });
        await Promise.all(snapshotPromises);
        const uniqueValuesArray = [...new Set(doneArray)];
        if (uniqueValuesArray.length > 0 && uniqueValuesArray.length === allPlayersLong) {
            setEachPlayerDone(true);
            //  console.log("the King of the North is here and he is the  King ofhNorth")
        };
    };


    async function showRound1Scores() {
        //console.log(sortedSubmissions.length + "  sortedSubmissions.length")
        let everyoneScored = []
        for (let i = 0; i < sortedSubmissions.length; i++) {
            const theEmail = sortedSubmissions[i].emailId
            const theSong = sortedSubmissions[i].song
            const eachPath = `${gameCode}/onlinePlayers/trackingOnlinePlayers/${theEmail}/round 1/${theEmail}/scores/${theEmail}`
            try {
                const docRef = doc(firestore, eachPath);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    //console.log("Document data:", docSnap.data());
                    const data = docSnap.data();
                    const theScores = Object.values(data)
                    everyoneScored.push(theScores)
                    //console.log(theScores + " the Scores")
                    const totalScore = theScores.reduce((acc, score) => acc + score, 0);
                    setScoreSongObject((prevScoreSongObject) => ({
                        ...prevScoreSongObject,
                        [theSong]: totalScore
                    }));
                    //console.log(theSong + " " + theScores)
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        }
        setReadyForRound2(true)
        //console.log(everyoneScored + "  everyoneScored")
        setEveryOneScored(everyoneScored.length)
        setShowShowRound1Score(false)
        setIsSecondButtonDisabled(true)
    }

    const theScoreSheet = Object.entries(scoreSongObject).map(([key, value]) => (
        <View key={key} style={styles.item}>
            <Text style={styles.keyText}>{key}:</Text>
            <Text style={styles.valueText}>{value}</Text>
        </View>
    ));

    async function goToRound2() {
        try {
            const thePath = `${gameCode}/gameDetails`;
            const docRef = doc(firestore, thePath);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                //console.log("Document data:", docSnapshot.data());
                const data = docSnapshot.data();
                const maxNo = data.participantsNumber
                const startersNo = data.starters?.length ?? 0
                console.log(maxNo)
                console.log(startersNo)
                if (maxNo === startersNo) {
                    console.log(individualUser + "was the first guy to press submit")
                    await updateDoc(docRef, {
                        finishers: deleteField(),
                        starters: deleteField()
                    });
                    console.log("Fields and their values successfully removed!");
                    navigation.navigate("Go to Round 2", {
                        screen: "NestedRound2",
                        params: {}
                    });
                } else {
                    console.log("this guy was not the first to go to round 2")
                    navigation.navigate("Go to Round 2", {
                        screen: "NestedRound2",
                        params: {}
                    });
                }
            } else {
                console.log("Document does not exist");
            }
        } catch (error) {
            console.error("Error updating document: ", error);
        }

    }


    function findMissingPlayers(finishers, allPlayers) {
        const missingPlayers = allPlayers.filter(player => !finishers.includes(player));
        return missingPlayers;
    };

    async function logFinishers() {
        let allPlayers = []
        for (let i = 0; i < sortedSubmissions.length; i++) {
            const player = sortedSubmissions[i].userName;
            allPlayers.push(player)
        }
        if (endOfRound) {
            try {
                const shortPath = `${gameCode}/gameDetails`;
                const shortDocRef = doc(firestore, shortPath);
                const docSnapshot = await getDoc(shortDocRef);
                if (docSnapshot.exists()) {
                    const finishersArray = docSnapshot.data().finishers || [];
                    // console.log("Finishers: ", finishersArray);
                    // console.log("All Players: ", allPlayers)
                    const missingPlayers = allPlayers.length > 0 ? findMissingPlayers(finishersArray, allPlayers) : [];
                    //console.log("  missingPlayers: ", missingPlayers)
                    setTheMissingPlayers(missingPlayers)

                } else {
                    // Document does not exist
                    //console.log('Document does not exist');
                }
            } catch (error) {
                console.error('Error fetching finishers:', error);
            }
        }
    };





    function checkEveryoneScored() {
        //console.log("brazil has won the world cup")
        checkDoneStatus();
        logFinishers()

    }



    useEffect(() => {
        const updateFinishers = async () => {
            // console.log("gloabal warming is reallyu good for the planet and the people")
            if (endOfRound) {
                try {
                    const shortPath = `${gameCode}/gameDetails`;
                    const shortDocRef = doc(firestore, shortPath);
                    const docSnapshot = await getDoc(shortDocRef);
                    if (docSnapshot.exists()) {
                        await updateDoc(shortDocRef, {
                            finishers: arrayUnion(individualUser)
                        });
                    } else {
                        await setDoc(shortDocRef, { finishers: [individualUser] });
                    }
                    //console.log(`${individualUser} added to finishers`);
                } catch (error) {
                    console.error('Error updating finishers:', error);
                }
            }
        };

        updateFinishers();
    }, [endOfRound]);


    useEffect(() => {
        eachPlayerDone ? setShowShowRound1Score(true) : setShowShowRound1Score(false)
    }), [eachPlayerDone];



    const theMissing = theMissingPlayers ? (
        theMissingPlayers.map((item, index) => (
            <View key={index}>
                <Text style={{marginTop:15, marginLeft: 15}}>Waiting for {item}</Text>
            </View>
        ))
    ) : (
        <View key={0}>
            <Text>Waiting for everyone to finish Round 1</Text>
        </View>
    );

    return (
     
   <SafeAreaView style={{ flex: 1, backgroundColor: '#FFD699', paddingTop: Constants.statusBarHeight}}>
  <StatusBar
      barStyle="light-content"
      backgroundColor="#FFD699" 
    />
        
          <Text style={{ fontFamily: 'TINTIN', fontSize: 34, textAlign: 'center', marginTop: 40 }}>RUBRIKAL SONG CONTEST</Text>
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20 }}>
              <Text style={{ fontSize: 20 }}>Round 1</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  padding: 5,
                  borderRadius: 5,
                  alignSelf: 'flex-end',
                }}
                onPress={leaveGame}
              >
                <Text style={{ color: 'white' }}>Leave Game</Text>
              </TouchableOpacity>
            </View>
      
            {revealPlayersChoices === false ? (
              <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center', marginTop: 15, marginBottom: 15, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'RobotoCondensed', fontSize: 20 }}>{individualUser} </Text>
                <Text style={{ fontFamily: 'RobotoCondensed', fontSize: 16 }}>Choose your songs below!</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                  <TextInput
                    style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, padding: 10, marginRight: 10 }}
                    placeholder="Song title..."
                    onChangeText={handleInputTitle}
                    value={titleValue}
                  />
                 
                 <TouchableOpacity 
                  onPress={handleTitlePress} 
                  style ={styles.button}
                  >
                  <Text style = {{color: 'white', textAlign: 'center'}}>SONG TITLE</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                  <TextInput
                    style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, padding: 10, marginRight: 10 }}
                    placeholder="Artist..."
                    onChangeText={handleInputArtist}
                    value={artistValue}
                  />
                  <TouchableOpacity 
                  style ={styles.button}
                  onPress={handleArtistPress} 
                  >
                     <Text style = {{color: 'white', textAlign: 'center'}}>ARTIST</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                  <TextInput
                    style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, padding: 10, marginRight: 10 }}
                    placeholder="Youtube URL..."
                    onChangeText={handleInputURL}
                    value={URLValue}
                  />
                  <TouchableOpacity  
                  onPress={handleURLPress} 
                  style ={styles.button}
                  >
                   <Text style = {{color: 'white', textAlign: 'center'}}>YOUTUBE URL</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.theContainer}>
                  <Text style={styles.displayText}> {title}</Text>
                  <Text style={styles.displayText}> {artist}</Text>
                  <Text style={styles.displayText}> {URL}</Text>
                </View>
                {title && artist && URL && (
                  <View style={{ marginTop: 10 }}>
                     <TouchableOpacity
                                        title="Submit"
                                        onPress={addRoundCollection}
                                        style={{ padding: 10, borderRadius: 5, textAlign: 'center', backgroundColor: 'green',}}
                                    >
                                        <Text style={{  color: 'white', fontSize: 24, padding: 5, borderRadius: 5, textAlign: 'center' }}>Submit</Text>
                                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <View>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}> {individualUser}, please mark the songs each player has chosen</Text>
                </View>
                <ScrollView style={{ flexGrow: 1 }}>
  <View style={{ flexGrow: 1,  backgroundColor: '#FFD699' }}>
                  <View style={styles.titleContainer}>
                    {startersList}
                  </View>
                  {showRoundChoicesButton && 
                    <View style={{ alignItems: 'center' }}>
                      <TouchableOpacity
                        style={{ backgroundColor: disableButton ? 'gray' : 'green', padding: 40, borderRadius: 5 }}
                        onPress={revealOrder}
                        disabled={disableButton}
                      >
                        <Text style={{ color: 'white', fontSize: 24 }}>Reveal and score Round 1 choices</Text>
                      </TouchableOpacity>
                    </View>
                  }
                  {theBoxes}
                  {theModal}
                  {theFunModal}
                  {endOfRound && readyForRound2 === false && showShowRound1Score === false &&
                    <TouchableOpacity style={styles.checkEveryone} onPress={() => checkEveryoneScored()} >
                        <Text style= {{fontSize: 24, textAlign: 'center', color : 'white'}}>Check everyone has finished</Text>
                        </TouchableOpacity>
                  }
                  {showShowRound1Score ? (
                    <Button
                      title="Show Round 1 Score"
                      onPress={() => showRound1Scores()}
                      disabled={isSecondButtonDisabled}
                    />
                  ) : (
                    <View>
                      {theMissing}
                    </View>
                  )}
      
                  {<View style={{ alignItems: 'center' }}>
                    {theScoreSheet}
                  </View>}
      
                  {readyForRound2 && everyoneScored === boxNumbers &&
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Round 1 is over!</Text>
                      <Button title="Go to Round 2" onPress={() => goToRound2()} />
                    </View>
                  }

                </View>
                <View style={{ height: 200, backgroundColor: '#FFD699' }}>
    
  </View>

                </ScrollView>
              </View>
            )}
          </View>
       
        </SafeAreaView>
      )
      
}

const openURL = async (url) => {
    try {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.log("Don't know how to open URI: " + url);
        }
    } catch (error) {
        console.error("Error opening URL:", error);
    }
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 10,
        margin: 5,
        // Add other styling as needed
    },
    button : {
backgroundColor: 'blue',
borderRadius:5,
color: 'white',
padding: 10,
minWidth: 120,
textAlign: 'center',
justifyContent: 'center', // Align content (text) vertically to the center
    },
    checkEveryone :{
        backgroundColor: 'blue',
        borderRadius: 5,
        padding: 10,
        borderWidth: 1, // Border width
        borderColor: 'lightblue', // Border color (same as background for a seamless look)
        shadowColor: 'black', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset (horizontal and vertical)
        shadowOpacity: 0.9, // Shadow opacity
        shadowRadius: 5, // Shadow radius
        elevation: 3, // For Android, controls the depth of the shadow
        minWidth: 150,
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center', // Align content (text) vertically to the center
        marginHorizontal: 50,
    },
    eachButton: {
        backgroundColor: 'blue',
        borderRadius: 5,
        padding: 10,
        borderWidth: 1, // Border width
        borderColor: 'lightblue', // Border color (same as background for a seamless look)
        shadowColor: 'black', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset (horizontal and vertical)
        shadowOpacity: 0.9, // Shadow opacity
        shadowRadius: 5, // Shadow radius
        elevation: 3, // For Android, controls the depth of the shadow
        minWidth: 150,
    },
    linkText :{
        color: 'blue',
        textDecorationLine: 'underline',
    },
    userNameContainer: {
        alignItems: 'center',
        //marginBottom: 10,
        backgroundColor: 'lightgreen',
    },
    userNameText: {
        fontSize: 18,
        fontWeight: 'bold',
        // Add other styling as needed
    },
    bottomContainer: {
        flexDirection: 'row',

        borderBlockColor: 'black',
    },
    textContainer: {
        width: '75%',
        marginRight: 'auto',
        backgroundColor: 'lightblue',
        borderBlockColor: 'black',
    },
 
    buttonContainer: {
        // Adjust this section as needed
        marginLeft: 'auto',
        alignItems: 'flex-end',
        color: 'blue',
        backgroundColor: 'lightblue'
    },
    musicContainer: {
        backgroundColor: 'lightblue',
        marginLeft: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
      },
      smallImage: {
        width: 35,
        height: 35,
        resizeMode: 'contain', // Adjust the resizeMode as needed
      },
    picker: {
        width: 200,
        height: 50,
        color: '#333', // Text color
    backgroundColor: '#fff',
    },
    pickerItem: {
        color: '#333', // Item text color
      },
    theContainer: {
        backgroundColor: 'lightgrey', // light gray background color
        padding: 10,
        borderRadius: 8, // rounded corners
        marginTop: 20, // adjust the margin as needed
    },
    displayText: {
        fontSize: 22,
        color: 'darkred', // dark gray text color
        marginBottom: 5,
    },
    titleContainer: {
        alignItems: 'center',
       // justifyContent: 'center',
        marginBottom: 15, // Adjust as needed
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    item: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    keyText: {
        marginRight: 5,
        fontSize: 18,
    },
    valueText: {
        fontWeight: 'bold',
        fontSize: 18,
    },


});



export default Round1;

