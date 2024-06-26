import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import Spinner from '../../components/Spinner';
import PostAuthor from './postAuthor';
import TimeAgo from './timeAgo';
import ReactionButtons from './reactionButtons';
import { StatePost } from './postsSlice';
import { useGetPostsQuery } from '../api/apiSlice';

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
    const {
        data: posts = [],
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error,
        //refetch,
    } = useGetPostsQuery();
    
    const sortedPosts = useMemo(() => {
        const sortedPosts = posts.slice();

        sortedPosts.sort((a, b) => b.date.localeCompare(a.date));

        return sortedPosts;
    }, [posts]);

    let content;

    if (isLoading) {
        content = <Spinner text="Loading..." />;
    } else if (isSuccess) {
        const renderedPosts = sortedPosts.map(post => (
            <PostExcerpt key={post.id} post={post} />
        ));

        const containerClassname = classnames('posts-container', {
            disabled: isFetching,
        });

        content = <div className={containerClassname}>{renderedPosts}</div>;
    } else if (isError) {
        content = <div>{error.toString()}</div>;
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {/*<button onClick={refetch}>Refetch Posts</button>*/}
            {content}
        </section>
    );
};

export default PostsList;