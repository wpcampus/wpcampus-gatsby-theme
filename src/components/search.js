import React from "react"
import { Link, navigate } from "gatsby"
import PropTypes from "prop-types"

import MagnifyingGlass from "../svg/magnifying-glass"

const sanitizeSearchTerm = (str) => {
	str = str.replace(/[^a-z0-9áéíóúñü .,_-]/gim, "")
	return str.trim()
}

const navigateToSearch = (searchValue) => {
	navigate("/search/" + searchValue)
}

const SearchResult = ({ result, headingLevel }) => {
	const HeadingTag = `h${headingLevel}`
	return <div className="wpc-search__result">
		<HeadingTag><Link to={result.path}>{result.title}</Link></HeadingTag>
		<p>{result.excerpt.basic}</p>
	</div>
}

SearchResult.propTypes = {
	result: PropTypes.object.isRequired,
	headingLevel: PropTypes.number
}

SearchResult.defaultProps = {
	headingLevel: 3
}

const SearchResultsByType = ({ label, id, results, headingLevel, plural }) => {
	const noResults = <p>There are no search results for {plural}.</p>
	let headingLabel = label
	if (results.length) {
		headingLabel += ` (${results.length})`
	}
	const HeadingTag = `h${headingLevel}`
	return <div className="wpc-search__results">
		<HeadingTag id={id}>{headingLabel}</HeadingTag>
		{!results.length ? noResults : results.map((item, i) => {
			return <SearchResult key={i} result={item} headingLevel={(headingLevel + 1)} />
		})}
	</div>
}

SearchResultsByType.propTypes = {
	label: PropTypes.string,
	id: PropTypes.string,
	results: PropTypes.array,
	headingLevel: PropTypes.number,
	plural: PropTypes.string.isRequired
}

SearchResultsByType.defaultProps = {
	headingLevel: 2
}

const SearchResults = ({ searchQuery, results, headingLevel, isSearchComplete }) => {
	// @TODO add library
	const sortByType = {
		post: {
			id: "post",
			label: "Blog posts",
			plural: "blog posts",
			results: []
		},
		page: {
			id: "page",
			label: "Pages",
			plural: "pages",
			results: []
		},
		podcast: {
			id: "podcast",
			label: "Podcasts",
			plural: "podcasts",
			results: []
		}
	}

	// If there's no query, then no search.
	if (!searchQuery) {
		isSearchComplete = false
		results = []
	}

	let resultsMessage
	let resultsList
	let resultsFormatted

	if (isSearchComplete) {

		results.map((item) => {
			// Only sort our selected types.
			if (item.type in sortByType) {
				sortByType[item.type].results.push(item)
			}
		})

		if (1 === results.length) {
			resultsMessage = `There is 1 result for "${searchQuery}".`
		} else {
			resultsMessage = `There are ${results.length} results for "${searchQuery}".`
		}

		resultsList = Object.keys(sortByType).map(function (key, i) {
			const type = sortByType[key]
			let ariaLabel
			if (1 === type.results.length) {
				ariaLabel = `1 search result for ${type.plural}`
			} else {
				ariaLabel = `${type.results.length} search results for ${type.plural}`
			}
			return <li key={i}><a href={`#${type.id}`} aria-label={ariaLabel}>{type.label}</a> ({type.results.length})</li>
		})

		resultsFormatted = Object.keys(sortByType).map(function (key, i) {
			const type = sortByType[key]
			return <SearchResultsByType key={i} id={type.id} label={type.label} plural={type.plural} results={type.results} headingLevel={headingLevel} />
		})
	}

	// @TODO handle when the lists are really long
	return (
		<div className="wpc-search__results" role="alert" aria-live="polite">
			{resultsMessage ? <p className="wpc-search__results__message">{resultsMessage}</p> : null}
			{resultsList ? <ul className="wpc-search__results__list">{resultsList}</ul> : null}
			{resultsFormatted}
		</div>
	)
}

SearchResults.propTypes = {
	searchQuery: PropTypes.string,
	results: PropTypes.array,
	headingLevel: PropTypes.number,
	isSearchComplete: PropTypes.bool.isRequired
}

SearchResults.defaultProps = {
	headingLevel: 2,
	isSearchComplete: false
}

