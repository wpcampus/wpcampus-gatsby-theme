import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import { NavAnchor } from "../components/nav"
import { sanitizeTwitterHandle } from "../utilities"

import avatarEduwapuuBW from "../images/avatars/wpcampus-avatar-eduwapuu-bw.png"

const buildCompany = (author) => {
	if (author.company) {
		if (author.company_position) {
			return `${author.company_position}, ${author.company}`
		}
		return author.company
	}
	if (author.company_position) {
		return author.company_position
	}
	return ""
}

const AuthorCardMeta = ({ author }) => {
	const items = []
	const companyLabel = buildCompany(author)
	if (companyLabel) {
		items.push(companyLabel)
	}
	if (author.twitter) {
		const handle = sanitizeTwitterHandle(author.twitter)
		if (handle) {
			const twitterURL = {
				href: `https://twitter.com/${handle}`,
				text: `@${handle}`
			}
			items.push(<NavAnchor item={twitterURL} />)
		}
	}
	if (author.url) {
		const authorURL = {
			href: author.url,
			text: author.url
		}
		items.push(<NavAnchor item={authorURL} />)
	}
	if (!items.length) {
		return ""
	}
	return (
		<ul>
			{items.map((item, i) => (
				<li key={i}>
					{item}
				</li>
			))}
		</ul>
	)
}

AuthorCardMeta.propTypes = {
	author: PropTypes.object.isRequired,
}

const AuthorCard = ({ author }) => {
	return (
		<div className="wpc-author">
			<div className="wpc-areas wpc-areas--grid wpc-author__areas">
				<div className="wpc-area wpc-author__area wpc-author__area--avatar">
					<img className="wpc" src={avatarEduwapuuBW} />
				</div>
				<div className="wpc-area wpc-author__area wpc-author__area--main">
					<Link to={author.path}>{author.name}</Link>
					<AuthorCardMeta author={author} />
					{!author.description ? "" : <p>{author.description}</p>}
				</div>
			</div>
		</div >
	)
}

AuthorCard.propTypes = {
	author: PropTypes.object.isRequired,
}

export default AuthorCard
