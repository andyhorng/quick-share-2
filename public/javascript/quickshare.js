$(document).ready(function() {
    $.post("/qs/list", {'path': "/"}, function(json) {
        open(json, 'list');
      });
    });


// json, id: result's target
function open(json, id) {
      files = JSON.parse(json, function(key, value){return value;});
      // $("#" + id).append('<div id="' + id + '_wrapper"></div>');
      $("#" + id).append($('<div></div>').attr('id', id + "_wrapper").hide());
      jQuery.each(files, function() {genTag(id + '_wrapper', this);});
      addDirClick("#" + id + " #" + id + "_wrapper > div > a");
      $("#" + id + "_wrapper").show("slow");
}


function genTag(id, e) {
  if (e[1] == true) {
    // directory
    uid = "element_" + $.data('u');
    $("#" + id).append( createDirectory(e[0], uid) );
    $("#" + uid).data("path", e[0]);
  } else {
    // file
    $("#" + id).append('<div class="element">' + e[0].split('/').reverse()[0] + "</div>");
  }
}

function createDirectory(name, id) {
  return '<div id="' + id + '" class="element"><a href="#">' + name.split("/").reverse()[0] + '</a></div>';
  // return $('<div></div>').hide().
  // attr('id', id).addClass('element').append( $('<a href="#"></a>').append(name.split('/').reverse()[0]) );
}

function addDirClick(target) {
  $(target).one('click', function(e) {
      path = $("#" + this.parentElement.id).data("path");
      id = this.parentElement.id;
      e.preventDefault();
      $.post( '/qs/list', {'path': path}, function(json) {
        open(json, id);
      });
      // 改變成收起來
      $("#" + id + " > a").click(function(e) {
        e.preventDefault();
        $("#" + this.parentElement.id + " > div").toggle("slow");
      });
  });
}
