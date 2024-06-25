import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';

export type StateUser = {
    id: string
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

type InitialState = {
    posts: StatePost[],
    status: string,
    error: string | undefined
}

const initialState: InitialState = {
    posts: [],
    status: 'idle',
    error: undefined
};

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
            const existingPost = state.posts.find(post => post.id === postId);

            if (existingPost) {
                (existingPost.reactions as { [key: string]: number })[reaction]++;
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload;
            const existingPost = state.posts.find(post => post.id === id);

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
                state.posts = state.posts.concat(action.payload);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // We can directly add the new post object to our posts array
                state.posts.push(action.payload);
            });
    },
});

export const { postUpdated, reactionAdded } = postsSlice.actions;

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const selectPostById = (state: RootState, postId: string | undefined) =>
    state.posts.posts.find((post: StatePost) => post.id === postId);

export default postsSlice.reducer;