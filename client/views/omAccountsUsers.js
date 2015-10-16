Template.omAccountsUsers.onCreated(function () {
  var self = this;
  self.autorun(function() {
    self.subscribe('OmAccountManagerUsers');  
  });
});

Template.omAccountsUsersUser.onCreated(function () {
  var self = this;
  self.roles = new ReactiveVar([]);

  Meteor.call('omAccountsGetRoles', function (err, result) {
    if (err)
      console.log(err);
    else 
      self.roles.set(result);
  });
});

Template.omAccountsUsers.helpers({
  users: function () {
    var user_search_text = Session.get('omAccountsUsersSearchUsers');
    if (user_search_text) {
      user_search_text = user_search_text.replace(/[^\w\s]/gi, '');
    } else {
      user_search_text = false;
    }

    // search profile name
    if (user_search_text) {
      return Meteor.users.find({'profile.name': {
          $regex: new RegExp('.*' + user_search_text + '.*', 'i')
        }
      },
      {sort:{'profile.name':1}});

    // return everyone
    } else {
      return Meteor.users.find({}, {sort:{'profile.name':1}});
    }
  },
});

Template.omAccountsUsersUser.helpers({

  roleLabel: function (role) {
    var roles = Template.instance().roles.get();

    if (roles.length) {
      return _.findWhere(roles, {role: role}).label;
    }
  },

});
