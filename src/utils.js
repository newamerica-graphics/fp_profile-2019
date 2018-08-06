import * as d3 from 'd3';

export const Pack = (width, height) => (
  data => {
    let alt = d3.median(data, d => d.value);
    if (!alt) alt = 1;
    return d3.pack()
      .size([width, height])
        .padding(3)
      (d3.hierarchy({children: data})
        .sum(d => isNaN(d.value) ? alt : d.value));
  }
);

export function fit(text, value) {
  let line;
  let lineWidth0 = Infinity;
  const lineHeight = 12;
  const targetWidth = Math.sqrt(measureWidth(text.trim()) * lineHeight);
  const words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
  if (!words[words.length - 1]) words.pop();
  if (!words[0]) words.shift();
  const lines = [];
  for (let i = 0, n = words.length; i < n; ++i) {
    let lineText1 = (line ? line.text + " " : "") + words[i];
    let lineWidth1 = measureWidth(lineText1);
    if ((lineWidth0 + lineWidth1) * .4 < targetWidth) {
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
    const dx = lines[i].width / 2;
    radius = Math.max(radius, Math.sqrt(dx ** 2 + dy ** 2));
  }
  return {lines, radius};
}

export const format = d3.format(",d")

export const measureWidth = () => {
  const context = document.createElement("canvas").getContext("2d");
  return text => context.measureText(text).width;
}