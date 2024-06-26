import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from './app/store';
import { extendedApiSlice } from './features/users/usersSlice';
import Root from './root';

import './index.css';
import './primitiveui.css';

store.dispatch(extendedApiSlice.endpoints.getUsers.initiate(undefined));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <Provider store={store}>
        <Root />
    </Provider>
);