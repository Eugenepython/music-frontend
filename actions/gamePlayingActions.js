// actions/gamePlayingActions.js

export const SET_GAME_PLAYING = 'SET_GAME_PLAYING';
export const SET_CODE_RECIEVED = 'SET_CODE_RECIEVED';

export const setGameToPlay = (nameOfGamePlaying) => ({
    type: SET_GAME_PLAYING,
    payload: nameOfGamePlaying,
});

export const nameOfTheCode = (nameOfCode) => ({
    type: SET_CODE_RECIEVED,
    payload: nameOfCode,
});
