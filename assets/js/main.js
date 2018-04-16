/**
 * 
 * ECMAScript 5 (262) for support of older browsers.
 */

function init() {

    initSlideshow();
    initContent();
    initSearchbar();

}


/**
 * Slideshow states
 */
function initSlideshow() {

    Slide.slides = Elements.toArray(Elements.slideshow_images);

    Slide.slides.map(function(elem) { 
        replaceImgTags(elem.getElementsByTagName('img')[0]); 
    });
    
    setSlideshowPagination();
    
    Slide.start();

}


/**
 * Slideshow helper functions
 */
function replaceImgTags( img ) {

var src = img.src,
    div = document.createElement('div');

    img.parentNode.replaceChild(div, img);
    div.style.backgroundImage = 'url(' + src + ')';
    div.classList.add('slideshow-img');

}

function setSlideshowPagination() {

var div, 
    parent = Elements.slideshow_paginations;
    
    for(var i = 0; i < Slide.length; i++) {
        div = document.createElement('div');
        div.classList.add('page-top-slideshow-page');
        div.setAttribute('data-page', i);
        div.addEventListener('click', setSlide);
        parent.appendChild(div);
        Slide.markers.push(div);
    }

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
    Elements.preview_wrapper.classList.add('hide');
    Elements.preview_wrapper.getElementsByTagName('span')[0].addEventListener('click', closePreview);
}

function printContent() {
    
    Elements.content_wrapper.innerHTML = '';
    Products.current.map(renderContent);

}

function renderContent( json ) {
    
var article = document.createElement('div'),
    title   = document.createElement('h1'),
    image   = document.createElement('img');
    
    article.classList.add('page-main-content');
    title.innerHTML = json['name'];
    image.src = getContentImage(json['media_file']);
    image.alt = json['name'];

    article.appendChild(image);
    article.appendChild(title);
    Elements.content_wrapper.appendChild(article);

    article.addEventListener('click', showPreview);

}

function showPreview() {

var ix    = Elements.toArray(Elements.content_wrapper.children).indexOf(this),
    data  = Products.current[ix],
    prev  = Elements.preview_wrapper,
    price = Elements.pricetag;

    console.log(data);
    prev.getElementsByTagName('img')[0].src       = getContentImage(data['media_file']);;
    prev.getElementsByTagName('h1')[0].innerHTML  = data['name'];
    price.getElementsByTagName('h3')[0].innerHTML = Math.round(data['master']['current_price']['after_tax_amount']) + ':-';
    price.getElementsByTagName('b')[0].innerHTML  = Math.round(data['master']['current_price']['pre_tax_amount']) + ':- exkl. moms';

    prev.classList.remove('hide');
    
}

function closePreview() {
    Elements.preview_wrapper.classList.add('hide');
}


/**
 * Content helper functions
 */
function requestContent() {

var request,
    search  = Elements.searchbar.value,
    params  = search ? '&q=' + search : '',
    snippet = params ? '/search' : '',
    url     = 'https://webshop.wm3.se/api/v1/shop/products' + snippet + '.json?media_file=true&price=true' + params + '&limit=' + Products.limit;

    if(XMLHttpRequest){
        request = new XMLHttpRequest();
    } else if (ActiveXObject){
        request = new ActiveXObject('Microsoft.XMLHTTP');
    } else{
        console.error('Denna webbläsare saknar stöd för kunna att köra denna sida.'); 
        return false;
    }

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            Products.current = this.responseText;
            printContent();
        }
    };

    request.open('GET', url, true);
    request.send();

}


function getContentImage( content ) {

    if(Screen.small) {
        return content['url_small'];
    }
    if(Screen.medium) {
        return content['url_medium'];
    }
    return content['url'];

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
        Timer.startTimeout(requestContent, 1000);
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

/**
 * BOOTSTRAP
 */
window.addEventListener('load', init);