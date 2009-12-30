/**
* Output stream implementation for Rhino Shell that uses 
* Rhino Shell's  print() function to generate output.
*/
function RhinoOutputStream() {
	var content = "";
	return {
		write : function(str) {
			content = content + str;
		},
		flush : function() {
			print(content);
			content = "";
		}
	}
}

var out = RhinoOutputStream();