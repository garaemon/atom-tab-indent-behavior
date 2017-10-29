# Tab key to indent always like Emacs in Atom

`tab-indent-behavior` provides `tab-indent-behavior:tab`.

1. Indent by hitting tab key
2. Move to the first character of the line if the cursor in the
heading spaces region.

Please configure your `keymap.cson` like:
```
'atom-workspace atom-text-editor:not([mini])':
  'tab': 'tab-indent-behavior:tab'
```
