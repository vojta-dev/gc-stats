import type { VercelRequest, VercelResponse } from '@vercel/node';

// warning: kinda messy code

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const name = request.query.name;
  if (name === undefined) return response.status(400).json({ success: false, error: 'Undefined username' });

  let user: string;

  try {
    user = await (await fetch('https://project-gc.com/ProfileStats/' + name)).text();
  } catch (error) {
    return response.status(500).json({ success: false, error: 'Failed to fetch Project-gc user info' });
  }

  const id = user.match(/(?<=profileId: ')\d+(?=')/)?.[0];
  if (id === undefined) return response.status(500).json({ success: false, error: 'Undefined user id' });

  // last monday @ 0:00, can be also created with this code: (https://stackoverflow.com/a/46544455)
  // const now = new Date();
  // const llh = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (now.getUTCDay() || 7) + 1) / 1000;
  const llh = user.match(/(?<=llh: ')\d+(?=')/)?.[0];
  if (llh === undefined) return response.status(500).json({ success: false, error: 'Undefined llh' });

  let dtChart: string;

  try {
    dtChart = await (
      await fetch('https://project-gc.com/ajax/profilestats.php', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: new URLSearchParams({
          cmd: 'getmodule',
          module: 'dtchart',
          'params[profileId]': id,
          'params[llh]': llh,
        }),
      })
    ).text();
  } catch (error) {
    return response.status(500).json({ success: false, error: 'Failed to fetch Project-gc profile stats' });
  }

  const chart = dtChart.match(/(?<=<td.*?>)\d+|&nbsp;/g);
  const dtCombinations = dtChart.match(/(?<=<b>)\d+(?=<\/b> Diff)/)?.[0];
  if (chart === null || dtCombinations === undefined) return response.status(500).json({ success: false, error: 'Undefined D/T chart' });

  const chartArray = chart.slice(0, 81).map((element) => (element === '&nbsp;' ? 0 : parseInt(element)));

  const chart2d: number[][] = [];

  for (let i = 0; i < 9; i++) {
    chart2d.push(chartArray.splice(0, 9));
  }

  response.json({
    success: true,
    stats: {
      chart: { data: chart2d, combinations: parseInt(dtCombinations) },
    },
  });
}
