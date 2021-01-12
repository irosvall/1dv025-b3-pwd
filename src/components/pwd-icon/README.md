# &lt;pwd-icon&gt;

A web component that represents a desktop icon which uses the custom element `pwd-window` to display web components in. Every time the icon is pressed a new window opens.

## Dependencies

### `Web component:`
```html
   <pwd-window></pwd-window>
```

## Attributes

### `app`
A string attribute representing a web component which, if specified, will launch the web component inside a pwd-window every time the icon is pressed.

Default value: undefined

### `title`
A string attribute which, if specified, will show the value of the attribute on the header of the pwd-window.

Default value: undefined

## Example
```html
   <pwd-icon app="web-component" title="A Title"></pwd-icon>
```