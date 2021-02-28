const path = require('path')

module.exports = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  webpack: (config) => {
    config.resolve.alias['ThreejsExample'] = path.resolve(__dirname, 'node_modules/three/examples')
    return config
  },
}