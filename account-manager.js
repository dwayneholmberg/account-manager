// UI helpers
UI.registerHelper('join', function(obj) {
  if (obj) {
    return obj.join(', ');
  } else {
    return '';
  }
});

UI.registerHelper('orderedJoin', function(obj) {
  if (obj) {
    return obj.sort().join(', ');
  } else {
    return '';
  }
});

UI.registerHelper('userProfileName', function() {
  return Meteor.user().profile.name;
});

UI.registerHelper('wordCase', function (str) {
  return TextFormatter.wordCase(str);
});

UI.registerHelper('wordCaseJoin', function (a) {
  return TextFormatter.wordCase(a.join(', '));
});

UI.registerHelper('orderedWordCaseJoin', function (a) {
  return TextFormatter.wordCase(a.sort().join(', '));
});

UI.registerHelper('formatDate', function(date) {
  var t = moment.utc(date).toDate();
  return moment(t).format('MMMM D, YYYY');
});

UI.registerHelper('formatTime', function(date) {
  var t = moment.utc(date).toDate();
  return moment(t).format('HH:mm');
});

UI.registerHelper('formatDatetime', function(date) {
  var t = moment.utc(date).toDate();
  return moment(t).format('MMMM D, YYYY HH:mm');
});

var TextFormatter = {};

TextFormatter.wordCase = function(str) {
  return str.replace(/[^\s]+/g, function(word) {
    return word.replace(/^./, function(first) {
      return first.toUpperCase();
    });
  });
};

TextFormatter.spaceToDash = function(str) {
  return str.replace(/\s+/g, '-');
};
