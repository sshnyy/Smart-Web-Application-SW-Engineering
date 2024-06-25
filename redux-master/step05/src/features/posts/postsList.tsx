import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector  } from '../../app/hooks';
import { selectAllPosts, fetchPosts, StatePost } from './postsSlice';
import Spinner from '../../components/Spinner';
import PostAuthor from './postAuthor';
import TimeAgo from './timeAgo';
import ReactionButtons from './reactionButtons';

const PostExcerpt = (props: { post: StatePost }) => {
    return (
        <article className="post-excerpt" key={props.post.id}>
            <h3>{props.post.title}</h3>
            <div>
                <PostAuthor userId={props.post.user} />
                <TimeAgo timestamp={props.post.date} />
            </div>
            <p className="post-content">{props.post.content.substring(0, 100)}</p>
    
            <ReactionButtons post={props.post} />
            <Link to={`/posts/${props.post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    );
};

const PostsList = () => {
    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectAllPosts);

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
        // Sort posts in reverse chronological order by datetime string
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));

        content = orderedPosts.map(post => (
            <PostExcerpt key={post.id} post={post} />
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