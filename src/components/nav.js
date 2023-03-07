import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

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
				path: "/about/guidelines/",
				text: "Guidelines",
				children: [
					{
						path: "/about/guidelines/accessibility/",
						text: "Accessibility"
					},
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
				text: "Our newsletters"
			},
			{
				path: "/about/contact/",
				text: "Contact us"
			},
		]
	},
	{
		path: "/governance/",
		text: "Governance",
		children: [
			{
				path: "/governance/bylaws/",
				text: "Bylaws"
			},
			{
				path: "/governance/board/",
				text: "Board of Directors"
			},
			{
				path: "/governance/board/nominations",
				text: "Nominations for the Board"
			},
			{
				path: "/governance/leadership-transition/",
				text: "Leadership transition"
			},
		],
	},
	{
		path: "/blog/",
		text: "Our Blog",
		children: [
			{
				path: "/blog/categories/",
				text: "Categories"
			},
			{
				path: "/blog/categories/board-of-directors",
				text: "Board of Directors"
			},
			{
				href: "http://eepurl.com/dOd-Q9",
				targetBlank: true,
				aria_label: "Subscribe to Community Blog updates",
				text: "Subscribe to updates"
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
				text: "Join us on Slack",
				children: [
					{
						path: "/community/slack/channels/",
						text: "Our Slack channels",
					}
				]
			},
			{
				path: "/community/planning/",
				text: "Planning Blog",
				children: [
					{
						href: "http://eepurl.com/hppn0T",
						targetBlank: true,
						aria_label: "Subscribe to Planning Blog updates",
						text: "Subscribe to updates"
					}
				]
			},
			{
				path: "/community/directory/",
				text: "Our Directory"
			},
			{
				path: "/governance/",
				text: "Our Governance"
			},
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
				href: "https://2023.wpcampus.org/",
				text: "WPCampus 2023"
			},
			{
				href: "https://2022.wpcampus.org/",
				text: "WPCampus 2022"
			},
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

const NavLink = ({ item }) => {
	if (!item.path || !item.text) {
		return ""
	}
	const getLinkProps = ({ isCurrent, isPartiallyCurrent }) => {
		const attrs = {
			className: "nav-link"
		}
		if (isCurrent || true === item.isCurrent) {
			attrs.className += " nav-link--current"
		} else if (isPartiallyCurrent) {
			attrs.className += " nav-link--current-parent"
		}
		return attrs
	}
	const linkAttr = {
		getProps: getLinkProps,
		to: item.path
	}
	if (item.aria_label) {
		linkAttr["aria-label"] = item.aria_label
	}
	return (
		<Link {...linkAttr}>
			{item.text}
		</Link>
	)
}

NavLink.propTypes = {
	item: PropTypes.object.isRequired,
}

const NavAnchor = ({ item }) => {
	if (!item.href || !item.text) {
		return ""
	}
	const anchorAttr = {
		href: item.href
	}
	if (item.classes) {
		anchorAttr.classes = item.classes
	}
	if (item.aria_label) {
		anchorAttr["aria-label"] = item.aria_label
	}
	if (item.title) {
		anchorAttr.title = item.title
	}
	if (item.targetBlank !== undefined && true === item.targetBlank) {
		anchorAttr.target = "_blank"
	} else if (item.target) {
		anchorAttr.target = item.target
	}
	return (<a {...anchorAttr}>{item.text}</a>)
}

NavAnchor.propTypes = {
	item: PropTypes.object.isRequired,
}

const NavItem = ({ item }) => {
	const itemAttr = {
		className: "nav-listitem"
	}
	if (item.classes) {
		itemAttr.className += ` ${item.classes}`
	}
	return (
		<li {...itemAttr}>
			{item.path ? <NavLink item={item} /> : <NavAnchor item={item} />}
			{item.children && item.children.length ? (
				<ul className="wpc-nav__sub">
					{item.children.map((child, i) => (
						<NavItem key={i} item={child} />
					))}
				</ul>
			) : ""}
		</li>
	)
}

NavItem.propTypes = {
	item: PropTypes.object.isRequired,
}

const NavList = ({ list }) => {
	return (
		<ul className="wpc-nav__menu">
			{list.map((item, i) => (
				<NavItem key={i} item={item} />
			))}
		</ul>
	)
}

NavList.propTypes = {
	list: PropTypes.array.isRequired,
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
	return (
		<nav {...navAttr}>
			{children}
			<NavList list={list} />
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
