import React from "react"
import PropTypes from "prop-types"

import Article from "../components/article"

const CategoryArchive = ({ list }) => {
	return list.map((category) => {
		// Convert category data to match post data for component
		category.title = category.name
		category.content = "<p>" + category.description + "</p>"

		return (
			<Article
				key={category.id}
				data={category}
				isSingle={false}
				displayMeta={false}
				displayContent={true}
				displayContentFull={false}
			/>
		)
	})
}

CategoryArchive.propTypes = {
	list: PropTypes.array.isRequired,
}

const ArticleArchive = ({
	list,
	displayAuthor,
	displayMeta,
	displayContent,
	displayContentFull,
	headingLevel,
	includeLink
}) => {
	return <div className="wpc-articles">
		{list.map(({ node }, i) => {
			const articleAttr = {
				key: node.id,
				data: node,
				isSingle: false,
				displayAuthor: displayAuthor,
				displayMeta: displayMeta,
				displayContent: displayContent,
				displayContentFull: displayContentFull,
				includeLink: includeLink
			}
			if (headingLevel) {
				articleAttr.headingLevel = headingLevel
			}
			return <Article key={i} {...articleAttr} />
		})}
	</div>
}

ArticleArchive.propTypes = {
	list: PropTypes.array.isRequired,
	displayAuthor: PropTypes.bool,
	displayMeta: PropTypes.bool,
	displayContent: PropTypes.bool,
	displayContentFull: PropTypes.bool,
	headingLevel: PropTypes.number,
	includeLink: PropTypes.bool
}

ArticleArchive.defaultProps = {
	displayAuthor: false,
	displayMeta: true,
	displayContent: true,
	displayContentFull: false,
}

export { ArticleArchive, CategoryArchive }
