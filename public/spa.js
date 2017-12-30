var SPA = new function() {
	
	var opened = {},
		pages = [],
		active = null;
	
	this.timestamp = () => new Date().valueOf();

	this.addPages = function(user_pages) {
		user_pages.forEach(p => pages.push(p));
	};
	
	this.start = function() {
		loadPageFromHash();
	};
	
	this.openPage = function(stateObj, url) {
		history.pushState(stateObj, "", url);
		loadPageFromHash();
	};

	function loadPageFromHash() {
		var path = window.location.pathname;
		var page = pages.find(p => p.path.toLowerCase() == path.toLowerCase()) || pages.find(p => p.default);
		if (page) {
			var url = window.location.pathname + window.location.hash + window.location.search;
			var p = opened[url];
			if (p) {
				enablePage(page, p);
			} else {
				openPage(url, page);
			}
		} else {
			console.warn("SPA: No route found for", path);
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
	
	function openPage(id, page) {
		page.content(p => {
			opened[id] = p;
			page.context.appendChild(p);
			enablePage(page, p);
		});
	}
	
	window.addEventListener('popstate', event => {
		//var data = event.state;
		loadPageFromHash();
	}, false);
};