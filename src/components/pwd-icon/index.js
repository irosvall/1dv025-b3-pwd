/**
 * The pwd-icon web component module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se>
 * @version 1.0.0
 */

// Dependencies
import '../pwd-window/'

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
    }

    ::slotted(*) {
      display: block;
      width: 60px;
      height: 60px;
    }
  </style>

  <div id="icon" tabindex="0">
    <slot></slot>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('pwd-icon',
  /**
   * Represents a pwd-icon custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a pwd-icon custom element.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      /* ------------HTML ELEMENTS----------- */

      /**
       * A div element representing the icon.
       *
       * @type {HTMLElement}
       */
      this._icon = this.shadowRoot.querySelector('#icon')

      /* ------------OTHER PROPERTIES----------- */

      /**
       * The title of the application.
       *
       * @type {string}
       */
      this._title = ''

      /**
       * The application name to create a html element with.
       *
       * @type {string}
       */
      this._app = ''

      /* ------------EVENT HANDLERS----------- */

      /**
       * Handles click events.
       */
      this._onClick = () => {
        this._startApplication()
      }
      
      /**
       * Handles keydown events.
       *
       * @param {KeyboardEvent} event - The keyboard event.
       */
      this._onKeydown = event => {
        if (event.code === 'Enter') {
          this._startApplication()
        }
      }
    }

    /**
     * Watches the attributes "inactive" and "hidden" for changes on the element.
     *
     * @returns {string[]} An array of the observed attribute's names.
     */
    static get observedAttributes () {
      return ['app', 'title']
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name - Name of the attribute.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'app') {
        this._app = newValue
      } else {
        this._title = newValue
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._icon.addEventListener('click', this._onClick)
      this._icon.addEventListener('keydown', this._onKeydown)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._icon.removeEventListener('click', this._onClick)
      this._icon.removeEventListener('keydown', this._onKeydown)
    }

    /**
     * Renders the application in a pwd-window custom element to the body element.
     */
    _startApplication () {
      const pwdWindow = document.createElement('pwd-window')
      pwdWindow.setAttribute('name', this._title)
      const app = document.createElement(this._app)
      pwdWindow.appendChild(app)

      document.body.appendChild(pwdWindow)
    }
  }
)
