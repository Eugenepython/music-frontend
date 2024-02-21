import React from "react";
import { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Text } from "react-native";

export default function UseAuthExample() {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const user = useUser();
    console.log("helsdflasjfsajfjslfjaslkfd")
    useEffect(() => {
        if (isLoaded && user) {
            // Log information about the Google user
            console.log("User Profile Name:", user.fullName);
            console.log("User Email:", user.emailAddress);
            console.log("Google ID:", user.providerData.google.id);
        }
    }, [isLoaded, user]);
    // In case the user signs out while on the page.
    if (!isLoaded || !userId) {
        return null;
    }



    return (
        <Text>
            Hello, {userId} your current active session is {sessionId}
        </Text>
    );
}