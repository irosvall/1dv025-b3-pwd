/**
 * The pwd-icon web component module.
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
    #icon {
      display: inline-block;
    }

    slot {
      width: 100%;
      height: 100%;
    }

    ::slotted(*) {
      width: 50px;
      height: 50px;
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

      /* ------------OTHER PROPERTIES----------- */

      /* ------------EVENT HANDLERS----------- */
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
