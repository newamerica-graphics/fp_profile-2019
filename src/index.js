import './index.scss';
import bubbleChart from './bubble-chart';

window.renderDataViz = function(el){
  if(el) bubbleChart(el);
}
