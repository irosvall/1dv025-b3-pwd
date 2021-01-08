/**
 * The memory-game web component module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se>
 * @version 1.0.0
 */

// Dependencies
import '../flipping-tile/'
import '../count-up-timer/'

// All memory images being used. Made by Moa Alfredsson, used as study material.
const IMG_CLOCK_URL = (new URL('./images/clock.png', import.meta.url)).href
const IMG_FLOWER_URL = (new URL('./images/flower.png', import.meta.url)).href
const IMG_MAN_URL = (new URL('./images/man-in-hat.png', import.meta.url)).href
const IMG_OCTOPUS_URL = (new URL('./images/octopus.png', import.meta.url)).href
const IMG_PHONOGRAPH_URL = (new URL('./images/phonograph.png', import.meta.url)).href
const IMG_SCISSOR_URL = (new URL('./images/scissor.png', import.meta.url)).href
const IMG_SKULL_URL = (new URL('./images/skull.png', import.meta.url)).href
const IMG_TEACUP_URL = (new URL('./images/teacup.png', import.meta.url)).href

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    #container {
      background-color: rgb(255, 255, 255);
      position: relative;
      width: fit-content;
    }

    .gridEasy, .gridMedium, .gridHard {
      display: grid;
      justify-items: stretch;
    }

    .gridEasy {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      padding: 13px 0 0 13px;
    }

    .gridMedium, .gridHard {
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr 1fr;
      gap: 6px;
      padding: 5px 8px 8px 4px;
    }

    .hidden {
      display: none;
    }

    #memoryBoard {
      box-sizing: border-box;
      width: 430px;
      height: 430px;
    }

    #difficultyBar {
      display: block;
    }

    #difficultyBar p {
      display: inline;
    }

    #winScreen {
      color: white;
      background-color: rgba(8, 32, 77, 0.829);
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      text-align: center;
    }

    #winScreen:focus {
      outline-style: solid;
      outline-color:rgba(8, 32, 77, 0.945);
    }

    #winScreen h2, #winScreen p {
      font-weight: 700;
      margin: 0.5em 0;
    }

    #winScreen h2 {
      margin-top: 30%;
      font-size: 3.4em;
    }

    #winScreen p {
      font-size: 2.1em;
    }

    #winScreen #explanation {
      font-size: 1.3em;
      margin-top: 20%;
    }

  </style>

  <div id="container">
    <div id="difficultyBar">
      <p>Difficulty: </p>
      <button id="easyButton">Easy</button>
      <button id="mediumButton">Medium</button>
      <button id="hardButton">Hard</button>
    </div>
    <div id="memoryBoard" class="gridEasy"></div>
    <div id="winScreen" class="hidden" tabindex="0"></div>
  </div>
