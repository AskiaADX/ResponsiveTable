(function () {

   /**
   * Add event listener in DOMElement
   *
   * @param {HTMLElement} obj HTMLElement which should be listen
   * @param {String} type Type of the event to listen
   * @param {Function} fn Callback function
   */
   function addEvent(obj, type, fn) {
      if (typeof obj.addEventListener === 'function') {
         obj.addEventListener(type, fn, false);
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
   function addClass(obj, clsName) {
      if (obj.classList)
      obj.classList.add(clsName);
      else
      obj.className += ' ' + clsName;
   }

   /**
   * Remove class in DOMElement
   *
   * @param {HTMLElement} obj HTMLElement where the class should be removed
   * @param {String} clsName Name of the class to remove
   */
   function removeClass(obj, clsName) {
      if (obj.classList)
      obj.classList.remove(clsName);
      else
      obj.className = obj.className.replace(new RegExp('(^|\\b)' + clsName.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
   }

   /**
   * Manage the exclusive responses or single
   *
   * @param {HTMLElement} obj HTMLElement (input) clicked
   */
   function manageExclusive(obj) {
      var tr = obj.parentNode.parentNode;
      for (var i = 1; j = tr.children.length, i < j; i++) {
         if (obj.parentNode.className.indexOf("exclusive") >= 0 && tr.children[i].children[0] !== obj && tr.children[i].className.indexOf("selected") >= 0) {
            document.getElementById(tr.children[i].children[0].attributes.id.value).checked = false;
            removeClass(tr.children[i],'selected');
         } else if (!(obj.parentNode.className.indexOf("exclusive") >= 0) && (tr.children[i].children[0] !== obj) && (tr.children[i].className.indexOf("selected") >= 0) && (tr.children[i].className.indexOf("exclusive") >= 0)) {
            document.getElementById(tr.children[i].children[0].attributes.id.value).checked = false;
            removeClass(tr.children[i],'selected');
         }
      }

   }

   /**
   * Manage the click on the TD or INPUT
   *
   * @param {Object} event Event of the click on the TD or INPUT
   */
   function clickTable(event) {
      var el = event.target || event.srcElement;
      if (el.nodeName === "TD" && el.className.indexOf("response") >= 0) {
         document.getElementById(el.children[0].attributes.id.value).click();
      } else if (el.nodeName === "INPUT") {
         if (el.checked) {
            addClass(el.parentNode,'selected');
            manageExclusive(el);
         } else if ((!el.checked) && (el.attributes.type.value === "checkbox")) {
            removeClass(el.parentNode,'selected');
         }
         //if (el.attributes.type.value === "radio" && el.parentNode.parentNode.nextSibling.nextSibling) el.parentNode.parentNode.nextSibling.nextSibling.scrollIntoView(true);
      }
   }
    
   /**
   * Calculate the offsetTop
   *
   * @param {HTMLElements} elem HTMLElement
   */ 
   function calcOffsetTop(elem) {
       if(!elem) elem = this;
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
   function headerFix(el,opt) {
      if ( !opt.headerFixed || !Array.prototype.forEach) return;

      var offsetHeight = document.getElementById("adc_" + opt.instanceId).offsetHeight || document.getElementById("adc_" + opt.instanceId).height;
      var offsetHeightThead = document.getElementById("adc_" + opt.instanceId +"_thead").offsetHeight || document.getElementById("adc_" + opt.instanceId +"_thead").height;
      var offsetTop = calcOffsetTop(document.getElementById("adc_" + opt.instanceId));
      var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      var top = 0;
      if ((scrollTop >= offsetTop) && (scrollTop <= (offsetTop + offsetHeight - (offsetHeightThead + 10))) ) {
         top = scrollTop - (offsetTop + 2);
      } else {
         top = 0;
      }
      var translate = "translateY("+top+"px)";
      for (var i = 0; j = el.length, i < j; i++) {
         el[i].style.msTransform = translate;
         el[i].style.transition = "all 0.2s";
      }
      document.getElementById("adc_" + opt.instanceId + "_thead").style.WebkitTransform = translate;
      document.getElementById("adc_" + opt.instanceId + "_thead").style.WebkitTransition = "all 0.2s"; // Code for Safari 3.1 to 6.0
      document.getElementById("adc_" + opt.instanceId + "_thead").style.transform = translate;
      document.getElementById("adc_" + opt.instanceId + "_thead").style.transition = "all 0.2s";
   }

   /**
   * Creates a new instance of the ResponsiveTable
   *
   * @param {Object} options Options of the ResponsiveTable
   * @param {String} options.instanceId=1 Id of the ADC instance
   */
   function ResponsiveTable(options) {
      this.options = options;
      this.instanceId = options.instanceId || 1;
      this.headerFixed = options.headerFixed || 0;

      addEvent(document.getElementById("adc_" + this.instanceId), "click", clickTable);

      if (!document.querySelectorAll) return;

      var elements = document.querySelectorAll("#adc_" + options.instanceId + "_thead th");
      addEvent(window,"scroll",function(){
         headerFix(elements,options);
      });

      for (var i = 0; j = elements.length, i < j; i++) {
         elements[i].style.msTransform = "translateY(0px)";
      }

   }

   /**
   * Attach the ResponsiveTable to the window object
   */
   window.ResponsiveTable = ResponsiveTable;

}());
