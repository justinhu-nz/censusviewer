import define1 from "./f34bee86568de1ed@1970.js";
import define2 from "./1437684f558bc516@385.js";

function _1(md){return(
md`# Census 2023 mode share map`
)}

function _map_display(html,map){return(
html`${map.node}`
)}

function _map_settings(Inputs,mode_list,param_density,param_enum,group_list,reference_list){return(
Inputs.form({
  min_density: Inputs.range([0, 1000], {label: "Density cutoff", value: param_density("density", 300), step: 100}),
  mode: Inputs.select(mode_list, {label: "Mode share:", format: x => x.lbl, value: param_enum("mode", mode_list, 4)}),
  who: Inputs.radio(group_list, {label: "Group:", format: x => x.lbl, value: param_enum("who", group_list, 0)}),
  reference: Inputs.radio(reference_list, {label: "Proportion of:", format: x => x.lbl, value: param_enum("reference", reference_list, 0)}),
  
})
)}

function _4(map_settings,md){return(
md`Link to map: [${map_settings.who.lbl} — ${map_settings.mode.lbl}](?mode=${map_settings.mode.k}&who=${map_settings.who.k}&reference=${map_settings.reference.k})`
)}

function _get_svg(map_updater,Inputs){return(
map_updater, Inputs.button("Get SVG")
)}

function _6(md){return(
md`### Sources

The source data and statistical area boundaries were provided under the Creative Commons Attribution New Zealand license by Stats NZ. The mode shares are for travel to work and travel to education, measured by the 2023 census

The streets overlay is based on OpenStreetMap data.`
)}

function _7(md){return(
md`## Recipe`
)}

async function _map(ModeShareMap,chart_size,img_size,chart_extent,FileAttachment){return(
ModeShareMap({
  chart_size_px: chart_size,
  img_size_px: img_size,
  chart_extent: chart_extent,
  img_href: await FileAttachment("base-streets-city-noscale.png").url(),
  copyright_text: "Data: Census 2023, Stats NZ. Creative Commons 4.0 International Licence. Road data: © OpenStreetMap contributors"
})
)}

