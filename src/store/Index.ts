import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import cartSlice from './CartSlice';
import userLoginSlice from './UserLogin';
import { useState } from 'react';
import recoverySlice from './UserRecover';
import userProfileSlice from './UserMe';
import getImagesSlice from './ImageList';
import getGalleriesSlice from './GalleryList';

const store = configureStore({
  reducer: { 
    cart: cartSlice.reducer,
    user_login: userLoginSlice.reducer,
    user_recovery: recoverySlice.reducer,
    user_profile: userProfileSlice.reducer,
    image_list: getImagesSlice.reducer,
    gallery_list: getGalleriesSlice.reducer,
  }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
