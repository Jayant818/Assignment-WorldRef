import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../../constants";

interface UserData {
	username: string;
	email: string;
	password: string;
	phone: string;
	countryCode: string;
	imgUrl: string;
}

export const signupUser = createAsyncThunk(
	"user/signup",
	async (userData: UserData) => {
		const response = await fetch(`${BACKEND_URL}/api/v1/signup`, {
			method: "POST",
			body: JSON.stringify(userData),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
		const data = await response.json();

		if (response.ok) {
			localStorage.setItem("user", JSON.stringify(data.user));
		}

		return data;
	}
);

interface LoginData {
	email: string;
	password: string;
}

export const loginUser = createAsyncThunk(
	"user/login",
	async (loginData: LoginData) => {
		const response = await fetch(`${BACKEND_URL}/api/v1/login`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(loginData),
		});

		const data = await response.json();
		if (response.ok) {
			localStorage.setItem("user", JSON.stringify(data.user));
		}
		return data;
	}
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
	const response = await fetch(`${BACKEND_URL}/api/v1/logout`, {
		method: "POST",
		credentials: "include",
	});

	if (response.ok) {
		localStorage.removeItem("user");
	}

	return await response.json();
});

const initializeAuth = createAsyncThunk("user/initializeAuth", async () => {
	const user = localStorage.getItem("user");

	if (user) {
		return { user: JSON.parse(user) };
	}

	return { user: null };
});

const userSlice = createSlice({
	name: "user",
	initialState: { user: null, status: "idle", error: null },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(signupUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.status = "success";
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.status = "success";
			})
			.addCase(
				initializeAuth.fulfilled,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(state, action: PayloadAction<{ user: any }>) => {
					state.user = action.payload.user;
					state.status = action.payload.user ? "success" : "idle";
				}
			)
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.status = "idle";
			});
	},
});

export const authReducer = userSlice.reducer;
export { initializeAuth };
