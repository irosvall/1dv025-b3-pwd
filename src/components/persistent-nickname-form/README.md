# &lt;persistent-nickname-form&gt;

A web component that represents a nickname form that saves the nickname persistent with local web storage.

## Properties

### `nickname`
The nickname. It's undefined till a nickname is set or retrieved from the local web storage.

Default value: undefined

## Methods

### `get nickname()`
A getter that gets the nickname.

Parameters: none

Returns: {number} this._nickname - The nickname.

### `set nickname()`
A setter that validates the nickname. It has to be present and be maximum 20 characters long. If it passes the validation the nickname gets saved persistent via local web storage.

Parameters: nickname

Returns: undefined

## Events

| Event Name    | Fired When                        |
| ------------- | --------------------------------- |
| `nicknameSet` | The nickname is set.              |

## Example
```html
   <persistent-nickname-form></persistent-nickname-form>
```