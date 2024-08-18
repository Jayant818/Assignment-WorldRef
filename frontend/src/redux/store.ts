import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/userSlice";
import { useDispatch, useSelector, useStore } from "react-redux";

const store = configureStore({
	reducer: {
		authReducer,
	},
});

export default store;

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
