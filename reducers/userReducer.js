// userReducer.js
const initialState = {
    userName: '',
    userEmail: '',
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_DETAILS':
            console.log('New user details:', action.payload);
            return {
                ...state,
                userName: action.payload.userName,
                userEmail: action.payload.userEmail,
            };
        default:
            return state;
    }
};

export default userReducer;
