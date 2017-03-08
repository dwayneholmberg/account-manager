Template.omAccountsEditUser.onCreated(function () {
  var self = this;
  self._id = FlowRouter.getParam('_id');
  self.autorun(function() {
    self.subscribe('OmAccountManagerOneUser', self._id);  
  });
});

Template.omAccountsEditUser.rendered = function () {
  $('#name').focus();
};

Template.omAccountsEditUser.created = function (){
  var self = this;
  self.roles = new ReactiveVar([]);

  Meteor.call('omAccountsGetRoles', function (err, result) {
    if (err) {
      console.log(err);
    } else  {
      self.roles.set(result);
    }
  });

  self.groups = new ReactiveVar([]);

  Meteor.call('omAccountsGetGroups', function (err, result) {
    if (err) {
      console.log(err);
    } else {
      self.groups.set(result);
    }
  });
};


var emailCounter = 0;

Template.omAccountsEditUser.helpers({
  getConfiguredRoles: function () {
    return Template.instance().roles.get();
  },

  getConfiguredGroups: function () {
    return Template.instance().groups.get();
  },

  checkGlobal: function () {
    var roles = Roles.getRolesForUser(Template.instance()._id, Roles.GLOBAL_GROUPS);

    if (roles.length) {
      return 'checked';
    } else {
      return '';
    }
  },

  isReady: function (sub) {
    return true;
  },

  user: function () {
    var user =  Meteor.users.findOne({_id: Template.instance()._id});
    return user;
  },

  emailCounter: function () {
    return emailCounter++;

  },

  checkActive: function (user) {
    return user.active ? 'checked' : '';
  },

});

Template.omAccountsEditUser.events({

  'change #email': function (e) {
    var email = $('#email').val();

    // just make sure there's an @ and at least one dot
    var email_regex = RegExp('.+@.+\..+');
    if (!email_regex.test(email)) {
      $(e.target).parent().addClass('has-error');
    } else {
      $(e.target).parent().removeClass('has-error');
      $(e.target).parent().addClass('has-success');
    }
  },

  'change #name': function (e) {
    var name = $('#name').val();

    // just make sure there's a value
    if (name === '') {
      $(e.target).parent().addClass('has-error');
    } else {
      $(e.target).parent().removeClass('has-error');
      $(e.target).parent().addClass('has-success');
    }
  },

  'click #saveUser': function(e) {

    e.preventDefault();

    var _id = Template.instance()._id;

    var name = $('#name').val();
    var email = $('#email').val();

    var hasError = false;

    // just make sure there's an @ and at least one dot
    var email_regex = RegExp('.+@.+\..+');
    if (!email_regex.test(email)) {
      $('#email').parent().addClass('has-error');
      hasError = true;
    } else {
      $('#email').parent().removeClass('has-error');
      $('#email').parent().addClass('has-success');
    }

    // just make sure there's a value
    if (name === '') {
      $('#name').parent().addClass('has-error');
      hasError = true;
    } else {
      $('#name').parent().removeClass('has-error');
      $('#name').parent().addClass('has-success');
    }

    if (hasError) {
      $('#alert').html('<p>It looks like something wasn\'t filled out correctly. Have a look and try again.</p>');
      $('#alert').removeClass('alert-success');
      $('#alert').addClass('alert-danger');
      $('#alert').removeClass('omAccountManager-hide');
    } else {

      var cfgRoles =  Template.instance().roles.get();
      var roles = [];

      cfgRoles.forEach(function (role) {
        var id = '#' + role.role + 'Role';
        if ($(id).is(':checked')) {
          roles.push(role.role);
       }
      });

      var cfgGroups =  Template.instance().groups.get();
      var groups = ['default'];

      if ($('#global').is(':checked')) {
        groups.push(Roles.GLOBAL_GROUP);
     }

      cfgGroups.forEach(function (group) {
        var id = '#' + 'group' + _.indexOf(cfgGroups, group);
        if ($(id).is(':checked')) {
          groups.push(group);
       }
      });

      var user = {
        email: email,
        profile: {
          name: name
        },
        cachedRoles: roles,
        cachedGroups: groups
      };


      user.active = $('#active').is(':checked');

      Meteor.users.update({_id: _id}, {$set: user}, function(err, result) {
        if (err) {
          $('#alert').html('<p>Error: ' + err.message + '</p>');
          $('#alert').removeClass('alert-success');
          $('#alert').addClass('alert-danger');
          $('#alert').removeClass('omAccountManager-hide');

          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false;
        }
      });

      Meteor.call('omAccountManagerSetPermissions', _id, roles, groups);

      $('#alert').html('<p>' + name + ' updated.</p>');
      $('#alert').removeClass('alert-danger');
      $('#alert').addClass('alert-success');
      $('#alert').removeClass('omAccountManager-hide');

      $('#email').parent().removeClass('has-success');
      $('#name').parent().removeClass('has-success');

      $("html, body").animate({ scrollTop: 0 }, "slow");
    }
  },
});

Template.omAccountsEditUserRoles.helpers({
  checkRole: function (groups, role) {
    var roles = [];

    _.each(groups, function (els) {
      _.each(els, function (el) {
        roles.push(el);
      });
    });
    roles = _.uniq(roles);

    if (_.contains(roles, role)) {
      return 'checked';
    } else {
      return '';
    }
  },
});

Template.omAccountsEditUserGroups.created = function (){
  var self = this;

  self.groups = new ReactiveVar([]);

  Meteor.call('omAccountsGetGroups', function (err, result) {
    if (err) {
      console.log(err);
    } else {
      self.groups.set(result);
    }
  });
};
Template.omAccountsEditUserGroups.helpers({
  groupIndex: function (group) {
    return _.indexOf(Template.instance().groups.get(), group);
  },

  checkGroup: function (groups, group) {
    if (_.contains(groups, group)) {
      return 'checked';
    } else {
      return '';
    }
  }
});
