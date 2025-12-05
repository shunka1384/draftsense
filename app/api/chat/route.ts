import { NextRequest } from 'next/server';

export const runtime = 'edge';

const NHL_PLAYER_STATS_URL = "https://api-web.nhle.com/v1/player";

async function getPlayerStats(name: string) {
  const searchRes = await fetch(`https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=1&q=${encodeURIComponent(name)}`);
  const search = await searchRes.json();
  if (!search?.[0]?.playerId) return null;

  const id = search[0].playerId;
  const res = await fetch(`${NHL_PLAYER_STATS_URL}/${id}/landing`);
  const data = await res.json();

  const current = data.currentSeasonStats?.regularSeason;
  if (!current) return null;

  return {
    name: data.firstName.default + " " + data.lastName.default,
    team: data.currentTeamAbbrev,
    sv: current.savePctg?.toFixed(3) || "N/A",
    gaa: current.goalsAgainstAverage?.toFixed(2) || "N/A",
    record: `${current.wins}-${current.losses}-${current.otLosses}`,
    gp: current.gamesPlayed,
  };
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // Simple keyword detection for goalie stats
  const lower = message.toLowerCase();
  if (lower.includes("save percentage") || lower.includes("sv%") || lower.includes("gaa") || lower.includes("record")) {
    const nameMatch = message.match(/(?:stuart skinner|juuse saros|connor hellebuyck|igor shesterkin|[a-z]+ [a-z]+)/i);
    if (nameMatch) {
      const stats = await getPlayerStats(nameMatch[0]);
      if (stats) {
        return Response.json({
          answer: `**${stats.name} (${stats.team})**\nSV%: ${stats.sv} · GAA: ${stats.gaa} · Record: ${stats.record}\nSolid volume goalie with current form.\n**Recommendation** Hold for wins\n**Edge → Hold** (80%)`
        });
      }
    }
  }

  // Fallback to Grok for everything else
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [{ role: 'user', content: message }],
      temperature: 0.3,
      max_tokens: 300
    })
  });

  const data = await response.json();
  return Response.json({ answer: data.choices[0].message.content });
}
