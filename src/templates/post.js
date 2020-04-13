import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import Article from "../components/article"
import Layout from "../components/layout"
import { PostPagination } from "../components/pagination"

const PostTemplate = props => {
	const post = props.data.wordpressPost
	const context = props.pageContext
	const pagination = (
		<PostPagination previous={context.previous} next={context.next} />
	)
	return (
		<Layout pageTitle={post.title} crumbs={context.crumbs} path={props.path}>
			{pagination}
			<Article data={post} wpc_protected={context.wpc_protected} isSingle={true} displayContentFull={true} />
			{pagination}
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
        wordpress_id
        name
        slug
        path
        url
		description
		company
		company_position
		twitter
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
        path
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
