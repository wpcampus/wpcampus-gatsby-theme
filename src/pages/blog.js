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
			text: "Community Blog"
		}
	}

	// @TODO add meta description?

	return (
		<Layout pageTitle="Community Blog" heading="The WPCampus Community Blog" crumbs={crumbs} path={props.path}>
			<div className="blog-about">
				<div>
					<h2>About the blog</h2>
					<p>The WPCampus Community Blog is the place for all primary and essential announcements related to our organization and community&#39;s growth.</p>
					<p>If you&#39;re interested in helping plan our community, participate in surveys or looking for leadership and volunteer opportunities, visit the <Link to="/community/planning/">WPCampus Planning Blog</Link>.</p>
				</div>
				<div className="wpc-callout">
					<h2>Subscribe to updates</h2>
					<p>This mailing list sends an automated email that lets you know when we post to the WPCampus Community Blog.</p>
					<a className="wpc-button wpc-button--dark" href="http://eepurl.com/dOd-Q9" target="_blank" rel="noreferrer">Subscribe to Community Blog updates</a>
				</div>
			</div>
			<h2>Blog posts</h2>
			<ArticleArchive list={props.data.allWordpressPost.edges} />
		</Layout>
	)
}

Template.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired
}

// @TODO remove fields we're not using.
export const query = graphql`
  query {
    allWordpressPost(
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
        siteName
      }
    }
  }
`
