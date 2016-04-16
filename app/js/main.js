$(function () {
    $("#btnAdd").bind("click", function () {
        var div = $("<div />");
        div.html(GetDynamicTextBox(""));
        $("#TextBoxContainer").append(div);
    });
    $("#btnGet").bind("click", function () {
        var values = "";
		var val = "";
        $("input[name=DynamicTextBox]").each(function () {
            values += $(this).val() + "\n";
			val += this.value + '+';
        });
        //alert(values);
		  // 1. get the search query
    query = val;
    // 2. prepare the api url
    url = 'http://localhost:5000/search/' + val;
    
    // 3. make a request
    $.get(url, function(data) {
      // once the response returns, get the two keys
      //var query = data['results']['query'];
      var hello = data['results']['hello'];
	  var res = "";
	  console.log(data['results'].length);
	  for (i = 0; i < data['results'].length; i++) {
		res += data ['results'][i]['concept']['label'];
		res += "\n"
	  }
      // 3. format the output
	  query = query.slice(0,-1)
      var p = '<p class="node">'+query+'</p>'+'<p>Topic: ' + query + '</p>';
	  var h = '<h2>Related Topics</h2>'+'<textarea readonly rows="4" cols="40">'+ res +'</textarea>';
      // 4. display the output
	  //$("#results").html(p);
	  $('#leftResult').html(h);
		
		    // 4. make layer visible and include topic names
      //var svg = $('#SVG1');
      var searchTopics = $("input[name=DynamicTextBox]");
      var numSearchTopics = searchTopics.length;
      if (numSearchTopics == 1) {
          //console.log(svg)
        $("#L1").css("visibility", "visible"); 
        //('#A tspan', svg.root()).text(searchTopics[0].value());
        //console.log(searchTopics[0].value)
        $("#A")[0].textContent = searchTopics[0].value;
        $("#L1b").css("visibility", "visible");
        $("#A1")[0].textContent = data['results'][0]['concept']['label'];
        $("#A2")[0].textContent = data['results'][1]['concept']['label'];
        $("#A3")[0].textContent = data['results'][2]['concept']['label'];
		$("#L2").css("visibility", "hidden");
		$("#L2b").css("visibility", "hidden");
         }
      if (numSearchTopics == 2) {
        $("#L2").css("visibility", "visible"); 
        //('#B tspan', svg.root()).text(searchTopics[1].value());
        $("#Ab")[0].textContent = searchTopics[0].value;
        $("#B")[0].textContent = searchTopics[1].value;
        $("#L2b").css("visibility", "visible");
        $("#B1")[0].textContent = data['results'][0]['concept']['label'];
        $("#B2")[0].textContent = data['results'][1]['concept']['label'];
        $("#B3")[0].textContent = data['results'][2]['concept']['label'];
          }
		});
    });
    $("body").on("click", ".remove", function () {
        $(this).closest("div").remove();
	
    });
	 $("body").on("click", ".replace", function () {
        $("#textBox").val("");
	
    });
	//USAGE
	
	  $('.concept--input-concept-list').keypress(function (e) {
      var code = e.which;
      if (code == 13){
         
	
		//$('.concept--input').first().addClass(x);
		var self = $(this);
		var x = $('#tb1').val();
		console.log(x);
			var y = '<div class="concept">'+'<div class="concept--typed-concept-container active">'+'<span class="concept--typed-concept label" >'+x+'</span>'
					+'<i class="concept--close-icon icon icon-close"></i>'
				+'</div>'+
			+'</div>'
		$(y).insertBefore(this);
  //$(this).hide();


      }
    });
	  /**
   * Event handler for concept tabs
   */
  $('.concept--new-concept-container').click(function(e) {
    e.preventDefault();
    var self = $(this);
    var concept = self.closest('.concept');

    concept.find('.active').removeClass('active');
    concept.find('.concept--input-container').addClass('active');
    concept.find('.concept--input').focus();
  });
  
  
  /**
   * Event handler for tab changes
   */
  $('.tab-panels--tab').click(function(e) {
    e.preventDefault();
    var self = $(this);
    var inputGroup = self.closest('.tab-panels');
    var idName = null;

    inputGroup.find('.tab-panels--tab.active').removeClass('active');
    inputGroup.find('.tab-panels--tab-pane.active').removeClass('active');
    self.addClass('active');
    idName = self.attr('href');
    $(idName).addClass('active');
    $('.input--API').removeClass('active');
    $('.input--endpoint').removeClass('active');
    $(idName + '-endpoint').addClass('active');
    $('._demo--output').css('display', 'none');
  });



});
function GetDynamicTextBox(value) {
    return '<input type="button" value="Replace" class="replace" />&nbsp;'+'<input id ="textBox" name = "DynamicTextBox" type="text" value = "' + value + '" />&nbsp;' +
            '<input type="button" value="X" class="remove" />' + '&nbsp;' 
            
}

  var pendingSuggestion = function(query) {
    return '<div class="tt--search-hint"><i>Searching for ' + query.query + '</i></div>';
  }
  
  var conceptSuggestion = function(d) {
    if (getType(d.id) === 'concept') {
      return '<div><strong>' + d.label + '</strong> <i class=\'pull-right\'>' +
        getType(d.id) + '</i><br><i class="concept-abstract">' + trunc(d.abstract) + '</i></div>';
    } else {
      return '<div><strong>' + d.label + '</strong> <i class=\'pull-right\'>' +
        getType(d.id) + '</i></div>';
    }
  };
  
  function sourceLabelSearch(query, callback) {
    query_data = query;
    return $.get('/api/labelSearch', {
      query: query,
      limit: 7,
      concept_fields: JSON.stringify({
        abstract: 1
      })
    }).done(function(results) {
      $('#concepts-panel-API-data').empty();
      $('#concepts-panel-API-data').html(JSON.stringify(results, null, 2));
      $('#label-search-view-code-btn').removeAttr('disabled');
      $('#label-search-view-code-btn').prev().removeClass('icon-code-disabled');

      if(results.matches.length == 0){
        $('.tt-dataset').html('<div class="tt--search-hint"><i>no concepts found</i></div>');
      }

      var filtered = {};
      filtered['matches'] = results.matches.filter(function(elem) {
        return elem.id.match(/^\/graphs/);
      });
      callback(filtered);
    }).fail(function(error) {
      // console.log('sourceLabelSearch.error:',error)
    });
	
	
	    $('.concept--input').citypeahead({
      selectionCb: selectionCallback,
      hint: false
    }, {
      templates: {
        suggestion: conceptSuggestion,
        pending: pendingSuggestion
      },
      source: sourceLabelSearch
    });
  }

  
 function selectionCallback(concept) {
    var label = concept.label;
    var $template = $('.concept').last().clone();

    $template.find('.label').text(label);
    $template.find('.label').attr('concept_id', concept.id);
    $template.find('.concept--close-icon').click(function() {
      $(this).closest('.concept').remove();
      fetch_ted_based_on_concepts();
    });
    $template.insertBefore('.concept:nth-last-child(1)');

    $('.concept:nth-last-child(1) > .concept--input-container').empty();
    $('.concept:nth-last-child(1) > .concept--input-container')
      .html('<input class="concept--input" type="text" name="tb">');

    $('.concept--input').citypeahead({
      selectionCb: selectionCallback,
      hint: false
    }, {
      templates: {
        suggestion: conceptSuggestion,
        pending: pendingSuggestion
      },
      source: sourceLabelSearch
    });

  

   // $('.concept:nth-last-child(1) > .concept--input-container').removeClass('active');
   // $('.concept:nth-last-child(1) > .concept--new-concept-container').addClass('active');

    fetch_ted_based_on_concepts();
  }
  
  //fetch results
  
  function generate_TED_panel(TED_data, your_input_concepts) {
  var TED_panel = '<div class="_TED-panel">' + '<div class="_TED-panel--TED">';

  var TED_info_above = '<div class="TED--info-above">' + '<a class="TED--title" href="' + TED_data.user_fields.url + '" target="_blank">' + TED_data.user_fields.title + '</a>' + '<div class="TED--author">' + TED_data.user_fields.speaker + '</div>' + '<div class="TED--score">' + '<span class="TED--score-title">' + 'Confidence Score:' + '</span>' + '<span class="TED--score-value">' + Math.floor(TED_data.score * 100) + '</span>' + '</div>' + '</div>';

  TED_panel += TED_info_above;

  var TED_thumbnail = '<div class="TED--img">' + '<img src="' + TED_data.user_fields.thumbnail + '" alt="">' + '</div>';

  TED_panel += TED_thumbnail;

  var TED_info_below = '<div class="TED--info-below">' + '<a class="TED--title" href="' + TED_data.user_fields.url + '" target="_blank">' + TED_data.user_fields.title + '</a>' + '<div class="TED--author">' + TED_data.user_fields.speaker + '</div>' + '<div class="TED--score">' + '<span class="TED--score-title">' + 'Confidence Score:' + '</span>' + '<span class="TED--score-value">' + Math.floor(TED_data.score * 100) + '%' + '</span>' + '</div>' + '</div>';

  TED_panel += TED_info_below;

  TED_panel += '</div>';

  TED_panel += '<div class="_TED-panel--how-it-works">' + '<div class="how-it-works--graph">' + '<div class="concept--your-input-list">';

  var your_input_list = '';
  var $TED_input_list = $('#TED1-panel > .base--textarea > ._TED-panel > ._TED-panel--how-it-works > .how-it-works--graph > .concept--your-input-list');
  for (var i = 0; i < your_input_concepts.length; i++) {
    var your_input_list_item = '<div class="concept--your-input-list-item">' + '<div class="concept--your-input">' + '<span class="concept--typed-concept">' + your_input_concepts[i] + '</span>' + '</div>' + '</div>';

    your_input_list += your_input_list_item;
  }
  TED_panel += your_input_list;

  TED_panel += '</div>' + '<div class="concept--derived-concept-list">';

  var derived_concept_list = '';
  var $TED_derived_concept_list = $('#TED1-panel > .base--textarea > ._TED-panel > ._TED-panel--how-it-works > .how-it-works--graph > .concept--derived-concept-list');
  for (var i = 0; i < 3; i++) {
    if (i == 0) {
      var derived_concept_list_item = '<div class="concept--derived-concept-list-item">' + '<div class="concept--derived-concept active" data-index="' + i + '">' + '<span class="concept--typed-concept">' + TED_data.explanation_tags[i].concept.label + '</span>' + '</div>' + '</div>';

    } else {
      var derived_concept_list_item = '<div class="concept--derived-concept-list-item">' + '<div class="concept--derived-concept" data-index="' + i + '">' + '<span class="concept--typed-concept">' + TED_data.explanation_tags[i].concept.label + '</span>' + '</div>' + '</div>';

    }

    derived_concept_list += derived_concept_list_item;
  }
  TED_panel += derived_concept_list;

  TED_panel += '</div>' + '</div>';

  TED_panel += '<div class="how-it-works--passage-list">';

  for (var i = 0; i < 3; i++) {
    if (i == 0) {
      TED_panel += '<blockquote class="base--blockquote how-it-works--passage active">' + '"' + TED_data.explanation_tags[i].passage + '"' + '</blockquote>';
    } else {
      TED_panel += '<blockquote class="base--blockquote how-it-works--passage">' + '"' + TED_data.explanation_tags[i].passage + '"' + '</blockquote>';
    }
  }

  TED_panel += '</div>';

  TED_panel += '</div>' + '</div>';

  $('#TED-panel-list').append(TED_panel);


  $('.concept--derived-concept').click(function(e) {
    e.preventDefault();
    var self = $(this);
    var how_it_works = self.closest('._TED-panel--how-it-works');
    var index = self.attr('data-index');

    how_it_works.find('.concept--derived-concept.active').removeClass('active');
    self.addClass('active');
    how_it_works.find('.how-it-works--passage.active').removeClass('active');
    how_it_works.find('.how-it-works--passage-list').children().eq(index).addClass('active');
  });

  $('.concept--derived-concept').hover(function(e) {
    e.preventDefault();
    var self = $(this);
    var how_it_works = self.closest('._TED-panel--how-it-works');
    var index = self.attr('data-index');

    how_it_works.find('.concept--derived-concept.active').removeClass('active');
    self.addClass('active');
    how_it_works.find('.how-it-works--passage.active').removeClass('active');
    how_it_works.find('.how-it-works--passage-list').children().eq(index).addClass('active');
  });
  
  }