function _ModeShareMap(d3,HatchTile45,DOM,svg,SvgScaleBar,img_m_per_px,scale_bar_settings,width){return(
async function ModeShareMap(settings)
{
  const {
    img_size_px,
    chart_size_px,
    chart_extent,
    img_href,
    max_px_zoom = 1.5,
    copyright_text = "Insert copyright here"
  } = settings;

  // needed with fitSize, because we want to keep aspect ratio intact
  const img_scale = Math.min(chart_size_px[0] / img_size_px[0], chart_size_px[1] / img_size_px[1])
  const chart_size_px_aspect =  [img_size_px[0] * img_scale, img_size_px[1] * img_scale];
    
  const img_bounds_path = ({
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            chart_extent[0],
            [chart_extent[0][0], chart_extent[1][1]],
            chart_extent[1],
            [chart_extent[1][0], chart_extent[0][1]],
            chart_extent[0]
          ]
        ]
      },
      "properties": {}
    });

  // the image is projected exactly to the SVG area
  // All our input data is already mapped to some projection
  // with northings and eastings so we can just scale it to
  // our map
  const projection = d3.geoIdentity().reflectY(true).fitSize(chart_size_px_aspect, img_bounds_path);
  const geo_path = d3.geoPath(projection);
  
  const div = d3.create("div");
  const info_div = div.append("div");
  info_div.style("display", "none")
          .style("position", "absolute")
          .style("font-size", "85%")
          .style("background", "white")
          .style("border", "1px solid #bbb")
          .style("border-radius", ".3em")
          .style("box-shadow", "1px 1px 4px rgba(0, 0, 0, .05)")
          .style("padding", "0 .5em");
    
  const svg_root = div.append("svg")
      .style("display", "block")
      .attr("viewBox", [0, 0, chart_size_px[0], chart_size_px[1]]);

  const defs = svg_root.append("defs");
  defs.append("pattern")
    .attr('id','bgimage')
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("x", "0")
    .attr("y", "0")
    .attr("viewBox", `0 0 ${img_size_px[0]} ${img_size_px[1]}`)
    .append('image')
      .attr('width', img_size_px[0])
      .attr('height', img_size_px[1])
      .attr('xlink:href', img_href)
  
  const noDataHatch = HatchTile45({size: 4, fill: .4, fg: "#ccc", bg: "white", id: DOM.uid("no-data")});
  const hatchPattern = defs.append(x => svg`${noDataHatch.svg()}`);

  var defs_extra;
  var transform_timeout;
  
  var k = 1;
  
  var clip_rect = svg_root.append("defs")
    .append('clipPath')
      .attr('id', 'map-clip-box')
      .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', chart_size_px_aspect[0])
        .attr('height', chart_size_px_aspect[1]);
  
  var clip_layer = svg_root.append('g').attr('clip-path', 'url(#map-clip-box)');

  const map_layer = clip_layer.append("g");

  const sa_layer = map_layer.append("g");
  
  const img_layer = clip_layer.append("g");
  img_layer.append("path")
    .datum(img_bounds_path)
    .attr("d", geo_path)
    .attr("style", "pointer-events: none;")
    .attr('fill','url(#bgimage)')

  const decoration_layer = clip_layer.append("g");
  const text_pos = projection([chart_extent[1][0], chart_extent[0][1]]);
  decoration_layer.append("text")
    .attr("x", text_pos[0] - 5)
    .attr("y", text_pos[1] - 5)
    .style("font-family", "sans-serif")
    .style("font-size", (24 * img_scale) + "px")
    .style("fill", "#333").style("paint-order", "stroke fill")
    .style("stroke", "#fff").style("stroke-opacity", "0.6")
    .style("stroke-width", "3px").style("stroke-linejoin", "round")
    .attr("text-anchor", "end")
    .text(copyright_text);

  const scale_bar = new SvgScaleBar({m_per_px: 2 * img_m_per_px, ...scale_bar_settings});
  scale_bar.node.setAttribute("transform", `translate(${20 * img_scale}, ${chart_size_px[1] - 68 * img_scale}) scale(${2 * img_scale})`)
  decoration_layer.append(() => scale_bar.node);

  const select_layer = clip_layer.append("g")
    .attr("stroke-width", 1.5);

  // click event
  
  function sa_clicked(event, d)
  {
    select_layer.selectAll("*").remove();

    const id = d.properties.ID;
    if (obj.selection[id]) {
      delete obj.selection[id];
      close_info();
      console.log("Unselect", obj.selection)
      return;
    }
    
    obj.selection = {[id]: d};
      console.log("Select", obj.selection)
    
    select_layer.append("path")
      .datum(d)
      .attr("d", geo_path)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round");
    select_layer.append("path")
      .datum(d)
      .attr("id", "select-strokes")
      .attr("d", geo_path)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-dasharray", [3/k, 3/k])
      .attr("stroke-linejoin", "round");
    
    // fill info box
    if (obj.info_f) {
      info_div.selectAll("*").remove();
      info_div.style("display", "block");
      const centroidX = geo_path.centroid(d.geometry)[0];
      const zoom_transform = obj.zoomTransform();
      if (centroidX * zoom_transform.k + zoom_transform.x > chart_size_px[0] * .5) {
        info_div.style("x", "0px");
        info_div.style("right", null);
      }
      else {
        info_div.style("x", null);
        info_div.style("right", "0px");
      }
      info_div.append("span")
        .style("cursor", "pointer")
        .style("margin-left", "1em")
        .style("margin-right", "-.5em")
        .style("float", "right")
        .text("✖")
        .on("click", close_info);
      const info_el = obj.info_f(d);
      info_el.forEach(e => info_div.append(() => e));
    }
  }
  
  function close_info()
  {
    select_layer.selectAll("*").remove();
    info_div.selectAll("*").remove();
    info_div.style("display", "none");
  }
  
  var obj = {
    node: div.node(),
    svg_root : svg_root,
    img_scale : img_scale,
    chart_size : chart_size_px,
    geo_path: geo_path,
    map_layer: map_layer,
    img_layer: img_layer,
    decoration_layer: decoration_layer,
    transform_callback: null,
    no_data_fill: noDataHatch.url(),
    selection: {}};
  
  obj.update_fill = function(collection, fill_f, title_f, info_f)
  {
    close_info();
    obj.selection = {};
    obj.info_f = info_f;
    sa_layer.selectAll("path")
      .data(collection.features)
      .join("path")
        .attr("fill", d => fill_f(d) ?? noDataHatch.url())
        .attr("d", geo_path)
        .on("click", sa_clicked)
        .selectAll("title")
          .data(f => [f])
          .join("title")
            .text(title_f);
  }
  
  obj.zoomTransform = function()
  {
    return d3.zoomTransform(obj.svg_root.node());
  }
  
  function zoomed({transform}) {
    k = transform.k;
    map_layer.attr("transform", transform);
    img_layer.attr("transform", transform);
    select_layer.attr("transform", transform)
      .attr("stroke-width", 1.5 / k);
    select_layer.selectAll("#select-strokes")
      .attr("stroke-dasharray", [3/k, 3/k]);
    scale_bar.set_m_per_px(2 * img_m_per_px / k);
    clip_rect
      .attr('x', transform.x)
      .attr('y', transform.y)
      .attr('width', transform.k * chart_size_px_aspect[0])
      .attr('height', transform.k * chart_size_px_aspect[1])
  }

  function zoomed_end({transform})
  {
    // update list of definitions after a delay
    // (updating patterns is potentially slow)
    if (obj.transform_callback)
    {
      clearTimeout(transform_timeout);
      transform_timeout = setTimeout(function() {
        obj.transform_callback(transform, obj)
        transform_timeout = undefined;
      }, 1000);
    }
    hatchPattern.attr("patternTransform", `scale(${1 / transform.k})`);    
  }

  obj.set_transform_callback = function(f)
  {
    obj.transform_callback = f;
    zoomed_end({transform: obj.zoomTransform()});
  }
  
  obj.trigger_transform_callback = function()
  {
    zoomed_end({transform: obj.zoomTransform()});
  };
  
  // zoom behaviour  
  svg_root.call(d3.zoom()
      .extent([[0, 0], chart_size_px])
           // ideally we would exclude the areas outside the clipping box but
           // that doesn’t work well.
      .translateExtent([[0, 0], chart_size_px]) 
      .scaleExtent([1, max_px_zoom * img_size_px[0] / width])
      .on("zoom", zoomed)
      .on("end", zoomed_end));
  
  return obj;
}
)}

