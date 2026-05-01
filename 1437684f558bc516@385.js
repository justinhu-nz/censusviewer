function _1(md){return(
md`# Making a scale bar

The \`svgScaleBar()\` function returns an SVG widget (a \`<g>\` element) displaying a scale bar.`
)}

function _svg_display(settings,svg,svgBar)
{
  const {scale, max_width} = settings;
  const svg_width = 60 + 1.25 * max_width;
  return svg`<svg viewbox="-30,-21,${svg_width},${svgBar.height+42}" width="${svg_width}" height="${svgBar.height+42}">
  <line x1="0" x2="0" y1="-21" y2="${svgBar.height+21}" stroke="#09f" stroke-width=".5" fill="none" stroke-dasharray="10,3"/>
  <line x1="${max_width}" x2="${max_width}" y1="-21" y2="${svgBar.height+21}" stroke="#09f" stroke-width=".5" fill="none" stroke-dasharray="10,3"/>
  <rect x="-0" y="-0" width="${svgBar.width}" height="${svgBar.height}" stroke="red" stroke-width=".5" fill="none" stroke-dasharray="3,4"/>
  ${svgBar.node}
</svg>`;
}


function _settings(Inputs){return(
Inputs.form({
  m_per_px: Inputs.range([1, 1000], {label: "Metres per pixel", transform: Math.log, value: 10}),
  segment_count: Inputs.range([1, 10], {label: "Step count", step: 1, value : 4}),
  max_width: Inputs.range([100, 800], {label: "Bar width", value: 450}),
  hard_max_width: Inputs.toggle({label: "Hard width limit", value: true}),
})
)}

function _4(md){return(
md`### Settings

 Field | Meaning
------------|-----
\`max_width\` | Maximal width of the scale bar
\`m_per_px\`  | Scale to display, number of metres represented by each logical pixel
\`segment_count\`| Preferred segment count. 1 guarantees there is 1 segment. Other values are treated as preferred count.
\`lbl_size\`  | Label font size
\`lbl_gap\`   | Gap between label and bar
\`bar_height\`| Height of the scale bar (not including ticks and labels)
\`color\`| Color used for the labels and edges
\`bgcolor1\` | Background color for even segments of the color bar. If \`null\`, transparent.
\`bgcolor2\` | Background color for odd segments of the color bar. If \`null\`, same as \`bgcolor1\`. By default (or if \`"auto"\`), same as \`color\`.

### Fields and functions in the returned object

 Field | Meaning
------------|-----
  \`node\`         | a \`<g>\` element (\`SVGGElement\` DOM node) containing the scale bar
  \`width\`        | Width of the widget, may be smaller than the requested width. This covers the scale bar, but the labels may extend outside this width.
  \`height\`       | Height of the widget
  \`segment_px\`   | Pixels covered by one segment
  \`segment_m\`    | Number of metres represented by one segment
  \`segment_count\`| Number of segments
  \`set_m_per_px(v)\` | Update the scale bar to the given scale. \`node\` shall still point to the same DOM node as before this call, but its contents may get cleared and recreated.
`
)}

function _svgBar(SvgScaleBar,settings){return(
new SvgScaleBar({...settings, lbl_height: 14, bar_height: 6})
)}

function _6(md){return(
md`## Recipe`
)}

function _scaleBarMetrics(){return(
function scaleBarMetrics(max_width, hard_max_width, m_per_px, appx_segment_count) {

  appx_segment_count = Math.max(1, appx_segment_count);
  
  // metres within our allowable width
  // add epsilon so that exact input values work
  var available_m = 1.000001 * max_width * m_per_px;
  const segment_m_hint = max_width * m_per_px / appx_segment_count;
  // initial guess: first decade smaller than one hinted segment size
  var segment_m = Math.pow(10, Math.floor(Math.log10(segment_m_hint)));
  var segment_px = segment_m / m_per_px;
  const mul_list = [1, 2, 2.5, 4, 5, 10]; // extra trailing 1
  var ratio_prev, ratio;
  var m;
  // find first multiplier that does not fit
  // m = 1 is guaranteed to fit
  for (var i = 0; i < mul_list.length; ++i) {
    ratio_prev = ratio;
    ratio = mul_list[i] * segment_m * appx_segment_count / available_m;
    if (ratio > 1)
    {
      // avoid ratios below 3/4, if we can't, see which one is closer
      const ratio_prev_offset = Math.min(1, ratio_prev * 1.33);
      m = (1 - ratio_prev_offset) > (1 - ratio) ? mul_list[i - 1] : mul_list[i];
      break;
    }
  }
  segment_m *= m;
  segment_px *= m;
  var steps = Math.floor(available_m / segment_m);
  if (!hard_max_width) steps = Math.max(steps, appx_segment_count);

  return {
    segment_px: segment_px,
    segment_m: segment_m,
    segment_count: steps,
    width: steps * segment_px};
}
)}

