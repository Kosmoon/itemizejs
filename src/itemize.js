/*
 -- itemize.js v0.32 --
 -- (c) 2019 Kosmoon Studio --
 -- Released under the MIT license --
 */

class Itemize {
  constructor(options, target) {
    this.items = [];
    this.globalOptions = this.mergeOptions(options);
    this.alertNb = 0;
    this.target = target;
    this.flipPlayIds = {};
    this.modalDisappearTimeout = null;
    let optionCheckResult = this.optionsTypeCheck(this.globalOptions);
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

  getTargetElements(target) {
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
  getOptionsFromAttributes(parent, options) {
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
    if (
      typeof parent.getAttribute("removeBtnWidth") === "string" &&
      parseInt(parent.getAttribute("removeBtnWidth")) > 0
    ) {
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
      options.removeBtnBgHoverColor = parent.getAttribute(
        "removeBtnBgHoverColor"
      );
    }
    if (
      typeof parent.getAttribute("removeBtnMargin") === "string" &&
      parseInt(parent.getAttribute("removeBtnMargin")) !== NaN
    ) {
      options.removeBtnMargin = parseInt(
        parent.getAttribute("removeBtnMargin")
      );
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
    if (
      typeof parent.getAttribute("flipAnimDuration") === "string" &&
      parseInt(parent.getAttribute("flipAnimDuration")) > 0
    ) {
      options.flipAnimDuration = parseInt(
        parent.getAttribute("flipAnimDuration")
      );
    }
    if (
      typeof parent.getAttribute("animRemoveTranslateX") === "string" &&
      parseInt(parent.getAttribute("animRemoveTranslateX")) !== NaN
    ) {
      options.animRemoveTranslateX = parseInt(
        parent.getAttribute("animRemoveTranslateX")
      );
    }
    if (
      typeof parent.getAttribute("animRemoveTranslateY") === "string" &&
      parseInt(parent.getAttribute("animRemoveTranslateY")) !== NaN
    ) {
      options.animRemoveTranslateY = parseInt(
        parent.getAttribute("animRemoveTranslateY")
      );
    }
    if (
      typeof parent.getAttribute("animAddTranslateY") === "string" &&
      parseInt(parent.getAttribute("animAddTranslateY")) !== NaN
    ) {
      options.animAddTranslateY = parseInt(
        parent.getAttribute("animAddTranslateY")
      );
    }
    if (
      typeof parent.getAttribute("animAddTranslateX") === "string" &&
      parseInt(parent.getAttribute("animAddTranslateX")) !== NaN
    ) {
      options.animAddTranslateX = parseInt(
        parent.getAttribute("animAddTranslateX")
      );
    }
    if (
      typeof parent.getAttribute("removeBtnThickness") === "string" &&
      parseInt(parent.getAttribute("removeBtnThickness")) > 0
    ) {
      options.removeBtnThickness = parseInt(
        parent.getAttribute("removeBtnThickness")
      );
    }
    return options;
  }
  clearObservers() {
    if (window.itemizeObservers) {
      for (let i = window.itemizeObservers.length - 1; i >= 0; i--) {
        window.itemizeObservers[i].disconnect();
        window.itemizeObservers.splice(i, 1);
      }
    }
  }
  itemizeIt(withoutObs) {
    let knownErrors = "";
    try {
      for (let i = 0; i < this.targetElements.length; i++) {
        let parent = this.targetElements[i];
        let parentItemizeId = this.makeId(8);
        parent.itemizeId = parentItemizeId;
        for (let i = parent.classList.length - 1; i >= 0; i--) {
          // cleaning parent of itemize_parent_xxxx classes
          if (parent.classList[i].indexOf("itemize_parent") !== -1) {
            parent.classList.remove(parent.classList[i]);
          }
        }
        parent.classList.add(`itemize_parent_${parentItemizeId}`); // refresh parent with a new itemizeId class
        let options = Object.assign({}, this.globalOptions); // cloning options
        options = this.getOptionsFromAttributes(parent, options);
        parent.itemizeOptions = options;
        // node added OBSERVER
        if (!withoutObs) {
          let config = { attributes: true, childList: true, subtree: true };
          let scope = this;
          let callback = function(mutationsList, observer) {
            for (var mutation of mutationsList) {
              if (mutation.type == "childList") {
                mutation.addedNodes.forEach(node => {
                  let newNode = true;
                  node.classList.forEach(className => {
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
                        scope.flipPlay(
                          scope.items,
                          node.parentElement.itemizeOptions.flipAnimDuration
                        );
                      } else {
                        scope.itemizeChild(node, node.parentElement, true);
                      }
                    }
                  }
                });
              }
            }
          };
          if (window.itemizeObservers) {
            // ajout des observer de facon global et suppression/deconnection quand parent n'est plus present
            window.itemizeObservers.push(new MutationObserver(callback));
          } else {
            window.itemizeObservers = [new MutationObserver(callback)];
          }
          window.itemizeObservers[window.itemizeObservers.length - 1].observe(
            parent,
            config
          );
          window.itemizeObservers[
            window.itemizeObservers.length - 1
          ].itemizeId = parent.itemizeId;
        }
        this.applyCss(parent);
        for (let z = 0; z < parent.children.length; z++) {
          let child = parent.children[z];
          this.itemizeChild(child, parent);
        }
      }
    } catch (error) {
      console.error("- Itemize - ERROR:\n" + knownErrors);
      console.error(error);
    }
  }
  itemizeChild(child, parent, fromObserver) {
    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;

    if (
      child.type !== "text/css" &&
      typeof child.getAttribute("notItemize") !== "string" &&
      !child.itemizeId
    ) {
      child.itemizeId = this.makeId(8);
      this.items.push(child);
      child.classList.add("itemize_item_" + child.itemizeId);
      if (!parent.itemizeOptions.removeBtn) {
        child.onclick = () => {
          if (parent.itemizeOptions.modalConfirm) {
            this.modalConfirm(child.itemizeId);
          } else {
            this.remove(child.itemizeId);
          }
        };
      } else {
        if (!parent.itemizeOptions.removeBtnClass) {
          child.style.position = "relative";
          const button = document.createElement("div");
          button.classList.add("itemize_btn_" + child.itemizeId);
          button.classList.add("itemize_remove_btn");
          button.onclick = () => {
            if (parent.itemizeOptions.modalConfirm) {
              this.modalConfirm(child.itemizeId);
            } else {
              this.remove(child.itemizeId);
            }
          };
          child.appendChild(button);
        } else {
          const button = document.querySelector(
            ".itemize_item_" +
              child.itemizeId +
              " ." +
              parent.itemizeOptions.removeBtnClass
          );
          if (!button) {
            knownErrors +=
              "Cannot find specified button's class: " +
              parent.itemizeOptions.removeBtnClass +
              "\n";
          }
          button.onclick = () => {
            if (parent.itemizeOptions.modalConfirm) {
              this.modalConfirm(child.itemizeId);
            } else {
              this.remove(child.itemizeId);
            }
          };
        }
      }
      if (fromObserver) {
        this.showAlert("added", child);
      }
    }
  }
  applyCss(parent) {
    let options = parent.itemizeOptions;
    let oldStyle = parent.querySelector(".itemize_style");
    if (oldStyle) {
      parent.querySelector(".itemize_style").remove();
    }
    let css = document.createElement("style");
    css.classList.add("itemize_style");
    css.type = "text/css";
    let styles = "";
    // parent global styles
    styles += `.itemize_parent_${parent.itemizeId} .itemize_hide{display:none}`;
    // remove btn styles
    if (options.removeBtn && !options.removeBtnClass) {
      let btnMargin = options.removeBtnMargin + "px";
      let btnPos = {
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
      styles += `.itemize_parent_${
        parent.itemizeId
      } .itemize_remove_btn{position:absolute;top:${
        btnPos.top
      }!important;right:${btnPos.right}!important;bottom:${
        btnPos.bottom
      }!important;left:${btnPos.left}!important;width:${
        options.removeBtnWidth
      }px!important;height:${
        options.removeBtnWidth
      }px!important;overflow:hidden;cursor:pointer;margin:${btnPos.marginTop} ${
        btnPos.marginRight
      } ${btnPos.marginBottom} ${btnPos.marginLeft};transform:${
        btnPos.transform
      };border-radius:${
        options.removeBtnCircle ? "50%" : "0%"
      };background-color:${
        options.removeBtnBgColor
      }}.itemize_remove_btn:hover{background-color:${
        options.removeBtnBgHoverColor
      }}.itemize_parent_${
        parent.itemizeId
      } .itemize_remove_btn:hover::after,.itemize_parent_${
        parent.itemizeId
      } .itemize_remove_btn:hover::before{transition:background 0.2s ease-in-out;background:${
        options.removeBtnHoverColor
      }}.itemize_parent_${
        parent.itemizeId
      } .itemize_remove_btn::after,.itemize_parent_${
        parent.itemizeId
      } .itemize_remove_btn::before{content:'';position:absolute;height:${
        options.removeBtnThickness
      }px;transition:background 0.2s ease-in-out;width:${options.removeBtnWidth /
        2}px;top:50%;left:25%;margin-top:${
        options.removeBtnThickness * 0.5 < 1
          ? -1
          : -options.removeBtnThickness * 0.5
      }px;background:${options.removeBtnColor};border-radius:${
        options.removeBtnSharpness
      }}.itemize_parent_${
        parent.itemizeId
      } .itemize_remove_btn::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.itemize_parent_${
        parent.itemizeId
      } .itemize_remove_btn::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}`;
    }
    if (css.styleSheet) {
      css.styleSheet.cssText = styles;
    } else {
      css.appendChild(document.createTextNode(styles));
    }
    parent.appendChild(css);
  }
  modalConfirm(el) {
    try {
      let item = null;
      if (typeof el === "string") {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].itemizeId === el) {
            item = this.items[i];
          }
        }
        if (!item) {
          item = document.querySelector(el);
          if (!item || !item.itemizeId) {
            throw new Error(
              "Not a valid Itemize element, cannot create a confirm modal."
            );
          }
        }
        if (!item) {
          throw new Error("No item found, cannot create a confirm modal.");
        }
      } else {
        item = elem;
        if (!item) {
          throw new Error("No item found, cannot create a confirm modal.");
        }
        if (!item.itemizeId) {
          throw new Error(
            "Not a valid Itemize element, cannot create a confirm modal."
          );
        }
      }
      const modalAnimDuration = 150;
      const backDrop = document.createElement("div");
      const modal = document.createElement("div");
      const alertText = document.createElement("div");
      const btnContainer = document.createElement("div");
      const btnConfirm = document.createElement("button");
      const btnCancel = document.createElement("button");
      const crossClose = document.createElement("div");
      const body = document.querySelector("body");
      // const bodyInitialOverflow = body.style.overflow;
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
      let hideModal = (bdy, bckdrop, mdal) => {
        bckdrop.onclick = null;
        mdal.onclick = null;
        if (bckdrop.animate) {
          bckdrop.animate(
            [
              {
                opacity: 1
              },
              {
                opacity: 0
              }
            ],
            {
              duration: modalAnimDuration,
              easing: "ease-in-out",
              fill: "both"
            }
          );
        } else {
          this.animateRAF(
            bckdrop,
            [{ opacity: 1 }],
            [{ opacity: 0 }],
            modalAnimDuration
          );
          // function animBckdrop(timestamp) {
          //   let progress;
          //   let duration = modalAnimDuration;
          //   if (!modal.startAnimTime) {
          //     modal.startAnimTime = timestamp;
          //     modal.animTicks = 0;
          //     modal.style.opacity = 1;
          //   }
          //   progress = timestamp - modal.startAnimTime;
          //   modal.style.opacity =
          //     1 - (1 / ((duration * 60) / 1000)) * modal.animTicks;

          //   if (progress < duration) {
          //     modal.animTicks++;
          //     requestAnimationFrame(animBckdrop);
          //   } else {
          //     modal.startAnimTime = null;
          //     modal.animTicks = 0;
          //   }
          // }
          // requestAnimationFrame(animBckdrop);
        }
        if (mdal.animate) {
          mdal.animate(
            [
              {
                opacity: 1,
                transform: "translateY(-50%) translateX(-50%)"
              },
              {
                opacity: 0,
                transform: "translateY(0%) translateX(-50%)"
              }
            ],
            {
              duration: modalAnimDuration,
              easing: "ease-in-out",
              fill: "both"
            }
          );
        } else {
          this.animateRAF(
            mdal,
            [
              {
                opacity: 1,
                transform: { translateX: -50, translateY: -50, unit: "%" }
              }
            ],
            [
              {
                opacity: 0,
                transform: { translateX: -50, translateY: 0, unit: "%" }
              }
            ],
            modalAnimDuration
          );
          // function animMdal(timestamp) {
          //   let progress;
          //   let duration = modalAnimDuration;
          //   if (!mdal.startAnimTime) {
          //     mdal.startAnimTime = timestamp;
          //     mdal.animTicks = 0;
          //     mdal.style.opacity = 1;
          //     mdal.style.transform = "translateY(-50%) translateX(-50%)";
          //   }
          //   progress = timestamp - mdal.startAnimTime;
          //   mdal.style.opacity =
          //     1 - (1 / ((duration * 60) / 1000)) * mdal.animTicks;
          //   mdal.style.transform = `translateY(-${50 -
          //     (50 / ((duration * 60) / 1000)) *
          //       mdal.animTicks}%) translateX(-50%)`;
          //   if (progress < duration) {
          //     mdal.animTicks++;
          //     requestAnimationFrame(animMdal);
          //   } else {
          //     mdal.startAnimTime = null;
          //     mdal.animTicks = 0;
          //   }
          // }
          // requestAnimationFrame(animMdal);
        }

        clearTimeout(this.modalDisappearTimeout);
        this.modalDisappearTimeout = setTimeout(() => {
          bdy.removeChild(bckdrop);
          bdy.removeChild(mdal);
          // bdy.style.overflow = bodyInitialOverflow;
        }, modalAnimDuration);
      };
      backDrop.onclick = () => {
        if (!backDrop.hiding) {
          hideModal(body, backDrop, modal);
        }
        backDrop.hiding = true;
      };
      btnCancel.onclick = () => {
        if (!btnCancel.clicked) {
          hideModal(body, backDrop, modal);
        }
        btnCancel.clicked = true;
      };
      btnConfirm.onclick = () => {
        if (!btnConfirm.clicked) {
          hideModal(body, backDrop, modal);
          this.remove(el);
        }
        btnConfirm.clicked = true;
      };
      crossClose.onclick = () => {
        if (!crossClose.clicked) {
          hideModal(body, backDrop, modal);
        }
        crossClose.clicked = true;
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

      let modalCss =
        ".itemize_modal_btnConfirm:hover{ background-color: #c83e34 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_btnCancel:hover{ background-color: #4a5055 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_cross {cursor:pointer;position: absolute;right: 5px;top: 5px;width: 18px;height:18px;opacity:0.3;}.itemize_modal_cross:hover{opacity:1;}.itemize_modal_cross:before,.itemize_modal_cross:after{position:absolute;left:9px;content:' ';height: 19px;width:2px;background-color:#333;}.itemize_modal_cross:before{transform:rotate(45deg);}.itemize_modal_cross:after{transform:rotate(-45deg);}";
      let styleEl = document.createElement("style");

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
      if (backDrop.animate) {
        backDrop.animate(
          [
            {
              opacity: 0
            },
            {
              opacity: 1
            }
          ],
          {
            duration: 300,
            easing: "ease-out",
            fill: "both"
          }
        );
      } else {
        this.animateRAF(
          backDrop,
          [
            {
              opacity: 0
            }
          ],
          [
            {
              opacity: 1
            }
          ],
          modalAnimDuration
        );
        // function animBackDrop(timestamp) {
        //   let progress;
        //   let duration = modalAnimDuration;
        //   if (!backDrop.startAnimTime) {
        //     backDrop.startAnimTime = timestamp;
        //     backDrop.animTicks = 0;
        //     backDrop.style.opacity = 0;
        //   }
        //   progress = timestamp - backDrop.startAnimTime;
        //   backDrop.style.opacity =
        //     0 + (1 / ((duration * 60) / 1000)) * backDrop.animTicks;
        //   if (progress < duration) {
        //     backDrop.animTicks++;
        //     requestAnimationFrame(animBackDrop);
        //   } else {
        //     backDrop.startAnimTime = null;
        //     backDrop.animTicks = 0;
        //   }
        // }
        // requestAnimationFrame(animBackDrop);
      }
      if (modal.animate) {
        modal.animate(
          [
            {
              opacity: 0,
              transform: "translateY(-100%) translateX(-50%)"
            },
            {
              opacity: 1,
              transform: "translateY(-50%) translateX(-50%)"
            }
          ],
          {
            duration: modalAnimDuration,
            easing: "ease-in",
            fill: "both"
          }
        );
      } else {
        this.animateRAF(
          modal,
          [
            {
              opacity: 0,
              transform: { translateX: -50, translateY: -100, unit: "%" }
            }
          ],
          [
            {
              opacity: 1,
              transform: { translateX: -50, translateY: -50, unit: "%" }
            }
          ],
          modalAnimDuration
        );
        // function animModal(timestamp) {
        //   let progress;
        //   let duration = modalAnimDuration;
        //   if (!modal.startAnimTime) {
        //     modal.startAnimTime = timestamp;
        //     modal.animTicks = 0;
        //     modal.style.opacity = 0;
        //     modal.style.transform = "translateY(-100%) translateX(-50%)";
        //   }
        //   progress = timestamp - modal.startAnimTime;
        //   modal.style.opacity =
        //     0 + (1 / ((duration * 60) / 1000)) * modal.animTicks;
        //   modal.style.transform = `translateY(-${100 -
        //     (50 / ((duration * 60) / 1000)) *
        //       modal.animTicks}%) translateX(-50%)`;
        //   if (progress < duration) {
        //     modal.animTicks++;
        //     requestAnimationFrame(animModal);
        //   } else {
        //     modal.startAnimTime = null;
        //     modal.animTicks = 0;
        //   }
        // }
        // requestAnimationFrame(animModal);
      }
    } catch (error) {
      console.error("- Itemize - ERROR:\n" + error);
    }
  }

  showAlert(action, element) {
    if (
      (element.parentElement.itemizeOptions.showAddAlerts &&
        action === "added") ||
      (element.parentElement.itemizeOptions.showRemoveAlerts &&
        action === "removed")
    ) {
      let alertClassName = "";
      let alertTextClassName = "";
      let alertBackground = "";
      let alertTimerColor = "";
      let alertTextContent = "";
      let alertLeftPos = "";
      let alertTopPos = "";
      let alertTranslateX = "";
      let minusOrNothing = "-";
      let alertIsTop = false;
      let alertTimerDuration = element.parentElement.itemizeOptions.alertTimer;
      if (
        element.parentElement.itemizeOptions.alertPosition === "bottom-center"
      ) {
        alertLeftPos = "50%";
        alertTopPos = "100%";
        alertTranslateX = "-50%";
      } else if (
        element.parentElement.itemizeOptions.alertPosition === "bottom-right"
      ) {
        alertLeftPos = "100%";
        alertTopPos = "100%";
        alertTranslateX = "-100%";
      } else if (
        element.parentElement.itemizeOptions.alertPosition === "bottom-left"
      ) {
        alertLeftPos = "0%";
        alertTopPos = "100%";
        alertTranslateX = "0%";
      } else if (
        element.parentElement.itemizeOptions.alertPosition === "top-center"
      ) {
        alertLeftPos = "50%";
        alertTopPos = "0%";
        alertTranslateX = "-50%";
        minusOrNothing = "";
        alertIsTop = true;
      } else if (
        element.parentElement.itemizeOptions.alertPosition === "top-right"
      ) {
        alertLeftPos = "100%";
        alertTopPos = "0%";
        alertTranslateX = "-100%";
        minusOrNothing = "";
        alertIsTop = true;
      } else if (
        element.parentElement.itemizeOptions.alertPosition === "top-left"
      ) {
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
      let popAlert = document.createElement("div");
      popAlert.alertId = this.alertNb;
      let alertTimer = document.createElement("div");
      let alertText = document.createElement("div");
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
        transform: `translate(${alertTranslateX}, ${minusOrNothing}${this
          .alertNb *
          100 -
          (alertIsTop ? 100 : 0)}%)`,
        fontFamily: "helvetica",
        background: alertBackground,
        color: "#FFFFFF",
        zIndex: 100000
      });
      document.querySelector("body").appendChild(popAlert);
      popAlert.appendChild(alertTimer);
      popAlert.appendChild(alertText);
      if (alertTimer.animate) {
        alertTimer.animate(
          [
            {
              width: "100%"
            },
            {
              width: "0%"
            }
          ],
          {
            duration: alertTimerDuration,
            easing: "linear",
            fill: "both"
          }
        );
      } else {
        this.animateRAF(
          alertTimer,
          [
            {
              width: { value: 100, unit: "%" }
            }
          ],
          [
            {
              width: { value: 0, unit: "%" }
            }
          ],
          alertTimerDuration
        );
        // function animAlertTimer(timestamp) {
        //   let progress;
        //   let duration = alertTimerDuration;
        //   if (!alertTimer.startAnimTime) {
        //     alertTimer.startAnimTime = timestamp;
        //     alertTimer.animTicks = 0;
        //     alertTimer.style.width = "100%";
        //   }
        //   progress = timestamp - alertTimer.startAnimTime;
        //   alertTimer.style.width = `${100 -
        //     (100 / ((duration * 60) / 1000)) * alertTimer.animTicks}%`;
        //   if (progress < duration) {
        //     alertTimer.animTicks++;
        //     requestAnimationFrame(animAlertTimer);
        //   } else {
        //     alertTimer.startAnimTime = null;
        //     alertTimer.animTicks = 0;
        //   }
        // }
        // requestAnimationFrame(animAlertTimer);
      }
      setTimeout(() => {
        let alertList = document.querySelectorAll(".itemize_alert");
        for (let i = 0; i < alertList.length; i++) {
          if (alertList[i].alertId > 0) {
            let translateYStart = parseInt(
              `${minusOrNothing}${alertList[i].alertId * 100 -
                (alertIsTop ? 100 : 0)}`
            );
            let translateYEnd = parseInt(
              `${minusOrNothing}${alertList[i].alertId * 100 -
                (alertIsTop ? 100 : 0) -
                100}`
            );
            if (alertList[i].animate) {
              alertList[i].animate(
                [
                  {
                    transform: `translate(${alertTranslateX}, ${translateYStart}%)`
                  },
                  {
                    transform: `translate(${alertTranslateX}, ${translateYEnd}%)`
                  }
                ],
                {
                  duration: 150,
                  easing: "ease-in-out",
                  fill: "both"
                }
              );
            } else {
              this.animateRAF(
                alertList[i],
                [
                  {
                    transform: {
                      translateX: parseInt(alertTranslateX),
                      translateY: translateYStart,
                      unit: "%"
                    }
                  }
                ],
                [
                  {
                    transform: {
                      translateX: parseInt(alertTranslateX),
                      translateY: translateYEnd,
                      unit: "%"
                    }
                  }
                ],
                150
              );
              // function animAlertHide(timestamp) {
              //   let progress;
              //   let duration = 300;
              //   if (!alertList[i].startAnimTime) {
              //     alertList[i].startAnimTime = timestamp;
              //     alertList[i].animTicks = 0;
              //     alertList[
              //       i
              //     ].style.transform = `translate(${alertTranslateX}, ${translateYStart}%)`;
              //   }
              //   progress = timestamp - alertList[i].startAnimTime;
              //   alertList[
              //     i
              //   ].style.transform = `translate(${alertTranslateX}, ${translateYStart -
              //     ((translateYStart - translateYEnd) /
              //       ((duration * 60) / 1000)) *
              //       alertList[i].animTicks}%)`;
              //   if (progress < duration) {
              //     alertList[i].animTicks++;
              //     requestAnimationFrame(animAlertHide);
              //   } else {
              //     alertList[i].startAnimTime = null;
              //     alertList[i].animTicks = 0;
              //   }
              // }
              // requestAnimationFrame(animAlertHide);
            }
            alertList[i].alertId--;
          }
        }
        this.alertNb--;
        setTimeout(() => {
          document.querySelector("body").removeChild(popAlert);
        }, 300);
      }, alertTimerDuration);
    }
  }

