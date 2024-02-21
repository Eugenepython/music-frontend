// reducers/gamePlayingReducer.js
const initialState = {
    nameOfGamePlaying: '',
    nameOfCode: '',
};

const gamePlayingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_GAME_PLAYING':
            return {
                ...state,
                nameOfGamePlaying: action.payload,
            };
        case 'SET_CODE_RECIEVED':
            return {
                ...state,
                nameOfCode: action.payload,
            };
        default:
            return state;
    }
};

export default gamePlayingReducer;
