require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

/**
 * We have to tweak our content authors because we have a multi author setup.
 *
 * This connects an array of author IDs (instead of a single ID) to their nodes in the users query.
 */
const mapAuthorsToUsers = ({ entities }) => {
  const users = entities.filter(e => e.__type === `wordpress__wp_users`)
  return entities.map(entity => {
    if (!users.length) {
      return entity
    }
    if (!entity.author || !entity.author.length) {
      return entity
    }

    entity.author___NODE = entity.author
      .map(userID => {
        // Find the user
        const user = users.find(u => u.wordpress_id === userID)

        if (user) {
          return user.id
        }
        return undefined
      })
      .filter(node => node != undefined)
    delete entity.author

    return entity
  })
}

module.exports = {
  siteMetadata: {
    title: `WPCampus`,
    description: `WPCampus is a community of web professionals, educators, and people dedicated to advancing higher education by providing support, resources, and training focused on open source web publishing technologies.`,
    author: `@wpcampusorg`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/wpcampus-favicon.svg`,
      },
    },
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        baseUrl: process.env.WPC_HOST,
        protocol: `https`,
        hostingWPCOM: false,
        useACF: false,
        includedRoutes: [
          "**/posts",
          "**/pages",
          "**/categories",
          "**/users", // @TODO security concern?
          "**/members", // @TODO security concern?
        ],
        auth: {
          jwt_user: process.env.WPC_USER,
          jwt_pass: process.env.WPC_PASSWORD,
        },
        normalizers: normalizers => [
          ...normalizers,
          {
            name: "mapAuthorsToUsers",
            normalizer: mapAuthorsToUsers,
          },
        ],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
