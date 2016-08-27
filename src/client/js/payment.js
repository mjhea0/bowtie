$('form').hide();
$('#spinner').show();

(function () {

  'use strict';

  const authToken = token;

  createClient(authToken, (err, clientInstance) => {
    if (err) {
      console.log(err);
      return;
    }
    createHostedFields(clientInstance, (err, hostedFieldsInstance) => {
      if (err) {
        console.log(err);
        return;
      }
      $('#spinner').addClass('animated fadeOut');
      setTimeout(function() {
        $('#spinner').hide();
        $('form').show().addClass('animated fadeIn');
        $('#submit-btn').removeAttr('disabled');
        handleformSubmission(hostedFieldsInstance);
      }, 1000);
    });
  });

})();

// *** helper functions *** //

function createClient(token, callback) {
  braintree.client.create({
    authorization: token
  }, function(clientErr, clientInstance) {
    if (clientErr) {
      callback(clientErr);
    } else {
      callback(null, clientInstance);
    }
  });
}

function createHostedFields(clientInstance, callback) {
  braintree.hostedFields.create({
    client: clientInstance,
    styles: {
      input: {
        'font-size': '14px'
      },
      'input.invalid': {
        color: 'red'
      }
    },
    fields: {
      number: {
        selector: '#card-number',
        placeholder: '4111 1111 1111 1111'
      },
      cvv: {
        selector: '#cvv',
        placeholder: '123'
      },
      expirationDate: {
        selector: '#expiration-date',
        placeholder: '10 / 2019'
      }
    }
  },
  function(hostedFieldsErr, hostedFieldsInstance) {
    if (hostedFieldsErr) {
      callback(hostedFieldsErr);
      return;
    }
    callback(null, hostedFieldsInstance);
  });
}

// *** event handlers *** //
function handleformSubmission(hostedFieldsInstance) {
  $('#form').on('submit', function(e) {
    $('#submit-btn').attr('disabled', true);
    e.preventDefault();
    hostedFieldsInstance.tokenize(function(tokenizeErr, payload) {
      if (tokenizeErr) {
        console.error(tokenizeErr);
        $('#submit-btn').removeAttr('disabled');
        return;
      }
      $.ajax({
        url: '/checkout',
        type: 'POST',
        data: {
          payment_method_nonce: payload.nonce,
          email: $('.email').val()
        }
      })
      .done(function(results) {
        console.log(results);
        window.location.href = '/thanks';
      })
      .fail(function(err) {
        console.log(err);
        $('#submit-btn').removeAttr('disabled');
      });
    });
  });
}
