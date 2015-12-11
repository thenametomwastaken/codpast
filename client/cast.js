// counter starts at 0
Session.setDefault('results', []);

Template.search.helpers({
  results: function () {
    return Session.get('results');
  }
});

Template.search.events({
  'click button': function () {
    $('form').submit();
  },

  'submit form': function (event, template) {
    event.preventDefault();

    $('.ui.dimmer').addClass('active');

    var keywords = $('input').val();
    // increment the counter when button is clicked
    Meteor.call('search', keywords, function (error, response) {
      Session.set('results', response);
      $('.ui.dimmer').removeClass('active');
    });
  }
});
