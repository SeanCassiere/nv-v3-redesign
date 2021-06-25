import { createAsyncThunk } from "@reduxjs/toolkit";
import appAxiosInstance from "../../api/appAxiosInstance";

import { Alert } from "rsuite";

import { RootState } from "../store";
import { ReservationStatus, AgreementStatus, VehicleStatus } from "../../interfaces/statuses";
import { AgreementType, ReservationType } from "../../interfaces/types";

export const fetchReservationStatusesThunk = createAsyncThunk(
	"appKeyValues/fetchReservationStatuses",
	async (_, thunkApi) => {
		const { authUser } = thunkApi.getState() as RootState;

		if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

		try {
			const { data } = await appAxiosInstance.get<ReservationStatus[]>("/Reservations/Statuses", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
			});

			return data;
		} catch (error) {
			Alert.error("Fetching the reservation statuses failed");
			return thunkApi.rejectWithValue("Fetching the reservation statuses failed");
		}
	}
);

export const fetchReservationTypesThunk = createAsyncThunk(
	"appKeyValues/fetchReservationTypes",
	async (_, thunkApi) => {
		const { authUser } = thunkApi.getState() as RootState;

		if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

		try {
			const { data } = await appAxiosInstance.get<ReservationType[]>("/Reservations/Types", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
				params: {
					clientId: authUser.clientId,
				},
			});

			return data;
		} catch (error) {
			Alert.error("Fetching the reservation types failed");
			return thunkApi.rejectWithValue("Fetching the reservation types failed");
		}
	}
);

export const fetchReservationKeyValuesThunk = createAsyncThunk(
	"appKeyValues/fetchReservationKeyValues",
	async (_, thunkApi) => {
		await thunkApi.dispatch(fetchReservationStatusesThunk());
		await thunkApi.dispatch(fetchReservationTypesThunk());
		return true;
	}
);

export const fetchAgreementStatusesThunk = createAsyncThunk(
	"appKeyValues/fetchAgreementStatuses",
	async (_, thunkApi) => {
		const { authUser } = thunkApi.getState() as RootState;

		if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

		try {
			const { data } = await appAxiosInstance.get<AgreementStatus[]>("/Agreements/Statuses", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
			});

			return data;
		} catch (error) {
			Alert.error("Fetching the agreement statuses failed");
			return thunkApi.rejectWithValue("Fetching the agreement statuses failed");
		}
	}
);

export const fetchAgreementTypesThunk = createAsyncThunk("appKeyValues/fetchAgreementTypes", async (_, thunkApi) => {
	const { authUser } = thunkApi.getState() as RootState;

	if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

	try {
		const { data } = await appAxiosInstance.get<AgreementType[]>("/Agreements/Types", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
			params: {
				clientId: authUser.clientId,
			},
		});

		return data;
	} catch (error) {
		Alert.error("Fetching the agreement types failed");
		return thunkApi.rejectWithValue("Fetching the agreement types failed");
	}
});

export const fetchAgreementKeyValuesThunk = createAsyncThunk(
	"appKeyValues/fetchAgreementKeyValues",
	async (_, thunkApi) => {
		await thunkApi.dispatch(fetchAgreementStatusesThunk());
		await thunkApi.dispatch(fetchAgreementTypesThunk());
		return true;
	}
);

export const fetchVehicleStatusesThunk = createAsyncThunk("appKeyValues/fetchVehicleStatuses", async (_, thunkApi) => {
	const { authUser } = thunkApi.getState() as RootState;

	if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

	try {
		const { data } = await appAxiosInstance.get<VehicleStatus[]>("/Vehicles/Statuses", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
		});

		return data;
	} catch (error) {
		Alert.error("Fetching the vehicle statuses failed");
		return thunkApi.rejectWithValue("Fetching the vehicle statuses failed");
	}
});
