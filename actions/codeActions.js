// actions/codeActions.js

export const SET_GAME_NAME = 'SET_GAME_NAME';
export const SET_RANDOM_STRING = 'SET_RANDOM_STRING';

export const setGameName = (gameName) => ({
    type: SET_GAME_NAME,
    payload: gameName,
});

export const setRandomString = (randomString) => ({
    type: SET_RANDOM_STRING,
    payload: randomString,
});

