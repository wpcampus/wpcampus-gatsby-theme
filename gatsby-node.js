/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const btoa = require("btoa")
const chalk = require("chalk")
const fetch = require("node-fetch")
const path = require("path")
const slash = require("slash")
const PropTypes = require("prop-types")

const is_env_dev = process.env.NODE_ENV === "development"

console.log("")
console.log(chalk.green(" -> Building WPCampus: Gatsby..."))
console.log(chalk.green(" -> Environment: " + process.env.NODE_ENV))
console.log("")

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
			name: "wpcForm",
			fields: {
				title: "String",
				permalink: "String"
			},
			interfaces: ["Node"],
		}),
		schema.buildObjectType({
			name: "wpcGatsby",
			fields: {
				disable: {
					type: "Boolean",
					resolve(source) {
						if (undefined === source.disable || !source.disable) {
							return false
						}
						if (true === source.disable) {
							return true
						}
						return false
					}
				},
				template: "String",
				forms: "[wpcForm]"
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
			name: "wordpress__wpc_librarySpeakers",
			fields: {
				headshot: {
					type: "String",
					resolve(source) {
						if ("string" !== typeof source.headshot) {
							return ""
						}
						return source.headshot
					}
				}
			},
			interfaces: ["Node"],
		}),
		schema.buildObjectType({
			name: "wordpress__wp_planning",
			fields: {
				wpc_gatsby: "wpcGatsby",
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
const jobNodeType = "wordpress__wpc_job"

/**
 * Create basic auth header.
 *
 * @param  {string} username
 * @param  {string} password
 * @return {string}
 */
const basicAuth = (username, password) => {
	return "Basic " + btoa(username + ":" + password)
}

const fetchContent = (url, use_dev_creds = false) => {

	let headers
	if (use_dev_creds) {
		headers = {
			Authorization: basicAuth(process.env.WPC_DEV_USER, process.env.WPC_DEV_PW)
		}
	} else {
		headers = {
			Authorization: basicAuth(process.env.WPC_JWT_USER, process.env.WPC_JWT_PASSWORD)
		}
	}

	let options = {
		method: "get",
		headers,
	}

	return fetch(url, options)
		.then((response) => {
			return response.json()
		})
		.catch(() => {
			// @TODO throw error
			return []
		})
}

const fetchContributors = async () => {
	try {
		const contributors_url = `${process.env.GATSBY_WPC_API}/wpcampus/contributors`

		console.log(chalk.green(" -> Fetching WPCampus contributors from: " + contributors_url + "..."))

		const contributors = await fetchContent(contributors_url)

		// Logging progress.
		console.log(chalk.green(" -> WPCampus contributors fetched: " + contributors.length))

		return contributors
	} catch (error) {
		console.log(chalk.red(" -> WPCampus contributors fetch error: " + error.message))
		return []
	}
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

const fetchJobs = async () => {
	try {
		const jobs_url = `${process.env.GATSBY_WPC_API}/wpcampus/data/public/jobs`

		console.log(chalk.green(" -> Fetching WPCampus jobs from: " + jobs_url + "..."))

		const jobs = await fetchContent(jobs_url, is_env_dev)

		// Logging progress.
		console.log(chalk.green(" -> WPCampus jobs fetched: " + jobs.length))

		return jobs
	} catch (error) {
		console.log(chalk.red(" -> WPCampus jobs fetch error: " + error.message))
		return []
	}
}

const fetchSessions = async () => {
	try {
		const sessions_url = `${process.env.GATSBY_WPC_API}/wpcampus/data/public/sessions`

		console.log(chalk.green(" -> Fetching WPCampus sessions from: " + sessions_url + "..."))

		const sessions = await fetchContent(sessions_url)

		// Logging progress.
		console.log(chalk.green(" -> WPCampus sessions fetched: " + sessions.length))

		return sessions
	} catch (error) {
		console.log(chalk.red(" -> WPCampus sessions fetch error: " + error.message))
		return []
	}
}

const createJobNodes = async ({ jobs, createNode, createNodeId, createContentDigest }) => {
	if (!jobs.length) {
		return
	}

	jobs.forEach(node => {

		const jobNode = node

		// Store ID for usage in logic and then delete/replace with node ID.
		const thisNodeID = node.ID
		delete node.ID

		// Change key for WordPress id. 
		jobNode.wordpress_id = parseInt(thisNodeID)

		// Add GraphQL ID
		jobNode.id = createNodeId(`wpc-job-${thisNodeID}`)

		createNode({
			...jobNode,
			parent: null,
			children: [],
			internal:
			{
				type: jobNodeType,
				contentDigest: createContentDigest(jobNode)
			}
		})
	})
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

	// Add some spacing to our logs.
	console.log("")

	// Fetch and process contributors.
	const contributors = await fetchContributors()
	createContributorNodes({ contributors, createNode, createNodeId, createContentDigest })

	// Get contributor nodes so can be related to library nodes.
	const contributorNodes = getNodes().filter(e => e.internal.type === contributorNodeType)

	// Fetch and process jobs.
	const jobs = await fetchJobs()
	createJobNodes({ jobs, createNode, createNodeId, createContentDigest })

	// Fetch and process library content.
	const items = await fetchSessions()
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
	const hasContributorTypes = ["wordpress__wp_planning", "wordpress__wp_podcast", "wordpress__POST"]

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

const createCategoriesPagesDirectors = async ({ categoriesPath, parentCrumbs, graphql, createPage }) => {

	// Ids of categories related to Board of Directors:
	// 63 - Governance
	// 285 - Board of Directors
	// 282 - Board Minutes
	const categoriesQuery = `
		query {
			allWordpressCategory(filter: {wordpress_id: {in: [63, 282, 285]}}) {
				edges {
					node {
						id
						name
						slug
						link
						wordpress_id
						wordpress_parent
						taxonomy
						path
						description
						count
					}
				}
			}
		}
	`

	const results = await graphql(categoriesQuery)

	// Get the data.
	let categoryData = results.data.allWordpressCategory.edges

	if (!categoryData) {
		return
	}

	const categoryIDs = []
	let categoryMain = null

	let index = categoryData.length
	categoryData.forEach(edge => {
		const category = edge.node

		// Store IDs to use in template
		categoryIDs.push(category.wordpress_id)

		// We need a "main" category to use in the template
		if (category.name === "Board of Directors") {
			categoryMain = category
		}

		if (index === 1 && !categoryMain) {
			categoryMain = category
		}

		index--
	})

	const pagePath = "/blog/categories/board-of-directors"

	const crumbs = {
		crumb: {
			path: pagePath,
			text: "Board of Directors",
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

	/*
	 * Create Board of Directors archive page.
	 */
	createPage({
		path: pagePath,
		component: path.resolve("./src/templates/categoryDirectors.js"),
		context: {
			categoryMain,
			categories: categoryIDs,
			crumbs: crumbs
		}
	})
}

createCategoriesPagesDirectors.propTypes = {
	categoriesPath: PropTypes.string.isRequired,
	parentCrumbs: PropTypes.object
}

/**
 * Build category archives.
 * 
 * One for blog posts, planning blog, and podcasts.
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
	if ("planning" === type) {
		postData = results.data.allWordpressWpPlanning.edges
	} else if ("podcast" === type) {
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

exports.onCreatePage = async ({ page, actions }) => {
	const { createPage } = actions

	// Used for matching pages only on the client.
	if (page.path.match(/^\/account/)) {
		page.matchPath = "/account/*"

		// Update the page.
		createPage(page)
	}
}

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
							template
							forms {
								title
								permalink
							}
						}
					}
				}
			}
		}
  	`)

	const formTemplate = path.resolve("./src/templates/formIframe.js")
	const pageTemplate = path.resolve("./src/templates/page.js")
	const auditTemplate = path.resolve("./src/templates/audit.js")
	const libraryTemplate = path.resolve("./src/templates/library.js")
	const workshopsTemplate = path.resolve("./src/templates/workshops-survey.js")
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

		let forms

		if ("library" === edge.node.wpc_gatsby.template) {
			template = libraryTemplate
		} else if ("workshops" === edge.node.wpc_gatsby.template) {
			template = workshopsTemplate
		} else if ("audit" === edge.node.wpc_gatsby.template) {
			template = auditTemplate
		} else if ("home" === edge.node.wpc_gatsby.template) {
			template = indexTemplate
		} else if ("form" == edge.node.wpc_gatsby.template) {
			template = formTemplate
			forms = edge.node.wpc_gatsby.forms
		}

		if (!template) {
			template = pageTemplate
		}

		const pageContext = {
			id: edge.node.id,
			crumbs: {
				crumb: edge.node.crumb,
				parent_element: edge.node.parent_element
			},
			wpc_protected: edge.node.wpc_protected,
		}

		if (forms) {
			pageContext.forms = forms
		}

		// Add to all pages in case they need it for manual iframes.
		pageContext.formOrigin = `https://${process.env.GATSBY_WPC_WORDPRESS}`

		createPage({
			path: edge.node.path,
			component: slash(template),
			context: pageContext,
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
				formOrigin: `https://${process.env.GATSBY_WPC_WORDPRESS}`,
				crumbs: {
					crumb: {
						path: edge.node.path,
						text: edge.node.title,
					},
					parent_element: {
						crumb: {
							path: "/blog/",
							text: "Community Blog"
						}
					}
				},
			},
		})
	})

	/*
	 * Create main planning page.
	 */
	createPage({
		path: "/community/planning/",
		component: path.resolve("src/templates/plannings.js")
	})

	/*
	 * Build planning posts from WordPress "planning" post type.
	 * 
	 * @TODO remove fields we're not using.
	 */
	const planningPosts = await graphql(`
		query {
			allWordpressWpPlanning(
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

	const planningTemplate = path.resolve("./src/templates/planning.js")
	planningPosts.data.allWordpressWpPlanning.edges.forEach(edge => {

		// Don't build disabled planning posts.
		if (true === edge.node.wpc_gatsby.disable) {
			return
		}

		createPage({
			// will be the url for the page
			path: edge.node.path,
			// specify the component template of your choice
			component: slash(planningTemplate),
			// In the ^template's GraphQL query, 'id' will be available
			// as a GraphQL variable to query for this posts's data.
			context: {
				id: edge.node.id,
				next: edge.next,
				previous: edge.previous,
				formOrigin: `https://${process.env.GATSBY_WPC_WORDPRESS}`,
				crumbs: {
					crumb: {
						path: edge.node.path,
						text: edge.node.title,
					},
					parent_element: {
						crumb: {
							path: "/community/planning/",
							text: "Planning"
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
				text: "Community Blog"
			}
		},
		archiveHeading: "Community Blog categories",
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

	// Create category page for blog posts about Board of Directors.
	createCategoriesPagesDirectors({
		categoriesPath: "/blog/categories/",
		parentCrumbs: {
			crumb: {
				path: "/blog/",
				text: "Community Blog"
			}
		},
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

	// Create job pages
	try {
	await graphql(`
		query {
			allWordpressWpcJob {
				edges {
					previous {
						id
						wordpress_id
						post_path
						job_title
					}
					next {
						id
						wordpress_id
						post_path
						job_title
					}
					node {
						id
						wordpress_id
						post_path
						job_title
					}
				}
			}
		}
	`)
		.then((result) => {
			console.log("jobs result", result)

		const jobTemplate = path.resolve("./src/templates/job.js")

			result.data.allWordpressWpcJob.edges.forEach((edge) => {
			const node = edge.node

			// Don't build disabled jobs.
			/* if (true === node.wpc_gatsby.disable) {
				return
			} */

			// Make sure we have a path.
			if (!node.post_path) {
				return
			}

			createPage({
				// will be the url for the page
				path: node.post_path,
				// specify the component template of your choice
				component: slash(jobTemplate),
				// In the ^template's GraphQL query, 'id' will be available
				// as a GraphQL variable to query for this posts's data.
				context: {
					id: node.id,
					crumbs: {
						crumb: {
							path: node.post_path,
							text: node.job_title,
						},
						parent_element: {
							crumb: {
								path: "/jobs/",
								text: "Jobs",
							},
					},
				},
					},
				})
			})
		})
		.catch((error) => {
			console.log(chalk.red(" -> Error querying jobs."), error)
	})
	} catch (error) {
		console.log(chalk.red(" -> Error querying jobs."), error)
	}
}