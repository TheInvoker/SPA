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
	 */
	this.start = function() {
		loadPageFromHash(UID++);
	};
	
	/**
	 * Open a page.
	 * @param {*} url 
	 */
	this.openPage = function(url) {
		url = attachTimeStamp(url);
		history.pushState(UID, "", url);
		loadPageFromHash(UID);
		UID++;
	};

	/**
	 * 
	 * @param {*} url 
	 * https://superuser.com/questions/498617/does-an-anchor-tag-come-before-the-query-string-or-after
	 */
	function attachTimeStamp(url) {
		var timestamp = new Date().valueOf();

		url = "http://www.google.ca#f?g=3";
		var mark1 = url.indexOf("?");
		var mark2 = url.indexOf("#");

		if (mark1 == -1 && mark2 == -1) {
			return url + "?t=" + timestamp;
		} else if (mark1 == -1) {
			return url.substring(0, mark2) + "?t=" + timestamp + url.substr(mark2);
		} else if (mark2 == -1) {
			return url + "&t=" + timestamp;
		} else {
			if (mark1 < mark2) {
				return url.substring(0, mark2) + "&t=" + timestamp + url.substr(mark2);
			} else {
				// TODO
			}
		}
	}

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
				active.layout.classList.remove("spa_closing_bck", "spa_opening_bck", "spa_opening_fwd", "spa_closing_fwd");
				page.layout.classList.remove("spa_closing_bck", "spa_opening_bck", "spa_opening_fwd", "spa_closing_fwd");
				if (newPage) {
					active.layout.classList.add("spa_closing_bck");
					page.layout.classList.add("spa_opening_bck");	
				} else {
					active.layout.classList.add("spa_opening_fwd");
					page.layout.classList.add("spa_closing_fwd");	
				}
			}
		}

		page.context.childNodes.forEach(c => {
			c.style.display = c == p ? "block" : "none";
		});

		if (active) {
			active.close();
			active.layout.classList.remove("sp_active_page");
		}
		active = page;
		active.layout.classList.add("sp_active_page");
		
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