# codemirror-avs

[![npm](https://img.shields.io/npm/l/@visbot/codemirror-avs.svg?style=flat-square)](https://www.npmjs.org/package/@visbot/codemirror-avs)
[![npm](https://img.shields.io/npm/v/@visbot/codemirror-avs.svg?style=flat-square)](https://www.npmjs.org/package/@visbot/codemirror-avs)
[![CircleCI](https://img.shields.io/circleci/project/visbot/codemirror-avs.svg?style=flat-square)](https://circleci.com/gh/visbot/codemirror-avs)
[![David](https://img.shields.io/david/dev/visbot/codemirror-avs.svg?style=flat-square)](https://david-dm.org/visbot/codemirror-avs?type=dev)

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

  <!-- Optional: Import a CodeMirror theme -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@visbot/codemirror-avs@latest/dist/avs.css">
<head>
</head>
<body>
  <!-- Add Textarea -->
  <textarea id="editor"></textarea>

  <!-- Import CodeMirror library -->
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5/lib/codemirror.min.js"></script>

  <!-- Import AVS mode -->
  <script src="https://cdn.jsdelivr.net/npm/@visbot/codemirror-avs@latest/dist/avs.js"></script>

  <!-- Initialize CodeMirror -->
  <script type="text/javascript">
    var editor = document.getElementById('editor');
    var options = {
      lineNumbers: true,
      mode: 'avs'
    };

    var cm = CodeMirror.fromTextArea(editor, options);
  </script>
</body>
</html>
```

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
