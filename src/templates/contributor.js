import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import { ArticleArchive } from "../components/archive"
import Layout from "../components/layout"
import { AuthorCard } from "../components/author"

function sortByDateDesc(a, b) {
	const aDate = new Date(a.node.date).getTime()
	const bDate = new Date(b.node.date).getTime()
	if (aDate < bDate) {
		return 1
	}
	if (aDate > bDate) {
		return -1
	}
	return 0
}

const ContributorTemplate = props => {
	const contributor = props.data.wordpressWpcContributors
	const heading = contributor.display_name
	const context = props.pageContext

	// Separate content.
	let posts
	if (props.data.allWordpressPost.edges.length) {
		posts = <div>
			<h2>Blog posts</h2>
			<ArticleArchive list={props.data.allWordpressPost.edges} />
		</div>
	}

	let podcasts
	if (props.data.allWordpressWpPodcast.edges.length) {
		podcasts = <div>
			<h2>Podcasts</h2>
			<ArticleArchive list={props.data.allWordpressWpPodcast.edges} />
		</div>
	}

	let sessions
	if (props.data.allWordpressWpcLibrary.edges.length) {
		sessions = <div>
			<h2>Sessions</h2>
			{props.data.allWordpressWpcLibrary.edges.map(({ node }, i) => {
				return <div key={i}>
					<h3><a href={node.permalink}>{node.title}</a></h3>
				</div>
			})}
		</div>
	}

	return (
		<Layout heading={heading} crumbs={context.crumbs} path={props.path}>
			<AuthorCard author={contributor} />
			{posts}
			{podcasts}
			{sessions}
		</Layout>
	)
}

ContributorTemplate.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	edges: PropTypes.array,
	pageContext: PropTypes.object.isRequired
}

export default ContributorTemplate

// @TODO remove fields we're not using.
// @TODO need to set up for all of the various post types: podcasts, sessions, resources?
export const query = graphql`
  query($id: String!) {
    wordpressWpcContributors(id: { eq: $id }) {
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
    allWordpressPost(
      filter: {
        status: { eq: "publish" }
        author: { elemMatch: { id: { eq: $id } } }
      }
      sort: { fields: date, order: DESC }
    ) {
      edges {
        node {
          id
		  wordpress_id
		  type
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
            path
          }
        }
      }
    }
    allWordpressWpPodcast(
      filter: {
        status: { eq: "publish" }
        author: { elemMatch: { id: { eq: $id } } }
      }
      sort: { fields: date, order: DESC }
    ) {
      edges {
        node {
          id
		  wordpress_id
		  type
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
            path
          }
        }
      }
	}
	allWordpressWpcLibrary(
		filter: {
			type: { eq: "session" }
		  	author: { elemMatch: { id: { eq: $id } } }
		}
		sort: { fields: event_date, order: DESC }
	  ) {
		edges {
		  	node {
				title
				permalink
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
