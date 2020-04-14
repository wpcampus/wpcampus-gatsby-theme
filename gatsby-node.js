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
		schema.buildObjectType({
			name: "wordpress__wp_podcast",
			fields: {
				"episode_featured_image": {
					type: "String",
					resolve(source) {
						if ("string" !== typeof source.episode_featured_image) {
							return ""
						}
						return source.episode_featured_image
					}
				},
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
	]
	createTypes(typeDefs)
}

/**
 * Create search nodes.
 * 
 * Am not using this code but its
 * a great example of how to create new
 * nodes from existing nodes so keeping
 * the code for now.
 */
/*exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
	const { createNode } = actions

	const types = [
		"wordpress__wp_podcast",
		"wordpress__POST",
		"wordpress__PAGE"
	]

	if (!types.includes(node.internal.type)) {
		return
	}

	const searchType = "wordpress__wp_search"

	// Create one search field that has all the values we want searched.
	let searchContent = `${node.title} ${node.excerpt} ${node.content}`

	const searchNode = {
		id: createNodeId(`${node.id}-search`),
		type: node.type,
		date: node.date,
		title: node.title,
		excerpt: node.excerpt,
		path: node.path
	}

	// Add author name(s) to search content
	if (node.author___NODE && node.author___NODE.length) {

		if ("object" === typeof node.author___NODE) {

			for (const property in node.author___NODE) {
				if (Object.prototype.hasOwnProperty.call(node.author___NODE, property)) {

					const authorNode = getNode(node.author___NODE[property])

					// Add author name to search content.
					if (authorNode.name) {
						searchContent += ` ${authorNode.name}`
					}
				}
			}
		} else if ( "string" === typeof node.author___NODE) {

			const authorNode = getNode(node.author___NODE)

			// Add author name to search content.
			if (authorNode.name) {
				searchContent += ` ${authorNode.name}`
			}
		}
	}

	// Add search content to node.
	searchNode.search = searchContent

	createNode({
		...searchNode,
		parent: null,
		children: [],
		internal:
		{
			type: searchType,
			contentDigest: createContentDigest(searchNode)
		}
	})
}*/

/**
 * Build content from WordPress content.
 * 
 * @TODO remove fields we're not using.
 */
exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions

	/*
	 * Create search page.
	 */
	createPage({
		path: "/search/",
		matchPath: "/search/*",
		component: path.resolve("src/templates/search.js")
	})

	/*
   	 * Build pages from WordPress "page" post type.
   	 * 
   	 * @TODO remove fields we're not using.
   	 * 
   	 * @TODO this means we can't have more than 5 levels of crumbs.
   	 */
	const pages = await graphql(`
		query {
			allWordpressPage(filter: { status: { eq: "publish" } }) {
				edges {
					node {
						id
						path
						title
						template
						parent_element {
							path
							title
							parent_element {
								path
								title
								parent_element {
									path
									title
									parent_element {
										path
										title
										parent_element {
											path
											title
										}
									}
								}
							}
						}
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

	const pageTemplate = path.resolve("./src/templates/page.js")
	const libraryTemplate = path.resolve("./src/templates/library.js")
	const indexTemplate = path.resolve("./src/templates/index.js")

	pages.data.allWordpressPage.edges.forEach(edge => {
		let template

		// @TODO will be able to delete after deleted from WordPress app.
		if ( "/blog/" === edge.node.path) {
			return
		}

		if ("template-library.php" == edge.node.template) {
			template = libraryTemplate
		} else if ("/" == edge.node.path) {
			template = indexTemplate
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
				crumbs: {
					path: edge.node.path,
					title: edge.node.title,
					parent_element: edge.node.parent_element
				},
				wpc_protected: edge.node.wpc_protected,
			},
		})
	})

	/*
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
						title
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
				crumbs: {
					path: edge.node.path,
					title: edge.node.title,
					parent_element: {
						path: "/blog/",
						title: "Blog"
					}
				},
			},
		})
	})

	/*
	 * Create main podcast page.
	 */
	createPage({
		path: "/podcast/",
		component: path.resolve("src/templates/podcasts.js")
	})

	/*
	 * Build podcast posts from WordPress "podcast" post type.
	 * 
	 * @TODO remove fields we're not using.
	 */
	const podcasts = await graphql(`
		query {
			allWordpressWpPodcast(
				filter: { type: { eq: "podcast" }, status: { eq: "publish" } }
			) {
				edges {
					previous {
						id
						wordpress_id
						slug
						path
						title
						date
					}
					next {
						id
						wordpress_id
						slug
						path
						title
						date
					}
					node {
						id
						path
						title
					}
				}
			}
		}
	`)
	const podcastTemplate = path.resolve("./src/templates/podcast.js")
	podcasts.data.allWordpressWpPodcast.edges.forEach(edge => {
		createPage({
			// will be the url for the page
			path: edge.node.path,
			// specify the component template of your choice
			component: slash(podcastTemplate),
			// In the ^template's GraphQL query, 'id' will be available
			// as a GraphQL variable to query for this posts's data.
			context: {
				id: edge.node.id,
				next: edge.next,
				previous: edge.previous,
				crumbs: {
					path: edge.node.path,
					title: edge.node.title,
					parent_element: {
						path: "/podcast/",
						title: "Podcast"
					}
				},
			},
		})
	})

	const categoriesPath = "/blog/categories/"

	/*
	 * Create main categories page.
	 */
	createPage({
		path: categoriesPath,
		component: path.resolve("src/templates/categories.js")
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
				crumbs: {
					path: edge.node.path,
					title: edge.node.name,
					parent_element: {
						path: categoriesPath,
						title: "Categories",
						parent_element: {
							path: "/blog/",
							title: "Blog"
						}
					}
				},
			},
		})
	})

	/*
	 * Create main contributors page.
	 */
	createPage({
		path: "/about/contributors/",
		component: path.resolve("src/templates/contributors.js")
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

		const contributorPath = "/about/contributors/" + edge.node.slug + "/"

		createPage({
			// will be the url for the page
			path: contributorPath,
			// specify the component template of your choice
			component: slash(authorTemplate),
			// In the ^template's GraphQL query, 'id' will be available
			// as a GraphQL variable to query for this posts's data.
			context: {
				id: edge.node.id,
				crumbs: {
					path: contributorPath,
					title: edge.node.name,
					parent_element: {
						path: "/about/contributors/",
						title: "Contributors",
						parent_element: {
							path: "/about/",
							title: "About"
						}
					}
				},
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
