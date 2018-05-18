# codemirror-avs-mode

[![npm](https://img.shields.io/npm/l/@visbot/codemirror-avs-mode.svg?style=flat-square)](https://www.npmjs.org/package/@visbot/codemirror-avs-mode)
[![npm](https://img.shields.io/npm/v/@visbot/codemirror-avs-mode.svg?style=flat-square)](https://www.npmjs.org/package/@visbot/codemirror-avs-mode)
[![Travis](https://img.shields.io/travis/visbot/codemirror-avs-mode.svg?style=flat-square)](https://travis-ci.org/visbot/codemirror-avs-mode)
[![David](https://img.shields.io/david/dev/visbot/codemirror-avs-mode.svg?style=flat-square)](https://david-dm.org/visbot/codemirror-avs-mode?type=dev)

A mode for [Winamp AVS](https://www.wikiwand.com/en/Advanced_Visualization_Studio) to use with [CodeMirror](https://codemirror.net/), the versatile text editor implemented in JavaScript for the browser.

[Demo Time](https://visbot.github.io/codemirror-avs-mode//) 🙌

## Usage

```html
<head>
  <!-- Import CodeMirror styles -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.37.0/lib/codemirror.css">
</head>
<body>
  <textarea id="editor"></textarea>

  <!-- Import CodeMirror library -->
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.37.0/lib/codemirror.min.js"></script>

  <!-- Import AVS mode -->
  <script src="dist/avs.min.js"></script>

  <!-- Initialize CodeMirror -->
  <script type="text/javascript">
    var editor = document.getElementsByClassName("editor");
    var options = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "avs"
    };

    var cm = CodeMirror.fromTextArea(editor, options);
  </script>
</body>
```