const propsChanged = (prevProps, newProps) => {

	const newState = {}

	// Will be true if something changed.
	let changed = false
	for (const property in prevProps) {
		if (Object.prototype.hasOwnProperty.call(prevProps, property)) {
			if (prevProps[property] !== newProps[property]) {
				newState[property] = newProps[property]
				changed = true
			}
		}
	}

	if (!changed) {
		return false
	}

	return newState
}
class SearchForm extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			searchQuery: props.searchQuery,
			updateSearchQuery: props.updateSearchQuery,
			showSubmitIcon: props.showSubmitIcon,
		}

		if ("function" === typeof props.onSubmit) {
			this.state.onSubmit = props.onSubmit
		} else {
			this.onFormSubmit = this.onFormSubmit.bind(this)
			this.state.onSubmit = this.onFormSubmit
		}

		// This binding is necessary to make `this` work in the callback
		this.onChangeSearch = this.onChangeSearch.bind(this)

	}

	// Update the state if properties were updated.
	componentDidUpdate(prevProps, prevState) {

		const changed = propsChanged(prevProps, this.props)

		// If things changed, returns an object. Otherwise false.
		if (false !== changed) {

			this.setState({
				...prevState,
				...changed
			})
		}
	}

	onFormSubmit(event) {
		event.preventDefault()

		const searchField = event.target.querySelector("input[name=\"search\"]")

		let searchValue = searchField.value

		if (!searchValue) {
			return
		}

		searchValue = sanitizeSearchTerm(searchValue)

		if (searchValue) {

			if ("function" === typeof this.state.updateSearchQuery) {
				this.state.updateSearchQuery(searchValue)
			}

			navigateToSearch(searchValue)
		}
	}

	onChangeSearch(e) {
		if (e.target.value === this.state.searchQuery) {
			return
		}

		this.setState({
			...this.state,
			searchQuery: e.target.value,
		})
	}

	render() {

		const searchFormAttr = {
			className: "wpc-form wpc-form--search wpc-search-form",
			action: "/search/",
			onSubmit: this.state.onSubmit
		}

		if (this.state.showSubmitIcon) {
			searchFormAttr.className += " wpc-search-form--show-submit-icon"
		}

		const inputSearchAttr = {
			type: "search",
			className: "wpc-form__input wpc-search-form__input",
			name: "search",
			onChange: this.onChangeSearch,
			"aria-label": "Search the site",
			placeholder: "Search the site",
			value: this.state.searchQuery
		}

		const submitAttr = {
			className: "wpc-form__submit wpc-search-form__submit",
			type: "submit",
			"aria-label": "Search"
		}

		if (this.state.showSubmitIcon) {
			submitAttr.value = ""
		} else {
			submitAttr.value = "Search"
		}

		return <form {...searchFormAttr}>
			<input {...inputSearchAttr} />
			<div className="wpc-search-form__submit-icon">
				<input {...submitAttr} />
				{this.state.showSubmitIcon ? <div className="wpc-search-form__magnifying">
					<MagnifyingGlass />
				</div> : null}
			</div>
		</form>
	}
}

SearchForm.propTypes = {
	searchQuery: PropTypes.string,
	updateSearchQuery: PropTypes.func,
	showSubmitIcon: PropTypes.bool,
	onSubmit: PropTypes.func
}

SearchForm.defaultProps = {
	searchQuery: "",
	showSubmitIcon: false
}

class SearchLayout extends React.Component {
	constructor(props) {
		super(props)

		this.cssSearchPrefix = "wpc-search"

		this.state = {
			processing: false,
			isSearchComplete: false,
			searchQuery: props.searchQuery,
			updateSearchQuery: props.updateSearchQuery,
			includeSearchHeading: props.includeSearchHeading,
			children: props.children,
			results: []
		}

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this)

	}

	// When mounted, check if a search query was defined and run search.
	componentDidMount() {
		if (this.props.searchQuery && !this.state.isSearchComplete && !this.state.processing) {
			this.runSearch(this.props.searchQuery)
		}
	}

	// Update the state if properties were updated.
	componentDidUpdate(prevProps, prevState) {

		const changed = propsChanged(prevProps, this.props)

		// If things changed, returns an object. Otherwise false.
		if (false !== changed) {

			if (changed.searchQuery && !this.state.processing) {
				this.runSearch(this.props.searchQuery)
			}

			this.setState({
				...prevState,
				...changed
			})
		}
	}

	runSearch(searchStr) {

		if (!searchStr) {
			return
		}

		searchStr = sanitizeSearchTerm(searchStr)

		if (!searchStr) {
			return
		}

		const encodedSearchStr = encodeURIComponent(searchStr)

		this.setState((prevState) => ({
			...prevState,
			processing: true
		}))

		// @TODO doesnt need to run when component is mounted.
		if ("function" === typeof this.state.updateSearchQuery) {
			this.state.updateSearchQuery(searchStr)
		}

		// @TODO doesnt need to run when component is mounted because already set?
		window.history.pushState({}, "", "/search/" + encodedSearchStr)

		let url = "https://wpcampus.org/wp-json/wpcampus/search/"

		// What post types do we want?
		url += "?subtype=page,post,podcast"

		// Add search value.
		url += "&search=" + encodedSearchStr

		const opts = {
			method: "GET",
			headers: { "Content-Type": "application/json" }
		}

		fetch(url, opts)
			.then(response => response.json())
			.then(response => {

				if (!response) {
					response = []
				}

				this.setState((prevState) => ({
					...prevState,
					processing: false,
					results: response,
					resultsQuery: searchStr,
					isSearchComplete: true
				}))

			})
			.catch(() => {
				// @TODO how to handle error?
			})
	}

	handleSubmit(event) {
		event.preventDefault()

		const searchField = event.target.querySelector("input[name=\"search\"]")

		let searchValue = searchField.value

		if (!searchValue) {
			return
		}

		if (searchValue === this.state.searchQuery) {
			return
		}

		this.runSearch(searchValue)
	}

	render() {

		const searchAttr = {
			className: this.cssSearchPrefix
		}

		if (this.state.processing) {
			searchAttr.className += ` ${this.cssSearchPrefix}--processing`
		}

		const headingLevel = this.state.includeSearchHeading ? 3 : 2

		return <div {...searchAttr}>
			{this.state.children ? this.state.children : null}
			{this.state.includeSearchHeading ? <h2>Search our website</h2> : null}
			<SearchForm searchQuery={this.state.searchQuery} updateSearchQuery={this.state.updateSearchQuery} onSubmit={this.handleSubmit} />
			<SearchResults headingLevel={headingLevel} isSearchComplete={this.state.isSearchComplete} searchQuery={this.state.resultsQuery} results={this.state.results} />
		</div>
	}
}

SearchLayout.propTypes = {
	searchQuery: PropTypes.string,
	updateSearchQuery: PropTypes.func.isRequired,
	includeSearchHeading: PropTypes.bool,
	children: PropTypes.node
}

SearchLayout.defaultProps = {
	includeSearchHeading: false
}

export { SearchLayout, SearchForm, sanitizeSearchTerm }
