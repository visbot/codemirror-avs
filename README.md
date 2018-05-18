# codemirror-avs-mode

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
  <script src="mode/avs.js"></script>

  <!-- Initialize CodeMirror -->
  <script type="text/javascript">
    var editor = document.getElementsByClassName("editor");
    var options = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "avs"
    }

    var cm = CodeMirror.fromTextArea(editor, options);
  </script>
</body>
```
