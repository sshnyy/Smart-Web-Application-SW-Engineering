import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import notificationsReducer from '../features/notifications/notificationsSlice';
import { apiSlice } from '../features/api/apiSlice';

export const store = configureStore({
    reducer: {
        notifications: notificationsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;