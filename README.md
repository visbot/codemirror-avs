# codemirror-avs

[![npm](https://flat.badgen.net/npm/license/@visbot/codemirror-avs)](https://www.npmjs.org/package/@visbot/codemirror-avs)
[![npm](https://flat.badgen.net/npm/v/@visbot/codemirror-avs)](https://www.npmjs.org/package/@visbot/codemirror-avs)
[![CI](https://img.shields.io/github/workflow/status/visbot/codemirror-avs/CI?style=flat-square)](https://github.com/visbot/codemirror-avs/actions)
[![David](https://flat.badgen.net/david/dev/visbot/codemirror-avs)](https://david-dm.org/visbot/codemirror-avs?type=dev)

## Description

A mode for [Winamp AVS](https://www.wikiwand.com/en/Advanced_Visualization_Studio) to use with [CodeMirror](https://codemirror.net/), the versatile text editor implemented in JavaScript for the browser.

[Demo Time](https://visbot.github.io/codemirror-avs/) 🙌

## Installation

Use your preferred [Node](https://nodejs.org) package manager to install the mode

```sh
$ yarn add @visbot/codemirror-avs || npm install @visbot/codemirror-avs
```

Alternatively, you can clone this repository

```sh
$ git clone https://github.com/visbot/codemirror-avs
```

## Usage

Example usage on website

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Import CodeMirror styles -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5/lib/codemirror.min.css">
<head>
</head>
<body>
  <!-- Add Textarea -->
  <textarea id="editor"></textarea>

  <!-- Import CodeMirror library -->
  <script defer src="https://cdn.jsdelivr.net/npm/codemirror@5/lib/codemirror.min.js"></script>

  <!-- Import AVS mode -->
  <script defer src="https://cdn.jsdelivr.net/npm/@visbot/codemirror-avs@latest/dist/avs.js"></script>

  <!-- Initialize CodeMirror -->
  <script type="text/javascript">
    const editor = document.getElementById('editor');
    const options = {
      lineNumbers: true,
      mode: 'avs'
    };

    const cm = CodeMirror.fromTextArea(editor, options);
  </script>
</body>
</html>
```

**Note**: If you want to load CodeMirror from a CDN, make sure to specify a specific version for better performance – the example above doesn't to keep it simple.

### Modes

Beside the loose `avs` mode, you can specify stricter modes for specific components:

Mode                            | Effect
--------------------------------|-------
`avs/bump`                      | Trans/Bump
`avs/color-modifier`            | Trans/Color Modifier
`avs/dynamic-distance-modifier` | Trans/Dynamic Distance Modifier
`avs/dynamic-movement`          | Trans/Dynamic Movement
`avs/dynamic-shift`             | Trans/Dynamic Shift
`avs/effect-list`               | Effect List
`avs/movement`                  | Trans/Movement
`avs/superscope`                | Render/SuperScope
`avs/texer2`                    | Render/Texer II
`avs/triangle`                  | Render/Triangle

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)
