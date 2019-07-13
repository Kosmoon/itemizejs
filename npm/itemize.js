"use strict";function _typeof(e){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(e){return typeof e}}else{_typeof=function _typeof(e){return e&&typeof Symbol==="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e}}return _typeof(e)}function ownKeys(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){i.push.apply(i,Object.getOwnPropertySymbols(t))}if(e)i=i.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable});return i}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var i=arguments[e]!=null?arguments[e]:{};if(e%2){ownKeys(i,true).forEach(function(e){_defineProperty(t,e,i[e])})}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(t,Object.getOwnPropertyDescriptors(i))}else{ownKeys(i).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))})}}return t}function _defineProperty(e,t,i){if(t in e){Object.defineProperty(e,t,{value:i,enumerable:true,configurable:true,writable:true})}else{e[t]=i}return e}function _classCallCheck(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function _defineProperties(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||false;n.configurable=true;if("value"in n)n.writable=true;Object.defineProperty(e,n.key,n)}}function _createClass(e,t,i){if(t)_defineProperties(e.prototype,t);if(i)_defineProperties(e,i);return e}if(typeof Object.assign!="function"){Object.defineProperty(Object,"assign",{value:function assign(e,t){if(e==null){throw new TypeError("Cannot convert undefined or null to object")}var i=Object(e);for(var n=1;n<arguments.length;n++){var o=arguments[n];if(o!=null){for(var a in o){if(Object.prototype.hasOwnProperty.call(o,a)){i[a]=o[a]}}}}return i},writable:true,configurable:true})}var Itemize=function(){function Itemize(e){_classCallCheck(this,Itemize);this.containers=[];this.items=[];this.globalOptions=this.mergeOptions(e);this.notificationNbs={};this.modalDisappearTimeout=null;this.elPos={};this.flipPlayId="";this.elemToRemove=[];this.lastTargetedContainers=null;window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame}_createClass(Itemize,[{key:"apply",value:function apply(e,t){var a=this;var r=_objectSpread({},this.globalOptions);if(_typeof(e)==="object"){r=this.mergeOptions(e);e=[null]}else{e=[e]}if(t){r=this.mergeOptions(t)}var s=0;for(var i=0;i<e.length;i++){this.lastTargetedContainers=this.getTargetElements(e[i]);if(this.lastTargetedContainers&&this.lastTargetedContainers.length>0){(function(){s+=a.applyItemize(a.lastTargetedContainers,r);var o=function o(e,t){var i=1;if(e.length>0&&i<t){for(var n=0;n<e.length;n++){s+=a.applyItemize(e[n].children,r);i++;if(e.length>0&&i<t){o(e[n].children,t)}}}};o(a.lastTargetedContainers,r.nestingLevel)})()}else{console.error(" - Itemize error - \n no valid target found.\n")}}console.log("%c"+s+" element(s) itemized","background: #060606; color:#1FEA00;padding:10px");return s+" element(s) itemized"}},{key:"cancel",value:function cancel(e){var t=0;if(e){if(!Array.isArray(e)){e=[e]}for(var i=0;i<e.length;i++){this.lastTargetedContainers=this.getTargetElements(e[i]);if(this.lastTargetedContainers&&this.lastTargetedContainers.length>0){t+=this.cancelItemize(this.lastTargetedContainers)}else{console.error(" - Itemize error - \n "+e[i]+" not found.\n")}}}else{this.clearObservers();t=this.cancelItemize("all")}return t+" element(s) unitemized"}},{key:"getTargetElements",value:function getTargetElements(e){try{if(!e){return document.querySelectorAll("[itemize]")}else{return document.querySelectorAll(e)}}catch(t){console.error(t);return null}}},{key:"clearObservers",value:function clearObservers(e){if(window.itemizeObservers){for(var t=window.itemizeObservers.length-1;t>=0;t--){var i=false;if(e){if(window.itemizeObservers[t].itemizeContainerId===e){i=true}}else{i=true}if(i){window.itemizeObservers[t].disconnect();window.itemizeObservers.splice(t,1)}}}}},{key:"applyItemize",value:function applyItemize(f,p){var u=this;var v=0;var e="";try{var t=function t(e){var l=f[e];if(!l.classList.contains("itemize_remove_btn")&&l.type!=="text/css"&&l.tagName!=="BR"&&l.tagName!=="SCRIPT"&&l.tagName!=="STYLE"){var t=false;for(var i=0;i<u.containers.length;i++){if(l.itemizeContainerId&&l.itemizeContainerId===u.containers[i].itemizeContainerId){t=true;break}}if(!t){u.containers.push(l)}if(l.itemizeContainerId){u.clearObservers(l.itemizeContainerId)}var n=u.makeId(8);l.itemizeContainerId=n;for(var o=l.classList.length-1;o>=0;o--){if(l.classList[o].indexOf("itemize_parent")!==-1){l.classList.remove(l.classList[o]);break}}l.classList.add("itmz_parent");l.classList.add("itemize_parent_".concat(n));var a=_objectSpread({},u.globalOptions);if(p){a=u.mergeOptions(p)}a=u.getOptionsFromAttributes(l,a);l.itemizeOptions=a;if(l.itemizeOptions.itemizeAddedElement){var r={childList:true};var m=u;var s=function s(e,t){for(var i=0;i<e.length;i++){var n=e[i];if(n.type==="childList"&&n.addedNodes.length>0){for(var o=0;o<n.addedNodes.length;o++){var a=n.addedNodes[o];var r=true;if(a.classList){for(var s=0;s<a.classList.length;s++){if(a.classList[s].indexOf("itemize_")!==-1){r=false}}if(r){if(!a.getAttribute("notItemize")&&a.parentElement&&a.type!=="text/css"&&a.tagName!=="BR"&&a.tagName!=="SCRIPT"&&a.parentElement.itemizeContainerId&&a.tagName!=="STYLE"){if(a.parentElement.itemizeOptions&&a.parentElement.itemizeOptions.anim){a.classList.add("itemize_hide");m.itemizeChild(a,a.parentElement,true);m.flipRead(m.items);m.flipAdd(a);m.flipPlay(m.items,a.parentElement.itemizeOptions.animDuration)}else{m.itemizeChild(a,a.parentElement,true)}}if(l.itemizeOptions.onAddItem){l.itemizeOptions.onAddItem(a)}}}}}}};if(window.itemizeObservers){window.itemizeObservers.push(new MutationObserver(s))}else{window.itemizeObservers=[new MutationObserver(s)]}window.itemizeObservers[window.itemizeObservers.length-1].observe(l,r);window.itemizeObservers[window.itemizeObservers.length-1].itemizeContainerId=l.itemizeContainerId}u.applyCss(l);for(var c=0;c<l.children.length;c++){var d=l.children[c];if(u.itemizeChild(d,l)){v++}}}};for(var i=0;i<f.length;i++){t(i)}return v}catch(n){console.error(" - Itemize error - \n"+e);console.error(n)}}},{key:"childIsItemizable",value:function childIsItemizable(e,t){return e.type!=="text/css"&&typeof e.getAttribute("notItemize")!=="string"&&e.tagName!=="BR"&&e.tagName!=="SCRIPT"&&!e.itemizeItemId&&!e.itemizeBtn&&!e.classList.contains("itemize_remove_btn")&&!(t.parentNode.itemizeOptions&&e.classList.contains(t.parentNode.itemizeOptions.removeBtnClass))}},{key:"itemizeChild",value:function itemizeChild(t,i,e){var n=this;if(this.childIsItemizable(t,i)){t.itemizeItemId=this.makeId(8);this.items.push(t);if(i.itemizeItems){i.itemizeItems.push(t)}else{i.itemizeItems=[t]}t.classList.add("itemize_item_"+t.itemizeItemId);t.classList.add("itmz_item");if(!i.itemizeOptions.removeBtn){t.onclick=function(e){e.stopPropagation();if(i.itemizeOptions.modalConfirm){n.modalConfirm(t)}else{n.remove(t.itemizeItemId)}};if(i.itemizeOptions.outlineItemOnHover){this.shadowOnHover(t,false)}}else{if(!i.itemizeOptions.removeBtnClass){var o=getComputedStyle(t);if(t.style.position!=="absolute"&&t.style.position!=="fixed"&&o.position!=="absolute"&&o.position!=="fixed"){t.style.position="relative"}var a=document.createElement("div");a.classList.add("itemize_btn_"+t.itemizeItemId);a.classList.add("itemize_remove_btn");a.itemizeBtn=true;a.onclick=function(e){e.stopPropagation();if(i.itemizeOptions.modalConfirm){n.modalConfirm(t)}else{n.remove(t.itemizeItemId)}};t.appendChild(a);if(i.itemizeOptions.outlineItemOnHover){this.shadowOnHover(a,true)}}else{var r=document.querySelector(".itemize_item_"+t.itemizeItemId+" ."+i.itemizeOptions.removeBtnClass);if(!r){console.error(" - Itemize error - \n Cannot find specified button's class: "+i.itemizeOptions.removeBtnClass+"\n")}else{r.onclick=function(e){e.stopPropagation();if(i.itemizeOptions.modalConfirm){n.modalConfirm(t)}else{n.remove(t.itemizeItemId)}};if(i.itemizeOptions.outlineItemOnHover){this.shadowOnHover(r,true)}}}}if(e){this.showNotification("added",t)}return true}else{return false}}},{key:"shadowOnHover",value:function shadowOnHover(t,e){var i=null;if(e){i=t.parentElement}else{i=t}if(i){t.parentShadowStyle=i.style.boxShadow}t.onmouseenter=function(e){if(i){i.style.boxShadow="inset 0px 0px 0px 3px rgba(15,179,0,1)"}};t.onmouseleave=function(e){if(i){i.style.boxShadow=t.parentShadowStyle}}}},{key:"applyCss",value:function applyCss(e){var t=e.itemizeOptions;var i=e.querySelector(".itemize_style");if(i){i.parentNode.removeChild(i)}var n=document.createElement("style");n.classList.add("itemize_style");n.type="text/css";var o="";o+=".itemize_parent_".concat(e.itemizeContainerId," .itemize_hide{display:none}");if(t.removeBtn&&!t.removeBtnClass){var a=t.removeBtnMargin+"px";var r={top:0,right:0,bottom:"auto",left:"auto",marginTop:a,marginRight:a,marginBottom:"0px",marginLeft:"0px",transform:"none"};switch(t.removeBtnPosition){case"center-right":r.top="50%";r.marginTop="0px";r.transform="translateY(-50%)";break;case"bottom-right":r.top="auto";r.bottom=0;r.marginTop="0px";r.marginBottom=a;break;case"bottom-center":r.top="auto";r.right="auto";r.bottom=0;r.left="50%";r.marginTop="0px";r.marginRight="0px";r.marginBottom=a;r.transform="translateX(-50%)";break;case"bottom-left":r.top="auto";r.right="auto";r.bottom=0;r.left=0;r.marginTop="0px";r.marginRight="0px";r.marginBottom=a;r.marginLeft=a;break;case"center-left":r.top="50%";r.right="auto";r.left=0;r.marginTop="0px";r.marginRight="0px";r.marginLeft=a;r.transform="translateY(-50%)";break;case"top-left":r.right="auto";r.left=0;r.marginRight="0px";r.marginLeft=a;break;case"top-center":r.right="auto";r.left="50%";r.marginRight="0px";r.marginTop=a;r.transform="translateX(-50%)";break;default:break}o+=".itemize_parent_".concat(e.itemizeContainerId," .itemize_remove_btn{position:absolute;top:").concat(r.top,"!important;right:").concat(r.right,"!important;bottom:").concat(r.bottom,"!important;left:").concat(r.left,"!important;width:").concat(t.removeBtnWidth,"px!important;height:").concat(t.removeBtnWidth,"px!important;overflow:hidden;cursor:pointer;margin:").concat(r.marginTop," ").concat(r.marginRight," ").concat(r.marginBottom," ").concat(r.marginLeft,";transform:").concat(r.transform,";border-radius:").concat(t.removeBtnCircle?"50%":"0%",";background-color:").concat(t.removeBtnBgColor,"}.itemize_remove_btn:hover{background-color:").concat(t.removeBtnBgHoverColor,"}.itemize_parent_").concat(e.itemizeContainerId," .itemize_remove_btn:hover::after,.itemize_parent_").concat(e.itemizeContainerId," .itemize_remove_btn:hover::before{transition:background 150ms ease-in-out;background:").concat(t.removeBtnHoverColor,"}.itemize_parent_").concat(e.itemizeContainerId," .itemize_remove_btn::after,.itemize_parent_").concat(e.itemizeContainerId," .itemize_remove_btn::before{content:'';position:absolute;height:").concat(t.removeBtnThickness,"px;transition:background 150ms ease-in-out;width:").concat(t.removeBtnWidth/2,"px;top:50%;left:25%;margin-top:").concat(t.removeBtnThickness*.5<1?-1:-t.removeBtnThickness*.5,"px;background:").concat(t.removeBtnColor,";border-radius:").concat(t.removeBtnSharpness,"}.itemize_parent_").concat(e.itemizeContainerId," .itemize_remove_btn::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.itemize_parent_").concat(e.itemizeContainerId," .itemize_remove_btn::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}")}if(n.styleSheet){n.styleSheet.cssText=o}else{n.appendChild(document.createTextNode(o))}e.appendChild(n)}},{key:"cancelItemize",value:function cancelItemize(e){var t=0;try{var i=[];if(e==="all"){i=this.containers.splice(0)}else{i=e}for(var n=0;n<i.length;n++){var o=i[n];var a=o.querySelectorAll(".itmz_item");for(var r=0;r<a.length;r++){if(a[r].itemizeContainerId){this.clearObservers(a[r].itemizeContainerId)}if(a[r].itemizeItemId){this.cancelItemizeChild(a[r],a[r].parentNode);t++}}if(o.itemizeContainerId){this.clearObservers(o.itemizeContainerId);for(var s=o.classList.length-1;s>=0;s--){if(o.classList[s].indexOf("itemize_parent")!==-1){o.classList.remove(o.classList[s]);o.classList.remove("itmz_parent");break}}var l=o.querySelectorAll(".itmz_parent");for(var m=0;m<l.length;m++){this.cancelItemize(l[m])}o.itemizeContainerId=null;o.itemizeOptions=null;for(var c=0;c<this.containers.length;c++){if(this.containers[c]===o){this.containers.splice(c,1);break}}}}return t}catch(d){console.error(d)}}},{key:"cancelItemizeChild",value:function cancelItemizeChild(e,t){for(var i=this.items.length-1;i>=0;i--){if(this.items[i]===e){this.cleanItem(this.items[i]);this.items.splice(i,1);break}}if(!t.itemizeOptions.removeBtn){e.onclick=null}else{if(!t.itemizeOptions.removeBtnClass){var n=e.querySelector(".itemize_remove_btn");if(n){n.parentNode.removeChild(n)}}else{var o=e.querySelector("."+t.itemizeOptions.removeBtnClass);if(o){o.onclick=null}}}var a=t.querySelector(".itemize_style");if(a){a.parentNode.removeChild(a)}for(var r=e.classList.length-1;r>=0;r--){if(e.classList[r].indexOf("itemize_item_")!==-1){e.classList.remove(e.classList[r]);break}}e.itemizeItemId=null}},{key:"modalConfirm",value:function modalConfirm(e){var n=this;try{var o=150;var t=document.createElement("div");var i=document.createElement("div");var a=document.createElement("div");var r=document.createElement("div");var s=document.createElement("button");var l=document.createElement("button");var m=document.createElement("div");var c=document.querySelector("body");t.classList.add("itemize_modal_backdrop");i.classList.add("itemize_modal");a.classList.add("itemize_modal_text");s.classList.add("itemize_modal_btnConfirm");l.classList.add("itemize_modal_btnCancel");m.classList.add("itemize_modal_cross");a.textContent=e.parentElement.itemizeOptions.modalText;s.innerHTML="Yes";l.innerHTML="Cancel";r.appendChild(l);r.appendChild(s);i.appendChild(a);i.appendChild(r);i.appendChild(m);var d=function d(e,t,i){t.onclick=null;i.onclick=null;if(t.animate){t.animate([{opacity:1},{opacity:0}],{duration:o,easing:"ease-in-out",fill:"both"})}else{n.animateRAF(t,[{opacity:1}],[{opacity:0}],o)}if(i.animate){i.animate([{opacity:1,transform:"translateY(-50%) translateX(-50%)"},{opacity:0,transform:"translateY(0%) translateX(-50%)"}],{duration:o,easing:"ease-in-out",fill:"both"})}else{n.animateRAF(i,[{opacity:1,transform:{translateX:-50,translateY:-50,unit:"%"}}],[{opacity:0,transform:{translateX:-50,translateY:0,unit:"%"}}],o)}clearTimeout(n.modalDisappearTimeout);n.modalDisappearTimeout=setTimeout(function(){e.removeChild(t);e.removeChild(i)},o)};t.onclick=function(){if(!t.hiding){d(c,t,i)}t.hiding=true};l.onclick=function(){if(!l.clicked){d(c,t,i)}l.clicked=true};s.onclick=function(){if(!s.clicked){d(c,t,i);n.remove(e)}s.clicked=true};m.onclick=function(){if(!m.clicked){d(c,t,i)}m.clicked=true};Object.assign(i.style,{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",padding:"25px",background:"#FFFFFF",width:"90vw",maxWidth:"500px",borderRadius:"4px",boxSizing:"border-box",display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center",fontFamily:"helvetica",zIndex:1e8});var f=".itemize_modal_btnConfirm:hover{ background-color: #c83e34 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_btnCancel:hover{ background-color: #4a5055 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_cross {cursor:pointer;position: absolute;right: 5px;top: 5px;width: 18px;height:18px;opacity:0.3;}.itemize_modal_cross:hover{opacity:1;}.itemize_modal_cross:before,.itemize_modal_cross:after{position:absolute;left:9px;content:' ';height: 19px;width:2px;background-color:#333;}.itemize_modal_cross:before{transform:rotate(45deg);}.itemize_modal_cross:after{transform:rotate(-45deg);}";var p=document.createElement("style");if(p.styleSheet){p.styleSheet.cssText=f}else{p.appendChild(document.createTextNode(f))}i.appendChild(p);Object.assign(a.style,{marginBottom:"25px"});Object.assign(r.style,{width:"100%",display:"flex"});Object.assign(l.style,{background:"#6C757D",border:"none",padding:"10px 0 10px 0",borderTopLeftRadius:"4px",borderBottomLeftRadius:"4px",flex:"1 0 auto",cursor:"pointer",color:"#FFFFFF",transition:"background-color 0.3s ease-in-out"});Object.assign(s.style,{background:"#F94336",border:"none",padding:"10px 0 10px 0",borderTopRightRadius:"4px",borderBottomRightRadius:"4px",flex:"1 0 auto",cursor:"pointer",color:"#FFFFFF",transition:"background-color 0.3s ease-in-out"});Object.assign(t.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",background:"rgba(0, 0, 0,0.7)",zIndex:1e7});c.insertBefore(i,c.childNodes[0]);c.insertBefore(t,c.childNodes[0]);if(t.animate){t.animate([{opacity:0},{opacity:1}],{duration:300,easing:"ease-out",fill:"both"})}else{this.animateRAF(t,[{opacity:0}],[{opacity:1}],o)}if(i.animate){i.animate([{opacity:0,transform:"translateY(-100%) translateX(-50%)"},{opacity:1,transform:"translateY(-50%) translateX(-50%)"}],{duration:o,easing:"ease-in",fill:"both"})}else{this.animateRAF(i,[{opacity:0,transform:{translateX:-50,translateY:-100,unit:"%"}}],[{opacity:1,transform:{translateX:-50,translateY:-50,unit:"%"}}],o)}}catch(u){console.error(" - Itemize error - \n"+u)}}},{key:"showNotification",value:function showNotification(e,t){var o=this;if(t.parentElement.itemizeOptions.showAddNotifications&&e==="added"||t.parentElement.itemizeOptions.showRemoveNotifications&&e==="removed"){var i="";var n="";var a="";var r="";var s="";var l="";var m="";var c="";var d="-";var f=false;var p=t.parentElement.itemizeOptions.notificationTimer;var u=t.parentElement.itemizeOptions.notificationPosition;if(u==="bottom-center"){l="50%";m="100%";c="-50%"}else if(u==="bottom-right"){l="100%";m="100%";c="-100%"}else if(u==="bottom-left"){l="0%";m="100%";c="0%"}else if(u==="top-center"){l="50%";m="0%";c="-50%";d="";f=true}else if(u==="top-right"){l="100%";m="0%";c="-100%";d="";f=true}else if(u==="top-left"){l="0%";m="0%";c="0%";d="";f=true}if(e==="removed"){i="itemize_remove_notification";n="itemize_remove_notification_text";a="#BD5B5B";r="#DEADAD";s=t.parentElement.itemizeOptions.removeNotificationText}else if(e==="added"){i="itemize_add_notification";n="itemize_add_notification_text";a="#00AF66";r="#80D7B3";s=t.parentElement.itemizeOptions.addNotificationText}if(this.notificationNbs[u]){this.notificationNbs[u]++}else{this.notificationNbs[u]=1}var v=document.createElement("div");v.notificationId=this.notificationNbs[u];var h=document.createElement("div");var g=document.createElement("div");v.classList.add(i);v.classList.add("itemize_notification_"+u);g.classList.add(n);g.textContent=s;Object.assign(g.style,{boxSizing:"border-box",width:"100%",height:"100%",textAlign:"center",whiteSpace:"nowrap",padding:"10px 15px 10px 15px"});Object.assign(h.style,{background:r,width:"100%",height:"5px"});Object.assign(v.style,{boxSizing:"border-box",position:"fixed",display:"flex",flexDirection:"column",justifyContent:"center",top:m,left:l,border:"solid 1px "+r,borderRadius:"4px",transform:"translate(".concat(c,", ").concat(d).concat(this.notificationNbs[u]*100-(f?100:0),"%)"),fontFamily:"helvetica",background:a,color:"#FFFFFF",zIndex:1e8});document.querySelector("body").appendChild(v);v.appendChild(h);v.appendChild(g);if(v.animate){v.animate([{opacity:0},{opacity:1}],{duration:300,easing:"linear",fill:"both"})}else{this.animateRAF(v,[{opacity:0}],[{opacity:1}],300)}if(h.animate){h.animate([{width:"100%"},{width:"0%"}],{duration:p,easing:"linear",fill:"both"})}else{this.animateRAF(h,[{width:{value:100,unit:"%"}}],[{width:{value:0,unit:"%"}}],p)}setTimeout(function(){var e=document.querySelectorAll(".itemize_notification_"+u);for(var t=0;t<e.length;t++){if(e[t].notificationId>0){var i=parseInt("".concat(d).concat(e[t].notificationId*100-(f?100:0)));var n=parseInt("".concat(d).concat(e[t].notificationId*100-(f?100:0)-100));if(e[t].animate){e[t].animate([{transform:"translate(".concat(c,", ").concat(i,"%)")},{transform:"translate(".concat(c,", ").concat(n,"%)")}],{duration:150,easing:"ease-in-out",fill:"both"})}else{o.animateRAF(e[t],[{transform:{translateX:parseInt(c),translateY:i,unit:"%"}}],[{transform:{translateX:parseInt(c),translateY:n,unit:"%"}}],150)}e[t].notificationId--}}o.notificationNbs[u]--;setTimeout(function(){document.querySelector("body").removeChild(v)},300)},p)}}},{key:"remove",value:function remove(e){var i=this;try{var n=null;if(typeof e==="string"){for(var t=0;t<this.items.length;t++){if(this.items[t].itemizeItemId===e){n=this.items[t];n.arrayPosition=t}}if(!n){n=document.querySelector(e);if(!n||!n.itemizeItemId){throw new Error(" - Itemize error - \nNot a valid Itemize element")}for(var o=0;o<this.items.length;o++){if(this.items[o].itemizeItemId===n.itemizeItemId){n.arrayPosition=o}}}if(!n){throw new Error(" - Itemize error - \nNo item found to remove")}}else{n=e;if(!n){throw new Error(" - Itemize error - \nNo item found to remove")}if(!n.itemizeItemId){throw new Error(" - Itemize error - \nNot a valid Itemize element")}for(var a=0;a<this.items.length;a++){if(n.itemizeItemId===this.items[a].itemizeItemId){n.arrayPosition=a}}}if((n.arrayPosition||n.arrayPosition===0)&&n.parentElement&&n.parentElement.itemizeOptions){if((!n.removeStatus||n.removeStatus!=="pending")&&!n.inFlipAnim){if(n.parentElement.itemizeOptions.beforeRemove){n.removeStatus="pending";var r=n.parentElement.itemizeOptions.beforeRemove(n);if(r===undefined){throw new Error(' - Itemize error - \n The function "beforeErase" must return a Boolean or a Promise')}if(typeof r.then==="function"){var s=n.parentElement.itemizeOptions.animDuration;var l=n.onclick;n.onclick=null;r.then(function(e){if(n.parentElement.itemizeOptions.anim){var t=n.querySelector(".itemize_remove_btn");if(t){t.onclick=null}else{t=n.querySelector("."+i.globalOptions.removeBtnClass);if(t){t.onclick=null}}i.showNotification("removed",n);i.flipRead(i.items);i.flipRemove(n);i.items.splice(n.arrayPosition,1)}else{i.showNotification("removed",n);n.removeStatus=null;n.parentNode.removeChild(n);i.cleanItem(n);i.items.splice(n.arrayPosition,1)}})["catch"](function(e){console.log(e);n.onclick=l;n.removeStatus=null})}else if(r){if(n.parentElement.itemizeOptions.anim){var m=n.parentElement.itemizeOptions.animDuration;var c=n.querySelector(".itemize_remove_btn");n.onclick=null;if(c){c.onclick=null}else{c=n.querySelector("."+this.globalOptions.removeBtnClass);if(c){c.onclick=null}}this.showNotification("removed",n);this.flipRead(this.items);this.flipRemove(n);this.items.splice(n.arrayPosition,1)}else{this.showNotification("removed",n);n.removeStatus=null;n.parentNode.removeChild(n);this.items.splice(n.arrayPosition,1);this.cleanItem(n)}}}else{if(n.parentElement.itemizeOptions.anim){var d=n.parentElement.itemizeOptions.animDuration;var f=n.querySelector(".itemize_remove_btn");if(f){f.onclick=null}else{f=n.querySelector("."+this.globalOptions.removeBtnClass);if(f){f.onclick=null}}this.showNotification("removed",n);this.flipRead(this.items);this.flipRemove(n);this.items.splice(n.arrayPosition,1)}else{this.showNotification("removed",n);n.removeStatus=null;n.parentNode.removeChild(n);this.cleanItem(n);this.items.splice(n.arrayPosition,1)}}}}else{throw new Error(" - Itemize error - \n this element has an invalid itemizeItemId")}}catch(p){console.error(" - Itemize error - \n"+p)}}},{key:"cleanItem",value:function cleanItem(e){for(var t=0;t<e.classList.length;t++){e.classList.remove("itmz_item");if(e.classList[t].indexOf("itemize_item_")!==-1){e.classList.remove(e.classList[t]);break}}if(e.parentNode&&e.parentNode.itemizeItems){for(var i=0;i<e.parentNode.itemizeItems.length;i++){if(e.parentNode.itemizeItems[i].itemizeItemId===e.itemizeItemId){e.parentNode.itemizeItems.splice(i,1);break}}}if(e.parentNode&&e.parentNode.itemizeOptions&&e.parentNode.itemizeOptions.removeBtnClass){var n=e.querySelector("."+e.parentNode.itemizeOptions.removeBtnClass);if(n){n.parentNode.removeChild(n)}}else{var o=e.querySelector(".itemize_remove_btn");if(o){o.parentNode.removeChild(o)}}if(e.itemizeContainerId){this.clearObservers(e.itemizeContainerId);var a=e.querySelectorAll(".itmz_parent");this.cancelItemize(a);for(var r=0;r<a.length;r++){if(a[r].itemizeContainerId){this.clearObservers(a[r].itemizeContainerId)}}if(e.classList.contains("itmz_parent")){this.cancelItemize([e])}}e.itemizeItemId=null}},{key:"animateRAF",value:function animateRAF(o,a,r,s){for(var e=0;e<a.length;e++){for(var t in a[e]){if(a[e].hasOwnProperty(t)){if(t==="transform"){o.style.transform="translateX(".concat(a[e][t].translateX).concat(a[e][t].unit,") translateY(").concat(a[e][t].translateY).concat(a[e][t].unit,")")}else if(t==="opacity"){o.style.opacity=a[e][t]}else{o.style[t]="".concat(a[e][t].value).concat(a[e][t].unit)}}}}function anim(e){var t;if(!o.startAnimTime){o.startAnimTime=e;o.animTicks=0}t=e-o.startAnimTime;for(var i=0;i<r.length;i++){for(var n in r[i]){if(r[i].hasOwnProperty(n)){if(n==="transform"){o.style.transform="translateX(".concat(a[i][n].translateX-(a[i][n].translateX-r[i][n].translateX)/(s*60/1e3)*o.animTicks).concat(r[i][n].unit,") translateY(").concat(a[i][n].translateY-(a[i][n].translateY-r[i][n].translateY)/(s*60/1e3)*o.animTicks).concat(r[i][n].unit,")")}else if(n==="opacity"){o.style.opacity=a[i][n]-(a[i][n]-r[i][n])/(s*60/1e3)*o.animTicks}else{o.style[n]="".concat(a[i][n].value-(a[i][n].value-r[i][n].value)/(s*60/1e3)*o.animTicks).concat(r[i][n].unit)}}}}if(t<s-1){o.animTicks++;requestAnimationFrame(anim)}else{o.startAnimTime=null;o.animTicks=0}}requestAnimationFrame(anim)}},{key:"flipRemove",value:function flipRemove(t){var i=this;t.onclick=null;var n=t.parentElement.itemizeOptions;if(t.animate){t.animate([{transform:"translate(0px, 0px)",opacity:1},{transform:"translate(".concat(n.animRemoveTranslateX,"px, ").concat(n.animRemoveTranslateY,"px)"),opacity:0}],{duration:n.animDuration*.5,easing:n.animEasing,fill:"both"})}else{this.animateRAF(t,[{opacity:1},{transform:{translateX:0,translateY:0,unit:"px"}}],[{opacity:0},{transform:{translateX:n.animRemoveTranslateX,translateY:n.animRemoveTranslateY,unit:"px"}}],n.animDuration*.5)}var o=this.makeId(6);this.flipPlayId=o;setTimeout(function(){i.elemToRemove.push(t);if(i.flipPlayId===o){i.flipRead(i.items);for(var e=0;e<i.elemToRemove.length;e++){i.cleanItem(i.elemToRemove[e]);i.elemToRemove[e].removeStatus=null;i.elemToRemove[e].parentNode.removeChild(i.elemToRemove[e])}i.elemToRemove=[];i.flipPlay(i.items,n.animDuration*.5)}},n.animDuration*.5)}},{key:"flipAdd",value:function flipAdd(e){e.classList.remove("itemize_hide");e.inAddAnim=true;var t=e.parentElement.itemizeOptions;var i=t.animAddTranslateX;var n=t.animAddTranslateY;if(e.animate){e.animate([{transform:"translate(".concat(i,"px, ").concat(n,"px)"),opacity:0},{transform:"none",opacity:1}],{duration:t.animDuration,easing:t.animEasing})}else{this.animateRAF(e,[{opacity:0},{transform:{translateX:i,translateY:n,unit:"px"}}],[{opacity:1},{transform:{translateX:0,translateY:0,unit:"px"}}],t.animDuration)}setTimeout(function(){e.inAddAnim=false;e.newAddPos=null;e.oldPos=null;e.style.transform="none";e.style.opacity=1},t.animDuration)}},{key:"flipRead",value:function flipRead(e){for(var t=0;t<e.length;t++){this.elPos[e[t].itemizeItemId]=e[t].getBoundingClientRect()}}},{key:"flipPlay",value:function flipPlay(l,m){var c=this;var e=function e(e){var t=l[e];if(!t.inAddAnim&&t.parentNode&&t.parentNode.itemizeOptions){var i=t.getBoundingClientRect();var n=c.elPos[t.itemizeItemId];var o=n.left-i.left;var a=n.top-i.top;var r=n.width/i.width;var s=n.height/i.height;if(isNaN(r)||r===Infinity){r=1}if(isNaN(s)||s===Infinity){s=1}if(o!==0||a!==0||r!==1||s!==1){t.inFlipAnim=true;if(t.animate){t.animate([{transform:"translate(".concat(o,"px, ").concat(a,"px)")},{transform:"none"}],{duration:m,easing:t.parentNode.itemizeOptions.animEasing})}else{c.animateRAF(t,[{transform:{translateX:o,translateY:a,unit:"px"}}],[{transform:{translateX:0,translateY:0,unit:"px"}}],m)}setTimeout(function(){if(t){t.style.transform="none";t.inFlipAnim=false}},m)}}};for(var t=0;t<l.length;t++){e(t)}}},{key:"mergeOptions",value:function mergeOptions(e){try{var t={removeBtn:true,removeBtnWidth:20,removeBtnThickness:2,removeBtnColor:"#565C67",removeBtnHoverColor:"#ffffff",removeBtnSharpness:"0px",removeBtnPosition:"top-right",removeBtnMargin:2,removeBtnCircle:true,removeBtnBgColor:"rgba(209, 207, 207, 0.569)",removeBtnBgHoverColor:"#959595",removeBtnClass:null,modalConfirm:false,modalText:"Are you sure to remove this item?",removeNotificationText:"Item removed",addNotificationText:"Item added",showRemoveNotifications:false,showAddNotifications:false,notificationPosition:"bottom-right",notificationTimer:4e3,anim:true,animEasing:"ease-in-out",animDuration:500,animRemoveTranslateX:0,animRemoveTranslateY:-100,animAddTranslateX:0,animAddTranslateY:-100,beforeRemove:null,outlineItemOnHover:false,nestingLevel:1,itemizeAddedElement:true,onAddItem:null};if(this.globalOptions){t=_objectSpread({},this.globalOptions)}var i=_objectSpread({},t,{},e);return i}catch(n){console.error(n)}}},{key:"getOptionsFromAttributes",value:function getOptionsFromAttributes(e,t){var i=["removeBtnWidth","removeBtnThickness","removeBtnMargin","nestingLevel","animDuration","animRemoveTranslateX","animRemoveTranslateY","animAddTranslateX","animAddTranslateY","removeBtnThickness","notificationTimer"];for(var n in t){if(t.hasOwnProperty(n)){if(e.getAttribute(n)){if(e.getAttribute(n)==="false"){t[n]=false}else if(e.getAttribute(n)==="true"){t[n]=true}else if(i.indexOf(n)!==-1){if(!isNaN(parseInt(e.getAttribute(n)))){t[n]=parseInt(e.getAttribute(n))}}else{t[n]=e.getAttribute(n)}}}}return t}},{key:"makeId",value:function makeId(e){var t="";var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";var n=i.length;for(var o=0;o<e;o++){t+=i.charAt(Math.floor(Math.random()*n))}return t}}]);return Itemize}();try{module.exports=Itemize}catch(_unused){}