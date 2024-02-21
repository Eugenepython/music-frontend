//store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import codeReducer from './reducers/codeReducer';
import userReducer from './reducers/userReducer';
import gamePlayingReducer from './reducers/gamePlayingReducer';

const rootReducer = combineReducers({
    entryThings: codeReducer,
    userThings: userReducer,
    gameToPlay: gamePlayingReducer,
});



const store = configureStore({ reducer: rootReducer });


export default store;

