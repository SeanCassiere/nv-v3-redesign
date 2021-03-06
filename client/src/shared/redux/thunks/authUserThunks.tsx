import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import jwtDecode from "jwt-decode";
import { toaster, Message } from "rsuite";

import { LOCAL_STORAGE_FUNCTIONS } from "../../utils/functions";
import { RootState } from "../store";
import { AuthReturn, RefreshReturn, JWTReturnAuthToken } from "../../interfaces/authentication";
import { setAuthUserError, setAuthUserPermissions } from "../slices/authUserSlice";
import appAxiosInstance from "../../api/appAxiosInstance";

const AUTH_URL = process.env.REACT_APP_SERVER_URL || "";

export const loginUserThunk = createAsyncThunk(
	"authUser/fetchLogin",
	async ({ username, password }: { username: string; password: string }, thunkApi) => {
		try {
			const { data } = await axios.post<AuthReturn>(`${AUTH_URL}/users/login`, {
				username,
				password,
			});

			try {
				LOCAL_STORAGE_FUNCTIONS.setTokenToLocalStorage(data.token);
				LOCAL_STORAGE_FUNCTIONS.setRefreshTokenToLocalStorage(data.refreshToken);
			} catch (error) {
				toaster.push(<Message type='error'>Could not save the tokens to local storage</Message>);
				return thunkApi.rejectWithValue("Could not save the tokens to local storage");
			}

			try {
				const decoded: JWTReturnAuthToken = jwtDecode(data.token);
				const { client_navotar_clientid, client_navotar_userid, exp } = decoded;

				return {
					token: data.token,
					refreshToken: data.refreshToken,
					clientId: client_navotar_clientid,
					userId: client_navotar_userid,
					tokenExpiresAt: exp,
				};
			} catch (error) {
				toaster.push(<Message type='error'>Could not decode and save the access token</Message>);
				return thunkApi.rejectWithValue("Could not decode and save the access token");
			}
		} catch (error) {
			const err = error as AxiosError;
			thunkApi.dispatch(setAuthUserError(err?.response?.data?.message));
			return thunkApi.rejectWithValue(err?.response?.data?.message);
		}
	}
);

export const refreshAuthTokenThunk = createAsyncThunk("authUser/fetchNewAccessToken", async (_, thunkApi) => {
	const state = thunkApi.getState() as RootState;
	const { refreshToken } = state.authUser;

	const response = await axios.get<RefreshReturn>(`${AUTH_URL}/users/navotar/refresh`, {
		headers: { Authorization: `Bearer ${refreshToken}` },
	});

	if (response.status !== 200) {
		toaster.push(
			<Message type='error'>
				There was an error refreshing your access token, you will be logged out in less than 30 seconds
			</Message>
		);
		return thunkApi.rejectWithValue(
			"There was an error refreshing your access token, you will be logged out in less than 30 seconds"
		);
	}

	const data = response.data;

	try {
		LOCAL_STORAGE_FUNCTIONS.setTokenToLocalStorage(data.token);
	} catch (error) {
		toaster.push(<Message type='error'>Could not save the refreshed token to local storage</Message>);
		return thunkApi.rejectWithValue("Could not save the tokens to local storage");
	}

	try {
		const decoded: JWTReturnAuthToken = jwtDecode(data.token);
		const { exp } = decoded;
		return {
			token: data.token,
			tokenExpiresAt: exp,
		};
	} catch (error) {
		toaster.push(<Message type='error'>Could not decode and save the access token</Message>);
		return thunkApi.rejectWithValue("Could not decode the access token");
	}
});

export const fetchAuthUserPermissions = createAsyncThunk("authUser/fetchPermissions", async (_, thunkApi) => {
	const { authUser } = thunkApi.getState() as RootState;
	try {
		const { data } = await appAxiosInstance.get<Array<string>>(`/Users/${authUser.userId}/Permissions`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
			params: { clientId: authUser.clientId },
		});

		thunkApi.dispatch(setAuthUserPermissions(data));
		return true;
	} catch (error) {
		const err = error as AxiosError;
		thunkApi.dispatch(setAuthUserError(err?.response?.data?.message));
		return thunkApi.rejectWithValue(err?.response?.data?.message);
	}
});
