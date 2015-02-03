fmAPI documentation
==========

Refer to this page for the official documentation of fmAPI.js.

Implementation
-------

Run fmAPI.js in global scope — to achieve this, simply copy and paste the contents of the file into a new JavaScript file. This is specifically designed to run on [forumotion forums](http://forumotion.com/en), but will run on any environment with JavaScript installed, though, obviously, the script will not be useful.

fmAPI - methods
-------

`fmAPI` itself is an instance of _F that inherits from _f. The constructor names are irrelevant and are discarded after the script runs the only function it contains, a closure.

Following methods are available for `fmAPI`:

#### [toString](#toString)
#### [init](#init)
#### [getPageData](#getPageData)
#### [setProperty(*String* _property_, *mixed* _value_)](#setProperty)
#### [getProperty(*String* _property_)](#getProperty)
#### [updateProperty(*String* _property_,*mixed* _value_)](#updateProperty)
#### [log](#log)
#### [getURL(*String* _url_, *Function* _callback_, *Boolean* _isjQuery_)](#getURL)

---

######<a name="toString">toString</a>:
  *takes arguments*: _none_
  *returns*: _a string representation of `fmAPI`; in this case, "[object fmAPI]"_
  
###### <a name="init">init</a>:
  *takes arguments*: _none_
  *returns*: _`this`; initiates `fmAPI` to contain fully operable `pageData` object_
  
###### <a name="getPageData">getPageData</a>:
  *takes arguments*: _none_
  *returns*: _`pageData` object; called within `init`, this is the parser for URLs_
  
###### <a name="setProperty">setProperty</a>:
  *takes arguments*:
    1. *String* _property_ - The to be set property name
    2. *mixed* _value_ - The value to be bound to `property`, any arbitrary JavaScript value
  *returns*: _`this`; basic setter, allows extending `fmAPI` — cannot overwrite already set properties_
  
###### <a name="getProperty">getProperty</a>:
  *takes arguments*:
    1. *String* _property_ - The property to be requested
  *returns*: _returns property values of `this` (as default, returns `undefined` if the property is not defined); basic getter_
  
###### <a name="updateProperty">updateProperty</a>:
  *takes arguments*:
    1. *String* _property_ - The property to be updated
    2. *mixed* _value_ - As with [setProperty](#setProperty), any arbitrary JavaScript value to update `property` with
  *returns*: _`this`; basic updater — updates an already existing property_
  
###### <a name="log">log</a>:
  *takes arguments*:
    1. *mixed* _any_ - Any arbitrary amount of arguments containing any arbitrary JavaScript values, currently equivalent to `console.log`
  *returns*: _`undefined`; logging tool for developing_
  
###### <a name="getURL">getURL</a>:
  *takes arguments*:
    1. *String* _url_ - URL to get. This is relative to the current path.
    2. *Function* _callback_ - function to execute after the GET request is done; equivalent to `jQuery.get`'s callback function
    3. *Boolean* _isjQuery_ - Boolean value whether or not to use `jQuery(data)` within `callback` - defaults to `false`
  *returns*: _nothing_
