import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";

export const useAuthRedirect = () => {
	const navigate = useNavigate();
	const authStatus = useAppSelector((store) => store.authReducer.status);

	useEffect(() => {
		if (authStatus !== "success") {
			navigate("/");
		}
	}, [authStatus, navigate]);

	return authStatus === "success";
};
