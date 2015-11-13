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
    if (err)
      console.log(err);
    else 
      self.roles.set(result);
  });
};


var emailCounter = 0;
Template.omAccountsEditUser.helpers({
  roles: function () {
    return Template.instance().roles.get();
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

  'change #password': function (e) {
    var password = $('#password').val();

    if (!password) {
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
    var password = $('#password').val();

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

      var user = {
        email: email,
        password: password,
        profile: {
          name: name
        }
      };

      var cfg_roles =  Template.instance().roles.get();
      var roles = [];

      cfg_roles.forEach(function (role) {
        var id = '#' + role.role + 'Role';
        if ($(id).is(':checked')) {
          roles.push(role.role);
       }
      });

      user.active = $('#active').is(':checked');

      Meteor.users.update({_id: _id}, {$set: user}, function(err, result) {
        if (err) {
          $('#alert').html('<p>Error: ' + err.message + '</p>');
          $('#alert').removeClass('alert-success');
          $('#alert').addClass('alert-danger');
          $('#alert').removeClass('omAccountManager-hide');
          return false;
        }
      });
      Roles.setUserRoles(_id, roles);

      $('#alert').html('<p>' + name + ' updated.</p>');
      $('#alert').removeClass('alert-danger');
      $('#alert').addClass('alert-success');
      $('#alert').removeClass('omAccountManager-hide');

      $('#email').parent().removeClass('has-success');
      $('#name').parent().removeClass('has-success');
      $('#password').parent().removeClass('has-success');

    }
  },

  'click #addMore': function (e) {
  }
});

Template.omAccountsEditUserRoles.helpers({
  checkRole: function (roles, role) {
    return _.indexOf(roles, role) === -1 ? '' : 'checked';
  },
});
