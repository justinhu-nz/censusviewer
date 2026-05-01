function _1(md){return(
md`# SVG tiled pattern fills

Simple SVG vector patterns consisting of a small square tile which gets repeated.

Since the size of a square tile is fixed, the diagonal hatching will be finer for a given tile size.`
)}

function _examples(HatchTile0,preview_fill,HatchTile45,HatchTile90,HatchTile135,HalfToneTile,HalfToneTile8,CrossHatchTile45,CrossHatchTile90,DahsedHatchTile){return(
[
      HatchTile0({fill: preview_fill, fg: "#47f"}),
      HatchTile45({fill: preview_fill, fg: "#47f"}),
      HatchTile90({fill: preview_fill, fg: "#47f"}),
      HatchTile135({fill: preview_fill, fg: "#47f"}),
      HalfToneTile({fill: preview_fill, fg: "#47f", fill_alldots: 0}),
      HalfToneTile8({fill: preview_fill, fg: "#47f", fill_alldots: .32}),
      CrossHatchTile45({fill: preview_fill, fg: "#47f"}),
      CrossHatchTile90({fill: preview_fill, fg: "#47f"}),
      DahsedHatchTile({fill: preview_fill, fg: "#47f"})]
)}

function _preview_fill(Inputs){return(
Inputs.range([0, 1], {label: "Fill", value: .4, step: .01})
)}

function _4(examples,width,svg)
{
  var patterns = examples.map(x => x.svg()).join("\n");
  
  const tile_size = [160, 120];
  const cols = 3;
  const our_width = Math.min(width, tile_size[0] * cols);
  const rows = Math.ceil(examples.length / cols);
  const w = Math.floor(our_width / cols);
  var x0 = 0.5 * (width - cols * w);
  var boxes = examples.map(
    function(pattern, i)
    {
      var x = x0 + w * (i % cols) + 2.5;
      var y = tile_size[1] * Math.floor(i / cols) + 2.5;
      return `<rect x="${x}" y="${y}" width="${w-5}" height="${tile_size[1] - 5}"
        rx="8" ry="8" fill="${pattern.url()}" stroke="#777"/>`;
    });
  
  return svg`<svg viewBox="0 0 ${width} ${tile_size[1] * rows}" xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>${patterns}</defs>
  ${boxes}
</svg>`
}


function _5(show,examples){return(
show(examples.map(x => x.with({size:30, rotate: 0, offset:[0, 0]})), 30, false)
)}

function _6(md){return(
md`Common settings to create a pattern are:

| Key       | Meaning
|-----------|--------------
| \`id\` | Define to use a fixed ID. Either a string, or an ID returned by \`DOM.uid()\`. If not given, a unique ID is created with \`DOM.uid()\`.<br>Will not be stored in the \`settings\` field of the pattern, use the \`id\` field to query it later.
| \`size\` | Size in pixels of the pattern tile. (note this is different from the distance between features)
| \`fill\` | Fill factor between 0 and 1
| \`bg\` | Foreground colour,
| \`fg\` | Background colour,
| \`scale\` | Scale factor
| \`offset\` | Array with x and y offset of the pattern
| \`rotate\` | Rotation added to the SVG pattern definition in degrees

To use it, use these members:

| Member    | Meaning
|-----------|--------------
| \`id\` | ID of this pattern
| \`uid\` | unique ID of this pattern. \`undefined\` for patterns created with a string as \`id\`.
| \`with()\` | Create a copy of this pattern, optionally with settings to override
| \`svg()\` | Return an SVG string containing a \`<pattern>\` element
| \`svg_fg()\` | Return an SVG string containing svg primitives to draw the foreground
| \`url()\` | Return an url reference that you can use as a fill property
| \`settings\` | Pattern settings.
`
)}

function _7(md){return(
md`## Hatching

Hatching along axes or diagonals`
)}

function _8(md){return(
md`### Square hatch pattern

These patterns are aligned on 0, 45, 90 and 135°. All of them have a square aspect ratio.`
)}

function _h1(HatchTile45){return(
HatchTile45({fill: .4, fg: "#3e7", id: "my_id"})
)}

function _10(show,h1,HatchTile135){return(
show([h1,
      h1.with({fg:"#37f", bg:"#fffd66"}),
      h1.with({size:4, fg: "#777"}),
      h1.with({size:8 , fill:.8}),
      HatchTile135(h1)])
)}

