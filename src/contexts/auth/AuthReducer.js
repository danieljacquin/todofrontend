

export const authReducer = (state = {}, action) => {

    switch(action.type) {
        case 'login':
            return {
                ...action.payload,
                logged: true
            }

        case 'logout':
            return {logged: false, token: null, name: null, id: null}

        default:
            return state; 
    }
} 

export default authReducer;