var SPA = new function() {
	
	var opened = {},
		pages = [],
		active = null;
	
	/**
	* This is a pretty cool unique hash generator function which came from these links:
	* https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	* https://gist.github.com/jed/982883
	*/
	this.uuidv4 = () => ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

	this.addPages = function(user_pages) {
		user_pages.forEach(p => pages.push(p));
	};
	
	this.start = function() {
		loadPageFromHash(window.location.hash);
	};

	function openPage(id, page) {
		page.content(p => {
			opened[id] = p;
			page.context.appendChild(p);
			enablePage(page, p);
		});
	}
	
	function getPage(hash) {
		if (hash == "") {
			return pages.find(p => p.default);
		} else {
			var id = hash.split("/")[0].toLowerCase();
			return pages.find(p => p.id.toLowerCase() == id);
		}
	}
	
	function loadPageFromHash(id) {
		var page = getPage(id);
		if (opened[id]) {
			var p = opened[id];
			enablePage(page, p);
		} else {
			openPage(id, page);
		}
	}
	
	function enablePage(page, p) {
		pages.forEach(p => {
			p.layout.style.display = "none";
		});
		page.layout.style.display = "block";
		
		page.context.childNodes.forEach(c => {
			c.style.display = "none";
		});
		p.style.display = "block";	

		if (active) active.close();
		active = page;
		page.open();		
	}
	
	window.addEventListener('popstate', event => {
		loadPageFromHash(window.location.hash);
	}, false);
};