var SPA = new function() {
	
	var opened = {},   // obj of opened views
		pages = [],    // pages array
		active = null, // current opened page
		UID = 0,
		LUID = 0; 
	
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
		loadPageFromHash(UID++, data);
	};
	
	/**
	 * Open a page.
	 * @param {*} url 
	 * @param {*} data
	 */
	this.openPage = function(url, data) {
		history.pushState(UID, "", url);
		loadPageFromHash(UID, data);
		UID++;
	};

	/**
	 * Open page from url.
	 * @param {*} CUID 
	 * @param {*} data 
	 */
	function loadPageFromHash(CUID, data) {
		var path = window.location.pathname;
		var page = pages.find(p => p.path.toLowerCase() == path.toLowerCase());
		if (page) {
			var p = opened[CUID];
			if (p) {
				enablePage(page, p, CUID > LUID);
			} else {
				openPage(CUID, page, data);
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
				active.layout.classList.remove("spa_closing_bck", "spa_opening_bck", "spa_opening_fwd", "spa_closing_fwd");
				page.layout.classList.remove("spa_closing_bck", "spa_opening_bck", "spa_opening_fwd", "spa_closing_fwd");
				if (newPage) {
					active.layout.classList.add("spa_closing_bck");
					page.layout.classList.add("spa_opening_bck");	
				} else {
					active.layout.classList.add("spa_opening_fwd");
					page.layout.classList.add("spa_closing_fwd");	
				}
				active.close();
				active.layout.classList.remove("sp_active_page");
				active = page;
				active.layout.classList.add("sp_active_page");
			}
		} else {
			active = page;
			active.layout.classList.add("sp_active_page");
		}

		page.context.childNodes.forEach(c => {
			if (c == p) {
				setTimeout(function() {
					c.style.display = "block";
					requestAnimationFrame(function() {
						requestAnimationFrame(function() {
							c.classList.add("spa_open_item");
						});
					});
				}, 501);
			} else {
				c.classList.remove("spa_open_item");
				setTimeout(function() {
					c.style.display = "none";
				}, 500);
			}
		});
		
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
			p.classList.add("spa_item");
			if (p.parentNode.childNodes.length == 1) {
				p.classList.add("spa_open_item");
			} else {
				p.style.display = "none";
			}
			enablePage(page, p, true);
		}, data);
	}
	
	window.addEventListener('popstate', event => {
		var data = event.state || 0;
		loadPageFromHash(data, null);
		LUID = data;
	}, false);
};