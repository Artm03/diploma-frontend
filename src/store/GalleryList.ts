import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { RootState } from './Index';
import { UserLogin } from '../Types';
import { neuro_images } from '../services/Neuro';
import { GalleriesList } from '../Types';

export type GalleriesTypeState = {
    galleries: GalleriesList,
    success: boolean,
    is_error: boolean,
    error_msg: string
}

const initialState: GalleriesTypeState = { galleries: {items: []}, success: false, is_error: false, error_msg: ''}

export const GetGalleries = createAsyncThunk<GalleriesList, void, { rejectValue: string }>(
    'galleries/GetGalleries',
    async (data, thunkAPI) => {
        try {
            const response: GalleriesList = await neuro_images.getGalleries()
            return response
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.message ?? 'unknown error');
        }
    },
)

export const CallCreateGallery = createAsyncThunk<void, any, { rejectValue: string }>(
    'galleries/CallCreateGallery',
    async (data, thunkAPI) => {
        try {
            await neuro_images.createGallery(data.name, data.description)
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.message ?? 'unknown error');
        }
    },
)


const getGalleriesSlice = createSlice({
    name: 'galleries',
    initialState,
    reducers: {
        resetGallery(state) {
            state.galleries = {items: []}
            state.is_error = false
            state.error_msg = ''
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetGalleries.fulfilled, (state, action) => {
                state.galleries = action.payload
                state.success = true
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(GetGalleries.rejected, (state, action) => {
                state.is_error = true
                state.success = false
                if (action.payload) { state.error_msg = action.payload }
            })
            .addCase(CallCreateGallery.fulfilled, (state, action) => {
                state.galleries = {items: []}
                state.success = false
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(CallCreateGallery.rejected, (state, action) => {
                state.is_error = true
                state.success = false
                if (action.payload) { state.error_msg = action.payload }
            })
    }
});

export const { resetGallery } = getGalleriesSlice.actions;
export default getGalleriesSlice;
