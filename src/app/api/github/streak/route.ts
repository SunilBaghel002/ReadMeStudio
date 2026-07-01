import { NextResponse } from 'next/server';
import { fetchGitHubData } from '@/lib/githubFetcher';
import { buildStreakSVG } from '@/lib/svgBuilders';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username')?.trim();

  if (!username) {
    return new NextResponse('Username required', { status: 400 });
  }

  const config = {
    theme: searchParams.get('theme') || 'github_dark',
    variant: searchParams.get('variant') || 'classic',
    hideBorder: searchParams.get('hide_border') === 'true',
    showFireIcon: searchParams.get('show_fire_icon') !== 'false',
    showDateRanges: searchParams.get('show_date_ranges') !== 'false',
    showLabels: searchParams.get('show_labels') !== 'false',
    compactMode: searchParams.get('compact_mode') === 'true',
    flameStyle: searchParams.get('flame_style') || 'fire',
    alignment: searchParams.get('alignment') || 'center',
    circleStyle: searchParams.get('circle_style') || 'filled',
    bgColor: searchParams.get('bg_color') ? `#${searchParams.get('bg_color')}` : undefined,
    borderColor: searchParams.get('border_color') ? `#${searchParams.get('border_color')}` : undefined,
    fireColor: searchParams.get('fire_color') ? `#${searchParams.get('fire_color')}` : undefined,
    ringColor: searchParams.get('ring_color') ? `#${searchParams.get('ring_color')}` : undefined,
    strokeColor: searchParams.get('stroke_color') ? `#${searchParams.get('stroke_color')}` : undefined,
    textColor: searchParams.get('text_color') ? `#${searchParams.get('text_color')}` : undefined,
    borderRadius: searchParams.get('border_radius') ? parseInt(searchParams.get('border_radius') || '12') : undefined,
  };

  try {
    const data = await fetchGitHubData(username);
    const svg = buildStreakSVG(data, config);
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error: any) {
    console.error('Error generating Streak SVG:', error);
    return new NextResponse(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="80"><text x="10" y="40" fill="red">${error.message || 'Error'}</text></svg>`, {
      headers: { 'Content-Type': 'image/svg+xml' },
      status: 500,
    });
  }
}
