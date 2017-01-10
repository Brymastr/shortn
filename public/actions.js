// var base_url = 'http://localhost:9000/';
var base_url = 'https://ziip.ca/';

$(function() {

  var color = '';
  var inverted = '';
  var mode = 'shorten';
  

  color += colors[Math.floor(Math.random() * colors.length)];
  inverted += invertHex(color);

  $('body').css({'background': '#' + color});
  $("input[type='submit']").css({'background-color': '#' + inverted});
  $("input[type='text']").focus(function() {
    $("input[type='text']").css({'box-shadow': 'inset 0 0 1px 2px #' + inverted});
  });
  $("input[type='text']").blur(function() {
    $("input[type='text']").css({'box-shadow': ''});
  });

  $('#description').text(descriptions[Math.floor(Math.random() * descriptions.length)]);

  $("input[type='submit']").click(function() {
    if(mode == 'shorten' && $('#addressField').val() != '') {
      mode = 'again';
      send();
      $("input[type='submit']").css({'width': '15%', 'border-radius': '5px 0 0 5px'}).val('AGAIN');
      $("input[type='text']").css({'width': '0'}).val('');
      $('#code').css({'width': '85%'});
    } else if(mode == 'shorten' && $('#addressField').val() == '') {
      $("input[type='text']").focus();
    } else {
      mode = 'shorten';
      $("input[type='submit']").css({'width': '15%', 'border-radius': '0 5px 5px 0'}).val('SHORTN');
      $("input[type='text']").css({'width': '85%'});
      $('#notify').css({'width': '0'});
      $('#code').css({'width': '0'}).text('');
    }
  });

  $("input[type='text']").keypress(function(e) {
    if (e.which == 13) {
      $("input[type='submit']").click();
    }
  });

  $('#code').click(function() {
    $('#notify').css({'width': '15%', 'background-color': '#' + inverted});
    $('#code').css({'width': '70%', 'border-radius': '0'});
  });

  new Clipboard('#code', {
    text: function(trigger) {
      return trigger.getAttribute('data-clipboard-text');
    }
  });

});

function invertHex(hex) {
  hex = hex.toUpperCase();
  var splitnum = hex.split('');
  var resultnum = '';
  var simplenum = "FEDCBA9876".split('');
  var complexnum = [];
  complexnum.A = "5";
  complexnum.B = "4";
  complexnum.C = "3";
  complexnum.D = "2";
  complexnum.E = "1";
  complexnum.F = "0";

  for(i = 0; i < 6; i++) {
    if(!isNaN(splitnum[i]))
      resultnum += simplenum[splitnum[i]];
    else if(complexnum[splitnum[i]])
      resultnum += complexnum[splitnum[i]];
    else
      return false;
  }

  return resultnum;
}

function send() {
  var url = $('#addressField').val();
  if(url == '') return false;
  $.post(base_url, {url: url}).done(function(data) {
    console.log(data);
    $('#code').text(base_url + data.code).attr('data-clipboard-text', base_url + data.code);
  });
}


var colors = [
  'EF5350',
  'EC407A',
  'AB47BC',
  '7E57C2',
  '5C6BC0',
  '42A5F5',
  '29B6F6',
  '26C6DA',
  '26A69A',
  '66BB6A',
  '9CCC65',
  'D4E157',
  'FFEE58',
  'FFCA28',
  'FFA726',
  'FF7043',
  '8D6E63',
  'BDBDBD',
  '78909C'
];

var descriptions = [
  'like dipping it in cold water',
  'yes. significant shrinkage.',
  'size does matter.',
  'same same, but different.',
  'pint sized.',
  'mini me.',
  'bite sized.',
  'save on bytes.',
  'try it on your friends!',
  'hunny, I shrunk the url.'
];