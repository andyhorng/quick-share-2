$(document).ready(function() {
    $.post("/qs/list", {'path': "/"}, function(json) {
        open(json, '#list > div > a', 'list');
      });
    });

function open(json, selector, id) {
      list = JSON.parse(json);
      jQuery.each(list, function() {genTag(id, this);});
      addDirClick(selector);
}


function genTag(id, e) {
  if (e[1] == true) {
    // directory
    uid = "element_" + $.data('u');
    $("#" + id).append( createDirectory(e[0], uid) );
    $("#" + uid).data("path", e[0]).show("slow");
  } else {
    // file
    $("#" + id).append('<div class="element">' + e[0].split('/').reverse()[0] + "</div>");
  }
}

function createDirectory(name, id) {
  // return '<div id="' + id + '" class="element"><a href="#">' + name.split("/").reverse()[0] + '</a></div>';
  return $('<div></div>').hide().attr('id', id).addClass('element').append( $('<a href="#"></a>').append(name.split('/').reverse()[0]) );
}

function addDirClick(target) {
  $(target).one('click', function(e) {
      path = $("#" + this.parentElement.id).data("path");
      id = this.parentElement.id;
      e.preventDefault();
      $.post( '/qs/list', {'path': path}, function(json) {
        open(json, '#' + id + " > div > a", id);
      });
      // 改變成收起來
      $("#" + id + " > a").click(function(e) {
        $("#" + this.parentElement.id + " > div").toggle("slow");
      });
  });
}
