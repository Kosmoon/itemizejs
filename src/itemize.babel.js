"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
 -- itemize.js v0.32 --
 -- (c) 2019 Kosmoon Studio --
 -- Released under the MIT license --
 */
var Itemize =
/*#__PURE__*/
function () {
  function Itemize(options, target) {
    _classCallCheck(this, Itemize);

    this.items = [];
    this.globalOptions = this.mergeOptions(options);
    this.alertNb = 0;
    this.target = target;
    this.modalDisappearTimeout = null;
    var optionCheckResult = this.optionsTypeCheck(this.globalOptions);

    if (optionCheckResult !== "valid") {
      // check: option type error
      console.error("- Itemize - TYPE ERROR:\n" + optionCheckResult);
    } else {
      this.targetElements = this.getTargetElements(this.target);

      if (this.targetElements && this.targetElements.length > 0) {
        this.clearObservers();
        this.itemizeIt();
      } else {
        console.error("- Itemize - ERROR:\n Cannot find any valid target\n");
      }
    }

    this.elPos = {};
  }

  _createClass(Itemize, [{
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
    key: "getOptionsFromAttributes",
    value: function getOptionsFromAttributes(parent, options) {
      if (parent.getAttribute("removeBtn") === "false") {
        options.removeBtn = false;
      } else if (parent.getAttribute("removeBtn") === "true") {
        options.removeBtn = true;
      }

      if (parent.getAttribute("modalConfirm") === "false") {
        options.modalConfirm = false;
      } else if (parent.getAttribute("modalConfirm") === "true") {
        options.modalConfirm = true;
      }

      if (parent.getAttribute("flipAnimation") === "false") {
        options.flipAnimation = false;
      } else if (parent.getAttribute("flipAnimation") === "true") {
        options.flipAnimation = true;
      }

      if (typeof parent.getAttribute("removeBtnClass") === "string") {
        if (parent.getAttribute("removeBtnClass") === "false") {
          options.removeBtnClass = null;
        } else {
          options.removeBtnClass = parent.getAttribute("removeBtnClass");
        }
      }

      if (typeof parent.getAttribute("removeBtnWidth") === "string" && parseInt(parent.getAttribute("removeBtnWidth")) > 0) {
        options.removeBtnWidth = parseInt(parent.getAttribute("removeBtnWidth"));
      }

      if (typeof parent.getAttribute("removeBtnColor") === "string") {
        options.removeBtnColor = parent.getAttribute("removeBtnColor");
      }

      if (typeof parent.getAttribute("removeBtnHoverColor") === "string") {
        options.removeBtnHoverColor = parent.getAttribute("removeBtnHoverColor");
      }

      if (typeof parent.getAttribute("removeBtnSharpness") === "string") {
        options.removeBtnSharpness = parent.getAttribute("removeBtnSharpness");
      }

      if (typeof parent.getAttribute("removeBtnPosition") === "string") {
        options.removeBtnPosition = parent.getAttribute("removeBtnPosition");
      }

      if (typeof parent.getAttribute("removeBtnBgColor") === "string") {
        options.removeBtnBgColor = parent.getAttribute("removeBtnBgColor");
      }

      if (typeof parent.getAttribute("removeBtnBgHoverColor") === "string") {
        options.removeBtnBgHoverColor = parent.getAttribute("removeBtnBgHoverColor");
      }

      if (typeof parent.getAttribute("removeBtnMargin") === "string" && parseInt(parent.getAttribute("removeBtnMargin")) !== NaN) {
        options.removeBtnMargin = parseInt(parent.getAttribute("removeBtnMargin"));
      }

      if (typeof parent.getAttribute("modalText") === "string") {
        options.modalText = parent.getAttribute("modalText");
      }

      if (typeof parent.getAttribute("removeAlertText") === "string") {
        options.removeAlertText = parent.getAttribute("removeAlertText");
      }

      if (typeof parent.getAttribute("addAlertText") === "string") {
        options.addAlertText = parent.getAttribute("addAlertText");
      }

      if (parent.getAttribute("showAddAlerts") === "true") {
        options.showAddAlerts = true;
      } else if (parent.getAttribute("showAddAlerts") === "false") {
        options.showAddAlerts = false;
      }

      if (parent.getAttribute("showRemoveAlerts") === "true") {
        options.showRemoveAlerts = true;
      } else if (parent.getAttribute("showRemoveAlerts") === "false") {
        options.showRemoveAlerts = false;
      }

      if (parent.getAttribute("removeBtnCircle") === "true") {
        options.removeBtnCircle = true;
      } else if (parent.getAttribute("removeBtnCircle") === "false") {
        options.removeBtnCircle = false;
      }

      if (typeof parent.getAttribute("alertPosition") === "string") {
        options.alertPosition = parent.getAttribute("alertPosition");
      }

      if (typeof parent.getAttribute("flipAnimDuration") === "string" && parseInt(parent.getAttribute("flipAnimDuration")) > 0) {
        options.flipAnimDuration = parseInt(parent.getAttribute("flipAnimDuration"));
      }

      if (typeof parent.getAttribute("animRemoveTranslateX") === "string" && parseInt(parent.getAttribute("animRemoveTranslateX")) !== NaN) {
        options.animRemoveTranslateX = parseInt(parent.getAttribute("animRemoveTranslateX"));
      }

      if (typeof parent.getAttribute("animRemoveTranslateY") === "string" && parseInt(parent.getAttribute("animRemoveTranslateY")) !== NaN) {
        options.animRemoveTranslateY = parseInt(parent.getAttribute("animRemoveTranslateY"));
      }

      if (typeof parent.getAttribute("animAddTranslateY") === "string" && parseInt(parent.getAttribute("animAddTranslateY")) !== NaN) {
        options.animAddTranslateY = parseInt(parent.getAttribute("animAddTranslateY"));
      }

      if (typeof parent.getAttribute("animAddTranslateX") === "string" && parseInt(parent.getAttribute("animAddTranslateX")) !== NaN) {
        options.animAddTranslateX = parseInt(parent.getAttribute("animAddTranslateX"));
      }

      if (typeof parent.getAttribute("removeBtnThickness") === "string" && parseInt(parent.getAttribute("removeBtnThickness")) > 0) {
        options.removeBtnThickness = parseInt(parent.getAttribute("removeBtnThickness"));
      }

      return options;
    }
  }, {
    key: "clearObservers",
    value: function clearObservers() {
      if (window.itemizeObservers) {
        for (var i = window.itemizeObservers.length - 1; i >= 0; i--) {
          window.itemizeObservers[i].disconnect();
          window.itemizeObservers.splice(i, 1);
        }
      }
    }
  }, {
    key: "itemizeIt",
    value: function itemizeIt(withoutObs) {
      var _this = this;

      var knownErrors = "";

      try {
        for (var i = 0; i < this.targetElements.length; i++) {
          var parent = this.targetElements[i];
          var parentItemizeId = this.makeId(8);
          parent.itemizeId = parentItemizeId;

          for (var _i = parent.classList.length - 1; _i >= 0; _i--) {
            // cleaning parent of itemize_parent_xxxx classes
            if (parent.classList[_i].indexOf("itemize_parent") !== -1) {
              parent.classList.remove(parent.classList[_i]);
            }
          }

          parent.classList.add("itemize_parent_".concat(parentItemizeId)); // refresh parent with a new itemizeId class

          var options = Object.assign({}, this.globalOptions); // cloning options

          options = this.getOptionsFromAttributes(parent, options);
          parent.itemizeOptions = options; // node added OBSERVER

          if (!withoutObs) {
            (function () {
              var config = {
                attributes: true,
                childList: true,
                subtree: true
              };
              var scope = _this;

              var callback = function callback(mutationsList, observer) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = mutationsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var mutation = _step.value;

                    if (mutation.type == "childList") {
                      mutation.addedNodes.forEach(function (node) {
                        var newNode = true;
                        node.classList.forEach(function (className) {
                          if (className.indexOf("itemize_") !== -1) {
                            // check si le child n'est pas un element deja added qui passe par un flipAnim
                            newNode = false;
                          }
                        });

                        if (newNode) {
                          if (node.getAttribute("notItemize")) {
                            console.log("not itemize element added");
                          } else {
                            if (node.parentElement.itemizeOptions.flipAnimation) {
                              node.classList.add("itemize_hide");
                              scope.itemizeChild(node, node.parentElement, true);
                              scope.flipRead(scope.items);
                              scope.flipAdd(node);
                              scope.flipPlay(scope.items);
                            } else {
                              scope.itemizeChild(node, node.parentElement, true);
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
              window.itemizeObservers[window.itemizeObservers.length - 1].itemizeId = parent.itemizeId;
            })();
          }

          this.applyCss(parent);

          for (var z = 0; z < parent.children.length; z++) {
            var child = parent.children[z];
            this.itemizeChild(child, parent);
          }
        }
      } catch (error) {
        console.error("- Itemize - ERROR:\n" + knownErrors);
        console.error(error);
      }
    }
  }, {
    key: "itemizeChild",
    value: function itemizeChild(child, parent, fromObserver) {
      var _this2 = this;

      window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

      if (child.type !== "text/css" && typeof child.getAttribute("notItemize") !== "string" && !child.itemizeId) {
        child.itemizeId = this.makeId(8);
        this.items.push(child);
        child.classList.add("itemize_item_" + child.itemizeId);

        if (!parent.itemizeOptions.removeBtn) {
          child.onclick = function () {
            if (parent.itemizeOptions.modalConfirm) {
              _this2.modalConfirm(child.itemizeId);
            } else {
              _this2.remove(child.itemizeId);
            }
          };
        } else {
          if (!parent.itemizeOptions.removeBtnClass) {
            child.style.position = "relative";
            var button = document.createElement("div");
            button.classList.add("itemize_btn_" + child.itemizeId);
            button.classList.add("itemize_remove_btn");

            button.onclick = function () {
              if (parent.itemizeOptions.modalConfirm) {
                _this2.modalConfirm(child.itemizeId);
              } else {
                _this2.remove(child.itemizeId);
              }
            };

            child.appendChild(button);
          } else {
            var _button = document.querySelector(".itemize_item_" + child.itemizeId + " ." + parent.itemizeOptions.removeBtnClass);

            if (!_button) {
              knownErrors += "Cannot find specified button's class: " + parent.itemizeOptions.removeBtnClass + "\n";
            }

            _button.onclick = function () {
              if (parent.itemizeOptions.modalConfirm) {
                _this2.modalConfirm(child.itemizeId);
              } else {
                _this2.remove(child.itemizeId);
              }
            };
          }
        }

        if (fromObserver) {
          this.showAlert("added", child);
        }
      }
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
      var styles = "";

      if (options.removeBtn && !options.removeBtnClass) {
        // remove btn styles
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

        styles += ".itemize_parent_".concat(parent.itemizeId, " .itemize_remove_btn{position:absolute;top:").concat(btnPos.top, "!important;right:").concat(btnPos.right, "!important;bottom:").concat(btnPos.bottom, "!important;left:").concat(btnPos.left, "!important;width:").concat(options.removeBtnWidth, "px!important;height:").concat(options.removeBtnWidth, "px!important;overflow:hidden;cursor:pointer;margin:").concat(btnPos.marginTop, " ").concat(btnPos.marginRight, " ").concat(btnPos.marginBottom, " ").concat(btnPos.marginLeft, ";transform:").concat(btnPos.transform, ";border-radius:").concat(options.removeBtnCircle ? "50%" : "0%", ";background-color:").concat(options.removeBtnBgColor, "}.itemize_remove_btn:hover{background-color:").concat(options.removeBtnBgHoverColor, "}.itemize_parent_").concat(parent.itemizeId, " .itemize_remove_btn:hover::after,.itemize_parent_").concat(parent.itemizeId, " .itemize_remove_btn:hover::before{transition:background 0.2s ease-in-out;background:").concat(options.removeBtnHoverColor, "}.itemize_parent_").concat(parent.itemizeId, " .itemize_remove_btn::after,.itemize_parent_").concat(parent.itemizeId, " .itemize_remove_btn::before{content:'';position:absolute;height:").concat(options.removeBtnThickness, "px;transition:background 0.2s ease-in-out;width:").concat(options.removeBtnWidth / (options.removeBtnCircle ? 2 : 1), "px;top:50%;left:").concat(options.removeBtnCircle ? "25%" : 0, ";margin-top:").concat(options.removeBtnThickness * 0.5 < 1 ? -1 : -options.removeBtnThickness * 0.5, "px;background:").concat(options.removeBtnColor, ";border-radius:").concat(options.removeBtnSharpness, "}.itemize_parent_").concat(parent.itemizeId, " .itemize_remove_btn::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.itemize_parent_").concat(parent.itemizeId, " .itemize_remove_btn::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}");
      } else {
        // global parent styles
        styles += ".itemize_parent_".concat(parent.itemizeId, " .itemize_hide{display:none}");
      }

      if (css.styleSheet) {
        css.styleSheet.cssText = styles;
      } else {
        css.appendChild(document.createTextNode(styles));
      }

      parent.appendChild(css);
    }
  }, {
    key: "modalConfirm",
    value: function modalConfirm(el) {
      var _this3 = this;

      try {
        var _Object$assign;

        var item = null;

        if (typeof el === "string") {
          for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].itemizeId === el) {
              item = this.items[i];
            }
          }

          if (!item) {
            item = document.querySelector(el);

            if (!item || !item.itemizeId) {
              throw new Error("Not a valid Itemize element1, cannot create a confirm modal.");
            }
          }

          if (!item) {
            throw new Error("No item found2, cannot create a confirm modal.");
          }
        } else {
          item = elem;

          if (!item) {
            throw new Error("No item found3, cannot create a confirm modal.");
          }

          if (!item.itemizeId) {
            throw new Error("Not a valid Itemize element4, cannot create a confirm modal.");
          }
        }

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
        alertText.textContent = item.parentElement.itemizeOptions.modalText;
        btnConfirm.innerHTML = "Yes";
        btnCancel.innerHTML = "Cancel";
        btnContainer.appendChild(btnCancel);
        btnContainer.appendChild(btnConfirm);
        modal.appendChild(alertText);
        modal.appendChild(btnContainer);
        modal.appendChild(crossClose);

        var hideModal = function hideModal(bdy, bckdrop, mdal) {
          bckdrop.animate([{
            opacity: 1
          }, {
            opacity: 0
          }], {
            duration: 300,
            easing: "ease-in-out",
            fill: "both"
          });
          mdal.animate([{
            opacity: 1,
            transform: "translateY(-50%) translateX(-50%)"
          }, {
            opacity: 0,
            transform: "translateY(0%) translateX(-50%)"
          }], {
            duration: 300,
            easing: "cubic-bezier(.75,-0.5,0,1.75)",
            fill: "both"
          });
          clearTimeout(_this3.modalDisappearTimeout);
          _this3.modalDisappearTimeout = setTimeout(function () {
            bdy.removeChild(bckdrop);
            bdy.removeChild(mdal); // bdy.style.overflow = bodyInitialOverflow;
          }, 300);
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

            _this3.remove(el);
          }

          btnConfirm.clicked = true;
        };

        crossClose.onclick = function () {
          if (!crossClose.clicked) {
            hideModal(body, backDrop, modal);
          }

          crossClose.clicked = true;
        };

        Object.assign(modal.style, (_Object$assign = {
          display: "block",
          position: "fixed ",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "25px",
          background: "#FFFFFF",
          width: "90vw",
          maxWidth: "500px",
          borderRadius: "4px",
          boxSizing: "border-box"
        }, _defineProperty(_Object$assign, "display", "flex"), _defineProperty(_Object$assign, "flexDirection", "column"), _defineProperty(_Object$assign, "justifyContent", "center"), _defineProperty(_Object$assign, "textAlign", "center"), _defineProperty(_Object$assign, "fontFamily", "helvetica"), _defineProperty(_Object$assign, "zIndex", 1000000), _Object$assign));
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
          zIndex: 100000
        });
        body.prepend(modal);
        body.prepend(backDrop);
        backDrop.animate([{
          opacity: 0
        }, {
          opacity: 1
        }], {
          duration: 300,
          easing: "ease-in-out",
          fill: "both"
        });
        modal.animate([{
          opacity: 0,
          transform: "translateY(-100%) translateX(-50%)"
        }, {
          opacity: 1,
          transform: "translateY(-50%) translateX(-50%)"
        }], {
          duration: 400,
          easing: "cubic-bezier(.75,-0.5,0,1.75)",
          fill: "both"
        });
      } catch (error) {
        console.error("- Itemize - ERROR:\n" + error);
      }
    }
  }, {
    key: "showAlert",
    value: function showAlert(action, element) {
      var _this4 = this;

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
        popAlert.alertNb = this.alertNb;
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
        alertTimer.animate([{
          width: "100%"
        }, {
          width: "0%"
        }], {
          duration: alertTimerDuration,
          easing: "linear",
          fill: "both"
        });
        setTimeout(function () {
          var alertList = document.querySelectorAll(".itemize_alert");

          for (var i = 0; i < alertList.length; i++) {
            if (alertList[i].alertNb > 0) {
              alertList[i].animate([{
                transform: "translate(".concat(alertTranslateX, ", ").concat(minusOrNothing).concat(alertList[i].alertNb * 100 - (alertIsTop ? 100 : 0), "%)")
              }, {
                transform: "translate(".concat(alertTranslateX, ", ").concat(minusOrNothing).concat(alertList[i].alertNb * 100 - (alertIsTop ? 100 : 0) - 100, "%)")
              }], {
                duration: 300,
                easing: "ease-in-out",
                fill: "both"
              });
              alertList[i].alertNb--;
            }
          }

          _this4.alertNb--;
          setTimeout(function () {
            document.querySelector("body").removeChild(popAlert);
          }, 300);
        }, alertTimerDuration);
      }
    }
  }, {
    key: "remove",
    value: function remove(el) {
      var _this5 = this;

      try {
        var item = null;

        if (typeof el === "string") {
          for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].itemizeId === el) {
              item = this.items[i];
              item.arrayPosition = i;
            }
          }

          if (!item) {
            item = document.querySelector(el);

            if (!item || !item.itemizeId) {
              throw new Error("Not a valid Itemize element");
            }

            for (var _i2 = 0; _i2 < this.items.length; _i2++) {
              if (this.items[_i2].itemizeId === item.itemizeId) {
                item.arrayPosition = _i2;
              }
            }
          }

          if (!item) {
            throw new Error("No item found to remove");
          }
        } else {
          item = el;

          if (!item) {
            throw new Error("No item found to remove");
          }

          if (!item.itemizeId) {
            throw new Error("Not a valid Itemize element");
          }

          for (var _i3 = 0; _i3 < this.items.length; _i3++) {
            if (item.itemizeId === this.items[_i3].itemizeId) {
              item.arrayPosition = _i3;
            }
          }
        }

        if (item.arrayPosition || item.arrayPosition === 0) {
          if (!item.removeStatus || item.removeStatus !== "pending") {
            if (this.globalOptions.beforeRemove) {
              item.removeStatus = "pending";
              var confirmRemove = this.globalOptions.beforeRemove(item);

              if (confirmRemove == undefined) {
                throw new Error('The function "beforeErase" must return a Boolean or a Promise');
              }

              if (typeof confirmRemove.then === "function") {
                confirmRemove.then(function (response) {
                  if (item.parentElement.itemizeOptions.flipAnimation) {
                    var closeBtn = item.querySelector(".itemize_remove_btn");

                    if (closeBtn) {
                      closeBtn.onclick = null;
                    } else {
                      closeBtn = item.querySelector("." + _this5.globalOptions.removeBtnClass);

                      if (closeBtn) {
                        closeBtn.onclick = null;
                      }
                    }

                    _this5.showAlert("removed", item);

                    _this5.flipRead(_this5.items);

                    _this5.flipRemove(item);

                    _this5.items.splice(item.arrayPosition, 1);

                    _this5.flipPlay(_this5.items);
                  } else {
                    _this5.showAlert("removed", item);

                    item.removeStatus = null;
                    item.parentElement.removeChild(item);

                    _this5.items.splice(item.arrayPosition, 1);
                  }
                })["catch"](function (err) {
                  console.log(err);
                  item.removeStatus = null;
                });
              } else if (confirmRemove) {
                if (item.parentElement.itemizeOptions.flipAnimation) {
                  var closeBtn = item.querySelector(".itemize_remove_btn");

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
                  this.items.splice(item.arrayPosition, 1);
                  this.flipPlay(this.items);
                } else {
                  this.showAlert("removed", item);
                  item.removeStatus = null;
                  item.parentElement.removeChild(item);
                  this.items.splice(item.arrayPosition, 1);
                }
              }
            } else {
              if (item.parentElement.itemizeOptions.flipAnimation) {
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
                this.items.splice(item.arrayPosition, 1);
                this.flipPlay(this.items);
              } else {
                this.showAlert("removed", item);
                item.removeStatus = null;
                item.parentElement.removeChild(item);
                this.items.splice(item.arrayPosition, 1);
              }
            }
          }
        } else {
          throw new Error("this element has an invalid itemizeId");
        }
      } catch (error) {
        console.error("- Itemize - ERROR:\n" + error);
      }
    }
  }, {
    key: "flipRemove",
    value: function flipRemove(elem) {
      elem.parentElement.appendChild(elem);
      var options = elem.parentElement.itemizeOptions;
      var newPos = elem.getBoundingClientRect();
      var oldPos = this.elPos[elem.itemizeId];
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
          duration: options.flipAnimDuration,
          easing: "ease-in-out",
          fill: "both"
        });
      } else {
        var animIt = function animIt(timestamp) {
          var progress;
          var duration = options.flipAnimDuration;

          if (!elem.startAnimTime) {
            elem.startAnimTime = timestamp;
            elem.animTicks = 0;
            elem.style.transform = "translateX(".concat(deltaX, "px) translateY(").concat(deltaY, "px)");
            elem.style.opacity = 1;
          }

          progress = timestamp - elem.startAnimTime;
          elem.style.transform = "translate(".concat(deltaX + options.animRemoveTranslateX / (duration * 60 / 1000) * elem.animTicks, "px, ").concat(deltaY + options.animRemoveTranslateY / (duration * 60 / 1000) * elem.animTicks, "px)");
          elem.style.opacity = 1 - 1 / (duration * 60 / 1000) * elem.animTicks;

          if (progress < duration) {
            elem.animTicks++;
            requestAnimationFrame(animIt);
          } else {
            elem.startAnimTime = null;
            elem.animTicks = 0;
          }
        };

        requestAnimationFrame(animIt);
      }

      setTimeout(function () {
        elem.removeStatus = null;
        elem.parentElement.removeChild(elem);
      }, options.flipAnimDuration);
    }
  }, {
    key: "flipAdd",
    value: function flipAdd(elem) {
      elem.classList.remove("itemize_hide");
      elem.inAddAnim = true;
      this.elPos[elem.itemizeId] = elem.oldAddPos || elem.getBoundingClientRect();
      var options = elem.parentElement.itemizeOptions;
      var newPos = elem.getBoundingClientRect();
      var oldPos = elem.oldAddPos || this.elPos[elem.itemizeId];
      var deltaX = oldPos.left - newPos.left;
      var deltaY = oldPos.top - newPos.top;
      var deltaW = oldPos.width / newPos.width;
      var deltaH = oldPos.height / newPos.height;

      if (isNaN(deltaW)) {
        deltaW = 1;
      }

      if (isNaN(deltaH)) {
        deltaH = 1;
      }

      elem.newAddPos = newPos;
      elem.oldAddPos = oldPos;
      elem.animate([{
        transform: "translate(".concat(deltaX + options.animAddTranslateX, "px, ").concat(deltaY + options.animAddTranslateY, "px) scale(").concat(deltaW, ", ").concat(deltaH, ")"),
        opacity: 0
      }, {
        transform: "none",
        opacity: 1
      }], {
        duration: options.flipAnimDuration,
        easing: "ease-in-out",
        fill: "both"
      });
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
        this.elPos[elems[i].itemizeId] = elems[i].getBoundingClientRect();
      }
    }
  }, {
    key: "flipPlay",
    value: function flipPlay(elems) {
      var _this6 = this;

      var _loop = function _loop(i) {
        if (!elems[i].inAddAnim) {
          var newPos = elems[i].getBoundingClientRect();
          var oldPos = _this6.elPos[elems[i].itemizeId];
          var deltaX = oldPos.left - newPos.left;
          var deltaY = oldPos.top - newPos.top;
          var deltaW = oldPos.width / newPos.width;
          var deltaH = oldPos.height / newPos.height;

          if (isNaN(deltaW)) {
            deltaW = 1;
          }

          if (isNaN(deltaH)) {
            deltaH = 1;
          }

          if (deltaX !== 0 || deltaY !== 0 || deltaW !== 1 || deltaH !== 1) {
            elems[i].inAnim = true;

            if (elems[i].animate) {
              elems[i].animate([{
                transform: "translate(".concat(deltaX, "px, ").concat(deltaY, "px) scale(").concat(deltaW, ", ").concat(deltaH, ")")
              }, {
                transform: "none"
              }], {
                duration: elems[i].parentElement.itemizeOptions.flipAnimDuration,
                easing: "ease-in-out",
                fill: "both"
              });
            } else {
              var animIt = function animIt(timestamp) {
                var progress;
                var duration = elems[i].parentElement.itemizeOptions.flipAnimDuration;

                if (!elems[i].startAnimTime) {
                  elems[i].startAnimTime = timestamp;
                  elems[i].animTicks = 0;
                  elems[i].style.transform = "translate(".concat(deltaX, "px, ").concat(deltaY, "px)");
                }

                progress = timestamp - elems[i].startAnimTime;
                elems[i].style.transform = "translate(".concat(deltaX - deltaX / (duration * 60 / 1000) * elems[i].animTicks, "px, ").concat(deltaY - deltaY / (duration * 60 / 1000) * elems[i].animTicks, "px) ");

                if (progress < duration) {
                  elems[i].animTicks++;
                  requestAnimationFrame(animIt);
                } else {
                  elems[i].startAnimTime = null;
                  elems[i].animTicks = 0;
                  elems[i].style.transform = "none";
                }
              };

              requestAnimationFrame(animIt);
            }

            setTimeout(function () {
              elems[i].inAnim = false;
            }, elems[i].parentElement.itemizeOptions.flipAnimDuration);
          }
        }
      };

      for (var i = 0; i < elems.length; i++) {
        _loop(i);
      }
    }
  }, {
    key: "mergeOptions",
    value: function mergeOptions(newOptions) {
      try {
        var defaultOptions = {
          removeBtn: true,
          removeBtnWidth: 18,
          removeBtnThickness: 2,
          removeBtnColor: "#696969",
          removeBtnHoverColor: "#000000",
          removeBtnSharpness: "0px",
          removeBtnPosition: "top-right",
          removeBtnMargin: 2,
          removeBtnCircle: false,
          removeBtnBgColor: "none",
          removeBtnBgHoverColor: "none",
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
          animRemoveTranslateX: 0,
          animRemoveTranslateY: -100,
          animAddTranslateX: 0,
          animAddTranslateY: 0,
          flipAnimDuration: 400,
          beforeRemove: null
        };

        for (var key in newOptions) {
          if (newOptions.hasOwnProperty(key)) defaultOptions[key] = newOptions[key];
        }

        return defaultOptions;
      } catch (error) {
        console.error(error);
      }
    }
  }, {
    key: "optionsTypeCheck",
    value: function optionsTypeCheck(options) {
      var error = "";

      if (typeof options.removeBtn !== "boolean") {
        error += "option 'button' must be a Boolean\n";
      }

      if (typeof options.modalConfirm !== "boolean") {
        error += "option 'modalConfirm' must be a Boolean\n";
      }

      if (typeof options.removeBtnWidth !== "number") {
        error += "option 'removeBtnWidth' must be a Number\n";
      }

      if (typeof options.removeBtnThickness !== "number") {
        error += "option 'removeBtnThickness' must be a Number\n";
      }

      if (typeof options.alertTimer !== "number") {
        error += "option 'alertTimer' must be a Number\n";
      }

      if (options.removeBtnClass && typeof options.removeBtnClass !== "string") {
        error += "option 'buttonClass' must be a String\n";
      }

      if (typeof options.removeBtnHoverColor !== "string") {
        error += "option 'removeBtnHoverColor' must be a String\n";
      }

      if (typeof options.removeBtnSharpness !== "string") {
        error += "option 'removeBtnSharpness' must be a String\n";
      }

      if (typeof options.removeBtnPosition !== "string") {
        error += "option 'removeBtnPosition' must be a String\n";
      }

      if (typeof options.removeBtnBgColor !== "string") {
        error += "option 'removeBtnBgColor' must be a String\n";
      }

      if (typeof options.removeBtnBgHoverColor !== "string") {
        error += "option 'removeBtnBgHoverColor' must be a String\n";
      }

      if (typeof options.removeBtnCircle !== "boolean") {
        error += "option 'removeBtnCircle' must be a Boolean\n";
      }

      if (typeof options.removeBtnMargin !== "number") {
        error += "option 'removeBtnMargin' must be a Number\n";
      }

      if (typeof options.modalText !== "string") {
        error += "option 'modalText' must be a String\n";
      }

      if (typeof options.removeAlertText !== "string") {
        error += "option 'removeAlertText' must be a String\n";
      }

      if (typeof options.addAlertText !== "string") {
        error += "option 'addAlertText' must be a String\n";
      }

      if (typeof options.showRemoveAlerts !== "boolean") {
        error += "option 'showRemoveAlerts' must be a Boolean\n";
      }

      if (typeof options.showAddAlerts !== "boolean") {
        error += "option 'showAddAlerts' must be a Boolean\n";
      }

      if (typeof options.alertPosition !== "string") {
        error += "option 'alertPosition' must be a String\n";
      }

      if (typeof options.flipAnimation !== "boolean") {
        error += "option 'flipAnimation' must be a Boolean\n";
      }

      if (typeof options.flipAnimDuration !== "number") {
        error += "option 'flipAnimDuration' must be a Number\n";
      }

      if (typeof options.animRemoveTranslateX !== "number") {
        error += "option 'animRemoveTranslateX' must be a Number\n";
      }

      if (typeof options.animRemoveTranslateY !== "number") {
        error += "option 'animRemoveTranslateY' must be a Number\n";
      }

      if (typeof options.animAddTranslateY !== "number") {
        error += "option 'animAddTranslateY' must be a Number\n";
      }

      if (typeof options.animAddTranslateX !== "number") {
        error += "option 'animAddTranslateX' must be a Number\n";
      }

      if (options.beforeRemove && typeof options.beforeRemove !== "function") {
        error += "option 'beforeRemove' must be a Function\n";
      }

      if (error === "") {
        return "valid";
      } else {
        return error;
      }
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