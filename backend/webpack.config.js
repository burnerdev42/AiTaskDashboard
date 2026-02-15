/**
 * Custom Webpack configuration for NestJS
 * Extends the default NestJS webpack config to handle pino-pretty transport
 */
module.exports = function (options) {
  return {
    ...options,
    externals: [
      ...(options.externals || []),
      // Externalize pino-pretty so it can be dynamically loaded at runtime
      'pino-pretty',
    ],
  };
};
