/**
 * The count-up-timer web component module.
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
      float: right;
      width: fit-content;
      font-size: 1.5em;
      font-weight: 1000;
      padding: 0.2em 0.75em;
    }
    time {
      margin: 0 auto;
    }
  </style>

  <time></time>  
`
/**
 * Define custom element.
 */
customElements.define('count-up-timer',
  /**
   * Represents a count-up-timer custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a count-up-timer custom element.
     *
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      /* ------------HTML ELEMENTS----------- */

      /**
       * A time element of which its text content will count upwards in seconds.
       *
       * @type {HTMLElement}
       */
      this._timeElement = this.shadowRoot.querySelector('time')

      /* ------------OTHER PROPERTIES----------- */

      /**
       * The total time a game session has taken.
       *
       * @type {number}
       */
      this._totalTime = 0

      /**
       * The ID of the interval used for the timer.
       *
       * @type {number}
       */
      this._IntervalID = null
    }

    /**
     * Get a player's total time.
     *
     * @returns {number} The total time.
     */
    get totalTime () {
      return this._totalTime
    }

    /**
     * Starts the timer.
     */
    startTimer () {
      this._timeElement.textContent = 0

      this._IntervalID = window.setInterval(() => {
        this._totalTime++
        this._timeElement.textContent = this._totalTime
      }, 1000)
    }

    /**
     * Stops the timer.
     */
    stopTimer () {
      clearInterval(this._IntervalID)
    }

    /**
     * Resets the total time value.
     */
    resetTotalTime () {
      this._totalTime = 0
    }
  })
