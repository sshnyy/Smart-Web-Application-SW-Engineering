import React from 'react';
import { Link, useParams } from 'react-router-dom';

import Spinner from '../../components/Spinner';
import PostAuthor from './postAuthor';
import TimeAgo from './timeAgo';
import ReactionButtons from './reactionButtons';
import { useGetPostQuery } from '../api/apiSlice';

const SinglePostPage = () => {
    const { postId } = useParams();

    const { data: post, isFetching, isSuccess } = useGetPostQuery(postId as string);

    let content;

    if (isFetching) {
        content = <Spinner text="Loading..." />;
    } else if (isSuccess) {
        content = (
            <section>
                <article className="post">
                    <h2>{post.title}</h2>
                    <div>
                        <PostAuthor userId={post.user} />
                        <TimeAgo timestamp={post.date} />
                    </div>
                    <p className="post-content">{post.content}</p>
                    <ReactionButtons post={post} />
                    <Link to={`/editPost/${post.id}`} className="button">
                        Edit Post
                    </Link>
                </article>
            </section>
        );
    }

    return <section>{content}</section>;
};

export default SinglePostPage;