"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
 -- itemize.js v0.22 --
 -- (c) 2019 Kosmoon Studio --
 -- Released under the MIT license --
 */
var Itemize =
/*#__PURE__*/
function () {
  function Itemize(options) {
    _classCallCheck(this, Itemize);

    this.items = [];
    this.globalOptions = this.mergeOptions(options);
    this.alertNb = 0;
    var optionCheckResult = this.optionsTypeCheck(this.globalOptions);

    if (optionCheckResult !== "valid") {
      // check: option type error
      console.error("- Itemize - TYPE ERROR:\n" + optionCheckResult);
    } else {
      this.targetElements = this.getTargetElements();

      if (this.targetElements && this.targetElements.length > 0) {
        this.itemizeIt();
      } else {
        console.error("- Itemize - ERROR:\n Cannot find any DOM elements with the attribute 'itemize' \n");
      }
    }

    this.elPos = {};
  }

  _createClass(Itemize, [{
    key: "getTargetElements",
    value: function getTargetElements() {
      try {
        return document.querySelectorAll("[itemize]");
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

      if (typeof parent.getAttribute("modalText") === "string") {
        options.modalText = parent.getAttribute("modalText");
      }

      if (typeof parent.getAttribute("removeAlertText") === "string") {
        options.removeAlertText = parent.getAttribute("removeAlertText");
      }

      if (typeof parent.getAttribute("addAlertText") === "string") {
        options.removeAlertText = parent.getAttribute("addAlertText");
      }

      if (typeof parent.getAttribute("alertPosition") === "string") {
        options.alertPosition = parent.getAttribute("alertPosition");
      }

      if (typeof parent.getAttribute("flipAnimDuration") === "string" && parseInt(parent.getAttribute("flipAnimDuration")) > 0) {
        options.flipAnimDuration = parseInt(parent.getAttribute("flipAnimDuration"));
      }

      if (typeof parent.getAttribute("removeBtnThickness") === "string" && parseInt(parent.getAttribute("removeBtnThickness")) > 0) {
        options.removeBtnThickness = parseInt(parent.getAttribute("removeBtnThickness"));
      }

      return options;
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
                            // check si le child n'est pas in element deja added qui passe par un flipAnim
                            newNode = false;
                          }
                        });

                        if (newNode) {
                          if (node.getAttribute("notItemize")) {
                            console.log("nouvel element not itemize added");
                          } else {
                            scope.itemizeChild(node, node.parentNode, true);
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
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }
              };

              var observer = new MutationObserver(callback);
              observer.observe(parent, config); // Later, you can stop observing
              // observer.disconnect();
            })();
          }

          var oldStyle = document.querySelector(this.target + " .itemize_style");

          if (oldStyle) {
            parent.querySelector(".itemize_style").remove();
          }

          var css = document.createElement("style");
          css.classList.add("itemize_style");
          css.type = "text/css";
          var styles = "";

          if (parent.itemizeOptions.removeBtn && !parent.itemizeOptions.removeBtnClass) {
            styles += ".itemize_parent_".concat(parent.itemizeId, " .itemize_btn_remove{position:absolute;top:0!important;right:0!important;width:").concat(parent.itemizeOptions.removeBtnWidth, "px!important;height:").concat(parent.itemizeOptions.removeBtnWidth, "px!important;overflow:hidden;cursor:pointer;margin-top:5px;margin-right:5px}.itemize_parent_").concat(parent.itemizeId, " .itemize_btn_remove:hover::after,.itemize_parent_").concat(parent.itemizeId, " .itemize_btn_remove:hover::before{background:").concat(parent.itemizeOptions.removeBtnHoverColor, "}.itemize_parent_").concat(parent.itemizeId, " .itemize_btn_remove::after,.itemize_parent_").concat(parent.itemizeId, " .itemize_btn_remove::before{content:'';position:absolute;height:").concat(parent.itemizeOptions.removeBtnThickness, "px;width:").concat(parent.itemizeOptions.removeBtnWidth, "px;top:50%;left:0;margin-top:").concat(parent.itemizeOptions.removeBtnThickness * 0.5 < 1 ? -1 : -parent.itemizeOptions.removeBtnThickness * 0.5, "px;background:").concat(parent.itemizeOptions.removeBtnColor, ";border-radius:").concat(parent.itemizeOptions.removeBtnSharpness, "}.itemize_parent_").concat(parent.itemizeId, " .itemize_btn_remove::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.itemize_parent_").concat(parent.itemizeId, " .itemize_btn_remove::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}");
          }

          if (css.styleSheet) {
            css.styleSheet.cssText = styles;
          } else {
            css.appendChild(document.createTextNode(styles));
          }

          parent.appendChild(css);

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

      if (child.type !== "text/css" && typeof child.getAttribute("notItemize") !== "string") {
        if (!child.itemizeId) {
          child.itemizeId = this.makeId(8);
        }

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
            button.classList.add("itemize_btn_remove");

            button.onclick = function () {
              if (parent.itemizeOptions.modalConfirm) {
                console.log(child.itemizeId);

                _this2.modalConfirm(child.itemizeId);
              } else {
                _this2.remove(child.itemizeId);
              }
            };

            child.appendChild(button);
          } else {
            var _button = document.querySelector(".itemize_item_" + child.itemizeId + " ." + parent.itemizeOptions.removeBtnClass);

            if (!_button) {
              knownErrors += "Cannot find specified class: " + parent.itemizeOptions.removeBtnClass + "\n";
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
    key: "modalConfirm",
    value: function modalConfirm(el) {
      var _this3 = this;

      try {
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
        var body = document.querySelector("body");
        var bodyInitialOverflow = body.style.overflow;
        body.style.overflow = "hidden";
        backDrop.classList.add("itemize_modal_backdrop");
        modal.classList.add("itemize_modal");
        alertText.classList.add("itemize_modal_text");
        btnConfirm.classList.add("itemize_modal_btnConfirm");
        btnCancel.classList.add("itemize_modal_btnCancel");
        alertText.textContent = item.parentNode.itemizeOptions.modalText;
        btnConfirm.innerHTML = "Yes";
        btnCancel.innerHTML = "Cancel";
        btnContainer.appendChild(btnCancel);
        btnContainer.appendChild(btnConfirm);
        modal.appendChild(alertText);
        modal.appendChild(btnContainer);

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
          setTimeout(function () {
            bdy.removeChild(bckdrop);
            bdy.removeChild(mdal);
            bdy.style.overflow = bodyInitialOverflow;
          }, 300);
        };

        backDrop.onclick = function () {
          hideModal(body, backDrop, modal);
        };

        btnCancel.onclick = function () {
          hideModal(body, backDrop, modal);
        };

        btnConfirm.onclick = function () {
          hideModal(body, backDrop, modal);

          _this3.remove(el);
        };

        Object.assign(modal.style, {
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
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "helvetica",
          zIndex: 1000000
        });
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
          color: "#FFFFFF"
        });
        Object.assign(btnConfirm.style, {
          background: "#F94336",
          border: "none",
          padding: "10px 0 10px 0",
          borderTopRightRadius: "4px",
          borderBottomRightRadius: "4px",
          flex: "1 0 auto",
          cursor: "pointer",
          color: "#FFFFFF"
        });
        Object.assign(backDrop.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0,0.5)",
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

      if (element.parentNode.itemizeOptions.showAlert) {
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
        var alertTimerDuration = element.parentNode.itemizeOptions.alertTimer;

        if (element.parentNode.itemizeOptions.alertPosition === "bottom-center") {
          alertLeftPos = "50%";
          alertTopPos = "100%";
          alertTranslateX = "-50%";
        } else if (element.parentNode.itemizeOptions.alertPosition === "bottom-right") {
          alertLeftPos = "100%";
          alertTopPos = "100%";
          alertTranslateX = "-100%";
        } else if (element.parentNode.itemizeOptions.alertPosition === "bottom-left") {
          alertLeftPos = "0%";
          alertTopPos = "100%";
          alertTranslateX = "0%";
        } else if (element.parentNode.itemizeOptions.alertPosition === "top-center") {
          alertLeftPos = "50%";
          alertTopPos = "0%";
          alertTranslateX = "-50%";
          minusOrNothing = "";
          alertIsTop = true;
        } else if (element.parentNode.itemizeOptions.alertPosition === "top-right") {
          alertLeftPos = "100%";
          alertTopPos = "0%";
          alertTranslateX = "-100%";
          minusOrNothing = "";
          alertIsTop = true;
        } else if (element.parentNode.itemizeOptions.alertPosition === "top-left") {
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
          alertTextContent = element.parentNode.itemizeOptions.removeAlertText;
        } else if (action === "added") {
          alertClassName = "itemize_add_alert";
          alertTextClassName = "itemize_add_alert_text";
          alertBackground = "#00AF66";
          alertTimerColor = "#80D7B3";
          alertTextContent = element.parentNode.itemizeOptions.addAlertText;
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
        console.log(alertIsTop ? 100 : 0);
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

              if (typeof confirmRemove.then === "function") {
                confirmRemove.then(function (response) {
                  console.log(response);

                  if (item.parentNode.itemizeOptions.flipAnimation) {
                    var closeBtn = item.querySelector(".itemize_btn_remove");

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
                    item.parentNode.removeChild(item);

                    _this5.items.splice(item.arrayPosition, 1);
                  }
                }).catch(function (err) {
                  console.log(err);
                  item.removeStatus = null;
                });
              } else if (confirmRemove) {
                if (item.parentNode.itemizeOptions.flipAnimation) {
                  var closeBtn = item.querySelector(".itemize_btn_remove");

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
                  item.parentNode.removeChild(item);
                  this.items.splice(item.arrayPosition, 1);
                }
              }
            } else {
              if (item.parentNode.itemizeOptions.flipAnimation) {
                var _closeBtn = item.querySelector(".itemize_btn_remove");

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
                item.parentNode.removeChild(item);
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
      elem.parentNode.appendChild(elem);
      var newPos = elem.getBoundingClientRect();
      var oldPos = this.elPos[elem.itemizeId];
      var deltaX = oldPos.x - newPos.x;
      var deltaY = oldPos.y - newPos.y;
      elem.animate([{
        transform: "translate(".concat(deltaX, "px, ").concat(deltaY, "px)"),
        opacity: 1
      }, {
        transform: "translate(".concat(deltaX + 50, "px, ").concat(deltaY, "px)"),
        opacity: 0
      }], {
        duration: elem.parentNode.itemizeOptions.flipAnimDuration,
        easing: "ease-in-out",
        fill: "both"
      });
      setTimeout(function () {
        elem.removeStatus = null;
        elem.parentNode.removeChild(elem);
      }, elem.parentNode.itemizeOptions.flipAnimDuration);
    }
  }, {
    key: "flipRead",
    value: function flipRead(elems) {
      this.elPos = {};

      for (var i = 0; i < elems.length; i++) {
        this.elPos[elems[i].itemizeId] = elems[i].getBoundingClientRect();
      }
    }
  }, {
    key: "flipPlay",
    value: function flipPlay(elems) {
      for (var i = 0; i < elems.length; i++) {
        var newPos = elems[i].getBoundingClientRect();
        var oldPos = this.elPos[elems[i].itemizeId];
        var deltaX = oldPos.x - newPos.x;
        var deltaY = oldPos.y - newPos.y;
        var deltaW = oldPos.width / newPos.width;
        var deltaH = oldPos.height / newPos.height;
        elems[i].animate([{
          transform: "translate(".concat(deltaX, "px, ").concat(deltaY, "px) scale(").concat(deltaW, ", ").concat(deltaH, ")")
        }, {
          transform: "none"
        }], {
          duration: elems[i].parentNode.itemizeOptions.flipAnimDuration,
          easing: "ease-in-out",
          fill: "both"
        });
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
          removeBtnColor: "#525252",
          removeBtnHoverColor: "#000000",
          removeBtnSharpness: "100%",
          removeBtnClass: null,
          showAlert: true,
          modalConfirm: false,
          modalText: "Are you sure to remove this item?",
          removeAlertText: "Item removed",
          addAlertText: "Item added",
          alertPosition: "bottom-center",
          alertTimer: 4000,
          flipAnimation: true,
          flipAnimDuration: 500,
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

      if (typeof options.showAlert !== "boolean") {
        error += "option 'showAlert' must be a Boolean\n";
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

      if (typeof options.modalText !== "string") {
        error += "option 'modalText' must be a String\n";
      }

      if (typeof options.removeAlertText !== "string") {
        error += "option 'removeAlertText' must be a String\n";
      }

      if (typeof options.addAlertText !== "string") {
        error += "option 'addAlertText' must be a String\n";
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