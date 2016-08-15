Accounts.onCreateUser( function(options, user) {
  if (options._id) {
    user._id = options._id;
  }
  user.active = options.active;
  if (options.profile) {
    user.profile = options.profile;
  }
  return user;
});

Accounts.validateLoginAttempt(function(attempt) {
  // if the login was going to be allowed by default
  // we now need to check the active status on the
  // user account
  if (attempt.allowed){
    return attempt.user.active;
  }
});

Meteor.methods({
  /**
   * user = {
   *  email: email,
   *  password: password,
   *  profile: {
   *    name: name
   *  },
   *  active: true // added here
   * };
   *
   * Note that all users will belong to the "default" group.
   * This confers to special privileges, but allows for access
   * to functionality that is not group-constrained
   */
  omAccountManagerAddUser: function(user, roles, groups) {

    var loggedInUser = Meteor.user();

    if (!loggedInUser ||
      !Roles.userIsInRole(loggedInUser, OmAccountManager.config.userManagerRoles, Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error('not-authorized', 'Insufficient privileges to add a user');
    }

    groups.push('default');

    user.active = true;
    var id = Accounts.createUser(user);

    groups.forEach(function (group) {
      Roles.addUsersToRoles(id, roles, group);
    });

    Meteor.users.update({_id: id}, {$set: {cachedRoles:roles} });
    Meteor.users.update({_id: id}, {$set: {cachedGroups:groups} });

    return id;
  },

  omAccountManagerUpdateUser: function(obj) {
  },

  omAccountManagerSetPermissions: function (userId, roles, groups) {
    // only allow if they have user management permissions
    if (this.userId &&
      Roles.userIsInRole(this.userId, OmAccountManager.config.userManagerRoles, Roles.GLOBAL_GROUP)) {

      // remove user from all roles in all groups, then add the roles back.
      var cfgGroups = OmAccountManager.config.groups;

      cfgGroups.forEach(function (group) {
        Roles.setUserRoles(userId, [], group);
      });
      // also remove from global and default
      Roles.setUserRoles(userId, [], Roles.GLOBAL_GROUP);
      Roles.setUserRoles(userId, [], 'default');

      groups.forEach(function (group) {
        Roles.addUsersToRoles(userId, roles, group);
      });

      Meteor.users.update({_id: userId}, {$set: {cachedRoles:roles} });
      Meteor.users.update({_id: userId}, {$set: {cachedGroups:groups} });
      return true;
    } else {
      return false;
    }
  },
});
