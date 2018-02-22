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

    })
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};