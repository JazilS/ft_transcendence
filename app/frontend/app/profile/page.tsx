'use client'

import ProfilePage from './ProfilePage'
import '../styles.css'
import { Provider } from 'react-redux';
import { User, store } from '../store/store';

export default function Home() {

  const userIfNull : User = {
      id: 100,
      name: "Musashi",
      imageSrc: "/Musashi.jpg",
      isConnected: true,
      games: [
        {id: 0, opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 10},
        {id: 1, opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 8, scoreOpponent: 11},
        {id: 2, opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 2},
        {id: 3, opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 11, scoreOpponent: 0},
        {id: 4, opponent: "Kojiro", opponentImageSrc: "/Kojiro.jpg", scoreUser: 7, scoreOpponent: 11},
      ]
    }  

  return (
    <Provider store={store}>
      <ProfilePage/>
    </Provider>
  );
}