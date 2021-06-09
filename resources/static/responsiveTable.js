(function () {
  var msEdgeMatch = /Edge\/([0-9]+)/i.exec(navigator.userAgent);
  if (msEdgeMatch) document.documentMode = parseInt(msEdgeMatch[1]);
})();
(function () {

  // prevent scrolling down the page when spacebar hits
  window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target.tagName.toUpperCase() != 'INPUT') {
      e.preventDefault();
    }
  });

  /**
   * Add event listener in DOMElement
   *
   * @param {HTMLElement} obj HTMLElement which should be listen
   * @param {String} type Type of the event to listen
   * @param {Function} fn Callback function
   */
  function addEvent (obj, type, fn) {
    if (typeof obj.addEventListener === 'function') {
      obj.addEventListener(type, fn, true);
    } else if (obj.attachEvent) {
      obj['e' + type + fn] = fn;
      obj[type + fn] = function () {
        obj['e' + type + fn].call(obj, window.event);
      }
      obj.attachEvent('on' + type, obj[type + fn]);
    }
  }

  /**
   * Add class in DOMElement
   *
   * @param {HTMLElement} obj HTMLElement where the class should be added
   * @param {String} clsName Name of the class to add
   */
  function addClass (obj, clsName) {
    if (obj.classList)      {
      obj.classList.add(clsName);
    }    else            {
      obj.className += ' ' + clsName;
    }
  }

  /**
   * Remove class in DOMElement
   *
   * @param {HTMLElement} obj HTMLElement where the class should be removed
   * @param {String} clsName Name of the class to remove
   */
  function removeClass (obj, clsName) {
    if (obj.classList)      {
      obj.classList.remove(clsName);
    }    else            {
      obj.className = obj.className.replace(new RegExp('(^|\\b)' + clsName.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  /**
   * Manage the exclusive responses or single
   *
   * @param {HTMLElement} obj HTMLElement (input) clicked
   */
  function manageExclusive (obj) {
    var tr = obj.parentNode.parentNode;
    var result = [];
    for (var i = 1; j = tr.children.length, i < j; i++) {
      if (obj.parentNode.className.indexOf('exclusive') >= 0 && tr.children[i].children[0] !== obj && tr.children[i].className.indexOf('selected') >= 0) {
        document.getElementById(tr.children[i].children[0].attributes.id.value).checked = false;
        removeClass(tr.children[i], 'selected');
        if(tr.children[i].lastElementChild.tagName == "DIV"){
          tr.children[i].lastElementChild.children[0].style.display = "none";
        }
      } else if (!(obj.parentNode.className.indexOf('exclusive') >= 0) && (tr.children[i].children[0] !== obj) && (tr.children[i].className.indexOf('selected') >= 0) && (tr.children[i].className.indexOf('exclusive') >= 0)) {
        document.getElementById(tr.children[i].children[0].attributes.id.value).checked = false;
        removeClass(tr.children[i], 'selected');
        if(tr.children[i].lastElementChild.tagName == "DIV"){
          tr.children[i].lastElementChild.children[0].style.display = "none";
        }
      }
      if (tr.children[i].className.indexOf('selected') >= 0) {
          result.push(tr.children[i].children[2].textContent);
          //result.push(tr.children[i].children[2].outerText);
      }
    }
	tr.children[0].querySelector('.respaccordion').innerHTML =  result.join("; ");
  }


  /**
   * Manage the click on the TD or INPUT
   *
   * @param {Object} event Event of the click on the TD or INPUT
   */
  function clickTable (event, that) {
    var el = event.target || event.srcElement;
    if (el.className.indexOf('headerRow') >= 0) {
      $(that).next().toggle();
    }
    if (el.nodeName === 'TD' && el.className.indexOf('response') >= 0) {
      if (el.lastElementChild.tagName == 'LABEL') {
        document.getElementById(el.lastElementChild.attributes.for.value).click();
      } else {
        // el.lastElementChild.children[0].style.display = "";
        document.getElementById(el.children[2].attributes.for.value).click();
      }
    } else if (el.nodeName === 'IMG' && el.parentNode.parentNode.className.indexOf('response') >= 0) {
  		event.preventDefault();
  		event.stopPropagation();
  		document.getElementById(el.parentNode.parentNode.lastElementChild.attributes.for.value).click();
    } else if (el.nodeName === 'INPUT') {
      if (el.checked) {
        addClass(el.parentNode, 'selected');
        manageExclusive(el);
        if (el.parentElement.lastElementChild.children[0]) {
          el.parentElement.lastElementChild.children[0].style.display = "block";
        }
      } else if ((!el.checked) && (el.attributes.type.value === 'checkbox')) {
        removeClass(el.parentNode, 'selected');
        manageExclusive(el);
        if (el.parentElement.lastElementChild.children[0]) {
          el.parentElement.lastElementChild.children[0].style.display = "none";
        }
      }
      if (that.accordion && window.innerWidth < that.responsiveWidth ) {
          if(el.classList.contains('otherText')) {
              addClass(el.parentNode.parentNode, 'selected');
              el.addEventListener("keydown", function() {
                displayCheckmark(that.instanceId);
              });
          } else {
            if (el.parentNode.lastElementChild.nodeName != 'DIV') {
              setTimeout(function (){
                if (el.classList.contains('askia-exclusive')) {
                  displayNext(that.instanceId);
                }
                displayCheckmark(that.instanceId);
              }, 150);
            }
          }
      }
      if (window.askia &&
                window.arrLiveRoutingShortcut &&
                window.arrLiveRoutingShortcut.length > 0 &&
                window.arrLiveRoutingShortcut.indexOf(that.currentQuestion) >= 0) {
        askia.triggerAnswer();
      }
    }
  }

  /**
   * Calculate the offsetTop
   *
   * @param {HTMLElements} elem HTMLElement
   */
  function calcOffsetTop (elem) {
    if (!elem) elem = this;
    var y = elem.offsetTop;
    while (elem = elem.offsetParent) {
      y += elem.offsetTop;
    }
    return y;
  }

  /**
   * Make the header always visible and fixed when scrolling
   *
   * @param {HTMLElements} el HTMLElement which should be always visible - the header
   * @param {Object} options Options of the ResponsiveTable
   */
  function headerFix (el, opt) {
    if ( !opt.headerFixed || !Array.prototype.forEach) return;

    var offsetHeight = document.getElementById('adc_' + opt.instanceId).offsetHeight || document.getElementById('adc_' + opt.instanceId).height;
    var offsetHeightThead = document.getElementById('adc_' + opt.instanceId + '_thead').offsetHeight || document.getElementById('adc_' + opt.instanceId + '_thead').height;
    var offsetTop = calcOffsetTop(document.getElementById('adc_' + opt.instanceId));
    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var top = 0;
    if ((scrollTop >= offsetTop) && (scrollTop <= (offsetTop + offsetHeight - (offsetHeightThead + 10))) ) {
      top = scrollTop - (offsetTop + 2);
    } else {
      top = 0;
    }
    var translate = 'translateY(' + top + 'px)';
        //if ((/MSIE 10/i.test(navigator.userAgent)) || (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) || (/Edge\/\d./i.test(navigator.userAgent))) {
    for (var i = 0; j = el.length, i < j; i++) {
      if (document.documentMode < 12) {
        el[i].style.msTransform = translate;
      } else {
        el[i].style.WebkitTransform = translate;
        el[i].style.WebkitTransition = 'all 0.2s';
        el[i].style.MozTransform = translate;
        el[i].style.MozTransition = 'all 0.2s';
        el[i].style.transform = translate;
        el[i].style.transition = 'all 0.2s';
      }
    }
  }

  function simplboxConstructorCall (strId) {
    var preLoadIconOn = function () {
        var newE = document.createElement('div');
        var newB = document.createElement('div');
        newE.setAttribute('id', 'simplbox-loading');
        newE.appendChild(newB);
        document.body.appendChild(newE);
      },
      preLoadIconOff = function () {
        var elE = document.getElementById('simplbox-loading');
        elE.parentNode.removeChild(elE);
      },
      overlayOn = function () {
        var newA = document.createElement('div');
        newA.setAttribute('id', 'simplbox-overlay');
        document.body.appendChild(newA);
      },
      overlayOff = function () {
        var elA = document.getElementById('simplbox-overlay');
        elA.parentNode.removeChild(elA);
      };
    var img = new SimplBox(document.querySelectorAll('[data-simplbox=\'' + strId + '\']'), {
      quitOnImageClick: true,
      quitOnDocumentClick: false,
      onStart: overlayOn,
      onEnd: overlayOff,
      onImageLoadStart: preLoadIconOn,
      onImageLoadEnd: preLoadIconOff
    });
    img.init();
  }

    /**
     * When the display change
     */
  function changeDisplay (that) {
    if (that.currentWidth === window.innerWidth) return;
    if (that.accordion && window.innerWidth > that.responsiveWidth) {
      showResponses(that.instanceId);
      var current = document.querySelector('#adc_' + that.instanceId + ' .active');
      if (current) {
        current.classList.remove('active');
      }
    }
    if (that.accordion && window.innerWidth <= that.responsiveWidth){
      hideResponses(that.instanceId);
      if (findFirstEmptyRow(that.instanceId) !== null) {
        displayRow(findFirstEmptyRow(that.instanceId));
        if (findFirstEmptyRow(that.instanceId).querySelector('.askiadisplay') !== null) {
          findFirstEmptyRow(that.instanceId).querySelector('.askiadisplay').classList.add('active');
        }
      }
    }
    that.currentWidth = window.innerWidth;
  }

    /**
     * Show all responses of the page
     */
  function showResponses (instanceId) {
    var responses = document.querySelectorAll('#adc_' + instanceId + ' .response');
    for (var i = 0, l = responses.length; i < l; i++) {
      responses[i].style.display = '';
    }
  }

    /**
     * if an answer is selected in the question, display the checkmark
     */
  function displayCheckmark (instanceId) {
    var rows = document.querySelectorAll('#adc_' + instanceId + ' .askiarow');
    var responses;
    var hasSelected;
    var row;
    var display;
    for (var i = 0, l = rows.length; i < l; i++) {
      row = rows[i];
      display = row.querySelector('.askiadisplay');
      responses = row.querySelectorAll('.response');
      hasSelected = false;
      for (var j = 0, m = responses.length; j < m; j++) {
        if (responses[j].classList.contains('selected')) {
          hasSelected = true;
          display.classList.add('checkmark');
          break;
        }
      }
      if (typeof(display) === "undefined" | display === null) {
        //
      }else{
        if (!hasSelected && display.classList.contains('checkmark')) {
          display.classList.remove('checkmark');
        }
      }
    }
  }

    /**
     * Hide all responses of the page
     */
  function hideResponses (instanceId) {
    var responses = document.querySelectorAll('#adc_' + instanceId + ' .response');
    for (var i = 0, l = responses.length; i < l; i++) {
      responses[i].style.display = 'none';
    }
  }

    /**
     * Find the first empty row
     */
  function findFirstEmptyRow (instanceId) {
      var trs = document.querySelectorAll('#adc_' + instanceId + ' .askiarow');
      var tds
      var containSelected = false;
      for (var i = 0, j = trs.length; i < j; i++) {
          tds = trs[i].children;
          containSelected = false;
          for (var k = 0, l = tds.length; k < l; k++) {
          	if (tds[k].classList.contains('selected')) {
                containSelected = true;
                break;
            }
          }
          if (containSelected === false) {
              return trs[i];
          }
      }
      return null;
  }

    /**
     * Show all responses of a row
     */
  function displayRow (tr) {
    if (!tr.classList.contains('headerRow')) {
      tr.querySelector('.askiadisplay').classList.add('active');
      var responses = tr.querySelectorAll('.response');
      for (var i = 0, l = responses.length; i < l; i++) {
        responses[i].style.display = '';
        if(responses[i].querySelector('.otherText')) {
          if (!responses[i].classList.contains('selected')) {
            responses[i].querySelector('.otherText').style.display = 'none'
          }
        }
      }
    }
  }

    /**
     * Display the next row
     */
  function displayNext (instanceId) {
    hideResponses(instanceId);
    var current = document.querySelector('#adc_' + instanceId + ' .active');
    if (!current) return;
    var nextElems = current.parentElement.parentElement.parentElement.children;
    var index = -1
    for (var i = 0, j = nextElems.length; i < j; i++) {
      if (typeof(nextElems[i].children[0].children[0]) !== "undefined") {
        if (!nextElems[i].children[0].children[0].classList.contains('checkmark') && !nextElems[i].children[0].children[0].classList.contains('active')) {
            index = i;
            break;
        }
      }
    }
    if (nextElems[index] && index !== -1) {
      displayRow(nextElems[index]);
    }

    if (current) {
      current.classList.remove('active');
    }
  }

  /**
   * Display the next row without hiding responses
   */
function displayNext2 (instanceId) {
  // hideResponses(instanceId);
  var current = document.querySelector('#adc_' + instanceId + ' .active');
  if (!current) return;
  var nextElems = current.parentElement.parentElement.parentElement.children;
  var index = -1
  for (var i = 0, j = nextElems.length; i < j; i++) {
    if (typeof(nextElems[i].children[0].children[0]) !== "undefined") {
      if (!nextElems[i].children[0].children[0].classList.contains('checkmark') && !nextElems[i].children[0].children[0].classList.contains('active')) {
          index = i;
          break;
      }
    }
  }
  if (nextElems[index] && index !== -1) {
    displayRow(nextElems[index]);
  }

  if (current) {
    current.classList.remove('active');
  }
}

    /**
     * Manage the accordion click on the headers on responsive mode
     *
     * @param {Object} event Event of the click on the A or IMG
     */
  function accordion (event, that) {
    var el = event.target || event.srcElement;
    var self;
    if (el.nodeName === 'A' && el.className.indexOf('display') >= 0) {
      self = el;
    } else if (((el.nodeName === 'IMG' || el.nodeName === 'SPAN') && el.parentNode.className.indexOf('display') >= 0) || (el.nodeName === 'DIV' &&  el.className.indexOf('respaccordion') >= 0 )) {
      self = el.parentNode;
    } else {
      return;
    }
    if (window.innerWidth > that.responsiveWidth) {
      return;
    }
    hideResponses(that.instanceId);
    var tr    = self.parentNode.parentNode;
    var current = document.querySelector('#adc_' + that.instanceId + ' .active');

    if (self.classList.contains('active')) {
      self.classList.remove('active');
    } else {
      if (current) {
        current.classList.remove('active');
      }
      displayRow(tr);
    }
  }


    /**
     * Creates a new instance of the ResponsiveTable
     *
     * @param {Object} options Options of the ResponsiveTable
     * @param {String} options.instanceId=1 Id of the ADC instance
     */
  function ResponsiveTable (options) {
    this.options = options;
    this.instanceId = options.instanceId || 1;
    this.headerFixed = options.headerFixed || 0;
    this.currentQuestion = options.currentQuestion || '';
    this.accordion = options.accordion;
    this.responsiveWidth = parseInt(options.responsiveWidth);
    this.type = options.type || 'single';
    this.arrows = document.querySelectorAll('#adc_' + this.instanceId + ' .askiadisplay');
    this.currentWidth = window.innerWidth;

    // otherTextItems =  [].slice.call(container.getElementsByClassName('otherText'));

    var expandableHeaders = options.expandableHeaders
    var accordionInitialState = options.accordionInitialState
    if(expandableHeaders){
      var headerRows = document.querySelectorAll('#adc_' + this.instanceId + ' .headerRow');
      for (var i = 0; i < headerRows.length; i++) {
        if (accordionInitialState == 'collapsed') {
          var index = $(headerRows[i]).attr("data-id");
          var headerChildren = document.querySelectorAll(".headerchild"+index);
          for (var j = 0; j < headerChildren.length; j++) {
            $(headerChildren[j]).toggle();
          }
        }
        headerRows[i].onclick = function(){
          var index = $(this).attr("data-id");
          var headerChildren = document.querySelectorAll(".headerchild"+index);
          for (var j = 0; j < headerChildren.length; j++) {
            $(headerChildren[j]).toggle();
          }
          $("i", this).toggleClass("plus minus");
        }
      }
    }

    var otherElems = document.querySelectorAll('#adc_' + this.instanceId + ' .otherText');
    for ( i = 0; i < otherElems.length; i++ ) {
      if (!otherElems[i].parentNode.parentNode.classList.contains('selected')) {
        otherElems[i].style.display = "none";
      } else {
        otherElems[i].style.display = "block";
      }
    }

    addEvent(document.getElementById('adc_' + this.instanceId), 'click',
                 (function (passedInElement) {
                   return function (e) {
                     clickTable(e, passedInElement);
                   };
                 }(this)));

     addEvent(document.getElementById('adc_' + this.instanceId), 'keyup',
                  (function (passedInElement) {
                    return function (e) {
                      if (e.keyCode == 32) {
                        clickTable(e, passedInElement);
                      }
                    };
                  }(this)));

    addEvent(document.getElementById('adc_' + this.instanceId), 'click',
                 (function (passedInElement) {
                   return function (e) {
                     accordion(e, passedInElement);
                   };
                 }(this)));

    addEvent(window, 'resize',
                 (function (passedInElement) {
                   return function () {
                     changeDisplay(passedInElement);
                   };
                 }(this)));

    if (!document.querySelectorAll) return;

    var elements = document.querySelectorAll('#adc_' + options.instanceId + '_thead th');
    addEvent(window, 'scroll', function (){
      headerFix(elements, options);
    });

    for (var i = 0; j = elements.length, i < j; i++) {
      elements[i].style.msTransform = 'translateY(0px)';
      elements[i].style.WebkitTransform = 'translateY(0px)';
      elements[i].style.MozTransform = 'translateY(0px)';
      elements[i].style.transform = 'translateY(0px)';
    }

    var zooms = document.getElementById('adc_' + this.instanceId).querySelectorAll('tbody tr');
    for (var l1 = 0, k1 = zooms.length; l1 < k1; l1++) {
      simplboxConstructorCall(zooms[l1].getAttribute('data-id'));
    }

    var responseszooms = document.getElementById('adc_' + this.instanceId).querySelectorAll('.responsesitems img');
    for (var l2 = 0, k2 = responseszooms.length; l2 < k2; l2++) {
      simplboxConstructorCall(responseszooms[l2].getAttribute('data-id'));
    }
    if (this.accordion && window.innerWidth < this.responsiveWidth){

      var otherloopElems = document.querySelectorAll('#adc_' + this.instanceId + ' .otherLoopText');
      for ( i = 0; i < otherloopElems.length; i++ ) {
          otherloopElems[i].parentElement.style.padding = "10px";
      }

      hideResponses(this.instanceId);
      displayCheckmark(this.instanceId);
      if (findFirstEmptyRow(this.instanceId) !== null) {
        displayRow(findFirstEmptyRow(this.instanceId));
        if (findFirstEmptyRow(this.instanceId).querySelector('.askiadisplay') !== null) {
          findFirstEmptyRow(this.instanceId).querySelector('.askiadisplay').classList.add('active');
        }
      }
    }
  }

    /**
     * Attach the ResponsiveTable to the window object
     */
  window.ResponsiveTable = ResponsiveTable;

}());
