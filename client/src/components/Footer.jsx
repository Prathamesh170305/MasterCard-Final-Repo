import FooterList from "./FooterList"

import { Instagram, Linkedin, Github, Facebook } from "lucide-react"

export default function Footer() {
	return (
		<footer className="bg-blush py-10 pb-3 px-6 md:px-20">
			<div className="flex flex-col md:flex-row justify-between gap-10">
				<div className="max-w-md">
					<h2 className="text-3xl font-[integralCF]">Y4D Foundation</h2>
					<p className="pt-4 text-gray-600 leading-relaxed">
						Discover curated fashion at Shop.EZ — designed to match your style and enhance your confidence.
					</p>
					<div className="flex gap-4 pt-6">
						<Instagram
							className="hover:text-night transition-colors duration-200 cursor-pointer"
							data-testid="lucide-icon"
						/>
						<Linkedin
							className="hover:text-night transition-colors duration-200 cursor-pointer"
							data-testid="lucide-icon"
						/>
						<Github
							className="hover:text-night transition-colors duration-200 cursor-pointer"
							data-testid="lucide-icon"
						/>
						<Facebook
							className="hover:text-night transition-colors duration-200 cursor-pointer"
							data-testid="lucide-icon"
						/>
					</div>

				</div>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-5">
					<FooterList heading="COMPANY" list={["About", "Careers", "Contact", "Features"]} />
					<FooterList heading="HELP" list={["Customer Support", "Delivery Details", "Terms and Conditions", "Privacy Policy"]} />
					<FooterList heading="FAQ" list={["Account", "Manage Deliveries", "Orders", "Payments"]} />
					<FooterList heading="RESOURCES" list={["Free Ebooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"]} />
				</div>
			</div>
			<div className="text-center pt-10 text-xs text-gray-500">
				Y4D Foundation © 2025, All Rights Reserved
			</div>
		</footer>
	)
}