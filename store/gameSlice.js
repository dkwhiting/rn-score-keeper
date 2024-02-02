import { createSlice } from '@reduxjs/toolkit'
import { games } from '../data';

export const gameSlice = createSlice({
  name: 'games',
  initialState: {
    value: [
      {
        id: 1,
        name: 'Nertz',
        players: [
          {name: 'Dallin', score: 20}, 
          {name: 'Abbey', score: 100}, 
          {name: 'Chris', score: 0}, 
          {name: 'Annabelle', score: 80}],
        created: 'Today',
        highestWins: true,
        completed: false
      },
      {
        id: 2,
        name: 'Bananagrams',
        players: [
          {name: 'Dallin', score: 1}, 
          {name: 'Abbey', score: 2},
        ], 
        created: 'Yesterday',
        highestWins: true,
        completed: false
      },
      {
        id: 3,
        name: 'Scrabble',
        players: [
          {name: 'Abbey', score: 2},
        ], 
        created: 'Yesterday',
        highestWins: true,
        completed: false
      },
      {
        id: 4,
        name: 'Quixx',
        players: [
          {name: 'Dallin', score: 0}, 
          {name: 'Abbey', score: 0},
          {name: 'Annabelle', score: 0},
          {name: 'Chris', score: 0},
          {name: 'Lucy', score: 0},
          {name: 'Nate', score: 0},
        ], 
        created: 'Yesterday',
        highestWins: true,
        completed: false
      },
      {
        id: 5,
        name: 'Quixx',
        players: [
          {name: 'Dallin', score: 100}, 
          {name: 'Abbey', score: 80},
          {name: 'Annabelle', score: 40},
          {name: 'Chris', score: 50},
          {name: 'Lucy', score: 30},
          {name: 'Nate', score: 0},
        ], 
        created: 'Yesterday',
        highestWins: true,
        completed: true
      },
    ],
  },
  reducers: {
    addGame: (state, action) => {
      state.value = [
        {...state},
        action.payload
      ];
    },
    setGames: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { addGame, setGames } = gameSlice.actions

export default gameSlice.reducer