import { Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./screens/LandingPage";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import UserProfile from "./screens/UserProfile";
import { useEffect } from "react";
import { useAppDispatch } from "./redux/store";
import { initializeAuth } from "./redux/slices/userSlice";
import Tasks from "./screens/Tasks";

function App() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(initializeAuth());
	}, [dispatch]);
	return (
		<div className="bg-task-dark text-white min-h-screen">
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/tasks" element={<Tasks />} />
				<Route path="/profile" element={<UserProfile />} />
			</Routes>
		</div>
	);
}

export default App;
