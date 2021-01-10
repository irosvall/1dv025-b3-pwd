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
      width: 600px;
      height: 380px;
      border: solid 1px rgb(87, 87, 87);
    }

    #toolbar {
      background-color: rgb(248, 223, 195);
    }

    canvas {
      background-color: white;
    }
  </style>

  <div id="toolbar"></div>
  <canvas width="550" height="380"></canvas>
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

      /**
       * A canvas element for the user to draw on.
       *
       * @type {HTMLElement}
       */
      this._canvas = this.shadowRoot.querySelector('canvas')

      /* ------------OTHER PROPERTIES----------- */

      /**
       * The rendering context of the canvas.
       *
       * @type {HTMLElement}
       */
      this._context = this._canvas.getContext('2d')

      /**
       * A Boolean indicating whether or not the user is drawing.
       *
       * @type {boolean}
       */
      this._isDrawing = false

      /**
       * The color of the drawing stroke.
       *
       * @type {string}
       */
      this._color = 'black'

      /**
       * The line width of the drawing stroke.
       *
       * @type {number}
       */
      this._lineWidth = 3

      /**
       * The line cap style of the drawing stroke.
       *
       * @type {string}
       */
      this._lineCap = 'round'

      /* ------------EVENT HANDLERS----------- */

      /**
       * Handles mousedown events for when the user press down the mouse button on the canvas.
       *
       * Starts drawing.
       *
       * @param {Event} event - The mousedown event.
       */
      this._onMousedown = event => {
        this._isDrawing = true
        this._draw(event.offsetX, event.offsetY)
      }

      /**
       * Handles mousemove events for when the user's cursor is moved inside the canvas.
       *
       * Draws.
       *
       * @param {Event} event - The mousemove event.
       */
      this._onMousemove = event => {
        if (this._isDrawing === true) {
          this._draw(event.offsetX, event.offsetY)
        }
      }

      /**
       * Handles mouseup events for when the user releases the mouse button from the canvas.
       *
       * Stops drawing.
       */
      this._onMouseup = () => {
        if (this._isDrawing === true) {
          this._isDrawing = false
          this._context.beginPath()
        }
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._canvas.addEventListener('mousedown', this._onMousedown)
      this._canvas.addEventListener('mousemove', this._onMousemove)
      this._canvas.addEventListener('mouseup', this._onMouseup)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._canvas.removeEventListener('mousedown', this._onMousedown)
      this._canvas.removeEventListener('mousemove', this._onMousemove)
      this._canvas.removeEventListener('mouseup', this._onMouseup)
    }

    /**
     * Draws a line on the canvas following the mouse coordinates.
     *
     * @param {number} x - The mouse event's x-coordinate.
     * @param {number} y - The mouse event's y-coordinate.
     */
    _draw (x, y) {
      this._addDrawStyle()
      this._context.lineTo(x, y)
      this._context.stroke()
      this._context.beginPath()
      this._context.moveTo(x, y)
    }

    /**
     * Draws dots on the canvas following the mouse coordinates.
     *
     * @param {number} x - The mouse event's x-coordinate.
     * @param {number} y - The mouse event's y-coordinate.
     */
    _drawDots (x, y) {
      this._addDrawStyle()
      this._context.beginPath()
      this._context.lineTo(x, y)
      this._context.stroke()
      this._context.moveTo(x, y)
    }

    /**
     * Styles the canvas context by styles given by properties.
     */
    _addDrawStyle () {
      this._context.strokeStyle = this._color
      this._context.lineWidth = this._lineWidth
      this._context.lineCap = this._lineCap
    }
  }
)
