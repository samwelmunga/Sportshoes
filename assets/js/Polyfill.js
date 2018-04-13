//----------------------------------------------------------------------
// Strict mode
//----------------------------------------------------------------------

"use strict";

/**
 * 
 *  Polyfill IE browser support 
 */
(function() {

    var element = document.createElement('div');

    if(!element.classList) {

        Object.defineProperty(Element.prototype, 'classList', {
            get: function() {

                var m_this = this, cls = m_this.className.split(' ');

                cls.add = function ( args ) {
                    
                    var cl  = m_this.getAttribute('class'),
                        str = '';

                    args = (typeof args == 'string') ? [args] : args;
                    
                    for(var i in args) {
                        if(cl == null) {
                            str += args[i] + ' ';
                        } else if(cl.indexOf(args[i].replace(' ', '')) < 0) {
                            cl += ' ' + args[i].replace(' ', '');
                            str = cl;
                        } else str = cl;
                    }
                    m_this.setAttribute('class', str);
                    return true;
                }

                cls.remove = function( args ) {
                    
                    var cl = m_this.getAttribute('class');
                    
                    args = (typeof args == 'string') ? [args] : args;
                    
                    if(cl == null) return true;

                    var arr = cl.split(' ');

                    for(var i in args) {
                        if(arr.indexOf(args[i]) < 0) continue;
                        if(arr.length > 1) {
                            if(arr.indexOf(args[i]) > 0)
                                cl = cl.replace(' ' + args[i], '');
                            else 
                                cl = cl.replace(args[i] + ' ', '');
                        } else {
                            cl = cl.replace(args[i], '');
                        }
                    }

                    m_this.setAttribute('class', cl);
                    return true;
                };

                /**
                 * TODO: MOST PROBABLY NEEDS FIXING, BUILD LIKE 'ADD' AND 'REMOVE'
                 */
                cls.toggle = function( x ) {
                    var b;
                    if(x) {
                        m_this.className = '';
                        b = false;
                        for (var j = 0; j<cls.length; j++) {
                            if(cls[j] != x) {
                                m_this.className += (m_this.className ? ' ' : '') + cls[j];
                                b = false;
                            } else b = true;
                        }
                        if(!b) {
                            m_this.className += (m_this.className ? ' ' : '') + x;
                        }
                    } else throw new TypeError('No arguments provided')
                    return !b;
                };

                
                cls.contains = function( x ) {
                    
                    if(x) {
                        
                        var cl = m_this.getAttribute('class');
                        
                        if(cl == null) return false;

                        return (cl.indexOf(x) > -1) ? true : false;

                    } else throw new TypeError('No arguments provided');

                };

                return cls; 
            },
            enumerable: false
        });

    };

    if(!element.addEventListener) {

        Object.defineProperty(Element.prototype, 'addEventListener', {
            get: function() {
                var m_this = this, handler; 
                
                if(!m_this.eventList) m_this.eventList = {};
                
                m_this.eventList.trigger = function( e ) {
                    if(e.currentTarget != m_this) return;

                    if(m_this.eventList[ e.type ]) {
                        m_this.eventList[ e.type ].map(function( f ) {
                            f.call( m_this, e );
                        });
                    }
                };

                if(Element.attachEvent) {
                    handler = function( type, func ) {
                        m_this.attachEvent(type, func);
                    };
                } else {
                    handler = function( type, func ) {
                        if(!m_this.eventList[ type ]) m_this.eventList[ type ] = [];
                        m_this.eventList[ type ].push(func);
                        m_this[ 'on' + type ] = m_this.eventList.trigger;
                    };
                }

                return handler;

            },
            enumerable: false
        });


        Object.defineProperty(Element.prototype, 'removeEventListener', {
            get: function() {
                var m_this = this, handler;
                
                if(Element.detachEvent) {
                    handler = function( type, func ) {
                        m_this.detachEvent(type, func);
                    };
                } else {
                    handler = function( type, func ) {
                        m_this['on' + type] = null;
                        if(m_this.eventList && m_this.eventList[ type ]) {
                            m_this.eventList[ type ].splice(m_this.eventList[ type ].indexOf(type), 1);
                        }
                    };
                }

                return handler;

            },
            enumerable: false
        });

    };

    if(!window.innerWidth) {

        window.innerWidth  = document.documentElement.clientWidth  || document.body.clientWidth;
        window.innerHeight = document.documentElement.clientHeight || document.body.clientHeight;
        
    }


})();