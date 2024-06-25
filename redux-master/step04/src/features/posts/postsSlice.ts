import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';
import { sub } from 'date-fns';

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

const initialState: StatePost[] = [
    {
        id: '1',
        title: 'First Post!',
        content: 'Hello!',
        user: '1',
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            eyes: 0,
        },
    },
    {
        id: '2',
        title: 'Second Post',
        content: 'More text',
        user: '2',
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            eyes: 0,
        },
    },
];

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer: (state, action: PayloadAction<StatePost>) => {
                state.push(action.payload);
            },
            prepare: (title: string, content: string, userId: string) => {
                return {
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        user: userId,
                        reactions: {
                            thumbsUp: 0,
                            hooray: 0,
                            heart: 0,
                            rocket: 0,
                            eyes: 0,
                        },
                    },
                };
            },
        },
        postUpdated(state, action: PayloadAction<{
            id: string,
            title: string,
            content: string,
        }>) {
            const { id, title, content } = action.payload;
            const existingPost = state.find(post => post.id === id);

            if (existingPost) {
                existingPost.title = title;
                existingPost.content = content;
            }
        },
        reactionAdded(state, action: PayloadAction<{
            postId: string,
            reaction: string,
        }>) {
            const { postId, reaction } = action.payload;
            const existingPost = state.find(post => post.id === postId);

            if (existingPost) {
                (existingPost.reactions as { [key: string]: number })[reaction]++;
            }
        }
    },
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;