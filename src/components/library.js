import React, { useRef, useState } from "react"
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

const sanitizeSearchTerm = (str) => {
	str = str.replace(/[^a-z0-9áéíóúñü .,_-]/gim, "")
	return str.trim()
}

const LibraryItem = ({ item, format, headingLevel }) => {
	if (false === item.active) {
		return ""
	}

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

	if (subjects.length) {
		subjects = <div className="wpc-library__item__detail wpc-library__item__detail--subjects">
			<span className="wpc-library__item__detail__label">{subjectLabel}:</span>
			<span className="wpc-library__item__detail__value">{subjects}</span>
		</div>
	}

	// @TODO if contributor has no display name, display speaker profile name?
	// @TODO or show speaker profile name always?
	let speakers = []

	if (item.author && item.author) {
		speakers = item.author
	} else if (item.speakers && item.speakers.length) {
		speakers = item.speakers
	}

	if (speakers) {
		speakers = speakers.map((author, i) => {
			return <span key={i}>{i > 0 ? ", " : ""}
				<Link to={`/about/contributors/${author.path}/`}>{author.display_name}</Link>
			</span>
		})
	}

	if (speakers.length) {
		let speakerLabel = speakers.length == 1 ? "Speaker" : "Speakers"
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

	const HeadingTag = `h${headingLevel}`

	return <div {...itemAttr}>
		<div {...thumbAttr} />
		<HeadingTag className="wpc-library__item__title">{title}</HeadingTag>
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
	format: PropTypes.string,
	headingLevel: PropTypes.string.isRequired
}

LibraryItem.defaultProps = {
	format: "basic",
	headingLevel: 2
}

const LibraryItems = ({ items, format, itemHeadingLevel }) => {
	return <div className="wpc-library__items">
		{items.map(({ node }, i) => {
			return <LibraryItem key={i} format={format} item={node} headingLevel={itemHeadingLevel} />
		})}
	</div>
}

LibraryItems.propTypes = {
	items: PropTypes.array.isRequired,
	format: PropTypes.string,
	itemHeadingLevel: PropTypes.string
}

LibraryItems.defaultProps = {
	format: "basic"
}

/**
 * Process the library items via filters.
 *
 * @param {*} library 
 * @param {*} filters 
 */
const processLibrary = (library, filters) => {
	return library.map(({ node }) => {
		node.active = true
		if (filters.event && filters.event.length && !filters.event.includes(node.event_name)) {
			node.active = false
			return ({ node })
		}
		if (filters.format && filters.format.length && !filters.format.includes(node.format_name)) {
			node.active = false
			return ({ node })
		}
		if (filters.subject && filters.subject.length) {
			if (!node.subjects || !node.subjects.length) {
				node.active = false
				return ({ node })
			}
			let hasSubject = node.subjects.filter(value => filters.subject.includes(value))
			if (!hasSubject.length) {
				node.active = false
				return ({ node })
			}
		}
		if (filters.search) {
			let search = filters.search,
				hasSearch = false

			// Store all searchable fields in array.
			let toSearch = [node.title, node.excerpt.raw, node.content.raw]

			// @TODO add speaker display_name but make sure it matches what we're displaying
			// @TODO right now we're using author field.
			if (node.speakers) {
				node.speakers.forEach(speaker => {
					if (speaker.content.raw) {
						toSearch.push(speaker.content.raw)
					}
				})
			}

			toSearch = toSearch.filter(value => value != "")

			for (let i = 0; i < toSearch.length; i++) {
				if (toSearch[i].search(new RegExp(search, "gi")) >= 0) {
					hasSearch = true
					break
				}
			}

			if (!hasSearch) {
				node.active = false
				return ({ node })
			}
		}
		return ({ node })
	})
}

const LibrarySearch = ({ defaultQuery }) => {
	const [query, updateQuery] = useState(defaultQuery)

	const changeSearch = event => {
		let value = event.target.value.trim()
		updateQuery(value)
	}

	const inputSearchAttr = {
		type: "search",
		name: "search",
		placeholder: "Search the library",
		"aria-label": "Search the library",
		value: query,
		onBlur: event => changeSearch(event),
		onChange: event => changeSearch(event),
	}

	return <input {...inputSearchAttr} />
}

LibrarySearch.propTypes = {
	defaultQuery: PropTypes.string
}

const LibraryFilters = ({ state, updateLibraryState }) => {

	const filterFormRef = useRef()

	const onSubmit = async event => {
		event.preventDefault()
		event.stopPropagation()

		let { format, filters, library } = state

		// Check <select> for filters.
		let selects = filterFormRef.current.querySelectorAll("select")
		if (selects && selects.length) {
			for (let i = 0; i < selects.length; i++) {
				const select = selects[i]
				if (!select.name) {
					continue
				}
				if (select.hasAttribute("multiple")) {
					const selected = select.querySelectorAll("option:checked")
					filters[select.name] = Array.from(selected).map(el => el.value)
				} else {
					filters[select.name] = select.value || ""
				}
				filters[select.name] = filters[select.name].filter(value => value != "")
			}
		}

		// Check <input> for filters.
		let inputs = filterFormRef.current.querySelectorAll("input[type=\"search\"]")
		if (inputs && inputs.length) {
			for (let i = 0; i < inputs.length; i++) {
				const input = inputs[i]
				if (!input.name) {
					continue
				}
				filters[input.name] = sanitizeSearchTerm(input.value)
			}
		}

		// Update library.
		library = processLibrary(library, filters)

		updateLibraryState({
			...state,
			format: format,
			filters: filters,
			library: library
		})
	}

	const formAttr = {
		ref: filterFormRef,
		className: "wpc-library__filters",
		action: "/",
		onSubmit: onSubmit
	}


	const submitAttr = {
		type: "submit",
		value: "Filter",
	}

	const options = {
		event: [],
		format: [],
		subject: []
	}
	state.library.forEach(({ node }) => {

		// Get all events.
		if (!options.event.includes(node.event_name)) {
			options.event.push(node.event_name)
		}

		// Get all formats.
		if (!options.format.includes(node.format_name)) {
			options.format.push(node.format_name)
		}

		// Get all subjects.
		if (node.subjects && node.subjects.length) {
			node.subjects.forEach(subject => {
				if (!options.subject.includes(subject)) {
					options.subject.push(subject)
				}
			})
			options.subject = options.subject.sort()
		}
	})

	const eventOptions = options.event.map((event, i) => {
		return <option key={i} value={event}>{event}</option>
	})

	const formatOptions = options.format.map((format, i) => {
		return <option key={i} value={format}>{format}</option>
	})

	let subjectOptions
	if (options.subject) {
		subjectOptions = options.subject.map((subject, i) => {
			return <option key={i} value={subject}>{subject}</option>
		})
	}

	return <form {...formAttr}>
		<div>
			<label htmlFor="wpc-library-filter-event">Event</label>
			<select id="wpc-library-filter-event" name="event" multiple>
				<option value="">All events</option>
				{eventOptions}
			</select>
		</div>
		<div>
			<label htmlFor="wpc-library-filter-format">Format</label>
			<select id="wpc-session-filter-format" name="format" multiple>
				<option value="">All formats</option>
				{formatOptions}
			</select>
		</div>
		<div>
			<label htmlFor="wpc-library-filter-subject">Subject</label>
			<select id="wpc-session-filter-subject" name="subject" multiple>
				<option value="">All subjects</option>
				{subjectOptions}
			</select>
		</div>
		<div>
			<LibrarySearch />
		</div>
		<input {...submitAttr} onClick={event => onSubmit(event)} />
	</form>
}

LibraryFilters.propTypes = {
	state: PropTypes.object.isRequired,
	updateLibraryState: PropTypes.func.isRequired
}

const filterMessage = (filters) => {
	let messages = []
	if (filters.event && filters.event.length) {
		messages.push("Event: " + filters.event.join(", "))
	}
	if (filters.format && filters.format.length) {
		messages.push("Format: " + filters.format.join(", "))
	}
	if (filters.subject && filters.subject.length) {
		messages.push("Subject: " + filters.subject.join(", "))
	}
	if (filters.search) {
		messages.push("Search: " + "\"" + filters.search + "\"")
	}
	if (!messages.length) {
		return ""
	}
	return <div>
		<p>Filters:</p>
		<ul>
			{messages.map((message, i) => {
				return <li key={i}>{message}</li>
			})}
		</ul>
	</div>
}

const LibraryLayout = ({ library, enableFilters, itemHeadingLevel }) => {
	const defaultState = {
		format: "basic",
		filters: {},
		library: library
	}
	const [state, updateLibraryState] = useState(defaultState)

	let theLibrary
	if (!state.library || !state.library.length) {
		theLibrary = []
	} else {
		theLibrary = state.library
	}

	// If no filters and no content, get out of here.
	if (!enableFilters && !theLibrary) {
		return null
	}

	const libraryAttr = {
		className: "wpc-library"
	}

	if (state.format) {
		libraryAttr.className += ` wpc-library--${state.format}`
	}

	let libraryFilters
	let libraryMarkup

	if (enableFilters) {

		libraryMarkup = filterMessage(state.filters)

		// See how many active items we have.
		const activeLibrary = theLibrary.filter(({ node }) => false !== node.active)

		if (!activeLibrary.length) {
			libraryMarkup = <div>
				<p>There are no items.</p>
				{libraryMarkup}
			</div>
		} else {
			libraryMarkup = <div>
				{libraryMarkup}
				<p>There are {activeLibrary.length} items.</p>
				<LibraryItems items={activeLibrary} format={state.format} itemHeadingLevel={itemHeadingLevel} />
			</div>
		}

		libraryFilters = <LibraryFilters state={state} updateLibraryState={updateLibraryState} />

		libraryMarkup = <div role="alert" aria-live="polite">
			{libraryMarkup}
		</div>
	} else {
		libraryMarkup = <LibraryItems items={theLibrary} format={state.format} itemHeadingLevel={itemHeadingLevel} />
	}

	return <div {...libraryAttr}>
		{libraryFilters}
		{libraryMarkup}
	</div>
}

LibraryLayout.propTypes = {
	library: PropTypes.array.isRequired,
	enableFilters: PropTypes.bool,
	itemHeadingLevel: PropTypes.string
}

LibraryLayout.defaultProps = {
	enableFilters: true
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

export default LibraryLayout