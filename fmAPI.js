(function(thisContext) {
    function _F() {
        return this.init();
    }
    var _f = {
        constructor: _F,
        toString: function() {
            return "[object fmAPI]";
        },
        init: function() {
            this.pageData = this.getPageData();
            return this;
        },
        getPageData: function() { // parse URL and return pageData object
            var currentPage = window.location.pathname,
                pageData = {
                    current: "Home Page" // assume Home Page as default
                };
            if (currentPage === "/") {
                return pageData;
            } else {
                currentPage = currentPage.substr(currentPage.indexOf("/") + 1);
                if (currentPage === "forum") {
                    pageData.current = "Forum Overview";
                } else if (currentPage === "portal") {
                    pageData.current = "Forum Portal";
                } else if (currentPage === "search") {
                    pageData.current = "Search Page";
                } else if (currentPage === "faq") {
                    pageData.current = "FAQ";
                } else if (currentPage === "memberlist") {
                    pageData.current = "Forum Memberlist";
                } else if (currentPage === "groups") {
                    pageData.current = "Forum Groups";
                } else if (currentPage === "profile") {
                    pageData.current = "Profile Page";
                } else if (currentPage === "privmsg") {
                    pageData.current = "Private Messaging";
                } else if (currentPage === "login") {
                    pageData.current = "Login Page";
                } else if (currentPage === "post") {
                    pageData.current = "Post Page";
                } else if (currentPage === "chatbox") { // global JS won't apply to /chatbox -- rudimentary support for future implementation
                    pageData.current = "Forum Chatbox";
                } else {
                    currentPage = currentPage.substr(0, currentPage.indexOf("-"));
                    pageData.current = {
                        page: currentPage.substr(0, 1),
                        id: currentPage.substr(1)
                    };
                    if (pageData.current.page === "t") {
                        pageData.current.page = "Topic";
                    } else if (pageData.current.page === "h") {
                        pageData.current.page = "HTML Page";
                    } else if (pageData.current.page === "f") {
                        pageData.current.page = "Sub-Forum";
                    } else if (pageData.current.page === "c") {
                        pageData.current.page = "Category";
                    } else if (pageData.current.page === "u") {
                        pageData.current.page = "Member Profile";
                    } else {
                        /**
                         *
                         * Since fmAPI was built to be the foundation for all other JavaScript, and in case other apps depend on it, script execution will resume
                         * although fmAPI cannot parse the current page data.
                         *
                         * This special case is identifiable through the `fmAPI.pageData` property:
                         * if it is `null`, and only then, fmAPI was not able to parse the page.
                         *
                         * If your forum requires fmAPI for apps and the functionality is crucial, consider testing for this case to prevent uncaught errors.
                         *
                         */
                        pageData = null;
                    }
                }
            }
            return pageData;
        },
        setProperty: function(property, value) {
            if (!(property in this)) {
                this[property] = value;
            } else {
                this.log("`fmAPI.setProperty` cannot be used to redefine already set properties. Use `fmAPI.updateProperty` instead.");
            }
            return this;
        },
        getProperty: function(property) {
            return this[property];
        },
        updateProperty: function(property, value) {
            if (property in this && typeof this[property] !== "function") {
                this[property] = value;
            } else {
                this.log("`fmAPI.updateProperty` cannot be used to modify existing methods or set new properties.");
            }
            return this;
        },
        getURL: function(url, callback, isjQuery) {
            jQuery.get("/" + url, function(data, txtStatus, jqXHR) {
                if (isjQuery) {
                    callback(jQuery(data), txtStatus, jqXHR);
                } else {
                    callback(data, txtStatus, jqXHR);
                }
            });
        }
    };
    _F.prototype = _f;
    thisContext.fmAPI = new _F();
})(this);