function _update_map(census_collection,d_to_color,d_to_title,d_to_info,legend_ternary,map_bg_color,histogram_legend,histogram,map_color_list,format_prop,scale_max){return(
function update_map(map, settings) {
  // update fill
  map.update_fill(census_collection, d_to_color, d_to_title, d_to_info);

  // update legend decoration
  const l_height = settings.mode.k == "ternary" ? 120 : 90;
  var legend = settings.mode.k == "ternary" ?
    legend_ternary({background: map_bg_color, labels: settings.mode.corners,
                   height: l_height}) :
    histogram_legend(settings.mode.lbl + " (%)", histogram, map_color_list,
                     { format_lbl: x => format_prop(x, scale_max, false),
                       background: map_bg_color, height: l_height});

  const l_scale = 3 * map.img_scale;
  const l_y = map.chart_size[1] - l_scale * (40 + l_height)
  legend.setAttribute('transform', `translate(${5 * l_scale}, ${l_y}) scale(${l_scale})`);
  
  const g = map.decoration_layer;
  g.selectChild(".legend").remove();
  legend.classList.add("legend");
  g.append(() => legend);
}
)}

function _map_updater(update_map,map,map_settings){return(
update_map(map, map_settings)
)}

function _make_map_svg_node(ModeShareMap,img_size,chart_extent,FileAttachment,copyright_text,update_map,map_settings){return(
async function make_map_svg_node() {
  // almost identical to our displayed map, but with a fixed size and with a simple relative background image URL
  var map = await ModeShareMap({
    chart_size_px: [img_size[0] / 2, img_size[1] / 2],
    img_size_px: img_size,
    chart_extent: chart_extent,
    img_href: await FileAttachment("base-streets-city-noscale.png").url(),
    copyright_text: copyright_text
  })
  update_map(map, map_settings);
  console.log(map.svg_root)
  return map.svg_root.node();
}
)}

async function _map_downloader(get_svg,download_svg_map)
{
  if (!get_svg) return;
  await download_svg_map();
}


function _download_svg_map(XMLSerializer,make_map_svg_node,map_settings){return(
async function download_svg_map() {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(await make_map_svg_node());
  const blob = new Blob([source], {type: "application/octet-stream"});
  const url = URL.createObjectURL(blob);
  
  let downloadLink = document.createElement('a');
  downloadLink.setAttribute('download', `census-2023-travel-${map_settings.who.k}-${map_settings.mode.k}.svg`);
  downloadLink.setAttribute('href', url);
  downloadLink.click();
}
)}

function _scale_bar_settings(){return(
{ lbl_size: 12, lbl_gap: 5, bar_height: 6, max_width: 300, segment_count: 4 }
)}

function _histogram_legend(svg){return(
function histogram_legend(title, histogram, color_list, settings) {
  const {
    format_lbl = x => x,
    bin_width = 20,
    height = 100,
    lbl_size = 10,
    title_lbl_size = 14,
    background = "#ccc",
    border = "#aaa"
  } = settings;

  const width = histogram.h.length * bin_width - 1;
  const y_h_top = title_lbl_size * 1.3;
  const y_lbl = height - lbl_size;
  const y1 = y_lbl - 5;
  const y0 = y1 - 6;
  const h_height = y0 - y_h_top - 2;
  const full_height = height + 10;
  const full_width = width + 20;
  
  var our_svg = svg`<g>`

  // background
  our_svg.append(svg`<rect x="0.5" y="0.5" width="${full_width - 1}" height="${full_height - 1}" rx="4" ry="4" stroke="${border}" stroke-width="1" fill="${background}"/>`);

  // contents inside padding
  var g = svg`<g transform="translate(10, 5)">`;
  our_svg.append(g);

    // title
    g.append(svg`<text x="${0}" y="${title_lbl_size}" style="font: ${title_lbl_size}px sans-serif; font-weight: bold;">${title}</text>`);

  const g2 = svg`<g stroke-width=".5" stroke="#c3c3c3">`;
  g.append(g2)
  for (var i = 0; i < histogram.h.length; ++i) {
    // legend bar
    g.append(svg`<rect x="${bin_width * i}" y="${y0}" width="${bin_width - 1}" height="${y1 - y0}" fill="${color_list[i]}">`)
    // histogram bars
    if (histogram.h[i] > 1e-4) {
      var hh = h_height * histogram.h[i] / histogram.max;
      g2.append(svg`<rect x="${bin_width * i + 1}" y="${y_h_top + h_height - hh}" width="${bin_width - 3}" height="${hh + .5}" fill="${color_list[i]}">`)
    }
  }
  for (var i = 1; i < histogram.h.length; ++i) {
    // ticks
    const x = bin_width * i - 0.5
    g.append(svg`<line x1="${x}" y1="${y0}" x2="${x}" y2="${y_lbl - 3}" stroke="black">`);
    g.append(svg`<text x="${x}" y="${y_lbl}" text-anchor="middle" dominant-baseline="hanging" style="font: ${lbl_size}px sans-serif;">${format_lbl(i * histogram.bin_width)}</text>`);
  }
  return our_svg;
}
)}