function _11(md){return(
md`Cross hatching has thinner lines to compensate for the extra fill.`
)}

function _12(show,HatchTile45,CrossHatchTile45,CrossHatchTile90,CrossHatchTile,HatchTile0)
{
  var s = {fg: "#76d"};
  return show([
    HatchTile45(s),
    CrossHatchTile45(s),
    CrossHatchTile90(s),
    // the generic CrossHatchTile() function takes one of the simple hatch tile generators
    CrossHatchTile(s, HatchTile45, HatchTile0)]);
}


function _13(md){return(
md`### Dashed hatch pattern

This pattern is defined only as a horizontal hatching pattern, but it doesn’t have to be square. Use \`rotate\` to turn it.

This takes a few extra settings:

Key | Meaning
----|--------------
\`dashOffsets\` | Controls the amount of rows in the pattern, and their offsets relative to the length of the pattern. The default, \`[0, 0.5]\`, specifies 2 rows, with an offset of half the width of the pattern.
\`fill\` | Controls the thickness of the dashes. At 100% the dahses will touch the neighbouring rows.
\`dashes\` | Controls the length of dashes and the gaps between them. Should have an even length, every pair specifies a dash and a gap. A single number is interpreted as \`[v, 1.0 - v]\`.
\`cap\` | Controls the appearance of the end caps of the dashes. Should be a valid \`stroke-linecap\` SVG value attribute.`
)}

function _14(DahsedHatchTile,show)
{
  var h = DahsedHatchTile({fg: "#d46"});
  return show([
    h,
    h.with({size: [20, 5], fill: .7, dashes: .75, cap:"round", dashOffsets: [0]}),
    h.with({rotate: 0, size: [20, 10], dashes: [.15, .05, .75, .05], dashOffsets: [0, .3]})])
}


function _15(md){return(
md`## Halftone

Halftone pattern at 45°.`
)}

function _16(show,HalfToneTile){return(
show([0, .03, .1, .2, .3, .5, .7, .8, .9, .97, 1].map(
  x => HalfToneTile({fill: x, fg: "#66a"})
), 50)
)}

function _17(md){return(
md`You can optionally fade to a coarser patterns at low densities. The *HalfTone8* pattern has a larger tile with more dots so it can go more coarse. This lets you avoid very small dots for lower densities.

The fill factor where all dots have the same size is given with the \`fill_alldots\` setting.`
)}

function _18(html,show,HalfToneTile,HalfToneTile8)
{
  var l = [0, .01, .025, .05, .1, .15, .2, .3, .4, .6, .9]
  return html`
  ${show(l.map(x => HalfToneTile({fill_alldots: 0, fill: x, fg: "#66a"})), 50)}
  ${show(l.map(x => HalfToneTile({fill_alldots: .4, fill: x, fg: "#66a"})), 50)}
  ${show(l.map(x => HalfToneTile8({fill_alldots: .4, fill: x, fg: "#66a"})), 50)}`
}


function _19(md){return(
md`### Stacked patterns

Stack patterns on top of each other. The background and size will be the background of the first pattern in the list.

Since this generates only a single SVG pattern you cannot have different sizes.`
)}

function _20(show,StackedTile,HatchTile45,HatchTile135){return(
show([StackedTile([
  HatchTile45({bg: "#fffd88", fg: "#c59", fill: .3, size: 15}),
  HatchTile135({bg: "#blue", fg: "#37d", fill: .3, size: 2})])
     ])
)}

function _21(md){return(
md`-------------`
)}

function _22(md){return(
md`## Definitions`
)}

function _23(show,HatchTile0){return(
show([HatchTile0({size:30})], 60)
)}

function _HatchTile0(_define_pattern,_defaultHatch){return(
_define_pattern(
  "hatch-0",
  { ..._defaultHatch, size: 5},
  ([s, h], f, set) => `<rect y="${(.5*(s-f))}" width="${s}" height="${f}" fill="${set.fg}"/>`
)
)}

function _25(show,HatchTile45){return(
show([HatchTile45({size:30})], 60)
)}

function _HatchTile45(_define_pattern,_defaultHatch){return(
_define_pattern(
  "hatch-45",
  { ..._defaultHatch, size: 8},
  ([s, h], f, set) => `<path
          d="M0 ${f*.5} L${f*.5} 0 L0 0 Z  M${s-f*.5} ${s}  ${s} ${s-f*.5} L${s} ${s}  Z
  M0 ${s} L${.5*f} ${s} L${s} ${.5*f} L${s} 0  L${s-.5*f} 0  L0 ${s-.5*f} Z"
          fill="${set.fg}" stroke="none" />`
)
)}

