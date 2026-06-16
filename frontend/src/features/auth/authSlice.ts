import { SetUserActionPayload } from '@/features/auth/actionTypes';
import { getUserFromStorage, setUserInStorage } from '@/lib/authStorage';
import { RootState } from '@/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IAuthSliceInitialState {
  user: ReturnType<typeof getUserFromStorage>;
}

const initialState: IAuthSliceInitialState = {
  user: getUserFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserActionPayload>) => {
      state.user = action.payload.user;
      setUserInStorage(state.user);
    },
    logOutUser: (state) => {
      state.user = null;
      setUserInStorage(null);
    },
  },
});

export const { setUser, logOutUser } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
