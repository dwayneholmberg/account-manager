Meteor.users.allow({
  insert: function (userId, doc) {
    // are they authorized to manage users?
    if (userId &&
      Roles.userIsInRole(userId, OmAccountManager.config.userManagerRoles)) {
      return true;
    }
    return false;
  },

  update: function (userId, doc, fields, modifier) {
    // are they authorized to manage users?
    if (userId &&
      Roles.userIsInRole(userId, OmAccountManager.config.userManagerRoles)) {
      return true;
    }
    // is this their own record?
    if (userId && userId == doc._id) {
      // are they updating an allowed field?
      // can only update email or profile
      if (_.without(fields, ['profile', 'emails']).length === 0) {
        return true;
      }
    }
    return false;
  },

  remove: function (userId, doc) {
    // are they authorized to manage users?
    if (userId &&
      Roles.userIsInRole(userId, OmAccountManager.config.userManagerRoles)) {
      return true;
    }
    return false;
  }
});
