'use client'

import ProfilePage from './ProfilePage'
import '../styles.css'
import { Provider } from 'react-redux';
import { store } from '../store/store';

export default function PrivateProfilePage() {

  return (
    <Provider store={store}>
      <ProfilePage/>
    </Provider>
  );
}