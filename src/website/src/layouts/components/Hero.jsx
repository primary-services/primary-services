export const Hero = ({ children }) => {
	return (
		<section className="hero">
			<div className="flex-container">
				<div className="tagline">
					<h2>It's Out Democracy</h2>
					<h3>Make your voice heard</h3>
				</div>
				<div className="hero-image">
					<div className="hero-content">
						<img src="/images/image 3.png" />
						<a href="#">Find candidates in my district →</a>
					</div>
				</div>
				<div className="hero-image">
					<div className="hero-content">
						<img src="/images/image 1.png" />
						<a href="#">Become a candidate →</a>
					</div>
				</div>
			</div>
		</section>
	);
};
