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

});
function GetDynamicTextBox(value) {
    return '<input id ="textBox" name = "DynamicTextBox" type="text" value = "' + value + '" />&nbsp;' +
            '<input type="button" value="Remove" class="remove" />' + '&nbsp;' +
            '<input type="button" value="Replace" class="replace" />'
}