function _legend_ternary(svg,ternary_color,t_weights){return(
function legend_ternary(settings) {
  const {
    height = 130,
    lbl_size = 12,
    background = "#ccc",
    border = "#aaa",
    labels = ["corner1", "corner2", "corner3"],
  } = settings;

  var full_height = height + 10;
  var full_width = height + 100;
  
  var our_svg = svg`<g>`

  // background
  our_svg.append(svg`<rect x="0.5" y="0.5" width="${full_width - 1}" height="${full_height - 1}" rx="4" ry="4" stroke="${border}" stroke-width="1" fill="${background}"/>`);

  // contents inside padding
  var g = svg`<g transform="translate(50, 5)">`;
  our_svg.append(g);

  // points of triangle
  const tri_hw = (height - 3 * lbl_size) / Math.sqrt(3);
  const p1 = [height * 0.5, 1.5 * lbl_size];
  const p2 = [height * 0.5 - tri_hw, height - 18];
  const p3 = [height * 0.5 + tri_hw, height - 18];

  function combine(p1, p2, p3, t2, t3) {
    const t1 = 1 - t2 - t3;
    return [p1[0] * t1 + p2[0] * t2 + p3[0] * t3,
            p1[1] * t1 + p2[1] * t2 + p3[1] * t3]
  }

  function tri(p1, p2, p3, fill, stroke) {
    return svg`<path d="M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]} Z"
      fill="${fill || 'none'}" stroke-width="${stroke ? '0.5' : 'none'}" stroke="${stroke || 'none'}"/>`;
  }

  // color legend
  const delta = .05;
  const n_steps = 20;
  for (var i = 0; i < n_steps; ++i) {
    for (var j = 0; i + j < n_steps; ++j) {
      var t2 = delta * i;
      var t3 = delta * j;
      var t1 = 1 - t2 - t3;
      var pa1 = combine(p1, p2, p3, t2, t3);
      var pa2 = combine(p1, p2, p3, t2 + delta, t3);
      var pa3 = combine(p1, p2, p3, t2, t3 + delta);
      var pb3 = combine(p1, p2, p3, t2 + delta, t3 + delta);

      var g1 = svg`<g shape-rendering="crispEdges">`;
      g.append(g1);
      g1.append(tri(pa1, pa2, pa3,
                   ternary_color([t1 - 0.666 * delta, t2 + 0.333 * delta, t3 + 0.333 * delta], t_weights), null));
      if (i + j + 1 < n_steps) {
        g1.append(tri(pa2, pa3, pb3,
                     ternary_color([t1 - 1.333 * delta, t2 + 0.666 * delta, t3 + 0.666 * delta], t_weights), null));
      }
    }
  }

  const g2 = svg`<g style="font: ${lbl_size}px sans-serif; font-weight: bold;" dominant-baseline="hanging" text-anchor="middle">`
  g.append(g2);
  g2.append(svg`<text x="${p1[0]}" y="${p1[1] - 2 - lbl_size}">${labels[0]}</text>`);
  g2.append(svg`<text x="${p2[0] - 5}" y="${p2[1] + 4}">${labels[1]}</text>`);
  g2.append(svg`<text x="${p3[0] + 5}" y="${p3[1] + 4}">${labels[2]}</text>`);
  g.append(tri(p1, p2, p3, null, "black"));
  
  return our_svg;
}
)}

function _histogram(make_histogram,d_to_prop,d_to_ref,census_collection,scale_max,map_color_list){return(
make_histogram(d_to_prop, d_to_ref,
                           census_collection.features,
                           scale_max, map_color_list.length)
)}

function _make_histogram(){return(
function make_histogram(d_to_prop, d_to_ref, data, max_edge, bins) {
  var histogram = new Array(bins).fill(0)
  var total = 0;
  data.forEach(d => {
    const p = d_to_prop(d);
    const ref = d_to_ref(d);
    if (isNaN(ref)) return;
    total += ref;
    if (!isNaN(p) && p >= 0) {
      const p_scaled = Math.max(0, Math.min(1, p / max_edge) * (bins - 1));
      histogram[Math.floor(p_scaled)] += ref;
    }
  })
  histogram = histogram.map(x => x / total);
  // clip trailing zero bins
  // arbitrarily always keep at least 5 bins
  while (histogram.at(-1) < 1e-4 && histogram.length > 5) {
    histogram.pop();
  }
  return {
    h: histogram,
    max: Math.max(...histogram),
    bin_width: max_edge / (bins - 1)
  }
}
)}

