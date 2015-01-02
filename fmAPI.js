// fmAPI.js
window.fmAPI = {}; // make fmAPI globally accessible
window.fmAPI_config = {}; // fmAPI configuration, look up documentation
window.fmAPI_config.version = "PunBB"; // in our case, this is PunBB
window.fmAPI.setProperty = function(prop,val){ // basic set method
	window.fmAPI[prop]=val;
	return window.fmAPI;
};
window.fmAPI.getProperty = function(prop){ // basic get method
	return window.fmAPI[prop];
};
window.fmAPI._getPageData = function(){ // gather page data
	window.fmAPI._pageDetails = {};
	var curPage = window.location.pathname;
	if( curPage === "/" ) { // home page
		window.fmAPI._pageDetails.current = "Home";
	} else { // not home page, eliminate / from URL
		curPage = curPage.substr( curPage.indexOf("/") + 1 );
		if( curPage === "search" ) { // search page
			window.fmAPI._pageDetails.current = "Search Page";
		} else if( curPage === "portal" ) { // forum portal
			window.fmAPI._pageDetails.current = "Forum Portal";
		} else if( curPage === "faq" ) { // FAQ
			window.fmAPI._pageDetails.current = "FAQ";
		} else if( curPage === "memberlist" ) { // forum memberlist
			window.fmAPI._pageDetails.current = "Forum Memberlist";
		} else if( curPage === "groups" ) { // forum groups
			window.fmAPI._pageDetails.current = "Forum Groups";
		} else if( curPage === "profile" ) { // profile page
			window.fmAPI._pageDetails.current = "Profile Page";
		} else if( curPage === "privmsg" ) { // private messages
			window.fmAPI._pageDetails.current = "Private Messages";
		} else if( curPage === "login" ) { // login page
			window.fmAPI._pageDetails.current = "Login Page";
		} else if( curPage === "post" ) { // post
			window.fmAPI._pageDetails.current = "Post";
		} else if( curPage === "chatbox" ) { // chatbox; global JS doesn't apply to it, but I provide it, anyway
			window.fmAPI._pageDetails.current = "Chatbox";
		} else { // not specifically named page, check for single letter
			curPage = curPage.substr( 0, curPage.indexOf("-") );
			curPage = {
				page: curPage.substr( 0, 1 ),
				id: curPage.substr( 1 )
			};
			switch( curPage.page ) {
				case "t": { // topic
					curPage.page = "Topic";
					break;
				}
				case "h": { // html page
					curPage.page = "HTML Page";
					break;
				}
				case "f": { // forum; NOT (!) home page
					curPage.page = "Forum";
					break;
				}
				case "c": { // category
					curPage.page = "Category";
					break;
				}
				default: { // some erroneous case, just break
					break;
				}
			}
			window.fmAPI._pageDetails.current = curPage;
		}
	}
};
window.fmAPI._setPageData = function(obj){ // use when switching page dynamically
	window.fmAPI._pageDetails.current = obj;
	return window.fmAPI._pageDetails;
};
window.fmAPI.pageSwitch = function(str,obj){ // switch page dynamically
	window.fmAPI._setPageData(obj);
	$.get(str,function(html){
		document.documentElement.innerHTML = html;
	});
};
window.fmAPI.getPosts = function(){ // get posts from topic if we're currently viewing a topic
	if( window.fmAPI._pageDetails.current.page == "Topic" ) {
		var def = window.fmAPI._getDefaultPosts(window.fmAPI_config.version); // test for default versions
		if( def.length === 0 ) {
			def = window.fmAPI._getCustomPosts(); // if no default version, look up custom post bodies
		}
		return def;
	} else { // if we're not in a topic, just return an empty object
		return {};
	}
};
window.fmAPI._getDefaultPosts = function(vers){
	var posts;
	switch( vers ) { // test for versions
		case "PunBB": { // PunBB
			posts = $('div.postmain');
			break;
		}
		case "Invision": { // Invision; placeholder
			break;
		}
		case "phpBB 2": { // phpBB 2; placeholder
			break;
		}
		case "phpBB 3": { // phpBB 3; placeholder
			break;
		}
	}
	return posts;
};
