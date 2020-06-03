import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import PropTypes from "prop-types"

import { ArticleArchive } from "../components/archive"
import Layout from "../components/layout"
import { AuthorCard } from "../components/author"
import LibraryLayout from "../components/library"

const ContributorTemplate = props => {
	const contributor = props.data.wordpressWpcContributors
	const heading = contributor.display_name
	const context = props.pageContext

	// Separate content.
	let posts
	if (props.data.allWordpressPost.edges.length) {
		posts = <div className="wpc-contributor-results__result wpc-contributor-results__result--blog">
			<h2 className="wpc-contributor-results__result__heading"><span className="wpc-icon wpc-icon--quotes"></span> <Link className="wpc-link wpc-link--inherit" to="/blog/">From our Blog</Link></h2>
			<ArticleArchive headingLevel={3} list={props.data.allWordpressPost.edges} />
		</div>
	}

	let podcasts
	if (props.data.allWordpressWpPodcast.edges.length) {
		podcasts = <div className="wpc-contributor-results__result wpc-contributor-results__result--podcast">
			<h2 className="wpc-contributor-results__result__heading"><span className="wpc-icon wpc-icon--quotes"></span> <Link className="wpc-link wpc-link--inherit" to="/podcast/">From our Podcast</Link></h2>
			<ArticleArchive headingLevel={3} list={props.data.allWordpressWpPodcast.edges} />
		</div>
	}

	let sessions
	if (props.data.allWordpressWpcLibrary.edges.length) {
		sessions = <div className="wpc-contributor-results__result wpc-contributor-results__result--library">
			<h2 className="wpc-contributor-results__result__heading"><span className="wpc-icon wpc-icon--quotes"></span> <Link className="wpc-link wpc-link--inherit" to="/learning/library/">From our Learning Library</Link></h2>
			<LibraryLayout itemHeadingLevel={3} enableFilters={false} library={props.data.allWordpressWpcLibrary.edges} />
		</div>
	}

	// @TODO add meta description?

	const layoutAttr = {
		heading: heading,
		crumbs: context.crumbs,
		path: props.path,
	}

	return (
		<Layout {...layoutAttr}>
			<AuthorCard author={contributor} />
			<div className="wpc-contributor-results">
				{posts}
				{podcasts}
				{sessions}
			</div>
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
        author: { elemMatch: { id: { eq: $id } } },
		wpc_gatsby: { disable: { eq: false } }
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
		author: { elemMatch: { id: { eq: $id } } },
		wpc_gatsby: { disable: { eq: false } }
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
				author {
					path
					bio
					company
					company_position
					display_name
					email
					id
					twitter
					website
					wordpress_id
				}
				speakers {
					avatar
					ID
					company
					company_website
					company_position
					content {
						raw
						rendered
					}
					display_name
					excerpt {
						raw
						rendered
					}
					facebook
					first_name
					headshot
					instagram
					last_name
					linkedin
					permalink
					post_date
					post_date_gmt
					title
					twitter
					website
					wordpress_user
				}
				best_session
				comment_count
				content {
					raw
					rendered
				}
				discussion
				event_date
				event_date_gmt
				event_name
				event_permalink
				event_slug
				excerpt {
					raw
					rendered
				}
				format
				format_name
				format_slug
				future
				permalink
				session_slides_url
				session_video
				session_video_url
				slug
				subjects
				title
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