function _27(show,HatchTile90){return(
show([HatchTile90({size:30})], 60)
)}

function _HatchTile90(_define_pattern,_defaultHatch){return(
_define_pattern(
  "hatch-90",
  { ..._defaultHatch, size: 5},
  ([s, h], f, set) => `<rect x="${(.5*(s-f))}" width="${f}" height="${s}" fill="${set.fg}"/>`
)
)}

function _29(show,HatchTile135){return(
show([HatchTile135({size:30})], 60)
)}

function _HatchTile135(_define_pattern,_defaultHatch){return(
_define_pattern(
  "hatch-135",
  { ..._defaultHatch, size: 8},
  ([s, h], f, set) => `<path
          d="M${s} ${.5*f} L${s} 0 L${s - .5*f} 0 Z  M0 ${s-.5*f} L0 ${s} L${.5*f} ${s} Z
  M${s} ${s}  L${s} ${s-.5*f}  L${.5*f} 0  L0 0 L0 ${.5*f} L${s-.5*f} ${s} Z"
          fill="${set.fg}" stroke="none" />`
)
)}

function _31(show,HalfToneTile){return(
show([HalfToneTile({size:30})], 60)
)}

function _HalfToneTile(_define_pattern,_defaultHatch){return(
_define_pattern(
  "halftone",
  { ..._defaultHatch, size: 8, offset: [.5, .5], fill_alldots: 0},
  function (s, f, set)
  {
    s = s[0];
    var s_fill = set.fill;
    if (s_fill <= 0) return "";
    
    // fill. For low fills, fade the corners out first
    var fill1 = s_fill > set.fill_alldots ?
        s_fill : Math.min(set.fill_alldots, 2 * set.fill);
    var fill2 = 2 * s_fill - fill1;
    
    // not 100% accurate between 80% and 100% but it is close
    var r1 = fill1 < 0.785398
      ? Math.sqrt(fill1 * .5 / Math.PI)
      : .5 - Math.sqrt((1 - fill1) * 0.31396 / Math.PI);
    var r2 = fill1 > set.fill_alldots ? r1 : Math.sqrt(fill2 * .5 / Math.PI);
    r1 *= s;
    r2 *= s;
    
    // pattern
    var dot = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${set.fg}" stroke="none" />`;
    var ss = "";
    ss += dot(s*.5, s*.5, r1);
    for (var [x, y] of [[0,0], [0,s], [s,0], [s,s]]) {
      ss += dot(x, y, r2)
    }
    return ss;
  }
)
)}

function _33(show,HalfToneTile8){return(
show([HalfToneTile8({size:30})], 60)
)}

function _HalfToneTile8(_define_pattern,_defaultHatch){return(
_define_pattern(
  "halftone8",
  { ..._defaultHatch, size: 16, offset: [.5, .5], fill_alldots: 0},
  function (s, f, set)
  {
    s = s[0];
    var s_fill = set.fill;
    if (s_fill <= 0) return "";
    
    // tile layout, 4 levels. Lower case indicates copies due to
    // the pattern wrapping around:
    //   B···C···b
    //   : D   D :
    //   C   A   c
    //   : D   D :
    //   b···c···b
    
    const levels = [
        [[0.5*s, 0.5*s]],  // A: middle dot
        [[0,0], [0,s], [s,0], [s,s]],  // B: corner dot (4 instances)
        [[0.5*s,0], [0,0.5*s], [0.5*s, s], [s,0.5*s]], // C: 2 side dots (2 inst. each)
        [[0.25*s,0.25*s], [0.25*s,0.75*s], [0.75*s, 0.25*s], [0.75*s,0.75*s]], // D: 4 middle dots of quadrants
      ];
    const level_n = [1, 1, 2, 4];
    const n = 8;
    var r = [];
    if (s_fill < set.fill_alldots)
    {
      var remaining = s_fill;
      for (var i = 0; i < 4; ++i)
      {
        var this_fill = Math.min(remaining / level_n[i], set.fill_alldots / n);
        remaining -= this_fill * level_n[i];
        var this_r = Math.sqrt(n * this_fill * .125 / Math.PI);
        r.push(this_r * s);
      }
    }
    else
    {
      var r1 = s_fill < 0.785398
        ? Math.sqrt(s_fill * .125 / Math.PI)
        : .25 - Math.sqrt((1 - s_fill) * 0.07849 / Math.PI);
      r1 *= s;
      r = [r1, r1, r1, r1];
    }

    // pattern
    var dot = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${set.fg}" stroke="none" />`;
    var ss = "";
    for (var i = 0; i < 4; ++i)
    {
      for (var [x, y] of levels[i]) {
        ss += dot(x, y, r[i])
      }
    }
    return ss;
  }
)
)}

