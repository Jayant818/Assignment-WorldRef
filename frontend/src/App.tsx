import { Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./screens/LandingPage";

function App() {
	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			{/* <Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/tasks" element={<Tasks />} /> */}
		</Routes>
	);
}

export default App;
