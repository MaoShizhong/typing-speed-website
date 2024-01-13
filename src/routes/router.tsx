import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { Profile } from '../pages/Profile';
import { Test } from '../pages/Test';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Test /> },
            { path: '/:username', element: <Profile /> },
        ],
    },
]);