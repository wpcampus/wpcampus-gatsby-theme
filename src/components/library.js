import React, { useEffect, useRef, useState } from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

const getDateFormat = (dateObj) => {
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	]
	return monthNames[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear()
}

// Adding "T" between date and time makes it work in Safari.
const getDate = (dateStr) => {
	dateStr = dateStr.trim().replace(/\s/, "T")
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

	if (item.author && item.author.length) {
		speakers = item.author
	} else if (item.speakers && item.speakers.length) {
		speakers = item.speakers
	}

	/*
	 * Covers when some "speakers" are authors 
	 * because they have WP user accounts and some are not.
	 */
	if (item.author && item.author.length
		&& item.speakers && item.speakers.length
		&& item.speakers.length !== item.author.length) {

		for (let i = 0; i < item.speakers.length; i++) {
			const speaker = item.speakers[i]
			if (!speaker.wordpress_user) {
				speakers.push(speaker)
			}
		}
	}

	if (speakers) {
		speakers = speakers.map((author, i) => {
			return <span key={i}>{i > 0 ? ", " : ""}
				{author.path ?
					<Link to={`/about/contributors/${author.path}/`} aria-label={`Contributor: ${author.display_name}`}>{author.display_name}</Link>
					: author.display_name}
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

	// @TODO escape attributes for titles.
	let discussion
	if (item.discussion && item.permalink) {
		actionsCount++
		discussion = <div className="wpc-library__item__action wpc-library__item__action--discussion">
			<span className="wpc-icon wpc-icon--chat"></span>
			<span className="wpc-library__item__action__value">
				<a href={`${item.permalink}#discussion`} aria-label={`Join discussion for ${item.title}`}>Discussion</a>
			</span>
		</div>
	}

	let slides
	if (item.session_slides_url && item.permalink) {
		actionsCount++
		slides = <div className="wpc-library__item__action wpc-library__item__action--slides">
			<span className="wpc-icon wpc-icon--slides"></span>
			<a className="wpc-library__item__action__value" href={`${item.permalink}#slides`} aria-label={`Slides for ${item.title}`}>Slides</a>
		</div>
	}

	let video
	if (item.session_video_url && item.permalink) {
		actionsCount++
		video = <div className="wpc-library__item__action wpc-library__item__action--video">
			<span className="wpc-icon wpc-icon--video"></span>
			<a className="wpc-library__item__action__value" href={`${item.permalink}#video`} aria-label={`Video for ${item.title}`}>Video</a>
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
	headingLevel: PropTypes.number.isRequired
}

LibraryItem.defaultProps = {
	format: "basic",
	headingLevel: 3
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

const LibrarySearchInput = ({ id, defaultQuery }) => {
	const [query, updateQuery] = useState(defaultQuery)

	const changeSearch = event => {
		let value = event.target.value.trim()
		updateQuery(value)
	}

	const inputSearchAttr = {
		id: id,
		type: "search",
		name: "search",
		placeholder: "Search the Library",
		"aria-label": "Search the Library",
		value: query,
		onBlur: event => changeSearch(event),
		onChange: event => changeSearch(event),
	}

	return <input {...inputSearchAttr} />
}

LibrarySearchInput.propTypes = {
	id: PropTypes.string.isRequired,
	defaultQuery: PropTypes.string
}

const LibraryFilters = ({ state, updateLibraryState }) => {

	const filterFormRef = useRef()

	const onSubmit = async event => {
		event.preventDefault()
		event.stopPropagation()

		let { filters } = state

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

		updateLibraryState({
			...state,
			reset: false,
			filters: filters
		})
	}

	const formAttr = {
		ref: filterFormRef,
		className: "wpc-library__filters",
		action: "/",
		onSubmit: onSubmit
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

	const submitAttr = {
		type: "submit",
		className: "wpc-library__filter__submit",
		value: "Filter",
		"aria-label": "Filter the library"
	}

	return <form {...formAttr}>
		<div className="wpc-library__filter wpc-library__filter--event">
			<label className="wpc-library__filter__label" htmlFor="wpc-library-filter-event" aria-label="Filter by event">Event:</label>
			<select id="wpc-library-filter-event" className="wpc-library__filter__select" name="event" multiple>
				<option className="wpc-library-filter-select-all" value="">All events</option>
				{eventOptions}
			</select>
		</div>
		<div className="wpc-library__filter wpc-library__filter--format">
			<label className="wpc-library__filter__label" htmlFor="wpc-library-filter-format" aria-label="Filter by format">Format:</label>
			<select id="wpc-library-filter-format" className="wpc-library__filter__select" name="format" multiple>
				<option className="wpc-library-filter-select-all" value="">All formats</option>
				{formatOptions}
			</select>
		</div>
		<div className="wpc-library__filter wpc-library__filter--subject">
			<label className="wpc-library__filter__label" htmlFor="wpc-library-filter-subject" aria-label="Filter by subject">Subject:</label>
			<select id="wpc-library-filter-subject" className="wpc-library__filter__select" name="subject" multiple>
				<option className="wpc-library-filter-select-all" value="">All subjects</option>
				{subjectOptions}
			</select>
		</div>
		<div className="wpc-library__filter wpc-library__filter__meta">
			<div className="wpc-library__filter wpc-library__filter__search">
				<label className="wpc-library__filter__label" htmlFor="wpc-library-filter-search">Search:</label>
				<LibrarySearchInput id="wpc-library-filter-search" />
			</div>
			<input {...submitAttr} onClick={event => onSubmit(event)} />
		</div>
	</form>
}

LibraryFilters.propTypes = {
	state: PropTypes.object.isRequired,
	updateLibraryState: PropTypes.func.isRequired
}

const LibraryCount = ({ activeLibrary, state, updateLibraryState }) => {

	let { filters } = state

	const onReset = async event => {
		event.preventDefault()
		event.stopPropagation()

		// Clear filters.
		updateLibraryState({
			...state,
			reset: true,
			filters: {},
		})
	}

	let activeFilters = []
	if (filters.event && filters.event.length) {
		activeFilters.push({
			label: "Event",
			message: filters.event.join(", ")
		})
	}
	if (filters.format && filters.format.length) {
		activeFilters.push({
			label: "Format",
			message: filters.format.join(", ")
		})
	}
	if (filters.subject && filters.subject.length) {
		activeFilters.push({
			label: "Subject",
			message: filters.subject.join(", ")
		})
	}
	if (filters.search) {
		activeFilters.push({
			label: "Search",
			message: "\"" + filters.search + "\""
		})
	}
	let mainMessage
	if (1 === activeLibrary.length) {
		mainMessage = "There is 1 item"
	} else if (activeLibrary.length) {
		mainMessage = `There are ${activeLibrary.length} items`
	} else {
		mainMessage = "There are no items"
	}
	const hasFilters = activeFilters.length
	if (hasFilters) {
		if (1 === activeLibrary.length) {
			mainMessage += " that matches"
		} else {
			mainMessage += " that match"
		}
		mainMessage += " your filter"
		if (activeFilters.length > 1) {
			mainMessage += "s"
		}
		mainMessage += "."
	} else {
		mainMessage += " in the catalog."
	}

	return <div className="wpc-library__data">
		<div className="wpc-library__data__count">
			<p role="alert" aria-live="polite">
				<span className="for-screen-reader">The Library has been updated.</span>
				{!hasFilters ? <span className="for-screen-reader">No filters have been set.</span> : ""}
				{mainMessage}
			</p>
			{hasFilters ? <ul>
				{activeFilters.map((filter, i) => {
					return <li key={i}><strong>{filter.label}:</strong> {filter.message}</li>
				})}
			</ul> : ""}
		</div>
		{hasFilters ? <button className="wpc-library__data__reset" onClick={onReset}><span>Clear filters</span></button> : ""}
	</div>
}

LibraryCount.propTypes = {
	activeLibrary: PropTypes.array.isRequired,
	state: PropTypes.object.isRequired,
	updateLibraryState: PropTypes.func.isRequired
}

const LibraryLayout = ({ library, enableFilters, itemHeadingLevel }) => {

	const defaultState = {
		format: "basic",
		filters: {},
		reset: false,
		library: library
	}
	const [state, updateLibraryState] = useState(defaultState)

	useEffect(() => {
		if (true === state.reset) {
			document.querySelector(".wpc-library__items a").focus()
		}
	}, state)

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

	// Update library.
	library = processLibrary(theLibrary, state.filters)

	const libraryAttr = {
		className: "wpc-library"
	}

	if (state.format) {
		libraryAttr.className += ` wpc-library--${state.format}`
	}

	let libraryFilters
	let libraryMarkup

	if (enableFilters) {

		// See how many active items we have.
		const activeLibrary = theLibrary.filter(({ node }) => false !== node.active)

		libraryFilters = <div>
			<h2 className="wpc-library__heading">Filters</h2>
			<LibraryFilters state={state} updateLibraryState={updateLibraryState} />
		</div>

		libraryMarkup = <div>
			<h2 className="wpc-library__heading">Catalog</h2>
			<LibraryCount activeLibrary={activeLibrary} state={state} updateLibraryState={updateLibraryState} />
			{!activeLibrary.length ? "" : <LibraryItems items={activeLibrary} format={state.format} itemHeadingLevel={itemHeadingLevel} />}
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