var SPA = new function() {
	
	var opened = {},   // obj of opened views
		pages = [],    // pages array
		active = null, // current opened page
		UID = 0,
		LUID = 0; 
	
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
	 */
	this.start = function() {
		loadPageFromHash(UID++);
	};
	
	/**
	 * Open a page.
	 * @param {*} url 
	 */
	this.openPage = function(url) {
		history.pushState(UID, "", url);
		loadPageFromHash(UID);
		UID++;
	};

	/**
	 * Open page from url.
	 * @param {*} CUID 
	 */
	function loadPageFromHash(CUID) {
		var path = window.location.pathname;
		var page = pages.find(p => p.path.toLowerCase() == path.toLowerCase()) || pages.find(p => p.default);
		if (page) {
			var url = window.location.href;
			var p = opened[url];
			if (p) {
				enablePage(page, p, CUID > LUID);
			} else {
				openPage(url, page);
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
	 * @param {*} newPage 
	 */
	function enablePage(page, p, newPage) {
		if (active) {
			if (page.layout != active.layout) {
				active.layout.classList.remove("spa_closing_bck", "spa_opening_fwd");
				page.layout.classList.remove("spa_opening_bck", "spa_closing_fwd");
				if (newPage) {
					active.layout.classList.add("spa_closing_bck");
					page.layout.classList.add("spa_opening_bck");	
				} else {
					active.layout.classList.add("spa_opening_fwd");
					page.layout.classList.add("spa_closing_fwd");	
				}
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
	 */
	function openPage(id, page) {
		page.content(p => {
			opened[id] = p;
			page.context.appendChild(p);
			enablePage(page, p, true);
		});
	}
	
	window.addEventListener('popstate', event => {
		var data = event.state || 0;
		loadPageFromHash(data);
		LUID = data;
	}, false);
};