import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

const NavPrimaryItems = [
	{
		path: "/about/",
		text: "About",
		children: [
			{ path: "/about/contributors/", text: "Contributors" },
			{ path: "/about/partners/", text: "Partners" },
			/*{ path: "/about/mascots/", text: "Mascots" },*/
			{
				path: "/about/governance/",
				text: "Governance",
				children: [
					{
						path: "/about/governance/committees/",
						text: "Committees"
					},
					{
						path: "/about/governance/working/",
						text: "Working Groups"
					}
				]
			},
			{
				path: "/about/guidelines/",
				text: "Guidelines",
				children: [
					{
						path: "/about/guidelines/conduct/",
						text: "Code of Conduct"
					},
					{
						path: "/about/guidelines/diversity/",
						text: "Diversity, Equity, and Inclusion"
					}
				]
			},
			{ path: "/about/newsletter/", text: "Our newsletter" },
			{ path: "/about/contact/", text: "Contact us" },
		]
	},
	{
		path: "/blog/",
		text: "Our Blog",
		children: [
			{
				path: "/blog/categories/",
				text: "Categories"
			}
		]
	},
	{
		path: "/community/",
		text: "Our Community",
		children: [
			{
				path: "/community/membership/",
				text: "Become a member"
			},
			/*{
				path: "/community/slack/",
				text: "Slack",
				children: [
					{
						path: "/community/slack/channels/",
						text: "Slack channels",
					}
				]
			},*/
			/*{
				path: "/community/sme/",
				text: "Subject Matter Experts"
			},*/
			{
				path: "/about/guidelines/",
				text: "Community guidelines"
			},
			{
				path: "/community/calendar/",
				text: "Calendar of events"
			},
			{
				path: "/community/swag/",
				text: "Swag"
			}
		]
	},
	{
		path: "/conferences/",
		text: "Our Conferences",
		children: [
			{
				href: "https://2021.wpcampus.org/",
				text: "WPCampus 2021"
			},
			{
				href: "https://2020.wpcampus.org/",
				text: "WPCampus 2020"
			},
			{
				href: "https://2019.wpcampus.org/",
				text: "WPCampus 2019"
			},
			{
				href: "https://2018.wpcampus.org/",
				text: "WPCampus 2018"
			},
			{
				href: "https://2017.wpcampus.org/",
				text: "WPCampus 2017"
			},
			{
				href: "https://2016.wpcampus.org/",
				text: "WPCampus 2016"
			},
			{
				href: "https://online.wpcampus.org/",
				text: "WPCampus Online"
			}
		]
	},
	{
		path: "/learning/",
		text: "Learning",
		children: [
			{
				path: "/learning/library/",
				text: "Learning Library"
			},
			{
				path: "/learning/audit/",
				text: "Gutenberg audit",
				children: [
					{
						path: "/learning/audit/webinar/",
						text: "Gutenberg audit webinar"
					}
				]
			},
			{
				path: "/learning/accessibility/",
				text: "Accessibility resources"
			},
			{
				path: "/learning/speaking/",
				text: "Speaker training"
			}
		]
	},
	{ path: "/jobs/", text: "Job Board" },
	{
		path: "/podcast/",
		text: "Podcast",
		children: [
			{
				path: "/podcast/categories/",
				text: "Categories"
			}
		]
	},
	{ href: "https://shop.wpcampus.org/", text: "Shop" }
]

const NavAnchor = ({ item, attrs }) => {
	if (item.text === "" || item.href === "") return

	return (
		<a href={item.href} {...attrs}>{item.text}</a>
	)
}

NavAnchor.propTypes = {
	item: PropTypes.object.isRequired,
	attrs: PropTypes.object
}

const NavLink = ({ item, attrs }) => {
	if (item.text === "" || item.path === "") return

	return ( <Link to={item.path} {...attrs}>{item.text}</Link> )
}

NavLink.propTypes = {
	item: PropTypes.object.isRequired,
	attrs: PropTypes.object
}

const NavItemLink = ({ item }) => {

	const linkAttr = {}

	if (item.classes) {
		linkAttr.className = item.classes
	}

	if (item.title) {
		linkAttr.title = item.title
	}

	if (item.target) {
		linkAttr.target = item.target
		linkAttr.rel = item.target === "_blank" ? "noopener" : ""
	}

	if (item.aria_label) {
		linkAttr["aria-label"] = item.aria_label
	}

	return (
		<>
			{
				// conditionally render a gatsby link or regular anchor
				item.path ? (
					<NavLink item={item} attrs={linkAttr} />
				) : ( 
					<NavAnchor item={item} attrs={linkAttr} />
				)
			}
		</>
	)
}

NavItemLink.propTypes = {
	item: PropTypes.object.isRequired
}

