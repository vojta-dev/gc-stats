export function getHtml(stats: { chart: Chart }): string {
  let html = '<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 1rem;">';

  html += getChartHtml(stats.chart);

  html += '<small><a href="https://gcstats.vercel.app" style="color: #1d4ed8;">gcstats</a></small>';

  html += '</div>';

  return html;
}

export type Chart = { data: number[][]; combinations: number };

function getChartHtml(chart: Chart) {
  const getChartColor = (num: number): string => {
    if (num === 0) return '#374151'; // gray 700
    if (num < 5) return '#a78bfa'; // violet 400
    return '#22c55e'; // green 500
  };

  let html = '';

  html += '<table border="2" style="border-collapse: collapse; font-family: monospace; text-align: center; border-color: #7c3aed;">';

  html += `<tr>
    <td colspan="2" rowspan="2" style="font-size: 28px; cursor: help;" title="${chart.combinations} D/T combinations found, out of 81">${chart.combinations}</td>
    <th colspan="9" style="box-sizing: border-box; height: 40px;">T</th>
  </tr>`;

  html += '<tr style="height: 40px;">';

  for (let terrain = 1; terrain <= 5; terrain += 0.5) {
    html += `<th style="box-sizing: border-box; width: 40px;">${terrain}</th>`;
  }

  html += '</tr>';

  let difficulty = 1;

  for (const row of chart.data) {
    html += '<tr style="height: 40px">';

    if (difficulty === 1) {
      html += '<th rowspan="9" style="box-sizing: border-box; width: 40px;">D</th>';
    }

    html += `<th style="box-sizing: border-box; width: 40px;">${difficulty}</th>`;

    for (const num of row) {
      html += `<td style="color: white; background: ${getChartColor(num)};">${num}</td>`;
    }

    html += '</tr>';

    difficulty += 0.5;
  }

  html += '</table>';

  return html;
}
