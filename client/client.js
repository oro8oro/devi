// Generated by CoffeeScript 1.9.3
(function() {

  var umls =[],seqs=[];
  var toc = [];
  var types={
    "md":"text/x-markdown",
    "styl": "text/x-styl",
    "css": "text/css",
    "html": "text/html",
    "xml": "application/xml",
    "js": "text/javascript",
    "json": "application/json",
    "ts": "application/typescript",
    "php": "text/x-php"
  };


  //$('#centerRight').width("100%").height("100%").split({orientation:'vertical', limit:2, position: pos2});

  var rend1 = new marked.Renderer();

  rend1.heading = function (text, level) {
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return '<h' + level + '><a name="' +
        escapedText +
        '" class="anchor" href="#' +
        escapedText +
        '"><span class="header-link"></span></a>' +
        text + '</h' + level + '>';
  }
  rend1.code = function(code, lang, escaped) {
    if (this.options.highlight) {
      var out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return '<pre><code>'
          + (escaped ? code : escape(code, true))
          + '\n</code></pre>';
    }

    if (lang == "sequence") {

      var diagram = Diagram.parse(code);
      seqs[seqs.length]=diagram;
      //console.log(diagram)

      return '<div class="fit" id="seq_'+(seqs.length-1)+'"></div>';
    }

    if (lang == "uml") {
      //console.log(validateURL("http://localhost/nomnoml-librarify/uml.txt"));
      if (validateURL(code)){
        //console.log(code);
        var location  = umls.length;
        umls.push("code");
        $.get(
            code,
            function(data, textStatus, jqXHR) {
              //load the iframe here...
              //console.log(data);
              umls[location]=data;
              //return '<canvas id="uml_'+(umls.length-1)+'"></canvas>';
              renderAll();
            }
        );
        //return "";
      } else {
        umls.push(code);
      }

      return '<div class="fit"><canvas id="uml_'+(umls.length-1)+'"></canvas></div>';

    }

    if (lang == "railroad") {
      try {
        var result = eval(code).format();
        return result;
      } catch (e) {
        return;
      }
      //find('.output-image').innerHTML = '';
      ///result.addTo(find('.output-image'));
      //find('.output-text').textContent = result;
    }

    if (lang == "persist") {
      if (validateURL(code)){
        document.getElementById("prev").style.top="30%"
        document.getElementById("prev").style.height="70%"
        return '<div style="position:fixed;width:100%;height:30%;top:20px;" ><iframe frameBorder="0" src="'+code+'" width="100%" height="100%"></div>';
      }
      return "";
    }

    return '<pre><code class="'
        + this.options.langPrefix
        + escape(lang, true)
        + '">'
        + (escaped ? code : escape(code, true))
        + '\n</code></pre>\n';
  };
  marked.setOptions({
    renderer: rend1,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    //highlight: function (code) {
    //return require('highlight').highlightAuto(code).value;
    //}
    //highlight: function (code, lang, callback) {
    //  require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
    //    callback(err, result.toString());
    //  });
    //}
  });

  function renderAll() {
    for (var ii = 0 ; ii < umls.length; ii++) {
      console.log('uml_'+ii)
      var canvas = document.getElementById('uml_'+ii);

      nomnoml.draw(canvas, umls[ii]);

    };


    for (var ii = 0 ; ii < seqs.length; ii++) {
      console.log('seq_'+ii)
      var el = document.getElementById('seq_'+ii);
      seqs[ii].drawSVG('seq_'+ii, {theme: 'simple'});

    };

  }

  function validateURL(textval) {
    var urlregex = new RegExp(
        "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
    return urlregex.test(textval);
  }

  Template.docList.helpers({
    documents: function() {
      return Documents.find();
    }
  });

  Template.docList.events = {
    "click button": function() {
      return Documents.insert({
        title: "untitled"
      }, function(err, id) {
        if (!id) {
          return;
        }
        return Session.set("document", id);
      });
    }
  };

  Template.docItem.helpers({
    current: function() {
      return Session.equals("document", this._id);
    }
  });

  Template.docItem.events = {
    "click a": function(e) {
      e.preventDefault();
      return Session.set("document", this._id);
    }
  };

  Session.setDefault("editorType", "cm");

  Template.docTitle.helpers({
    title: function() {
      var ref;
      return (ref = Documents.findOne(this + "")) != null ? ref.title : void 0;
    },
    editorType: function(type) {
      return Session.equals("editorType", type);
    }
  });

  Template.editor.helpers({
    docid: function() {
      return Session.get("document");
    }
  });

  Template.editor.events = {
    "keydown input[name=title]": function(e) {
      var id;
      if (e.keyCode !== 13) {
        return;
      }
      e.preventDefault();
      $(e.target).blur();
      id = Session.get("document");
      return Documents.update(id, {
        title: e.target.value
      });
    },
    "click button": function(e) {
      var id;
      e.preventDefault();
      id = Session.get("document");
      Session.set("document", null);
      return Meteor.call("deleteDocument", id);
    },
    "change input[name=editor]": function(e) {
      return Session.set("editorType", e.target.value);
    }
  };

  Template.editor.helpers({

    cm: function() {
      return Session.equals("editorType", "cm");
    },

    configAce: function() {
      return function(ace) {
        ace.setTheme('ace/theme/monokai');
        ace.setShowPrintMargin(false);
        return ace.getSession().setUseWrapMode(true);
      };
    },
    configCM: function() {
      return function(cm) {

        cm.on('change',function(cMirror){
          umls = [];
          seqs=[];
          toc = [];
          document.getElementById("prev").style.top="0px"
        document.getElementById("prev").style.height="100%"
          prev.innerHTML =marked(cMirror.getValue());
          //MathJax.Hub.Queue(["Reprocess", MathJax.Hub, "prev"])
        });

        cm.setOption("theme", "default");
        cm.setOption("lineNumbers", true);
        cm.setOption("lineWrapping", true);
        cm.setOption("smartIndent", true);
        cm.setOption("mode", "markdown");
        cm.setOption("viewportMargin", Infinity);
        return cm.setOption("indentWithTabs", true);
      };
    }
  });



}).call(this);
