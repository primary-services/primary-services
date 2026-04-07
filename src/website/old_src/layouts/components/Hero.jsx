// Not sure this actually needs to be part of a layout, but I assume
// we might be doing more with the landing page in the future

import { useNavigate } from "react-router";

export const Hero = ({ children }) => {
	const navigate = useNavigate();

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
						<a
							onClick={() => {
								navigate("/my-candidates");
							}}
						>
							Find candidates in my district →
						</a>
					</div>
				</div>
				<div className="hero-image">
					<div className="hero-content">
						<img src="/images/image 1.png" />
						<a
							onClick={() => {
								navigate("/get-involved");
							}}
						>
							Become a candidate →
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};
