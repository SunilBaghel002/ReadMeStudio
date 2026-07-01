import { NextResponse } from 'next/server';
import { fetchGitHubData } from '@/lib/githubFetcher';
import { buildStatsSVG } from '@/lib/svgBuilders';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username')?.trim();

  if (!username) {
    return new NextResponse('Username required', { status: 400 });
  }

  // Parse customization options
  const config = {
    theme: searchParams.get('theme') || 'github_dark',
    variant: searchParams.get('variant') || 'classic',
    hideBorder: searchParams.get('hide_border') === 'true',
    showIcons: searchParams.get('show_icons') !== 'false',
    showLabels: searchParams.get('show_labels') !== 'false',
    showIconDecorators: searchParams.get('show_icon_decorators') === 'true',
    compactMode: searchParams.get('compact_mode') === 'true',
    includeAllCommits: searchParams.get('include_all_commits') === 'true',
    includeForks: searchParams.get('include_forks') === 'true',
    hideRank: searchParams.get('hide_rank') === 'true',
    bgColor: searchParams.get('bg_color') ? `#${searchParams.get('bg_color')}` : undefined,
    titleColor: searchParams.get('title_color') ? `#${searchParams.get('title_color')}` : undefined,
    textColor: searchParams.get('text_color') ? `#${searchParams.get('text_color')}` : undefined,
    iconColor: searchParams.get('icon_color') ? `#${searchParams.get('icon_color')}` : undefined,
    borderColor: searchParams.get('border_color') ? `#${searchParams.get('border_color')}` : undefined,
    borderRadius: searchParams.get('border_radius') ? parseInt(searchParams.get('border_radius') || '12') : undefined,
  };

  try {
    const data = await fetchGitHubData(username);
    const svg = buildStatsSVG(data, config);
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error: any) {
    console.error('Error generating Stats SVG:', error);
    return new NextResponse(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="80"><text x="10" y="40" fill="red">${error.message || 'Error'}</text></svg>`, {
      headers: { 'Content-Type': 'image/svg+xml' },
      status: 500,
    });
  }
}
