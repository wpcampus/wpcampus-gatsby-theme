import React, { useEffect } from "react"

import "./../css/nav.css"

import { Nav, NavPrimaryItems } from "./nav"
import navigation from "../js/nav-primary"

import ToggleIcon from "../svg/toggleMenu"

const NavPrimary = () => {

	const navPrimaryID = "navPrimary"

	// @TODO add useRef
	useEffect(() => {
		navigation.init({
			breakpoint: 768,
			main: document.getElementById("main"),
			nav: document.getElementById(navPrimaryID),
			minHeights: false,
		})
	})

	const navPrimaryAttr = {
		id: navPrimaryID,
		classes: "wpc-nav wpc-nav--primary",
		aria_label: "Primary",
		list: NavPrimaryItems
	}

	return (
		<Nav {...navPrimaryAttr}>
			<button className="wpc-nav__toggle menu-toggle" aria-label="Toggle main menu">
				<ToggleIcon classes="wpc-nav__toggle__icon" />
				<div className="wpc-nav__toggle__labels">
					<div className="wpc-nav__toggle__label wpc-nav__toggle__label--open">Menu</div>
					<div className="wpc-nav__toggle__label wpc-nav__toggle__label--close">Close</div>
				</div>
			</button>
		</Nav>
	)
}

export default NavPrimary
