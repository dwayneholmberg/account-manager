Meteor.publish('OmAccountManagerUsers', function() {

  // if they're authorized to manage users, give them everything
  if (this.userId &&
    Roles.userIsInRole(this.userId, OmAccountManager.config.userManagerRoles)) {

    return Meteor.users.find({}, {
      fields: {
        'username':1, 'profile':1, 'createdAt':1, 'emails':1, 'roles':1,
        'cachedRoles':1, 'cachedGroups':1, 'active':1
      }
    });
  // otherwise, only their own record
  } else {

    return Meteor.users.find({_id: this.userId}, {
      fields: {
        'username':1, 'profile':1, 'createdAt':1, 'emails':1, 'roles':1,
        'cachedRoles':1, 'cachedGroups':1, 'active':1
      }
    });
  }
});

Meteor.publish('OmAccountManagerOneUser', function(id) {

  // are they authorized to manage users?
  if (this.userId &&
    Roles.userIsInRole(this.userId, OmAccountManager.config.userManagerRoles)) {

    return Meteor.users.find({_id: id}, {
      fields: {
        'username':1, 'profile':1, 'createdAt':1, 'emails':1, 'roles':1,
        'cachedRoles':1, 'cachedGroups':1, 'active':1
      }
    });
  // otherwise, only their own record
  } else {

    return Meteor.users.find({_id: this.userId}, {
      fields: {
        'username':1, 'profile':1, 'createdAt':1, 'emails':1, 'roles':1,
        'cachedRoles':1, 'cachedGroups':1, 'active':1
      }
    });
  }
});

// required for role management on client side
// roles collection updated when user roles are changed
Meteor.publish(null, function () { 
  // are they authorized to manage users?
  if (this.userId &&
    Roles.userIsInRole(this.userId, OmAccountManager.config.userManagerRoles)) {
    return Meteor.roles.find({});
  }
});
