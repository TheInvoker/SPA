"use strict";

/* header */

((function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function() { return factory; });
    } else if (typeof window !== 'undefined') {
        window.SPA = factory;
    } else {
        console.warn("Module didn't get loaded into memory.");
    }
})(new function() {
	
	var opened = {},   // obj of opened views
		pages = [],    // pages array
		active_page = null, // current opened page
		active_item = null, // current opened item
		url_mapping = {},
		UID = 0,
		LUID = 0; 
	
	/**
	 * Add an array of user pages into the framework.
	 * @param {*} user_pages 
	 */
	this.addPages = function(user_pages) {
		user_pages.forEach(p => {
			p.layout.classList.add("spa_page");
			p.context.classList.add("spa_context_container");
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
	 * @param {*} useExisting 
	 */
	this.openPage = function(url, data, useExisting) {
		if (useExisting && url_mapping.hasOwnProperty(url)) {
			var old_UID = url_mapping[url];
			history.pushState(old_UID, "", url);
			loadPageFromHash(old_UID, data);
		} else {
			url_mapping[url] = UID;
			history.pushState(UID, "", url);
			loadPageFromHash(UID, data);
			UID++;
		}
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
		if (active_item) {
			if (p != active_item) {
				active_item.classList.remove("spa_closing_bck", "spa_opening_bck", "spa_opening_fwd", "spa_closing_fwd");
				p.classList.remove("spa_closing_bck", "spa_opening_bck", "spa_opening_fwd", "spa_closing_fwd");
				if (newPage) {
					active_item.classList.add("spa_closing_bck");
					p.classList.add("spa_opening_bck");	
				} else {
					active_item.classList.add("spa_opening_fwd");
					p.classList.add("spa_closing_fwd");	
				}
				///
				if (active_item.parentNode === p.parentNode) {
					active_item.style.position = "absolute";
				} else {
					active_item.style.position = "static";
				}
				p.style.position = "";
				///
				active_item.classList.remove("spa_active_item");
				active_item = p;
				active_item.classList.add("spa_active_item");
			}
		} else {
			active_item = p;
			active_item.classList.add("spa_active_item");
		}

		if (active_page) {
			if (page.layout != active_page.layout) {
				active_page.layout.classList.remove("spa_closing_bck", "spa_opening_bck", "spa_opening_fwd", "spa_closing_fwd");
				page.layout.classList.remove("spa_closing_bck", "spa_opening_bck", "spa_opening_fwd", "spa_closing_fwd");
				if (newPage) {
					active_page.layout.classList.add("spa_closing_bck");
					page.layout.classList.add("spa_opening_bck");	
				} else {
					active_page.layout.classList.add("spa_opening_fwd");
					page.layout.classList.add("spa_closing_fwd");	
				}
				active_page.layout.classList.remove("spa_active_page");
				active_page = page;
				active_page.layout.classList.add("spa_active_page");
			}
		} else {
			active_page = page;
			active_page.layout.classList.add("spa_active_page");
		}
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
			///
			var c = page.context.childNodes;
			for(var i=0; i<c.length; i++) {
				c[i].style.position = "absolute";
			}
			///
			page.context.appendChild(p);
			p.classList.add("spa_item");
			enablePage(page, p, true);
		}, data);
	}
	
	window.addEventListener('popstate', event => {
		var data = event.state || 0;
		loadPageFromHash(data, null);
		LUID = data;
	}, false);
}));