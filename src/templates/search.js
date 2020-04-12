import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

import Layout from "../components/layout"

const sanitizeSearch = (str) => {
	str = str.replace(/[^a-z0-9áéíóúñü .,_-]/gim, "")
	return str.trim()
}

const SearchResult = ({ result }) => {
	return <div className="wpc-search__result">
		<h3><Link to={result.path}>{result.title}</Link></h3>
		<p>{result.excerpt.basic}</p>
	</div>
}

SearchResult.propTypes = {
	result: PropTypes.object.isRequired,
}

const SearchResultsByType = ({ label, id, results, plural }) => {
	const noResults = <p>There are no search results for {plural}.</p>
	let headingLabel = label
	if (results.length) {
		headingLabel += ` (${results.length})`
	}
	return <div className="wpc-search__results">
		<h2 id={id}>{headingLabel}</h2>
		{!results.length ? noResults : results.map((item, i) => {
			return <SearchResult key={i} result={item} />
		})}
	</div>
}

SearchResultsByType.propTypes = {
	label: PropTypes.string,
	id: PropTypes.string,
	results: PropTypes.array,
	plural: PropTypes.string.isRequired
}

const SearchResults = ({ query, results, isSearchComplete }) => {
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
	if (!query) {
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
			resultsMessage = `There is 1 result for "${query}".`
		} else {
			resultsMessage = `There are ${results.length} results for "${query}".`
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
			return <SearchResultsByType key={i} id={type.id} label={type.label} plural={type.plural} results={type.results} />
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
	query: PropTypes.string,
	results: PropTypes.array,
	isSearchComplete: PropTypes.bool.isRequired
}

SearchResults.defaultProps = {
	isSearchComplete: false
}

// @TODO setup to work so back navigation updates the page.
/*const getWindowSearch = () => {
	let windowSearch = window.location.search.replace("?", "").split("&")
	if (windowSearch) {
		for (let i = 0; i < windowSearch.length; i++) {
			let param = windowSearch[i].split("=")
			if ("s" === param[0]) {
				return param[1]
			}
		}
	}
	return null
}*/

class Search extends React.Component {
	constructor() {
		super()

		this.crumbs = {
			path: "/search/",
			title: "Search",
		}

		this.cssSearchPrefix = "wpc-search"

		this.state = {
			processing: false,
			isSearchComplete: false,
			query: null,
			results: []
		}

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this)

	}

	// @TODO I couldn't get to work.
	/*componentDidMount() {
		window.addEventListener("popstate", this.handlePopState)
	}

	handlePopState(e) {
		if (e.state) {
			e.preventDefault()
			e.stopPropagation()
			console.log(e.state)
			this.setState(e.state)
		}
	}*/

	runSearch(searchStr) {

		searchStr = sanitizeSearch(searchStr)

		if (!searchStr) {
			return
		}

		if (searchStr === this.state.query) {
			return
		}

		const encodedSearchStr = encodeURIComponent(searchStr)

		this.setState((prevState) => ({
			processing: true,
			query: searchStr,
			results: prevState.results
		}))

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
					processing: false,
					query: prevState.query,
					results: response,
					isSearchComplete: true
				}))

				window.history.pushState(this.state, "", window.location.pathname + "?s=" + encodedSearchStr)

			})
			.catch(console.error)
	}

	handleSubmit(event) {
		event.preventDefault()

		const searchField = event.target.querySelector("input[name=\"search\"]")

		let searchValue = searchField.value

		if (!searchValue) {
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

		const searchFormAttr = {
			className: "wpc-form wpc-form--search",
			onSubmit: this.handleSubmit
		}

		return <Layout heading="Search" crumbs={this.crumbs}>
			<p>If you can&lsquo;t find what you&lsquo;re looking for, please <Link to="/about/contact" aria-label="Contact us and let us know">let us know</Link>.</p>
			<div {...searchAttr}>
				<form {...searchFormAttr}>
					<input type="search" className="wpc-form__input" name="search" aria-label="Search the site" placeholder="Search the site" />
					<input type="submit" value="Search" />
				</form>
				<SearchResults isSearchComplete={this.state.isSearchComplete} query={this.state.query} results={this.state.results} />
			</div>
		</Layout>
	}
}

export default Search
