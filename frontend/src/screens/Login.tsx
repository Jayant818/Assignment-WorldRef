import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/userSlice";
import { useAppDispatch } from "../redux/store";
import ErrorModal from "../components/ErrorModal";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleLogin = async () => {
		setLoading(true);
		try {
			const userData = { email, password };
			const data = await dispatch(loginUser(userData));

			if (data.payload.message === "User not found") {
				setError(data.payload.message || "Login failed. Please try again.");
				setLoading(false);
				return;
			}

			navigate("/tasks");
		} catch (error) {
			console.error("Error during signup:", error);
			setError("An error occurred. Please try again");
			setLoading(false);
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-task-dark text-white px-4">
			<div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold text-center">Login</h2>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
				/>
				<button
					onClick={handleLogin}
					className="w-full bg-task-red text-white py-2 rounded hover:bg-red-600"
					disabled={loading}
				>
					{loading ? "Logging In" : "Login"}
				</button>
				<div className="text-center">
					<p className="text-sm mt-4">
						Don't have an account?{" "}
						<Link
							to="/signup"
							className="text-task-red hover:text-red-500 underline"
						>
							Create new Account
						</Link>
					</p>
				</div>
			</div>
			{error && <ErrorModal message={error} onClose={() => setError(null)} />}
		</div>
	);
};

export default Login;
