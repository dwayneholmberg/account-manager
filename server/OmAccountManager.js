OmAccountManager = {
  config: {
    roles: [
      {
        role      :'public',
        label     : 'Public',
        helpText  : 'No special privileges'
      },
      {
        role      : '_admin',
        label     : 'Administrator',
        helpText  : 'Full access'
      }
    ],

    userManagerRoles: ['_admin']
  },

  configureRoles: function (a) {
    this.config.roles = a;
  },

  configureGroups: function (a) {
    this.config.groups = a;
  },

  canManageUsers: function (a) {
    this.config.userManagerRoles = a;
  },

  /**
   * Create starting account if none exists
   * @param {Object} user
   * @param {Object[]} roles
   *
   * user = {
   *  email: email,
   *  password: password,
   *  profile: {
   *    name: name
   *  }
   * };
   */
  bootstrapAdminAccount: function (user, roles) {
    if (!Meteor.users.find().count()) {
      var id = Accounts.createUser(user);

      Roles.addUsersToRoles(id, roles, roles.GLOBAL_GROUP);
    }
  }
};
