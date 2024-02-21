// reducers/codeReducer.js
const initialState = {
    gameName: '',
    randomString: '',
};

const codeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_GAME_NAME':
            return {
                ...state,
                gameName: action.payload,
            };
        case 'SET_RANDOM_STRING':
            return {
                ...state,
                randomString: action.payload,
            };
        default:
            return state;
    }
};

export default codeReducer;


