import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import ReactHtmlParser from "react-html-parser"

import { AuthorCards } from "../components/author"
import ProtectedContent from "../components/content"

const getDateFormat = (dateObj) => {
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	]
	return monthNames[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear()
}

const getDate = (dateStr) => {
	return getDateFormat(new Date(dateStr))
}

const getArticleContent = (data, displayContentFull) => {
	if (!displayContentFull) {
		if (!data.excerpt) {
			return ""
		}
		if (data.excerpt.basic) {
			return data.excerpt.basic
		}
		return data.excerpt
	}
	if (data.content) {
		return data.content
	}
	return null
}

const ArticleCategories = ({ list, type }) => (
	<ul>
		{list.map((item, i) => {
			let path
			if (item.path) {
				path = item.path
			} else if (item.slug) {
				if ("post" == type) {
					path = `/blog/categories/${item.slug}/`
				} else if ("podcast" == type) {
					path = `/podcast/categories/${item.slug}/`
				}
			}

			let markup

			if (path) {

				const linkAttr = {
					to: path
				}

				if (item.aria_label) {
					linkAttr["aria-label"] = item.aria_label
				} else {
					if ("post" == type) {
						linkAttr["aria-label"] = `Blog category: ${item.name}`
					} else if ("podcast" == type) {
						linkAttr["aria-label"] = `Podcast category: ${item.name}`
					} else {
						linkAttr["aria-label"] = `Category: ${item.name}`
					}
				}

				markup = <Link {...linkAttr}>{item.name}</Link>

			} else {
				markup = <span>{item.name}</span>
			}

			return (
				<li key={i}>
					{markup}
				</li>
			)
		})}
	</ul>
)

ArticleCategories.propTypes = {
	list: PropTypes.array.isRequired,
	type: PropTypes.string.isRequired
}

const ArticleMetaAuthors = ({ authors }) => {
	const contributorPathBase = "/about/contributors/"
	return <ul>
		{authors.map((item, i) => {
			const contributorPath = contributorPathBase + item.path + "/"
			return <li key={i}>
				<Link to={contributorPath}>{item.display_name}</Link>
			</li>
		})}
	</ul>
}

ArticleMetaAuthors.propTypes = {
	authors: PropTypes.array.isRequired
}

const ArticleTitle = ({ data, headingLevel, includeLink }) => {
	const className = "wpc-article__title"
	const HeadingTag = `h${headingLevel}`
	let title = data.title
	if (includeLink && data.path) {
		title = <Link to={data.path}>{title}</Link>
	}
	return <HeadingTag className={className}>{title}</HeadingTag>
}

ArticleTitle.propTypes = {
	data: PropTypes.object.isRequired,
	headingLevel: PropTypes.number.isRequired,
	includeLink: PropTypes.bool.isRequired
}

ArticleTitle.defaultProps = {
	headingLevel: 1,
	includeLink: false
}

const ArticleMeta = ({ data }) => {
	const metaAttr = {
		className: "wpc-meta wpc-article__meta"
	}
	let date
	if (data.dateFormatted) {
		date = data.dateFormatted
	} else if (data.date) {
		date = getDate(data.date)
	}
	return (
		<ul {...metaAttr}>
			<li className="wpc-meta__item wpc-meta__item--date">
				{date}
			</li>
			{data.author && data.author.length ? (
				<li className="wpc-meta__item wpc-meta__item--author">
					<span className="wpc-meta__label">By</span>
					<ArticleMetaAuthors authors={data.author} />
				</li>
			) : null}
			{data.categories && data.categories.length ? (
				<li className="wpc-meta__item wpc-meta__item--categories">
					<ArticleCategories type={data.type} list={data.categories} />
				</li>
			) : null}
		</ul>
	)
}

ArticleMeta.propTypes = {
	data: PropTypes.object.isRequired,
}

