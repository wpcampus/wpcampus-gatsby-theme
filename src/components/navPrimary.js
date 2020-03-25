import React, { useEffect } from "react"

import "./../css/nav.css"

import { Nav, NavPrimaryItems } from "./nav"
import navigation from "../js/nav-primary"

const NavPrimary = () => {
	useEffect(() => {
		navigation.init({
			breakpoint: 960,
			main: document.getElementById("main"),
			nav: document.getElementById("nav"),
			minHeights: false,
		})
	})

	const navPrimaryAttr = {
		id: "nav",
		classes: "wpc-nav wpc-nav--primary",
		label: "Primary",
		list: NavPrimaryItems
	}

	return (
		<Nav {...navPrimaryAttr}>
			<button className="menu-toggle">Menu</button>
		</Nav>
	)
}

export default NavPrimary
