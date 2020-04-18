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
		<ul className="wpc-contributor__meta">
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

const AuthorCards = ({ authors, displayBio }) => {
	if (!authors) {
		return ""
	}
	return (
		<div className="wpc-contributors">
			{authors.map((item, i) => (
				<AuthorCard key={i} author={item} displayBio={displayBio} />
			))}
		</div>
	)
}

AuthorCards.propTypes = {
	authors: PropTypes.array.isRequired,
	displayBio: PropTypes.bool
}

AuthorCards.defaultProps = {
	displayBio: true
}

const AuthorCard = ({ author, headingLevel, displayBio }) => {
	const authorLink = "/about/contributors/" + author.path + "/"
	let HeadingTag = `h${headingLevel}`
	let bio
	if (displayBio && author.bio) {
		bio = <div className="wpc-contributor__bio">
			<p>{author.bio}</p>
		</div>
	}
	return (
		<div className="wpc-contributor">
			<div className="wpc-contributor__avatar">
				<img className="wpc" src={avatarEduwapuuBW} alt="" />
			</div>
			<div className="wpc-contributor__main">
				<HeadingTag className="wpc-contributor__name"><Link to={authorLink}>{author.display_name}</Link></HeadingTag>
				<AuthorCardMeta author={author} />
				{bio}
			</div>
		</div >
	)
}

AuthorCard.propTypes = {
	author: PropTypes.object.isRequired,
	headingLevel: PropTypes.number,
	displayBio: PropTypes.bool
}

AuthorCard.defaultProps = {
	headingLevel: 2,
	displayBio: true
}

export { AuthorCard, AuthorCards }