`
customElements.define('memory-game',
  /**
   * Represents a memory-game custom element.
   *
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a memory-game custom element.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      /* ------------HTML ELEMENTS----------- */

      /**
       * A div element representing the collection of the memory cards.
       *
       * @type {HTMLElement}
       */
      this._memoryBoard = this.shadowRoot.querySelector('#memoryBoard')

      /**
       * A buttom element for changing the difficulty to easy.
       *
       * @type {HTMLElement}
       */
      this._easyButton = this.shadowRoot.querySelector('#easyButton')

      /**
       * A buttom element for changing the difficulty to medium.
       *
       * @type {HTMLElement}
       */
      this._mediumButton = this.shadowRoot.querySelector('#mediumButton')

      /**
       * A buttom element for changing the difficulty to hard.
       *
       * @type {HTMLElement}
       */
      this._hardButton = this.shadowRoot.querySelector('#hardButton')

      /**
       * A div element displaying what the user will see when all tiles has matched.
       *
       * @type {HTMLElement}
       */
      this._winScreen = this.shadowRoot.querySelector('#winScreen')

      /**
       * A count-up-timer custom element for displaying a timer.
       *
       * @type {HTMLElement}
       */
      this._countUpTimer = undefined

      /* ------------OTHER PROPERTIES----------- */

      /**
       * The first flipped flipping-tile custom element to be compared with the second.
       *
       * @type {HTMLElement}
       */
      this._firstFlippedTile = ''

      /**
       * The amount of flipping cards to used in the game.
       *
       * @type {number}
       */
      this._numberOfCards = 0

      /**
       * How many times the user has flipped cards in a row.
       *
       * @type {number}
       */
      this._flippedCount = 0

      /**
       * How many attempts the user made to match tiles.
       *
       * @type {number}
       */
      this._attempts = 0

      /**
       * The difficulty the user is playing on.
       *
       * @type {string}
       */
      this._difficulty = undefined

      /* ------------EVENT HANDLERS----------- */

      /**
       * Handles click events for when the difficulty is changed to easy.
       */
      this._onEasyButtonClick = () => {
        this.setAttribute('difficulty', 'easy')
      }

      /**
       * Handles click events for when the difficulty is changed to medium.
       */
      this._onMediumButtonClick = () => {
        this.setAttribute('difficulty', 'medium')
      }

      /**
       * Handles click events for when the difficulty is changed to hard.
       */
      this._onHardButtonClick = () => {
        this.setAttribute('difficulty', 'hard')
      }

      /**
       * Handles custom flipped events for when a flipping-tile custom element has been flipped.
       *
       * @param {Event} event - The flipped event.
       */
      this._onFlipped = event => {
        if (this._flippedCount === 0) {
          event.target.setAttribute('inactive', '')
          this._firstFlippedTile = event.target
          this._flippedCount++
        } else {
          this._attempts++
          this._makeAllTilesNonFlipable()

          // Checks if the tiles match each other.
          if (this._firstFlippedTile.isEqualNode(event.target)) {
            this.dispatchEvent(new CustomEvent('matchingTiles', {
              detail: {
                firstCard: `${this._firstFlippedTile}`,
                secondCard: `${event.target}`
              }
            }))
            this._matchingTiles(event.target)
          } else {
            this.dispatchEvent(new CustomEvent('NonMatchingTiles'))
            this._nonMatchingTiles(event.target)
          }
        }
      }

      /**
       * Handles click events for when the user clicks the winning screen.
       */
      this._onWinScreenClick = () => {
        this._startNewGame()
      }

      /**
       * Handles keydown events for when the user press down the close button.
       *
       * @param {Event} event - The keydown event.
       */
      this._onWinScreenKeydown = event => {
        if (event.code === 'Enter') {
          this._startNewGame()
          this._memoryBoard.firstElementChild.focus()
        }
      }
    }

    /**
     * Watches the attributes "difficulty" for changes on the element.
     *
     * @returns {string[]} An array of the observed attribute's names.
     */
    static get observedAttributes () {
      return ['difficulty']
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name - Name of the attribute.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (newValue === 'easy' || newValue === 'medium' || newValue === 'hard') {
        this._difficulty = newValue

        // Resets values.
        this._countUpTimer.stopTimer()
        this._countUpTimer.resetTotalTime()
        this._resetFlippedCount()
        this._attempts = 0
        this._memoryBoard.classList.remove('gridEasy', 'gridMedium', 'gridHard')

        // Render cards depending on difficulty.
        if (this._difficulty === 'easy') {
          this._memoryBoard.classList.add('gridEasy')
          this._numberOfCards = 4
        } else if (this._difficulty === 'medium') {
          this._memoryBoard.classList.add('gridMedium')
          this._numberOfCards = 8
        } else {
          this._memoryBoard.classList.add('gridHard')
          this._numberOfCards = 16
        }
        this._renderMemoryCards()
        this._countUpTimer.startTimer()
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      // Create timer here for its constuctor to be called on time.
      this._countUpTimer = document.createElement('count-up-timer')
      this.shadowRoot.querySelector('#difficultyBar').appendChild(this._countUpTimer)

      // If no difficulty was specified as attribute, render easy difficulty as default.
      if (this._numberOfCards === 0) {
        this.setAttribute('difficulty', 'easy')
      }

      this._easyButton.addEventListener('click', this._onEasyButtonClick)
      this._mediumButton.addEventListener('click', this._onMediumButtonClick)
      this._hardButton.addEventListener('click', this._onHardButtonClick)
      this._memoryBoard.addEventListener('flipped', this._onFlipped)
      this._winScreen.addEventListener('click', this._onWinScreenClick)
      this._winScreen.addEventListener('keydown', this._onWinScreenKeydown)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._easyButton.removeEventListener('click', this._onEasyButtonClick)
      this._mediumButton.removeEventListener('click', this._onMediumButtonClick)
      this._hardButton.removeEventListener('click', this._onHardButtonClick)
      this._memoryBoard.removeEventListener('flipped', this._onFlipped)
      this._winScreen.removeEventListener('click', this._onWinScreenClick)
      this._winScreen.removeEventListener('keydown', this._onWinScreenKeydown)
    }

    /**
     * Starts a new game with the same difficulty as previously played on.
     */
    _startNewGame () {
      this.setAttribute('difficulty', this._difficulty)
      this._winScreen.classList.add('hidden')
    }

    /**
     * Fires when two flipping-tile custom elements match. Makes the cards hidden and check if all tiles are hidden, if so user wins.
     *
     * @param {HTMLElement} secondTile - The second flipping-tile custom element to be flipped.
     */
    _matchingTiles (secondTile) {
      window.setTimeout(() => {
        secondTile.setAttribute('hidden', '')
        this._firstFlippedTile.setAttribute('hidden', '')
        this._checkIfAllTilesMatched()
        this._resetFlippedCount()
        this._makeAllTilesFlipable()
      }, 1300)
    }

    /**
     * Fires when two flipping-tile custom elements doesn't match. Reflip the cards upside-down.
     *
     * @param {HTMLElement} secondTile - The second flipping-tile custom element to be flipped.
     */
    _nonMatchingTiles (secondTile) {
      window.setTimeout(() => {
        secondTile.removeAttribute('flip')
        this._firstFlippedTile.removeAttribute('flip')
        this._resetFlippedCount()
        this._makeAllTilesFlipable()
      }, 1300)
    }

    /**
     * Checks if all tiles have been matched, if so the user wins the memory game.
     */
    _checkIfAllTilesMatched () {
      const tiles = Array.from(this._memoryBoard.querySelectorAll('flipping-tile'))
      for (const tile of tiles) {
        if (!tile.hasAttribute('hidden')) {
          return
        }
      }
      this._allTilesMatched()
    }

    /**
     * Fires when all flipping-tile custom elements has matched.
     * Renders out details about how the game went.
     */
    _allTilesMatched () {
      this.dispatchEvent(new CustomEvent('allTilesMatched'))

      this._countUpTimer.stopTimer()
      this._renderWinningScreenText()
      this._winScreen.classList.remove('hidden')
      this._winScreen.focus()
    }

    /**
     * Make all flipping-tile custom elements non-flipable if they not already hidden.
     */
    _makeAllTilesNonFlipable () {
      const tiles = Array.from(this._memoryBoard.querySelectorAll('flipping-tile'))
      for (const tile of tiles) {
        if (!tile.hasAttribute('hidden')) {
          tile.setAttribute('inactive', '')
        }
      }
    }

    /**
     * Make all flipping-tile custom elements flipable.
     */
    _makeAllTilesFlipable () {
      const tiles = Array.from(this._memoryBoard.querySelectorAll('flipping-tile'))
      for (const tile of tiles) {
        tile.removeAttribute('inactive')
      }
    }

    /**
     * Resets the flipped counter to 0.
     */
    _resetFlippedCount () {
      this._flippedCount = 0
    }

    /**
     * Renders out the memory cards on the memory board depending on the difficulty.
     */
    _renderMemoryCards () {
      const flippingTileArray = this._createMemoryCards()
      const fragment = document.createDocumentFragment()

      flippingTileArray.forEach(element => {
        fragment.appendChild(element)
      })

      this._memoryBoard.textContent = ''
      this._memoryBoard.appendChild(fragment)
    }

    /**
     * Renders the result text that user sees when all tiles have matched.
     */
    _renderWinningScreenText () {
      const fragment = document.createDocumentFragment()

      const congratzText = document.createElement('h2')
      congratzText.textContent = 'Good job!'
      fragment.appendChild(congratzText)

      const result = document.createElement('p')
      result.textContent = `Attempts: ${this._attempts}`
      fragment.appendChild(result)

      const time = document.createElement('p')
      time.textContent = `Time: ${this._countUpTimer.totalTime} s`
      fragment.appendChild(time)

      const explanation = document.createElement('p')
      explanation.setAttribute('id', 'explanation')
      explanation.textContent = '(Click or press enter to play again)'
      fragment.appendChild(explanation)

      this._winScreen.textContent = ''
      this._winScreen.appendChild(fragment)
    }

    /**
     * Creates an array with shuffled duplicated flipping-tile custom elements.
     *
     * @returns {Array} An array containing the ducplicated flipping-tile custom elements.
     */
    _createMemoryCards () {
      try {
        const flippingTileArray = []
        while (flippingTileArray.length < this._numberOfCards) {
          if (flippingTileArray.length === 0) {
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_CLOCK_URL, 'Clock'))
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_CLOCK_URL, 'Clock'))
          } else if (flippingTileArray.length === 2) {
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_FLOWER_URL, 'Flower'))
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_FLOWER_URL, 'Flower'))
          } else if (flippingTileArray.length === 4) {
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_MAN_URL, 'Man in hat'))
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_MAN_URL, 'Man in hat'))
          } else if (flippingTileArray.length === 6) {
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_OCTOPUS_URL, 'Octopus'))
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_OCTOPUS_URL, 'Octopus'))
          } else if (flippingTileArray.length === 8) {
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_PHONOGRAPH_URL, 'Phonograph'))
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_PHONOGRAPH_URL, 'Phonograph'))
          } else if (flippingTileArray.length === 10) {
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_SCISSOR_URL, 'Scissor'))
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_SCISSOR_URL, 'Scissor'))
          } else if (flippingTileArray.length === 12) {
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_SKULL_URL, 'Skull'))
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_SKULL_URL, 'Skull'))
          } else if (flippingTileArray.length === 14) {
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_TEACUP_URL, 'Teacup'))
            flippingTileArray.push(this._createFlippingTileWithImage(IMG_TEACUP_URL, 'Teacup'))
          }
        }
        this._shuffleArray(flippingTileArray)
        return flippingTileArray
      } catch {
        console.error('Non valid amount of memory cards to be created')
      }
    }

    /**
     * Returns a flipping-tile custom element containing an img element.
     *
     * @param {string} src - The image URL for the src tag.
     * @param {string} alt - The decription of the image for the alt tag.
     * @returns {HTMLElement} The flipping-tile custom element containing an img element.
     */
    _createFlippingTileWithImage (src, alt) {
      const img = document.createElement('img')
      img.setAttribute('src', `${src}`)
      img.setAttribute('alt', `${alt}`)
      const tile = document.createElement('flipping-tile')
      tile.appendChild(img)
      return tile
    }

    /**
     * A shuffler based on Fisher-Yates shuffle algorithm.
     * Gathered from: https://www.tutorialspoint.com/what-is-fisher-yates-shuffle-in-javascript [Visited: 2020-12-15].
     *
     * @param {Array} array - The array to be shuffled.
     */
    _shuffleArray (array) {
      let i = array.length
      let k, temp // k is to generate random index and temp is to swap the values
      while (--i > 0) {
        k = Math.floor(Math.random() * (i + 1))
        temp = array[k]
        array[k] = array[i]
        array[i] = temp
      }
    }
  }
)
