import React from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Registry from './pages/Registry';
import EmailRegistry from './pages/EmailRegistry';
import Login from './pages/Login';
import EmailLogin from './pages/EmailLogin';
import UserPage from './pages/UserPage';
import PrivateRoute from './PrivateRoute';
import ImagesList from './pages/ImagesList';
import GalleryList from './pages/GalleryList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<UserPage />} />
          <Route path='/gallery' element={<GalleryList />} />
          <Route path='/images/:galleryId' element={<ImagesList />} />
        </Route>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<EmailLogin />} />
        <Route path='/registry-email' element={<Registry />} />
        <Route path='/registry' element={<EmailRegistry />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
