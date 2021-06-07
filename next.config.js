require('dotenv').config()

module.exports = {
  env: {
    STRAPI_URL: process.env.STRAPI_URL,
  },
  images: {
    domains: [process.env.STRAPI_DOMAIN],
  },
}