const ArticleHeader = ({ data, displayMeta, headingLevel, headerPrefix, includeLink }) => {
	const articleTitleAttr = {
		data: data,
		includeLink: includeLink
	}
	if (headingLevel) {
		articleTitleAttr.headingLevel = headingLevel
	}
	const headerAttr = {
		className: "wpc-article__header"
	}
	return <header {...headerAttr}>
		{headerPrefix ? <span className="wpc-article-prefix">{headerPrefix}:</span> : null}
		<ArticleTitle {...articleTitleAttr} />
		{displayMeta ? <ArticleMeta data={data} /> : null}
	</header>
}

ArticleHeader.propTypes = {
	data: PropTypes.object.isRequired,
	headingLevel: PropTypes.number,
	displayMeta: PropTypes.bool,
	headerPrefix: PropTypes.node,
	includeLink: PropTypes.bool
}

ArticleHeader.defaultProps = {
	displayMeta: true
}

const ArticleContent = ({ data, displayContentFull }) => {
	let articleContent = getArticleContent(data, displayContentFull)
	let className = "wpc-article__content"
	if (displayContentFull) {
		className += " wpc-article__content--full"
	} else {
		className += " wpc-article__content--excerpt"
	}
	return <div className={className}>{ReactHtmlParser(articleContent)}</div>
}

ArticleContent.propTypes = {
	data: PropTypes.object.isRequired,
	displayContentFull: PropTypes.bool,
}

ArticleContent.defaultProps = {
	displayContentFull: false,
}

const ArticleFooter = ({ data, displayAuthor, paginationAdj }) => {
	const footerAttr = {
		className: "wpc-article__footer"
	}
	return <footer {...footerAttr}>
		{displayAuthor && data.author ? <AuthorCards authors={data.author} /> : null}
		{paginationAdj}
	</footer>
}

ArticleFooter.propTypes = {
	data: PropTypes.object.isRequired,
	displayAuthor: PropTypes.bool,
	paginationAdj: PropTypes.node
}

ArticleFooter.defaultProps = {
	displayAuthor: true
}

const Article = ({
	data,
	children,
	wpc_protected,
	isSingle,
	headerPrefix,
	headingLevel,
	includeLink,
	displayAuthor,
	displayMeta,
	displayContent,
	displayContentFull,
	paginationAdj
}) => {
	const articleAttr = {
		className: "wpc-article"
	}
	if (isSingle) {
		articleAttr.className += " wpc-article--single"
	}

	const articleHeaderAttr = {
		data: data,
		isSingle: isSingle,
		headerPrefix: headerPrefix,
		displayMeta: displayMeta,
		includeLink: includeLink
	}

	if (headingLevel) {
		articleHeaderAttr.headingLevel = headingLevel
	} else if (!isSingle) {
		articleHeaderAttr.headingLevel = 2
	}

	if (undefined === includeLink && !isSingle) {
		articleHeaderAttr.includeLink = true
	}

	return (
		<article {...articleAttr}>
			<ProtectedContent wpc_protected={wpc_protected}>
				<ArticleHeader {...articleHeaderAttr} />
				{children}
				{displayContent ? (
					<ArticleContent data={data} displayContentFull={displayContentFull} />
				) : null}
				<ArticleFooter data={data} displayAuthor={displayAuthor} paginationAdj={paginationAdj} />
			</ProtectedContent>
		</article>
	)
}

Article.propTypes = {
	data: PropTypes.object.isRequired,
	children: PropTypes.node,
	wpc_protected: PropTypes.object,
	headerPrefix: PropTypes.node,
	headingLevel: PropTypes.number,
	includeLink: PropTypes.bool,
	isSingle: PropTypes.bool,
	displayAuthor: PropTypes.bool,
	displayMeta: PropTypes.bool,
	displayContent: PropTypes.bool,
	displayContentFull: PropTypes.bool,
	paginationAdj: PropTypes.node
}

Article.defaultProps = {
	displayAuthor: true,
	displayMeta: true,
	displayContent: true,
	displayContentFull: false,
	isSingle: true,
}

export default Article
