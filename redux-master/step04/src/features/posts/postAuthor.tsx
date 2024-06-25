import React from 'react';

import { useAppSelector } from '../../app/hooks';

const PostAuthor = (props: { userId: string }) => {
    const author = useAppSelector(state =>
        state.users.find(user => user.id === props.userId)
    );

    return <span>by {author ? author.name : 'Unknown author'}</span>;
};

export default PostAuthor;