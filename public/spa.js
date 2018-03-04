var SPA = new function() {
	
	var opened = {},   // obj of opened views
		pages = [],    // pages array
		active = null; // current opened page
	
	/** 
	 * Get unique identifier for a page url. 
	 */
	this.timestamp = () => new Date().valueOf();

	/**
	 * Add an array of user pages into the framework.
	 * @param {*} user_pages 
	 */
	this.addPages = function(user_pages) {
		user_pages.forEach(p => {
			p.layout.classList.add("spa_page");
			pages.push(p);
		});
	};
	
	/**
	 * Start the framework and open a page determined from the url.
	 * @param {*} data 
	 */
	this.start = function(data) {
		loadPageFromHash(data);
	};
	
	/**
	 * Open a page.
	 * @param {*} stateObj 
	 * @param {*} url 
	 */
	this.openPage = function(stateObj, url) {
		history.pushState(stateObj, "", url);
		loadPageFromHash(stateObj);
	};

	/**
	 * Open page from url.
	 * @param {*} data 
	 */
	function loadPageFromHash(data) {
		var path = window.location.pathname;
		var page = pages.find(p => p.path.toLowerCase() == path.toLowerCase()) || pages.find(p => p.default);
		if (page) {
			var url = window.location.href;
			var p = opened[url];
			if (p) {
				enablePage(page, p);
			} else {
				openPage(url, page, data);
			}
		} else {
			console.warn("SPA: No route found for", path);
			alert("SPA: No route found for: " + path);
		}
	}
	
	/**
	 * Show the page.
	 * @param {*} page 
	 * @param {*} p 
	 */
	function enablePage(page, p) {
		pages.forEach(p => {
			if (p.layout == page.layout) {
				//p.layout.style.display = "block";
			} else {
				//p.layout.style.display = "none";
			}
		});
		if (active) {
			if (page.layout != active.layout) {
				active.layout.classList.remove("spa_opening");
				active.layout.classList.add("spa_closing");
				page.layout.classList.remove("spa_closing");
				page.layout.classList.add("spa_opening");	
			}
		} else {
			page.layout.classList.add("spa_first_page");
		}

		page.context.childNodes.forEach(c => {
			c.style.display = c == p ? "block" : "none";
		});

		if (active) active.close();
		active = page;
		
		if (!page.opened) {
			page.opened = true;
			page.first_open();
		}
		page.open();
	}
	
	/**
	 * Open the page.
	 * @param {*} id 
	 * @param {*} page 
	 * @param {*} data 
	 */
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