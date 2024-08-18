const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
	return (
		<input
			type="text"
			placeholder="Search Tasks"
			onChange={(e) => onSearch(e.target.value)}
			className="w-full p-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded focus:outline-none focus:border-white text-sm sm:text-base md:text-lg lg:text-xl"
		/>
	);
};

export default SearchBar;
