import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';

import { RootState } from '../../app/store';

export type StateNotification = {
    id: string,
    date: string,
    message: string,
    user: string,
    read: boolean,
    isNew: boolean,
}

const notificationsAdapter = createEntityAdapter<StateNotification>({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, thunkApi) => {
        // Cast types for `getState` manually
        const state = thunkApi.getState() as RootState;

        const allNotifications = selectAllNotifications(state);
        const [latestNotification] = allNotifications;
        const latestTimestamp = latestNotification ? latestNotification.date : '';
        const response = await fetch(
            `/fakeApi/notifications?since=${latestTimestamp}`
        );

        return (await response.json() as StateNotification[]);
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead(state) {
            Object.values(state.entities).forEach(notification => {
                notification.read = true;
            });
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            notificationsAdapter.upsertMany(state, action.payload);

            Object.values(state.entities).forEach(notification => {
                // Any notifications we've read are no longer new
                notification.isNew = !notification.read;
            });
        });
    },
});

export const { allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const {
    selectAll: selectAllNotifications,
} = notificationsAdapter.getSelectors<RootState>(state => state.notifications);
