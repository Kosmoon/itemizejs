class Itemize {
  constructor(options) {
    this.items = [];
    this.options = this.mergeOptions(options);
    let optionCheckResult = this.optionsTypeCheck(this.options);
    if (optionCheckResult !== "valid") {
      // check: option type error
      console.error("- Itemize - TYPE ERROR:\n" + optionCheckResult);
    } else {
      this.targetElements = this.getTargetElements();
      if (this.targetElements && this.targetElements.length > 0) {
        this.itemizeIt(this.options);
      } else {
        console.error(
          "- Itemize - ERROR:\n Cannot find any DOM elements with the attribut 'itemize' \n"
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

  itemizeIt(options) {
    let knownErrors = "";
    try {
      for (let i = 0; i < this.targetElements.length; i++) {
        let oldStyle = document.querySelector(this.target + " .itemize_style");
        if (oldStyle) {
          this.targetElements[i].querySelector(".itemize_style").remove();
        }
        let css = document.createElement("style");
        css.classList.add("itemize_style");
        css.type = "text/css";
        let styles = "";
        if (options.eraseBtn && !options.eraseBtnClass) {
          styles += `.itemize_btn_close{position:absolute;top:0!important;right:0!important;width:${
            options.eraseBtnWidth
          }px!important;height:${
            options.eraseBtnWidth
          }px!important;overflow:hidden;cursor:pointer}.itemize_btn_close:hover::after,.itemize_btn_close:hover::before{background:${
            options.eraseBtnHoverColor
          }}.itemize_btn_close::after,.itemize_btn_close::before{content:'';position:absolute;height:${
            options.eraseBtnThickness
          }px;width:${options.eraseBtnWidth}px;top:50%;left:0;margin-top:${
            options.eraseBtnThickness * 0.5 < 1
              ? -1
              : -options.eraseBtnThickness * 0.5
          }px;background:${
            options.eraseBtnColor
          };border-radius:100%}.itemize_btn_close::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.itemize_btn_close::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}`;
        }
        if (css.styleSheet) {
          css.styleSheet.cssText = styles;
        } else {
          css.appendChild(document.createTextNode(styles));
        }
        this.targetElements[i].appendChild(css);
        for (let z = 0; z < this.targetElements[i].children.length; z++) {
          let child = this.targetElements[i].children[z];
          if (child.type !== "text/css") {
            if (!child.itemizeId) {
              child.itemizeId = this.makeId(8);
            }
            this.items.push(child);
            child.classList.add("itemize_" + child.itemizeId);
            if (!options.eraseBtn) {
              child.onclick = () => {
                if (this.options.modalConfirm) {
                  this.modalConfirm(child.itemizeId);
                } else {
                  this.erase(child.itemizeId);
                }
              };
            } else {
              if (!options.eraseBtnClass) {
                child.style.position = "relative";
                const button = document.createElement("div");
                button.classList.add("itemize_btn_" + child.itemizeId);
                button.classList.add("itemize_btn_close");
                button.onclick = () => {
                  if (this.options.modalConfirm) {
                    console.log(child.itemizeId);
                    this.modalConfirm(child.itemizeId);
                  } else {
                    this.erase(child.itemizeId);
                  }
                };
                child.appendChild(button);
              } else {
                const button = document.querySelector(
                  ".itemize_" + child.itemizeId + " ." + options.eraseBtnClass
                );
                if (!button) {
                  knownErrors +=
                    "Cannot find specified class: " +
                    options.eraseBtnClass +
                    "\n";
                }
                button.onclick = () => {
                  if (this.options.modalConfirm) {
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
        console.log("strign");
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
        if (this.options.flipAnimation) {
          this.flipRead(this.items);
          this.flipRemove(item);
          this.items.splice(item.arrayPosition, 1);
          this.flipPlay(this.items);
        } else {
          if (this.options.onErase) {
            this.options.onErase(item);
          }
          el.removeChild(item);
          this.items.splice(item.arrayPosition, 1);
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
        duration: this.options.flipAnimDuration,
        easing: "ease-in-out",
        fill: "both"
      }
    );
    setTimeout(() => {
      if (this.options.onErase) {
        this.options.onErase(elem);
      }
      elem.parentNode.removeChild(elem);
    }, this.options.flipAnimDuration);
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
          duration: this.options.flipAnimDuration,
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
        flipAnimation: false,
        flipAnimDuration: 500,
        onErase: null
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
    if (
      this.options.eraseBtnClass &&
      typeof options.eraseBtnClass !== "string"
    ) {
      error += "option 'buttonClass' must be a String\n";
    }
    if (typeof this.options.flipAnimation !== "boolean") {
      error += "option 'flipAnimation' must be a Boolean\n";
    }
    if (typeof this.options.flipAnimDuration !== "number") {
      error += "option 'flipAnimDuration' must be a Number\n";
    }
    if (this.options.onErase && typeof options.onErase !== "function") {
      error += "option 'onErase' must be a Function\n";
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
