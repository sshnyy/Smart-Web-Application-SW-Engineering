import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetPostQuery, useEditPostMutation } from '../api/apiSlice';
import Spinner from '../../components/Spinner';

const EditPostForm = () => {
    const { postId } = useParams();

    const { data: post } = useGetPostQuery(postId as string);

    const [updatePost, { isLoading }] = useEditPostMutation();

    const [title, setTitle] = useState(post!.title);
    const [content, setContent] = useState(post!.content);

    const navigate = useNavigate();

    const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);

    const onSavePostClicked = async () => {
        if (title && content) {
            await updatePost({ id: postId as string, title, content });
            navigate(`/posts/${postId}`);
        }
    };

    const spinner = isLoading ? <Spinner text="Saving..." /> : null;

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    placeholder="What's on your mind?"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
            </form>
            <button type="button" onClick={onSavePostClicked}>
                Save Post
            </button>
            {spinner}
        </section>
    );
};

export default EditPostForm;