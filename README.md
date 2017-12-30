# SPA

Single page application framework.

Example:

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
var c1 = function(callback) {
	var a = document.createElement("a");
	a.innerHTML = "click";
	a.setAttribute("href", "javascript:void(0);");
	a.addEventListener("click", function() {
		SPA.openPage({a:1}, "bar?t=" + SPA.timestamp(), {a:1});
	});
	
	var r = document.createElement("div");
	r.appendChild(a);
	callback(r);
};
```

Make a function to generate page 2:

```javascript
var c2 = function(callback) {
	var r = document.createElement("div");
	r.innerHTML = "content2";
	callback(r);
};
```

Add the pages into the framework:

```javascript
SPA.addPages([
	{
		path : "/foo",                   // route
		layout : layout,                 // DOM element for the page layout
		context : b,                     // parent DOM element for the page
		content : c1,                    // DOM element for the page
		default : true,                  // default page for when route is not resolved
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
		open : function() {
			console.log("bar opened");
		},
		close : function() {
			console.log("bar closed");
		}
	}
]);

Start the framework:

```javascript
SPA.start({a:1});
```