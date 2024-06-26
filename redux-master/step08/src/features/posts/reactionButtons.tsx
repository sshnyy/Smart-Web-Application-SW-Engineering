import React from 'react';

import { StatePost } from './postsSlice';
import { useAddReactionMutation } from '../api/apiSlice';

const reactionEmoji = {
    thumbsUp: '👍',
    hooray: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀',
};

const ReactionButtons = (props: { post: StatePost }) => {
    const [addReaction] = useAddReactionMutation();

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button
                key={name}
                type="button"
                className="muted-button reaction-button"
                onClick={() =>
                    addReaction({ postId: props.post.id, reaction: name })
                }
            >
                {emoji} {(props.post.reactions as { [key: string]: number })[name]}
            </button>
        );
    });

    return <div>{reactionButtons}</div>;
};

export default ReactionButtons;