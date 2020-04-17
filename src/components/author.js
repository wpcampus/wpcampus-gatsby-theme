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
			aria_label: `Website of ${author.display_name}`,
			text: "Website"
		}
		items.push(<NavAnchor item={authorURL} />)
	}
	if (!items.length) {
		return ""
	}
	return (
		<ul className="wpc-author-card__meta">
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

const AuthorCards = ({ authors }) => {
	if (!authors) {
		return ""
	}
	return (
		<div className="wpc-authors">
			{authors.map((item, i) => (
				<AuthorCard key={i} author={item} />
			))}
		</div>
	)
}

AuthorCards.propTypes = {
	authors: PropTypes.array.isRequired,
}

const AuthorCard = ({ author, headingLevel }) => {
	const authorLink = "/about/contributors/" + author.path + "/"
	let HeadingTag = `h${headingLevel}`
	return (
		<div className="wpc-author-card">
			<div className="wpc-areas wpc-areas--grid wpc-author-card__areas">
				<div className="wpc-area wpc-author-card__area wpc-author-card__area--avatar">
					<img className="wpc" src={avatarEduwapuuBW} alt="" />
				</div>
				<div className="wpc-area wpc-author-card__area wpc-author-card__area--main">
					<HeadingTag className="wpc-author-card__heading"><Link to={authorLink}>{author.display_name}</Link></HeadingTag>
					<AuthorCardMeta author={author} />
					{author.bio ? <p>{author.bio}</p> : ""}
				</div>
			</div>
		</div >
	)
}

AuthorCard.propTypes = {
	author: PropTypes.object.isRequired,
	headingLevel: PropTypes.number
}

AuthorCard.defaultProps = {
	headingLevel: 2
}

export { AuthorCard, AuthorCards }
