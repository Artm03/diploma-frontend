import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { RootState } from './Index';
import { UserRegistry } from '../Types';

export type EmailNotifyRegistry = {
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    email_code: string,
    success: boolean,
    is_error: boolean,
    error_msg: string
}

const initialState: EmailNotifyRegistry = { email: '', first_name: '', last_name: '', password: '', email_code: '', is_error: false, success: false, error_msg: '' }

export const EmailNotify = createAsyncThunk<void, string, { rejectValue: string }>(
    'users/EmailNotify',
    async (email: string, thunkAPI) => {
        try {
            await email_notify.registry(email)
            return
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.message ?? 'unknown error');
        }
    },
)

export const EmailNotifyCode = createAsyncThunk<void, void, { rejectValue: string }>(
    'users/EmailNotifyCode',
    async (_, thunkAPI) => {
        try {
            const state = (thunkAPI.getState() as RootState).cart
            await registry_service.registry(state.email, state.first_name, state.last_name, state.password, state.email_code)
            return
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.message ?? 'unknown error');
        }
    },
)

const cartSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserRegistry>) {
            state.email = action.payload.email
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.password = action.payload.password
            state.is_error = false
            state.error_msg = ''
            state.success = false
            state.email_code = ''
        },
        setUserCode(state, action: PayloadAction<string>) {
            state.is_error = false
            state.error_msg = ''
            state.success = false
            state.email_code = action.payload
        },
        resetCodes(state) {
            state.is_error = false
            state.error_msg = ''
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(EmailNotify.fulfilled, (state, action) => {
                state.success = true
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(EmailNotify.rejected, (state, action) => {
                state.is_error = true
                state.success = false
                if (action.payload) { state.error_msg = action.payload }
            })
            .addCase(EmailNotifyCode.fulfilled, (state, action) => {
                state.success = true
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(EmailNotifyCode.rejected, (state, action) => {
                state.is_error = true
                state.success = false
                if (action.payload) { state.error_msg = action.payload }
            })
    }
});

export const { setUser, setUserCode, resetCodes } = cartSlice.actions;
export default cartSlice;