function _img_size(){return(
[2030, 2460]
)}

function _img_m_per_px(){return(
20
)}

function _chart_extent(worldfile_to_bbox,img_m_per_px,img_size){return(
worldfile_to_bbox(img_m_per_px, 378000, 823500, img_size)
)}

function _chart_size(width,img_size)
{
  const max_chart_h = 800;
  const img_w = img_size[0];
  const img_h = img_size[1];
  const scale = Math.min(width / img_w, max_chart_h / img_h);
  return [Math.round(img_w * scale), Math.round(img_h * scale)];
}


function _reference_list(){return(
[{k: "all", lbl: "Total stated"}, {k: "travelling", lbl: "Travelling"}]
)}

function _mode_list(){return(
[
  {lbl: "By car", k: "car", col: ["car", "car-passenger"], max: 1.00},
  {lbl: "Drive car", k: "car-driver", col: ["car"], max: 1.00},
  {lbl: "Passenger in a car", k: "car-passenger", max: 0.40, max_edu: 1.00, max_work: 0.20},
  {lbl: "Bicycle", k: "bicycle", max: 0.10},
  {lbl: "Walk", k: "walk", max: 0.50},
  {lbl: "All active", k: "active", col: ["walk", "bicycle"], max: 0.50},
  {lbl: "Bus", k: "bus", max: 0.30},
  {lbl: "School bus", k: "schoolbus", max: 0.50},
  {lbl: "Train", k: "train", max: 0.20},
  {lbl: "Ferry", k: "ferry", max: 0.20},
  {lbl: "All transit", k: "transit", col: ["bus", "schoolbus", "train", "ferry"], max: 0.30},
  {lbl: "From home", k: "home", max: 0.50},
  {lbl: "Response rate", k: "response", max: 1.00, max_edu: 0.50},
  {lbl: "Transit / active / car", k: "ternary", corners: ["car", "active", "transit"]},
]
)}

function _group_list(){return(
[
  {lbl: "Work", k: "work"},
  {lbl: "Study", k: "edu"},
  {lbl: "Combined", k: "combined"},
]
)}

function _27(md){return(
md`## Color map`
)}

function _map_color_list(){return(
[
    'rgb(255, 255, 255)',
    'rgb(255, 249, 185)',
    'rgb(255, 219, 123)',
    'rgb(255, 181,  76)',
    'rgb(255, 140,  45)',
    'rgb(237, 107,  76)',
    'rgb(219,  71,  91)',
    'rgb(200,  10, 100)',
    'rgb(162,  42, 133)',
    'rgb(125,  43, 162)',
    'rgb( 90,  20, 190)',  
]
)}

function _map_bg_color(){return(
'rgb(240, 240, 240)'
)}

function _ternary_color(){return(
function ternary_color(parts, weights) {
  weights ??= [1, 1, 1];
  const ref = parts[0] + parts[1] + parts[2];
  const colors = [
    [0.55, 0.00, 0.00],
    [0.0, 1.0, 0.1],
    [0.0, 0.07, 1.0]]
  var [r, g, b] = [0, 0, 0];
  var w = 0;
  for (var i = 0; i < 3; ++i) {
    if (isNaN(parts[i])) {
      return null;
    }
    const v = parts[i] / ref * weights[i];
    r += v * colors[i][0];
    g += v * colors[i][1];
    b += v * colors[i][2];
    w += v;
  }
  // crude inverse EOTF correction
  [r, g, b] = [r, g, b].map(r => Math.sqrt(Math.min(1, r / w)) * 255);
  return `rgb(${r}, ${g}, ${b})`;
}
)}

function _t_weights(map_settings){return(
map_settings.who.k == "edu" ? [1, 1, 1] : [0.4, 1, 1]
)}

function _d_to_color(map_settings,color_scheme,ternary_color,d_to_ternary,t_weights,d_to_prop,scale_max){return(
function d_to_color(d) {
  const density = d.properties["pop-2023"] / d.properties["land area"];
  if (density < map_settings.min_density) return color_scheme(-1);

  if (map_settings.mode.k == "ternary") {
    return ternary_color(d_to_ternary(d), t_weights);
  }
  
  const prop = d_to_prop(d);
  return color_scheme(prop / scale_max);
}
)}

function _color_scheme(map_bg_color,map_color_list){return(
function color_scheme(x)
{
  // no data due to masking
  if (x < 0) { return map_bg_color; }

  // data omitted in source data
  if (isNaN(x)) { return null; }
  
  // for off-the-chart values, use dark purple or black
  if (x > 2) return "black";
  if (x > 1.5) return "rgb(70,   0, 110 )";

  x = Math.max(0, Math.min(1, x));

  x *= (map_color_list.length - 1);
  return map_color_list[Math.floor(x)];
}
)}

