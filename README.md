# SPA

Single page application framework.

Example:

Add this to your page to load the framework:

```javascript
<script src="spa.js"></script>
```

Make a page layout that has a header, body and footer:

```javascript
var layout = document.createElement("div");
var h = document.createElement("div");
var b = document.createElement("div");
var f = document.createElement("div");
layout.appendChild(h);
layout.appendChild(b);
layout.appendChild(f);
h.innerHTML = "header";
f.innerHTML = "footer";
document.body.appendChild(layout);
```

makes:

```
 __________
|__header__|
|__________|
|__footer__|
```

Make a function to generate page 1:

```javascript
// takes a callback and some data, you then generate a DOM element for your page using the data, then use the callback with your page element
var c1 = function(callback, data) {
	var a = document.createElement("a");
	a.innerHTML = "click";
	a.setAttribute("href", "javascript:void(0);");
	a.addEventListener("click", function() {
		SPA.openPage({a:1}, "bar?t=" + SPA.timestamp());   // switch to page 2, use timestamp to generate a new instance of the page even if the page was visited before. As well send some data.
	});
	
	var r = document.createElement("div");
	r.appendChild(a);
	callback(r);
};
```

makes:

```
 _________
|__click__|
```

Make a function to generate page 2:

```javascript
// same concept as above
var c2 = function(callback, data) {
	var r = document.createElement("div");
	r.innerHTML = "content2";
	callback(r);
};
```

makes:

```
 ____________
|__content2__|
```

Add the pages into the framework. These will add the 2 pages into the body of the page layout.

```javascript
SPA.addPages([
	{
		path : "/foo",                   // route
		layout : layout,                 // DOM element for the page layout
		context : b,                     // parent DOM element for the page
		content : c1,                    // DOM element for the page
		default : true,                  // default page for when route is not resolved
		opened : false,                  // has it been opened before?
		first_open : function() {        // page first open event
		
		},
		open : function() {              // page open event
			console.log("foo opened"); 
		},
		close : function() {             // page close event
			console.log("foo closed");
		}
	},
	{
		path : "/bar",
		layout : layout,
		context : b,
		content : c2,
		default : false,
		opened : false,      
		first_open : function() {
		
		},
		open : function() {
			console.log("bar opened");
		},
		close : function() {
			console.log("bar closed");
		}
	}
]);
```

Start the framework with some data:

```javascript
SPA.start({a:1});
```