function _35(show,CrossHatchTile45){return(
show([CrossHatchTile45({size:30})], 60)
)}

function _CrossHatchTile45(CrossHatchTile,HatchTile45,HatchTile135){return(
settings => CrossHatchTile(settings, HatchTile45, HatchTile135)
)}

function _37(show,CrossHatchTile90){return(
show([CrossHatchTile90({size:30})], 60)
)}

function _CrossHatchTile90(CrossHatchTile,HatchTile0,HatchTile90){return(
settings => CrossHatchTile(settings, HatchTile0, HatchTile90)
)}

function _39(show,CrossHatchTile,HatchTile45,HatchTile90){return(
show([CrossHatchTile({size:30}, HatchTile45, HatchTile90)], 60)
)}

function _CrossHatchTile(_define_pattern,_defaultHatch)
{
  var _CrossHatchTile = _define_pattern(
    "cross",
    {..._defaultHatch, size: 8, _F1: undefined, _F2: undefined},
    function(s, f, set) {
      var ss = "";
      for (var p of set._parts)
      {
        ss += p._svg_fg(s, p.settings.fill * s[0], p.settings);
      }
      return ss;
    },
    function(set) {
      // compensate fill: the actual fill factor will be s.fill * (2 - s.fill)
      if (!set._F1) return;
      var hatch1 = set._F1({...set, id:""});
      var s = hatch1.settings;
      s.fill = 1 - Math.sqrt(1 - s.fill);
      set._parts = [hatch1, set._F2({...s, id:""})];
    }
  );  
  
  // compensate fill: the actual fill factor will be s.fill * (2 - s.fill)
  return function(settings, F1, F2) {
    var p1 = F1({settings, id:""});
    console.log(p1.settings);
    var id = settings && settings.id
    return _CrossHatchTile({...p1.settings, id, _F1:F1, _F2:F2});
  }
}


function _41(show,DahsedHatchTile){return(
show([DahsedHatchTile({size:[30, 30]})], 60)
)}

function _DahsedHatchTile(_define_pattern,_defaultHatch){return(
_define_pattern(
  "hatch-dashed",
  { ..._defaultHatch,
    size: [10, 10], dashes: .75, dashOffsets:[0, .5], rotate: -45, cap: "but"},
  function([w, h], f, set) {
    h = h / set.dashOffsets.length;
    var y = h * .5;
    var ss = "";
    set._dashoffsets.forEach((o, i)=>
    {
      ss += `<line
        x1="-w" x2="${2*w}"
        y1="${y}" y2="${y}"
        stroke="${set.fg}" stroke-linecap="${set.cap}"
        stroke-width="${set.fill * h}" stroke-dasharray="${set._dasharray}" stroke-dashoffset="${o}"
        fill="${set.fg}"/>`
      y += h;
    });
    return ss;
  },
  function(set) {
    if (!Array.isArray(set.size)) { set.size = [set.size, set.size]; }
    if (!Array.isArray(set.dashes))
    {
      set.dashes = [ set.dashes, 1 - set.dashes];
    }
    set._dasharray = set.dashes.map(x => set.size[0] * x).join(",");
    set._dashoffsets = set.dashOffsets.map(x => set.size[0] * x);
  }
)
)}

function _43(HalfToneTile8,HatchTile90,show,StackedTile)
{
  var parts = [
    HalfToneTile8({size:30, fg:"#ddd"}),
    HatchTile90({size:30, fill: .2, fg:"#aaa"})];
  return show([StackedTile(parts)], 60);
}


function _StackedTile(_define_pattern,_defaultSettings)
{
  var _Stack = _define_pattern(
    "stacked",
    {..._defaultSettings, parts: []},
    function (s, f, set)
    {
      var ss = "";
      for (var p of set.parts)
      {
        ss += p._svg_fg(s, p.settings.fill * s[0], p.settings);
      }
      return ss;
    }
  )
  
  function make(parts, id)
  {
    // inherit size and background from first part
    var stack = _Stack(parts[0]);
    stack.settings.parts = parts;
    if (id) { stack.id = id; }
    return stack;
  }
  return make;
}


