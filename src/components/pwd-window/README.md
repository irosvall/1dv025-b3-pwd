# &lt;pwd-window&gt;

A web component that represents a window which can store a html element within its slotted space. The window is draggable by holding down the mouse button on the window's header. The window won't surpass the browser's window, and it stacks on top of other pwd-window components by giving out the highest z-index.

## Attributes

### `name`

A string attribute which, if specified, will show the value of the attribute on the header of the window.

Default value: undefined

## Events

| Event Name | Fired When            |
| ---------- | --------------------- |
| `close`    | The window is closed. |

## Example
```html
   <pwd-window name="A Title">
     <a-web-component></a-web-component>
   </pwd-window>
```