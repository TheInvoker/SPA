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
 __________
|__header__|
|__________|
|__footer__|




var c1 = function(callback) {
	var a = document.createElement("a");
	a.innerHTML = "click";
	a.setAttribute("href", "javascript:void(0);");
	a.addEventListener("click", function() {
		SPA.openPage({a:1}, "bar?t=" + SPA.timestamp());
	});
	
	var r = document.createElement("div");
	r.appendChild(a);
	callback(r);
};
var c2 = function(callback) {
	var r = document.createElement("div");
	r.innerHTML = "content2";
	callback(r);
};

SPA.addPages([
	{
		path : "/foo",
		layout : layout,
		context : b,
		content : c1,
		default : true,
		open : function() {
			console.log("foo opened");
		},
		close : function() {
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
SPA.start();