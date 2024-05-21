import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registry_service } from '../services/Auth';
import { email_notify } from '../services/Email';
import { RootState } from './Index';
import { UserLogin } from '../Types';

export type EmailNotifyLogin = {
    email: string,
    password: string,
    email_code: string,
    success: boolean,
    is_error: boolean,
    error_msg: string
}

const initialState: EmailNotifyLogin = { email: '', password: '', email_code: '', is_error: false, success: false, error_msg: '' }

export const LoginEmailNotify = createAsyncThunk<void, void, { rejectValue: string }>(
    'userLogin/LoginEmailNotify',
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

export const LoginEmailNotifyCode = createAsyncThunk<void, void, { rejectValue: string }>(
    'userLogin/LoginEmailNotifyCode',
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

const userLoginSlice = createSlice({
    name: 'userLogin',
    initialState,
    reducers: {
        setUserLogin(state, action: PayloadAction<UserLogin>) {
            state.email = action.payload.email
            state.password = action.payload.password
            state.is_error = false
            state.error_msg = ''
            state.success = false
            state.email_code = ''
        },
        setUserCodeLogin(state, action: PayloadAction<string>) {
            state.is_error = false
            state.error_msg = ''
            state.success = false
            state.email_code = action.payload
        },
        resetCodesLogin(state) {
            state.is_error = false
            state.error_msg = ''
            state.success = false
        },
        clearCodesLogin(state) {
            state = initialState
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(LoginEmailNotify.fulfilled, (state, action) => {
                state.success = true
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(LoginEmailNotify.rejected, (state, action) => {
                state.is_error = true
                state.success = false
                if (action.payload) { state.error_msg = action.payload }
            })
            .addCase(LoginEmailNotifyCode.fulfilled, (state, action) => {
                state.success = true
                state.is_error = false
                state.error_msg = ''
            })
            .addCase(LoginEmailNotifyCode.rejected, (state, action) => {
                state.is_error = true
                state.success = false
                if (action.payload) { state.error_msg = action.payload }
            })
    }
});

export const { setUserLogin, setUserCodeLogin, resetCodesLogin, clearCodesLogin } = userLoginSlice.actions;
export default userLoginSlice;
