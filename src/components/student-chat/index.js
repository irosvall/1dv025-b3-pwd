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
    textarea {
      background-color:rgb(235, 251, 253);
      font-size: 1.2em;
      padding: 0.2em 0.5em;
      resize: none;
      font-family: inherit;
      width: 250px;
      height: 1.45em;
    }

    #chat {
      position: relative;
    }

    #chatWindow {
      background-color: rgb(254, 255, 255);
      box-sizing: border-box;
      padding: 0 5px;
      width: 332px;
      height: 280px;
      overflow-y: auto;
    }

    #chatWindow p {
      box-sizing: border-box;
      display: block;
      max-width: 322px;
      word-wrap: break-word;
      font-size: 1.2em;
      margin: 0.5em 0;
    }

    #chatForm {
      display: flex;
    }

    #chatForm input {
      background-color:rgb(119, 224, 243);
      font-size: 1.2em;
      border-collapse: collapse;
    }

    #errorMessage {
      position: absolute;
      left: 3px;
      top: 245px;
      color: red;
    }

    .hidden {
      display: none;
    }

    .offScreen {
      position: absolute;
      left: -100000px;
    }
  </style>

  <persistent-nickname-form class="hidden"></persistent-nickname-form>
  <div id="chat" class="hidden">
    <div id="chatWindow"></div>
    <p id="errorMessage" class="hidden">No connection, try restart.</p>
    <form id="chatForm">
      <label for="message" class="offScreen">Write your message here:</label>
      <textarea name="message" id="message"></textarea>
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

      /**
       * A p element displaying error messages.
       *
       * @type {HTMLElement}
       */
      this._errorMessage = this.shadowRoot.querySelector('#errorMessage')

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

      /**
       * The amount of old messages.
       *
       * @type {number}
       */
      this._oldMessagesAmount = 0

      /**
       * An object matching text representing smileys to its textbased smiley.
       *
       * @type {object}
       */
      this._smileys = {
        ':)': `${String.fromCodePoint(0x1F60A)}`,
        ':D': `${String.fromCodePoint(0x1F603)}`,
        ':(': `${String.fromCodePoint(0x1F641)}`,
        ':p': `${String.fromCodePoint(0x1F61B)}`,
        ':o': `${String.fromCodePoint(0x1F62E)}`
      }

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
       * Handles submit events for when the user sends a message to the chat.
       *
       * @param {Event} event - The submit event.
       */
      this._onSubmit = event => {
        event.preventDefault()
        this._sendMessage()
      }

      /**
       * Handles input events for when the user writes in the chat's textarea.
       *
       * Changes emoji-like characters to emojis.
       */
      this._onTextareaInput = () => {
        this._chatFormTextarea.value = this._chatFormTextarea.value.replace(/(:|=|:-)+(\)|\(|D|P|p|O|o)/g, char => {
          char = char.replace(/=|:-/, ':')
          char = char.replace(/P/, 'p')
          char = char.replace(/O/, 'o')
          return this._smileys[char]
        })
      }

      /**
       * Handles keydown events for when the user press down keys in the chat's textarea.
       *
       * @param {Event} event - The keydown event.
       */
      this._onTextareaKeydown = event => {
        if (event.code === 'Enter' &&
          !event.shiftKey &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.metaKey) {
          this._onSubmit(event)
        }
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._persistentNicknameForm.addEventListener('nicknameSet', this._onNicknameSet)
      this._webSocket.addEventListener('message', this._onMessage)
      this._chatForm.addEventListener('submit', this._onSubmit)
      this._chatFormTextarea.addEventListener('input', this._onTextareaInput)
      this._chatFormTextarea.addEventListener('keydown', this._onTextareaKeydown)
      this._setUp()
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._persistentNicknameForm.removeEventListener('nicknameSet', this._onNicknameSet)
      this._webSocket.removeEventListener('message', this._onMessage)
      this._chatForm.removeEventListener('submit', this._onSubmit)
      this._chatFormTextarea.removeEventListener('input', this._onTextareaInput)
      this._chatFormTextarea.removeEventListener('keydown', this._onTextareaKeydown)
      this._webSocket.close()
      this._storeMessages()
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
        this._chatWindow.scrollTop = this._chatWindow.scrollHeight
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

      if (this._webSocket.readyState === 1) {
        this._webSocket.send(JSON.stringify({
          type: 'message',
          data: `${message}`,
          username: `${this._nickname}`,
          key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
        }))
      } else {
        this._errorMessage.classList.remove('hidden')
        window.setTimeout(() => {
          this._errorMessage.classList.add('hidden')
        }, 5000)
      }

      this._chatFormTextarea.value = ''
    }

    /**
     * Sets up the DOM structur depending on if a nickname is set or not.
     */
    _setUp () {
      this._renderStoredMessages()
      if (this._nickname === undefined) {
        this._persistentNicknameForm.classList.remove('hidden')
      } else {
        this._chat.classList.remove('hidden')
      }
    }

    /**
     * Renders the old messages to the chat window from the local web storage.
     */
    _renderStoredMessages () {
      if (window.localStorage.getItem('pwd-student-chat-messages')) {
        const messages = JSON.parse(window.localStorage.getItem('pwd-student-chat-messages'))
        this._oldMessagesAmount = messages.length

        const fragment = document.createDocumentFragment()

        for (const message of messages) {
          const pElement = document.createElement('p')
          pElement.textContent = message
          fragment.appendChild(pElement)
        }
        fragment.appendChild(document.createElement('br'))

        this._chatWindow.appendChild(fragment)
      }
    }

    /**
     * Updates the local web storage with the most recent messages up to 20 messages.
     */
    _storeMessages () {
      const messagesNodeList = this._chatWindow.querySelectorAll('p')

      if (messagesNodeList.length < 2) {
        return
      }

      const messages = Array.from(messagesNodeList)
        .map(element => element.textContent)

      // Delete old messages.
      messages.splice(0, this._oldMessagesAmount)

      // If no new messages then the old messages from last session will stay till next session.
      if (messages.length < 2) {
        return
      }

      // Keep 21 messages if over 20 (21 to change the oldest to the date).
      if (messages.length > 20) {
        const difference = messages.length - 21
        messages.splice(0, difference)
      }

      // Changes the first message to the current date.
      messages[0] = `From: ${new Date().toISOString().slice(0, 10)}`

      window.localStorage.setItem('pwd-student-chat-messages', JSON.stringify(messages))
    }
  }
)
