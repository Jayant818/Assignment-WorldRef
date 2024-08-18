import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { logoutUser } from "../../redux/slices/userSlice";

const Navbar = () => {
	const data = useAppSelector((store) => store.authReducer);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	console.log(data);

	const handleLogOut = () => {
		dispatch(logoutUser());
		navigate("/");
	};

	return (
		<nav className="bg-task-dark text-white p-4">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/" className="text-lg md:text-2xl font-bold text-task-red">
					Task Management
				</Link>
				<div className="flex items-center gap-4">
					{data.status === "success" ? (
						<div className="flex items-center space-x-4">
							<Link to="/profile">
								<img
									// @ts-ignore
									src={data.user && data.user.imgUrl}
									alt="Profile"
									className="w-20 h-16 rounded-full"
								/>
							</Link>
							<button
								onClick={handleLogOut}
								className="bg-task-red text-white px-4 py-2 rounded-lg hover:bg-red-600 mx-auto md:mx-0 w-fit"
							>
								Logout
							</button>
						</div>
					) : (
						<div className="space-x-4">
							<Link
								to="/login"
								className="bg-task-red text-white px-4 py-2 rounded-lg hover:bg-red-600 mx-auto md:mx-0 w-fit"
							>
								Login
							</Link>
							<Link
								to="/signup"
								className="bg-task-red text-white px-4 py-2 rounded-lg hover:bg-red-600 mx-auto md:mx-0 w-fit"
							>
								Signup
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
