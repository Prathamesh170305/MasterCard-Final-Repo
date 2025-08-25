import { Link } from "react-router-dom"

export default function HeroContent() {
	return (
		<>
			<div className="pt-[6%] pl-[10%] md:max-w-[70%]">
				<div className="text-4xl md:text-8xl  pb-2">
					<h1>Empowering Youth</h1>
					<h1>Transforming Lives</h1>
					<h1>Building Futures</h1>
				</div>
				<p className="text-gray-600 pb-5">
					Y4D Foundation is a youth led organization working on empowering the underprivileged section of our society.
				</p>
				<button className="bg-night text-white px-10 py-3 rounded-2xl">
					<Link to="/shop">
						Join Us
					</Link>
				</button>
			</div>
			<div></div>
		</>
	)
}