import { useEffect, useReducer } from 'react';
import { AuthContext } from './contexts/auth/AuthContext';
import authReducer from './contexts/auth/AuthReducer';
import AppRouter from './routers/AppRouter';

const init = () => {
  console.log('entro');
  return JSON.parse(localStorage.getItem('user')) || {logged: false, token: null, name: null, id: null};
}

const App = () => {
  
  const [user, dispatch] = useReducer(authReducer, {}, init)

  useEffect(() => {
      localStorage.setItem('user', JSON.stringify(user));
  },[user]);

  return (
      <AuthContext.Provider value={{user, dispatch}}>
          <AppRouter/>
      </AuthContext.Provider>
      
  )
}


export default App;
