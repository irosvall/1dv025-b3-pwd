/**
 * The student-chat web component module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se>
 * @version 1.0.0
 */

import '../persistent-nickname-form/'

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .noDisplay {
      display: none;
    }
  </style>

  <persistent-nickname-form></persistent-nickname-form>
  <div id="chat">
  </div>
`

/**
 * Define custom element.
 */
customElements.define('student-chat',
  /**
   * Represents a student-chat custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a student-chat custom element.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      /* ------------HTML ELEMENTS----------- */

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
