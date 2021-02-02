import React from "react"
import PropTypes from "prop-types"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import { ArticleArchive } from "../components/archive"

import "./../css/blog.css"

export default function Template(props) {
	const crumbs = {
		crumb: {
			path: props.path,
			text: "Planning Blog"
		}
	}

	// @TODO add meta description?

	return (
		<Layout pageTitle="Planning Blog" heading="The WPCampus Planning Blog" crumbs={crumbs} path={props.path}>
			<div className="blog-about">
				<div>
					<h2>About the blog</h2>
					<p>The WPCampus Planning Blog is where community leadership posts information about planning our community, planning our community initiatives and events, and sharing leadership and volunteer opportunities.</p>
					<p>The Planning Blog is also home to all community planning surveys.</p>
					<p>If you&#39;re not interested in helping plan our community and merely interested in receiving prominent announcements, visit the <Link to="/blog/">WPCampus Community Blog</Link>.</p>
				</div>
				<div className="wpc-callout">
					<h2>Subscribe to updates</h2>
					<p>This mailing list sends an automated email that lets you know when we post to the WPCampus Planning Blog.</p>
					<a className="wpc-button wpc-button--dark" href="http://eepurl.com/hppn0T" target="_blank" rel="noreferrer">Subscribe to Planning Blog updates</a>
				</div>
			</div>
			<h2>Blog posts</h2>
			<ArticleArchive list={props.data.allWordpressWpPlanning.edges} />
		</Layout>
	)
}

Template.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired
}

// @TODO remove fields we're not using.
// @TODO setup categories
/*categories {
	id
	wordpress_id
	count
	name
	description
	path
}*/
export const query = graphql`
  query {
    allWordpressWpPlanning(
      filter: {
		  status: { eq: "publish" },
		  wpc_gatsby: { disable: { eq: false } }
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
