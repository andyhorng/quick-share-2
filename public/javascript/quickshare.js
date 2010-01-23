// 可以取得 element 的 tag name
$.fn.tagName = function() {
  return this.get(0).tagName;
}

$(document).ready(function() {
    // set loader.gif
    $('#loader').ajaxSend(function() { 
      $(this).show("fast");
      }).ajaxComplete(function() {$(this).hide("fast")});
    init();
    /*
    $('#package').click(function(e) {
      e.preventDefault();
      var paths = [];
      $('#root').find('div.node').each(function() {
        if($(this).data('select') == true) {
          paths.push($(this).data('path'));
        }
        });
      $.post('/qs/package', {'paths' : JSON.stringify(paths)});
      });
    */
    $('a#package').fancybox({
      'hideOnContentClick': false,
      'callbackOnShow': fancyboxContant,
      'callbackOnClose': fancyboxClose,
      'frameWidth': $('#tree').width(),
      'frameHeight':$('#tree').height(),
      });
    });


function fancyboxContant() {
  $('#fancy_div').html($('#selected_root').show());
}

function fancyboxClose() {
  $('body').append($('<div id="selected_root" class="wrapper"></div>'));
  $('#selected_root').html($('#root').html()).hide();
  setPreviewEvent($('#selected_root'));
}


// initialization
function init() {
  $.post("/qs/list", {'path' : '/'}, function(json) {
      // get json from server
      var l = JSON.parse(json, function(key, value){return value;});
      // append list items to root wrapper
      fillWrapper(l, $('#root'), true);
      $('#selected_root').html($('#root').html());
      });
}

// fill wrapper with links
function fillWrapper(list, wrapper, show) {
  wrapper.hide();
  var ps = wrapper.prev().find('a.select');
  // directory
  $.each( $.grep(list, function(i){return i[1]==1}), function() {

      var select = $('<a class="select"></a>');
      var open = $('<a class="open"></a>');
      var node = $('<div class="node closed"></div>');

      wrapper.append(node);
      wrapper.append('<div class="wrapper"></div>');
      wrapper.find('div.node:last').append(open).append(select);

      // set select
      select.attr('href', '#');

      //**
      // get parent of wrapper (it's on wrapper's previous sibling)
      select.parent('div.node').data('select', ps.parent('div.node').data('select'));
      updateSelect(select);

      select.click(function(e) {
        e.preventDefault();
        $(this).parent('div.node').data('select', !$(this).parent('div.node').data('select'));
        $(this).parent().next().find('a.select').parent('div.node').data('select', $(this).parent('div.node').data('select'));
        $(this).parent().removeClass('part_selected');
        $(this).parent().next().find('div.node').removeClass('part_selected');

        updateSelect($(this));
        updateSelAncestor($(this));

        var m = mappingOf($(this));
        m.parents('div.wrapper').prev('div.node').each(function() {
          $(this).replaceWith(mappingOf($(this)).clone(true));
        });
        wrapperOf($(m)).html(wrapperOf($(this)).html());
        // remap
        m = mappingOf($(this));
        setPreviewEvent(wrapperOf($(m)));

        });

      // set open
      open.attr('href', '#').text(nodeName(this[0])).parent('div.node').data('path', this[0]);
      open.one('click', function(e) {
          e.preventDefault();
          var a = $(this);
          $.post("/qs/list", {'path': a.parent('div.node').data('path')}, function(json) {
            var l = JSON.parse(json, function(key, value){return value});
            // recursive call, but it's event trigger
            fillWrapper(l, a.parent().next(), true);
            });
          a.parent('div.node').toggleClass('closed');
          a.parent('div.node').toggleClass('opened');
          // click event change to toggle wrapper
          a.click(function(e) {
            e.preventDefault();
            openToggle($(this));
            // $(this).parent().next().slideToggle();
            // $(this).parent('div.node').toggleClass('closed');
            // $(this).parent('div.node').toggleClass('opened');
            });
          });
  });

  // file    
  $.each( $.grep(list, function(i){return i[1]==0}), function() {
      var node = $('<div class="node file"></div>');
      var select = $('<a class="select" href="#"></a>');

      wrapper.append(node);
      node.append(nodeName(this[0]));
      node.append(select);

      
      select.parent('div.node').data('path', this[0]);
      select.parent('div.node').data('select', ps.parent('div.node').data('select'));
      updateSelect(select);
      select.click(function(e) {
        e.preventDefault();
        $(this).parent('div.node').data('select', !$(this).parent('div.node').data('select'));
        updateSelect($(this));
        updateSelAncestor(select);
        
        var m = mappingOf($(this));
        m.parents('div.wrapper').prev('div.node').each(function() {
          $(this).replaceWith(mappingOf($(this)).clone(true));
        });
        wrapperOf($(m)).html(wrapperOf($(this)).html());
        // remap
        m = mappingOf($(this));
        setPreviewEvent(wrapperOf($(m)));
        });
      });
  if( show ) 
    wrapper.slideDown();
  var m = mappingOf(wrapper);
  if(m.text() == '') {
  m.hide().html(wrapper.html());
  } else {
  m.html(wrapper.html());
  }
  setPreviewEvent(m);
  
}


