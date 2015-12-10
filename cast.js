if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('results', []);

  Template.search.helpers({
    results: function () {
      return Session.get('results');
    }
  });

  Template.search.events({
    'click button': function () {
      var keywords = $('input').val();
      // increment the counter when button is clicked
      Meteor.call('search', keywords, function (error, response) {
        Session.set('results', response);
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    search: function (keywords) {
      try {
        var result = HTTP.call('GET', 'http://api.digitalpodcast.com/v2r/search/?appid=7b88bd788d20a1737ae2138c2dc7da04', {
          params: {
            keywords: keywords
          }
        });

        var parsed = xml2js.parseStringSync(result.content, function (err, result) {
          fiber.run(result);
        });

        var results = parsed.opml.body[0].outline;
        for (var i = 0; i < results.length; i++) {
          results[i] = results[i]['$'];
        }

        return results;

      } catch (e) {
        return e;
      }
    }
  });
}
