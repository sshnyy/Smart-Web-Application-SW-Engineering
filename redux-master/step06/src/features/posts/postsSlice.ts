import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter,
} from '@reduxjs/toolkit';

import { RootState } from '../../app/store';

export type StateUser = {
    id: string,
    firstName: string,
    lastName: string,
    name: string,
    username: string
};

export type StatePost = {
    id: string,
    title: string,
    content: string,
    user: string,
    date: string,
    reactions: {
        thumbsUp: number,
        hooray: number,
        heart: number,
        rocket: number,
        eyes: number,
    },
};

const postsAdapter = createEntityAdapter<StatePost>({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: '',
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await fetch('/fakeApi/posts');

    return (await response.json() as StatePost[]);
});
 
export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    async (post: {
        title: string,
        content: string,
        user: string,
    }) => {
        const response = await fetch('/fakeApi/posts', {
            method: 'POST',
            body: JSON.stringify(post),
        });

        return (await response.json() as StatePost);
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.entities[postId];

            if (existingPost) {
                (existingPost.reactions as { [key: string]: number })[reaction]++;
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload;
            const existingPost = state.entities[id];

            if (existingPost) {
                existingPost.title = title;
                existingPost.content = content;
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Add any fetched posts to the array
                // Use the `upsertMany` reducer as a mutating update utility
                postsAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            })
            // Use the `addOne` reducer for the fulfilled case
            .addCase(addNewPost.fulfilled, postsAdapter.addOne);
    },
});

export const { postUpdated, reactionAdded } = postsSlice.actions;

// Export the customized selectors for this adapter using `getSelectors`
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors<RootState>(state => state.posts);

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state: RootState, userId: string) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
);

export default postsSlice.reducer;