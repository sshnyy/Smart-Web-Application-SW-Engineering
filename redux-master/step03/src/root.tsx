import React from 'react';

import Navbar from './app/navbar';
import AddPostForm from './features/posts/addPostForm';
import PostsList from './features/posts/postsList';

function Root() {
    return (
        <div>
            <Navbar />
            <React.Fragment>
                <AddPostForm />
                <PostsList />
            </React.Fragment>
        </div>
    );
}

export default Root;