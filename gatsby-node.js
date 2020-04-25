/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const chalk = require("chalk")
const fetch = require("node-fetch")
const path = require("path")
const slash = require("slash")
const PropTypes = require("prop-types")

// Returns the path from a full URL.
const getNodePathFromLink = link => {
	if (!link) {
		return ""
	}
	try {
		const url = new URL(link)
		return url.pathname
	} catch (error) {
		return link
	}
}

/**
 * Fetch our JWT token from the JWT token endpoint.
 */
async function getJWToken() {
	try {

		const auth = {
			username: process.env.WPC_JWT_USER,
			password: process.env.WPC_JWT_PASSWORD,
		}

		const authURL = `${process.env.WPC_API}/jwt-auth/v1/token`

		const options = {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(auth)
		}

		let token

		await fetch(authURL, options)
			.then((response) => {
				return response.json()
			})
			.then((data) => {
				token = data.token
			})

		return token
	} catch (e) {
		return ""
	}
}

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
			name: "wpcSEOMeta",
			fields: {
				description: "String",
				robots: "[String]"
			},
			interfaces: ["Node"],
		}),
		schema.buildObjectType({
			name: "wpcSEO",
			fields: {
				title: "String",
				meta: "wpcSEOMeta"
			},
			interfaces: ["Node"],
		}),
		schema.buildObjectType({
			name: "wpcGatsby",
			fields: {
				disable: "Boolean"
			},
			interfaces: ["Node"],
		}),
		schema.buildObjectType({
			name: "wpcCrumb",
			fields: {
				path: {
					type: "String",
					resolve: source => {
						if (source.path) {
							return source.path
						}
						if (source.link) {
							return getNodePathFromLink(source.link)
						}
						return ""
					}
				},
				aria_label: "String",
				text: "String"
			},
			interfaces: ["Node"],
		}),
		schema.buildObjectType({
			name: "wordpress__PAGE",
			fields: {
				wpc_gatsby: "wpcGatsby",
				wpc_protected: "wpcProtected",
				wpc_seo: "wpcSEO",
				crumb: "wpcCrumb"
			},
			interfaces: ["Node"],
		}),
		schema.buildObjectType({
			name: "wordpress__POST",
			fields: {
				wpc_gatsby: "wpcGatsby",
				wpc_protected: "wpcProtected",
				wpc_seo: "wpcSEO"
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
				wpc_gatsby: "wpcGatsby",
				wpc_seo: "wpcSEO"
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
		// The GF source made this type.
		schema.buildObjectType({
			name: "GF__FormFormFieldsInputs",
			fields: {
				choices: "String",
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

const contributorNodeType = "wordpress__wpc_contributors"
const libraryNodeType = "wordpress__wpc_library"

const fetchContributors = async (accessToken) => {

	// Build request.
	let options = {
		method: "get",
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	}

	const url = `${process.env.WPC_API}/wpcampus/contributors`

	const contributors = await fetch(url, options)
		.then((response) => {
			return response.json()
		})

	// Logging progress.
	console.log(chalk.green(" -> WPCampus contributors fetched: " + contributors.length))

	return contributors
}

const createContributorNodes = async ({ contributors, createNode, createNodeId, createContentDigest }) => {
	if (!contributors.length) {
		return
	}

	// Create contributor nodes.
	contributors.forEach(node => {

		const contributorNode = {
			id: createNodeId(`wpc-contributor-${node.ID}`),
			wordpress_id: parseInt(node.ID),
			path: node.path,
			email: node.email,
			website: node.website,
			display_name: node.display_name,
			twitter: node.twitter,
			company: node.company,
			company_position: node.company_position,
			bio: node.bio
		}

		createNode({
			...contributorNode,
			parent: null,
			children: [],
			internal:
			{
				type: contributorNodeType,
				contentDigest: createContentDigest(contributorNode)
			}
		})
	})
}

createContributorNodes.propTypes = {
	contributors: PropTypes.array.isRequired,
	createNode: PropTypes.func.isRequired,
	createNodeId: PropTypes.func.isRequired,
	createContentDigest: PropTypes.func.isRequired
}

const fetchSessions = async (accessToken) => {

	// Build request.
	let options = {
		method: "get",
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	}

	const url = `${process.env.WPC_API}/wpcampus/data/public/sessions`

	const sessions = await fetch(url, options)
		.then((response) => {
			return response.json()
		})

	// Logging progress.
	console.log(chalk.green(" -> WPCampus sessions fetched: " + sessions.length))

	return sessions
}

const createLibraryNodes = async ({ items, libraryType, contributorNodes, createNode, createNodeId, createContentDigest }) => {
	if (!items.length) {
		return
	}

	// Create library nodes.
	items.forEach(node => {

		const libraryNode = node

		// Store ID for usage in logic and then delete/replace with node ID.
		const thisNodeID = node.ID
		delete node.ID

		// Change key for WordPress id. 
		libraryNode.wordpress_id = parseInt(thisNodeID)

		// Add GraphQL ID
		libraryNode.id = createNodeId(`wpc-library-${thisNodeID}`)

		// Add library type.
		libraryNode.type = libraryType

		libraryNode.author___NODE = node.speakers
			.map(speaker => {

				if (!speaker.wordpress_user) {
					return undefined
				}

				// Find the user.
				const user = contributorNodes.find(u => u.wordpress_id === speaker.wordpress_user)

				if (user) {
					return user.id
				}

				return undefined
			})
			.filter(node => node !== undefined)

		createNode({
			...libraryNode,
			parent: null,
			children: [],
			internal:
			{
				type: libraryNodeType,
				contentDigest: createContentDigest(libraryNode)
			}
		})
	})
}

createLibraryNodes.propTypes = {
	items: PropTypes.array.isRequired,
	libraryType: PropTypes.string.isRequired,
	contributorNodes: PropTypes.object.isRequired,
	createNode: PropTypes.func.isRequired,
	createNodeId: PropTypes.func.isRequired,
	createContentDigest: PropTypes.func.isRequired
}

/**
 * Create nodes from our custom WP API endpoints.
 */
exports.sourceNodes = async ({ actions, getNodes, createNodeId, createContentDigest }) => {
	const { createNode } = actions

	// Get access token.
	const accessToken = await getJWToken()

	// @TODO throw error?
	if (!accessToken) {
		return
	}

	// Add some spacing to our logs.
	console.log("")

	// Fetch and process contributors.
	const contributors = await fetchContributors(accessToken)
	createContributorNodes({ contributors, createNode, createNodeId, createContentDigest })

	// Get contributor nodes so can be related to library nodes.
	const contributorNodes = getNodes().filter(e => e.internal.type === contributorNodeType)

	// Fetch and process library content.
	const items = await fetchSessions(accessToken)
	createLibraryNodes({ items, libraryType: "session", contributorNodes, createNode, createNodeId, createContentDigest })

	// Add some spacing to our logs.
	console.log("")

	// No point in processing if no nodes.
	if (!contributorNodes.length) {
		return
	}

	/**
	 * We have to tweak our content authors because we have a multi author setup.
	 *
	 * This connects an array of author IDs (instead of a single ID) to their contributor nodes.
	 */
	const hasContributorTypes = ["wordpress__wp_podcast", "wordpress__POST"]

	getNodes()
		.filter(node => { if (hasContributorTypes.includes(node.internal.type)) return node })
		.map(node => {

			if (!node.author || !node.author.length) {
				return node
			}

			node.author___NODE = node.author
				.map(userID => {

					// Find the user.
					const user = contributorNodes.find(u => u.wordpress_id === userID)

					if (user) {
						return user.id
					}

					return undefined
				})
				.filter(node => node !== undefined)

			delete node.author

			return node
		})
}

const postCategoriesQuery = `
	query {
		allWordpressPost(
			filter: { 
				status: { eq: "publish" },
				wpc_gatsby: { disable: { eq: false } }
			}
		) {
			edges {
				node {
					categories {
						id
						name
						slug
						description
					}
				}
			}
		}
	}
`

const podcastCategoriesQuery = `
	query {
		allWordpressWpPodcast(
			filter: {
				status: { eq: "publish" },
				wpc_gatsby: { disable: { eq: false } }
			}
		) {
			edges {
				node {
					categories {
						id
						name
						slug
						description
					}
				}
			}
		}
	}
`

/**
 * Build category archives.
 * 
 * One for blog posts and one for podcasts.
 * 
 * Query content and create a category page
 * for all categories assigned to content.
 * 
 * We're getting all the category info because
 * we're passing this info to the categories 
 * page template.
 */
const createCategoriesPages = async ({ type, categoriesPath, parentCrumbs, archiveHeading, graphql, createPage }) => {

	// Will hold categories that are assigned to posts.
	const postCategories = []

	// Will hold IDs of categories that have been processed.
	const processedCategories = []

	let categoriesQuery = false
	if ("podcast" === type) {
		categoriesQuery = podcastCategoriesQuery
	} else if ("post" == type) {
		categoriesQuery = postCategoriesQuery
	}

	if (!categoriesQuery) {
		return
	}

	// Query our post type with categories.
	const results = await graphql(categoriesQuery)

	// Get the data.
	let postData = []
	if ("podcast" === type) {
		postData = results.data.allWordpressWpPodcast.edges
	} else if ("post" == type) {
		postData = results.data.allWordpressPost.edges
	}

	if (!postData) {
		return
	}

	const capitalType = type.replace(/^\w/, c => c.toUpperCase())

	// Pricess the post and category data and create pages.
	const categoryTemplate = path.resolve(`./src/templates/category${capitalType}.js`)
	postData.forEach(edge => {

		const post = edge.node

		// Only neeed to process if the post has categories.
		if (!post.categories || !post.categories.length) {
			return
		}

		// Process each category.
		post.categories.forEach(category => {

			// So we don't process the same category more than once.
			if (processedCategories.includes(category.id)) {
				return
			}
			processedCategories.push(category.id)

			// Create the path for this category.
			category.path = categoriesPath + category.slug

			// Store for categories template.
			postCategories.push(category)

			const crumbs = {
				crumb: {
					path: category.path,
					text: category.name,
				},
				parent_element: {
					crumb: {
						path: categoriesPath,
						text: "Categories"
					}
				}
			}

			if (parentCrumbs) {
				crumbs.parent_element.parent_element = parentCrumbs
			}

			createPage({
				path: category.path,
				component: slash(categoryTemplate),
				context: {
					id: category.id,
					crumbs: crumbs,
					category: category
				},
			})
		})
	})

	const archiveCrumbs = {
		crumb: {
			path: categoriesPath,
			text: "Categories",
		}
	}

	if (parentCrumbs) {
		archiveCrumbs.parent_element = parentCrumbs
	}

	/*
	 * Create categories archive page.
	 */
	createPage({
		path: categoriesPath,
		component: path.resolve("src/templates/categories.js"),
		context: {
			categories: postCategories,
			heading: archiveHeading,
			crumbs: archiveCrumbs
		}
	})
}

createCategoriesPages.propTypes = {
	type: PropTypes.string.isRequired,
	categoriesPath: PropTypes.string.isRequired,
	archiveHeading: PropTypes.string.isRequired,
	parentCrumbs: PropTypes.object
}

/**
 * Build content from WordPress content.
 * 
 * @TODO remove fields we're not using.
 */
exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions

	/*
	 * Create login page.
	 */
	createPage({
		path: "/login/",
		component: path.resolve("src/templates/login.js")
	})

	/*
	 * Create profile page.
	 */
	createPage({
		path: "/profile/",
		component: path.resolve("src/templates/profile.js")
	})

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
			allWordpressPage(
				filter: {
					status: { eq: "publish" },
					wpc_gatsby: { disable: { eq: false } }
				}
			) {
				edges {
					node {
						id
						path
						title
						crumb {
							path
							aria_label
							text
						}
						template
						parent_element {
							path
							crumb {
								path
								aria_label
								text
							}
							parent_element {
								path
								crumb {
									path
									aria_label
									text
								}
								parent_element {
									path
									crumb {
										path
										aria_label
										text
									}
									parent_element {
										path
										crumb {
											path
											aria_label
											text
										}
										parent_element {
											path
											crumb {
												path
												aria_label
												text
											}
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
						wpc_gatsby {
							disable
						}
					}
				}
			}
		}
  	`)

	const contactTemplate = path.resolve("./src/templates/contact.js")
	const pageTemplate = path.resolve("./src/templates/page.js")
	const libraryTemplate = path.resolve("./src/templates/library.js")
	const indexTemplate = path.resolve("./src/templates/index.js")

	pages.data.allWordpressPage.edges.forEach(edge => {
		let template

		// @TODO will be able to delete after deleted from WordPress app.
		if ("/blog/" === edge.node.path) {
			return
		}

		// Don't build disabled pages.
		if (true === edge.node.wpc_gatsby.disable) {
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
					crumb: edge.node.crumb,
					parent_element: edge.node.parent_element
				},
				wpc_protected: edge.node.wpc_protected,
			},
		})
	})

	createPage({
		path: "/about/contact/",
		component: slash(contactTemplate),
		context: {
			wpc_protected: {
				protected: false,
			},
		},
	})

	/*
   	 * Build blog posts from WordPress "post" post type.
   	 * 
   	 * @TODO remove fields we're not using.
   	 */
	const posts = await graphql(`
		query {
			allWordpressPost(
				filter: { 
					status: { eq: "publish" },
					wpc_gatsby: { disable: { eq: false } }
				}
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
						wpc_gatsby {
							disable
						}
					}
				}
			}
		}
  	`)
	const postTemplate = path.resolve("./src/templates/post.js")
	posts.data.allWordpressPost.edges.forEach(edge => {

		// Don't build disabled posts.
		if (true === edge.node.wpc_gatsby.disable) {
			return
		}

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
					crumb: {
						path: edge.node.path,
						text: edge.node.title,
					},
					parent_element: {
						crumb: {
							path: "/blog/",
							text: "Blog"
						}
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
				filter: {
					status: { eq: "publish" },
					wpc_gatsby: { disable: { eq: false } }
				}
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
						wpc_gatsby {
							disable
						}
					}
				}
			}
		}
	`)
	const podcastTemplate = path.resolve("./src/templates/podcast.js")
	podcasts.data.allWordpressWpPodcast.edges.forEach(edge => {

		// Don't build disabled podcasts.
		if (true === edge.node.wpc_gatsby.disable) {
			return
		}

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
					crumb: {
						path: edge.node.path,
						text: edge.node.title,
					},
					parent_element: {
						crumb: {
							path: "/podcast/",
							text: "Podcast"
						}
					}
				},
			},
		})
	})

	// Create category pages for blog posts.
	createCategoriesPages({
		type: "post",
		categoriesPath: "/blog/categories/",
		parentCrumbs: {
			crumb: {
				path: "/blog/",
				text: "Blog"
			}
		},
		archiveHeading: "Blog categories",
		graphql,
		createPage
	})

	// Create category pages for podcasts.
	createCategoriesPages({
		type: "podcast",
		categoriesPath: "/podcast/categories/",
		parentCrumbs: {
			crumb: {
				path: "/podcast/",
				text: "Podcast"
			}
		},
		archiveHeading: "Podcast categories",
		graphql,
		createPage
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
			allWordpressWpcContributors {
				edges {
					node {
						id
						path
						display_name											
					}
				}
			}
		}
  	`)
	const authorTemplate = path.resolve("./src/templates/contributor.js")
	authors.data.allWordpressWpcContributors.edges.forEach(edge => {

		const contributorPath = "/about/contributors/" + edge.node.path + "/"

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
					crumb: {
						path: contributorPath,
						text: edge.node.display_name,
					},
					parent_element: {
						crumb: {
							path: "/about/contributors/",
							text: "Contributors",
						},
						parent_element: {
							crumb: {
								path: "/about/",
								text: "About"
							}
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
