Template.omAccountsAddUser.rendered = function () {
  $('#name').focus();
};

Template.omAccountsAddUser.created = function (){
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


Template.omAccountsAddUser.helpers({
  roles: function() {
    return Template.instance().roles.get();
  },

  hasGroups: function() {
    return Template.instance().groups.get().length;
  },

  groups: function() {
    return Template.instance().groups.get();
  },
});

Template.omAccountsAddUser.events({

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

    if (!password) {
      $('#password').parent().addClass('has-error');
      hasError = true;
    } else {
      $('#password').parent().removeClass('has-error');
      $('#password').parent().addClass('has-success');
    }

    if (hasError && 0) {
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

      var groups = [];
      if (document.getElementById('global').checked) {
        groups = Roles.GLOBAL_GROUP;
      } else {
        $('#groups input:checked').each(function() {
          groups.push($(this).attr('value'));
        });
      }

      Meteor.call('omAccountManagerAddUser', user, roles, groups, function (err, result) {

        if (err) {
          $('#alert').html('<p>Error: ' + err.message + '</p>');
          $('#alert').removeClass('alert-success');
          $('#alert').addClass('alert-danger');
          $('#alert').removeClass('omAccountManager-hide');
          return false;
        }

        $('#alert').html('<p>' + name + ' added</p>');
        $('#alert').removeClass('alert-danger');
        $('#alert').addClass('alert-success');
        $('#alert').removeClass('omAccountManager-hide');

        $('#email').parent().removeClass('has-success');
        $('#name').parent().removeClass('has-success');
        $('#password').parent().removeClass('has-success');

        $('#email').val('');
        $('#name').val('');
        $('#password').val('');

        $('#email').focus();
      });
    }
  },

  'click #addMore': function (e) {
  }
});
