//App.js
import React, { useEffect, useState } from "react";

// i get "midleware is not a function (it is undefined)" error when i try to import this
import { SafeAreaView, Text, StyleSheet, View, Button, Pressable, Image, TouchableOpacity } from "react-native";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { extra as expoConfigExtra } from "./expoConfig";
import SignInWithOAuth from "./introComponents/SignInWithOAuth.jsx";
import * as SecureStore from "expo-secure-store";
import UseUserExample from "./introComponents/UseUserExample.jsx";
import { NavigationContainer, StackActions, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NewGameScreen from "./startUpComponents/NewGameScreen.jsx";
import EnteringEmailsScreen from "./startUpComponents/EmailAddressInput.jsx";
import Acat from "./startUpComponents/Jimmy.jsx";
import anyThing from "./ParticipateInGame.jsx";
import Welcome from "./WelcomeToGame.jsx";
import { Provider } from 'react-redux'
import store from './store'
import Round1 from "./rounds/Round1.jsx";
import Round2 from "./rounds/Round2.jsx";
import Round3 from "./rounds/Round3.jsx";
import Round4 from "./rounds/Round4.jsx";
import Round5 from "./rounds/Round5.jsx";
import ScorePage from "./rounds/ScorePage.jsx";
import * as Font from 'expo-font';
import MusicImage from './assets/music.png';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const NewGameStack = createStackNavigator();
const EnteringEmailsStack = createStackNavigator();
const ParticipateInGame = createStackNavigator();
const RoundsStack = createStackNavigator();
const ScorePageStack = createStackNavigator();

const NewGameStackScreen = () => (
  <NewGameStack.Navigator>
    <NewGameStack.Screen
      name="NestedNewGameScreen"
      component={NewGameScreen}
      options={{ headerShown: false }}
    />
  </NewGameStack.Navigator>
);

const ParticipateInGameScreen = () => (
  <ParticipateInGame.Navigator>
    <ParticipateInGame.Screen
      name="NestedParticipateInGameScreen"
      component={anyThing}
      options={{ headerShown: false, headerLeft: null }}
    />
    <ParticipateInGame.Screen
      name="NestedWelcomeAll"
      component={Welcome}
      options={{ headerShown: false, headerLeft: null }}
    />
  </ParticipateInGame.Navigator>
);


const EnteringEmails = () => (
  <EnteringEmailsStack.Navigator>
    <EnteringEmailsStack.Screen
      name="NestedEnteringEmailsScreen"
      component={EnteringEmailsScreen}
      options={{ headerShown: false, headerLeft: null }}
    />
    <EnteringEmailsStack.Screen
      name="NestedBobbyScreen"
      component={Acat}
      options={{ headerShown: false, headerLeft: null }}
    />
    <EnteringEmailsStack.Screen
      name="NestedSendingOutInvites"
      component={Acat}
      options={{ headerShown: false, headerLeft: null }}
    />
  </EnteringEmailsStack.Navigator>
);

const ScoreScreen = () => (
  <ScorePageStack.Navigator>
    <ScorePageStack.Screen
      name="NestedScorePageScreen"
      component={ScorePage}
      options={{ headerShown: false, headerLeft: null }}
    />
  </ScorePageStack.Navigator>
)



const RoundsScreen = () => (
  <RoundsStack.Navigator>
    <RoundsStack.Screen
      name="NestedRound1"
      component={Round1}
      options={{ headerShown: false, headerLeft: null }}
    />
    <RoundsStack.Screen
      name="NestedRound2"
      component={Round2}
      options={{ headerShown: false, headerLeft: null }}
    />
    <RoundsStack.Screen
      name="NestedRound3"
      component={Round3}
      options={{ headerShown: false }}
    />
    <RoundsStack.Screen
      name="NestedRound4"
      component={Round4}
      options={{ headerShown: false }}
    />
    <RoundsStack.Screen
      name="NestedRound5"
      component={Round5}
      options={{ headerShown: false }}
    />
  </RoundsStack.Navigator>
);




const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  return (
    <View style = {{position: 'absolute', bottom: '10%'}}>
     <TouchableOpacity
        style={{ backgroundColor: 'orange', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 8,}}
        onPress={() => {
          signOut();
        }}
        >
        <Text style={{ fontSize: 18, color: 'white' }}>Sign Out</Text>
        </TouchableOpacity>
      
    </View>
  );
};


const HomeScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userName, setUserName] = React.useState("")
  const [userEmail, setUserEmail] = React.useState("")
  const navigation = useNavigation();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'TINTIN': require('./assets/fonts/TINTIN.ttf'),
        'RobotoCondensed': require('./assets/fonts/RobotoCondensed-VariableFont_wght.ttf')
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleNewGamePress = () => {
    navigation.navigate('Initial Details');
  };

  const joinGame = () => {
    console.log("joinGame")
    navigation.navigate('Go Back');
  }

  function handleUserDetailsChange(x) {
    setUserName(x.fullName)
    setUserEmail(x.emailAddress)
  }

  if (!fontsLoaded) {
        return null;
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={{ fontFamily: 'TINTIN', fontSize: 34, top: '5%', textAlign: 'center', position: 'absolute',}}>RUBRIKAL SONG CONTEST</Text>
      <Image source={MusicImage} style={{top: '9%', width: 100, height: 200, resizeMode: 'cover', borderRadius: 10, position: 'absolute' }} />

      <SignedIn>
      <UseUserExample onUserDetailsChange={handleUserDetailsChange} />


<View style={{ top: '10%'}}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? 'darkred' : 'red',
            },
          ]}
          onPress={handleNewGamePress}
        >
          <Text style={styles.buttonText}>Invite others to a new game</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? 'darkgreen' : 'green',
            },
          ]}
          onPress={joinGame}
        >
          <Text style={styles.buttonText}>Been invited? Join in Game</Text>
        </Pressable>
        </View>
        <SignOut />
        
      </SignedIn>
      <SignedOut>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
      <Text style={{ fontFamily: 'RobotoCondensed', fontSize: 28, top: '50%', textAlign: 'center', position: 'absolute',  paddingHorizontal: 20, color: '#333'}}>Sign in securely with your google account</Text>
        <SignInWithOAuth   />
        </View>
      </SignedOut>
    </SafeAreaView>
  )
}

export default function App() {

  useEffect(() => {
    Font.loadAsync({
      'TINTIN': require('./assets/fonts/TINTIN.ttf'),
      'RobotoCondensed': require('./assets/fonts/RobotoCondensed-VariableFont_wght.ttf')
    });
  }, []);

  function HomeComponent() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}   options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }



  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={expoConfigExtra.clerkPublishableKey}
    >

      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              component={HomeComponent}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Initial Details"
              component={NewGameStackScreen}
              options={{ headerShown: false }}


            />
            <Stack.Screen
              name="Email Invitations"
              component={EnteringEmails}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Confirm invitations"
              component={EnteringEmails}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Go to welcome"
              component={ParticipateInGameScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Go Back"
              component={ParticipateInGameScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Go to Round 1"
              component={RoundsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Go to Round 2"
              component={RoundsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Go to Round 3"
              component={RoundsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Go to Round 4"
              component={RoundsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Go to Round 5"
              component={RoundsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Go to Score Page"
              component={ScoreScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </ClerkProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  '#ff69b4',
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

