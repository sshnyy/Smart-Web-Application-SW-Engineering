import React from 'react';

import { useAppDispatch } from '../../app/hooks';
import { StatePost, reactionAdded } from './postsSlice';

const reactionEmoji = {
    thumbsUp: '👍',
    hooray: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀',
};

const ReactionButtons = (props: { post: StatePost }) => {
    const dispatch = useAppDispatch();

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button
                key={name}
                type="button"
                className="muted-button reaction-button"
                onClick={() =>
                    dispatch(reactionAdded({ postId: props.post.id as string, reaction: name }))
                }
            >
                {emoji} {(props.post.reactions as { [key: string]: number })[name]}
            </button>
        );
    });

    return <div>{reactionButtons}</div>;
};

export default ReactionButtons;