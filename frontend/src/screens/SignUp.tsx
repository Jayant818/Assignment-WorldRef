import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../redux/slices/userSlice";
import { useAppDispatch } from "../redux/store";
import ErrorModal from "../components/ErrorModal";

const SignUp = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [countryCode, setCountryCode] = useState("");
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const [imageUrl, setImageUrl] = useState("");

	const dispatch = useAppDispatch();

	const handleSignUp = async () => {
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setLoading(true);
		try {
			console.log("Imageurl", imageUrl);

			const userData = {
				username,
				email,
				password,
				phone: phone,
				countryCode: countryCode,
				imgUrl: imageUrl,
			};

			console.log(userData);

			const data = await dispatch(signupUser(userData));
			console.log("Data", data);
			if (!data.payload.user.id) {
				setError(data.payload.message || "Signup failed. Please try again.");
				setLoading(false);
				return;
			}

			navigate("/tasks");
		} catch (error) {
			setLoading(false);
			console.error("Error during signup:", error);
			setError("An error occurred. Please try again");
		}
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setProfileImage(e.target.files[0]);
			console.log(profileImage);
			try {
				const formData = new FormData();
				formData.append("file", e.target.files[0]);
				formData.append("upload_preset", "task-app");
				formData.append("cloud_name", "webd-bootcamp");

				const res = await fetch(
					"https://api.cloudinary.com/v1_1/webd-bootcamp/image/upload",
					{
						method: "POST",
						body: formData,
					}
				);

				const ans = await res.json();
				setImageUrl(ans.url);
			} catch (e) {
				console.log(e);
			}
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-task-dark text-white px-4">
			<div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold text-center">Sign Up</h2>
				<div className="relative w-full">
					<label className="block text-sm font-medium text-gray-300 mb-1">
						Upload Image
					</label>
					<input
						type="file"
						onChange={handleImageUpload}
						className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
				/>
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
				<input
					type="password"
					placeholder="Confirm Password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Country Code"
					value={countryCode}
					onChange={(e) => setCountryCode(e.target.value)}
					className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Phone Number"
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
				/>

				<button
					onClick={handleSignUp}
					disabled={loading}
					className="w-full bg-task-red text-white py-2 rounded hover:bg-red-600"
				>
					{loading ? "Signing Up" : "Sign Up"}
				</button>
				<div className="text-center">
					<p className="text-sm mt-4">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-task-red hover:text-red-500 underline"
						>
							Log in
						</Link>
					</p>
				</div>
			</div>
			{error && <ErrorModal message={error} onClose={() => setError(null)} />}
		</div>
	);
};

export default SignUp;