function _45(show,BlankTile){return(
show([BlankTile({bg:"#eee"})], 60)
)}

function _BlankTile(_define_pattern,_defaultSettings){return(
_define_pattern(
  "blank",
  _defaultSettings,
  (s, f, settings) => "")
)}

function _47(md){return(
md`------------

## Internal`
)}

function __defaultSettings(){return(
{
    rotate: 0,
    scale: 1,
    offset: [0, 0],
    size : 1,
    bg : "white",
}
)}

function __defaultHatch(_defaultSettings){return(
{
    ..._defaultSettings,
    fill : .5,
    fg : "black",
  }
)}

function _show(html){return(
function show(patterns, size, round)
{
  // wishes:
  //  - the border occupies exactly 1 pixel (it is a myth that
  //      you can ignore physical pixels for SVG);
  //  - size specifies the size of the area inside the border;
  //  - in pattern space (userSpaceOnUse), (0, 0) is exactly
  //      at the corner inside the non-rounded border.
  // concessions:
  //  - we do not attempt to compensate for device pixel ratio. So the result will look bad
  //    at 1.25 and 1.50 ratios.
  size = size || 100;
  var size2 = size + 2;
  var sizeR = round != false ? size * .1 : 0;
  var s = "";
  for (const p of patterns)
  {
    s += `<svg viewBox="0 0 ${size2} ${size2}" width="${size2}" height="${size2}" xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink" style='margin-right: ${size * .1}px;'>`;
    s += p.svg();
    s += `<rect transform="translate(1, 1)" x="-0.5" y="-0.5" width="${size+1}" height="${size+1}" 
rx="${sizeR}" ry="${sizeR}"
fill="${p.url()}" stroke-width="1" stroke="#777" />`;
    s += `</svg>`;
  }
  return html`<div>${s}</div>`;
}
)}

function __define_pattern(DOM){return(
function _define_pattern(typeId, defaults, paint_fg, extra_init)
{
  function size2(x) { return Array.isArray(x) ? x : [x, x]; }
  
  function _PatternBase(settings) {
    this.id = "";
    this.settings = settings || this.defaults;
    this.size = size2(this.settings.size);
    this.extra_init(this.settings);
  }
  
  _PatternBase.prototype.typeId = typeId;
  _PatternBase.prototype.defaults = defaults;
  _PatternBase.prototype._svg_fg = paint_fg;
  _PatternBase.prototype.extra_init = extra_init || function(){};

  _PatternBase.prototype._new_settings = function(new_settings, id)
  {
    var s = {...this.settings, ...new_settings};
    delete s.id;
    this.settings = s;
    if (id == undefined) {
      this.uid = DOM.uid("pattern-" + this.typeId);
      this.id = this.uid.id;
    }
    else if (id.id) {
      this.uid = id;
      this.id = id.id;
    }
    else {
      this.id = id.toString();
    }
    
    this.size = size2(s.size);
    this.extra_init(this.settings);
  }
  
  _PatternBase.prototype.svg_fg = function()
  {
    var s = this.settings.size;
    var f = this.settings.fill * s;
    return this._svg_fg(s, f, this.settings)
  };

  _PatternBase.prototype.svg = function()
  {
    var s = this.size;
    var f = this.settings.fill * s[0];
    var offset = this.settings.offset;
    return `
<pattern id="${this.id}"
    x="${offset[0]}" y="${offset[1]}"
    patternUnits="userSpaceOnUse" width="${s[0]}" height="${s[1]}"
    patternTransform="rotate(${this.settings.rotate}) scale(${this.settings.scale})">
  <rect width="${s[0]}" height="${s[1]}" fill="${this.settings.bg}"/>
  ${this._svg_fg(s, f, this.settings)}
</pattern>`;     
  };

  _PatternBase.prototype.url = function()
  {
    return this.uid ? this.uid.toString() : `url(#${this.id})`
  };

  // copy with optionally new settings
  _PatternBase.prototype.with = function(new_settings)
  {
    var p = new _PatternBase(this.settings);
    p._new_settings(new_settings || {}, new_settings && new_settings.id);
    return p;
  };

  function make(new_settings)
  { 
    // if we have a settings field, assume it is another pattern
    // otherwise assume it is a settings object
    new_settings = new_settings || {}
    if (new_settings.settings)
    {
      new_settings = new_settings.settings;
    }

    var p = new _PatternBase();
    p._new_settings(new_settings, new_settings.id);
    return p;
  }
  
  return make;
}
)}

