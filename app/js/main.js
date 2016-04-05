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
	  var h = '<h2>Related Topics</h2>'+'<textarea rows="4" cols="40">'+ res +'</textarea>';
      // 4. display the output
	  $("#results").html(p);
	  $('#leftResult').html(h);
		
		
		});
    });
    $("body").on("click", ".remove", function () {
        $(this).closest("div").remove();
    });
});
function GetDynamicTextBox(value) {
    return '<input name = "DynamicTextBox" type="text" value = "' + value + '" />&nbsp;' +
            '<input type="button" value="Remove" class="remove" />'
}