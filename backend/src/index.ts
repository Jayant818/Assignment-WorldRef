import express from "express";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import prisma from "./db";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "jayant";

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.post("/api/v1/signup", async (req, res) => {
	const { username, password, imgUrl, email } = req.body;

	if (!username || !password || !imgUrl || !email) {
		return res.status(400).json({ message: "Please fill all the fields" });
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				username,
				password: hashedPassword,
				imgUrl,
				email,
			},
		});

		const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
		return res
			.cookie("token", token, { httpOnly: true, secure: true })
			.status(201)
			.json({ message: "User created successfully", token });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
});

app.post("/api/v1/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res
			.status(400)
			.json({ message: "Please provide username and password" });
	}

	try {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
		return res
			.cookie("token", token, { httpOnly: true, secure: true })
			.status(200)
			.json({ message: "Login successful", token });
	} catch (e) {
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
	const { token } = req.cookies;

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
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
		const decoded = jwt.verify(token, JWT_SECRET);
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

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
