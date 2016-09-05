$('form').hide();
$('#spinner').show();
$('#payment-alert').hide();

(function () {

  'use strict';

  const authToken = token; // jshint ignore:line

  createClient(authToken, (err, clientInstance) => {
    if (err) {
      console.log(err); // TODO: handle error better
      return;
    }
    createHostedFields(clientInstance, (err, hostedFieldsInstance) => {
      if (err) {
        console.log(err); // TODO: handle error better
        return;
      }
      $('#spinner').addClass('animated fadeOut');
      setTimeout(() => {
        $('#spinner').hide();
        $('form').show().addClass('animated fadeIn');
        $('#submit-btn').removeAttr('disabled');
        handleformSubmission(hostedFieldsInstance);
      }, 1000);
    });
  });

})();

// *** event handlers *** //

$('#email-address').on('keyup', function() {
  const valid = isEmail(this.value);
  const $this = $(this);
  if (valid) {
    $this.addClass('valid-input').removeClass('invalid-input');
  } else {
    $this.addClass('invalid-input').removeClass('valid-input');
  }
});

function handleformSubmission(hostedFieldsInstance) {
  $('#form').on('submit', (event) => {
    $('#payment-alert').hide();
    event.preventDefault();
    const isValid = validateForm();
    if (!isValid.length) {
      $('#submit-btn').attr('disabled', true);
      hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
        if (tokenizeErr) {
          if (tokenizeErr.code === 'HOSTED_FIELDS_FIELDS_EMPTY') {
            $('#payment-alert').show();
            $('#payment-alert-text').html(
              'Some payment input fields are required. Please correct.'
            );
          } else if (tokenizeErr.code === 'HOSTED_FIELDS_FIELDS_INVALID') {
            $('#payment-alert').show();
            $('#payment-alert-text').html(
              'Some payment input fields are invalid. Please correct.'
            );
          } else {
            $('#payment-alert').show();
            $('#payment-alert-text').html(
              'Something bad happened. Please contact support.'
            );
          }
          $('#submit-btn').removeAttr('disabled');
          return;
        }
        $.ajax({
          url: '/checkout',
          type: 'POST',
          data: {
            payment_method_nonce: payload.nonce,
            email: $('#email-address').val()
          }
        })
        .done((results) => {
          window.location.href = '/thanks';
        })
        .fail((err) => {
          console.log(err); // TODO: handle error better
          $('#submit-btn').removeAttr('disabled');
        });
      });
    } else {
      $('#payment-alert').show();
      $('#payment-alert-text').html(isValid[0]);
      return false;
    }
    return false;
  });
}

// *** helper functions *** //

function createClient(token, callback) {
  braintree.client.create({ // jshint ignore:line
    authorization: token
  }, (clientErr, clientInstance) => {
    if (clientErr) {
      callback(clientErr);
    } else {
      callback(null, clientInstance);
    }
  });
}

function createHostedFields(clientInstance, callback) {
  braintree.hostedFields.create({ // jshint ignore:line
    client: clientInstance,
    styles: {
      input: {
        'font-size': '14px'
      },
      'input.invalid': {
        color: 'red'
      },
      'input.valid': {
        color: 'green'
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
    hostedFieldsInstance.on('cardTypeChange', (event) => {
      if (event.cards) {
        // card used (display image, if you'd like...)
      }
    });
    callback(null, hostedFieldsInstance);
  });
}

function validateForm() {
  const errors = [];
  // check is email is valid
  const valid = isEmail($('#email-address').val());
  if (!valid) {
    errors.push('Please enter a valid email address.');
  }
  return errors;
}

function isEmail(email) {
  const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
