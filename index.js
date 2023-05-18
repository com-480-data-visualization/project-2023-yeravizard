import drawAreaChart from '/plots/area_chart.js';
import drawSunburst from '/plots/sunburst.js';
import drawGroupStructures from '/plots/group_structures.js';
import drawRecruitment from '/plots/recruitment.js';
import drawRelAreaChart from '/plots/stacked_subRel.js';
import drawEthnonatAreaChart from '/plots/ethnonat_stacked.js';
import drawLeftAreaChart from '/plots/left_stacked.js';
import drawRightAreaChart from '/plots/right_stacked.js';
import drawSingleAreaChart from '/plots/single_stacked.js';



drawAreaChart();
drawRelAreaChart();
drawEthnonatAreaChart();
drawLeftAreaChart();
drawRightAreaChart();
drawSingleAreaChart();

drawSunburst();
drawGroupStructures();
drawRecruitment();

