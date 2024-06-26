import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../../app/hooks';
import { selectUserById } from './usersSlice';
import { useGetPostsQuery } from '../api/apiSlice';
import { StatePost } from '../posts/postsSlice';

const UserPage = () => {
    const { userId } = useParams();

    const user = useAppSelector(state => selectUserById(state, userId as string));

    const selectPostsForUser = useMemo(() => {
        const emptyArray: StatePost[] = [];

        // Return a unique selector instance for this page so that
        // the filtered results are correctly memoized
        return createSelector(
            (res) => res.data,
            (res, userId) => userId,
            (data: StatePost[], userId) => data?.filter(post => post.user === userId) ?? emptyArray
        );
    }, []);

    // Use the same posts query, but extract only part of its data
    const { postsForUser } = useGetPostsQuery(undefined, {
        selectFromResult: res => ({
            ...res,
            // Include a field called `postsForUser` in the hook result object,
            // which will be filtered list of posts
            postsForUser: selectPostsForUser(res, userId),
        }),
    });

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