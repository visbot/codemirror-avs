/*! codemirror-avs | MIT License | github.com/visbot/codemirror-avs */
import CodeMirror from 'codemirror';

function Context(indented, column, type, info, align, prev) {
  this.indented = indented;
  this.column = column;
  this.type = type;
  this.info = info;
  this.align = align;
  this.prev = prev;
}

function pushContext(state, col, type, info) {
  var indent = state.indented;
  if (
    state.context &&
    state.context.type == 'statement' &&
    type != 'statement'
  )
    indent = state.context.indented;
  return (state.context = new Context(
    indent,
    col,
    type,
    info,
    null,
    state.context
  ));
}

function popContext(state) {
  var t = state.context.type;
  if (t == ')' || t == ']' || t == '}')
    state.indented = state.context.indented;
  return (state.context = state.context.prev);
}

function typeBefore(stream, state, pos) {
  if (state.prevToken == 'variable' || state.prevToken == 'type') return true;
  if (/\S(?:[^- ]>|[*\]])\s*$|\*$/.test(stream.string.slice(0, pos)))
    return true;
  if (state.typeAtEndOfLine && stream.column() == stream.indentation())
    return true;
}

function isTopScope(context) {
  for (;;) {
    if (!context || context.type == 'top') return true;
    if (context.type == '}' && context.prev.info != 'namespace') return false;
    context = context.prev;
  }
}

