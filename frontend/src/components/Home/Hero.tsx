import { Link } from "react-router-dom";

const Hero = () => {
	return (
		<section className="bg-task-dark text-white flex items-center justify-center py-8">
			<div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
				<div className="flex flex-col text-center md:text-left md:pl-10">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
						Manage Your Tasks Efficiently
					</h1>
					<p className="text-base sm:text-lg md:text-xl mb-8">
						Stay on top of your tasks, track progress, and meet deadlines with
						ease.
					</p>
					<Link
						to="/login"
						className="bg-task-red text-white px-3 py-1 text-sm md:text-base  md:px-6 md:py-3  rounded-lg hover:bg-red-600 mx-auto md:mx-0 "
					>
						Get Started
					</Link>
				</div>
				<div className="w-full md:w-[40%] mt-8 md:mt-0">
					<img
						src="/hero-img.png"
						alt="Task Management Hero"
						className="rounded-lg shadow-lg max-w-full h-auto"
					/>
				</div>
			</div>
		</section>
	);
};

export default Hero;
