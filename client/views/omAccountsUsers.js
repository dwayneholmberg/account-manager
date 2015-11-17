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
    if (err) {
      console.log(err);
    } else  {
      self.roles.set(result);
    }
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

  // don't display if the only group is 'default'
  displayGroups: function (groups) {
    if (!groups) {
      return false;
    } else if (groups.length === 1 && groups[0] === 'default'){
      return false;
    } else {
      return true;
    }
  },
  cleanGroups: function (groups) {

    for (var i = 0; i < groups.length; i++) {
      if (groups[i] === Roles.GLOBAL_GROUP) {
        groups[i] = 'Global';
      }
    }

    return _.filter(groups, function (el) {
      return el !== 'default';
    }).sort();
  },
  cleanRoles: function (roles) {
    return roles ? roles.sort() : [];
  },
});
