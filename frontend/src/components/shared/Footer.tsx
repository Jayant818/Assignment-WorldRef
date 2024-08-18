const Footer = () => {
	return (
		<footer className="bg-task-dark text-white text-center py-4 md:pt-20 md:pb-[1.06rem] pt-10">
			<p className="text-sm md:text-base">
				&copy; {new Date().getFullYear()} Task Management App. All rights
				reserved.
			</p>
		</footer>
	);
};

export default Footer;
