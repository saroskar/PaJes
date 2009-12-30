function isArray(input) {
	return (Object.prototype.toString.apply(input) === '[object Array]');
}

(function() {
	function newline(stream, indentation) {
		stream.write('\n');
		for(var i=0; i < indentation; i++) {
			stream.write("    ");
		}
		return stream;
	}

	function acceptChildren(children, inputs) {
		if (inputs && inputs.length) {
			for (var i=0, len1=inputs.length; i<len1; i++) {
				var input = inputs[i];
				if (isArray(input)) {
					for(var j=0, len2=input.length; j < len2; j++) {
						children.push(input[j]);
					}
				}
				else {
					children.push(input);
				}
			}
		}
	}

	function displayTag(name, attrs, children, stream, indentation) {
		newline(stream, indentation).write('<'+name);

		if (attrs) {
			for (var attrName in attrs) {
				if (attrs.hasOwnProperty(attrName)) {
					stream.write(' '+attrName+'="'+attrs[attrName]+'"');
				}
			}
		}

		if (children && children.length) {
			stream.write('>');
			indentation++;
			for(var i=0, len=children.length; i < len; i++) {
				var child = children[i];
				var childType = (typeof child);
				if ((childType === 'string')||(child instanceof String)) {
					newline(stream, indentation).write(child);
				}
				else if (child && child.display && typeof child.display === 'function') {
					child.display(stream, indentation);
				}
				else if (childType === 'function') {
					newline(stream, indentation).write(child.toString());
				}
			}
			indentation--;
			newline(stream, indentation).write('</'+name+'>');
		}
		else {
			stream.write('/>');	
		}
	}

	function defineTag(name) {
		this[name] = function() {
			var children = [];
			var attrs = null;

			if (arguments.length) {
				var args = Array.prototype.slice.call(arguments, 0);
				var firstArg = args[0];
				if ((typeof firstArg === 'object')&&(!(firstArg instanceof String))&&(!isArray(firstArg))) {
					attrs = firstArg;
					args.shift();
				}
				if (args.length) {
					acceptChildren(children, args);
				}
			}

			var tag = function() {
				acceptChildren(children, Array.prototype.slice.call(arguments, 0));
				return tag;
			};

			tag.display = function(stream, indentation) {
				displayTag(name, attrs, children, stream, (indentation||0));
			};

			return tag;
		};
	}

	function defineTags(tagNames) {
		for(var i=0, len=tagNames.length; i<len; i++) {
			defineTag(tagNames[i]);
		}
	}

	defineTags(["Name", "A", "ABBR", "ACRONYM", "ADDRESS", "APPLET", "AREA", "B", "BASE", "BASEFONT", "BDO", "BIG", "BLOCKQUOTE", "BODY", "BR", "BUTTON", "CAPTION", "CENTER", "CITE", "CODE", "COL", "COLGROUP", "DD", "DEL", "DFN", "DIR", "DIV", "DL", "DT", "EM", "FIELDSET", "FONT", "FORM", "FRAME", "FRAMESET", "H1", "H2", "H3", "H4", "H5", "H6", "HEAD", "HR", "HTML", "I", "IFRAME", "IMG", "INPUT", "INS", "ISINDEX", "KBD", "LABEL", "LAYER", "LEGEND", "LI", "LINK", "MAP", "MENU", "META", "NOBR", "NOFRAMES", "NOSCRIPT", "OBJECT", "OL", "OPTGROUP", "OPTION", "P", "PARAM", "PRE", "Q", "S", "SAMP", "SCRIPT", "SELECT", "SMALL", "SPAN", "STRIKE", "STRONG", "STYLE", "SUB", "SUP", "TABLE", "TBODY", "TD", "TEXTAREA", "TFOOT", "TH", "THEAD", "TITLE", "TR", "TT", "U", "UL", "VAR"]);
	
}());

function forEach(items, f) {
	var tags = [];
	if (isArray(items)) {
		for (var i=0, len=items.length; i<len; i++) {
			tags.push(f(i, items[i]));
		}
	}
	else if (typeof items === 'object') {
		for(var name in items) {
			if (items.hasOwnProperty(name)) {
				tags.push(f(name, items[name]));
			}
		}
	}
	return tags;
}

function checkIf(condition, ifpart, elsepart) {
	var part = (condition) ? ifpart : elsepart;
	return (typeof part === 'function') ? part() : part;
}

