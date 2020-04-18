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
		{list.map((item, i) => (
			<li key={i}>
				<Link to={item.path}>{item.name}</Link>
			</li>
		))}
	</ul>
)

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
					<span className="wpc-meta__label">Categories:</span>
					<ArticleCategories list={data.categories} />
				</li>
			) : null}
		</ul>
	)
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

const Article = ({
	data,
	wpc_protected,
	isSingle,
	displayAuthor,
	displayMeta,
	displayContent,
	displayContentFull,
}) => {
	const articleTitleAttr = {
		data: data
	}
	if (!isSingle) {
		articleTitleAttr.headingLevel = 2,
		articleTitleAttr.includeLink = true
	}
	const articleAttr = {
		className: "wpc-article"
	}
	if (isSingle) {
		articleAttr.className += " wpc-article--single"
	}
	return (
		<article {...articleAttr}>
			<ArticleTitle {...articleTitleAttr} />
			<ProtectedContent wpc_protected={wpc_protected}>
				{displayMeta ? <ArticleMeta data={data} /> : null}
				{displayContent ? (
					<ArticleContent data={data} displayContentFull={displayContentFull} />
				) : null}
				{displayAuthor && data.author ? <AuthorCards authors={data.author} /> : null}
			</ProtectedContent>
		</article>
	)
}

ArticleCategories.propTypes = {
	list: PropTypes.array.isRequired,
}

ArticleMeta.propTypes = {
	data: PropTypes.object.isRequired,
}

ArticleContent.propTypes = {
	data: PropTypes.object.isRequired,
	displayContentFull: PropTypes.bool,
}

ArticleContent.defaultProps = {
	displayContentFull: false,
}

Article.propTypes = {
	data: PropTypes.object.isRequired,
	wpc_protected: PropTypes.object,
	isSingle: PropTypes.bool,
	displayAuthor: PropTypes.bool,
	displayMeta: PropTypes.bool,
	displayContent: PropTypes.bool,
	displayContentFull: PropTypes.bool,
}

Article.defaultProps = {
	displayAuthor: true,
	displayMeta: true,
	displayContent: true,
	displayContentFull: false,
	isSingle: true,
}

export default Article