function _52(md){return(
md`## Imports`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("examples")).define("examples", ["HatchTile0","preview_fill","HatchTile45","HatchTile90","HatchTile135","HalfToneTile","HalfToneTile8","CrossHatchTile45","CrossHatchTile90","DahsedHatchTile"], _examples);
  main.variable(observer("viewof preview_fill")).define("viewof preview_fill", ["Inputs"], _preview_fill);
  main.variable(observer("preview_fill")).define("preview_fill", ["Generators", "viewof preview_fill"], (G, _) => G.input(_));
  main.variable(observer()).define(["examples","width","svg"], _4);
  main.variable(observer()).define(["show","examples"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("h1")).define("h1", ["HatchTile45"], _h1);
  main.variable(observer()).define(["show","h1","HatchTile135"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["show","HatchTile45","CrossHatchTile45","CrossHatchTile90","CrossHatchTile","HatchTile0"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["DahsedHatchTile","show"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["show","HalfToneTile"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["html","show","HalfToneTile","HalfToneTile8"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["show","StackedTile","HatchTile45","HatchTile135"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer()).define(["show","HatchTile0"], _23);
  main.variable(observer("HatchTile0")).define("HatchTile0", ["_define_pattern","_defaultHatch"], _HatchTile0);
  main.variable(observer()).define(["show","HatchTile45"], _25);
  main.variable(observer("HatchTile45")).define("HatchTile45", ["_define_pattern","_defaultHatch"], _HatchTile45);
  main.variable(observer()).define(["show","HatchTile90"], _27);
  main.variable(observer("HatchTile90")).define("HatchTile90", ["_define_pattern","_defaultHatch"], _HatchTile90);
  main.variable(observer()).define(["show","HatchTile135"], _29);
  main.variable(observer("HatchTile135")).define("HatchTile135", ["_define_pattern","_defaultHatch"], _HatchTile135);
  main.variable(observer()).define(["show","HalfToneTile"], _31);
  main.variable(observer("HalfToneTile")).define("HalfToneTile", ["_define_pattern","_defaultHatch"], _HalfToneTile);
  main.variable(observer()).define(["show","HalfToneTile8"], _33);
  main.variable(observer("HalfToneTile8")).define("HalfToneTile8", ["_define_pattern","_defaultHatch"], _HalfToneTile8);
  main.variable(observer()).define(["show","CrossHatchTile45"], _35);
  main.variable(observer("CrossHatchTile45")).define("CrossHatchTile45", ["CrossHatchTile","HatchTile45","HatchTile135"], _CrossHatchTile45);
  main.variable(observer()).define(["show","CrossHatchTile90"], _37);
  main.variable(observer("CrossHatchTile90")).define("CrossHatchTile90", ["CrossHatchTile","HatchTile0","HatchTile90"], _CrossHatchTile90);
  main.variable(observer()).define(["show","CrossHatchTile","HatchTile45","HatchTile90"], _39);
  main.variable(observer("CrossHatchTile")).define("CrossHatchTile", ["_define_pattern","_defaultHatch"], _CrossHatchTile);
  main.variable(observer()).define(["show","DahsedHatchTile"], _41);
  main.variable(observer("DahsedHatchTile")).define("DahsedHatchTile", ["_define_pattern","_defaultHatch"], _DahsedHatchTile);
  main.variable(observer()).define(["HalfToneTile8","HatchTile90","show","StackedTile"], _43);
  main.variable(observer("StackedTile")).define("StackedTile", ["_define_pattern","_defaultSettings"], _StackedTile);
  main.variable(observer()).define(["show","BlankTile"], _45);
  main.variable(observer("BlankTile")).define("BlankTile", ["_define_pattern","_defaultSettings"], _BlankTile);
  main.variable(observer()).define(["md"], _47);
  main.variable(observer("_defaultSettings")).define("_defaultSettings", __defaultSettings);
  main.variable(observer("_defaultHatch")).define("_defaultHatch", ["_defaultSettings"], __defaultHatch);
  main.variable(observer("show")).define("show", ["html"], _show);
  main.variable(observer("_define_pattern")).define("_define_pattern", ["DOM"], __define_pattern);
  main.variable(observer()).define(["md"], _52);
  return main;
}
