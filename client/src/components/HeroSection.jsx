import HeroContent from './HeroContent'

export default function HeroSection() {
	return (
		<section
			data-testid="hero-img"
			className="md:h-[80vh] bg-[length:180px] bg-right-bottom md:bg-contain bg-no-repeat md:bg-right bg-blush pb-8"

		>
			<HeroContent />
		</section>
	)
}