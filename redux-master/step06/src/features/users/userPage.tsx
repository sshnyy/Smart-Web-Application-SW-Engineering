import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAppSelector  } from '../../app/hooks';
import { selectPostsByUser } from '../posts/postsSlice';
import { selectUserById } from './usersSlice';

const UserPage = () => {
    const { userId } = useParams();

    const user = useAppSelector(state => selectUserById(state, userId as string));

    const postsForUser = useAppSelector(state => selectPostsByUser(state, userId as string));

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ));

    return (
        <section>
            <h2>{user.name}</h2>

            <ul>{postTitles}</ul>
        </section>
    );
};

export default UserPage;