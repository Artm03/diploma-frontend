import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { RootState } from './Index';
import { UserLogin, UserProfile } from '../Types';

export type UserMe = {
    email: string,
    first_name: string,
    last_name: string,
    success: boolean,
    disabled: boolean,
    is_error: boolean,
    error_msg: string
}

const initialState: UserMe = { email: '', first_name: '', last_name: '', is_error: false, success: false, error_msg: '', disabled: false }


export const GetUserMe = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
    'userProfile/GetUserMe',
    async (_, thunkAPI) => {
        try {
            const user: UserProfile = await registry_service.get_user()
            return user
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.message ?? 'unknown error');
        }
    },
)


const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        resetState(state) {
            state.success = false
            state.is_error = false
            state.error_msg = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetUserMe.fulfilled, (state, action) => {
                state.email = action.payload.email
                state.first_name = action.payload.first_name
                state.last_name = action.payload.last_name
                state.disabled = action.payload.disabled
                state.success = true
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(GetUserMe.rejected, (state, action) => {
                state.success = false
                state.is_error = true
                if (action.payload) { state.error_msg = action.payload }
            })
    }
});

export const { resetState } = userProfileSlice.actions;
export default userProfileSlice;
