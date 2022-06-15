const MarkdownIt = window.markdownit;

export default class MarkdownContent extends HTMLElement {

    static get tagName() {
        return 'md-content'
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = `<slot></slot><div class="md"></div>`;

        this.mdNode = this.shadow.querySelector('div');

        this.loadStyles();
    }

    connectedCallback() {
        const srcRef = this.getAttribute("src");
        if (srcRef) {
            this.loadFromUrl(srcRef).then((content) => {
                this.originalContent = content;
                this.renderedContent = this.parseMarkdown(content);
                this.mdNode.innerHTML = this.renderedContent;
            });
        } else {
            const content = this.loadFromSlot();
            this.originalContent = content;
            this.renderedContent = this.parseMarkdown(content);
            this.mdNode.innerHTML = this.renderedContent;
        }
    }

    loadFromUrl(src) {
        return fetch(src).then(response => response.text()).then(content => {
            return content;
        })
    }

    loadFromSlot() {
        const slot = this.shadow.querySelector("slot");
        return slot.assignedNodes()[0]?.nodeValue || '';
    }

    async loadStyles () {
        const cssModule = await import(`./${this.tagName.toLowerCase()}.css`, {
          assert: { type: 'css' }
        })
        this.shadowRoot.adoptedStyleSheets = [cssModule.default]
      }

    parseMarkdown (content = '') { 
        // https://www.npmjs.com/package/esm.markdown-it
        const markdown = new MarkdownIt();
        return markdown.render(content);
    }
}