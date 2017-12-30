var SPA = new function() {
	
	var opened = {},
		pages = [],
		active = null;
	
	this.timestamp = () => new Date().valueOf();

	this.addPages = function(user_pages) {
		user_pages.forEach(p => pages.push(p));
	};
	
	this.start = function(data) {
		loadPageFromHash(data);
	};
	
	this.openPage = function(stateObj, url, data) {
		history.pushState(stateObj, "", url);
		loadPageFromHash(data);
	};

	function loadPageFromHash(data) {
		var path = window.location.pathname;
		var page = pages.find(p => p.path.toLowerCase() == path.toLowerCase()) || pages.find(p => p.default);
		if (page) {
			var url = window.location.pathname + window.location.hash + window.location.search;
			var p = opened[url];
			if (p) {
				enablePage(page, p);
			} else {
				openPage(url, page, data);
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
	
	function openPage(id, page, data) {
		page.content(p => {
			opened[id] = p;
			page.context.appendChild(p);
			enablePage(page, p);
		}, data);
	}
	
	window.addEventListener('popstate', event => {
		var data = event.state;
		loadPageFromHash(data);
	}, false);
};