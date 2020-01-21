/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
const slash = require(`slash`)

// Build pages from WordPress content
// @TODO remove fields we're not using.
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
