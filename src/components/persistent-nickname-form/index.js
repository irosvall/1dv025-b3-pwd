/**
 * The persistent-nickname-form web component module.
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

`

/**
 * Define custom element.
 */
customElements.define('persistent-nickname-form',
  /**
   * Represents a persistent-nickname-form custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a persistent-nickname-form custom element.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
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
