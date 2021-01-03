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
    
  </style>

  <div id="window">
    <div id="windowHeader">
      <h1 id="applicationName"></h1>
      <div id="closeIcon"></div>
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
