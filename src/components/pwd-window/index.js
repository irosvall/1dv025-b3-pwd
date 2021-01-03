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
       * A div element representing the entire window.
       *
       * @type {HTMLElement}
       */
      this._window = this.shadowRoot.querySelector('#window')

      /**
       * A div element containing the header of the window.
       *
       * @type {HTMLElement}
       */
      this._windowHeader = this.shadowRoot.querySelector('#windowHeader')

      /**
       * A div element containing the name of the application to be displayed.
       *
       * @type {HTMLElement}
       */
      this._applicationName = this.shadowRoot.querySelector('#applicationName')

      /* ------------OTHER PROPERTIES----------- */

      /**
       * The mouse x-coordinate.
       *
       * @type {number}
       */
      this._positionX = 0

      /**
       * The mouse y-coordinate.
       *
       * @type {number}
       */
      this._positionY = 0

      /**
       * A Boolean indicating whether or not the window is being dragged.
       *
       * @type {Boolean}
       */
      this._isDraging = false

      /* ------------EVENT HANDLERS----------- */

      /**
       * Handles mousedown events for when the user press down
       * the mouse button on the window's header.
       *
       * @param {Event} event - The mousedown event.
       */
      this._onMousedown = event => {
        // Prevent the text of being highlighted.
        event.preventDefault()

        this._positionX = event.clientX
        this._positionY = event.clientY
        this._isDraging = true
      }

      /**
       * Inspiration how to move element gathered from: 
       * https://www.w3schools.com/howto/howto_js_draggable.asp [visited: 2021-01-03]
       * 
       * Handles mousemove events for when the user's cursor
       * is moved inside the window's header.
       *
       * @param {Event} event - The mousemove event.
       */
      this._onMousemove = event => {
        if (this._isDraging === true) {
          const newPositionX = this._positionX - event.clientX
          const newPositionY = this._positionY - event.clientY
          this._positionX = event.clientX
          this._positionY = event.clientY
          
          this._window.style.left = `${this._window.offsetLeft - newPositionX}px`
          this._window.style.top = `${this._window.offsetTop - newPositionY}px`
        }
      }

      /**
       * Handles mouseup events for when the user releases 
       * the mouse button from the window's header.
       */
      this._onMouseup = () => {
        if (this._isDraging === true) {
          this._positionX = 0
          this._positionY = 0
          this._isDraging = false
        }
      }
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
      this._windowHeader.addEventListener('mousedown', this._onMousedown)
      this._windowHeader.addEventListener('mousemove', this._onMousemove)
      this._windowHeader.addEventListener('mouseup', this._onMouseup)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._windowHeader.removeEventListener('mousedown', this._onMousedown)
      this._windowHeader.removeEventListener('mousemove', this._onMousemove)
      this._windowHeader.removeEventListener('mouseup', this._onMouseup)
    }
  }
)
