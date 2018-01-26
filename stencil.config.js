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
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};