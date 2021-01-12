# &lt;count-up-timer&gt;

A web component that represents a timer that counts up in seconds.

## Methods

### `startTimer()`
A method that starts the timer when called. It counts up in seconds and render it as text content in the time element.

Parameters: none

Returns: undefined

### `stopTimer()`
A method that stops the timer when called. The timer interval is cleared.

Parameters: none

Returns: undefined

### `resetTotalTime()`
A method that resets the total time that has went by when called.

Parameters: none

Returns: undefined

### `get totalTime()`
A getter that gets the total time that has went by.

Parameters: none

Returns: {number} this._totalTime - The total time.

## Example
```html
   <count-up-timer></count-up-timer>
```