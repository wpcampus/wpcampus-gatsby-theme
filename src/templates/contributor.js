import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import { ArticleArchive } from "../components/archive"
import Layout from "../components/layout"

const ContributorTemplate = props => {
	const contributor = props.data.wordpressWpUsers
	const heading = `Contributor: ${contributor.name}`
	return (
		<Layout heading={heading}>
			<ArticleArchive list={props.data.allWordpressPost.edges} />
		</Layout>
	)
}

ContributorTemplate.propTypes = {
	data: PropTypes.object.isRequired,
	edges: PropTypes.array,
}

export default ContributorTemplate

// @TODO remove fields we're not using.
// @TODO need to set up for all of the various post types: podcasts, sessions, resources, video, opportunity?
export const query = graphql`
  query($id: String!) {
    wordpressWpUsers(id: { eq: $id }) {
      id
      wordpress_id
      name
      slug
      path
      url
    }
    allWordpressPost(
      filter: {
        type: { in: ["post"] }
        status: { eq: "publish" }
        author: { elemMatch: { id: { eq: $id } } }
      }
      sort: { fields: date, order: DESC }
    ) {
      edges {
        node {
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
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`
