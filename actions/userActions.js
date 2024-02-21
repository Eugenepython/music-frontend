// actions/userActions.js

export const SET_USER_DETAILS = 'SET_USER_DETAILS';

export const setUserDetails = (userName, userEmail) => ({
    type: SET_USER_DETAILS,
    payload: { userName, userEmail },
});