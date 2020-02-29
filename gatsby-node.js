/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path")
const slash = require("slash")

/**
 * Creating a custom schema for our protected post meta
 * that the WPCampus: Members WordPress plugin adds to the
 * WordPress REST API.
 * 
 * We use this data to protect/restrict content.
 */
exports.createSchemaCustomization = ({ actions, schema }) => {
	const { createTypes } = actions
	const typeDefs = [
		schema.buildObjectType({
			name: "userRoles",
			fields: {
				enable: "[String!]",
				disable: "[String!]",
			},
			interfaces: ["Node"],
		}),
		schema.buildObjectType({
			name: "wpcProtected",
			fields: {
				protected: {
					type: "Boolean",
					resolve: source => true === source.protected || false,
				},
				user_roles: "userRoles",
				message: "String"
			},
			interfaces: ["Node"],
		}),
		schema.buildObjectType({
			name: "wordpress__PAGE",
			fields: {
				wpc_protected: "wpcProtected",
			},
			interfaces: ["Node"],
		}),
		schema.buildObjectType({
			name: "wordpress__POST",
			fields: {
				wpc_protected: "wpcProtected",
			},
			interfaces: ["Node"],
		}),
		/*schema.buildObjectType({
      name: "wordpress__wp_members",
      fields: {
        wpc_protected: "wpcProtected",
      },
      interfaces: ["Node"],
    }),*/
		// The GF source made this type.
		schema.buildObjectType({
			name: "GF__FormFormFields",
			fields: {
				useRichTextEditor: {
					type: "Boolean",
					resolve: source => true === source.useRichTextEditor || false,
				},
				inputs: "[GF__FormFormFieldsInputs]",
			},
		}),
		// We made this type.
		schema.buildObjectType({
			name: "GF__FormFormFieldsChoices",
			fields: {
				text: "String",
				value: "String",
				isSelected: "Boolean",
				price: "String",
			},
			interfaces: ["Node"],
		}),
		// The GF source made this type.
		schema.buildObjectType({
			name: "GF__FormFormFieldsInputs",
			fields: {
				choices: "[GF__FormFormFieldsChoices]",
				customLabel: "String",
				defaultValue: "String",
				label: "String",
				name: "String",
				placeholder: "String",
				inputType: "String",
				isHidden: "Boolean",
			},
			interfaces: ["Node"],
		}),
	]
	createTypes(typeDefs)
}

/**
 * Build content from WordPress content.
 * 
 * @TODO remove fields we're not using.
 */
exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions

	/**
   * Build pages from WordPress "page" post type.
   * 
   * @TODO remove fields we're not using.
   */
	const pages = await graphql(`
    query {
      allWordpressPage(filter: { status: { eq: "publish" } }) {
        edges {
          node {
            id
            path
            template
            wpc_protected {
              protected
              user_roles {
                enable
                disable
              }
              message
            }
          }
        }
      }
    }
  `)

	const contactTemplate = path.resolve("./src/templates/contact.js")
	const pageTemplate = path.resolve("./src/templates/page.js")
	const libraryTemplate = path.resolve("./src/templates/library.js")

	pages.data.allWordpressPage.edges.forEach(edge => {
		let template

		if ("template-library.php" == edge.node.template) {
			template = libraryTemplate
		} else {
			template = pageTemplate
		}

		createPage({
			// will be the url for the page
			path: edge.node.path,
			// specify the component template of your choice
			component: slash(template),
			// In the ^template's GraphQL query, 'id' will be available
			// as a GraphQL variable to query for this posts's data.
			context: {
				id: edge.node.id,
				wpc_protected: edge.node.wpc_protected,
			},
		})
	})

	createPage({
		path: "/contact-test",
		component: slash(contactTemplate),
		context: {
			wpc_protected: {
				protected: false,
			},
		},
	})

	/**
   * Build blog posts from WordPress "post" post type.
   * 
   * @TODO remove fields we're not using.
   */
	const posts = await graphql(`
    query {
      allWordpressPost(
        filter: { type: { eq: "post" }, status: { eq: "publish" } }
      ) {
        edges {
          previous {
            id
            wordpress_id
            slug
            path
            title
            date
            wpc_protected {
              protected
              user_roles {
                enable
                disable
              }
              message
            }
          }
          next {
            id
            wordpress_id
            slug
            path
            title
            date
            wpc_protected {
              protected
              user_roles {
                enable
                disable
              }
              message
            }
          }
          node {
            id
            path
            wpc_protected {
              protected
              user_roles {
                enable
                disable
              }
              message
            }
          }
        }
      }
    }
  `)
	const postTemplate = path.resolve("./src/templates/post.js")
	posts.data.allWordpressPost.edges.forEach(edge => {
		createPage({
			// will be the url for the page
			path: edge.node.path,
			// specify the component template of your choice
			component: slash(postTemplate),
			// In the ^template's GraphQL query, 'id' will be available
			// as a GraphQL variable to query for this posts's data.
			context: {
				id: edge.node.id,
				wpc_protected: edge.node.wpc_protected,
				next: edge.next,
				previous: edge.previous,
			},
		})
	})

	/**
   * Build category archives from WordPress "categories" taxonomy.
   * 
   * @TODO remove fields we're not using.
   */
	const categories = await graphql(`
    query {
      allWordpressCategory {
        edges {
          previous {
            id
            wordpress_id
            count
            name
            description
            path
          }
          next {
            id
            wordpress_id
            count
            name
            description
            path
          }
          node {
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
  `)
	const categoryTemplate = path.resolve("./src/templates/category.js")
	categories.data.allWordpressCategory.edges.forEach(edge => {
		createPage({
			// will be the url for the page
			path: edge.node.path,
			// specify the component template of your choice
			component: slash(categoryTemplate),
			// In the ^template's GraphQL query, 'id' will be available
			// as a GraphQL variable to query for this posts's data.
			context: {
				id: edge.node.id,
				next: edge.next,
				previous: edge.previous,
			},
		})
	})

	/**
   * Build contributor pages from WordPress users list.
   * 
   * @TODO remove fields we're not using.
   */
	const authors = await graphql(`
    query {
      allWordpressWpUsers {
        edges {
          node {
            id
            wordpress_id
            name
            slug
            path
            url
          }
        }
      }
    }
  `)
	const authorTemplate = path.resolve("./src/templates/contributor.js")
	authors.data.allWordpressWpUsers.edges.forEach(edge => {
		createPage({
			// will be the url for the page
			path: "/contributor/" + edge.node.slug,
			// specify the component template of your choice
			component: slash(authorTemplate),
			// In the ^template's GraphQL query, 'id' will be available
			// as a GraphQL variable to query for this posts's data.
			context: {
				id: edge.node.id,
			},
		})
	})

	/**
   * Build contributor archive from WordPress users list.
   * 
   * @TODO remove fields we're not using.
   */
	/*const members = await graphql(`
    query {
      allWordpressWpMembers(
        filter: { type: { eq: "member" }, status: { eq: "publish" } }
      ) {
        edges {
          node {
            id
            path
            template
            wpc_protected {
              protected
              user_roles {
                enable
                disable
              }
              message
            }
          }
        }
      }
    }
  `)
  const memberPageTemplate = path.resolve(`./src/templates/memberPage.js`)
  members.data.allWordpressWpMembers.edges.forEach(edge => {
    createPage({
      // will be the url for the page
      path: edge.node.path,
      // specify the component template of your choice
      component: slash(memberPageTemplate),
      // In the ^template's GraphQL query, 'id' will be available
      // as a GraphQL variable to query for this data.
      context: {
        id: edge.node.id,
        wpc_protected: edge.node.wpc_protected,
      },
    })
  })*/
}
