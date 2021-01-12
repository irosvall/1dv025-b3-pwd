# &lt;memory-game&gt;

A web component that represents a memory game.

## Dependencies

### `Web components:`
```html
   <flipping-tile></flipping-tile>
   <count-up-timer></count-up-timer>
```

## Attributes

### `difficulty`

The `difficulty` attribute specifies the size of the grid. Its value must be `easy` (2x2), `medium` (4x2) or `hard` (4x4).

Default value: easy

## Events

| Event Name        | Fired When                        |
| ----------------- | --------------------------------- |
| `matchingTiles`   | The tiles facing up match.        |
| `NonMatchingTiles`| The tiles facing up do not match. |
| `allTilesMatched` | All tiles have matched.           |

## Example

```html
   <memory-game difficulty="hard"></memory-game>
```
