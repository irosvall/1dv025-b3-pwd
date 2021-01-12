/**
 * The drawing-app web component module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se>
 * @version 1.0.0
 */

const IMG_LINE_WIDTH_URL = (new URL('./images/line-width-icon.png', import.meta.url)).href
const IMG_ROUND_STROKE_URL = (new URL('./images/round-stroke-icon.png', import.meta.url)).href
const IMG_SQUARE_STROKE_URL = (new URL('./images/square-stroke-icon.png', import.meta.url)).href

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      position: relative;
      display: grid;
      grid-template-columns: 50px auto;
      width: 600px;
      height: 380px;
      border: solid 1px rgb(87, 87, 87);
    }

    button {
      cursor: pointer;
    }

    canvas {
      background-color: white;
    }

    .hidden {
      display: none;
    }

    #toolbar {
      background-color: rgb(248, 223, 195);
    }

    #previewCanvas {
      border: solid 3px rgb(228, 167, 165);
    }

    #lineCapButtons {
      display: flex;
      margin-left: 4px;
      gap: 2px;
    }

    #lineCapButtons .active {
      background-color: rgb(228, 167, 165);
    }

    #roundLineCapButton {
      background: url("${IMG_ROUND_STROKE_URL}");
    }

    #squareLineCapButton {
      background: url("${IMG_SQUARE_STROKE_URL}");
    }

    #roundLineCapButton, #squareLineCapButton {
      display: inline-block;
      background-size: cover;
      border: none;
      width: 20px;
      height: 20px;
    }
    
    #roundLineCapButton:hover, #roundLineCapButton:active, 
    #squareLineCapButton:hover, #squareLineCapButton:active  {
      background-color: rgb(228, 167, 165);
    }

    #lineWidthButton {
      background: url("${IMG_LINE_WIDTH_URL}");
      background-size: cover;
      border: none;
      width: 44px;
      height: 36px;
      margin-left: 3px;
    }

    #lineWidthRange {
      color: rgb(248, 223, 195);
      position: absolute;
      top: 72px;
      left: 55px;
      margin: 0;
      height: 40px;
      width: 100px;
    }

    #colorPicker {
      height: 44px;
      cursor: pointer;
    }
  </style>

  <div id="toolbar">
    <canvas id="previewCanvas" width="44" height="44"></canvas>
    <div id="lineCapButtons">
      <button id="roundLineCapButton" class="active"></button>
      <button id="squareLineCapButton"></button>
    </div>
    <button id="lineWidthButton"></button>
    <input id="lineWidthRange" class="hidden" type="range" min="1" max="40" value="5">
    <input id="colorPicker" type="color">
    <button id="clearButton">Clear</button>
  </div>
  <canvas id="mainCanvas" width="550" height="380"></canvas>
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
      this._canvas = this.shadowRoot.querySelector('#mainCanvas')

      /**
       * A canvas element to display the stroke style preview.
       *
       * @type {HTMLElement}
       */
      this._previewCanvas = this.shadowRoot.querySelector('#previewCanvas')

      /**
       * An input element of the type color.
       *
       * @type {HTMLElement}
       */
      this._colorPicker = this.shadowRoot.querySelector('#colorPicker')

      /**
       * An input element of the type range.
       *
       * @type {HTMLElement}
       */
      this._lineWidthRange = this.shadowRoot.querySelector('#lineWidthRange')

      /**
       * A button element for receiving the line width range.
       *
       * @type {HTMLElement}
       */
      this._lineWidthButton = this.shadowRoot.querySelector('#lineWidthButton')

      /**
       * A button element for clearing the drawing canvas.
       *
       * @type {HTMLElement}
       */
      this._clearButton = this.shadowRoot.querySelector('#clearButton')

      /**
       * A div element containing the buttons to change the line cap.
       *
       * @type {HTMLElement}
       */
      this._lineCapButtons = this.shadowRoot.querySelector('#lineCapButtons')

      /**
       * A button element for changing the line cap to 'round'.
       *
       * @type {HTMLElement}
       */
      this._roundLineCapButton = this.shadowRoot.querySelector('#roundLineCapButton')

      /**
       * A button element for changing the line cap to 'square'.
       *
       * @type {HTMLElement}
       */
      this._squareLineCapButton = this.shadowRoot.querySelector('#squareLineCapButton')

      /* ------------OTHER PROPERTIES----------- */

      /**
       * The rendering context of the canvas for drawing.
       *
       * @type {CanvasRenderingContext2D}
       */
      this._context = this._canvas.getContext('2d')

      /**
       * The rendering context of the stroke style preview canvas.
       *
       * @type {CanvasRenderingContext2D}
       */
      this._previewContext = this._previewCanvas.getContext('2d')

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
      this._color = '#000000'

      /**
       * The line width of the drawing stroke.
       *
       * @type {number}
       */
      this._lineWidth = 5

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
        if (event.button === 0) {
          this._isDrawing = true
          this._draw(this._context, event.offsetX, event.offsetY)
        }
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
          this._draw(this._context, event.offsetX, event.offsetY)
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

      /**
       * Handles input events for when the user changes the color value.
       *
       * Changes the color property value to the new value.
       *
       * @param {Event} event - The input event.
       */
      this._onColorInput = event => {
        this._color = event.target.value
        this._updatePreview()
      }

      /**
       * Handles click events for when the user clicks on line cap buttons.
       *
       * Changes the line cap property value to the new value.
       *
       * @param {Event} event - The click event.
       */
      this._onLineCapButtonsClick = event => {
        console.log(event.target)
        if (event.target === this._roundLineCapButton) {
          this._lineCap = 'round'
          this._roundLineCapButton.classList.add('active')
          this._squareLineCapButton.classList.remove('active')
        } else if (event.target === this._squareLineCapButton) {
          this._lineCap = 'square'
          this._squareLineCapButton.classList.add('active')
          this._roundLineCapButton.classList.remove('active')
        }
        this._updatePreview()
      }

      /**
       * Handles click events for when the user clicks the line width button.
       *
       * Toggles the line Width range.
       */
      this._onLineWidthButtonClick = () => {
        this._lineWidthRange.classList.toggle('hidden')
      }

      /**
       * Handles input events for when the user changes the line width value.
       *
       * Changes the line width property value to the new value.
       *
       * @param {Event} event - The input event.
       */
      this._onLineWidthInput = event => {
        this._lineWidth = event.target.value
        this._updatePreview()
      }

      /**
       * Handles click events for when the user clicks the 'clear' button.
       *
       * Clears the drawing canvas.
       */
      this._onClearButtonClick = () => {
        this._context.clearRect(0, 0, 550, 380)
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      // Shows the default stroke style in the preview.
      this._updatePreview()

      this._canvas.addEventListener('mousedown', this._onMousedown)
      this._canvas.addEventListener('mousemove', this._onMousemove)
      this._canvas.addEventListener('mouseup', this._onMouseup)
      this._lineCapButtons.addEventListener('click', this._onLineCapButtonsClick)
      this._lineWidthButton.addEventListener('click', this._onLineWidthButtonClick)
      this._lineWidthRange.addEventListener('input', this._onLineWidthInput)
      this._colorPicker.addEventListener('input', this._onColorInput)
      this._clearButton.addEventListener('click', this._onClearButtonClick)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._canvas.removeEventListener('mousedown', this._onMousedown)
      this._canvas.removeEventListener('mousemove', this._onMousemove)
      this._canvas.removeEventListener('mouseup', this._onMouseup)
      this._lineCapButtons.removeEventListener('click', this._onLineCapButtonsClick)
      this._lineWidthButton.removeEventListener('click', this._onLineWidthButtonClick)
      this._lineWidthRange.removeEventListener('input', this._onLineWidthInput)
      this._colorPicker.removeEventListener('input', this._onColorInput)
      this._clearButton.removeEventListener('click', this._onClearButtonClick)
    }

    /**
     * Inspiration on how to draw with canvas gathered from:
     * https://www.youtube.com/watch?v=3GqUM4mEYKA [visited: 2021-01-10]
     *
     * Draws a line on the canvas following the mouse coordinates.
     *
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} x - The mouse event's x-coordinate.
     * @param {number} y - The mouse event's y-coordinate.
     */
    _draw (context, x, y) {
      this._addDrawStyle(context)
      context.lineTo(x, y)
      context.stroke()
      context.beginPath()
      context.moveTo(x, y)
    }

    /**
     * Draws dots on the canvas following the mouse coordinates.
     *
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} x - The mouse event's x-coordinate.
     * @param {number} y - The mouse event's y-coordinate.
     */
    _drawDots (context, x, y) {
      this._addDrawStyle(context)
      context.beginPath()
      context.lineTo(x, y)
      context.stroke()
      context.moveTo(x, y)
    }

    /**
     * Styles the canvas context by styles given by properties.
     *
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     */
    _addDrawStyle (context) {
      context.strokeStyle = this._color
      context.lineWidth = this._lineWidth
      context.lineCap = this._lineCap
    }

    /**
     * Draws out a preview of the current draw stroke.
     */
    _updatePreview () {
      this._previewContext.clearRect(0, 0, 44, 44)
      this._draw(this._previewContext, 22, 22)
    }
  }
)
