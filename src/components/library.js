import React, { useState } from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

const getDateFormat = (dateObj) => {
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	]
	return monthNames[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear()
}

const getDate = (dateStr) => {
	return getDateFormat(new Date(dateStr))
}

const LibraryItem = ({ item, format }) => {

	const isExpanded = "expanded" === format
	const eventSlug = item.event_slug

	const itemAttr = {
		className: "wpc-library__item"
	}

	const thumbAttr = {
		className: "wpc-library__item__thumbnail"
	}

	if (format) {
		itemAttr.className += ` wpc-library__item--${format}`
	}

	if (eventSlug) {
		itemAttr.className += ` wpc-library__item--event-${eventSlug}`
		thumbAttr.className += ` wpc-library__item__thumbnail--event-${eventSlug}`
	}

	let excerpt
	if (isExpanded) {
		excerpt = <div className="wpc-library__item__excerpt">{ReactHtmlParser(item.excerpt.rendered)}</div>
	}

	let subjectLabel = item.subjects.length == 1 ? "Subject" : "Subjects"
	let subjects = item.subjects.map((subject, i) => {
		return <span key={i}>{i > 0 ? ", " : ""}{subject}</span>
	})

	if (subjects) {
		subjects = <div className="wpc-library__item__detail wpc-library__item__detail--subjects">
			<span className="wpc-library__item__detail__label">{subjectLabel}:</span>
			<span className="wpc-library__item__detail__value">{subjects}</span>
		</div>
	}

	let speakerLabel = item.author.length == 1 ? "Speaker" : "Speakers"
	let speakers = item.author.map((author, i) => {
		return <span key={i}>{i > 0 ? ", " : ""}
			<Link to={`/about/contributors/${author.path}/`}>{author.display_name}</Link>
		</span>
	})

	if (speakers) {
		speakers = <div className="wpc-library__item__detail wpc-library__item__detail--speakers">
			<span className="wpc-library__item__detail__label">{speakerLabel}:</span>
			<span className="wpc-library__item__detail__value">{speakers}</span>
		</div>
	}

	let date
	if (item.event_date) {
		const dateFormatted = getDate(item.event_date)
		if (dateFormatted) {
			date = <div className="wpc-library__item__detail wpc-library__item__detail--date">
				<span className="wpc-library__item__detail__label">Date:</span>
				<span className="wpc-library__item__detail__value">{dateFormatted}</span>
			</div>
		}
	}

	let itemFormat
	if (item.format_name) {
		itemFormat = <span className="wpc-library__item__format">{item.format_name}</span>
	}

	let actionsCount = 0

	let discussion
	if (item.discussion && item.permalink) {
		actionsCount++
		discussion = <div className="wpc-library__item__action wpc-library__item__action--discussion">
			<span className="wpc-icon wpc-icon--chat"></span>
			<span className="wpc-library__item__action__value"><a href={`${item.permalink}#discussion`}>Discussion</a></span>
		</div>
	}

	let slides
	if (item.session_slides_url && item.permalink) {
		actionsCount++
		slides = <div className="wpc-library__item__action wpc-library__item__action--slides">
			<span className="wpc-icon wpc-icon--slides"></span>
			<a className="wpc-library__item__action__value" href={`${item.permalink}#slides`}>Slides</a>
		</div>
	}

	let video
	if (item.session_video_url && item.permalink) {
		actionsCount++
		video = <div className="wpc-library__item__action wpc-library__item__action--video">
			<span className="wpc-icon wpc-icon--video"></span>
			<a className="wpc-library__item__action__value" href={`${item.permalink}#video`}>Video</a>
		</div>
	}

	let actions
	if (actionsCount) {
		actions = <div className="wpc-library__item__actions">
			{discussion}
			{slides}
			{video}
		</div>
	}

	const eventAttr = {
		className: "wpc-library__item__event",
		href: item.event_permalink
	}

	if (eventSlug) {
		eventAttr.className += ` wpc-library__item__event--${eventSlug}`
	}

	let title = item.title
	if (item.permalink) {
		title = <a href={item.permalink}>{title}</a>
	}

	return <div {...itemAttr}>
		<div {...thumbAttr} />
		<h2 className="wpc-library__item__title">{title}</h2>
		<div className="wpc-library__item__highlight">
			<a {...eventAttr}>{item.event_name}</a>
			{itemFormat}
		</div>
		<div className="wpc-library__item__meta">
			<div className="wpc-library__item__details">
				{speakers}
				{subjects}
				{date}
			</div>
			{actions}
		</div>
		{excerpt}
	</div>
}

LibraryItem.propTypes = {
	item: PropTypes.object.isRequired,
	format: PropTypes.string
}

LibraryItem.defaultProps = {
	format: "basic"
}

const LibraryLayout = ({ library }) => {
	const defaultState = {
		format: "basic",
		library: library //.slice(0, 10)
	}

	const [state, updateState] = useState(defaultState)

	const libraryAttr = {
		className: "wpc-library"
	}

	if (state.format) {
		libraryAttr.className += ` wpc-library--${state.format}`
	}

	return <div {...libraryAttr}>
		{state.library.map(({ node }, i) => {
			return <LibraryItem key={i} format={state.format} item={node} />
		})}
	</div>
}

LibraryLayout.propTypes = {
	library: PropTypes.array
}

/*author {
	path
	bio
	company
	company_position
	display_name
	email
	id
	twitter
	website
	wordpress_id
}
speakers {
	avatar
	ID
	company
	company_website
	company_position
	content {
		raw
		rendered
	}
	display_name
	excerpt {
		raw
		rendered
	}
	facebook
	first_name
	headshot
	instagram
	last_name
	linkedin
	permalink
	post_date
	post_date_gmt
	title
	twitter
	website
	wordpress_user
}
best_session
comment_count
content {
	raw
	rendered
}
discussion
event_date
event_date_gmt
event_name
format
format_name
format_slug
future
session_video
slug
subjects
*/

LibraryItem.propTypes = {
	item: PropTypes.object.isRequired
}

export { LibraryItem, LibraryLayout }