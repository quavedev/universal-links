Package.describe({
  name: 'quave:universal-links',
  version: '1.0.0',
  summary: 'Utility package to configure iOS Universal Links',
  git: 'https://github.com/quavedev/universal-links',
});

Package.onUse(function(api) {
  api.versionsFrom('1.10.2');
  api.use(['ecmascript', 'webapp']);

  api.use('quave:settings@1.0.0');

  api.mainModule('universal-links.js');
});
