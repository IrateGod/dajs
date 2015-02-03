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
            var currentURL = window.location.pathname,
                pageData = {
                    current: "Home Page" // assume Home Page as default
                };
            if (currentURL === "/") {
                return pageData;
            } else {
                currentURL = currentURL.substr(currentURL.indexOf("/") + 1);
                if (currentURL === "forum") {
                    pageData.current = "Forum Overview";
                } else if (currentURL === "portal") {
                    pageData.current = "Forum Portal";
                } else if (currentURL === "search") {
                    pageData.current = "Search Page";
                } else if (currentURL === "faq") {
                    pageData.current = "FAQ";
                } else if (currentURL === "memberlist") {
                    pageData.current = "Forum Memberlist";
                } else if (currentURL === "groups") {
                    pageData.current = "Forum Groups";
                } else if (currentURL === "profile") {
                    pageData.current = "Profile Page";
                } else if (currentURL === "privmsg") {
                    pageData.current = "Private Messaging";
                } else if (currentURL === "login") {
                    pageData.current = "Login Page";
                } else if (currentURL === "post") {
                    pageData.current = "Post Page";
                } else if (currentURL === "chatbox") { // global JS won't apply to /chatbox -- rudimentary support for future implementation
                    pageData.current = "Forum Chatbox";
                } else {
                    var type = currentURL.substr(0, 1);
                    pageData.current = {
                        type: type,
                        id: null
                    };
                    if (type === "t") {
                        pageData.current.type = "Topic";
                        type = currentURL.substr(0, currentURL.indexOf("-")); // RE-ASSIGN `type` VALUE
                        if (type.indexOf("p") > -1) {
                            type = type.split("p");
                            pageData.current.id = type[0].substr(1);
                            pageData.current.page = type[1];
                        } else {
                            pageData.current.id = type.substr(1);
                        }
                    } else if (type === "h") {
                        pageData.current.type = "HTML Page";
                        pageData.current.id = currentURL.substr(1, currentURL.indexOf("-"));
                    } else if (type === "f") {
                        pageData.current.type = "Sub-Forum";
                        type = currentURL.substr(0, currentURL.indexOf("-")); // RE-ASSIGN `type` VALUE
                        if (type.indexOf("p") > -1) {
                            type = type.split("p");
                            pageData.current.id = type[0].substr(1);
                            pageData.current.page = type[1];
                        } else {
                            pageData.current.id = type.substr(1);
                        }
                    } else if (type === "c") {
                        pageData.current.type = "Category";
                        pageData.current.id = currentURL.substr(1, currentURL.indexOf("-"));
                    } else if (type === "u") {
                        pageData.current.type = "Member Profile";
                        var regex = /(wall|friends|stats|contact)/i,
                            subPage;
                        if (regex.test(currentURL)) {
                            subPage = currentURL.split(regex);
                            pageData.current.id = subPage[0].substr(1);
                            pageData.current.page = subPage[1][0].toUpperCase() + subPage[1].substr(1);
                        } else {
                            pageData.current.id = currentURL.substr(1);
                        }
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
        log: function() {
            // stub, expand later
            console.log(arguments);
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
