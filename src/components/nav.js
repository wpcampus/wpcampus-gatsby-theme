import React, { useState } from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import { isBrowser } from "../utils/utilities"

const NavPrimaryItems = [
	{
		path: "/about/",
		text: "About",
		children: [
			{
				path: "/about/contributors/",
				text: "Contributors"
			},
			{
				path: "/about/partners/",
				text: "Partners"
			},
			{
				path: "/about/mascots/",
				text: "Mascots"
			},
			{
				path: "/about/governance/",
				text: "Governance",
				children: [
					{
						path: "/about/governance/committees/",
						text: "Committees",
						children: [
							{
								path: "/about/governance/committees/diversity-inclusion/",
								text: "Diversity and Inclusion"
							},
						],
					},
					{
						path: "/about/governance/working/",
						text: "Working Groups",
						children: [
							{
								path: "/about/governance/working/community/",
								text: "Community planning",
							},
							{
								path: "/about/governance/working/governance/",
								text: "Governance",
							},
							{
								path: "/about/governance/working/website/",
								text: "Our website",
							},
						],
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
			{
				path: "/about/newsletter/",
				text: "Our newsletter"
			},
			{
				path: "/about/contact/",
				text: "Contact us"
			},
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
			{
				path: "/community/slack/",
				text: "Slack",
				children: [
					{
						path: "/community/slack/channels/",
						text: "Slack channels",
					}
				]
			},
			{
				path: "/community/directory/",
				text: "Directory"
			},
			{
				path: "/about/governance/",
				text: "Governance",
				ref: true
			},
			{
				path: "/about/guidelines/",
				text: "Community guidelines",
				ref: true
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
			},
			{
				path: "/community/directory/",
				text: "Directory"
			},
			{
				path: "/community/slack/",
				text: "Slack",
			}
		]
	},
	{
		path: "/jobs/",
		text: "Job Board"
	},
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
	{
		href: "https://shop.wpcampus.org/",
		text: "Shop"
	}
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

	return (
		<Link
			to={item.path}
			// manage the current classes based on gatsby-link getProps prop
			getProps={({ isCurrent, isPartiallyCurrent }) => {
				if (isCurrent || true === item.isCurrent) {
					attrs.className += " nav-link--current"
				} else if (isPartiallyCurrent) {
					attrs.className += " nav-link--current-parent"
				}
				return attrs
			}}
			{...attrs}
		>
			{item.text}
		</Link>
	)
}

NavLink.propTypes = {
	item: PropTypes.object.isRequired,
	attrs: PropTypes.object
}

const NavToggle = ({ id }) => {

	const [open, setOpen] = useState(false)

	// this doesn't seem very "react-like" to me. but it's a start
	const manageParent = (evt) => {

		setOpen(!open)

		const parentLi = evt.target.closest("li")

		if (parentLi === null) return

		parentLi.classList.contains("toggled-open") ?
			parentLi.classList.remove("toggled-open") :
			parentLi.classList.add("toggled-open")
	}

	const buttonAttr = {
		id: id,
		className: "submenu-toggle",
		"aria-expanded": open ? "true" : "false",
		"aria-label": `${open ? "Close" : "Open"} child menu`,
		onClick: (evt) => manageParent(evt)
	}

	return (
		<button {...buttonAttr}></button>
	)
}

NavToggle.propTypes = {
	id: PropTypes.string,
}


const NavItemLink = ({ item }) => {

	const linkAttr = {
		className: "nav-link"
	}

	if (item.classes) {
		linkAttr.className = `${linkAttr.className} ${item.classes}`
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

	if (item.path) {
		return <NavLink item={item} attrs={linkAttr} />
	}

	return <NavAnchor item={item} attrs={linkAttr} />
}

NavItemLink.propTypes = {
	item: PropTypes.object.isRequired
}

const checkCurrentNavChildren = (children, currentPath) => {
	if (! children.length) {
		return false
	}
	let isCurrentPath = false
	for (let i = 0; i < children.length; i++) {		
		let child = children[i]
		if (child.ref) {
			continue
		}
		if (!child.path) {
			continue
		}
		if (currentPath === child.path) {
			isCurrentPath = true
			break
		}
		if (child.children) {
			isCurrentPath = checkCurrentNavChildren(child.children,currentPath)
			if (isCurrentPath === true ) {
				break
			}
		}
	}
	return isCurrentPath
}

const NavListItem = ({ item }) => {
	const attrs = {
		className: "nav-listitem"
	}

	if (item.classes) {
		attrs.className = `${attrs.className} ${item.classes}`
	}

	let currentPath = isBrowser ? window.location.pathname : "/"

	const hasChildren = item.children && item.children.length

	// Means this item represents the current page.
	if (item.path && currentPath === item.path) {
		attrs.className += " nav-listitem--current"

		if (hasChildren) {
			attrs.className += " toggled-open"
		}
	} else if (hasChildren) {

		let isCurrentParent = checkCurrentNavChildren(item.children,currentPath)

		if (isCurrentParent) {
			attrs.className += " nav-listitem--current-parent toggled-open"
		}
	}

	/*
	 * Select the elements to create based on if there are 
	 * submenus. If there are, make a new submenu with recursion.
	 */
	if (hasChildren) {
		return <li {...attrs}>
			<span className="nav-link--toggle">
				<NavItemLink item={item} />
				<NavToggle />
			</span>
			<NavList list={item.children} isSubmenu={true} />
		</li>
	}

	return <li {...attrs}>
		<NavItemLink item={item} />
	</li>
}

NavListItem.propTypes = {
	item: PropTypes.object.isRequired,
	selectedItemId: PropTypes.string,
	topLevelItemId: PropTypes.string
}

const NavList = ({ isSubmenu, list }) => {
	return (
		<ul className={isSubmenu ? "wpc-nav__sub" : "wpc-nav__menu"}>
			{
				list.map((item, i) => {
					return (
						<NavListItem key={i} item={item} />
					)
				})
			}
		</ul>
	)
}

NavList.propTypes = {
	isSubmenu: PropTypes.bool.isRequired,
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

	const navListAttr = {
		isSubmenu: false,
		open: true,
		list: list,
		hasSubmenuToggle: false
	}

	return (
		<nav {...navAttr}>
			{children}
			<NavList {...navListAttr} />
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

export { Nav, NavAnchor, NavPrimaryItems }
