/*! codemirror-avs | MIT License | github.com/visbot/codemirror-avs */
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("codemirror")):"function"==typeof define&&define.amd?define(["codemirror"],e):e(CodeMirror)}(function(O){"use strict";function T(e,t,n,i,a,r){this.indented=e,this.column=t,this.type=n,this.info=i,this.align=a,this.prev=r}function q(e,t,n,i){var a=e.indented;return e.context&&"statement"==e.context.type&&"statement"!=n&&(a=e.context.indented),e.context=new T(a,t,n,i,null,e.context)}function A(e){var t=e.context.type;return")"!=t&&"]"!=t&&"}"!=t||(e.indented=e.context.indented),e.context=e.context.prev}function P(e,t,n){return"variable"==t.prevToken||"type"==t.prevToken||(!!/\S(?:[^- ]>|[*\]])\s*$|\*$/.test(e.string.slice(0,n))||(!(!t.typeAtEndOfLine||e.column()!=e.indentation())||void 0))}function B(e){for(;;){if(!e||"top"==e.type)return!0;if("}"==e.type&&"namespace"!=e.prev.info)return!1;e=e.prev}}function e(e){for(var t={},n=e.split(" "),i=0;i<n.length;++i)t[n[i]]=!0;return t}function M(e,t){return"function"==typeof e?e(t):e.propertyIsEnumerable(t)}function t(e,t){"string"==typeof e&&(e=[e]);var n=[];function i(e){if(e)for(var t in e)e.hasOwnProperty(t)&&n.push(t)}i(t.variables),i(t.builtin),i(t.constants),n.length&&(t.helperType=e[0],O.registerHelper("hintWords",e[0],n));for(var a=0;a<e.length;++a)O.defineMIME(e[a],t)}O.defineMode("avs",function(e,o){var s,l,c=e.indentUnit,u=o.statementIndentUnit||c,d=o.dontAlignCalls,f=o.keywords||{},v=o.builtin||{},m=o.blockKeywords||{},p=o.defKeywords||{},b=o.types||{},y=o.constants||{},h=o.variables||{},x=o.hooks||{},w=o.multiLineStrings,r=!1!==o.indentStatements,g=(o.indentSwitch,o.namespaceSeparator),k=o.isPunctuationChar||/[\[\]{}\(\),;\:\.]/,S=o.numberStart||/[\d\.]/,z=o.number||/^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?/i,C=o.isOperatorChar||/[+\-*&%=<>!?|\/]/,$=o.isIdentifierChar||/[\w\$_\xa1-\uffff]/;function I(e,t){var r,n=e.next();if(x[n]){var i=x[n](e,t);if(!1!==i)return i}if('"'==n||"'"==n)return t.tokenize=(r=n,function(e,t){for(var n,i=!1,a=!1;null!=(n=e.next());){if(n==r&&!i){a=!0;break}i=!i&&"\\"==n}return(a||!i&&!w)&&(t.tokenize=null),"string"}),t.tokenize(e,t);if(k.test(n))return s=n,null;if(S.test(n)){if(e.backUp(1),e.match(z))return"number";e.next()}if("/"==n){if(e.eat("*"))return(t.tokenize=L)(e,t);if(e.eat("/"))return e.skipToEnd(),"comment"}if(C.test(n)){for(;!e.match(/^\/[\/*]/,!1)&&e.eat(C););return"operator"}if(e.eatWhile($),g)for(;e.match(g);)e.eatWhile($);var a=e.current();return M(f,a)?(M(m,a)&&(s="newstatement"),M(p,a)&&(l=!0),"keyword"):M(b,a)?"type":M(v,a)?(M(m,a)&&(s="newstatement"),"builtin"):M(h,a)?"variable":M(y,a)?"variable-2":"keyword"}function L(e,t){for(var n,i=!1;n=e.next();){if("/"==n&&i){t.tokenize=null;break}i="*"==n}return"comment"}function E(e,t){o.typeFirstDefinitions&&e.eol()&&B(t.context)&&(t.typeAtEndOfLine=P(e,t,e.pos))}return{startState:function(e){return{tokenize:null,context:new T((e||0)-c,0,"top",null,!1),indented:0,startOfLine:!0,prevToken:null}},token:function(e,t){var n=t.context;if(e.sol()&&(null==n.align&&(n.align=!1),t.indented=e.indentation(),t.startOfLine=!0),e.eatSpace())return E(e,t),null;s=l=null;var i=(t.tokenize||I)(e,t);if("comment"==i||"meta"==i)return i;if(null==n.align&&(n.align=!0),";"==s||":"==s||","==s&&e.match(/^\s*(?:\/\/.*)?$/,!1))for(;"statement"==t.context.type;)A(t);else if("{"==s)q(t,e.column(),"}");else if("["==s)q(t,e.column(),"]");else if("("==s)q(t,e.column(),")");else if("}"==s){for(;"statement"==n.type;)n=A(t);for("}"==n.type&&(n=A(t));"statement"==n.type;)n=A(t)}else s==n.type?A(t):r&&(("}"==n.type||"top"==n.type)&&";"!=s||"statement"==n.type&&"newstatement"==s)&&q(t,e.column(),"statement",e.current());if("variable"==i&&("def"==t.prevToken||o.typeFirstDefinitions&&P(e,t,e.start)&&B(t.context)&&e.match(/^\s*\(/,!1))&&(i="def"),x.token){var a=x.token(e,t,i);void 0!==a&&(i=a)}return"def"==i&&!1===o.styleDefs&&(i="variable"),t.startOfLine=!1,t.prevToken=l?"def":i||s,E(e,t),i},indent:function(e,t){if(e.tokenize!=I&&null!=e.tokenize||e.typeAtEndOfLine)return O.Pass;var n=e.context,i=t&&t.charAt(0);if("statement"==n.type&&"}"==i&&(n=n.prev),o.dontIndentStatements)for(;"statement"==n.type&&o.dontIndentStatements.test(n.info);)n=n.prev;if(x.indent){var a=x.indent(e,n,t);if("number"==typeof a)return a}var r=i==n.type,s=n.prev&&"switch"==n.prev.info;if(o.allmanIndentation&&/[{(]/.test(i)){for(;"top"!=n.type&&"}"!=n.type;)n=n.prev;return n.indented}return"statement"==n.type?n.indented+("{"==i?0:u):!n.align||d&&")"==n.type?")"!=n.type||r?n.indented+(r?0:c)+(r||!s||/^(?:case|default)\b/.test(t)?0:c):n.indented+u:n.column+(r?0:1)},blockCommentStart:"/*",blockCommentEnd:"*/",blockCommentContinue:" * ",lineComment:"//"}});var n=e("abs sin cos tan asin acos atan atan2 sqr sqrt invsqrt pow exp log log10 floor ceil sign min max sigmoid rand band bor bnot if assign exec2 equal above below getosc getspec gettime getkbmouse megabuf gmegabuf loop"),i=e("$e $phi $pi $E $PHI $PI"),a=!1;t(["avs/bump"],{name:"avs",variables:e("x y isBeat isLBeat bi"),builtin:n,constants:i,indentSwitch:a}),t(["avs/color-modifier","avs/cm"],{name:"avs",variables:e("red green blue"),builtin:n,constants:i,indentSwitch:a}),t(["avs/dynamic-distance-modifier","avs/ddm"],{name:"avs",variables:e("d"),builtin:n,constants:i,indentSwitch:a}),t(["avs/dynamic-movement","avs/dm"],{name:"avs",variables:e("x y w h r d alpha"),builtin:n,constants:i,indentSwitch:a}),t(["avs/dynamic-shift","avs/ds"],{name:"avs",variables:e("x y w h b alpha"),builtin:n,constants:i,indentSwitch:a}),t(["avs/effect-list","avs/el"],{name:"avs",variables:e("enabled beat clear alphain alphaout w h"),builtin:n,constants:i,indentSwitch:a}),t(["avs/movement","avs/mov"],{name:"avs",variables:e("r d x y sw sh"),builtin:n,constants:i,indentSwitch:a}),t(["avs/superscope","avs/ssc"],{name:"avs",variables:e("n x y i v b red green blue linesize skip drawmode w h"),builtin:n,constants:i,indentSwitch:a}),t(["avs/texer2","avs/t2"],{name:"avs",variables:e("n w h i x y v b iw ih sizex sizey red green blue skip"),builtin:n,constants:i,indentSwitch:a}),t(["avs/triangle","avs/tr"],{name:"avs",variables:e("n x1 x2 x3 y1 y2 y3 z1 skip red1 blue1 green1 w h zbclear zbuf"),builtin:n,constants:i,indentSwitch:a}),t(["text/x-avs","avs"],{name:"avs",variables:e("alpha alphain alphaout b beat bi blue blue1 clear d drawmode enabled green green1 h i ih isBeat isLBeat iw linesize n r red red1 sh sizex sizey skip sw v w x x1 x2 x3 y y1 y2 y3 z1 zbclear zbuf"),builtin:n,constants:i,indentSwitch:a})});