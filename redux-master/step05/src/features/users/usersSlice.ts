import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { StateUser  } from '../posts/postsSlice';

const initialState: StateUser[] = [];

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch('/fakeApi/users');

    return (await response.json() as StateUser[]);
});
 
const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export default usersSlice.reducer;