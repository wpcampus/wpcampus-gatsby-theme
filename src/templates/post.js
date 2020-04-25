import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import Article from "../components/article"
import Layout from "../components/layout"
import { PostPaginationAdjacent } from "../components/pagination"

import "./../css/post.css"

const normalizeCategories = (categories) => {
	if (!categories) {
		return categories
	}
	return categories.map(category => {
		category.path = `/blog/categories/${category.slug}`
		category.aria_label = `Blog post category: ${category.name}`
		return category
	})
}

const PostTemplate = props => {
	const post = props.data.wordpressPost
	const context = props.pageContext

	post.categories = normalizeCategories(post.categories)

	const paginationAdj = (
		<PostPaginationAdjacent previous={context.previous} next={context.next} />
	)

	const layoutAttr = {
		metaDescription: post.wpc_seo.meta.description || null,
		metaRobots: post.wpc_seo.meta.robots || [],
		classes: "wpc-post",
		pageTitle: post.title,
		path: props.path
	}

	const articleAttr = {
		data: post,
		wpc_protected: context.wpc_protected,
		isSingle: true,
		displayContentFull: true,
		headerPrefix: <Link to="/blog/">From our Blog</Link>,
		paginationAdj: paginationAdj
	}
	return (
		<Layout {...layoutAttr} >
			<Article {...articleAttr} />
		</Layout>
	)
}

PostTemplate.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	edges: PropTypes.array,
	pageContext: PropTypes.object.isRequired
}

export default PostTemplate

// @TODO remove fields we're not using.
export const postQuery = graphql`
  query($id: String!) {
    wordpressPost(id: { eq: $id }) {
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
      status
      date
      dateFormatted: date(formatString: "MMMM D, YYYY")
      excerpt
      content
      comment_status
      categories {
        id
        wordpress_id
        count
        name
        description
        slug
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
