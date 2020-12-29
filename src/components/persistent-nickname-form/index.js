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
    #nicknameForm {
      text-align: center;
    }

    #nicknameForm label {
      display: inline-block;
      font-size: 1.25em;
      padding-bottom: 0.7em;
    }
    #nicknameForm input {
      display: block;
      margin: 0 auto;
    }

    #nicknameInput {
      font-size: 1.3em;
      padding: 0.3em 0.5em;
    }

    #submitNickname input {
      color: white;
      background-color: rgb(165, 165, 141);
      font-size: 1.5em;
      font-weight: bold;
      margin-top: 2em;
      padding: 0.5em 1em;
      cursor: pointer;
      border-radius: 10px;
    }
  </style>

  <form id="nicknameForm">
    <div id="nicknameDiv">
      <label for="nicknameInput">Choose your nickname that other students will see:</label>
      <input id="nicknameInput" type="text" placeholder="Write your nickname here" autocomplete="off" autofocus>
      <p id="errorMessage"></p>
     </div>
    <div id="submitNickname">
       <input type="submit" value="Start chat">
     </div>
  </form>
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

      /**
       * The user's nickname.
       *
       * @type {string}
       */
      this.nickname = undefined

      /* ------------HTML ELEMENTS----------- */

      /**
       * The form element for submitting the nickname.
       *
       * @type {HTMLElement}
       */
      this._nicknameForm = this.shadowRoot.querySelector('#nicknameForm')

      /**
       * The input element to write in a nickname.
       *
       * @type {HTMLElement}
       */
      this._nicknameInput = this.shadowRoot.querySelector('#nicknameInput')

      /* ------------EVENT HANDLERS----------- */

      /**
       * Handles submit events for when the user submits its nickname.
       *
       * @param {Event} event - The submit event.
       */
      this._onNicknameSubmit = event => {
        this._handleNickname(event, this._nicknameInput.value)
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._nicknameForm.addEventListener('submit', this._onNicknameSubmit)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._nicknameForm.removeEventListener('submit', this._onNicknameSubmit)
    }
  }
)
