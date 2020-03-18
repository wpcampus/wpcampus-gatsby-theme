import React from "react"

//import "./../css/footer.css"

const Footer = () => {
	return (
		<footer className="wpc-footer wpc-wrapper">
			<div className="wpc-container">
				© {new Date().getFullYear()},{" "}
				<a href="https://www.wpcampus.org">WPCampus</a>
			</div>
		</footer>
	)
}

export default Footer
