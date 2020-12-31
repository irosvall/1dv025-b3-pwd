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
    .hidden {
      display: none;
    }
  </style>

  <persistent-nickname-form class="hidden"></persistent-nickname-form>
  <div id="chat" class="hidden">
    <div id="chatWindow"></div>
    <form id="chatForm">
      <label for="message">Write your message here:</label>
      <textarea name="message" id="message" cols="30" rows="1"></textarea>
      <input type="submit" value="Send">
    </form>
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

      /**
       * The persistent-nickname-form custom element to recieve the nickname.
       *
       * @type {HTMLElement}
       */
      this._persistentNicknameForm = this.shadowRoot.querySelector('persistent-nickname-form')

      /**
       * A div element containing the chat application.
       *
       * @type {HTMLElement}
       */
      this._chat = this.shadowRoot.querySelector('#chat')

      /**
       * A form element for sending chat messages.
       *
       * @type {HTMLElement}
       */
      this._chatForm = this.shadowRoot.querySelector('#chatForm')

      /**
       * A textarea element for writing in chat messages.
       *
       * @type {HTMLElement}
       */
      this._chatFormTextarea = this.shadowRoot.querySelector('#chatForm textarea')

      /**
       * A div element representing the chat window displaying the messages.
       *
       * @type {HTMLElement}
       */
      this._chatWindow = this.shadowRoot.querySelector('#chatWindow')

      /* ------------OTHER PROPERTIES----------- */

      /**
       * The websocket connection established to send and get messages from other students.
       *
       * @type {WebSocket}
       */
      this._webSocket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')

      /**
       * The user's nickname.
       *
       * @type {string}
       */
      this._nickname = this._persistentNicknameForm.nickname

      /* ------------EVENT HANDLERS----------- */

      /**
       * Handles nicknameSet custom events for when the user's nickname is set.
       *
       * @param {Event} event - The nicknameSet custom event.
       */
      this._onNicknameSet = event => {
        this._nickname = event.detail.nickname
        this._persistentNicknameForm.classList.add('hidden')
        this._chat.classList.remove('hidden')
      }

      /**
       * Handles message events for the web socket server sends a message.
       *
       * @param {Event} event - The message event.
       */
      this._onMessage = event => {
        this._displayMessage(event)
      }

      /**
       * Handles open events for the web socket server has established a connection.
       *
       * @param {Event} event - The open event.
       */
      this._onOpen = event => {
        console.log(event)
      }

      /**
       * Handles submit events for when the user sends a message to the chat.
       *
       * @param {Event} event - The submit event.
       */
      this._onSubmit = event => {
        event.preventDefault()
        this._sendMessage()
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._setUp()
      this._persistentNicknameForm.addEventListener('nicknameSet', this._onNicknameSet)
      this._webSocket.addEventListener('message', this._onMessage)
      this._webSocket.addEventListener('open', this._onOpen)
      this._chatForm.addEventListener('submit', this._onSubmit)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._persistentNicknameForm.removeEventListener('nicknameSet', this._onNicknameSet)
      this._webSocket.removeEventListener('message', this._onMessage)
      this._webSocket.removeEventListener('open', this._onOpen)
      this._chatForm.removeEventListener('submit', this._onSubmit)
    }

    /**
     * Display recieved message from the websocket.
     *
     * @param {Event} event - The message event.
     */
    _displayMessage (event) {
      let message = event.data
      message = JSON.parse(message)

      if (message.type === 'notification' || message.type === 'message') {
        const pElement = document.createElement('p')
        pElement.textContent = `${message.username}: ${message.data}`

        this._chatWindow.appendChild(pElement)
      }
    }

    /**
     * Send message via the websocket.
     */
    _sendMessage () {
      const message = this._chatFormTextarea.value
      if (message === '') {
        return
      }

      this._webSocket.send(JSON.stringify({
        type: 'message',
        data: `${message}`,
        username: `${this._nickname}`,
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }))

      this._chatFormTextarea.value = ''
    }

    /**
     * Sets up the DOM structur depending on if a nickname is set or not.
     */
    _setUp () {
      if (this._nickname === undefined) {
        this._persistentNicknameForm.classList.remove('hidden')
      } else {
        this._chat.classList.remove('hidden')
      }
    }
  }
)
