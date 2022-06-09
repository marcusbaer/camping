const MarkdownIt = window.markdownit;

export default class Praizee extends HTMLElement {

    static get tagName() {
        return 'praizee-slides'
    }

    constructor() {
        const template = document.createElement("template");
        template.innerHTML = `<div class="demo praizee">
        <div class="controls">
            <button class="prev">«</button>
            <button class="next">»</button>
        </div>
        <div class="presentation"></div>
        <img class="logo" src="">
        <slot></slot>
    </div>`;

        super();
        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        this.wrapper = this.$(".demo");
        this.presentation = this.$(".presentation");
        this.buttonNext = this.$(".next");
        this.buttonPrev = this.$(".prev");
        this.logo = this.$(".logo");

        this.loadStyles();
    }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        console.log(
            `%cpz attribute changed: ${name} ${newVal}`,
            "color: lightgray;"
        );
        const changeableAttributes = ["logo", "start", "title"];
        if (changeableAttributes.includes(name) && oldVal && oldVal !== newVal) {
            this.render();
        }
    }

    connectedCallback() {

        this.buttonNext.addEventListener('click', (event) => {
            const numberOfSlides = this.slides.length - 1;
            if (Number(this.getAttribute("start")) < numberOfSlides) {
                this.setAttribute("start", Number(this.getAttribute("start")) + 1);
            }
        });

        this.buttonPrev.addEventListener('click', (event) => {
            if (Number(this.getAttribute("start")) > 0) {
                this.setAttribute("start", Number(this.getAttribute("start")) - 1);
            }
        });

        window.addEventListener('keyup', (event) => {
            const numberOfSlides = this.slides.length - 1;
            const currentSlideIndex = Number(this.getAttribute("start"));
            let slideDiff = (event.key === 'ArrowRight' || event.key === ' ')? 1: (event.key==='ArrowLeft'||event.key==='Backspace'? -1: 0);
           
            if (slideDiff && currentSlideIndex >= 0 && currentSlideIndex <= numberOfSlides) {
                slideDiff = (slideDiff<0 && currentSlideIndex===0) ? 0: slideDiff;
                slideDiff = (slideDiff>0 && currentSlideIndex===numberOfSlides) ? 0: slideDiff;
                this.setAttribute("start", currentSlideIndex + slideDiff);
            } else if (event.key === "1") {
                // go to first slide
                this.setAttribute("start", 0);
            } else if (event.key === "0") {
                // go to last slide
                this.setAttribute("start", numberOfSlides);
            } else if (event.key === "f") {
                // toggle fullscreen mode
                this.toggleFullscreen();
            }
        });

        // this.image.addEventListener('error', (event) => {
        //     this.imageWrapper.style.display = "none";
        // })

        if (this.getAttribute("src")) {
            this.loadFromUrl(this.getAttribute("src")).then(() => {
                this.render();
            });

        } else {
            this.loadFromSlot();
            this.render();
        }


        // const deleteFavoriteHandler = (event) => {
        //     if (event.target.nodeName == 'LI') {
        //         const deleteItem = event.target.textContent;
        //         const confirmationQuestion = this.getAttribute("confirmation") || ": soll der Eintrag gelöscht werden?";
        //         const userConfirmedFeedback = window.confirm(deleteItem + confirmationQuestion);
        //         if (userConfirmedFeedback) {
        //             let favoriteItems = this.favoriteItems;
        //             favoriteItems = favoriteItems.filter(item => item != deleteItem)
        //             this.favoriteItems = favoriteItems;

        //             this.renderFavorites();
        //         }
        //     }
        // }

    }

    // get favoriteItems () {
    //     const initialFavoriteItems = this.getAttribute('favorites')? JSON.parse(this.getAttribute('favorites')): [];
    //     const favoriteItems = localStorage.getItem("favoriteItems")? localStorage.getItem("favoriteItems").split("$--$"): initialFavoriteItems;

    //     return favoriteItems;
    // }

    // set favoriteItems (items = []) {
    //     localStorage.setItem("favoriteItems", items.join("$--$"));
    // }

    // get isFlagged () {
    //     return this.hasAttribute('flagged')
    // }

    get renderedSlide () {
        const index = this.getAttribute("start");

        return this.slides[index];
    }
    
    // set isFlagged (isFlagged) {
    //     if (isFlagged) {
    //       this.setAttribute('flagged', 'flagged')
    //     } else {
    //       this.removeAttribute('flagged')
    //     }
    // }

    static get observedAttributes() {
        return ["logo", "start", "title"];
    }

    loadFromUrl(src) {
        return fetch(src)
            .then(response => response.text())
            .then(content => {
                this.originalContent = content;
                this.slides = this.getSlides(this.originalContent, this.getAttribute("title"));
            })
    }

    loadFromSlot() {
        const slot = this.$("slot");

        this.originalContent = slot.assignedNodes()[0].nodeValue;
        this.slides = this.getSlides(this.originalContent, this.getAttribute("title"));
    }

    async loadStyles () {
        const cssModule = await import(`./${this.tagName.toLowerCase()}.css`, {
          assert: { type: 'css' }
        })
        this.shadowRoot.adoptedStyleSheets = [cssModule.default]
      }

    render() {
        this.presentation.innerHTML = this.renderedSlide;

        if (this.getAttribute("logo")) {
            this.logo.setAttribute("src", this.getAttribute("logo"));
        }

        // const [div] = slot.assignedNodes().filter(node => {
        //     return node.nodeName == "DIV";
        // });


        // this.headline.textContent = this.getAttribute('title') || 'title';
        // this.button.textContent = this.getAttribute('button') || 'button';
        // this.image.setAttribute("src", this.getAttribute('image') || '');
        // if (this.getAttribute('image')) {
        //     this.imageWrapper.classList.remove('disabled');
        // }
        
        // this.renderFavorites();
        // this.renderFlagging();
    }

    getSlides(content, title = '') { 
        // https://www.npmjs.com/package/esm.markdown-it
        const markdown = new MarkdownIt();
        let slides = [];

        content = "\n" + content;

        console.log(content);

        title = title ? " "+title : title;
        slides = content.split("\n#").map(c => markdown.render("#"+(c||title)));


        return slides;
    }

    toggleFullscreen () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
    }

    // renderFavorites() {
    //     this.favorites.innerHTML = this.favoriteItems.map(item => `<li tabindex="0">${item}</li>`).join('');
    // }

    // renderFlagging() {
    //     if (this.isFlagged) {
    //         this.wrapper.style.borderColor = '#e2001a';
    //     } else {
    //         this.wrapper.style = '';
    //     }
    // }
}