  remove(el) {
    try {
      let item = null;
      if (typeof el === "string") {
        for (let i = 0; i < this.items.length; i++) {
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
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].itemizeId === item.itemizeId) {
              item.arrayPosition = i;
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
        for (let i = 0; i < this.items.length; i++) {
          if (item.itemizeId === this.items[i].itemizeId) {
            item.arrayPosition = i;
          }
        }
      }
      if (item.arrayPosition || item.arrayPosition === 0) {
        if (!item.removeStatus || item.removeStatus !== "pending") {
          if (this.globalOptions.beforeRemove) {
            item.removeStatus = "pending";
            let confirmRemove = this.globalOptions.beforeRemove(item);
            if (confirmRemove == undefined) {
              throw new Error(
                'The function "beforeErase" must return a Boolean or a Promise'
              );
            }
            if (typeof confirmRemove.then === "function") {
              let animDuration =
                item.parentElement.itemizeOptions.flipAnimDuration;
              let onClickFn = item.onclick;
              item.onclick = null;
              confirmRemove
                .then(response => {
                  if (item.parentElement.itemizeOptions.flipAnimation) {
                    let closeBtn = item.querySelector(".itemize_remove_btn");
                    if (closeBtn) {
                      closeBtn.onclick = null;
                    } else {
                      closeBtn = item.querySelector(
                        "." + this.globalOptions.removeBtnClass
                      );
                      if (closeBtn) {
                        closeBtn.onclick = null;
                      }
                    }
                    this.showAlert("removed", item);
                    this.flipRead(this.items);
                    this.flipRemove(item);
                    this.items.splice(item.arrayPosition, 1);
                    setTimeout(() => {
                      this.flipPlay(this.items, animDuration);
                    }, animDuration);
                  } else {
                    this.showAlert("removed", item);
                    item.removeStatus = null;
                    item.parentElement.removeChild(item);
                    this.items.splice(item.arrayPosition, 1);
                  }
                })
                .catch(err => {
                  console.log(err);
                  item.onclick = onClickFn;
                  item.removeStatus = null;
                });
            } else if (confirmRemove) {
              if (item.parentElement.itemizeOptions.flipAnimation) {
                let animDuration =
                  item.parentElement.itemizeOptions.flipAnimDuration;
                let closeBtn = item.querySelector(".itemize_remove_btn");
                item.onclick = null;
                if (closeBtn) {
                  closeBtn.onclick = null;
                } else {
                  closeBtn = item.querySelector(
                    "." + this.globalOptions.removeBtnClass
                  );
                  if (closeBtn) {
                    closeBtn.onclick = null;
                  }
                }
                this.showAlert("removed", item);
                this.flipRead(this.items);
                this.flipRemove(item);
                this.items.splice(item.arrayPosition, 1);
                setTimeout(() => {
                  this.flipPlay(this.items, animDuration);
                }, animDuration);
              } else {
                this.showAlert("removed", item);
                item.removeStatus = null;
                item.parentElement.removeChild(item);
                this.items.splice(item.arrayPosition, 1);
              }
            }
          } else {
            if (item.parentElement.itemizeOptions.flipAnimation) {
              let animDuration =
                item.parentElement.itemizeOptions.flipAnimDuration;
              let closeBtn = item.querySelector(".itemize_remove_btn");
              if (closeBtn) {
                closeBtn.onclick = null;
              } else {
                closeBtn = item.querySelector(
                  "." + this.globalOptions.removeBtnClass
                );
                if (closeBtn) {
                  closeBtn.onclick = null;
                }
              }
              this.showAlert("removed", item);
              this.flipRead(this.items);
              this.flipRemove(item);
              this.items.splice(item.arrayPosition, 1);
              setTimeout(() => {
                this.flipPlay(this.items, animDuration * 0.5);
              }, animDuration * 0.5);
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
  animateRAF(elem, from, to, duration) {
    function anim(timestamp) {
      let progress;
      if (!elem.startAnimTime) {
        elem.startAnimTime = timestamp;
        elem.animTicks = 0;
        for (let i = 0; i < from.length; i++) {
          for (const key in from[i]) {
            if (from[i].hasOwnProperty(key)) {
              if (key === "transform") {
                elem.style.transform = `translateX(${from[i][key].translateX}${
                  from[i][key].unit
                }) translateY(${from[i][key].translateY}${from[i][key].unit})`;
              } else if (key === "opacity") {
                elem.style.opacity = from[i][key];
              } else {
                elem.style[key] = `${from[i][key].value}${from[i][key].unit}`;
              }
            }
          }
        }
      }
      progress = timestamp - elem.startAnimTime;
      for (let i = 0; i < to.length; i++) {
        for (const key in to[i]) {
          if (to[i].hasOwnProperty(key)) {
            if (key === "transform") {
              elem.style.transform = `translateX(${from[i][key].translateX -
                ((from[i][key].translateX - to[i][key].translateX) /
                  ((duration * 60) / 1000)) *
                  elem.animTicks}${to[i][key].unit}) translateY(${from[i][key]
                .translateY -
                ((from[i][key].translateY - to[i][key].translateY) /
                  ((duration * 60) / 1000)) *
                  elem.animTicks}${to[i][key].unit})`;
            } else if (key === "opacity") {
              elem.style.opacity =
                from[i][key] -
                ((from[i][key] - to[i][key]) / ((duration * 60) / 1000)) *
                  elem.animTicks;
            } else {
              elem.style[key] = `${from[i][key].value -
                ((from[i][key].value - to[i][key].value) /
                  ((duration * 60) / 1000)) *
                  elem.animTicks}${to[i][key].unit}`;
            }
          }
        }
      }
      console.log(duration);
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
  flipRemove(elem) {
    elem.onclick = null;
    // elem.parentElement.appendChild(elem);
    let options = elem.parentElement.itemizeOptions;
    const newPos = elem.getBoundingClientRect();
    const oldPos = this.elPos[elem.itemizeId];
    const deltaX = oldPos.left - newPos.left;
    const deltaY = oldPos.top - newPos.top;
    if (elem.animate) {
      elem.animate(
        [
          {
            transform: `translate(${deltaX}px, ${deltaY}px)`,
            opacity: 1
          },
          {
            transform: `translate(${deltaX +
              options.animRemoveTranslateX}px, ${deltaY +
              options.animRemoveTranslateY}px)`,
            opacity: 0
          }
        ],
        {
          duration: options.flipAnimDuration * 0.5,
          easing: "ease-in-out",
          fill: "both"
        }
      );
    } else {
      this.animateRAF(
        elem,
        [
          { opacity: 1 },
          { transform: { translateX: deltaX, translateY: deltaY, unit: "px" } }
        ],
        [
          { opacity: 0 },
          {
            transform: {
              translateX: deltaX + options.animRemoveTranslateX,
              translateY: deltaY + options.animRemoveTranslateY,
              unit: "px"
            }
          }
        ],
        options.flipAnimDuration * 0.5
      );
      // function flipRemoveRAF(timestamp) {
      //   let progress;
      //   let duration = options.flipAnimDuration;
      //   if (!elem.startAnimTime) {
      //     elem.startAnimTime = timestamp;
      //     elem.animTicks = 0;
      //     elem.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px)`;
      //     elem.style.opacity = 1;
      //   }
      //   progress = timestamp - elem.startAnimTime;
      //   elem.style.transform = `translate(${deltaX +
      //     (options.animRemoveTranslateX / ((duration * 60) / 1000)) *
      //       elem.animTicks}px, ${deltaY +
      //     (options.animRemoveTranslateY / ((duration * 60) / 1000)) *
      //       elem.animTicks}px)`;
      //   elem.style.opacity =
      //     1 - (1 / ((duration * 60) / 1000)) * elem.animTicks;
      //   if (progress < duration) {
      //     elem.animTicks++;
      //     requestAnimationFrame(flipRemoveRAF);
      //   } else {
      //     elem.startAnimTime = null;
      //     elem.animTicks = 0;
      //   }
      // }
      // requestAnimationFrame(flipRemoveRAF);
    }

    setTimeout(() => {
      elem.removeStatus = null;
      elem.parentElement.removeChild(elem);
    }, options.flipAnimDuration * 0.5);
  }
  flipAdd(elem) {
    elem.classList.remove("itemize_hide");
    elem.inAddAnim = true;
    this.elPos[elem.itemizeId] = elem.oldAddPos || elem.getBoundingClientRect();
    let options = elem.parentElement.itemizeOptions;
    const newPos = elem.getBoundingClientRect();
    const oldPos = elem.oldAddPos || this.elPos[elem.itemizeId];
    const deltaX = oldPos.left - newPos.left;
    const deltaY = oldPos.top - newPos.top;
    let deltaW = oldPos.width / newPos.width;
    let deltaH = oldPos.height / newPos.height;
    if (isNaN(deltaW)) {
      deltaW = 1;
    }
    if (isNaN(deltaH)) {
      deltaH = 1;
    }
    elem.newAddPos = newPos;
    elem.oldAddPos = oldPos;
    let translateXStart = deltaX + options.animAddTranslateX;
    let translateYStart = deltaY + options.animAddTranslateY;

    if (elem.animate) {
      elem.animate(
        [
          {
            transform: `translate(${translateXStart}px, ${translateYStart}px) scale(${deltaW}, ${deltaH})`,
            opacity: 0
          },
          {
            transform: "none",
            opacity: 1
          }
        ],
        {
          duration: options.flipAnimDuration,
          easing: "ease-in-out",
          fill: "both"
        }
      );
    } else {
      function flipAddRAF(timestamp) {
        let progress;
        let duration = options.flipAnimDuration;
        if (!elem.startAnimTime) {
          elem.startAnimTime = timestamp;
          elem.animTicks = 0;
          elem.style.opacity = 0;
          elem.style.transform = `translate(${translateXStart}px, ${translateYStart}px)`;
        }
        progress = timestamp - elem.startAnimTime;
        elem.style.opacity = `${(1 / ((duration * 60) / 1000)) *
          elem.animTicks}`;
        elem.style.transform = `translate(${translateXStart -
          (translateXStart / ((duration * 60) / 1000)) *
            elem.animTicks}px, ${translateYStart -
          (translateYStart / ((duration * 60) / 1000)) * elem.animTicks}px)`;
        if (progress < duration) {
          elem.animTicks++;
          requestAnimationFrame(flipAddRAF);
        } else {
          elem.startAnimTime = null;
          elem.animTicks = 0;
        }
      }
      requestAnimationFrame(flipAddRAF);
    }

    setTimeout(() => {
      elem.inAddAnim = false;
      elem.newAddPos = null;
      elem.oldPos = null;
    }, options.flipAnimDuration);
  }
  flipRead(elems) {
    // this.elPos = {};
    for (let i = 0; i < elems.length; i++) {
      this.elPos[elems[i].itemizeId] = elems[i].getBoundingClientRect();
    }
  }

  flipPlay(elems, duration) {
    for (let i = 0; i < elems.length; i++) {
      if (!elems[i].inAddAnim) {
        const newPos = elems[i].getBoundingClientRect();
        const oldPos = this.elPos[elems[i].itemizeId];
        const deltaX = oldPos.left - newPos.left;
        const deltaY = oldPos.top - newPos.top;
        let deltaW = oldPos.width / newPos.width;
        let deltaH = oldPos.height / newPos.height;
        if (isNaN(deltaW)) {
          deltaW = 1;
        }
        if (isNaN(deltaH)) {
          deltaH = 1;
        }
        if (deltaX !== 0 || deltaY !== 0 || deltaW !== 1 || deltaH !== 1) {
          elems[i].inAnim = true;
          if (elems[i].animate) {
            elems[i].animate(
              [
                {
                  transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`
                },
                {
                  transform: "none"
                }
              ],
              {
                duration: duration,
                easing: "ease-in-out",
                fill: "both"
              }
            );
          } else {
            function flipPlayRAF(timestamp) {
              let progress;
              if (!elems[i].startAnimTime) {
                elems[i].startAnimTime = timestamp;
                elems[i].animTicks = 0;
                elems[
                  i
                ].style.transform = `translate(${deltaX}px, ${deltaY}px)`;
              }
              progress = timestamp - elems[i].startAnimTime;
              elems[i].style.transform = `translate(${deltaX -
                (deltaX / ((duration * 60) / 1000)) *
                  elems[i].animTicks}px, ${deltaY -
                (deltaY / ((duration * 60) / 1000)) * elems[i].animTicks}px) `;
              if (progress < duration) {
                elems[i].animTicks++;
                requestAnimationFrame(flipPlayRAF);
              } else {
                this.currentFlipPlayRAF = null;
                elems[i].startAnimTime = null;
                elems[i].animTicks = 0;
                elems[i].style.transform = "none";
              }
            }
            requestAnimationFrame(flipPlayRAF);
          }
          setTimeout(() => {
            elems[i].inAnim = false;
          }, duration);
        }
      }
    }
  }

  mergeOptions(newOptions) {
    try {
      const defaultOptions = {
        removeBtn: true,
        removeBtnWidth: 20,
        removeBtnThickness: 2,
        removeBtnColor: "#565C67",
        removeBtnHoverColor: "#ffffff",
        removeBtnSharpness: "0px",
        removeBtnPosition: "top-right",
        removeBtnMargin: 2,
        removeBtnCircle: true,
        removeBtnBgColor: "#d1cfcf",
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
        animRemoveTranslateX: 0,
        animRemoveTranslateY: -100,
        animAddTranslateX: 0,
        animAddTranslateY: 0,
        flipAnimDuration: 500,
        beforeRemove: null
      };
      for (var key in newOptions) {
        if (newOptions.hasOwnProperty(key))
          defaultOptions[key] = newOptions[key];
      }
      return defaultOptions;
    } catch (error) {
      console.error(error);
    }
  }

  optionsTypeCheck(options) {
    let error = "";
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

  makeId(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
