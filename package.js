Package.describe({
  name: 'othermachines:account-manager',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Administrative user account editing and role managememnt',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/othermachines/om-account-manager',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  api.use('ecmascript');
  api.use([
    'meteor-base',
    'underscore',
    'mongo',
    'tracker',
    'accounts-password',
    'alanning:roles',
    'templating',
    'blaze-html-templates',
    'kadira:flow-router',
    'kadira:blaze-layout'
  ], ['client', 'server']);

//  api.use([
//  ], ['client']);
//
  api.addFiles([
    'account-manager.js',
  ], ['client', 'server']);

  api.addFiles([
    'account-manager.css',
    'client/views/omAccountsUsers.html',
    'client/views/omAccountsUsers.js',
    'client/views/omAccountsAddUser.html',
    'client/views/omAccountsAddUser.js',
    'client/views/omAccountsEditUser.html',
    'client/views/omAccountsEditUser.js',
  ], ['client']);

  api.addFiles([
    'server/OmAccountManager.js',
    'server/publications.js',
    'server/methods.js',
    'server/db/users.js',
    'server/allowdeny.js',
  ], ['server']);

  api.export('OmAccountManager', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('othermachines:account-manager');
  api.addFiles('account-manager-tests.js');
});
