Meteor.methods({
  omAccountsGetRoles: function () {
    return OmAccountManager.config.roles;
  },

  omAccountsGetGroups: function () {
    if (OmAccountManager.config.groups) {
      return OmAccountManager.config.groups;
    } else {
      return false;
    }
  },
});
