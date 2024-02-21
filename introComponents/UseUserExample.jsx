import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Text, StyleSheet } from "react-native";
import { connect } from 'react-redux';
import { setUserDetails } from '../actions/userActions';

const UseUserExample = ({ onUserDetailsChange, dispatch }) => {

    const { isLoaded, isSignedIn, user } = useUser();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            const emailId = user.emailAddresses[0].emailAddress
            const userDetails = user.fullName
            onUserDetailsChange({ email: emailId, username: userDetails });
            dispatch(setUserDetails(userDetails, emailId));
        }
    }, [isLoaded, isSignedIn, user.email]);

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    return (
        <Text style={styles.welcomeText}>
            Hello, <Text style={styles.highlightText}>{user.fullName}</Text>, welcome to the Rubrikal Song Contest!
        </Text>
    );}

    const styles = StyleSheet.create({
        welcomeText: {
            fontSize: 24,
            textAlign: 'center',
            color: '#333',
        },
        highlightText: {
            fontWeight: 'bold',
            color: 'blue', 
        },
    });


export default connect()(UseUserExample);