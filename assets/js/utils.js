/**
 * Static classes
 */

Screen = {

    get small() {
        return window.innerWidth < 650;
    },
    get medium() {
        return window.innerWidth < 950;
    }

}


Elements = {

    get slideshow_images() {
        return document.getElementsByClassName('page-top-slideshow-img');
    },

    get slideshow_paginations() {
        return document.getElementById('page-top-slideshow-paginations');
    },

    get search_section() {
        return document.getElementById('page-main-search-section');
    },
    
    get searchbar() {
        return document.getElementsByClassName('page-main-searchbar')[0];
    },

    get search_icon() {
        return document.getElementsByClassName('page-main-search-icon')[0];
    },

    get content_wrapper() {
        return document.getElementById('page-main-content-wrapper');
    },

    get preview_wrapper() {
        return document.getElementById('page-main-preview-wrapper');
    },

    toArray: function( htmlList ) {
        for(var i = 0, list = []; i < htmlList.length; list.push(htmlList[i++]));
        return list;
    }

}


Timer = {

    _timeout:  null,

    _interval: null,

    startTimeout: function( func, time ) {
        Timer.stopTimeout();
        Timer._timeout = setTimeout(func, time);
    },

    stopTimeout: function() {
        if(Timer._timeout != null) clearTimeout(Timer._timeout);
        Timer._timeout = null;
    },

    startInterval: function( func, time ) {
        Timer.stopInterval();
        Timer._interval = setInterval(func, time);
    },

    stopInterval: function() {
        if(Timer._interval != null) clearTimeout(Timer._interval);
        Timer._interval = null;
    }

}


Slide = {

    slides:  null,

    markers: [],

    page:    0,

    timer:   null,
    
    sClass:  'active-slide', 

    mClass:  'active-slide-page',

    get length() {
        return Slide.slides.length;
    },

    start: function() {

        Slide.toggleSlide();
        Slide.stop();
        Timer.startInterval(Slide.setNextSlide, 5000);

    },

    stop: function() {
        Timer.stopInterval();
    },

    setNextSlide: function(){

        Slide.toggleSlide(true);
        Slide.page++;
        if(Slide.page == Slide.slides.length) Slide.page = 0;
        Slide.toggleSlide();

    },

    toggleSlide: function( rm ) {

    var currSlide = Slide.slides[Slide.page],
        currPage  = Slide.markers[Slide.page];

        currSlide.classList.remove(Slide.sClass);
        currPage.classList.remove(Slide.mClass);

        if(rm) return;

        currSlide.classList.add(Slide.sClass);
        currPage.classList.add(Slide.mClass);

    }

}


Products = {
    
    page:     1,

    limit:    100,

    _current: [],

    set current( prod ) {
        _current = JSON.parse(prod).products;
    },

    get current() {
        return _current;
    }

}