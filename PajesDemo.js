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

/******** Example 1: Simplest use case: static HTML generation ***************/
DIV(
    {id:"demo-div", width: "60%"},
    OL(
        {style: "list-style-type: upper-roman"},
        LI(
            "First Student",
            A(
                {href:"/student-details?id=1"},
                "details"
            )
        ),
        LI(
            "Second Student",
            A(
                {href:"/student-details?id=2"},
                "details"
            )
        )
    )
).display(out);
out.flush();


/****** Example 2: Value substitution (Merging template with model) **********/
var model = [
    {name: "Lisa Simpson", id: 1},
    {name: "Bart Simpson", id: 666}
]

DIV(
    {id:"demo-div", width: "60%"},
    OL(
        {style: "list-style-type: upper-roman"},
        LI(
            model[0].name,
            A(
                {href:"/student-details?id="+model[0].id},
                "details 1"
            )
        ),
        LI(
            model[1].name,
            A(
                {href:"/student-details?id="+model[1].id},
                "details 2"
            )
        )
    )
).display(out);
out.flush();


/************* Example 3: Collections and Loops ******************************/
var model = [
    {name: "Lisa Simpson", id: 1},
    {name: "Bart Simpson", id: 666}
]

DIV(
    {id:"demo-div", width: "60%"},
    OL(
        {style: "list-style-type: upper-roman"},
        forEach(model, studentDetails)
    )
).display(out);
out.flush();

function studentDetails(index, value) {
    return LI(
            value.name,
            A(
                {href:"/student-details?id="+value.id},
                "details "+(index+1)
            )
        );
}


/************ Example 4: Generating output conditionally **********************/
var grade = 'A';
DIV(
    {id:"demo-div", width: "60%"},
    checkIf(
        /* check condition */
        (grade === 'A'),
        SPAN("Ivy League"),
        SPAN("Community College")
    )
).display(out);
out.flush();


/***** Example 5: Including JavaScript function in the generated output ******/
function toBeIncludedInHtmlForClientSideExecution(x) {
    alert("x="+x+". Hey it works!");
}

SCRIPT(toBeIncludedInHtmlForClientSideExecution).display(out);
out.flush();


/************ Example 6: Adding new children to old tags *********************/
var model = {loggedIn: true, name: "John Doe"};

/* store the reference to the DIV */
var topDiv = DIV({id: "greetingbox"});

if (model.loggedIn) {
    topDiv(SPAN("Welcome "+model.name));
}
else {
    topDiv(STRONG("Please log in"));
}
topDiv.display(out);
out.flush();



/***** Example 7: Something like JSP's custom tags or Freemarker's macros ****/
var model = ["Car Electronics",
             "Car Audio and Video",
             "Car Stereos"];

function breadcrumb(model) {
    return UL(
        {"class": "brdcrmb"},
        forEach(
            model,
            function(index, item) {
                if (index === (model.length-1)) {
                    return LI("&quot;", item, "&quot;");
                }
                else {
                    return LI("&quot;", item, "&quot;", "&gt;");
                }
            }
        )
    );
}

DIV(
    "Category:",
    breadcrumb(model)
).display(out);
out.flush();
