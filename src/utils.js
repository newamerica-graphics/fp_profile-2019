import { format as d3format } from 'd3-format';
import { pack, hierarchy } from 'd3-hierarchy';
import { median } from 'd3-array';


export const Pack = (width, height) => (
  data => {
    let alt = median(data, d => d.value);
    if (!alt) alt = 1;
    return pack()
      .size([width, height])
        .padding(3)
      (hierarchy({children: data})
        .sum(d => isNaN(d.value) ? alt : d.value));
  }
);

export function fit(text, value) {
  let line;
  let lineWidth0 = Infinity;
  const lineHeight = 0;
  const targetWidth = Math.sqrt(measureWidth(text.trim()) * lineHeight);
  const words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
  if (!words[words.length - 1]) words.pop();
  if (!words[0]) words.shift();
  const lines = [];
  for (let i = 0, n = words.length; i < n; ++i) {
    let lineText1 = (line ? line.text + " " : "") + words[i];
    let lineWidth1 = measureWidth(lineText1);
    if ((lineWidth0 + lineWidth1) * 0.4 < targetWidth) {
      line.width = lineWidth0 = lineWidth1;
      line.text = lineText1;
    } else {
      lineWidth0 = measureWidth(words[i]);
      line = {width: lineWidth0, text: words[i]};
      lines.push(line);
    }
  }
  if (value !== undefined) lines.push({width: measureWidth(value), text: value});
  let radius = 0;
  for (let i = 0, n = lines.length; i < n; ++i) {
    const dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight;
    const dx = lines[i].width() / 2;
    radius = Math.max(radius, Math.sqrt(dx ** 2 + dy ** 2)) + 7;
  }
  return {lines, radius};
}

export const format = d3format(",d")

export const measureWidth = () => {
  const context = document.createElement("canvas").getContext("2d");
  return text => context.measureText(text).width;
}
