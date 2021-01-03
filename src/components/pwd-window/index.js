/**
 * The pwd-window web component module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    h1 {
      color: rgb(8, 32, 77);
      display: inline-block;
      font-size: 1.5em;
      margin: 0;
      padding: 0.25em;
      cursor: default;
    }

    #window {
      border: solid 1px black;
      position: absolute;
    }

    #windowHeader {
      font-size: 16px;
      background-color: rgb(107, 198, 214);
      height: 2.42em;
    }

    #closeIcon {
      font-family: monospace, sans-serif;
      color: rgb(8, 32, 77);
      cursor: pointer;
      float: right;
      height: min-content;
      font-size: 1.9em;
      padding: 0 0.5em;
      padding-bottom: 0.1em;
      font-weight: 700;
    }

    #closeIcon:hover, #closeIcon:active {
      background-color: red;
    }
  </style>

  <div id="window">
    <div id="windowHeader">
      <h1 id="applicationName"></h1>
      <div id="closeIcon">x</div>
    </div>
    <slot></slot>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('pwd-window',
  /**
   * Represents a pwd-window custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a pwd-window custom element.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      /* ------------HTML ELEMENTS----------- */

      /**
       * A div element containing the name of the application to be displayed.
       *
       * @type {HTMLElement}
       */
      this._applicationName = this.shadowRoot.querySelector('#applicationName')

      /* ------------OTHER PROPERTIES----------- */

      /* ------------EVENT HANDLERS----------- */

    }

    /**
     * Watches the attributes "inactive" and "hidden" for changes on the element.
     *
     * @returns {string[]} An array of the observed attribute's names.
     */
    static get observedAttributes () {
      return ['name']
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name - Name of the attribute.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      this._applicationName.textContent = newValue
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {

    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {

    }
  }
)
