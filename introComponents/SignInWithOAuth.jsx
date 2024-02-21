import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Button, StyleSheet, View, TouchableOpacity, Text, Image} from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "./WarmUpBrowser";
import { FontAwesome } from '@expo/vector-icons';




WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
   
    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const onPress = React.useCallback(async () => {
        try {
            const { createdSessionId, signUp, setActive } =
                await startOAuthFlow();

            if (createdSessionId) {
                setActive({ session: createdSessionId });
            } else {
                console.log("something else")
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);

    return (
        <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>
          Sign in with Google
        </Text>
      </TouchableOpacity>
    

    </View>
    );
}

const styles = StyleSheet.create({
    container: {
    top: '20%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: 'blue', // Replace with your desired background color
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    buttonText: {
      color: '#ffffff', // Replace with your desired text color
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
    },

  });

export default SignInWithOAuth;

