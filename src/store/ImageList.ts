import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { RootState } from './Index';
import { UserLogin } from '../Types';
import { neuro_images } from '../services/Neuro';
import { ImagesList } from '../Types';

export type ImagesTypeState = {
    images: ImagesList,
    success: boolean,
    is_error: boolean,
    error_msg: string
}

const initialState: ImagesTypeState = { images: { items: [] }, success: false, is_error: false, error_msg: '' }

export const GetImages = createAsyncThunk<ImagesList, string, { rejectValue: string }>(
    'images/GetImages',
    async (gallery_id, thunkAPI) => {
        try {
            const response: ImagesList = await neuro_images.getFiles(gallery_id)
            return response
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.message ?? 'unknown error');
        }
    },
)

export const CallCreateImagesDetect = createAsyncThunk<void, any, { rejectValue: string }>(
    'images/CallCreateImagesDetect',
    async (data, thunkAPI) => {
        try {
            await neuro_images.detectFiles(data.formData, data.galleryId || '')
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.message ?? 'unknown error');
        }
    },
)

export const CallCreateImagesUpload = createAsyncThunk<void, any, { rejectValue: string }>(
    'images/CallCreateImagesUpload',
    async (data, thunkAPI) => {
        try {
            neuro_images.uploadFiles(data.formData, data.galleryId || '')
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.message ?? 'unknown error');
        }
    },
)

export const CallDeleteGallery = createAsyncThunk<void, string, { rejectValue: string }>(
    'images/CallDeleteGallery',
    async (data, thunkAPI) => {
        try {
            await neuro_images.deleteGallery(data)
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.message ?? 'unknown error');
        }
    },
)

const getImagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        resetImages(state) {
            state.images = { items: [] }
            state.is_error = false
            state.error_msg = ''
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetImages.fulfilled, (state, action) => {
                state.images = action.payload
                state.success = true
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(GetImages.rejected, (state, action) => {
                state.is_error = true
                state.success = false
                if (action.payload) { state.error_msg = action.payload }
            })
            .addCase(CallCreateImagesDetect.fulfilled, (state, action) => {
                state.success = true
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(CallCreateImagesDetect.rejected, (state, action) => {
                state.success = false
                state.is_error = true
                if (action.payload) { state.error_msg = action.payload }
            })

            .addCase(CallCreateImagesUpload.fulfilled, (state, action) => {
                state.success = true
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(CallCreateImagesUpload.rejected, (state, action) => {
                state.success = false
                state.is_error = true
                if (action.payload) { state.error_msg = action.payload }
            })

            .addCase(CallDeleteGallery.fulfilled, (state, action) => {
                state.success = false
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(CallDeleteGallery.rejected, (state, action) => {
                state.success = false
                state.is_error = true
                if (action.payload) { state.error_msg = action.payload }
            })
    }
});

export const { resetImages } = getImagesSlice.actions;
export default getImagesSlice;