CodeMirror.defineMode('avs', function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndentUnit = parserConfig.statementIndentUnit || indentUnit;
  var dontAlignCalls = parserConfig.dontAlignCalls;
  var keywords = parserConfig.keywords || {};
  var builtin = parserConfig.builtin || {};
  var blockKeywords = parserConfig.blockKeywords || {};
  var defKeywords = parserConfig.defKeywords || {};
  var types = parserConfig.types || {};
  var constants = parserConfig.constants || {};
  var variables = parserConfig.variables || {};
  var hooks = parserConfig.hooks || {};
  var multiLineStrings = parserConfig.multiLineStrings;
  var indentStatements = parserConfig.indentStatements !== false;
  var namespaceSeparator = parserConfig.namespaceSeparator;
  var isPunctuationChar = parserConfig.isPunctuationChar || /[[\]{}(),;:.]/;
  var numberStart = parserConfig.numberStart || /[\d.]/;
  var number = parserConfig.number || /^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?/i;
  var isOperatorChar = parserConfig.isOperatorChar || /[+\-*&%=<>!?|/]/;
  var isIdentifierChar = parserConfig.isIdentifierChar || /[\w$_\xa1-\uffff]/;

  var curPunc;
  var isDefKeyword;

  function tokenBase(stream, state) {
    var ch = stream.next();

    if (hooks[ch]) {
      var result = hooks[ch](stream, state);
      if (result !== false) return result;
    }

    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    }

    if (isPunctuationChar.test(ch)) {
      curPunc = ch;
      return null;
    }

    if (numberStart.test(ch)) {
      stream.backUp(1);
      if (stream.match(number)) return 'number';
      stream.next();
    }

    if (ch == '/') {
      if (stream.eat('*')) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      }
      if (stream.eat('/')) {
        stream.skipToEnd();
        return 'comment';
      }
    }

    if (isOperatorChar.test(ch)) {
      while (
        !stream.match(/^\/[/*]/, false) &&
        stream.eat(isOperatorChar)
      )
      return 'operator';
    }

    stream.eatWhile(isIdentifierChar);

    if (namespaceSeparator)
      while (stream.match(namespaceSeparator))
        stream.eatWhile(isIdentifierChar);

    var cur = stream.current();

    if (contains(keywords, cur)) {
      if (contains(blockKeywords, cur)) curPunc = 'newstatement';
      if (contains(defKeywords, cur)) isDefKeyword = true;
      return 'keyword';
    }

    if (contains(types, cur)) return 'type';

    if (contains(builtin, cur)) {
      if (contains(blockKeywords, cur)) curPunc = 'newstatement';
      return 'builtin';
    }

    if (contains(variables, cur)) return 'variable';
    if (contains(constants, cur)) return 'variable-2';

    return 'keyword';
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false,
        next,
        end = false;
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) {
          end = true;
          break;
        }
        escaped = !escaped && next == '\\';
      }
      if (end || !(escaped || multiLineStrings)) state.tokenize = null;
      return 'string';
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false,
      ch;
    while ((ch = stream.next())) {
      if (ch == '/' && maybeEnd) {
        state.tokenize = null;
        break;
      }
      maybeEnd = ch == '*';
    }
    return 'comment';
  }

  function maybeEOL(stream, state) {
    if (
      parserConfig.typeFirstDefinitions &&
      stream.eol() &&
      isTopScope(state.context)
    )
      state.typeAtEndOfLine = typeBefore(stream, state, stream.pos);
  }

  // Interface

  return {
    startState: function(basecolumn) {
      return {
        tokenize: null,
        context: new Context(
          (basecolumn || 0) - indentUnit,
          0,
          'top',
          null,
          false
        ),
        indented: 0,
        startOfLine: true,
        prevToken: null
      };
    },

    token: function(stream, state) {
      var ctx = state.context;
      if (stream.sol()) {
        if (ctx.align == null) ctx.align = false;
        state.indented = stream.indentation();
        state.startOfLine = true;
      }
      if (stream.eatSpace()) {
        maybeEOL(stream, state);
        return null;
      }
      curPunc = isDefKeyword = null;
      var style = (state.tokenize || tokenBase)(stream, state);
      if (style == 'comment' || style == 'meta') return style;
      if (ctx.align == null) ctx.align = true;

      if (
        curPunc == ';' ||
        curPunc == ':' ||
        (curPunc == ',' && stream.match(/^\s*(?:\/\/.*)?$/, false))
      )
        while (state.context.type == 'statement') popContext(state);
      else if (curPunc == '{') pushContext(state, stream.column(), '}');
      else if (curPunc == '[') pushContext(state, stream.column(), ']');
      else if (curPunc == '(') pushContext(state, stream.column(), ')');
      else if (curPunc == '}') {
        while (ctx.type == 'statement') ctx = popContext(state);
        if (ctx.type == '}') ctx = popContext(state);
        while (ctx.type == 'statement') ctx = popContext(state);
      } else if (curPunc == ctx.type) popContext(state);
      else if (
        indentStatements &&
        (((ctx.type == '}' || ctx.type == 'top') && curPunc != ';') ||
          (ctx.type == 'statement' && curPunc == 'newstatement'))
      ) {
        pushContext(state, stream.column(), 'statement', stream.current());
      }

      if (
        style == 'variable' &&
        (state.prevToken == 'def' ||
          (parserConfig.typeFirstDefinitions &&
            typeBefore(stream, state, stream.start) &&
            isTopScope(state.context) &&
            stream.match(/^\s*\(/, false)))
      )
        style = 'def';

      if (hooks.token) {
        var result = hooks.token(stream, state, style);
        if (result !== undefined) style = result;
      }

      if (style == 'def' && parserConfig.styleDefs === false)
        style = 'variable';

      state.startOfLine = false;
      state.prevToken = isDefKeyword ? 'def' : style || curPunc;
      maybeEOL(stream, state);
      return style;
    },

    indent: function(state, textAfter) {
      if (
        (state.tokenize != tokenBase && state.tokenize != null) ||
        state.typeAtEndOfLine
      )
        return CodeMirror.Pass;
      var ctx = state.context,
        firstChar = textAfter && textAfter.charAt(0);
      if (ctx.type == 'statement' && firstChar == '}') ctx = ctx.prev;
      if (parserConfig.dontIndentStatements)
        while (
          ctx.type == 'statement' &&
          parserConfig.dontIndentStatements.test(ctx.info)
        )
          ctx = ctx.prev;
      if (hooks.indent) {
        var hook = hooks.indent(state, ctx, textAfter);
        if (typeof hook == 'number') return hook;
      }
      var closing = firstChar == ctx.type;
      var switchBlock = ctx.prev && ctx.prev.info == 'switch';
      if (parserConfig.allmanIndentation && /[{(]/.test(firstChar)) {
        while (ctx.type != 'top' && ctx.type != '}') ctx = ctx.prev;
        return ctx.indented;
      }
      if (ctx.type == 'statement')
        return ctx.indented + (firstChar == '{' ? 0 : statementIndentUnit);
      if (ctx.align && (!dontAlignCalls || ctx.type != ')'))
        return ctx.column + (closing ? 0 : 1);
      if (ctx.type == ')' && !closing)
        return ctx.indented + statementIndentUnit;

      return (
        ctx.indented +
        (closing ? 0 : indentUnit) +
        (!closing && switchBlock && !/^(?:case|default)\b/.test(textAfter)
          ? indentUnit
          : 0)
      );
    },
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    blockCommentContinue: ' * ',
    lineComment: '//'
  };
});

function words(str) {
  var obj = {},
    words = str.split(' ');
  for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
  return obj;
}

function contains(words, word) {
  if (typeof words === 'function') {
    return words(word);
  } else {
    return Object.prototype.propertyIsEnumerable.call(words, word);
  }
}

function def(mimes, mode) {
  if (typeof mimes == 'string') mimes = [mimes];
  var words = [];
  function add(obj) {
    if (obj)
      for (var prop in obj) if (Object.prototype.hasOwnProperty.call(obj, prop)) words.push(prop);
  }
  add(mode.variables);
  add(mode.builtin);
  add(mode.constants);
  if (words.length) {
    mode.helperType = mimes[0];
    CodeMirror.registerHelper('hintWords', mimes[0], words);
  }

  for (var i = 0; i < mimes.length; ++i)
    CodeMirror.defineMIME(mimes[i], mode);
}

var builtin = words(
  'abs sin cos tan asin acos atan atan2 sqr sqrt invsqrt pow exp log log10 floor ceil sign min max sigmoid rand band bor bnot if assign exec2 equal above below getosc getspec gettime getkbmouse megabuf gmegabuf loop'
);
var constants = words(
  '$e $phi $pi $E $PHI $PI'
);
var indentSwitch = false;

def(['avs/bump'], {
  name: 'avs',
  variables: words(
    'x y isBeat isLBeat bi'
  ),
  builtin: builtin,
  constants: constants,
  indentSwitch: indentSwitch
});

def(['avs/color-modifier', 'avs/cm'], {
  name: 'avs',
  variables: words(
    'red green blue'
  ),
  builtin: builtin,
  constants: constants,
  indentSwitch: indentSwitch
});

def(['avs/dynamic-distance-modifier', 'avs/ddm'], {
  name: 'avs',
  variables: words(
    'd'
  ),
  builtin: builtin,
  constants: constants,
  indentSwitch: indentSwitch
});

def(['avs/dynamic-movement', 'avs/dm'], {
  name: 'avs',
  variables: words(
    'x y w h r d alpha'
  ),
  builtin: builtin,
  constants: constants,
  indentSwitch: indentSwitch
});

def(['avs/dynamic-shift', 'avs/ds'], {
  name: 'avs',
  variables: words(
    'x y w h b alpha'
  ),
  builtin: builtin,
  constants: constants,
  indentSwitch: indentSwitch
});

def(['avs/effect-list', 'avs/el'], {
  name: 'avs',
  variables: words(
    'enabled beat clear alphain alphaout w h'
  ),
  builtin: builtin,
  constants: constants,
  indentSwitch: indentSwitch
});

def(['avs/movement', 'avs/mov'], {
  name: 'avs',
  variables: words(
    'r d x y sw sh'
  ),
  builtin: builtin,
  constants: constants,
  indentSwitch: indentSwitch
});

def(['avs/superscope', 'avs/ssc'], {
  name: 'avs',
  variables: words(
    'n x y i v b red green blue linesize skip drawmode w h'
  ),
  builtin: builtin,
  constants: constants,
  indentSwitch: indentSwitch
});

def(['avs/texer2', 'avs/t2'], {
  name: 'avs',
  variables: words(
    'n w h i x y v b iw ih sizex sizey red green blue skip'
  ),
  builtin: builtin,
  constants: constants,
  indentSwitch: indentSwitch
});

def(['avs/triangle', 'avs/tr'], {
  name: 'avs',
  variables: words(
    'n x1 x2 x3 y1 y2 y3 z1 skip red1 blue1 green1 w h zbclear zbuf'
  ),
  builtin: builtin,
  constants: constants,
  indentSwitch: indentSwitch
});

def(['text/x-avs', 'avs', 'avs/*'], {
  name: 'avs',
  variables: words(
    'alpha alphain alphaout b beat bi blue blue1 clear d drawmode enabled green green1 h i ih isBeat isLBeat iw linesize n r red red1 sh sizex sizey skip sw v w x x1 x2 x3 y y1 y2 y3 z1 zbclear zbuf'
  ),
  builtin: builtin,
  constants: constants,
  indentSwitch: indentSwitch
});
