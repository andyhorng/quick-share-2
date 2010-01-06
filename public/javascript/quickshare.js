$(document).ready(function() {

    // set loader.gif
    $('#loader').ajaxSend(function() { 
      $(this).show("fast");
      }).ajaxComplete(function() {$(this).hide("fast")});

    init();
    });


// initialization
function init() {
  $.post("/qs/list", {'path' : '/'}, function(json) {
      // get json from server
      var l = JSON.parse(json, function(key, value){return value;});
      // append list items to root wrapper
      fillWrapper(l, $('#root'));
      });
}

// fill wrapper with links
function fillWrapper(list, wrapper) {
  wrapper.hide();
  var ps = wrapper.prev().find('a.select');
  // directory
  $.each( $.grep(list, function(i){return i[1]==1}), function() {

      var select = $('<a class="select"></a>');
      var open = $('<a class="open"></a>');
      var node = $('<div class="node"></div>');

      wrapper.append(node);
      wrapper.append('<div class="wrapper"></div>');
      wrapper.find('div.node:last').append(select).append(open);

      // set select
      select.attr('href', '#').text('+');

      //**
      if(wrapper.attr('id') != 'root') {
        // get parent of wrapper (it's on wrapper's previous sibling)
        select.data('select', ps.data('select'));
        updateSelect(select);
      } else {
        select.data('select', false);
      }

      select.click(function(e) {
        e.preventDefault();
        $(this).data('select', !select.data('select'));
        $(this).parent().next().find('a.select').data('select', $(this).data('select'));
        updateSelect($(this));
        });

      // set open
      open.attr('href', '#').text(nodeName(this[0])).data('path', this[0]);
      open.one('click', function(e) {
        e.preventDefault();
        var a = $(this);
        $.post("/qs/list", {'path': a.data('path')}, function(json) {
          var l = JSON.parse(json, function(key, value){return value});
          // recursive call, but it's event trigger
          fillWrapper(l, a.parent().next());
          });
        // click event change to toggle wrapper
        a.click(function(e) {
          e.preventDefault();
          $(this).parent().next().slideToggle();
          });
        });
      });

  // file    
  $.each( $.grep(list, function(i){return i[1]==0}), function() {
      var node = $('<div class="node"></div>');
      var select = $('<a class="select" href="#">+</a>');

      wrapper.append(node);
      node.append(select);
      node.append(nodeName(this[0]));

      select.data('select', ps.data('select'));
      updateSelect(select);
      select.click(function(e) {
        e.preventDefault();
        $(this).data('select', !$(this).data('select'));
        updateSelect($(this));
        });
      });
  wrapper.slideDown();
}


// return node name
function nodeName(path) {
  var s = path.split('/');
  return s[s.length-1];
}

function updateSelect(select) {
  if(select.data('select')) {
    select.parent().addClass('selected');
    select.parent().next().find('div.node').addClass('selected');
  } else {
    select.parent().removeClass('selected');
    select.parent().next().find('div.node').removeClass('selected');
  }
}
