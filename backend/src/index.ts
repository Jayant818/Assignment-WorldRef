import express, { NextFunction } from "express";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "jayant";

app.use(express.json());

app.use(
	cors({
		origin: "https://assignment-world-ref.vercel.app",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.use(cookieParser());

// const authMiddleware = (req, res, next) => {
// 	const { token } = req.cookies;

// 	if (!token) {
// 		return res.status(401).json({ message: "No token provided" });
// 	}

// 	try {
// 		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
// 		req.userId = decoded.id;
// 		next();
// 	} catch (e) {
// 		console.error(e);
// 		res.status(401).json({ message: "Invalid token" });
// 	}
// };

const signupSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(6),
	imgUrl: z.string().url(),
	email: z.string().email(),
	phone: z.string().min(1),
	countryCode: z.string().min(1),
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

app.get("/", (req, res) => {
	res.json({ message: "Welcome to My API " });
});

app.get("/api/v1/check-auth", (req, res) => {
	if (req.cookies.token) {
		res.status(200).json({ authenticated: true });
	} else {
		res.status(401).json({ authenticated: false });
	}
});

app.get("/api/v1/user", async (req, res) => {
	console.log("Cookies received:", req.cookies);
	const { token } = req.cookies;

	if (!token) {
		console.log("No token provided");
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		const userId = decoded.id;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				username: true,
				email: true,
				phone: true,
				countryCode: true,
				imgUrl: true,
			},
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ user });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.post("/api/v1/signup", async (req, res) => {
	try {
		const validatedData = signupSchema.parse(req.body);
		const { username, password, imgUrl, email, phone, countryCode } =
			validatedData;

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				username,
				email,
				phone,
				countryCode,
				password: hashedPassword,
				imgUrl,
			},
		});

		const token = jwt.sign({ id: user.id }, JWT_SECRET);
		return res
			.cookie("token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "none",
				path: "/",
			})
			.status(201)
			.json({
				message: "User created successfully",
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					phone: user.phone,
					countryCode: user.countryCode,
					imgUrl: user.imgUrl,
				},
			});
	} catch (e) {
		if (e instanceof z.ZodError) {
			return res
				.status(400)
				.json({ message: "Invalid input", errors: e.errors });
		}
		console.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
});

app.post("/api/v1/login", async (req, res) => {
	try {
		const validatedData = loginSchema.parse(req.body);
		const { email, password } = validatedData;

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ id: user.id }, JWT_SECRET);
		return res
			.cookie("token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "none",
				path: "/",
			})
			.status(200)
			.json({
				message: "Login successful",
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					phone: user.phone,
					countryCode: user.countryCode,
					imgUrl: user.imgUrl,
				},
			});
	} catch (e) {
		if (e instanceof z.ZodError) {
			return res
				.status(400)
				.json({ message: "Invalid input", errors: e.errors });
		}
		console.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
});

app.post("/api/v1/tasks", async (req, res) => {
	const { token } = req.cookies;
	const { title, description, dueDate, status } = req.body;

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		const userId = decoded.id;

		const task = await prisma.task.create({
			data: {
				title,
				description,
				dueDate: new Date(dueDate),
				status,
				userId,
			},
		});

		res.status(201).json({ message: "Task created successfully", task });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.get("/api/v1/tasks", async (req, res) => {
	console.log("Cookies received:", req.cookies);
	const { token } = req.cookies;
	if (!token) {
		console.log("No token provided");
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		const userId = decoded.id;

		const tasks = await prisma.task.findMany({
			where: { userId },
		});

		res.status(200).json({ tasks });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.put("/api/v1/tasks/:id", async (req, res) => {
	const { id } = req.params;
	const { token } = req.cookies;
	const { title, description, dueDate, status } = req.body;

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		const userId = decoded.id;

		const task = await prisma.task.update({
			where: { id: parseInt(id), userId },
			data: { title, description, dueDate: new Date(dueDate), status },
		});

		res.status(200).json({ message: "Task updated successfully", task });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.delete("/api/v1/tasks/:id", async (req, res) => {
	const { id } = req.params;
	const { token } = req.cookies;

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		const userId = decoded.id;

		await prisma.task.delete({
			where: { id: parseInt(id), userId },
		});

		res.status(200).json({ message: "Task deleted successfully" });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.post("/api/v1/logout", (req, res) => {
	res
		.clearCookie("token")
		.status(200)
		.json({ message: "Logged out successfully" });
});

const PORT = 3000;

if (require.main === module) {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
