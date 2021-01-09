/**
 * The drawing-app web component module.
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
    :host {
      display: grid;
      grid-template-columns: 50px auto;
      position: relative;
      width: 600px;
      height: 380px;
      border: solid 1px rgb(87, 87, 87);
    }

    #toolbar {
      background-color: rgb(248, 223, 195);
    }

    canvas {
      background-color: white;
      width: 100%;
      height: 100%;
    }
  </style>

  <div id="toolbar"></div>
  <canvas></canvas>
`

/**
 * Define custom element.
 */
customElements.define('drawing-app',
  /**
   * Represents a drawing-app custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a drawing-app custom element.
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
