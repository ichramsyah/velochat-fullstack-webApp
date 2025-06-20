// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SkeletonTheme } from 'react-loading-skeleton';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './index.css';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginSuccessPage from './pages/LoginSuccessPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import GroupPage from './pages/GroupPage.jsx';

import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import PublicRoute from './components/auth/PublicRoute.jsx';
import MainLayout from './layouts/MainLayout.jsx';

const router = createBrowserRouter([
  {
    path: '/',

    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <ChatPage />,
      },
      {
        path: '/group',
        element: <GroupPage />,
      },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/login-success',
    element: <LoginSuccessPage />,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);

const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </SkeletonTheme>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
