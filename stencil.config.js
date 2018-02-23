const sass = require('@stencil/sass');

exports.config = {
  namespace: 'zapstencilcomponents',
  generateDistribution: true,
  bundles: [
    {
      components: [
        'zap-datepicker',
        'month-header',
        'week-header',
        'datepicker-week'
      ]
    }
  ],
  plugins: [
    sass({
      includePaths: [
        // require("node_modules/@zaplabs/zap-shared-styles").includePaths
        // '/node_modules/@zaplabs/zap-shared-styles'
      ]
    })
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};