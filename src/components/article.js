import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import ReactHtmlParser from "react-html-parser"

import { AuthorCards } from "../components/author"
import ProtectedContent from "../components/content"

const getArticleContent = (data, displayContentFull) => {
	if (!displayContentFull && data.excerpt) {
		return data.excerpt
	}
	if (data.content) {
		return data.content
	}
	return null
}

const ArticleCategories = ({ list }) => (
	<ul>
		{list.map((item, i) => {
			const linkAttr = {
				to: item.path
			}
			if (item.aria_label) {
				linkAttr["aria-label"] = item.aria_label
			} else {
				linkAttr["aria-label"] = `Category: ${item.name}`
			}
			return (
				<li key={i}>
					<Link {...linkAttr}>{item.name}</Link>
				</li>
			)
		})}
	</ul>
)

ArticleCategories.propTypes = {
	list: PropTypes.array.isRequired,
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
	headingLevel: PropTypes.number,
	includeLink: PropTypes.bool
}

ArticleTitle.defaultProps = {
	headingLevel: 1,
	includeLink: false
}

const ArticleMeta = ({ data }) => {
	const metaAttr = {
		className: "wpc-meta wpc-article__meta"
	}
	return (
		<ul {...metaAttr}>
			<li className="wpc-meta__item wpc-meta__item--date">
				{data.dateFormatted}
			</li>
			{data.author ? (
				<li className="wpc-meta__item wpc-meta__item--author">
					<span className="wpc-meta__label">By</span>
					<ArticleMetaAuthors authors={data.author} />
				</li>
			) : null}
			{data.categories ? (
				<li className="wpc-meta__item wpc-meta__item--categories">
					<ArticleCategories list={data.categories} />
				</li>
			) : null}
		</ul>
	)
}

ArticleMeta.propTypes = {
	data: PropTypes.object.isRequired,
}

const ArticleHeader = ({ data, displayMeta, isSingle, headerPrefix }) => {
	const articleTitleAttr = {
		data: data
	}
	if (!isSingle) {
		articleTitleAttr.headingLevel = 2
		articleTitleAttr.includeLink = true
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
	isSingle: PropTypes.bool,
	displayMeta: PropTypes.bool,
	headerPrefix: PropTypes.node
}

ArticleHeader.defaultProps = {
	isSingle: true,
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
	return (
		<article {...articleAttr}>
			<ProtectedContent wpc_protected={wpc_protected}>
				<ArticleHeader data={data} isSingle={isSingle} headerPrefix={headerPrefix} displayMeta={displayMeta} />
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
