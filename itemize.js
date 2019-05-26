/*
 -- itemize.js v0.56 --
 -- (c) 2019 Kosmoon Studio --
 -- Released under the MIT license --
 */
class Itemize {
  constructor(options) {
    this.items = [];
    this.globalOptions = this.mergeOptions(options);

    let optionCheckResult = this.optionsTypeCheck(this.globalOptions);
    if (optionCheckResult !== "valid") {
      // check: option type error
      console.error("- Itemize - TYPE ERROR:\n" + optionCheckResult);
    } else {
      this.targetElements = this.getTargetElements();
      if (this.targetElements && this.targetElements.length > 0) {
        this.itemizeIt();
      } else {
        console.error(
          "- Itemize - ERROR:\n Cannot find any DOM elements with the attribute 'itemize' \n"
        );
      }
    }
    this.elPos = {};
  }

  getTargetElements() {
    try {
      return document.querySelectorAll("[itemize]");
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  getOptionsFromAttributes(parent, options) {
    if (parent.getAttribute("eraseBtn") === "false") {
      options.eraseBtn = false;
    } else if (parent.getAttribute("eraseBtn") === "true") {
      options.eraseBtn = true;
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
    if (
      typeof parent.getAttribute("eraseBtnWidth") === "string" &&
      parseInt(parent.getAttribute("eraseBtnWidth")) > 0
    ) {
      options.eraseBtnWidth = parseInt(parent.getAttribute("eraseBtnWidth"));
    }
    if (
      typeof parent.getAttribute("flipAnimDuration") === "string" &&
      parseInt(parent.getAttribute("flipAnimDuration")) > 0
    ) {
      options.flipAnimDuration = parseInt(
        parent.getAttribute("flipAnimDuration")
      );
    }
    return options;
  }
  itemizeIt() {
    let knownErrors = "";
    try {
      for (let i = 0; i < this.targetElements.length; i++) {
        let parent = this.targetElements[i];
        let parentItemizeId = this.makeId(8);
        parent.itemizeId = parentItemizeId;
        parent.classList.add(`itemize_parent_${parentItemizeId}`);
        for (let i = parent.classList.length - 1; i >= 0; i--) {
          // cleaning parent of itemize_parent_xxxx classes
          if (parent.classList[i].indexOf("itemize_parent") !== -1) {
            parent.classList.remove(parent.classList[i]);
          }
        }
        parent.classList.add(`itemize_parent_${parentItemizeId}`); // refresh parent with a new itemizeId class
        let options = Object.assign({}, this.globalOptions); // cloning options
        options = this.getOptionsFromAttributes(parent, options);
        parent.options = options;
        // node added OBSERVER
        let config = { attributes: true, childList: true, subtree: true };
        let callback = function(mutationsList, observer) {
          for (var mutation of mutationsList) {
            if (mutation.type == "childList") {
              mutation.addedNodes.forEach(node => {
                let newNode = true;
                node.classList.forEach(className => {
                  if (className.indexOf("itemize_") !== -1) {
                    newNode = false;
                  }
                });
                if (newNode) {
                  console.log("nouvel elment added");
                  console.log(node);
                }
              });
              mutation.removedNodes.forEach(node => {
                console.log("nouvel elment removed");
                console.log(node);
              });
            }
          }
        };
        let observer = new MutationObserver(callback);
        observer.observe(parent, config);
        // Later, you can stop observing
        // observer.disconnect();
        let oldStyle = document.querySelector(this.target + " .itemize_style");
        if (oldStyle) {
          parent.querySelector(".itemize_style").remove();
        }
        let css = document.createElement("style");
        css.classList.add("itemize_style");
        css.type = "text/css";
        let styles = "";
        if (parent.options.eraseBtn && !parent.options.eraseBtnClass) {
          styles += `.itemize_parent_${
            parent.itemizeId
          } .itemize_btn_close{position:absolute;top:0!important;right:0!important;width:${
            parent.options.eraseBtnWidth
          }px!important;height:${
            parent.options.eraseBtnWidth
          }px!important;overflow:hidden;cursor:pointer;margin-top:5px;margin-right:5px}.itemize_parent_${
            parent.itemizeId
          } .itemize_btn_close:hover::after,.itemize_parent_${
            parent.itemizeId
          } .itemize_btn_close:hover::before{background:${
            parent.options.eraseBtnHoverColor
          }}.itemize_parent_${
            parent.itemizeId
          } .itemize_btn_close::after,.itemize_parent_${
            parent.itemizeId
          } .itemize_btn_close::before{content:'';position:absolute;height:${
            parent.options.eraseBtnThickness
          }px;width:${
            parent.options.eraseBtnWidth
          }px;top:50%;left:0;margin-top:${
            parent.options.eraseBtnThickness * 0.5 < 1
              ? -1
              : -parent.options.eraseBtnThickness * 0.5
          }px;background:${
            parent.options.eraseBtnColor
          };border-radius:100%}.itemize_parent_${
            parent.itemizeId
          } .itemize_btn_close::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.itemize_parent_${
            parent.itemizeId
          } .itemize_btn_close::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}`;
        }
        if (css.styleSheet) {
          css.styleSheet.cssText = styles;
        } else {
          css.appendChild(document.createTextNode(styles));
        }
        parent.appendChild(css);
        for (let z = 0; z < parent.children.length; z++) {
          let child = parent.children[z];
          if (child.type !== "text/css") {
            if (!child.itemizeId) {
              child.itemizeId = this.makeId(8);
            }
            this.items.push(child);
            child.classList.add("itemize_item_" + child.itemizeId);
            if (!parent.options.eraseBtn) {
              child.onclick = () => {
                if (parent.options.modalConfirm) {
                  this.modalConfirm(child.itemizeId);
                } else {
                  this.erase(child.itemizeId);
                }
              };
            } else {
              if (!parent.options.eraseBtnClass) {
                child.style.position = "relative";
                const button = document.createElement("div");
                button.classList.add("itemize_btn_" + child.itemizeId);
                button.classList.add("itemize_btn_close");
                button.onclick = () => {
                  if (parent.options.modalConfirm) {
                    console.log(child.itemizeId);
                    this.modalConfirm(child.itemizeId);
                  } else {
                    this.erase(child.itemizeId);
                  }
                };
                child.appendChild(button);
              } else {
                const button = document.querySelector(
                  ".itemize_item_" +
                    child.itemizeId +
                    " ." +
                    parent.options.eraseBtnClass
                );
                if (!button) {
                  knownErrors +=
                    "Cannot find specified class: " +
                    parent.options.eraseBtnClass +
                    "\n";
                }
                button.onclick = () => {
                  if (parent.options.modalConfirm) {
                    this.modalConfirm(child.itemizeId);
                  } else {
                    this.erase(child.itemizeId);
                  }
                };
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("- Itemize - ERROR:\n" + knownErrors);
      console.error(error);
    }
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
              "Not a valid Itemize element1, cannot create a confirm modal."
            );
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
          throw new Error(
            "Not a valid Itemize element4, cannot create a confirm modal."
          );
        }
      }
      const backDrop = document.createElement("div");
      const modal = document.createElement("div");
      const alertText = document.createElement("div");
      const btnConfirm = document.createElement("button");
      const btnCancel = document.createElement("button");
      const body = document.querySelector("body");
      backDrop.classList.add("itemize_modal_backdrop");
      modal.classList.add("itemize_modal");
      alertText.textContent = "Are you sure?";
      btnConfirm.innerHTML = "Yes";
      btnCancel.innerHTML = "Cancel";
      modal.appendChild(alertText);
      modal.appendChild(btnConfirm);
      modal.appendChild(btnCancel);
      backDrop.onclick = () => {
        body.removeChild(backDrop);
        body.removeChild(modal);
      };
      btnCancel.onclick = () => {
        body.removeChild(backDrop);
        body.removeChild(modal);
      };
      btnConfirm.onclick = () => {
        this.erase(el);
        body.removeChild(backDrop);
        body.removeChild(modal);
      };
      Object.assign(modal.style, {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        margin: "auto",
        width: "35vw",
        height: "35vh",
        background: "rgb(250, 220,250)",
        zIndex: 1000000
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
          easing: "ease-in-out",
          fill: "both"
        }
      );
      modal.animate(
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
          easing: "ease-in-out",
          fill: "both"
        }
      );
    } catch (error) {
      console.error("- Itemize - ERROR:\n" + error);
    }
  }
  erase(el) {
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
          throw new Error("No item found to erase");
        }
      } else {
        item = el;
        if (!item) {
          throw new Error("No item found to erase");
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
        if (this.globalOptions.beforeErase) {
          let confirmErase = this.globalOptions.beforeErase(item);
          if (typeof confirmErase.then === "function") {
            confirmErase
              .then(response => {
                console.log(response);
                if (item.parentNode.options.flipAnimation) {
                  this.flipRead(this.items);
                  this.flipRemove(item);
                  this.items.splice(item.arrayPosition, 1);
                  this.flipPlay(this.items);
                } else {
                  item.parentNode.removeChild(item);
                  this.items.splice(item.arrayPosition, 1);
                }
              })
              .catch(err => console.log(err));
          } else if (confirmErase) {
            if (item.parentNode.options.flipAnimation) {
              this.flipRead(this.items);
              this.flipRemove(item);
              this.items.splice(item.arrayPosition, 1);
              this.flipPlay(this.items);
            } else {
              item.parentNode.removeChild(item);
              this.items.splice(item.arrayPosition, 1);
            }
          }
        } else {
          if (item.parentNode.options.flipAnimation) {
            this.flipRead(this.items);
            this.flipRemove(item);
            this.items.splice(item.arrayPosition, 1);
            this.flipPlay(this.items);
          } else {
            item.parentNode.removeChild(item);
            this.items.splice(item.arrayPosition, 1);
          }
        }
      } else {
        throw new Error("this element has an invalid itemizeId");
      }
    } catch (error) {
      console.error("- Itemize - ERROR:\n" + error);
    }
  }
  flipRemove(elem) {
    elem.parentNode.appendChild(elem);
    const newPos = elem.getBoundingClientRect();
    const oldPos = this.elPos[elem.itemizeId];
    const deltaX = oldPos.x - newPos.x;
    const deltaY = oldPos.y - newPos.y;
    elem.animate(
      [
        {
          transform: `translate(${deltaX}px, ${deltaY}px)`,
          opacity: 1
        },
        {
          transform: `translate(${deltaX + 50}px, ${deltaY}px)`,
          opacity: 0
        }
      ],
      {
        duration: elem.parentNode.options.flipAnimDuration,
        easing: "ease-in-out",
        fill: "both"
      }
    );
    setTimeout(() => {
      elem.parentNode.removeChild(elem);
    }, elem.parentNode.options.flipAnimDuration);
  }
  flipRead(elems) {
    this.elPos = {};
    for (let i = 0; i < elems.length; i++) {
      this.elPos[elems[i].itemizeId] = elems[i].getBoundingClientRect();
    }
  }
  flipPlay(elems) {
    for (let i = 0; i < elems.length; i++) {
      const newPos = elems[i].getBoundingClientRect();
      const oldPos = this.elPos[elems[i].itemizeId];
      const deltaX = oldPos.x - newPos.x;
      const deltaY = oldPos.y - newPos.y;
      const deltaW = oldPos.width / newPos.width;
      const deltaH = oldPos.height / newPos.height;
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
          duration: elems[i].parentNode.options.flipAnimDuration,
          easing: "ease-in-out",
          fill: "both"
        }
      );
    }
  }

  mergeOptions(newOptions) {
    try {
      const defaultOptions = {
        eraseBtn: true,
        eraseBtnWidth: 20,
        eraseBtnThickness: 2,
        eraseBtnColor: "#525252",
        eraseBtnHoverColor: "#000000",
        eraseBtnClass: null,
        modalConfirm: false,
        flipAnimation: true,
        flipAnimDuration: 500,
        beforeErase: null
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
    if (typeof options.eraseBtn !== "boolean") {
      error += "option 'button' must be a Boolean\n";
    }
    if (typeof options.modalConfirm !== "boolean") {
      error += "option 'modalConfirm' must be a Boolean\n";
    }
    if (typeof options.eraseBtnWidth !== "number") {
      error += "option 'eraseBtnWidth' must be a Number\n";
    }
    if (typeof options.eraseBtnThickness !== "number") {
      error += "option 'eraseBtnThickness' must be a Number\n";
    }
    if (options.eraseBtnClass && typeof options.eraseBtnClass !== "string") {
      error += "option 'buttonClass' must be a String\n";
    }
    if (typeof options.flipAnimation !== "boolean") {
      error += "option 'flipAnimation' must be a Boolean\n";
    }
    if (typeof options.flipAnimDuration !== "number") {
      error += "option 'flipAnimDuration' must be a Number\n";
    }
    if (options.beforeErase && typeof options.beforeErase !== "function") {
      error += "option 'beforeErase' must be a Function\n";
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
