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
      includePaths: [require("@zaplabs/zap-shared-styles").includePaths]
    })
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};