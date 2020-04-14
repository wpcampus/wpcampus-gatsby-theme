import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { CategoryArchive } from "../components/archive"

export default function Template(props) {
	const crumbs = {
		crumb: {
			path: props.path,
			text: "Categories",
		},
		parent_element: {
			crumb: {
				path: "/blog/",
				text: "Blog"
			}
		}
	}
	return (
		<Layout heading="Categories" crumbs={crumbs} path={props.path}>
			<CategoryArchive list={props.data.allWordpressCategory.edges} />
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
    allWordpressCategory {
      edges {
        node {
          id
          wordpress_id
          count
          name
          description
          path
          parent {
            ... on wordpress__CATEGORY {
              id
              id
              wordpress_id
              count
              name
              path
            }
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
