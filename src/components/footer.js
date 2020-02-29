import React from "react"

import "./../css/footer.css"

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer__container">
        © {new Date().getFullYear()},{" "}
				<a href="https://www.wpcampus.org">WPCampus</a>
			</div>
		</footer>
	)
}

export default Footer
