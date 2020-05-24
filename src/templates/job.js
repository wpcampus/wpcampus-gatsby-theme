import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"

import Layout from "../components/layout"

const JobTemplate = props => {

	const context = props.pageContext
	const job = props.data.wordpressWpcJob

	const layoutAttr = {
		//metaDescription: null, // @TODO wpc_seo.meta.description
		//metaRobots: null, // @TODO job.wpc_seo.meta.robots || [],
		classes: "wpc-job",
		heading: job.title,
		pageTitle: `${job.title} | Job Board`,
		path: props.path,
		crumbs: context.crumbs,
	}

	return (
		<Layout {...layoutAttr}>
			<div>{ReactHtmlParser(job.content.rendered)}</div>
		</Layout>
	)
}

JobTemplate.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	edges: PropTypes.array,
	pageContext: PropTypes.object.isRequired,
}

export default JobTemplate

// @TODO remove fields we're not using.
export const podcastQuery = graphql`
  query($id: String!) {
    wordpressWpcJob(id: { eq: $id }) {
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
    site {
      siteMetadata {
        siteName
      }
    }
  }
`