// return node name
function nodeName(path) {
  var s = path.split('/');
  return s[s.length-1];
}

function updateSelect(select) {
  if(select.parent('div.node').data('select')) {
    select.parent().addClass('selected');
    select.parent().next().find('div.node').addClass('selected');
  } else {
    select.parent().removeClass('selected');
    select.parent().next().find('div.node').removeClass('selected');
  }
}


function updateSelAncestor(select) {
  // any update, its all ancestor should be part_selected and non-selected
  var ancestor = select.parents('div.wrapper');
  ancestor.prev('div.node').addClass('part_selected').removeClass('selected');
  ancestor.prev('div.node').children('a.select').parent('div.node').data('select', false);

  if(select.parent('div.node').data('select')) {
    ancestor.each(function() {
        if( $(this).children('div.selected').length == $(this).children('div.node').length ) {
        $(this).prev().addClass('selected').children('a.select').parent('div.node').data('select', true);
        $(this).prev().removeClass('part_selected');
        } else {

        return false;
        }

        });
  }
  else {
    select.parents('div.wrapper').each(function(){
        if( $(this).children('div.selected').length == 0 &&
          $(this).children('div.part_selected').length == 0 ) {
        $(this).prev().removeClass('part_selected');
        } else {
        return false;

        }
        });
  }
}

function cloneRootTo(target) {
  var selected_root = $('#root').clone(true).attr('id', target.attr('id'));
  target.replaceWith(selected_root);
}

function setPreviewEvent(specWrapper) {
  // mapping specwr
  mSpecWrapper = mappingOf(specWrapper);

  specWrapper.find('a.select').click(function(e) {
    e.preventDefault();
    var m = mappingOf($(this));
    m.click();
    m.parents('div.wrapper').show();
    mappingWrapper(m).show();
    });

  specWrapper.find('a.open').one('click', function(e) {
      e.preventDefault();
      // mapping open
      var mo = mappingOf($(this));
      var open = $(this);
      if( mappingWrapper(mo).text() == '') {
      // open in root, and copy to here
      $.post("/qs/list", {'path': mo.parent('div.node').data('path')}, function(json) {
        var l = JSON.parse(json, function(key, value){return value});
        fillWrapper(l, mappingWrapper(mo), false);
        // mo toggle event
        mo.unbind().click(function(e) {
          e.preventDefault();
          // mappingWrapper($(this)).slideToggle();
          openToggle($(this));
          });
        mappingWrapper(open).replaceWith(mappingWrapper(mo).clone());
        // mappingWrapper(open).slideToggle();
        openToggle(open);
        open.click(function(e) {
          e.preventDefault();
          // mappingWrapper($(this)).slideToggle();
          openToggle($(this));
          });
        setPreviewEvent(mappingWrapper(open));
        });
      } else {
      if(mappingWrapper(open).text() == '')
        mappingWrapper(open).replaceWith(mappingWrapper(mo).clone().hide());
      // mappingWrapper(open).slideToggle();
      openToggle(open);
      open.click(function(e) {
        e.preventDefault();
        // $(this).parent().next().slideToggle();
        openToggle($(this));
        });
      }
      });
}


function wrapperOf(element) {
  return element.parent('div.node').parent('div.wrapper');
}
function mappingWrapper(element) {
  return element.parent('div.node').next('div.wrapper');
}

function mappingOf(element) {
  if( element.is('#root *') ) {
  var i = $('#root').find(element.tagName()).index(element.get(0));
  return $('#selected_root').find(element.tagName() + ':eq(' + i + ')');
  } else if( element.is('#selected_root *') )  {
  var i = $('#selected_root').find(element.tagName()).index(element.get(0));
  return $('#root').find(element.tagName() + ':eq(' + i + ')');
  } else {
    if( element.attr('id') == 'root' )
      return $('#selected_root');
    else
      return $('#root');
  }
}


function openToggle(open) {
  mappingWrapper(open).slideToggle();
  open.parent('div.node').toggleClass('opened');
  open.parent('div.node').toggleClass('closed');
}
