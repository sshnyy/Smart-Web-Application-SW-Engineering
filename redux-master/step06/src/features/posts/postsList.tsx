import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector  } from '../../app/hooks';
import {
    selectPostIds,
    selectPostById,
    fetchPosts,
} from './postsSlice';
import Spinner from '../../components/Spinner';
import PostAuthor from './postAuthor';
import TimeAgo from './timeAgo';
import ReactionButtons from './reactionButtons';


const PostExcerpt = (props: { postId: string }) => {
    const post = useAppSelector(state => selectPostById(state, props.postId));

    return (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 100)}</p>
    
            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    );
};

const PostsList = () => {
    const dispatch = useAppDispatch();
    const orderedPostIds = useAppSelector(selectPostIds);

    const postStatus = useAppSelector(state => state.posts.status);
    const error = useAppSelector(state => state.posts.error);

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts());
        }
    }, [postStatus, dispatch]);

    let content;

    if (postStatus === 'loading') {
        content = <Spinner text="Loading..." />;
    } else if (postStatus === 'succeeded') {
        content = orderedPostIds.map(postId => (
            <PostExcerpt key={postId} postId={postId} />
        ));
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>;
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    );
};

export default PostsList;