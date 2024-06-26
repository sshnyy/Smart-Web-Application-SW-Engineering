import React from 'react';

import { useAppSelector } from '../../app/hooks';
import { selectUserById } from '../users/usersSlice';

const PostAuthor = (props: { userId: string }) => {
    const author = useAppSelector(state => selectUserById(state, props.userId));

    return <span>by {author ? author.name : 'Unknown author'}</span>;
};

export default PostAuthor;