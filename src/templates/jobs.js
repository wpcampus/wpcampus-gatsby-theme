import React from "react"
import { graphql, Link } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"

const JobListing = ({ job }) => {
	return <div>
		<h2><Link to={job.path}>{job.title}</Link></h2>
	</div>
}

JobListing.propTypes = {
	job: PropTypes.object.isRequired
}

const Jobs = props => {

	const page = props.data.wordpressPage
	const jobs = props.data.allWordpressWpcJob.edges

	const layoutAttr = {
		metaDescription: page.wpc_seo.meta.description || null,
		metaRobots: page.wpc_seo.meta.robots || [],
		heading: page.title,
		sidebarBottom: true,
		crumbs: props.pageContext.crumbs,
		path: props.path
	}

	return <Layout {...layoutAttr}>
		<div>{ReactHtmlParser(page.content)}</div>
		{jobs.map(({ node }, i) => {
			return <JobListing key={i} job={node} />
		})}
	</Layout>
}

Jobs.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	pageContext: PropTypes.object.isRequired,
	edges: PropTypes.array,
}

export default Jobs

// @TODO remove fields we're not using.
export const pageQuery = graphql`
  query($id: String!) {
	allWordpressWpcJob {
		edges {
			node {
				date
				content {
					basic
					rendered
				}
				org_twitter
				org_video
				date_gmt
				job_category {
					name
					slug
					taxonomy
					term_id
				}
				job_closing_date
				job_location
				job_posted_date
				job_posting
				job_type {
					name
					slug
					taxonomy
					term_id
				}
				modified
				wordpress_id
				title
				status
				path
				permalink
				org_website
				org_name
				org_logo
				modified_gmt
				author {
					display_name
					email
					website
					twitter
					path
					company_position
					company
					bio
				}
				org_tagline {
					basic
					rendered
				}
			}
		}
	}
    wordpressPage(id: { eq: $id }) {
      id
      wordpress_id
      slug
      date
      title
      status
      excerpt
      content
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