function _SvgScaleBar(svg,scaleBarMetrics)
{
  function _SvgScaleBar(settings) {
    // copy settings object, fill in some defaults
    settings = {
      max_width: 300,
      hard_max_width: true,
      segment_count: 4,
      lbl_gap: 6,
      bar_height: 8,
      color: "black",
      bgcolor1: "white",
      bgcolor2: "auto",
      lbl_size: 14,
      ...settings
    };
    settings.color ??= "black";
    this.settings = settings;
    if (settings.bgcolor2 == "auto") settings.bgcolor2 = settings.color;
    this.settings = settings;
    this.node = svg`<g style="font: ${settings.lbl_size}px sans-serif">`;
    this.set_m_per_px(settings.m_per_px);    
  }

  _SvgScaleBar.prototype.set_m_per_px = function(m_per_px) {
    const {
      max_width,
      hard_max_width,
      segment_count,
      lbl_gap,
      bar_height,
      color,
      bgcolor1,
      bgcolor2,
      lbl_size
    } = this.settings;
  
    const m = scaleBarMetrics(max_width, hard_max_width, m_per_px, segment_count);
    const distinct_bg2 = bgcolor2 && bgcolor2 != color;
    // main bar rectangle
    const bar_y = lbl_size + lbl_gap;
    this.node.replaceChildren();
    this.node.append(svg`<rect x="${0}" y="${bar_y}" width="${m.width}" height="${bar_height}"  stroke="${distinct_bg2 ? "none" : color}" stroke-width="1" fill="${bgcolor1 || 'none'}">`)
  
    // black rectangles (alternated with white)
    if (bgcolor2) {
      for (var i = 0; i < m.segment_count; i+=2) {
        this.node.append(svg`<rect x="${i * m.segment_px - 0.5}" y="${bar_y}" width="${m.segment_px + 1}" height="${bar_height}"  stroke="none" fill="${bgcolor2}">`)
      }
    }
  
    if (distinct_bg2) {
      this.node.append(svg`<rect x="${0}" y="${bar_y}" width="${m.width}" height="${bar_height}"  stroke="${color}" stroke- width="1" fill="none">`)
    }
    // choose unit
    var unit = {m:1, lbl:"m"};
    if (m.segment_m * m.segment_count >= 1000) unit = {m:1000, lbl:"km"};
    else if (m.segment_m * m.segment_count < 0.0001) unit = {m:.001, lbl:"μm"};
    else if (m.segment_m * m.segment_count < 0.1) unit = {m:.001, lbl:"mm"};
    else if (m.segment_m * m.segment_count < 1) unit = {m:.01, lbl:"cm"};
  
    // ticks and labels
    const ty1 = color == bgcolor2 ? bar_y : bar_y + bar_height
    for (var i = 0; i <= m.segment_count; ++i) {
      const x = i * m.segment_px;
      var lbl = (m.segment_m * i / unit.m).toFixed(4).replace(/\.?0+$/, '');
      var dx = "";
      if (i == m.segment_count) { lbl += "\u202F" + unit.lbl; dx = `dx=${0.5 * lbl_size}`; }
      this.node.append(svg`<text x="${x}" y="${0}" ${dx} text-anchor="middle" dominant-baseline="hanging" fill="${color}">${lbl}`)
      this.node.append(svg`<line x1="${x}" x2="${x}" y1="${ty1}" y2="${bar_y - Math.floor(lbl_gap * .8)}" stroke="${color}" stroke-width="1">`)
    }
    Object.assign(this, m)
    this.height = bar_height + bar_y;    
  }
  
  return _SvgScaleBar;
}


export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("svg_display")).define("svg_display", ["settings","svg","svgBar"], _svg_display);
  main.variable(observer("viewof settings")).define("viewof settings", ["Inputs"], _settings);
  main.variable(observer("settings")).define("settings", ["Generators", "viewof settings"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("svgBar")).define("svgBar", ["SvgScaleBar","settings"], _svgBar);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("scaleBarMetrics")).define("scaleBarMetrics", _scaleBarMetrics);
  main.variable(observer("SvgScaleBar")).define("SvgScaleBar", ["svg","scaleBarMetrics"], _SvgScaleBar);
  return main;
}
