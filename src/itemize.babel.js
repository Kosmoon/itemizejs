"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
 -- itemize.js v0.45--
 -- (c) 2019 Kosmoon Studio --
 -- Released under the MIT license --
 */
var Itemize =
/*#__PURE__*/
function () {
  function Itemize(options) {
    _classCallCheck(this, Itemize);

    this.containers = [];
    this.items = [];
    this.globalOptions = this.mergeOptions(options);
    this.alertNb = 0;
    this.modalDisappearTimeout = null;
    this.elPos = {};
    this.lastTargetedContainers = null;
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; // let optionCheckResult = this.optionsTypeCheck(this.globalOptions);
    // if (optionCheckResult !== "valid") {
    //   console.error("- Itemize - TYPE error:\n" + optionCheckResult);
    // }
  }

  _createClass(Itemize, [{
    key: "apply",
    value: function apply(target, options) {
      var _this = this;

      var opts = _objectSpread({}, this.globalOptions);

      if (_typeof(target) === "object") {
        opts = this.mergeOptions(target);
        target = [null];
      } else if (options) {
        opts = this.mergeOptions(options);
      }

      if (!Array.isArray(target)) {
        target = [target];
      }

      var childItemizedNb = 0;

      for (var i = 0; i < target.length; i++) {
        this.lastTargetedContainers = this.getTargetElements(target[i]);

        if (this.lastTargetedContainers && this.lastTargetedContainers.length > 0) {
          (function () {
            childItemizedNb += _this.applyItemize(_this.lastTargetedContainers, opts);

            var nestingApply = function nestingApply(containers, nestingLevel) {
              var nestingNb = 1;

              if (containers.length > 0 && nestingNb < nestingLevel) {
                for (var _i = 0; _i < containers.length; _i++) {
                  childItemizedNb += _this.applyItemize(containers[_i].children, opts);
                  nestingNb++;

                  if (containers.length > 0 && nestingNb < nestingLevel) {
                    nestingApply(containers[_i].children, nestingLevel);
                  }
                }
              }
            };

            nestingApply(_this.lastTargetedContainers, opts.nestingLevel);
          })();
        } else {
          console.error(" - Itemize error - \n no valid target found.\n");
        }
      }

      console.log("%c" + childItemizedNb + " element(s) itemized", "background: #060606; color:#1FEA00;padding:10px");
      return childItemizedNb + " element(s) itemized";
    }
  }, {
    key: "cancel",
    value: function cancel(target) {
      var unItemizedNb = 0;

      if (target) {
        if (!Array.isArray(target)) {
          target = [target];
        }

        for (var i = 0; i < target.length; i++) {
          this.lastTargetedContainers = this.getTargetElements(target[i]);

          if (this.lastTargetedContainers && this.lastTargetedContainers.length > 0) {
            unItemizedNb += this.cancelItemize(this.lastTargetedContainers);
          } else {
            console.error(" - Itemize error - \n " + target[i] + " not found.\n");
          }
        }
      } else {
        this.clearObservers();
        unItemizedNb = this.cancelItemize("all");
      }

      return unItemizedNb + " element(s) unitemized";
    }
  }, {
    key: "getTargetElements",
    value: function getTargetElements(target) {
      try {
        if (!target) {
          return document.querySelectorAll("[itemize]");
        } else {
          return document.querySelectorAll(target);
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }, {
    key: "clearObservers",
    value: function clearObservers(parentId) {
      if (window.itemizeObservers) {
        for (var i = window.itemizeObservers.length - 1; i >= 0; i--) {
          var disconnect = false;

          if (parentId) {
            if (window.itemizeObservers[i].itemizeContainerId === parentId) {
              disconnect = true;
            }
          } else {
            disconnect = true;
          }

          if (disconnect) {
            window.itemizeObservers[i].disconnect();
            window.itemizeObservers.splice(i, 1);
          }
        }
      }
    }
  }, {
    key: "applyItemize",
    value: function applyItemize(parents, applyOptions) {
      var _this2 = this;

      var childItemizedNb = 0;
      var knownErrors = "";

      try {
        var _loop = function _loop(i) {
          var parent = parents[i];

          if (!parent.classList.contains("itemize_remove_btn") && parent.type !== "text/css" && parent.tagName !== "BR" && parent.tagName !== "SCRIPT" && parent.tagName !== "STYLE") {
            var parentInList = false;

            for (var p = 0; p < _this2.containers.length; p++) {
              if (parent.itemizeContainerId && parent.itemizeContainerId === _this2.containers[p].itemizeContainerId) {
                parentInList = true;
                break;
              }
            }

            if (!parentInList) {
              _this2.containers.push(parent);
            }

            if (parent.itemizeContainerId) {
              _this2.clearObservers(parent.itemizeContainerId);
            }

            var parentItemizeId = _this2.makeId(8);

            parent.itemizeContainerId = parentItemizeId;

            for (var _i2 = parent.classList.length - 1; _i2 >= 0; _i2--) {
              // cleaning parent of itemize_parent_xxxx classes
              if (parent.classList[_i2].indexOf("itemize_parent") !== -1) {
                parent.classList.remove(parent.classList[_i2]);
                break;
              }
            }

            parent.classList.add("itmz_parent");
            parent.classList.add("itemize_parent_".concat(parentItemizeId));

            var options = _objectSpread({}, _this2.globalOptions); // cloning options


            if (applyOptions) {
              options = _this2.mergeOptions(applyOptions);
            }

            options = _this2.getOptionsFromAttributes(parent, options);
            parent.itemizeOptions = options; // node added OBSERVER

            if (parent.itemizeOptions.itemizeAddedElement) {
              var config = {
                childList: true
              };
              var scope = _this2;

              var callback = function callback(mutationsList, observer) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = mutationsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var mutation = _step.value;

                    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                      mutation.addedNodes.forEach(function (node) {
                        var newNode = true;

                        if (node.classList) {
                          node.classList.forEach(function (className) {
                            if (className.indexOf("itemize_") !== -1) {
                              // check si le child n'est pas un element deja added qui passe par un flipAnim
                              newNode = false;
                            }
                          });

                          if (newNode) {
                            if (!node.getAttribute("notItemize") && node.parentElement && node.type !== "text/css" && node.tagName !== "BR" && node.tagName !== "SCRIPT" && node.parentElement.itemizeContainerId && node.tagName !== "STYLE") {
                              if (node.parentElement.itemizeOptions && node.parentElement.itemizeOptions.flipAnimation) {
                                node.classList.add("itemize_hide");
                                scope.itemizeChild(node, node.parentElement, true);
                                scope.flipRead(scope.items);
                                scope.flipAdd(node);
                                scope.flipPlay(scope.items, node.parentElement.itemizeOptions.flipAnimDuration);
                              } else {
                                scope.itemizeChild(node, node.parentElement, true);
                              }
                            }

                            if (parent.itemizeOptions.onAddItem) {
                              parent.itemizeOptions.onAddItem(node);
                            }
                          }
                        }
                      });
                    }
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }
              };

              if (window.itemizeObservers) {
                // ajout des observer de facon global et suppression/deconnection quand parent n'est plus present
                window.itemizeObservers.push(new MutationObserver(callback));
              } else {
                window.itemizeObservers = [new MutationObserver(callback)];
              }

              window.itemizeObservers[window.itemizeObservers.length - 1].observe(parent, config);
              window.itemizeObservers[window.itemizeObservers.length - 1].itemizeContainerId = parent.itemizeContainerId;
            }

            _this2.applyCss(parent);

            for (var z = 0; z < parent.children.length; z++) {
              var child = parent.children[z];

              if (_this2.itemizeChild(child, parent)) {
                childItemizedNb++;
              }
            }
          }
        };

        for (var i = 0; i < parents.length; i++) {
          _loop(i);
        }

        return childItemizedNb;
      } catch (error) {
        console.error(" - Itemize error - \n" + knownErrors);
        console.error(error);
      }
    }
  }, {
    key: "childIsItemizable",
    value: function childIsItemizable(child, parent) {
      return child.type !== "text/css" && typeof child.getAttribute("notItemize") !== "string" && child.tagName !== "BR" && child.tagName !== "SCRIPT" && !child.itemizeItemId && !child.itemizeBtn && !child.classList.contains("itemize_remove_btn") && !(parent.parentNode.itemizeOptions && child.classList.contains(parent.parentNode.itemizeOptions.removeBtnClass));
    }
  }, {
    key: "itemizeChild",
    value: function itemizeChild(child, parent, fromObserver) {
      var _this3 = this;

      if (this.childIsItemizable(child, parent)) {
        child.itemizeItemId = this.makeId(8);
        this.items.push(child);
        child.classList.add("itemize_item_" + child.itemizeItemId);
        child.classList.add("itmz_item");

        if (!parent.itemizeOptions.removeBtn) {
          child.onclick = function (e) {
            e.stopPropagation();

            if (parent.itemizeOptions.modalConfirm) {
              _this3.modalConfirm(child);
            } else {
              _this3.remove(child.itemizeItemId);
            }
          };

          if (parent.itemizeOptions.outlineItemOnHover) {
            this.shadowOnHover(child, false);
          }
        } else {
          if (!parent.itemizeOptions.removeBtnClass) {
            var computedStyle = getComputedStyle(child);

            if (child.style.position !== "absolute" && child.style.position !== "fixed" && computedStyle.position !== "absolute" && computedStyle.position !== "fixed") {
              child.style.position = "relative";
            }

            var button = document.createElement("div");
            button.classList.add("itemize_btn_" + child.itemizeItemId);
            button.classList.add("itemize_remove_btn");
            button.itemizeBtn = true;

            button.onclick = function (e) {
              e.stopPropagation();

              if (parent.itemizeOptions.modalConfirm) {
                _this3.modalConfirm(child);
              } else {
                _this3.remove(child.itemizeItemId);
              }
            };

            child.appendChild(button);

            if (parent.itemizeOptions.outlineItemOnHover) {
              this.shadowOnHover(button, true);
            }
          } else {
            var _button = document.querySelector(".itemize_item_" + child.itemizeItemId + " ." + parent.itemizeOptions.removeBtnClass);

            if (!_button) {
              console.error(" - Itemize error - \n Cannot find specified button's class: " + parent.itemizeOptions.removeBtnClass + "\n");
            } else {
              _button.onclick = function (e) {
                e.stopPropagation();

                if (parent.itemizeOptions.modalConfirm) {
                  _this3.modalConfirm(child);
                } else {
                  _this3.remove(child.itemizeItemId);
                }
              };

              if (parent.itemizeOptions.outlineItemOnHover) {
                this.shadowOnHover(_button, true);
              }
            }
          }
        }

        if (fromObserver) {
          this.showAlert("added", child);
        }

        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "shadowOnHover",
    value: function shadowOnHover(elem, isRemoveBtn) {
      var parent = null;

      if (isRemoveBtn) {
        parent = elem.parentElement;
      } else {
        parent = elem;
      }

      if (parent) {
        elem.parentShadowStyle = parent.style.boxShadow;
      }

      elem.onmouseenter = function (e) {
        if (parent) {
          parent.style.boxShadow = "inset 0px 0px 0px 3px rgba(15,179,0,1)";
        }
      };

      elem.onmouseleave = function (e) {
        if (parent) {
          parent.style.boxShadow = elem.parentShadowStyle;
        }
      };
    }
  }, {
    key: "applyCss",
    value: function applyCss(parent) {
      var options = parent.itemizeOptions;
      var oldStyle = parent.querySelector(".itemize_style");

      if (oldStyle) {
        parent.querySelector(".itemize_style").remove();
      }

      var css = document.createElement("style");
      css.classList.add("itemize_style");
      css.type = "text/css";
      var styles = ""; // parent global styles

      styles += ".itemize_parent_".concat(parent.itemizeContainerId, " .itemize_hide{display:none}"); // remove btn styles

      if (options.removeBtn && !options.removeBtnClass) {
        var btnMargin = options.removeBtnMargin + "px";
        var btnPos = {
          top: 0,
          right: 0,
          bottom: "auto",
          left: "auto",
          marginTop: btnMargin,
          marginRight: btnMargin,
          marginBottom: "0px",
          marginLeft: "0px",
          transform: "none"
        };

        switch (options.removeBtnPosition) {
          case "center-right":
            btnPos.top = "50%";
            btnPos.marginTop = "0px";
            btnPos.transform = "translateY(-50%)";
            break;

          case "bottom-right":
            btnPos.top = "auto";
            btnPos.bottom = 0;
            btnPos.marginTop = "0px";
            btnPos.marginBottom = btnMargin;
            break;

          case "bottom-center":
            btnPos.top = "auto";
            btnPos.right = "auto";
            btnPos.bottom = 0;
            btnPos.left = "50%";
            btnPos.marginTop = "0px";
            btnPos.marginRight = "0px";
            btnPos.marginBottom = btnMargin;
            btnPos.transform = "translateX(-50%)";
            break;

          case "bottom-left":
            btnPos.top = "auto";
            btnPos.right = "auto";
            btnPos.bottom = 0;
            btnPos.left = 0;
            btnPos.marginTop = "0px";
            btnPos.marginRight = "0px";
            btnPos.marginBottom = btnMargin;
            btnPos.marginLeft = btnMargin;
            break;

          case "center-left":
            btnPos.top = "50%";
            btnPos.right = "auto";
            btnPos.left = 0;
            btnPos.marginTop = "0px";
            btnPos.marginRight = "0px";
            btnPos.marginLeft = btnMargin;
            btnPos.transform = "translateY(-50%)";
            break;

          case "top-left":
            btnPos.right = "auto";
            btnPos.left = 0;
            btnPos.marginRight = "0px";
            btnPos.marginLeft = btnMargin;
            break;

          case "top-center":
            btnPos.right = "auto";
            btnPos.left = "50%";
            btnPos.marginRight = "0px";
            btnPos.marginTop = btnMargin;
            btnPos.transform = "translateX(-50%)";
            break;

          default:
            break;
        }

        styles += ".itemize_parent_".concat(parent.itemizeContainerId, " .itemize_remove_btn{z-index:1000000!important;position:absolute;top:").concat(btnPos.top, "!important;right:").concat(btnPos.right, "!important;bottom:").concat(btnPos.bottom, "!important;left:").concat(btnPos.left, "!important;width:").concat(options.removeBtnWidth, "px!important;height:").concat(options.removeBtnWidth, "px!important;overflow:hidden;cursor:pointer;margin:").concat(btnPos.marginTop, " ").concat(btnPos.marginRight, " ").concat(btnPos.marginBottom, " ").concat(btnPos.marginLeft, ";transform:").concat(btnPos.transform, ";border-radius:").concat(options.removeBtnCircle ? "50%" : "0%", ";background-color:").concat(options.removeBtnBgColor, "}.itemize_remove_btn:hover{background-color:").concat(options.removeBtnBgHoverColor, "}.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn:hover::after,.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn:hover::before{transition:background 150ms ease-in-out;background:").concat(options.removeBtnHoverColor, "}.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn::after,.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn::before{content:'';position:absolute;height:").concat(options.removeBtnThickness, "px;transition:background 150ms ease-in-out;width:").concat(options.removeBtnWidth / 2, "px;top:50%;left:25%;margin-top:").concat(options.removeBtnThickness * 0.5 < 1 ? -1 : -options.removeBtnThickness * 0.5, "px;background:").concat(options.removeBtnColor, ";border-radius:").concat(options.removeBtnSharpness, "}.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.itemize_parent_").concat(parent.itemizeContainerId, " .itemize_remove_btn::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}");
      }

      if (css.styleSheet) {
        css.styleSheet.cssText = styles;
      } else {
        css.appendChild(document.createTextNode(styles));
      }

      parent.appendChild(css);
    }
  }, {
    key: "cancelItemize",
    value: function cancelItemize(targets) {
      var unItemizedNb = 0;

      try {
        var parentTargets = [];

        if (targets === "all") {
          parentTargets = this.containers.splice(0); // cloning
        } else {
          parentTargets = targets;
        }

        for (var z = 0; z < parentTargets.length; z++) {
          var parent = parentTargets[z];
          var targetItems = parent.querySelectorAll(".itmz_item");

          for (var j = 0; j < targetItems.length; j++) {
            if (targetItems[j].itemizeContainerId) {
              this.clearObservers(targetItems[j].itemizeContainerId);
            }

            if (targetItems[j].itemizeItemId) {
              this.cancelItemizeChild(targetItems[j], targetItems[j].parentNode);
              unItemizedNb++;
            }
          }

          if (parent.itemizeContainerId) {
            this.clearObservers(parent.itemizeContainerId);

            for (var k = parent.classList.length - 1; k >= 0; k--) {
              if (parent.classList[k].indexOf("itemize_parent") !== -1) {
                parent.classList.remove(parent.classList[k]);
                parent.classList.remove("itmz_parent");
                break;
              }
            }

            var parentsInParent = parent.querySelectorAll(".itmz_parent");

            for (var v = 0; v < parentsInParent.length; v++) {
              this.cancelItemize(parentsInParent[v]);
            }

            parent.itemizeContainerId = null;
            parent.itemizeOptions = null;

            for (var i = 0; i < this.containers.length; i++) {
              if (this.containers[i] === parent) {
                this.containers.splice(i, 1);
                break;
              }
            }
          }
        }

        return unItemizedNb;
      } catch (err) {
        console.error(err);
      }
    }
  }, {
    key: "cancelItemizeChild",
    value: function cancelItemizeChild(child, parent) {
      for (var r = this.items.length - 1; r >= 0; r--) {
        if (this.items[r] === child) {
          this.cleanItem(this.items[r]);
          this.items.splice(r, 1);
          break;
        }
      }

      if (!parent.itemizeOptions.removeBtn) {
        child.onclick = null;
      } else {
        if (!parent.itemizeOptions.removeBtnClass) {
          var btn = child.querySelector(".itemize_remove_btn");

          if (btn) {
            btn.remove();
          }
        } else {
          var button = child.querySelector("." + parent.itemizeOptions.removeBtnClass);

          if (button) {
            button.onclick = null;
          }
        }
      }

      var oldStyle = parent.querySelector(".itemize_style");

      if (oldStyle) {
        parent.querySelector(".itemize_style").remove();
      }

      for (var s = child.classList.length - 1; s >= 0; s--) {
        if (child.classList[s].indexOf("itemize_item_") !== -1) {
          child.classList.remove(child.classList[s]);
          break;
        }
      }

      child.itemizeItemId = null;
    }
  }, {
    key: "modalConfirm",
    value: function modalConfirm(el) {
      var _this4 = this;

      try {
        // let item = null;
        // if (typeof el === "string") {
        //   for (let i = 0; i < this.items.length; i++) {
        //     if (this.items[i].itemizeItemId === el) {
        //       item = this.items[i];
        //     }
        //   }
        //   if (!item) {
        //     item = document.querySelector(el);
        //     if (!item || !item.itemizeItemId) {
        //       throw new Error(
        //         " - Itemize error - \n Not a valid Itemize element, cannot create a confirm modal."
        //       );
        //     }
        //   }
        //   if (!item) {
        //     throw new Error(
        //       " - Itemize error - \n No item found, cannot create a confirm modal."
        //     );
        //   }
        // } else {
        //   item = el;
        //   if (!item) {
        //     throw new Error(
        //       " - Itemize error - \n No item found, cannot create a confirm modal."
        //     );
        //   }
        //   if (!item.itemizeItemId) {
        //     throw new Error(
        //       " - Itemize error - \n Not a valid Itemize element, cannot create a confirm modal."
        //     );
        //   }
        // }
        var modalAnimDuration = 150;
        var backDrop = document.createElement("div");
        var modal = document.createElement("div");
        var alertText = document.createElement("div");
        var btnContainer = document.createElement("div");
        var btnConfirm = document.createElement("button");
        var btnCancel = document.createElement("button");
        var crossClose = document.createElement("div");
        var body = document.querySelector("body"); // const bodyInitialOverflow = body.style.overflow;
        // body.style.overflow = "hidden";

        backDrop.classList.add("itemize_modal_backdrop");
        modal.classList.add("itemize_modal");
        alertText.classList.add("itemize_modal_text");
        btnConfirm.classList.add("itemize_modal_btnConfirm");
        btnCancel.classList.add("itemize_modal_btnCancel");
        crossClose.classList.add("itemize_modal_cross");
        alertText.textContent = el.parentElement.itemizeOptions.modalText;
        btnConfirm.innerHTML = "Yes";
        btnCancel.innerHTML = "Cancel";
        btnContainer.appendChild(btnCancel);
        btnContainer.appendChild(btnConfirm);
        modal.appendChild(alertText);
        modal.appendChild(btnContainer);
        modal.appendChild(crossClose);

        var hideModal = function hideModal(bdy, bckdrop, mdal) {
          bckdrop.onclick = null;
          mdal.onclick = null;

          if (bckdrop.animate) {
            bckdrop.animate([{
              opacity: 1
            }, {
              opacity: 0
            }], {
              duration: modalAnimDuration,
              easing: "ease-in-out",
              fill: "both"
            });
          } else {
            _this4.animateRAF(bckdrop, [{
              opacity: 1
            }], [{
              opacity: 0
            }], modalAnimDuration);
          }

          if (mdal.animate) {
            mdal.animate([{
              opacity: 1,
              transform: "translateY(-50%) translateX(-50%)"
            }, {
              opacity: 0,
              transform: "translateY(0%) translateX(-50%)"
            }], {
              duration: modalAnimDuration,
              easing: "ease-in-out",
              fill: "both"
            });
          } else {
            _this4.animateRAF(mdal, [{
              opacity: 1,
              transform: {
                translateX: -50,
                translateY: -50,
                unit: "%"
              }
            }], [{
              opacity: 0,
              transform: {
                translateX: -50,
                translateY: 0,
                unit: "%"
              }
            }], modalAnimDuration);
          }

          clearTimeout(_this4.modalDisappearTimeout);
          _this4.modalDisappearTimeout = setTimeout(function () {
            bdy.removeChild(bckdrop);
            bdy.removeChild(mdal); // bdy.style.overflow = bodyInitialOverflow;
          }, modalAnimDuration);
        };

        backDrop.onclick = function () {
          if (!backDrop.hiding) {
            hideModal(body, backDrop, modal);
          }

          backDrop.hiding = true;
        };

        btnCancel.onclick = function () {
          if (!btnCancel.clicked) {
            hideModal(body, backDrop, modal);
          }

          btnCancel.clicked = true;
        };

        btnConfirm.onclick = function () {
          if (!btnConfirm.clicked) {
            hideModal(body, backDrop, modal);

            _this4.remove(el);
          }

          btnConfirm.clicked = true;
        };

        crossClose.onclick = function () {
          if (!crossClose.clicked) {
            hideModal(body, backDrop, modal);
          }

          crossClose.clicked = true;
        };

        Object.assign(modal.style, {
          position: "fixed ",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "25px",
          background: "#FFFFFF",
          width: "90vw",
          maxWidth: "500px",
          borderRadius: "4px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "helvetica",
          zIndex: 100000000
        });
        var modalCss = ".itemize_modal_btnConfirm:hover{ background-color: #c83e34 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_btnCancel:hover{ background-color: #4a5055 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_cross {cursor:pointer;position: absolute;right: 5px;top: 5px;width: 18px;height:18px;opacity:0.3;}.itemize_modal_cross:hover{opacity:1;}.itemize_modal_cross:before,.itemize_modal_cross:after{position:absolute;left:9px;content:' ';height: 19px;width:2px;background-color:#333;}.itemize_modal_cross:before{transform:rotate(45deg);}.itemize_modal_cross:after{transform:rotate(-45deg);}";
        var styleEl = document.createElement("style");

        if (styleEl.styleSheet) {
          styleEl.styleSheet.cssText = modalCss;
        } else {
          styleEl.appendChild(document.createTextNode(modalCss));
        }

        modal.appendChild(styleEl);
        Object.assign(alertText.style, {
          marginBottom: "25px"
        });
        Object.assign(btnContainer.style, {
          width: "100%",
          display: "flex"
        });
        Object.assign(btnCancel.style, {
          background: "#6C757D",
          border: "none",
          padding: "10px 0 10px 0",
          borderTopLeftRadius: "4px",
          borderBottomLeftRadius: "4px",
          flex: "1 0 auto",
          cursor: "pointer",
          color: "#FFFFFF",
          transition: "background-color 0.3s ease-in-out"
        });
        Object.assign(btnConfirm.style, {
          background: "#F94336",
          border: "none",
          padding: "10px 0 10px 0",
          borderTopRightRadius: "4px",
          borderBottomRightRadius: "4px",
          flex: "1 0 auto",
          cursor: "pointer",
          color: "#FFFFFF",
          transition: "background-color 0.3s ease-in-out"
        });
        Object.assign(backDrop.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0,0.7)",
          zIndex: 10000000
        });
        body.prepend(modal);
        body.prepend(backDrop);

        if (backDrop.animate) {
          backDrop.animate([{
            opacity: 0
          }, {
            opacity: 1
          }], {
            duration: 300,
            easing: "ease-out",
            fill: "both"
          });
        } else {
          this.animateRAF(backDrop, [{
            opacity: 0
          }], [{
            opacity: 1
          }], modalAnimDuration);
        }

        if (modal.animate) {
          modal.animate([{
            opacity: 0,
            transform: "translateY(-100%) translateX(-50%)"
          }, {
            opacity: 1,
            transform: "translateY(-50%) translateX(-50%)"
          }], {
            duration: modalAnimDuration,
            easing: "ease-in",
            fill: "both"
          });
        } else {
          this.animateRAF(modal, [{
            opacity: 0,
            transform: {
              translateX: -50,
              translateY: -100,
              unit: "%"
            }
          }], [{
            opacity: 1,
            transform: {
              translateX: -50,
              translateY: -50,
              unit: "%"
            }
          }], modalAnimDuration);
        }
      } catch (error) {
        console.error(" - Itemize error - \n" + error);
      }
    }
  }, {
    key: "showAlert",
    value: function showAlert(action, element) {
      var _this5 = this;

      if (element.parentElement.itemizeOptions.showAddAlerts && action === "added" || element.parentElement.itemizeOptions.showRemoveAlerts && action === "removed") {
        var alertClassName = "";
        var alertTextClassName = "";
        var alertBackground = "";
        var alertTimerColor = "";
        var alertTextContent = "";
        var alertLeftPos = "";
        var alertTopPos = "";
        var alertTranslateX = "";
        var minusOrNothing = "-";
        var alertIsTop = false;
        var alertTimerDuration = element.parentElement.itemizeOptions.alertTimer;

        if (element.parentElement.itemizeOptions.alertPosition === "bottom-center") {
          alertLeftPos = "50%";
          alertTopPos = "100%";
          alertTranslateX = "-50%";
        } else if (element.parentElement.itemizeOptions.alertPosition === "bottom-right") {
          alertLeftPos = "100%";
          alertTopPos = "100%";
          alertTranslateX = "-100%";
        } else if (element.parentElement.itemizeOptions.alertPosition === "bottom-left") {
          alertLeftPos = "0%";
          alertTopPos = "100%";
          alertTranslateX = "0%";
        } else if (element.parentElement.itemizeOptions.alertPosition === "top-center") {
          alertLeftPos = "50%";
          alertTopPos = "0%";
          alertTranslateX = "-50%";
          minusOrNothing = "";
          alertIsTop = true;
        } else if (element.parentElement.itemizeOptions.alertPosition === "top-right") {
          alertLeftPos = "100%";
          alertTopPos = "0%";
          alertTranslateX = "-100%";
          minusOrNothing = "";
          alertIsTop = true;
        } else if (element.parentElement.itemizeOptions.alertPosition === "top-left") {
          alertLeftPos = "0%";
          alertTopPos = "0%";
          alertTranslateX = "0%";
          minusOrNothing = "";
          alertIsTop = true;
        }

        if (action === "removed") {
          alertClassName = "itemize_remove_alert";
          alertTextClassName = "itemize_remove_alert_text";
          alertBackground = "#BD5B5B";
          alertTimerColor = "#DEADAD";
          alertTextContent = element.parentElement.itemizeOptions.removeAlertText;
        } else if (action === "added") {
          alertClassName = "itemize_add_alert";
          alertTextClassName = "itemize_add_alert_text";
          alertBackground = "#00AF66";
          alertTimerColor = "#80D7B3";
          alertTextContent = element.parentElement.itemizeOptions.addAlertText;
        }

        this.alertNb++;
        var popAlert = document.createElement("div");
        popAlert.alertId = this.alertNb;
        var alertTimer = document.createElement("div");
        var alertText = document.createElement("div");
        popAlert.classList.add(alertClassName);
        popAlert.classList.add("itemize_alert");
        alertText.classList.add(alertTextClassName);
        alertText.textContent = alertTextContent;
        Object.assign(alertText.style, {
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          textAlign: "center",
          whiteSpace: "nowrap",
          padding: "10px 15px 10px 15px"
        });
        Object.assign(alertTimer.style, {
          background: alertTimerColor,
          width: "100%",
          height: "5px"
        });
        Object.assign(popAlert.style, {
          boxSizing: "border-box",
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          top: alertTopPos,
          left: alertLeftPos,
          border: "solid 1px " + alertTimerColor,
          borderRadius: "4px",
          transform: "translate(".concat(alertTranslateX, ", ").concat(minusOrNothing).concat(this.alertNb * 100 - (alertIsTop ? 100 : 0), "%)"),
          fontFamily: "helvetica",
          background: alertBackground,
          color: "#FFFFFF",
          zIndex: 100000
        });
        document.querySelector("body").appendChild(popAlert);
        popAlert.appendChild(alertTimer);
        popAlert.appendChild(alertText);

        if (alertTimer.animate) {
          alertTimer.animate([{
            width: "100%"
          }, {
            width: "0%"
          }], {
            duration: alertTimerDuration,
            easing: "linear",
            fill: "both"
          });
        } else {
          this.animateRAF(alertTimer, [{
            width: {
              value: 100,
              unit: "%"
            }
          }], [{
            width: {
              value: 0,
              unit: "%"
            }
          }], alertTimerDuration);
        }

        setTimeout(function () {
          var alertList = document.querySelectorAll(".itemize_alert");

          for (var i = 0; i < alertList.length; i++) {
            if (alertList[i].alertId > 0) {
              var translateYStart = parseInt("".concat(minusOrNothing).concat(alertList[i].alertId * 100 - (alertIsTop ? 100 : 0)));
              var translateYEnd = parseInt("".concat(minusOrNothing).concat(alertList[i].alertId * 100 - (alertIsTop ? 100 : 0) - 100));

              if (alertList[i].animate) {
                alertList[i].animate([{
                  transform: "translate(".concat(alertTranslateX, ", ").concat(translateYStart, "%)")
                }, {
                  transform: "translate(".concat(alertTranslateX, ", ").concat(translateYEnd, "%)")
                }], {
                  duration: 150,
                  easing: "ease-in-out",
                  fill: "both"
                });
              } else {
                _this5.animateRAF(alertList[i], [{
                  transform: {
                    translateX: parseInt(alertTranslateX),
                    translateY: translateYStart,
                    unit: "%"
                  }
                }], [{
                  transform: {
                    translateX: parseInt(alertTranslateX),
                    translateY: translateYEnd,
                    unit: "%"
                  }
                }], 150);
              }

              alertList[i].alertId--;
            }
          }

          _this5.alertNb--;
          setTimeout(function () {
            document.querySelector("body").removeChild(popAlert);
          }, 300);
        }, alertTimerDuration);
      }
    }
  }, {
    key: "remove",
    value: function remove(el) {
      var _this6 = this;

      try {
        var item = null;

        if (typeof el === "string") {
          for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].itemizeItemId === el) {
              item = this.items[i];
              item.arrayPosition = i;
            }
          }

          if (!item) {
            item = document.querySelector(el);

            if (!item || !item.itemizeItemId) {
              throw new Error(" - Itemize error - \nNot a valid Itemize element");
            }

            for (var _i3 = 0; _i3 < this.items.length; _i3++) {
              if (this.items[_i3].itemizeItemId === item.itemizeItemId) {
                item.arrayPosition = _i3;
              }
            }
          }

          if (!item) {
            throw new Error(" - Itemize error - \nNo item found to remove");
          }
        } else {
          item = el;

          if (!item) {
            throw new Error(" - Itemize error - \nNo item found to remove");
          }

          if (!item.itemizeItemId) {
            throw new Error(" - Itemize error - \nNot a valid Itemize element");
          }

          for (var _i4 = 0; _i4 < this.items.length; _i4++) {
            if (item.itemizeItemId === this.items[_i4].itemizeItemId) {
              item.arrayPosition = _i4;
            }
          }
        }

        if ((item.arrayPosition || item.arrayPosition === 0) && item.parentElement && item.parentElement.itemizeOptions) {
          if (!item.removeStatus || item.removeStatus !== "pending") {
            if (this.globalOptions.beforeRemove) {
              item.removeStatus = "pending";
              var confirmRemove = this.globalOptions.beforeRemove(item);

              if (confirmRemove === undefined) {
                throw new Error(' - Itemize error - \n The function "beforeErase" must return a Boolean or a Promise');
              }

              if (typeof confirmRemove.then === "function") {
                var animDuration = item.parentElement.itemizeOptions.flipAnimDuration;
                var onClickFn = item.onclick;
                item.onclick = null;
                confirmRemove.then(function (response) {
                  if (item.parentElement.itemizeOptions.flipAnimation) {
                    var closeBtn = item.querySelector(".itemize_remove_btn");

                    if (closeBtn) {
                      closeBtn.onclick = null;
                    } else {
                      closeBtn = item.querySelector("." + _this6.globalOptions.removeBtnClass);

                      if (closeBtn) {
                        closeBtn.onclick = null;
                      }
                    }

                    _this6.showAlert("removed", item);

                    _this6.flipRead(_this6.items);

                    _this6.flipRemove(item);

                    _this6.cleanItem(item);

                    _this6.items.splice(item.arrayPosition, 1);
                  } else {
                    _this6.showAlert("removed", item);

                    item.removeStatus = null;
                    item.remove();

                    _this6.cleanItem(item);

                    _this6.items.splice(item.arrayPosition, 1);
                  }
                })["catch"](function (err) {
                  console.log(err);
                  item.onclick = onClickFn;
                  item.removeStatus = null;
                });
              } else if (confirmRemove) {
                if (item.parentElement.itemizeOptions.flipAnimation) {
                  var _animDuration = item.parentElement.itemizeOptions.flipAnimDuration;
                  var closeBtn = item.querySelector(".itemize_remove_btn");
                  item.onclick = null;

                  if (closeBtn) {
                    closeBtn.onclick = null;
                  } else {
                    closeBtn = item.querySelector("." + this.globalOptions.removeBtnClass);

                    if (closeBtn) {
                      closeBtn.onclick = null;
                    }
                  }

                  this.showAlert("removed", item);
                  this.flipRead(this.items);
                  this.flipRemove(item);
                  this.cleanItem(item);
                  this.items.splice(item.arrayPosition, 1);
                } else {
                  this.showAlert("removed", item);
                  item.removeStatus = null;
                  item.remove();
                  this.items.splice(item.arrayPosition, 1);
                  this.cleanItem(item);
                }
              }
            } else {
              if (item.parentElement.itemizeOptions.flipAnimation) {
                var _animDuration2 = item.parentElement.itemizeOptions.flipAnimDuration;

                var _closeBtn = item.querySelector(".itemize_remove_btn");

                if (_closeBtn) {
                  _closeBtn.onclick = null;
                } else {
                  _closeBtn = item.querySelector("." + this.globalOptions.removeBtnClass);

                  if (_closeBtn) {
                    _closeBtn.onclick = null;
                  }
                }

                this.showAlert("removed", item);
                this.flipRead(this.items);
                this.flipRemove(item);
                this.cleanItem(item);
                this.items.splice(item.arrayPosition, 1);
              } else {
                this.showAlert("removed", item);
                item.removeStatus = null;
                item.remove();
                this.cleanItem(item);
                this.items.splice(item.arrayPosition, 1);
              }
            }
          }
        } else {
          throw new Error(" - Itemize error - \n this element has an invalid itemizeItemId");
        }
      } catch (error) {
        console.error(" - Itemize error - \n" + error);
      }
    }
  }, {
    key: "cleanItem",
    value: function cleanItem(item) {
      for (var u = 0; u < item.classList.length; u++) {
        item.classList.remove("itmz_item");

        if (item.classList[u].indexOf("itemize_item_") !== -1) {
          item.classList.remove(item.classList[u]);
          break;
        }
      }

      if (item.parentNode && item.parentNode.itemizeOptions && item.parentNode.itemizeOptions.removeBtnClass) {
        var btn = item.querySelector("." + item.parentNode.itemizeOptions.removeBtnClass);

        if (btn) {
          btn.remove();
        }
      } else {
        var _btn = item.querySelector(".itemize_remove_btn");

        if (_btn) {
          _btn.remove();
        }
      }

      if (item.itemizeContainerId) {
        this.clearObservers(item.itemizeContainerId);
        var parentsInItem = item.querySelectorAll(".itmz_parent");
        this.cancelItemize(parentsInItem);

        for (var i = 0; i < parentsInItem.length; i++) {
          if (parentsInItem[i].itemizeContainerId) {
            this.clearObservers(parentsInItem[i].itemizeContainerId);
          }
        }

        if (item.classList.contains("itmz_parent")) {
          this.cancelItemize([item]);
        }
      }

      item.itemizeItemId = null;
    }
  }, {
    key: "animateRAF",
    value: function animateRAF(elem, from, to, duration) {
      function anim(timestamp) {
        var progress;

        if (!elem.startAnimTime) {
          elem.startAnimTime = timestamp;
          elem.animTicks = 0;

          for (var i = 0; i < from.length; i++) {
            for (var key in from[i]) {
              if (from[i].hasOwnProperty(key)) {
                if (key === "transform") {
                  elem.style.transform = "translateX(".concat(from[i][key].translateX).concat(from[i][key].unit, ") translateY(").concat(from[i][key].translateY).concat(from[i][key].unit, ")");
                } else if (key === "opacity") {
                  elem.style.opacity = from[i][key];
                } else {
                  elem.style[key] = "".concat(from[i][key].value).concat(from[i][key].unit);
                }
              }
            }
          }
        }

        progress = timestamp - elem.startAnimTime;

        for (var _i5 = 0; _i5 < to.length; _i5++) {
          for (var _key in to[_i5]) {
            if (to[_i5].hasOwnProperty(_key)) {
              if (_key === "transform") {
                elem.style.transform = "translateX(".concat(from[_i5][_key].translateX - (from[_i5][_key].translateX - to[_i5][_key].translateX) / (duration * 60 / 1000) * elem.animTicks).concat(to[_i5][_key].unit, ") translateY(").concat(from[_i5][_key].translateY - (from[_i5][_key].translateY - to[_i5][_key].translateY) / (duration * 60 / 1000) * elem.animTicks).concat(to[_i5][_key].unit, ")");
              } else if (_key === "opacity") {
                elem.style.opacity = from[_i5][_key] - (from[_i5][_key] - to[_i5][_key]) / (duration * 60 / 1000) * elem.animTicks;
              } else {
                elem.style[_key] = "".concat(from[_i5][_key].value - (from[_i5][_key].value - to[_i5][_key].value) / (duration * 60 / 1000) * elem.animTicks).concat(to[_i5][_key].unit);
              }
            }
          }
        }

        if (progress < duration - 1) {
          elem.animTicks++;
          requestAnimationFrame(anim);
        } else {
          elem.startAnimTime = null;
          elem.animTicks = 0;
        }
      }

      requestAnimationFrame(anim);
    }
  }, {
    key: "flipRemove",
    value: function flipRemove(elem) {
      var _this7 = this;

      elem.onclick = null; // elem.parentElement.appendChild(elem);

      var options = elem.parentElement.itemizeOptions;
      var newPos = elem.getBoundingClientRect();
      var oldPos = this.elPos[elem.itemizeItemId];
      var deltaX = oldPos.left - newPos.left;
      var deltaY = oldPos.top - newPos.top;

      if (elem.animate) {
        elem.animate([{
          transform: "translate(".concat(deltaX, "px, ").concat(deltaY, "px)"),
          opacity: 1
        }, {
          transform: "translate(".concat(deltaX + options.animRemoveTranslateX, "px, ").concat(deltaY + options.animRemoveTranslateY, "px)"),
          opacity: 0
        }], {
          duration: options.flipAnimDuration * 0.5,
          easing: options.flipAnimEasing,
          fill: "both"
        });
      } else {
        this.animateRAF(elem, [{
          opacity: 1
        }, {
          transform: {
            translateX: deltaX,
            translateY: deltaY,
            unit: "px"
          }
        }], [{
          opacity: 0
        }, {
          transform: {
            translateX: deltaX + options.animRemoveTranslateX,
            translateY: deltaY + options.animRemoveTranslateY,
            unit: "px"
          }
        }], options.flipAnimDuration * 0.5);
      }

      setTimeout(function () {
        elem.removeStatus = null;
        elem.remove();

        _this7.flipPlay(_this7.items, options.flipAnimDuration * 0.5);
      }, options.flipAnimDuration * 0.5);
    }
  }, {
    key: "flipAdd",
    value: function flipAdd(elem) {
      elem.classList.remove("itemize_hide");
      elem.inAddAnim = true;
      this.elPos[elem.itemizeItemId] = elem.oldAddPos || elem.getBoundingClientRect();
      var options = elem.parentElement.itemizeOptions;
      var newPos = elem.getBoundingClientRect();
      var oldPos = elem.oldAddPos || this.elPos[elem.itemizeItemId];
      var deltaX = oldPos.left - newPos.left;
      var deltaY = oldPos.top - newPos.top;
      var deltaW = oldPos.width / newPos.width;
      var deltaH = oldPos.height / newPos.height;

      if (isNaN(deltaW) || deltaW === Infinity) {
        deltaW = 1;
      }

      if (isNaN(deltaH) || deltaH === Infinity) {
        deltaH = 1;
      }

      elem.newAddPos = newPos;
      elem.oldAddPos = oldPos;
      var translateXStart = deltaX + options.animAddTranslateX;
      var translateYStart = deltaY + options.animAddTranslateY;

      if (elem.animate) {
        elem.animate([{
          transform: "translate(".concat(translateXStart, "px, ").concat(translateYStart, "px)"),
          opacity: 0
        }, {
          transform: "none",
          opacity: 1
        }], {
          duration: options.flipAnimDuration,
          easing: options.flipAnimEasing,
          fill: "both"
        });
      } else {
        this.animateRAF(elem, [{
          opacity: 0
        }, {
          transform: {
            translateX: translateXStart,
            translateY: translateYStart,
            unit: "px"
          }
        }], [{
          opacity: 1
        }, {
          transform: {
            translateX: 0,
            translateY: 0,
            unit: "px"
          }
        }], options.flipAnimDuration);
      }

      setTimeout(function () {
        elem.inAddAnim = false;
        elem.newAddPos = null;
        elem.oldPos = null;
      }, options.flipAnimDuration);
    }
  }, {
    key: "flipRead",
    value: function flipRead(elems) {
      // this.elPos = {};
      for (var i = 0; i < elems.length; i++) {
        this.elPos[elems[i].itemizeItemId] = elems[i].getBoundingClientRect();
      }
    }
  }, {
    key: "flipPlay",
    value: function flipPlay(elems, duration) {
      for (var i = 0; i < elems.length; i++) {
        if (!elems[i].inAddAnim && elems[i].parentNode && elems[i].parentNode.itemizeOptions) {
          var newPos = elems[i].getBoundingClientRect();
          var oldPos = this.elPos[elems[i].itemizeItemId];
          var deltaX = oldPos.left - newPos.left;
          var deltaY = oldPos.top - newPos.top;
          var deltaW = oldPos.width / newPos.width;
          var deltaH = oldPos.height / newPos.height;

          if (isNaN(deltaW) || deltaW === Infinity) {
            deltaW = 1;
          }

          if (isNaN(deltaH) || deltaH === Infinity) {
            deltaH = 1;
          }

          if (deltaX !== 0 || deltaY !== 0 || deltaW !== 1 || deltaH !== 1) {
            if (elems[i].animate) {
              elems[i].animate([{
                transform: "translate(".concat(deltaX, "px, ").concat(deltaY, "px)")
              }, {
                transform: "none"
              }], {
                duration: duration,
                easing: elems[i].parentNode.itemizeOptions.flipAnimEasing,
                fill: "both"
              });
            } else {
              this.animateRAF(elems[i], [{
                transform: {
                  translateX: deltaX,
                  translateY: deltaY,
                  unit: "px"
                }
              }], [{
                transform: {
                  translateX: 0,
                  translateY: 0,
                  unit: "px"
                }
              }], duration);
            }
          }
        }
      }
    }
  }, {
    key: "mergeOptions",
    value: function mergeOptions(newOptions) {
      try {
        var defaultOptions = {
          removeBtn: true,
          removeBtnWidth: 20,
          removeBtnThickness: 2,
          removeBtnColor: "#565C67",
          removeBtnHoverColor: "#ffffff",
          removeBtnSharpness: "0px",
          removeBtnPosition: "top-right",
          removeBtnMargin: 2,
          removeBtnCircle: true,
          removeBtnBgColor: "#d1cfcf91",
          removeBtnBgHoverColor: "#959595",
          removeBtnClass: null,
          modalConfirm: false,
          modalText: "Are you sure to remove this item?",
          removeAlertText: "Item removed",
          addAlertText: "Item added",
          showRemoveAlerts: false,
          showAddAlerts: false,
          alertPosition: "bottom-right",
          alertTimer: 4000,
          flipAnimation: true,
          flipAnimEasing: "ease-in-out",
          flipAnimDuration: 500,
          animRemoveTranslateX: 0,
          animRemoveTranslateY: -100,
          animAddTranslateX: 0,
          animAddTranslateY: -100,
          beforeRemove: null,
          outlineItemOnHover: false,
          nestingLevel: 1,
          itemizeAddedElement: true,
          onAddItem: null
        };

        if (this.globalOptions) {
          defaultOptions = _objectSpread({}, this.globalOptions);
        }

        var mergedOptions = _objectSpread({}, defaultOptions, newOptions); // for (var key in newOptions) {
        //   if (newOptions.hasOwnProperty(key)) {
        //     defaultOptions[key] = newOptions[key];
        //   }
        // }


        return mergedOptions;
      } catch (error) {
        console.error(error);
      }
    } // optionsTypeCheck(options) {
    //   let error = "";
    //   if (typeof options.removeBtn !== "boolean") {
    //     error += "option 'button' must be a Boolean\n";
    //   }
    //   if (typeof options.modalConfirm !== "boolean") {
    //     error += "option 'modalConfirm' must be a Boolean\n";
    //   }
    //   if (typeof options.removeBtnWidth !== "number") {
    //     error += "option 'removeBtnWidth' must be a Number\n";
    //   }
    //   if (typeof options.removeBtnThickness !== "number") {
    //     error += "option 'removeBtnThickness' must be a Number\n";
    //   }
    //   if (typeof options.alertTimer !== "number") {
    //     error += "option 'alertTimer' must be a Number\n";
    //   }
    //   if (options.removeBtnClass && typeof options.removeBtnClass !== "string") {
    //     error += "option 'buttonClass' must be a String\n";
    //   }
    //   if (typeof options.removeBtnHoverColor !== "string") {
    //     error += "option 'removeBtnHoverColor' must be a String\n";
    //   }
    //   if (typeof options.removeBtnSharpness !== "string") {
    //     error += "option 'removeBtnSharpness' must be a String\n";
    //   }
    //   if (typeof options.removeBtnPosition !== "string") {
    //     error += "option 'removeBtnPosition' must be a String\n";
    //   }
    //   if (typeof options.removeBtnBgColor !== "string") {
    //     error += "option 'removeBtnBgColor' must be a String\n";
    //   }
    //   if (typeof options.removeBtnBgHoverColor !== "string") {
    //     error += "option 'removeBtnBgHoverColor' must be a String\n";
    //   }
    //   if (typeof options.removeBtnCircle !== "boolean") {
    //     error += "option 'removeBtnCircle' must be a Boolean\n";
    //   }
    //   if (typeof options.removeBtnMargin !== "number") {
    //     error += "option 'removeBtnMargin' must be a Number\n";
    //   }
    //   if (typeof options.modalText !== "string") {
    //     error += "option 'modalText' must be a String\n";
    //   }
    //   if (typeof options.removeAlertText !== "string") {
    //     error += "option 'removeAlertText' must be a String\n";
    //   }
    //   if (typeof options.addAlertText !== "string") {
    //     error += "option 'addAlertText' must be a String\n";
    //   }
    //   if (typeof options.showRemoveAlerts !== "boolean") {
    //     error += "option 'showRemoveAlerts' must be a Boolean\n";
    //   }
    //   if (typeof options.showAddAlerts !== "boolean") {
    //     error += "option 'showAddAlerts' must be a Boolean\n";
    //   }
    //   if (typeof options.alertPosition !== "string") {
    //     error += "option 'alertPosition' must be a String\n";
    //   }
    //   if (typeof options.flipAnimation !== "boolean") {
    //     error += "option 'flipAnimation' must be a Boolean\n";
    //   }
    //   if (typeof options.outlineItemOnHover !== "boolean") {
    //     error += "option 'outlineItemOnHover' must be a Boolean\n";
    //   }
    //   if (typeof options.nestingLevel !== "number") {
    //     error += "option 'nestingLevel' must be a Number\n";
    //   }
    //   if (typeof options.flipAnimDuration !== "number") {
    //     error += "option 'flipAnimDuration' must be a Number\n";
    //   }
    //   if (typeof options.flipAnimEasing !== "string") {
    //     error += "option 'flipAnimEasing' must be a String\n";
    //   } else if (
    //     options.flipAnimEasing !== "linear" &&
    //     options.flipAnimEasing !== "ease" &&
    //     options.flipAnimEasing !== "ease-in-out" &&
    //     options.flipAnimEasing !== "ease-in" &&
    //     options.flipAnimEasing !== "ease-out" &&
    //     options.flipAnimEasing.indexOf("cubic-bezier(") === -1
    //   ) {
    //     error +=
    //       "option 'flipAnimEasing' only accepts the pre-defined values 'linear', 'ease', 'ease-in', 'ease-out', and 'ease-in-out', or a custom 'cubic-bezier' value like 'cubic-bezier(0.42, 0, 0.58, 1)'. \n";
    //   }
    //   if (typeof options.animRemoveTranslateX !== "number") {
    //     error += "option 'animRemoveTranslateX' must be a Number\n";
    //   }
    //   if (typeof options.animRemoveTranslateY !== "number") {
    //     error += "option 'animRemoveTranslateY' must be a Number\n";
    //   }
    //   if (typeof options.animAddTranslateY !== "number") {
    //     error += "option 'animAddTranslateY' must be a Number\n";
    //   }
    //   if (typeof options.animAddTranslateX !== "number") {
    //     error += "option 'animAddTranslateX' must be a Number\n";
    //   }
    //   if (options.beforeRemove && typeof options.beforeRemove !== "function") {
    //     error += "option 'beforeRemove' must be a Function\n";
    //   }
    //   if (error === "") {
    //     return "valid";
    //   } else {
    //     return error;
    //   }
    // }

  }, {
    key: "getOptionsFromAttributes",
    value: function getOptionsFromAttributes(parent, options) {
      var intAttributes = ["removeBtnWidth", "removeBtnThickness", "removeBtnMargin", "nestingLevel", "flipAnimDuration", "animRemoveTranslateX", "animRemoveTranslateY", "animAddTranslateX", "animAddTranslateY", "removeBtnThickness", "alertTimer"];

      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          if (parent.getAttribute(key)) {
            if (parent.getAttribute(key) === "false") {
              options[key] = false;
            } else if (parent.getAttribute(key) === "true") {
              options[key] = true;
            } else if (intAttributes.indexOf(key) !== -1) {
              if (!isNaN(parseInt(parent.getAttribute(key)))) {
                options[key] = parseInt(parent.getAttribute(key));
              }
            } else {
              options[key] = parent.getAttribute(key);
            }
          }
        }
      } // if (parent.getAttribute("removeBtn") === "false") {
      //   options.removeBtn = false;
      // } else if (parent.getAttribute("removeBtn") === "true") {
      //   options.removeBtn = true;
      // }
      // if (parent.getAttribute("modalConfirm") === "false") {
      //   options.modalConfirm = false;
      // } else if (parent.getAttribute("modalConfirm") === "true") {
      //   options.modalConfirm = true;
      // }
      // if (parent.getAttribute("flipAnimation") === "false") {
      //   options.flipAnimation = false;
      // } else if (parent.getAttribute("flipAnimation") === "true") {
      //   options.flipAnimation = true;
      // }
      // if (typeof parent.getAttribute("removeBtnClass") === "string") {
      //   if (parent.getAttribute("removeBtnClass") === "false") {
      //     options.removeBtnClass = null;
      //   } else {
      //     options.removeBtnClass = parent.getAttribute("removeBtnClass");
      //   }
      // }
      // if (
      //   typeof parent.getAttribute("removeBtnWidth") === "string" &&
      //   parseInt(parent.getAttribute("removeBtnWidth")) > 0
      // ) {
      //   options.removeBtnWidth = parseInt(parent.getAttribute("removeBtnWidth"));
      // }
      // if (typeof parent.getAttribute("removeBtnColor") === "string") {
      //   options.removeBtnColor = parent.getAttribute("removeBtnColor");
      // }
      // if (typeof parent.getAttribute("removeBtnHoverColor") === "string") {
      //   options.removeBtnHoverColor = parent.getAttribute("removeBtnHoverColor");
      // }
      // if (typeof parent.getAttribute("removeBtnSharpness") === "string") {
      //   options.removeBtnSharpness = parent.getAttribute("removeBtnSharpness");
      // }
      // if (typeof parent.getAttribute("removeBtnPosition") === "string") {
      //   options.removeBtnPosition = parent.getAttribute("removeBtnPosition");
      // }
      // if (typeof parent.getAttribute("removeBtnBgColor") === "string") {
      //   options.removeBtnBgColor = parent.getAttribute("removeBtnBgColor");
      // }
      // if (typeof parent.getAttribute("removeBtnBgHoverColor") === "string") {
      //   options.removeBtnBgHoverColor = parent.getAttribute(
      //     "removeBtnBgHoverColor"
      //   );
      // }
      // if (
      //   typeof parent.getAttribute("removeBtnMargin") === "string" &&
      //   !isNaN(parseInt(parent.getAttribute("removeBtnMargin")))
      // ) {
      //   options.removeBtnMargin = parseInt(
      //     parent.getAttribute("removeBtnMargin")
      //   );
      // }
      // if (typeof parent.getAttribute("modalText") === "string") {
      //   options.modalText = parent.getAttribute("modalText");
      // }
      // if (typeof parent.getAttribute("removeAlertText") === "string") {
      //   options.removeAlertText = parent.getAttribute("removeAlertText");
      // }
      // if (typeof parent.getAttribute("addAlertText") === "string") {
      //   options.addAlertText = parent.getAttribute("addAlertText");
      // }
      // if (parent.getAttribute("showAddAlerts") === "true") {
      //   options.showAddAlerts = true;
      // } else if (parent.getAttribute("showAddAlerts") === "false") {
      //   options.showAddAlerts = false;
      // }
      // if (parent.getAttribute("showRemoveAlerts") === "true") {
      //   options.showRemoveAlerts = true;
      // } else if (parent.getAttribute("showRemoveAlerts") === "false") {
      //   options.showRemoveAlerts = false;
      // }
      // if (parent.getAttribute("removeBtnCircle") === "true") {
      //   options.removeBtnCircle = true;
      // } else if (parent.getAttribute("removeBtnCircle") === "false") {
      //   options.removeBtnCircle = false;
      // }
      // if (parent.getAttribute("outlineItemOnHover") === "true") {
      //   options.outlineItemOnHover = true;
      // } else if (parent.getAttribute("outlineItemOnHover") === "false") {
      //   options.outlineItemOnHover = false;
      // }
      // if (
      //   typeof parent.getAttribute("nestingLevel") === "string" &&
      //   parseInt(parent.getAttribute("nestingLevel")) > 0
      // ) {
      //   options.nestingLevel = parseInt(parent.getAttribute("nestingLevel"));
      // }
      // if (
      //   typeof parent.getAttribute("flipAnimDuration") === "string" &&
      //   parseInt(parent.getAttribute("flipAnimDuration")) > 0
      // ) {
      //   options.flipAnimDuration = parseInt(
      //     parent.getAttribute("flipAnimDuration")
      //   );
      // }
      // let easeAttr = parent.getAttribute("flipAnimEasing");
      // if (typeof easeAttr === "string") {
      //   if (
      //     easeAttr !== "linear" &&
      //     easeAttr !== "ease" &&
      //     easeAttr !== "ease-in-out" &&
      //     easeAttr !== "ease-in" &&
      //     easeAttr !== "ease-out" &&
      //     easeAttr.indexOf("cubic-bezier(") === -1
      //   ) {
      //     console.error(
      //       " - Itemize error - \n 'flipAnimEasing' only accepts the pre-defined values 'linear', 'ease', 'ease-in', 'ease-out', and 'ease-in-out', or a custom 'cubic-bezier' value like 'cubic-bezier(0.42, 0, 0.58, 1)'. \n"
      //     );
      //   } else {
      //     options.flipAnimEasing = easeAttr;
      //   }
      // }
      // if (
      //   typeof parent.getAttribute("animRemoveTranslateX") === "string" &&
      //   !isNaN(parseInt(parent.getAttribute("animRemoveTranslateX")))
      // ) {
      //   options.animRemoveTranslateX = parseInt(
      //     parent.getAttribute("animRemoveTranslateX")
      //   );
      // }
      // if (
      //   typeof parent.getAttribute("animRemoveTranslateY") === "string" &&
      //   !isNaN(parseInt(parent.getAttribute("animRemoveTranslateY")))
      // ) {
      //   options.animRemoveTranslateY = parseInt(
      //     parent.getAttribute("animRemoveTranslateY")
      //   );
      // }
      // if (
      //   typeof parent.getAttribute("animAddTranslateY") === "string" &&
      //   !isNaN(parseInt(parent.getAttribute("animAddTranslateY")))
      // ) {
      //   options.animAddTranslateY = parseInt(
      //     parent.getAttribute("animAddTranslateY")
      //   );
      // }
      // if (
      //   typeof parent.getAttribute("animAddTranslateX") === "string" &&
      //   !isNaN(parseInt(parent.getAttribute("animAddTranslateX")))
      // ) {
      //   options.animAddTranslateX = parseInt(
      //     parent.getAttribute("animAddTranslateX")
      //   );
      // }
      // if (
      //   typeof parent.getAttribute("removeBtnThickness") === "string" &&
      //   parseInt(parent.getAttribute("removeBtnThickness")) > 0
      // ) {
      //   options.removeBtnThickness = parseInt(
      //     parent.getAttribute("removeBtnThickness")
      //   );
      // }


      return options;
    }
  }, {
    key: "makeId",
    value: function makeId(length) {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;

      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result;
    }
  }]);

  return Itemize;
}();

try {
  module.exports = Itemize;
} catch (_unused) {}