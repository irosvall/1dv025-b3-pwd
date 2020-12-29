# &lt;flipping-tile&gt;

A web component that represents a flipping card.

## Attributes

### `inactive`

A Boolean attribute which, if present, indicates that the user should not be able to interact with the element.

Default value: undefined

### `flip`

A Boolean attribute which, if present, renders the element flipped, showing its front.

Default value: undefined

### `hidden`

A Boolean attribute which, if present, doesn't display the front and back, only a border on the main tile.

Default value: undefined

## Events

| Event Name | Fired When           |
| ---------- | -------------------- |
| `flipped`  | The tile is flipped. |

## Styling with CSS

The main element (div) is styleable using the part `main-tile`.

The front element (div) is styleable using the part `front`.

The back element (div) is styleable using the part `back`.

## Example

```html
<flipping-tile hidden>
    <img src="./images/octopus.png" alt="octopus">
</flipping-tile>
```