const NavListItem = ({ item, id, selectedItemId, topLevelItemId }) => {
	// submenus start closed
	let open = false
	let topLevelOpen = false

	// if the li's id matches the selectedItem, open the submenu
	if (
		selectedItemId !== null &&
		selectedItemId !== undefined &&
		selectedItemId === id
	) {
		open = true
	}

	const topLevelItem = document.querySelector(`#${topLevelItemId}`)
	const selectedItem = document.querySelector(`#${selectedItemId}`)

	// if the top level item exists, and it contains the selected item but it is not the same node as the selected item
	if (
		topLevelItem &&
		topLevelItem.contains(selectedItem) &&
		!topLevelItem.isSameNode(selectedItem) &&
		id === topLevelItemId
	) {
		topLevelOpen = true
	}

	const attrs = {
		id,
		className: `nav-listitem ${open || topLevelOpen ? "toggled-open" : ""}`
	}

	if (item.classes) {
		attrs.className = `${attrs.className} ${item.classes}`
	}

	// select the elements to create based on if there are submenus
	// if there are, make a new submenu with recursion
	return (
		<li {...attrs}>
			{
				// if the item has children, set the name followed by a button
				// then add the new nav list with the children
				// otherwise just return the name
				item.children && item.children.length ? (
					<>
						<span className="nav-link--toggle">
							<NavItemLink item={item} />
							<button 
								id={`button-${id}`}
								className="submenu-toggle js-submenu-toggle"
								aria-label="toggle child menu"
								aria-expanded={open ? "true" : "false"}
							></button>
						</span>
						<NavList
							list={item.children}
							isSubmenu={true}
							open={open}
							selectedItemId={selectedItemId}
							topLevelItemId={topLevelItemId}
						/>
					</>
				) : ( <NavItemLink item={item} /> )
			}
		</li>
	)
}

NavListItem.propTypes = {
	id: PropTypes.string.isRequired,
	item: PropTypes.object.isRequired,
	selectedItemId: PropTypes.string,
	topLevelItemId: PropTypes.string
}

const NavList = ({ isSubmenu, open, list, selectedItemId, topLevelItemId }) => {

	const submenuClass = isSubmenu ? "wpc-nav__sub" : ""
	const openClass = isSubmenu && open ? "submenu-open" : ""

	return (
		<ul className={`${submenuClass} ${openClass}`}>
			{
				list.map((item, i) => (
					<NavListItem
						key={i}
						item={item}
						id={`item-${item.text.toLowerCase().replace(" ", "-")}`}
						selectedItemId={selectedItemId}
						topLevelItemId={topLevelItemId}
					/>
				))
			}
		</ul>
	)
}

NavList.propTypes = {
	isSubmenu: PropTypes.bool.isRequired,
	open: PropTypes.bool,
	selectedItemId: PropTypes.string,
	topLevelItemId: PropTypes.string,
	list: PropTypes.array.isRequired
}

const Nav = ({ id, classes, aria_label, list, children }) => {
	const navAttr = {}
	if (id) {
		navAttr.id = id
	}
	if (classes) {
		navAttr.className = classes
	}
	if (aria_label) {
		navAttr["aria-label"] = aria_label
	}

	// set the state for the selected item
	const [selectedItemId, setSelectedItemId] = useState(null)

	// figure out if there's a top level item like the our community/slack combo
	const [topLevelItemId, setTopLevelItemId] = useState(null)

	// attach a click handler to the entire nav component
	useEffect(() => {
		const clickHandler = evt => {
			const navPrimary = document.querySelector("#navPrimary")

			if (!navPrimary.contains(evt.target)) return

			const selectedId = evt.target.closest("li").id
			const topLevelId = evt.target.closest("#navPrimary > ul > li").id

			// select for the id of the target's parent <li>
			// pass the id to the list
			setSelectedItemId(selectedId)

			// find the closest item at the top of the tree to keep it open
			setTopLevelItemId(topLevelId)
		}

		document.addEventListener("click", clickHandler)

		// clean up when the component unmounts
		return () => document.removeEventListener("click", clickHandler)
	}, [])

	return (
		<nav {...navAttr}>
			{children}
			<NavList
				isSubmenu={false}
				open={true}
				selectedItemId={selectedItemId}
				topLevelItemId={topLevelItemId} 
				list={list} 
				hasSubmenuToggle={false} 
			/>
		</nav>
	)
}

Nav.propTypes = {
	id: PropTypes.string,
	classes: PropTypes.string,
	aria_label: PropTypes.string,
	list: PropTypes.array.isRequired,
	children: PropTypes.object,
}

// export { Nav, NavAnchor, NavPrimaryItems }
export { Nav, NavPrimaryItems }
