import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { RootState } from './Index';
import { UserLogin } from '../Types';

export type EmailRecovery = {
    email: string,
    password: string,
    email_code: string,
    success: boolean,
    is_error: boolean,
    error_msg: string
}

const initialState: EmailRecovery = { email: '', password: '', email_code: '', is_error: false, success: false, error_msg: '' }

export const RecoveryNotify = createAsyncThunk<void, void, { rejectValue: string }>(
    'users/EmailNotify',
    async (_, thunkAPI) => {
        try {
            const state = (thunkAPI.getState() as RootState).user_login
            await email_notify.login(state.email, state.password)
            return
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.message ?? 'unknown error');
        }
    },
)

export const RecoveryNotifyCode = createAsyncThunk<void, void, { rejectValue: string }>(
    'users/EmailNotifyCode',
    async (_, thunkAPI) => {
        try {
            const state = (thunkAPI.getState() as RootState).user_login
            await registry_service.login(state.email, state.password, state.email_code)
            return
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.message ?? 'unknown error');
        }
    },
)

const recoverySlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUserRecovery(state, action: PayloadAction<UserLogin>) {
            state.email = action.payload.email
            state.password = action.payload.password
            state.is_error = false
            state.error_msg = ''
            state.success = false
            state.email_code = ''
        },
        setUserCodeRecovery(state, action: PayloadAction<string>) {
            state.is_error = false
            state.error_msg = ''
            state.success = false
            state.email_code = action.payload
        },
        resetCodesRecovery(state) {
            state.is_error = false
            state.error_msg = ''
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(RecoveryNotify.fulfilled, (state, action) => {
                state.success = true
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(RecoveryNotify.rejected, (state, action) => {
                state.is_error = true
                state.success = false
                if (action.payload) { state.error_msg = action.payload }
            })
            .addCase(RecoveryNotifyCode.fulfilled, (state, action) => {
                state.success = true
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(RecoveryNotifyCode.rejected, (state, action) => {
                state.is_error = true
                state.success = false
                if (action.payload) { state.error_msg = action.payload }
            })
    }
});

export const { setUserRecovery, setUserCodeRecovery, resetCodesRecovery } = recoverySlice.actions;
export default recoverySlice;
