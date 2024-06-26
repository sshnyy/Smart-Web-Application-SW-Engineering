import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice
} from '@reduxjs/toolkit';

import { RootState } from '../../app/store';
import { StateUser  } from '../posts/postsSlice';

const usersAdapter = createEntityAdapter<StateUser>();

const initialState = usersAdapter.getInitialState();

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch('/fakeApi/users');

    return (await response.json() as StateUser[]);
});
 
const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll);
    },
});

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
} = usersAdapter.getSelectors<RootState>(state => state.users);

export default usersSlice.reducer;