function _d_to_prop(map_settings,get_prop,d_to_ref){return(
function d_to_prop(d) {
  // forbidden combinations
  if (map_settings.mode.k == "home" && map_settings.reference.k == "travelling") {
    return NaN;
  }
  if (map_settings.mode.k == "schoolbus" && map_settings.who.k == "work") {
    return NaN;
  }

  if (map_settings.mode.k == "response") {
    return get_prop(d, "total-stated") / d.properties["pop-2023"];
  }
  
  var count = 0;
  const col = map_settings.mode.col ?? [map_settings.mode.k];
  col.forEach(x => count += get_prop(d, x))
  var reference = d_to_ref(d)
  return count / reference;
}
)}

function _d_to_ternary(get_prop,d_to_ref){return(
function d_to_ternary(d) {
  var count = 0;
  var car = get_prop(d, "car") + get_prop(d, "car-passenger");
  var active = get_prop(d, "walk") + get_prop(d, "bicycle");
  var transit = get_prop(d, "train") + get_prop(d, "bus") +
    get_prop(d, "ferry") + get_prop(d, "schoolbus");
  const ref = d_to_ref(d);
  return [car / ref, active / ref, transit / ref];
}
)}

function _d_to_ref(map_settings,get_prop){return(
function d_to_ref(d) {
  if (map_settings.mode.k == "response") {
    return d.properties["pop-2023"];
  }
  var reference = get_prop(d, "total-stated");
  if (map_settings.reference.k == "travelling") reference -= get_prop(d, "home");
  return reference;
}
)}

function _scale_max(map_settings){return(
(map_settings.who.k == "edu" && map_settings.mode.max_edu) || 
  (map_settings.who.k == "work" && map_settings.mode.max_work) ||
  map_settings.mode.max
)}

function _d_to_title(map_settings,format_prop,d_to_prop){return(
function d_to_title(d) {
  if (map_settings.mode.k != "ternary") {
    return d.properties.name + ": " + format_prop(d_to_prop(d))
  }
  return d.properties.name;
}
)}

function _d_to_info(map_settings,get_prop,html,format_prop){return(
function d_to_info(d) {
  const s_ref = map_settings.reference.k;
  const s_who = map_settings.who.k;
  var reference = get_prop(d, "total-stated");
  if (s_ref == "travelling") reference -= get_prop(d, "home");
  
  const car = get_prop(d, "car") / reference;
  const carpass = get_prop(d, "car-passenger") / reference;
  const bicycle = get_prop(d, "bicycle") / reference;
  const walk = get_prop(d, "walk") / reference;
  const bus = get_prop(d, "bus") / reference;
  const schoolbus = (get_prop(d, "schoolbus") || 0) / reference;
  const train = get_prop(d, "train") / reference;
  const ferry = get_prop(d, "ferry") / reference;
  const home = get_prop(d, "home") / reference;
  
  const title = html`<b>${d.properties.name}</b>`;
  const table = html`<table style='margin: 0.1em;'>
    <tr><td>Population</td><td colspan=2>${d.properties["pop-2023"]}</td></tr>
    <tr><td>Total stated</td><td colspan=2>${get_prop(d, 'total-stated')}</td></tr>
    <tr><td>Drive car</td><td>${format_prop(car)}</td><td rowspan=2 style="vertical-align: middle; border-left: 1px solid #eee;">${format_prop(car + carpass)}</td></tr>
    <tr><td>Passenger in a car</td><td>${format_prop(carpass)}</td></tr>
    <tr><td>Walk</td><td>${format_prop(walk)}</td><td rowspan=2 style="vertical-align: middle; border-left: 1px solid #eee;">${format_prop(walk + bicycle)}</td></tr>
    <tr><td>Bicycle</td><td>${format_prop(bicycle)}</td></tr>
    <tr><td>Bus</td><td>${format_prop(bus)}</td><td rowspan=${s_who == "work" ? 3 : 4} style="vertical-align: middle; border-left: 1px solid #eee;">${format_prop(bus + schoolbus + train + ferry)}</td></tr>
	</table>`

  if (s_who != "work") {
    table.tBodies[0].append(
      html`<tr><td>School bus</td><td>${format_prop(schoolbus)}</td></tr>`);
  }
  table.tBodies[0].append(
    html`<tr><td>Train</td><td>${format_prop(train)}</td></tr>`,
    html`<tr><td>Ferry</td><td>${format_prop(ferry)}</td></tr>`);
  
  if (s_ref != "travelling") {
    table.tBodies[0].append(
      html`<tr><td>From home</td><td>${format_prop(home)}</td><td></td></tr>`);
  }
  return [title, table];
}
)}

function _40(md){return(
md`### Extras`
)}

function _worldfile_to_bbox(){return(
function worldfile_to_bbox(m_per_px, tx, ty, img_size_px)
{
  const [img_w, img_h] = img_size_px;
  const s = -m_per_px * (img_h - 0.5) + ty
  const n = -m_per_px * -0.5 + ty
  const w = m_per_px * -0.5 + tx
  const e = m_per_px * (img_w - 0.5) + tx
  return [[w, s], [e, n]];
}
)}

