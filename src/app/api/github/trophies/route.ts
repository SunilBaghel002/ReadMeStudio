import { NextResponse } from 'next/server';
import { fetchGitHubData } from '@/lib/githubFetcher';
import { buildTrophiesSVG } from '@/lib/svgBuilders';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username')?.trim();

  if (!username) {
    return new NextResponse('Username required', { status: 400 });
  }

  const selectedTrophyParam = searchParams.get('selected_trophies') || searchParams.get('title');
  const selectedTrophies = selectedTrophyParam ? selectedTrophyParam.split(',') : [];

  const config = {
    theme: searchParams.get('theme') || 'github_dark',
    variant: searchParams.get('variant') || 'classic',
    noBg: searchParams.get('no_bg') === 'true',
    noFrame: searchParams.get('no_frame') === 'true',
    columnCount: searchParams.get('column_count') ? parseInt(searchParams.get('column_count') || '3') : 3,
    marginW: searchParams.get('margin_w') ? parseInt(searchParams.get('margin_w') || '0') : 0,
    marginH: searchParams.get('margin_h') ? parseInt(searchParams.get('margin_h') || '0') : 0,
    rankFilter: searchParams.get('rank_filter') || searchParams.get('rank') || '',
    selectedTrophies: selectedTrophies,
    limitTrophiesCount: searchParams.get('limit_trophies_count') ? parseInt(searchParams.get('limit_trophies_count') || '0') : undefined,
    showProgress: searchParams.get('show_progress') !== 'false',
    showNextRank: searchParams.get('show_next_rank') !== 'false',
    trophyStyle: searchParams.get('trophy_style') || '3d',
    showCategoryLabels: searchParams.get('show_category_labels') !== 'false',
    compactMode: searchParams.get('compact_mode') === 'true',
    animateHover: searchParams.get('animate_hover') === 'true',
    includeUnranked: searchParams.get('include_unranked') !== 'false',
    includeForks: searchParams.get('include_forks') === 'true',
    includeAllCommits: searchParams.get('include_all_commits') === 'true',
  };

  try {
    const data = await fetchGitHubData(username);
    const svg = buildTrophiesSVG(data, config);
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error: any) {
    console.error('Error generating Trophies SVG:', error);
    return new NextResponse(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="80"><text x="10" y="40" fill="red">${error.message || 'Error'}</text></svg>`, {
      headers: { 'Content-Type': 'image/svg+xml' },
      status: 500,
    });
  }
}
