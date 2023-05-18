import drawAreaChart from '{{site.baseurl}}/plots/area_chart.js';
import drawSunburst from '{{site.baseurl}}/plots/sunburst.js';
import drawGroupStructures from '{{site.baseurl}}/plots/group_structures.js';
import drawRecruitment from '{{site.baseurl}}/plots/recruitment.js';
import drawRelAreaChart from '{{site.baseurl}}/plots/stacked_subRel.js';
import drawEthnonatAreaChart from '{{site.baseurl}}/plots/ethnonat_stacked.js';
import drawLeftAreaChart from '{{site.baseurl}}/plots/left_stacked.js';
import drawRightAreaChart from '{{site.baseurl}}/plots/right_stacked.js';
import drawSingleAreaChart from '{{site.baseurl}}/plots/single_stacked.js';



drawAreaChart();
drawRelAreaChart();
drawEthnonatAreaChart();
drawLeftAreaChart();
drawRightAreaChart();
drawSingleAreaChart();

drawSunburst();
drawGroupStructures();
drawRecruitment();