function _format_prop(){return(
function format_prop(p, p_ref, with_pctsign = true) {
  p_ref ??= p;
  if (p != p) return "N/A";
  p *= 100;
  const isInt = (p - Math.floor(p)) < .001 * Math.abs(p);
  const txt = (p.toFixed(p_ref >= 0.01 && isInt ? undefined : 1));
  return with_pctsign ? txt + "%" : txt;
}
)}

function _param_enum(URLSearchParams,html)
{
  var params = new URLSearchParams(html`<a href>`.search)
  return function(param_name, choices, default_index)
  {
    var v = params.get(param_name);
    if (v == null) return choices[default_index];
    var index = default_index;
    for (var i = 0; i < choices.length; ++i) {
      if (choices[i].k == v) {
        index = i;
        break;
      }
    }
    
    return choices[index];
  }
}


function _param_density(URLSearchParams,html)
{
  var params = new URLSearchParams(html`<a href>`.search)
  return function(param_name, default_value)
  {
    const v = params.get(param_name);
    if (v == null) return default_value;
    const n = Number(v);
    if (!Number.isInteger(n)) return default_value;
    if (n < 0 || n > 1000) return default_value;
    return n;
  }
}


function _44(md){return(
md`## Data`
)}

function _copyright_text(){return(
"Data: Census 2023, Stats NZ. Creative Commons 4.0 International Licence. Road data: © OpenStreetMap contributors"
)}

async function _census_collection(d3,FileAttachment,to_numeric,as_map,merge_car)
{
  const geometry = await d3.json(await FileAttachment("SA2@1.geojson").url());
  const data = await d3.csv(await FileAttachment("SA2.csv").url());
  const data_transport = await d3.csv(await FileAttachment("SA2-2023-transport.csv").url());
  to_numeric(data);
  const data_map = as_map(data);
  to_numeric(data_transport);
  merge_car(data_transport, "travel-2023-work");
  const data_transport_map = as_map(data_transport);

  geometry.features.forEach(g => 
    g.properties = {
      ...g.properties,
      ...data_map[g.properties.ID],
      ...data_transport_map[g.properties.ID]} );
  
  return geometry;
}


function _get_prop(map_settings){return(
function get_prop(d, field) {
  var n1 = null;
  var n2 = null;
  const who = map_settings.who.k;
  if (who == "edu" || who == "combined") n1 = d.properties["travel-2023-edu-" + field];
  if (who == "work" || who == "combined") n2 = d.properties["travel-2023-work-" + field];
  if (n1 == null && n2 == null) return null;
  return (n1 ?? 0) + (n2 ?? 0);
}
)}

function _as_map(){return(
function as_map(list) {
  if (!list) return {};
  var m = {};
  list.forEach(x => m[x.ID] = x);
  return m;
}
)}

function _to_numeric(){return(
function to_numeric(csv_table) {
  for (let row of csv_table) {
    for (let [k, v] of Object.entries(row)) {
      if (k != "name") {
        const n = +v;
        row[k] = n >= 0 ? n : NaN;
      }
    }
  }
}
)}

function _merge_car(){return(
function merge_car(csv_table, prefix) {
  for (let row of csv_table) {
    row[prefix + "-car"] = row[prefix + "-car1"] + row[prefix + "-car2"];
  }
}
)}

