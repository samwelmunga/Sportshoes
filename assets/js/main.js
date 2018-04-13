/**
 * 
 * ECMAScript 5 (262) for support of older browsers.
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
    
    get searchbar() {
        return document.getElementsByClassName('page-main-searchbar')[0];
    },
    get slideshow_images() {
        return document.getElementsByClassName('page-top-slideshow-img');
    },
    get slideshow_paginations() {
        return document.getElementsByClassName('page-top-slideshow-paginations')[0];
    },
    get search_section() {
        return document.getElementsByClassName('page-main-search-section')[0];
    },
    get searchbar() {
        return document.getElementsByClassName('page-main-searchbar')[0];
    },
    get search_icon() {
        return document.getElementsByClassName('page-main-search-icon')[0];
    },
    get content_wrapper() {
        return document.getElementsByClassName('page-main-content-wrapper')[0]
    }

}

Timer = {

    _timer: null,

    start: function( func, time ) {
        Timer.stop();
        Timer._timer = setTimeout(func, time);
    },

    stop: function() {
        if(Timer._timer != null) clearTimeout(Timer._timer);
        Timer._timer = null;
    }

}

Slide = {

    slides: null,

    pages: null,

    page: 0,

    timer: null,
    
    sClass: 'active-slide', 

    pClass: 'active-slide-page',

    start: function() {

        Slide.toggleSlide();
        Slide.stop();
        Slide.timer = setInterval(function(){

            Slide.toggleSlide(true);
            Slide.page++;
            if(Slide.page == Slide.slides.length) Slide.page = 0;
            Slide.toggleSlide();

        }, 5000);

    },

    stop: function() {
        if(Slide.timer != null) clearInterval(Slide.timer);
        Slide.timer = null;
    },

    toggleSlide: function( remove ) {

    var currSlide = Slide.slides[Slide.page],
        currPage  = Slide.pages[Slide.page];

        currSlide.classList.remove(Slide.sClass);
        currPage.classList.remove(Slide.pClass);

        if(remove) return;

        currSlide.classList.add(Slide.sClass);
        currPage.classList.add(Slide.pClass);

    }

}


function init() {

    initSlideshow();
    initContent();
    initSearchbar();

}


/**
 * Slideshow states
 */
function initSlideshow() {

    Slide.slides = getSlideshowElements();

    Slide.slides.map(function(elem) { 
        replaceImgTags(elem.getElementsByTagName('img')[0]); 
    });

    Slide.pages = setSlideshowPagination(Slide.slides.length);
    Slide.start();

}

/**
 * Slideshow helper functions
 */

function getSlideshowElements() {

var i = 0, 
    list = [],
    htmlList = Elements.slideshow_images;
    
    for(; i < htmlList.length; list.push(htmlList[i++]));
    return list;

}

function replaceImgTags( img ) {

var src = img.src,
    div = document.createElement('div');

    img.parentNode.replaceChild(div, img);
    div.style.backgroundImage = 'url(' + src + ')';
    div.classList.add('slideshow-img');

}

function setSlideshowPagination( length ) {

var div, 
    pages  = [],
    parent = Elements.slideshow_paginations;

    for(var i = 0; i < length; i++) {
        div = document.createElement('div');
        div.classList.add('page-top-slideshow-page');
        div.setAttribute('data-page', i);
        div.addEventListener('click', setSlide);
        parent.appendChild(div);
        pages.push(div);
    }

    return pages;
}

function setSlide() {
    
    Slide.stop();
    Slide.toggleSlide(true);
    Slide.page = this.getAttribute('data-page');
    Slide.start();

}


/**
 * Content states
 */
    
function initContent() {
    requestContent();
}

function extractContent( json ) {

var products = json.products,
    wrapper  = Elements.content_wrapper;

    wrapper.innerHTML = '';
    products.map(renderContent);

}

function renderContent( json ) {
    
var article = document.createElement('div'),
    title   = document.createElement('h1'),
    image   = document.createElement('img'),
    wrapper = Elements.content_wrapper;

    article.classList.add('page-main-content');
    title.innerHTML = json['name'];
    image.src = getContentImage(json['media_file']);
    image.alt = json['name'];

    article.appendChild(image);
    article.appendChild(title);
    wrapper.appendChild(article);

}

/**
 * Content helper functions
 */

function requestContent() {

var request,
    search  = Elements.searchbar.value,
    params  = search ? '&q=' + search : '',
    snippet = params ? '/search' : '',
    url     = 'https://webshop.wm3.se/api/v1/shop/products' + snippet + '.json?media_file=true' + params;

    if(XMLHttpRequest){
        request = new XMLHttpRequest();
    } else if (ActiveXObject){
        request = new ActiveXObject("Microsoft.XMLHTTP");
    } else{
        console.error("Denna webbläsare saknar stöd för kunna att köra denna sida."); 
        return false;
    }

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            extractContent(JSON.parse(this.responseText));
        }
    };

    request.open('GET', url, true);
    request.send();

}


function getContentImage( content ) {

    if(Screen.small) {
        return content["url_small"];
    }
    if(Screen.medium) {
        return content["url_medium"];
    }
    return content["url"];

}

/**
 * Searchbar states
 */

function initSearchbar() {

    Elements.search_icon.addEventListener('click', requestContent);
    Elements.searchbar.addEventListener('keyup', onKeyPress);
    window.addEventListener('scroll', checkSearchbarPosition);

}

function onKeyPress( e ) {

    if(e.keyCode == 13) {
        requestContent();
    } else if( e.keyCode == 37 
            || e.keyCode == 38 
            || e.keyCode == 39 
            || e.keyCode == 40) {
                return;
    } else {
        Timer.start(requestContent, 1000);
    }

}

/**
 * Searchbar helper functions
 */

function checkSearchbarPosition() {

var searchSection = Elements.search_section;

    if(!Screen.small) {
        searchSection.classList.remove('searchbar-fixed');
        return;
    }

    if(window.pageYOffset > 220) {
        searchSection.classList.add('searchbar-fixed');
    } else {
        searchSection.classList.remove('searchbar-fixed');
    }

}



window.addEventListener('load', init);