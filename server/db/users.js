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
   */
  omAccountManagerAddUser: function(user, roles, groups) {

    var loggedInUser = Meteor.user();

    if (!loggedInUser ||
      !Roles.userIsInRole(loggedInUser, OmAccountManager.config.userManagerRoles)) {
      throw new Meteor.Error('not-authorized', 'Insufficient privileges to add a user');
    }

    user.active = true;
    var id = Accounts.createUser(user);

    groups.forEach(function (group) {
      Roles.addUsersToRoles(id, roles, group);
    });

    return id;
  },

  omAccountManagerUpdateUser: function(obj) {
  },

});
