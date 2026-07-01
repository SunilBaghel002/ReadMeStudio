import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    // 1. Fetch repositories
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers,
      next: { revalidate: 3600 }
    });

    if (!reposRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: reposRes.status });
    }

    const reposData: any[] = await reposRes.json();
    
    let totalStars = 0;
    let totalForks = 0;

    const reposList = reposData
      .filter((r: any) => !r.fork)
      .map((r: any) => {
        totalStars += r.stargazers_count || 0;
        totalForks += r.forks_count || 0;
        return {
          name: r.name,
          htmlUrl: r.html_url,
          description: r.description,
          stars: r.stargazers_count || 0,
          forks: r.forks_count || 0,
          language: r.language || null,
          size: r.size || 0,
        };
      });

    // Sort by stars descending
    const topRepos = [...reposList].sort((a, b) => b.stars - a.stars).slice(0, 10);

    // 2. Fetch language breakdown from top 10 repositories
    const aggregatedLanguages: Record<string, number> = {};
    let totalLanguageBytes = 0;

    // Use Promise.all with limitation or simple loop. Since it's only top 10, Promise.all is fast
    const langPromises = topRepos.map(async (repo) => {
      try {
        const langRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`, {
          headers,
          next: { revalidate: 3600 }
        });
        if (langRes.ok) {
          const langData: Record<string, number> = await langRes.json();
          return langData;
        }
      } catch (err) {
        console.warn(`Could not fetch languages for repo: ${repo.name}`, err);
      }
      return null;
    });

    const langResults = await Promise.all(langPromises);

    langResults.forEach((langData) => {
      if (langData) {
        Object.entries(langData).forEach(([langName, bytes]) => {
          aggregatedLanguages[langName] = (aggregatedLanguages[langName] || 0) + bytes;
          totalLanguageBytes += bytes;
        });
      }
    });

    // Fallback: If GraphQL/REST languages aggregation yielded 0 bytes (e.g. due to rate limits or empty repos),
    // calculate from the primary language of all repos list (using size as proxy)
    if (totalLanguageBytes === 0) {
      reposList.forEach((r) => {
        if (r.language) {
          const bytesProxy = (r.size || 1) * 1024;
          aggregatedLanguages[r.language] = (aggregatedLanguages[r.language] || 0) + bytesProxy;
          totalLanguageBytes += bytesProxy;
        }
      });
    }

    return NextResponse.json({
      repos: reposList,
      topRepos: topRepos.slice(0, 6), // Top 6 repos to show on UI
      totalStars,
      totalForks,
      languages: {
        bytesMap: aggregatedLanguages,
        totalBytes: totalLanguageBytes,
      }
    });
  } catch (error: any) {
    console.error('Error fetching repositories statistics:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