function _51(md){return(
md`## Imports`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["base-streets-city-noscale.png", {url: new URL("./files/8e9d6fe77d991a2124af11e4faf4c03bac255ea997154e3a2cf69c2f7eec1f264df83a7055055310b47425e55c523ae1a61b5fa45ed9511ece0d1e0ba0c17013.png", import.meta.url), mimeType: "image/png", toString}],
    ["SA2@1.geojson", {url: new URL("./files/c24c7e6b47aa70c6ce2b9214b761e109d78eb7ebff6288ebda4048dda3e675dcd4f8923f2052baeb18035ecd4afb7a4057f01e92da16b82d4c64ea54ebb74eb8.geojson", import.meta.url), mimeType: "application/geo+json", toString}],
    ["SA2.csv", {url: new URL("./files/8edde0c23c64c279e58424efe4bdc10248156c6bf299ee7dd4fc341ccce78efa9351b2ff3a7371ffd0b987988a6c2d0b3c6e43a9b6d195b9dfa0e2350a5c96fb.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["SA2-2023-transport.csv", {url: new URL("./files/9f18bd7ef5119a79f33c6db4207730a82ec87d0ae5e501fe9e48e0351abcd2ee2da42dad6230088cbb807bf77e3d3908c4ee2f444f4be84ce2b3cf6b35474fd7.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("map_display")).define("map_display", ["html","map"], _map_display);
  main.variable(observer("viewof map_settings")).define("viewof map_settings", ["Inputs","mode_list","param_density","param_enum","group_list","reference_list"], _map_settings);
  main.variable(observer("map_settings")).define("map_settings", ["Generators", "viewof map_settings"], (G, _) => G.input(_));
  main.variable(observer()).define(["map_settings","md"], _4);
  main.variable(observer("viewof get_svg")).define("viewof get_svg", ["map_updater","Inputs"], _get_svg);
  main.variable(observer("get_svg")).define("get_svg", ["Generators", "viewof get_svg"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("map")).define("map", ["ModeShareMap","chart_size","img_size","chart_extent","FileAttachment"], _map);
  main.variable(observer("ModeShareMap")).define("ModeShareMap", ["d3","HatchTile45","DOM","svg","SvgScaleBar","img_m_per_px","scale_bar_settings","width"], _ModeShareMap);
  main.variable(observer("update_map")).define("update_map", ["census_collection","d_to_color","d_to_title","d_to_info","legend_ternary","map_bg_color","histogram_legend","histogram","map_color_list","format_prop","scale_max"], _update_map);
  main.variable(observer("map_updater")).define("map_updater", ["update_map","map","map_settings"], _map_updater);
  main.variable(observer("make_map_svg_node")).define("make_map_svg_node", ["ModeShareMap","img_size","chart_extent","FileAttachment","copyright_text","update_map","map_settings"], _make_map_svg_node);
  main.variable(observer("map_downloader")).define("map_downloader", ["get_svg","download_svg_map"], _map_downloader);
  main.variable(observer("download_svg_map")).define("download_svg_map", ["XMLSerializer","make_map_svg_node","map_settings"], _download_svg_map);
  main.variable(observer("scale_bar_settings")).define("scale_bar_settings", _scale_bar_settings);
  main.variable(observer("histogram_legend")).define("histogram_legend", ["svg"], _histogram_legend);
  main.variable(observer("legend_ternary")).define("legend_ternary", ["svg","ternary_color","t_weights"], _legend_ternary);
  main.variable(observer("histogram")).define("histogram", ["make_histogram","d_to_prop","d_to_ref","census_collection","scale_max","map_color_list"], _histogram);
  main.variable(observer("make_histogram")).define("make_histogram", _make_histogram);
  main.variable(observer("img_size")).define("img_size", _img_size);
  main.variable(observer("img_m_per_px")).define("img_m_per_px", _img_m_per_px);
  main.variable(observer("chart_extent")).define("chart_extent", ["worldfile_to_bbox","img_m_per_px","img_size"], _chart_extent);
  main.variable(observer("chart_size")).define("chart_size", ["width","img_size"], _chart_size);
  main.variable(observer("reference_list")).define("reference_list", _reference_list);
  main.variable(observer("mode_list")).define("mode_list", _mode_list);
  main.variable(observer("group_list")).define("group_list", _group_list);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer("map_color_list")).define("map_color_list", _map_color_list);
  main.variable(observer("map_bg_color")).define("map_bg_color", _map_bg_color);
  main.variable(observer("ternary_color")).define("ternary_color", _ternary_color);
  main.variable(observer("t_weights")).define("t_weights", ["map_settings"], _t_weights);
  main.variable(observer("d_to_color")).define("d_to_color", ["map_settings","color_scheme","ternary_color","d_to_ternary","t_weights","d_to_prop","scale_max"], _d_to_color);
  main.variable(observer("color_scheme")).define("color_scheme", ["map_bg_color","map_color_list"], _color_scheme);
  main.variable(observer("d_to_prop")).define("d_to_prop", ["map_settings","get_prop","d_to_ref"], _d_to_prop);
  main.variable(observer("d_to_ternary")).define("d_to_ternary", ["get_prop","d_to_ref"], _d_to_ternary);
  main.variable(observer("d_to_ref")).define("d_to_ref", ["map_settings","get_prop"], _d_to_ref);
  main.variable(observer("scale_max")).define("scale_max", ["map_settings"], _scale_max);
  main.variable(observer("d_to_title")).define("d_to_title", ["map_settings","format_prop","d_to_prop"], _d_to_title);
  main.variable(observer("d_to_info")).define("d_to_info", ["map_settings","get_prop","html","format_prop"], _d_to_info);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer("worldfile_to_bbox")).define("worldfile_to_bbox", _worldfile_to_bbox);
  main.variable(observer("format_prop")).define("format_prop", _format_prop);
  main.variable(observer("param_enum")).define("param_enum", ["URLSearchParams","html"], _param_enum);
  main.variable(observer("param_density")).define("param_density", ["URLSearchParams","html"], _param_density);
  main.variable(observer()).define(["md"], _44);
  main.variable(observer("copyright_text")).define("copyright_text", _copyright_text);
  main.variable(observer("census_collection")).define("census_collection", ["d3","FileAttachment","to_numeric","as_map","merge_car"], _census_collection);
  main.variable(observer("get_prop")).define("get_prop", ["map_settings"], _get_prop);
  main.variable(observer("as_map")).define("as_map", _as_map);
  main.variable(observer("to_numeric")).define("to_numeric", _to_numeric);
  main.variable(observer("merge_car")).define("merge_car", _merge_car);
  main.variable(observer()).define(["md"], _51);
  const child1 = runtime.module(define1);
  main.import("HatchTile45", child1);
  const child2 = runtime.module(define2);
  main.import("SvgScaleBar", child2);
  return main;
}
