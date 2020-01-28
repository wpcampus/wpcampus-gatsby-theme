/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
const slash = require(`slash`)

// Build pages from WordPress content
// @TODO remove fields we're not using.
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
  ]
  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

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
            }
          }
        }
      }
    }
  `)

  const pageTemplate = path.resolve(`./src/templates/page.js`)
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

  const posts = await graphql(`
    query {
      allWordpressPost( filter: { type: { eq: "post" }, status: { eq: "publish" } } ) {
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
            }
          }
        }
      }
    }
  `)
  const postTemplate = path.resolve(`./src/templates/post.js`)
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
  const categoryTemplate = path.resolve(`./src/templates/category.js`)
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
  const authorTemplate = path.resolve(`./src/templates/contributor.js`)
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
}
