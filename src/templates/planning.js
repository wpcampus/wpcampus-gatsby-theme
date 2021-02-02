import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import Article from "../components/article"
import Layout from "../components/layout"
import { PostPaginationAdjacent } from "../components/pagination"

import "./../css/post.css"

const isDev = "development" === process.env.NODE_ENV

// @TODO setup
/*const normalizeCategories = (categories) => {
	if (!categories) {
		return categories
	}
	return categories.map(category => {
		category.path = `/blog/categories/${category.slug}`
		category.aria_label = `Planning blog post category: ${category.name}`
		return category
	})
}*/

const PlanningTemplate = props => {
	const planning = props.data.wordpressWpPlanning
	const context = props.pageContext

	// @TODO setup
	//planning.categories = normalizeCategories(planning.categories)

	const paginationAdj = (
		<PostPaginationAdjacent previous={context.previous} next={context.next} />
	)

	const layoutAttr = {
		metaDescription: planning.wpc_seo.meta.description || null,
		metaRobots: planning.wpc_seo.meta.robots || [],
		classes: "wpc-post",
		pageTitle: planning.title,
		path: props.path
	}

	let iframeAttr = undefined
	if (planning.wpc_gatsby && planning.wpc_gatsby.forms && planning.wpc_gatsby.forms.length) {

		const form = planning.wpc_gatsby.forms.shift()
		const formSrc = form.permalink || ""
		const formTitle = form.title || ""

		iframeAttr = {
			src: formSrc,
			title: formTitle,
			origins: [context.formOrigin],
			resizeLog: isDev
		}
	}

	const articleAttr = {
		data: planning,
		wpc_protected: context.wpc_protected,
		isSingle: true,
		displayContentFull: true,
		headerPrefix: <Link to="/community/planning/">From our Planning Blog</Link>,
		paginationAdj: paginationAdj,
		isPlanning: true,
		displaySubscribe: true,
		appendForm: iframeAttr,
	}

	return (
		<Layout {...layoutAttr} >
			<Article {...articleAttr} />
		</Layout>
	)
}

PlanningTemplate.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	edges: PropTypes.array,
	pageContext: PropTypes.object.isRequired
}

export default PlanningTemplate

// @TODO remove fields we're not using.
// @TODO setup categories
/*categories {
	id
	wordpress_id
	count
	name
	description
	slug
}*/
export const planningQuery = graphql`
  query($id: String!) {
    wordpressWpPlanning(id: { eq: $id }) {
      id
      wordpress_id
      slug
      path
      author {
        id
		path
		display_name
		email
		twitter
		website
		company
		company_position
		bio
      }
      title
	  type
      status
      date
      dateFormatted: date(formatString: "MMMM D, YYYY")
      excerpt
      content
	  wpc_gatsby {
		disable
		template
		forms {
			title
			permalink
		}
	  }
	  wpc_seo {
		title
		meta {
			description
			robots
		}
	  }
    }
    site {
      siteMetadata {
        siteName
      }
    }
  }
`
