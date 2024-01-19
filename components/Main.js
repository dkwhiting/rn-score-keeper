import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BottomNav from './BottomNav';
import Login from './Login';

const Main = () => {
  const [user, setUser] = useState('user')

  return (
    <>
    {!user
      ? <Login />
      : <NavigationContainer>
          <BottomNav />
        </NavigationContainer>
    }
    </>
  );
};

export default Main