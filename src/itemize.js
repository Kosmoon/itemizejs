/*
 -- itemize.js v0.65--
 -- (c) 2019 Kosmoon Studio --
 -- Released under the MIT license --
 */

if (typeof Object.assign != "function") {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) {
      // .length of function is 2
      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError("Cannot convert undefined or null to object");
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
class Itemize {
  constructor(options) {
    this.containers = [];
    this.items = [];
    this.globalOptions = this.mergeOptions(options);
    this.notificationNbs = {};
    this.modalDisappearTimeout = null;
    this.elPos = {};
    this.flipPlayId = "";
    this.elemToRemove = [];
    this.lastTargetedContainers = null;
    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    // let optionCheckResult = this.optionsTypeCheck(this.globalOptions);
    // if (optionCheckResult !== "valid") {
    //   console.error("- Itemize - TYPE error:\n" + optionCheckResult);
    // }
  }
  apply(target, options) {
    let opts = { ...this.globalOptions };
    if (typeof target === "object") {
      opts = this.mergeOptions(target);
      target = [null];
    } else {
      target = [target];
    }
    if (options) {
      opts = this.mergeOptions(options);
    }
    let childItemizedNb = 0;

    for (let i = 0; i < target.length; i++) {
      this.lastTargetedContainers = this.getTargetElements(target[i]);
      if (
        this.lastTargetedContainers &&
        this.lastTargetedContainers.length > 0
      ) {
        childItemizedNb += this.applyItemize(this.lastTargetedContainers, opts);
        let nestingApply = (containers, nestingLevel) => {
          let nestingNb = 1;
          if (containers.length > 0 && nestingNb < nestingLevel) {
            for (let i = 0; i < containers.length; i++) {
              childItemizedNb += this.applyItemize(
                containers[i].children,
                opts
              );
              nestingNb++;
              if (containers.length > 0 && nestingNb < nestingLevel) {
                nestingApply(containers[i].children, nestingLevel);
              }
            }
          }
        };
        nestingApply(this.lastTargetedContainers, opts.nestingLevel);
      } else {
        console.error(" - Itemize error - \n no valid target found.\n");
      }
    }
    console.log(
      "%c" + childItemizedNb + " element(s) itemized",
      "background: #060606; color:#1FEA00;padding:10px"
    );
    return childItemizedNb + " element(s) itemized";
  }
  cancel(target) {
    let unItemizedNb = 0;
    if (target) {
      if (!Array.isArray(target)) {
        target = [target];
      }
      for (let i = 0; i < target.length; i++) {
        this.lastTargetedContainers = this.getTargetElements(target[i]);
        if (
          this.lastTargetedContainers &&
          this.lastTargetedContainers.length > 0
        ) {
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

  clearObservers(parentId) {
    if (window.itemizeObservers) {
      for (let i = window.itemizeObservers.length - 1; i >= 0; i--) {
        let disconnect = false;
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
  applyItemize(parents, applyOptions) {
    let childItemizedNb = 0;
    let knownErrors = "";
    try {
      for (let i = 0; i < parents.length; i++) {
        let parent = parents[i];
        if (
          !parent.classList.contains("itemize_remove_btn") &&
          parent.type !== "text/css" &&
          parent.tagName !== "BR" &&
          parent.tagName !== "SCRIPT" &&
          parent.tagName !== "STYLE"
        ) {
          let parentInList = false;
          for (let p = 0; p < this.containers.length; p++) {
            if (
              parent.itemizeContainerId &&
              parent.itemizeContainerId ===
                this.containers[p].itemizeContainerId
            ) {
              parentInList = true;
              break;
            }
          }
          if (!parentInList) {
            this.containers.push(parent);
          }
          if (parent.itemizeContainerId) {
            this.clearObservers(parent.itemizeContainerId);
          }
          let parentItemizeId = this.makeId(8);
          parent.itemizeContainerId = parentItemizeId;
          for (let i = parent.classList.length - 1; i >= 0; i--) {
            // cleaning parent of itemize_parent_xxxx classes
            if (parent.classList[i].indexOf("itemize_parent") !== -1) {
              parent.classList.remove(parent.classList[i]);
              break;
            }
          }
          parent.classList.add(`itmz_parent`);
          parent.classList.add(`itemize_parent_${parentItemizeId}`);
          let options = { ...this.globalOptions }; // cloning options
          if (applyOptions) {
            options = this.mergeOptions(applyOptions);
          }
          options = this.getOptionsFromAttributes(parent, options);
          parent.itemizeOptions = options;
          // node added OBSERVER
          if (parent.itemizeOptions.itemizeAddedElement) {
            let config = {
              childList: true
            };
            let scope = this;
            let callback = function(mutationsList, observer) {
              for (let z = 0; z < mutationsList.length; z++) {
                let mutation = mutationsList[z];
                if (
                  mutation.type === "childList" &&
                  mutation.addedNodes.length > 0
                ) {
                  for (let x = 0; x < mutation.addedNodes.length; x++) {
                    let node = mutation.addedNodes[x];
                    let newNode = true;
                    if (node.classList) {
                      for (let y = 0; y < node.classList.length; y++) {
                        if (node.classList[y].indexOf("itemize_") !== -1) {
                          // check si le child n'est pas un element deja added qui passe par un flipAnim
                          newNode = false;
                        }
                      }
                      if (newNode) {
                        if (
                          !node.getAttribute("notitemize") &&
                          node.parentElement &&
                          node.type !== "text/css" &&
                          node.tagName !== "BR" &&
                          node.tagName !== "SCRIPT" &&
                          node.parentElement.itemizeContainerId &&
                          node.tagName !== "STYLE"
                        ) {
                          if (
                            node.parentElement.itemizeOptions &&
                            node.parentElement.itemizeOptions.anim
                          ) {
                            node.classList.add("itemize_hide");
                            scope.itemizeChild(node, node.parentElement, true);
                            scope.flipRead(scope.items);
                            scope.flipAdd(node);
                            scope.flipPlay(
                              scope.items,
                              node.parentElement.itemizeOptions.animDuration
                            );
                          } else {
                            scope.itemizeChild(node, node.parentElement, true);
                          }
                        }
                        if (parent.itemizeOptions.onAddItem) {
                          parent.itemizeOptions.onAddItem(node);
                        }
                      }
                    }
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
            window.itemizeObservers[window.itemizeObservers.length - 1].observe(
              parent,
              config
            );
            window.itemizeObservers[
              window.itemizeObservers.length - 1
            ].itemizeContainerId = parent.itemizeContainerId;
          }
          this.applyCss(parent);

          for (let z = 0; z < parent.children.length; z++) {
            let child = parent.children[z];
            if (this.itemizeChild(child, parent)) {
              childItemizedNb++;
            }
          }
        }
      }

      return childItemizedNb;
    } catch (error) {
      console.error(" - Itemize error - \n" + knownErrors);
      console.error(error);
    }
  }
  childIsItemizable(child, parent) {
    return (
      child.type !== "text/css" &&
      typeof child.getAttribute("notitemize") !== "string" &&
      child.tagName !== "BR" &&
      child.tagName !== "SCRIPT" &&
      !child.itemizeItemId &&
      !child.itemizeBtn &&
      !child.classList.contains("itemize_remove_btn") &&
      !(
        parent.parentNode.itemizeOptions &&
        child.classList.contains(
          parent.parentNode.itemizeOptions.removeBtnClass
        )
      )
    );
  }
  itemizeChild(child, parent, fromObserver) {
    if (this.childIsItemizable(child, parent)) {
      child.itemizeItemId = this.makeId(8);
      this.items.push(child);
      if (parent.itemizeItems) {
        parent.itemizeItems.push(child);
      } else {
        parent.itemizeItems = [child];
      }
      child.classList.add("itemize_item_" + child.itemizeItemId);
      child.classList.add("itmz_item");
      if (!parent.itemizeOptions.removeBtn) {
        child.onclick = e => {
          e.stopPropagation();
          if (parent.itemizeOptions.modalConfirm) {
            this.modalConfirm(child);
          } else {
            this.remove(child.itemizeItemId);
          }
        };
        if (parent.itemizeOptions.outlineItemOnHover) {
          this.shadowOnHover(child, false);
        }
      } else {
        if (!parent.itemizeOptions.removeBtnClass) {
          let computedStyle = getComputedStyle(child);
          if (
            child.style.position !== "absolute" &&
            child.style.position !== "fixed" &&
            computedStyle.position !== "absolute" &&
            computedStyle.position !== "fixed"
          ) {
            child.style.position = "relative";
          }

          const button = document.createElement("div");

          button.classList.add("itemize_btn_" + child.itemizeItemId);
          button.classList.add("itemize_remove_btn");
          button.itemizeBtn = true;
          button.onclick = e => {
            e.stopPropagation();
            if (parent.itemizeOptions.modalConfirm) {
              this.modalConfirm(child);
            } else {
              this.remove(child.itemizeItemId);
            }
          };
          child.appendChild(button);
          if (parent.itemizeOptions.outlineItemOnHover) {
            this.shadowOnHover(button, true);
          }
        } else {
          const button = document.querySelector(
            ".itemize_item_" +
              child.itemizeItemId +
              " ." +
              parent.itemizeOptions.removeBtnClass
          );
          if (!button) {
            console.error(
              " - Itemize error - \n Cannot find specified button's class: " +
                parent.itemizeOptions.removeBtnClass +
                "\n"
            );
          } else {
            button.onclick = e => {
              e.stopPropagation();
              if (parent.itemizeOptions.modalConfirm) {
                this.modalConfirm(child);
              } else {
                this.remove(child.itemizeItemId);
              }
            };
            if (parent.itemizeOptions.outlineItemOnHover) {
              this.shadowOnHover(button, true);
            }
          }
        }
      }
      if (fromObserver) {
        this.showNotification("added", child);
      }
      return true;
    } else {
      return false;
    }
  }
  shadowOnHover(elem, isRemoveBtn) {
    let parent = null;
    if (isRemoveBtn) {
      parent = elem.parentElement;
    } else {
      parent = elem;
    }
    if (parent) {
      elem.parentShadowStyle = parent.style.boxShadow;
    }
    elem.onmouseenter = e => {
      if (parent) {
        parent.style.boxShadow = "inset 0px 0px 0px 3px rgba(15,179,0,1)";
      }
    };
    elem.onmouseleave = e => {
      if (parent) {
        parent.style.boxShadow = elem.parentShadowStyle;
      }
    };
  }
  applyCss(parent) {
    let options = parent.itemizeOptions;
    let oldStyle = parent.querySelector(".itemize_style");
    if (oldStyle) {
      oldStyle.parentNode.removeChild(oldStyle);
    }
    let css = document.createElement("style");
    css.classList.add("itemize_style");
    css.type = "text/css";
    let styles = "";
    // parent global styles
    styles += `.itemize_parent_${
      parent.itemizeContainerId
    } .itemize_hide{display:none}`;
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
      styles += `.itemize_parent_${
        parent.itemizeContainerId
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
        parent.itemizeContainerId
      } .itemize_remove_btn:hover::after,.itemize_parent_${
        parent.itemizeContainerId
      } .itemize_remove_btn:hover::before{transition:background 150ms ease-in-out;background:${
        options.removeBtnHoverColor
      }}.itemize_parent_${
        parent.itemizeContainerId
      } .itemize_remove_btn::after,.itemize_parent_${
        parent.itemizeContainerId
      } .itemize_remove_btn::before{content:'';position:absolute;height:${
        options.removeBtnThickness
      }px;transition:background 150ms ease-in-out;width:${options.removeBtnWidth /
        2}px;top:50%;left:25%;margin-top:${
        options.removeBtnThickness * 0.5 < 1
          ? -1
          : -options.removeBtnThickness * 0.5
      }px;background:${options.removeBtnColor};border-radius:${
        options.removeBtnSharpness
      }}.itemize_parent_${
        parent.itemizeContainerId
      } .itemize_remove_btn::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.itemize_parent_${
        parent.itemizeContainerId
      } .itemize_remove_btn::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}`;
    }
    if (css.styleSheet) {
      css.styleSheet.cssText = styles;
    } else {
      css.appendChild(document.createTextNode(styles));
    }
    parent.appendChild(css);
  }
  cancelItemize(targets) {
    let unItemizedNb = 0;
    try {
      let parentTargets = [];
      if (targets === "all") {
        parentTargets = this.containers.splice(0); // cloning
      } else {
        parentTargets = targets;
      }
      for (let z = 0; z < parentTargets.length; z++) {
        let parent = parentTargets[z];
        let targetItems = parent.querySelectorAll(".itmz_item");
        for (let j = 0; j < targetItems.length; j++) {
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
          for (let k = parent.classList.length - 1; k >= 0; k--) {
            if (parent.classList[k].indexOf("itemize_parent") !== -1) {
              parent.classList.remove(parent.classList[k]);
              parent.classList.remove("itmz_parent");
              break;
            }
          }
          let parentsInParent = parent.querySelectorAll(".itmz_parent");
          for (let v = 0; v < parentsInParent.length; v++) {
            this.cancelItemize(parentsInParent[v]);
          }
          parent.itemizeContainerId = null;
          parent.itemizeOptions = null;
          for (let i = 0; i < this.containers.length; i++) {
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
  cancelItemizeChild(child, parent) {
    for (let r = this.items.length - 1; r >= 0; r--) {
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
        let btn = child.querySelector(".itemize_remove_btn");
        if (btn) {
          btn.parentNode.removeChild(btn);
        }
      } else {
        const button = child.querySelector(
          "." + parent.itemizeOptions.removeBtnClass
        );
        if (button) {
          button.onclick = null;
        }
      }
    }
    let oldStyle = parent.querySelector(".itemize_style");
    if (oldStyle) {
      oldStyle.parentNode.removeChild(oldStyle);
    }
    for (let s = child.classList.length - 1; s >= 0; s--) {
      if (child.classList[s].indexOf("itemize_item_") !== -1) {
        child.classList.remove(child.classList[s]);
        break;
      }
    }
    child.itemizeItemId = null;
  }

  modalConfirm(el) {
    try {
      const modalAnimDuration = 150;
      const backDrop = document.createElement("div");
      const modal = document.createElement("div");
      const notificationText = document.createElement("div");
      const btnContainer = document.createElement("div");
      const btnConfirm = document.createElement("button");
      const btnCancel = document.createElement("button");
      const crossClose = document.createElement("div");
      const body = document.querySelector("body");
      // const bodyInitialOverflow = body.style.overflow;
      // body.style.overflow = "hidden";
      backDrop.classList.add("itemize_modal_backdrop");
      modal.classList.add("itemize_modal");
      notificationText.classList.add("itemize_modal_text");
      btnConfirm.classList.add("itemize_modal_btnConfirm");
      btnCancel.classList.add("itemize_modal_btnCancel");
      crossClose.classList.add("itemize_modal_cross");
      notificationText.textContent = el.parentElement.itemizeOptions.modalText;
      btnConfirm.innerHTML = "Yes";
      btnCancel.innerHTML = "Cancel";
      btnContainer.appendChild(btnCancel);
      btnContainer.appendChild(btnConfirm);
      modal.appendChild(notificationText);
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
            [
              {
                opacity: 1
              }
            ],
            [
              {
                opacity: 0
              }
            ],
            modalAnimDuration
          );
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
                transform: {
                  translateX: -50,
                  translateY: -50,
                  unit: "%"
                }
              }
            ],
            [
              {
                opacity: 0,
                transform: {
                  translateX: -50,
                  translateY: 0,
                  unit: "%"
                }
              }
            ],
            modalAnimDuration
          );
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
        position: "fixed",
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

      let modalCss =
        ".itemize_modal_btnConfirm:hover{ background-color: #c83e34 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_btnCancel:hover{ background-color: #4a5055 !important; transition: background-color 0.3s ease-in-out }.itemize_modal_cross {cursor:pointer;position: absolute;right: 5px;top: 5px;width: 18px;height:18px;opacity:0.3;}.itemize_modal_cross:hover{opacity:1;}.itemize_modal_cross:before,.itemize_modal_cross:after{position:absolute;left:9px;content:' ';height: 19px;width:2px;background-color:#333;}.itemize_modal_cross:before{transform:rotate(45deg);}.itemize_modal_cross:after{transform:rotate(-45deg);}";
      let styleEl = document.createElement("style");

      if (styleEl.styleSheet) {
        styleEl.styleSheet.cssText = modalCss;
      } else {
        styleEl.appendChild(document.createTextNode(modalCss));
      }
      modal.appendChild(styleEl);

      Object.assign(notificationText.style, {
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
      body.insertBefore(modal, body.childNodes[0]);
      body.insertBefore(backDrop, body.childNodes[0]);
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
              transform: {
                translateX: -50,
                translateY: -100,
                unit: "%"
              }
            }
          ],
          [
            {
              opacity: 1,
              transform: {
                translateX: -50,
                translateY: -50,
                unit: "%"
              }
            }
          ],
          modalAnimDuration
        );
      }
    } catch (error) {
      console.error(" - Itemize error - \n" + error);
    }
  }

  showNotification(action, element) {
    if (
      (element.parentElement.itemizeOptions.showAddNotifications &&
        action === "added") ||
      (element.parentElement.itemizeOptions.showRemoveNotifications &&
        action === "removed")
    ) {
      let notificationClassName = "";
      let notificationTextClassName = "";
      let notificationBackground = "";
      let notificationTimerColor = "";
      let notificationTextContent = "";
      let notificationLeftPos = "";
      let notificationTopPos = "";
      let notificationTranslateX = "";
      let minusOrNothing = "-";
      let notificationIsTop = false;
      let notificationTimerDuration =
        element.parentElement.itemizeOptions.notificationTimer;
      let notifPos = element.parentElement.itemizeOptions.notificationPosition;
      if (notifPos === "bottom-center") {
        notificationLeftPos = "50%";
        notificationTopPos = "100%";
        notificationTranslateX = "-50%";
      } else if (notifPos === "bottom-right") {
        notificationLeftPos = "100%";
        notificationTopPos = "100%";
        notificationTranslateX = "-100%";
      } else if (notifPos === "bottom-left") {
        notificationLeftPos = "0%";
        notificationTopPos = "100%";
        notificationTranslateX = "0%";
      } else if (notifPos === "top-center") {
        notificationLeftPos = "50%";
        notificationTopPos = "0%";
        notificationTranslateX = "-50%";
        minusOrNothing = "";
        notificationIsTop = true;
      } else if (notifPos === "top-right") {
        notificationLeftPos = "100%";
        notificationTopPos = "0%";
        notificationTranslateX = "-100%";
        minusOrNothing = "";
        notificationIsTop = true;
      } else if (notifPos === "top-left") {
        notificationLeftPos = "0%";
        notificationTopPos = "0%";
        notificationTranslateX = "0%";
        minusOrNothing = "";
        notificationIsTop = true;
      }
      if (action === "removed") {
        notificationClassName = "itemize_remove_notification";
        notificationTextClassName = "itemize_remove_notification_text";
        notificationBackground = "#BD5B5B";
        notificationTimerColor = "#DEADAD";
        notificationTextContent =
          element.parentElement.itemizeOptions.removeNotificationText;
      } else if (action === "added") {
        notificationClassName = "itemize_add_notification";
        notificationTextClassName = "itemize_add_notification_text";
        notificationBackground = "#00AF66";
        notificationTimerColor = "#80D7B3";
        notificationTextContent =
          element.parentElement.itemizeOptions.addNotificationText;
      }
      if (this.notificationNbs[notifPos]) {
        this.notificationNbs[notifPos]++;
      } else {
        this.notificationNbs[notifPos] = 1;
      }

      let popNotification = document.createElement("div");
      popNotification.notificationId = this.notificationNbs[notifPos];
      let notificationTimer = document.createElement("div");
      let notificationText = document.createElement("div");
      popNotification.classList.add(notificationClassName);
      popNotification.classList.add("itemize_notification_" + notifPos);
      notificationText.classList.add(notificationTextClassName);
      notificationText.textContent = notificationTextContent;
      Object.assign(notificationText.style, {
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        textAlign: "center",
        whiteSpace: "nowrap",
        padding: "10px 15px 10px 15px"
      });
      Object.assign(notificationTimer.style, {
        background: notificationTimerColor,
        width: "100%",
        height: "5px"
      });
      Object.assign(popNotification.style, {
        boxSizing: "border-box",
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        top: notificationTopPos,
        left: notificationLeftPos,
        border: "solid 1px " + notificationTimerColor,
        borderRadius: "4px",
        transform: `translate(${notificationTranslateX}, ${minusOrNothing}${this
          .notificationNbs[notifPos] *
          100 -
          (notificationIsTop ? 100 : 0)}%)`,
        fontFamily: "helvetica",
        background: notificationBackground,
        color: "#FFFFFF",
        zIndex: 100000000
      });
      document.querySelector("body").appendChild(popNotification);
      popNotification.appendChild(notificationTimer);
      popNotification.appendChild(notificationText);
      if (popNotification.animate) {
        popNotification.animate(
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
            easing: "linear",
            fill: "both"
          }
        );
      } else {
        this.animateRAF(
          popNotification,
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
          300
        );
      }
      if (notificationTimer.animate) {
        notificationTimer.animate(
          [
            {
              width: "100%"
            },
            {
              width: "0%"
            }
          ],
          {
            duration: notificationTimerDuration,
            easing: "linear",
            fill: "both"
          }
        );
      } else {
        this.animateRAF(
          notificationTimer,
          [
            {
              width: {
                value: 100,
                unit: "%"
              }
            }
          ],
          [
            {
              width: {
                value: 0,
                unit: "%"
              }
            }
          ],
          notificationTimerDuration
        );
      }
      setTimeout(() => {
        let notificationList = document.querySelectorAll(
          ".itemize_notification_" + notifPos
        );
        for (let i = 0; i < notificationList.length; i++) {
          if (notificationList[i].notificationId > 0) {
            let translateYStart = parseInt(
              `${minusOrNothing}${notificationList[i].notificationId * 100 -
                (notificationIsTop ? 100 : 0)}`
            );
            let translateYEnd = parseInt(
              `${minusOrNothing}${notificationList[i].notificationId * 100 -
                (notificationIsTop ? 100 : 0) -
                100}`
            );
            if (notificationList[i].animate) {
              notificationList[i].animate(
                [
                  {
                    transform: `translate(${notificationTranslateX}, ${translateYStart}%)`
                  },
                  {
                    transform: `translate(${notificationTranslateX}, ${translateYEnd}%)`
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
                notificationList[i],
                [
                  {
                    transform: {
                      translateX: parseInt(notificationTranslateX),
                      translateY: translateYStart,
                      unit: "%"
                    }
                  }
                ],
                [
                  {
                    transform: {
                      translateX: parseInt(notificationTranslateX),
                      translateY: translateYEnd,
                      unit: "%"
                    }
                  }
                ],
                150
              );
            }
            notificationList[i].notificationId--;
          }
        }
        this.notificationNbs[notifPos]--;
        setTimeout(() => {
          document.querySelector("body").removeChild(popNotification);
        }, 300);
      }, notificationTimerDuration);
    }
  }

  remove(el) {
    try {
      let item = null;
      if (typeof el === "string") {
        for (let i = 0; i < this.items.length; i++) {
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
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].itemizeItemId === item.itemizeItemId) {
              item.arrayPosition = i;
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
        for (let i = 0; i < this.items.length; i++) {
          if (item.itemizeItemId === this.items[i].itemizeItemId) {
            item.arrayPosition = i;
          }
        }
      }
      if (
        (item.arrayPosition || item.arrayPosition === 0) &&
        item.parentElement &&
        item.parentElement.itemizeOptions
      ) {
        if (
          (!item.removeStatus || item.removeStatus !== "pending") &&
          !item.inFlipAnim
        ) {
          if (item.parentElement.itemizeOptions.beforeRemove) {
            item.removeStatus = "pending";
            let confirmRemove = item.parentElement.itemizeOptions.beforeRemove(
              item
            );
            if (confirmRemove === undefined) {
              throw new Error(
                ' - Itemize error - \n The function "beforeErase" must return a Boolean or a Promise'
              );
            }
            if (typeof confirmRemove.then === "function") {
              let animDuration = item.parentElement.itemizeOptions.animDuration;
              let onClickFn = item.onclick;
              item.onclick = null;
              confirmRemove
                .then(response => {
                  if (item.parentElement.itemizeOptions.anim) {
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
                    this.showNotification("removed", item);
                    this.flipRead(this.items);
                    this.flipRemove(item);
                    this.items.splice(item.arrayPosition, 1);
                  } else {
                    this.showNotification("removed", item);
                    item.removeStatus = null;
                    item.parentNode.removeChild(item);
                    this.cleanItem(item);
                    this.items.splice(item.arrayPosition, 1);
                  }
                })
                .catch(err => {
                  console.log(err);
                  item.onclick = onClickFn;
                  item.removeStatus = null;
                });
            } else if (confirmRemove) {
              if (item.parentElement.itemizeOptions.anim) {
                let animDuration =
                  item.parentElement.itemizeOptions.animDuration;
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
                this.showNotification("removed", item);
                this.flipRead(this.items);
                this.flipRemove(item);
                this.items.splice(item.arrayPosition, 1);
              } else {
                this.showNotification("removed", item);
                item.removeStatus = null;
                item.parentNode.removeChild(item);
                this.items.splice(item.arrayPosition, 1);
                this.cleanItem(item);
              }
            }
          } else {
            if (item.parentElement.itemizeOptions.anim) {
              let animDuration = item.parentElement.itemizeOptions.animDuration;
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
              this.showNotification("removed", item);
              this.flipRead(this.items);
              this.flipRemove(item);
              this.items.splice(item.arrayPosition, 1);
            } else {
              this.showNotification("removed", item);
              item.removeStatus = null;
              item.parentNode.removeChild(item);
              this.cleanItem(item);
              this.items.splice(item.arrayPosition, 1);
            }
          }
        }
      } else {
        throw new Error(
          " - Itemize error - \n this element has an invalid itemizeItemId"
        );
      }
    } catch (error) {
      console.error(" - Itemize error - \n" + error);
    }
  }
  cleanItem(item) {
    for (let u = 0; u < item.classList.length; u++) {
      item.classList.remove("itmz_item");
      if (item.classList[u].indexOf("itemize_item_") !== -1) {
        item.classList.remove(item.classList[u]);
        break;
      }
    }
    if (item.parentNode && item.parentNode.itemizeItems) {
      for (let i = 0; i < item.parentNode.itemizeItems.length; i++) {
        if (
          item.parentNode.itemizeItems[i].itemizeItemId === item.itemizeItemId
        ) {
          item.parentNode.itemizeItems.splice(i, 1);
          break;
        }
      }
    }
    if (
      item.parentNode &&
      item.parentNode.itemizeOptions &&
      item.parentNode.itemizeOptions.removeBtnClass
    ) {
      let btn = item.querySelector(
        "." + item.parentNode.itemizeOptions.removeBtnClass
      );
      if (btn) {
        btn.parentNode.removeChild(btn);
      }
    } else {
      let btn = item.querySelector(".itemize_remove_btn");
      if (btn) {
        btn.parentNode.removeChild(btn);
      }
    }
    if (item.itemizeContainerId) {
      this.clearObservers(item.itemizeContainerId);
      let parentsInItem = item.querySelectorAll(".itmz_parent");
      this.cancelItemize(parentsInItem);
      for (let i = 0; i < parentsInItem.length; i++) {
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
  animateRAF(elem, from, to, duration) {
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
    function anim(timestamp) {
      let progress;
      if (!elem.startAnimTime) {
        elem.startAnimTime = timestamp;
      }
      progress = timestamp - elem.startAnimTime;
      for (let i = 0; i < to.length; i++) {
        for (const key in to[i]) {
          if (to[i].hasOwnProperty(key)) {
            if (key === "transform") {
              elem.style.transform = `translateX(${from[i][key].translateX -
                ((from[i][key].translateX - to[i][key].translateX) *
                  parseInt(100 / (duration / progress))) /
                  100}${to[i][key].unit}) translateY(${from[i][key].translateY -
                ((from[i][key].translateY - to[i][key].translateY) *
                  parseInt(100 / (duration / progress))) /
                  100}${to[i][key].unit})`;
            } else if (key === "opacity") {
              elem.style.opacity =
                from[i][key] -
                ((from[i][key] - to[i][key]) *
                  parseInt(100 / (duration / progress))) /
                  100;
            } else {
              elem.style[key] = `${from[i][key].value -
                ((from[i][key].value - to[i][key].value) *
                  parseInt(100 / (duration / progress))) /
                  100}${to[i][key].unit}`;
            }
          }
        }
      }
      if (progress < duration - 1) {
        requestAnimationFrame(anim);
      } else {
        elem.startAnimTime = null;
        if (elem.inFlipAnim) {
          elem.inFlipAnim = false;
          elem.style.transform = "none";
        }
      }
    }
    requestAnimationFrame(anim);
  }
  flipRemove(elem) {
    elem.onclick = null;
    let options = elem.parentElement.itemizeOptions;
    if (elem.animate) {
      elem.animate(
        [
          {
            transform: `translate(0px, 0px)`,
            opacity: 1
          },
          {
            transform: `translate(${options.animRemoveTranslateX}px, ${
              options.animRemoveTranslateY
            }px)`,
            opacity: 0
          }
        ],
        {
          duration: options.animDuration * 0.5,
          easing: options.animEasing,
          fill: "both"
        }
      );
    } else {
      this.animateRAF(
        elem,
        [
          {
            opacity: 1
          },
          {
            transform: {
              translateX: 0,
              translateY: 0,
              unit: "px"
            }
          }
        ],
        [
          {
            opacity: 0
          },
          {
            transform: {
              translateX: options.animRemoveTranslateX,
              translateY: options.animRemoveTranslateY,
              unit: "px"
            }
          }
        ],
        options.animDuration * 0.5
      );
    }
    let flipPlayId = this.makeId(6);
    this.flipPlayId = flipPlayId;
    setTimeout(() => {
      this.elemToRemove.push(elem);
      if (this.flipPlayId === flipPlayId) {
        this.flipRead(this.items);
        for (let i = 0; i < this.elemToRemove.length; i++) {
          this.cleanItem(this.elemToRemove[i]);
          this.elemToRemove[i].removeStatus = null;
          this.elemToRemove[i].parentNode.removeChild(this.elemToRemove[i]);
        }
        this.elemToRemove = [];
        this.flipPlay(this.items, options.animDuration * 0.5);
      }
    }, options.animDuration * 0.5);
  }
  flipAdd(elem) {
    elem.classList.remove("itemize_hide");
    elem.inAddAnim = true;
    let options = elem.parentElement.itemizeOptions;
    let translateXStart = options.animAddTranslateX;
    let translateYStart = options.animAddTranslateY;
    if (elem.animate) {
      elem.animate(
        [
          {
            transform: `translate(${translateXStart}px, ${translateYStart}px)`,
            opacity: 0
          },
          {
            transform: "none",
            opacity: 1
          }
        ],
        {
          duration: options.animDuration,
          easing: options.animEasing
        }
      );
    } else {
      this.animateRAF(
        elem,
        [
          {
            opacity: 0
          },
          {
            transform: {
              translateX: translateXStart,
              translateY: translateYStart,
              unit: "px"
            }
          }
        ],
        [
          {
            opacity: 1
          },
          {
            transform: {
              translateX: 0,
              translateY: 0,
              unit: "px"
            }
          }
        ],
        options.animDuration
      );
    }

    setTimeout(() => {
      elem.inAddAnim = false;
      elem.newAddPos = null;
      elem.oldPos = null;
      elem.style.transform = "none";
      elem.style.opacity = 1;
    }, options.animDuration);
  }
  flipRead(elems) {
    for (let i = 0; i < elems.length; i++) {
      this.elPos[elems[i].itemizeItemId] = elems[i].getBoundingClientRect();
    }
  }
  flipPlay(elems, duration) {
    for (let i = 0; i < elems.length; i++) {
      let el = elems[i];
      if (!el.inAddAnim && el.parentNode && el.parentNode.itemizeOptions) {
        const newPos = el.getBoundingClientRect();
        const oldPos = this.elPos[el.itemizeItemId];
        const deltaX = oldPos.left - newPos.left;
        const deltaY = oldPos.top - newPos.top;
        let deltaW = oldPos.width / newPos.width;
        let deltaH = oldPos.height / newPos.height;
        if (isNaN(deltaW) || deltaW === Infinity) {
          deltaW = 1;
        }
        if (isNaN(deltaH) || deltaH === Infinity) {
          deltaH = 1;
        }

        if (deltaX !== 0 || deltaY !== 0 || deltaW !== 1 || deltaH !== 1) {
          el.inFlipAnim = true;
          if (el.animate) {
            el.animate(
              [
                {
                  transform: `translate(${deltaX}px, ${deltaY}px)`
                },
                {
                  transform: "none"
                }
              ],
              {
                duration: duration,
                easing: el.parentNode.itemizeOptions.animEasing
              }
            );
          } else {
            this.animateRAF(
              el,
              [
                {
                  transform: {
                    translateX: deltaX,
                    translateY: deltaY,
                    unit: "px"
                  }
                }
              ],
              [
                {
                  transform: {
                    translateX: 0,
                    translateY: 0,
                    unit: "px"
                  }
                }
              ],
              duration
            );
          }
          if (document.querySelector("body").animate) {
            setTimeout(() => {
              if (el) {
                el.style.transform = "none";
                el.inFlipAnim = false;
              }
            }, duration);
          }
        }
      }
    }
  }

  mergeOptions(newOptions) {
    try {
      let defaultOptions = {
        removeBtn: true,
        removeBtnWidth: 20,
        removeBtnThickness: 2,
        removeBtnColor: "#565C67",
        removeBtnHoverColor: "#ffffff",
        removeBtnSharpness: "0%",
        removeBtnPosition: "top-right",
        removeBtnMargin: 2,
        removeBtnCircle: true,
        removeBtnBgColor: "rgba(200, 200, 200, 0.5)",
        removeBtnBgHoverColor: "#959595",
        removeBtnClass: null,
        modalConfirm: false,
        modalText: "Are you sure to remove this item?",
        removeNotificationText: "Item removed",
        addNotificationText: "Item added",
        showRemoveNotifications: false,
        showAddNotifications: false,
        notificationPosition: "bottom-right",
        notificationTimer: 4000,
        anim: true,
        animEasing: "ease-in-out",
        animDuration: 500,
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
        defaultOptions = { ...this.globalOptions };
      }
      let mergedOptions = { ...defaultOptions, ...newOptions };
      return mergedOptions;
    } catch (error) {
      console.error(error);
    }
  }
  getOptionsFromAttributes(parent, options) {
    let intAttributes = [
      "removeBtnWidth",
      "removeBtnThickness",
      "removeBtnMargin",
      "nestingLevel",
      "animDuration",
      "animRemoveTranslateX",
      "animRemoveTranslateY",
      "animAddTranslateX",
      "animAddTranslateY",
      "removeBtnThickness",
      "notificationTimer"
    ];
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
    }
    return options;
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
try {
  module.exports = Itemize;
} catch {}
