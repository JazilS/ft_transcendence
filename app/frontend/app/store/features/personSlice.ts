// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { defaultCookies } from 'next-auth/core/lib/cookie';

// export interface Person{
// 	id: number;
// 	name: string;
// }

// interface PersonState{
// 	persons: Person[];
// }

// const initialState: PersonState = {
// 	persons: []
// };

// export const PersonSlice = createSlice({
// 	name: 'person',
// 	initialState,
// 	reducers: {
// 		addPerson: (state: PersonState, action: PayloadAction<{name: string}>) => {
// 			state.persons.push({
// 				id: state.persons.length,
// 				name: action.payload.name
// 			});
// 		},
// 		editPerson: (state: PersonState, action: PayloadAction<{id: number, name: string}>) => {
// 			const person = state.persons.find(person => person.id === action.payload.id);
// 			if (person) {
// 			  person.name = action.payload.name;
// 			}

// 		}
// 	}
// });

// export default PersonSlice.reducer;
// export const { addPerson } = PersonSlice.actions;

