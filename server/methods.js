Meteor.methods({
  omAccountsGetRoles: function () {
    return OmAccountManager.config.roles;
  }
});
