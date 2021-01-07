/**
 * The flipping-tile web component module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se>
 * @version 1.0.0
 */

const backgroundImage = (new URL('./images/lnu-symbol.png', import.meta.url)).href

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      outline: none;
      margin: 3px;
      vertical-align: top;
      display: inline-block;
      max-width: 184px;
      max-height: 184px;
      position: relative;
    }

    :host(:focus) #tile {
      box-shadow: 0 0 7px black; 
    }

    :host([inactive]) #tile, :host([hidden]) #tile {
      box-shadow: none;
      cursor: unset; 
    }

    :host([hidden]) #back, :host([hidden]) #front {
      display: none;
    }

    :host([hidden]) #tile {
      border-style: solid;
      border-color: rgba(0, 0, 0, 0.244);
    }

    :host([flip]) #tile {
      transform: rotateY(180deg);
    }

    #tile {
      height: 100%;
      width: 100%;
      border: solid 2px rgba(0, 0, 0, 0.644);
      border-radius: 8px;
      background-color: #fff;
      cursor: pointer;
      transform-style: preserve-3d;
      transition: transform 1s;
    }

    #back, #front {
      border-radius: 10px;
      width: 100%;
      height: 100%;
      position: absolute;
      backface-visibility: hidden;
    }

    #back {
      background: rgb(216, 252, 252) no-repeat center/50% url("${backgroundImage}") ;
    }

    #front {
      transform: rotateY(180deg);
    }

    slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    ::slotted(*) {
      max-height: 80%;
      max-width: 80%;
      text-overflow: clip;
      overflow: hidden;
    }

  </style>

  <div id="tile" part="main-tile">
    <div id="front" part="front">
      <slot></slot>
    </div>
      <div id="back" part="back"></div>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('flipping-tile',
  /**
   * Represents a flipping-tile custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a flipping-tile custom element.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    /**
     * Watches the attributes "inactive" and "hidden" for changes on the element.
     *
     * @returns {string[]} An array of the observed attribute's names.
     */
    static get observedAttributes () {
      return ['inactive', 'hidden']
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name - Name of the attribute.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (newValue || newValue === '') {
        this.setAttribute('tabindex', '-1')
      } else if (!this.hasAttribute('inactive') && !this.hasAttribute('hidden')) {
        this.setAttribute('tabindex', '0')
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      // Make flipping-tile keyboard focusable.
      this.setAttribute('tabindex', '0')

      this.addEventListener('click', this._flipCard)
      this.addEventListener('keydown', this._onkeydown)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.removeEventListener('click', this._flipCard)
      this.removeEventListener('keydown', this._onkeydown)
    }

    /**
     * Handles keydown events.
     *
     * @param {Event} event - The keydown event.
     */
    _onkeydown (event) {
      if (event.code === 'Enter') {
        this._flipCard()
      }
    }

    /**
     * Flips the tile.
     * Gets triggered during click and keydown events.
     */
    _flipCard () {
      // Don't flip if tile is hidden or inactive.
      if (this.hasAttribute('inactive') || this.hasAttribute('hidden')) {
        return
      }

      // Toggle the flip attribute.
      if (this.hasAttribute('flip')) {
        this.removeAttribute('flip')
        this._addFlippedEvent('back')
      } else {
        this.setAttribute('flip', '')
        this._addFlippedEvent('front')
      }
    }

    /**
     * Creates and dispatch the custom event flipped.
     *
     * @param {string} side - Specifies if it's the front or back side of the tile showing.
     */
    _addFlippedEvent (side) {
      this.dispatchEvent(new CustomEvent('flipped', {
        bubbles: true,
        detail: { side: `${side}` }
      }))
    }
  }
)
