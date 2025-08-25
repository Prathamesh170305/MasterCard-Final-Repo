import NavLink from "./NavLink";

const NavBar = () => {
	return (
		<nav className="bg-white py-5 flex flex-col md:flex-row p-3 gap-2 justify-around items-center border-[#FD6500] border-b-3">
			<p className="text-3xl font-extrabold font-[integralCF]">Y4D Foundation</p>
			<div>
				<NavLink name="Home" />
				<NavLink name="Shop" />
				<NavLink name="New Arrivals" />
				<NavLink name="Brands" />
			</div>
		</nav>
	)
}

export default NavBar;