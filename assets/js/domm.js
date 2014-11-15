(function() {

    var win = window,
        doc = win.document,
        html = doc.documentElement,
        body = doc.body,
        _specialAttributes = /^(checked|value|selected|disabled)$/i,
        _stateAttributes = /^(checked|selected|disabled)$/,
        _nthChildExpr = /^\s*(?:([\-+]?\d*)n(\s*[\-+]\s*\d+)?|([\-+]?\d+))\s*$/,
        _whitespace = /\s+/,
        _addClass, _removeClass, _hasClass, _toggleClass,
        _readyFn = [],
        _DOMReady = function() {
            var i = 0, l = _readyFn.length;
            for ( ; i < l; i++ ) {
                _readyFn[ i ]();
            }
            _readyFn = null;
            domm.removeEvent( doc, "DOMContentLoaded", _DOMReady );
        };

    /**
     * @param  {Element|Node|String} selector
     * @return {domm}
     */
    var domm = function( selector ) {
        return new domm.fn.init( selector );
    };

    domm.fn = domm.prototype = {
        // constructor
        constructor: domm,

        // default length
        length: 0,

        /**
         * @param  {Number=} num
         * @return {Element|Array}
         */
        get: function( num ) {
            return num ? num < 0 ? this[ num + this.length ] : this[ num ] : [].slice.call( this );
        },

        /**
         * @param  {Node} el
         * @return {domm}
         */
        stack: function( el ) {
            // Build a new domm matched element set
            var neww = domm.merge( this.constructor(), el );

            // Add the old object onto the stack (as a reference)
            neww.old = this;

            // Return the newly-formed element set
            return neww;
        },

        // To look like an array on dev tools (chrome).
        splice: [].splice
    };


    // $.extend - Merges two or more objects together into the first object.
    // $.fn.extend - Merges an object onto the domm prototype to provide new domm instance methods.
    domm.extend = domm.fn.extend = function() {
        var src, target = arguments[ 0 ] || {},
            l = arguments.length,
            i = 1,
            deep = false;

        // Handle deep extend situation
        if ( typeof target === "boolean" ) {
            deep = target;
            // skip the boolean and the target
            target = arguments[ i ] || {};
            i++;
        }

        // Extend domm itself if only one argument is passed
        if ( i === l ) {
            target = this;
            i--;
        }

        for ( ; i < l; i++ ) {
            if ( !(src = arguments[ i ]) ) continue;
            for ( var key in src ) {
                if ( src.hasOwnProperty( key ) ){
                    if ( deep && typeof src[ key ] === "object" )
                        target[ key ] = domm.extend( true, target[ key ], src[ key ] );
                    else
                        target[ key ] = arguments[ i ][ key ];
                }
            }
        }
        return target;
    };

    /**
     * domm utility methods.
     */
    domm.extend({
        /**
         * Feature list.
         * @return {Object}
         */
        features: function() {
            var p = doc.createElement( "p" );
            return {
                classList: "classList" in p
            };
        }(),

        /**
         * @param  {Function} fn
         */
        ready: function( fn ) {
            if ( _readyFn.length === 0 ) {
                domm.addEvent( doc, "DOMContentLoaded", _DOMReady );
            }
            _readyFn.push( fn );
        },

        /**
         * @param {String} evt
         * @param {Function} fn
         * @param {Element} el
         */
        addEvent: function() {
            if ( doc.addEventListener ) {
                return function( el, evt, fn ) { el.addEventListener( evt, fn, false ); };
            } else if ( doc.attachEvent ) {
                return function( el, evt, fn ) { el.attachEvent( "on" + evt, fn ); };
            } else {
                return function ( el, evt, fn ) { el[ "on" + evt ] = fn; };
            }
        }(),

        /**
         * @param {String} evt
         * @param {Function} fn
         * @param {Element} el
         */
        removeEvent: function() {
            if ( doc.removeEventListener ) {
                return function( el, evt, fn ) { el.removeEventListener( evt, fn, false ); };
            } else if ( doc.detachEvent ) {
                return function( el, evt, fn ) { el.detachEvent( "on" + evt, fn ); };
            } else {
                return function ( el, evt, fn ) { el[ "on" + evt ] = null; };
            }
        }(),

        /**
         * @param  {String} tagName
         * @param  {Object=} attrs
         * @return {domm}
         */
        create: function ( tagName, attrs ) {
            var el = new domm.fn.init( doc.createElement( tagName ) ), key;
            if ( attrs ) {
                if ( attrs.className ) {
                    el.addClass( attrs.className );
                    delete attrs.className;
                }
                if ( attrs.html ) {
                    el.html( attrs.html );
                    delete attrs.html;
                }
                if ( attrs.text ) {
                    el.text( attrs.text );
                    delete attrs.text;
                }
                for ( key in attrs ) {
                    if ( attrs.hasOwnProperty( key ) ) {
                        el.attr( key, attrs[ key ] );
                    }
                }
            }
            return el;
        },

        /**
         * @param  {Array} ar
         * @param  {Function} fn
         * @param  {Object=} context
         * @return {Array}
         */
        map: function( ar, fn, context ) {
            return [].map.call( ar, fn, context );
        },

        /**
         * @param  {domm|Array} ar
         * @param  {Function} fn
         * @param  {Object=} context
         * @return {domm|Array}
         */
        each: function( ar, fn, context ) {
            [].forEach.call( ar, fn, context );
            return ar;
        },

        /**
         * @param  {domm|Array} target
         * @param  {Array} src
         * @return {domm|Array}
         */
        merge: function( target, src ) {
            var l = src.length, i = target.length, j = 0;
            for ( ; j < l; j++ ) {
                target[ i++ ] = src[ j ];
            }
            target.length = i;
            return target;
        },

        /**
         * @param  {domm|Array} ar
         * @return {domm|Array}
         */
        unique: function( ar ) {
            var  o = {}, r = [], i, l = ar.length;
            for ( i = 0; i < l; i++ ) o[ ar[i] ] = ar[i];
            for ( i in o ) r.push( o[i] );
            return r;
        },

        /**
         * @param  {Number} x
         * @param  {Number} y
         * @return {Object}
         */
        scroll: function( x, y ) {
            if ( typeof x !== "undefined" ) html.scrollLeft = body.scrollLeft = +x;
            if ( typeof y !== "undefined" ) html.scrollTop = body.scrollTop = +y;
            return {
                top: Math.max( win.pageYOffset, html.scrollTop, body.scrollTop ),
                left: Math.max( win.pageXOffset, html.scrollLeft, body.scrollLeft )
            }
        },

        /**
         * @param  {Number} y
         * @return {Number}
         */
        scrollTop: function( y ) {
            return this.scroll( undefined, y ).top;
        },

        /**
         * @param  {Number} y
         * @return {Number}
         */
        scrollLeft: function( x ) {
            return this.scroll( x, undefined ).left;
        },

        /**
         * @param  {String} expr
         * @param  {Number} len
         * @param  {Boolean=} isZeroBased
         * @return {Array|Null}
         */
        nthChild: function( expr, len, isZeroBased ) {
            var ret = [], match, a, b, n = 0, result = 0; len = +len;
            if ( expr === "even" ) {
                a = 2; b = 2;
            } else if ( expr === "odd" ) {
                a = 2; b = 1;
            } else {
                match = expr.match( _nthChildExpr );
                a = match[1] === undefined ? 0 :
                  +( (match[1] === "" || match[1] === "-" || match[1] === "+")
                    ? match[1].concat("1") : match[1] );
                b = match[2] === undefined && match[3] === undefined ? 0 :
                  +( match[2] || match[3] ).replace(/\s+/g, "");
            }
            while ( result < len ) {
                result = a * ( n++ ) + b;
                if ( result > 0 && result <= len ) {
                    ret.push( isZeroBased ? ( result - 1 ) : result );
                } else if ( a <= 0 ) {
                    break;
                }
            }
            return ret.length === 0 ? null : ret;
        },

        /**
         * @param  {String} node
         * @return {domm}
         */
        parseHTML: function( node ) {
            var tmp = doc.implementation.createHTMLDocument();
            if ( typeof node === "string" ) tmp.body.innerHTML = node;
            return tmp.body.children;
        },

        /**
         * @param  {Element|Node|String} node
         * @param  {Boolean=} isQuery
         * @return {Node|Array}
         */
        normalize: function( node, isQuery ) {
            if ( !node ) return [];
            return typeof node === "string" ?
              isQuery ? doc.querySelectorAll( node ) : domm.parseHTML( node ) :
                node.nodeType === 1 || node.nodeType === 11 ? [ node ] :
                  !node.nodeType && typeof node.length !== "undefined" ? node : [];
        }
    });

    /**
     * @constructor
     * @param  {Element|Node|String} selector
     */
    domm.fn.init = function( selector ) {
        selector = domm.normalize( selector, true );
        return domm.merge( this, selector );
    };
    domm.fn.init.prototype = domm.fn;

    /**
     * domm.fn methods (chainable)
     */
    domm.fn.extend({
        /**
         * @param  {Function} fn
         * @return {Array}
         */
        map: function( fn ) {
            return domm.map( this, fn );
        },

        /**
         * @param  {Function} fn
         * @return {domm}
         */
        each: function( fn ) {
            return domm.each( this, fn );
        },

        /**
         * @param  {String} evt
         * @param  {Function} fn
         * @return {domm}
         */
        on: function( evt, fn ) {
            return this.each(function( el ) {
                domm.addEvent( el, evt, fn );
            });
        },

        /**
         * @param  {String} evt
         * @param  {Function} fn
         * @return {domm}
         */
        off: function( evt, fn ) {
            return this.each(function( el ) {
                domm.removeEvent( el, evt, fn );
            });
        },

        /**
         * @param  {String} content
         * @param  {Boolean=} isText
         * @return {domm|String}
         */
        html: function( content, isText ) {
            var method = isText ? "textContent" : "innerHTML";
            if ( typeof content !== "undefined" ) {
                return this.each(function ( el ) {
                    el[ method ] = content;
                });
            } else {
                return this[ 0 ][ method ];
            }
        },

        /**
         * @param  {String} content
         * @return {domm|String}
         */
        text: function( content ) {
            return this.html( content, true );
        },

        /**
         * @param  {Object|String} prop
         * @param  {String} value
         * @return {domm|String}
         */
        css: function( prop, value ) {
            var el = this[ 0 ], key;
            if ( (typeof prop === "object") && (prop instanceof Object) ) {
                for ( key in prop ) {
                    prop.hasOwnProperty( key ) && this.css( key, prop[key] );
                }
                return this;
            }
            return typeof value === "undefined" && typeof prop === "string" ?
              !el ? null : win.getComputedStyle( el )[ prop ] :
                this.each(function( el ) {
                    el.style[ prop ] = value;
                });
        },

        /**
         * @param  {String|Object} attr
         * @param  {String} value
         * @return {domm|String|Boolean}
         */
        attr: function( attr , value ) {
            var el = this[ 0 ], prop;
            if ( (typeof attr === "object") && (attr instanceof Object) ) {
                for ( prop in attr ) {
                    attr.hasOwnProperty( prop ) && this.attr( prop, attr[prop] );
                }
                return this;
            }
            return typeof value === "undefined" && typeof attr === "string" ?
                !el ? null : _specialAttributes.test( attr ) ?
                  _stateAttributes.test( attr ) && typeof el[ attr ] == "string" ?
                    true : el[ attr ] :  el.getAttribute( attr ) :
                this.each(function( el ) {
                    _specialAttributes.test( attr ) ? el[ attr ] = value : el.setAttribute( attr, value );
                });
        },

        /**
         * @param  {String} attr
         * @return {domm}
         */
        removeAttr: function( attr ) {
            attr = attr.trim().split( _whitespace );
            return this.each(function( el ) {
                domm.each(attr, function( c ) {
                    _stateAttributes.test( c ) ? el[ c ] = false : el.removeAttribute( c );
                });
            })
        },

        /**
         * @param  {Element|Node|String} node
         * @return {domm}
         */
        append: function( node ) {
            return this.each(function( parent, i ) {
                domm.each(domm.normalize(node), function( child ) {
                    if ( i > 0 ) child = child.cloneNode( true );
                    parent.appendChild( child );
                });
            });
        },

        /**
         * @param  {Element|Node|String} node
         * @return {domm}
         */
        prepend: function( node ) {
            return this.each(function( refElem, i ) {
                var parent = refElem.parentNode;
                domm.each(domm.normalize(node), function( newElem ) {
                    if ( i > 0 ) newElem = newElem.cloneNode( true );
                    parent.insertBefore( newElem, refElem );
                });
            });
        },

        /**
         * @return {Object}
         */
        offset: function() {
            var rect, el = this[ 0 ];
            if ( !el ) return null;
            rect = el.getBoundingClientRect();
            return {
                top: Math.round( rect.top + domm.scroll().top ),
                left: Math.round( rect.left + domm.scroll().left )
            };
        },

        /**
         * @param  {Number|String} i
         * @return {domm}
         */
        item: function( i ) {
            var l = this.length, self = this,
            m = typeof i === "number" ? +i + ( i < 0 ? l : 0 ) : domm.nthChild( i, l, true ),
            n = typeof m === "object" && m instanceof Array ?
                domm.map(m, function( v ) {
                    return self[ v ];
                }) : (m >= 0 && m < l) ? [ this[m] ] : [];
            return this.stack( n );
        },

        /**
         * @return {domm}
         */
        first: function() {
            return this.item( 0 );
        },

        /**
         * @return {domm}
         */
        last: function() {
            return this.item( -1 );
        },

        /**
         * @return {domm}
         */
        end: function() {
            return this.old || this.constructor( null );
        },

        /**
         * @return {domm}
         */
        parent: function() {
            return this._relative( "parentNode" );
        },

        /**
         * @return {domm}
         */
        next: function() {
            return this._relative( "nextElementSibling" );
        },

        /**
         * @return {domm}
         */
        prev: function() {
            return this._relative( "previousElementSibling" );
        },

        /**
         * @param  {String} method
         * @return {domm}
         */
        _relative: function( method ) {
            return this.stack(domm.unique(
                this.map(function( el ) {
                    return el[ method ];
                })
            ));
        },

        /**
         * @return {domm}
         */
        empty: function() {
            this.html("");
        },

        /**
         * @return {domm}
         */
        remove: function() {
            return this.each(function( el ) {
                el.parentNode && el.parentNode.removeChild(el);
            });
        }
    });

    var _classReg = function( c ) {
        return new RegExp("(^|\\s+)" + c + "(\\s+|$)");
    };

    if ( domm.features.classList ) {
        _hasClass = function( el, c ) { return el.classList.contains( c ); };
        _addClass = function( el, c ) { el.classList.add( c ); };
        _removeClass = function( el, c ) { el.classList.remove( c ); };
        _toggleClass = function( el, c ) { el.classList.toggle( c ); };
    }
    else {
        _hasClass = function( el, c ) { return _classReg( c ).test( el.className ); };
        _addClass = function( el, c ) { el.className = ( el.className + " " + c ).trim(); };
        _removeClass = function( el, c ) { el.className = (el.className.replace( _classReg( c ), " " )).trim(); };
        _toggleClass = function( el, c ) { _hasClass( el, c ) ? _removeClass( el, c ) : _addClass( el, c ); };
    }

    domm.fn.extend({
        /**
         * @param {String} c
         * @return {domm}
         */
        addClass: function( c ) {
            c = c.trim().split( _whitespace );
            return this.each(function( el ) {
                domm.each(c, function( c ) {
                    if ( !_hasClass( el, c ) ) _addClass( el, c );
                });
            });
        },

        /**
         * @param {String} c
         * @return {domm}
         */
        removeClass: function( c ) {
            c = c.trim().split( _whitespace );
            return this.each(function( el ) {
                domm.each(c, function( c ) {
                    if ( _hasClass( el, c ) ) _removeClass( el, c );
                });
            });
        },

        /**
         * @param {String} c
         * @return {Boolean}
         */
        hasClass: function( c ) {
            var i = 0, l = this.length; c = c.trim();
            for ( ; i < l; i++ ) {
                if ( _hasClass( this[ i ], c ) ) return true;
            }
            return false;
        },

        /**
         * @param {String} c
         * @return {domm}
         */
        toggleClass: function( c ) {
            c = c.trim().split( _whitespace );
            return this.each(function( el ) {
                domm.each(c, function( c ) {
                    _toggleClass( el, c );
                });
            });
        }
    });

    if( !window.domm ) {
        window.domm = window.$ = domm;
    }
}());