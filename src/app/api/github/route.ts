import { NextResponse } from 'next/server';
import { 
  GitHubProfile, 
  GitHubRepo, 
  LanguageStat, 
  ContributionStreak, 
  GitHubEvent 
} from '@/types/github.types';

// In-memory Cache implementation (1 hour TTL)
interface CacheEntry {
  data: any;
  timestamp: number;
}
const localCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 3600 * 1000; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username')?.trim();

  // 1. Validate username
  const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  if (!username || !usernameRegex.test(username)) {
    return NextResponse.json(
      { 
        error: 'Invalid username', 
        message: 'The username provided is not a valid GitHub username.' 
      }, 
      { status: 400 }
    );
  }

  // 2. Validate GitHub Token exists
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { 
        error: 'Token missing', 
        message: 'GitHub GITHUB_TOKEN is not configured on the server. Please check your environment configuration.' 
      }, 
      { status: 500 }
    );
  }

  // Check cache first
  const cached = localCache[username.toLowerCase()];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Cache Hit] Returning cached GitHub data for username: ${username}`);
    return NextResponse.json(cached.data);
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`,
  };

  try {
    // 3. Fetch profile (REST) and repos (REST) in parallel
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers, next: { revalidate: 3600 } }),
    ]);

    // Handle profile errors
    if (profileRes.status === 404) {
      return NextResponse.json(
        { error: 'User not found', message: `GitHub user @${username} was not found.` }, 
        { status: 404 }
      );
    }
    if (profileRes.status === 403 || profileRes.status === 429) {
      return NextResponse.json(
        { error: 'API limit reached', message: 'GitHub API rate limit exceeded on user profile fetch.' }, 
        { status: profileRes.status }
      );
    }
    if (!profileRes.ok) {
      return NextResponse.json(
        { error: 'API error', message: `Failed to fetch profile: ${profileRes.statusText}` }, 
        { status: profileRes.status }
      );
    }

    // Handle repos errors
    if (reposRes.status === 403 || reposRes.status === 429) {
      return NextResponse.json(
        { error: 'API limit reached', message: 'GitHub API rate limit exceeded on repositories fetch.' }, 
        { status: reposRes.status }
      );
    }
    if (!reposRes.ok) {
      return NextResponse.json(
        { error: 'API error', message: `Failed to fetch repositories: ${reposRes.statusText}` }, 
        { status: reposRes.status }
      );
    }

    const rawProfile = await profileRes.json();
    const rawRepos = await reposRes.json();

    // Console log raw GitHub API response for debugging
    console.log('--- RAW PROFILE RESPONSE ---');
    console.log(JSON.stringify(rawProfile, null, 2));
    console.log('--- RAW REPOS RESPONSE (SAMPLE) ---');
    console.log(JSON.stringify(rawRepos.slice(0, 1), null, 2));

    // Validate REST response shapes
    if (!rawProfile || typeof rawProfile.login !== 'string') {
      throw new Error('Invalid profile data shape from GitHub REST API');
    }
    if (!Array.isArray(rawRepos)) {
      throw new Error('Invalid repositories data shape from GitHub REST API');
    }

    // Process repositories: Filter out forked repositories
    const ownedRepos = rawRepos.filter((r: any) => !r.fork);

    // Calculate total stars and total forks from user-owned repositories
    let totalStars = 0;
    let totalForks = 0;
    ownedRepos.forEach((r: any) => {
      totalStars += r.stargazers_count || 0;
      totalForks += r.forks_count || 0;
    });

    // Map to GitHubRepo type
    const topRepositories: GitHubRepo[] = [...ownedRepos]
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((r: any) => ({
        name: r.name,
        htmlUrl: r.html_url,
        description: r.description || null,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        language: r.language || null,
      }));

    // 4. Fetch contribution calendar and language bytes using GraphQL
    const graphqlQuery = `
      query($username: String!) {
        user(login: $username) {
          repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
            nodes {
              languages(first: 10) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalRepositoryContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const graphRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { username },
      }),
      next: { revalidate: 3600 },
    });

    if (graphRes.status === 403 || graphRes.status === 429) {
      return NextResponse.json(
        { error: 'API limit reached', message: 'GitHub API rate limit exceeded on GraphQL contribution request.' }, 
        { status: graphRes.status }
      );
    }
    if (!graphRes.ok) {
      return NextResponse.json(
        { error: 'API error', message: `GitHub GraphQL request failed: ${graphRes.statusText}` }, 
        { status: graphRes.status }
      );
    }

    const graphJson = await graphRes.json();
    console.log('--- RAW GRAPHQL RESPONSE ---');
    console.log(JSON.stringify(graphJson, null, 2));

    // Validate GraphQL Response
    if (graphJson.errors) {
      const errorMsg = graphJson.errors[0]?.message || 'GraphQL Query Error';
      if (errorMsg.includes('rate limit')) {
        return NextResponse.json(
          { error: 'API limit reached', message: 'GitHub GraphQL API rate limit reached.' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: 'API error', message: `GitHub GraphQL error: ${errorMsg}` },
        { status: 500 }
      );
    }

    const userObj = graphJson.data?.user;
    if (!userObj) {
      throw new Error('User data not found in GraphQL response');
    }

    // Process GraphQL Languages
    const languageMap: Record<string, { bytes: number; color: string }> = {};
    let totalLanguageBytes = 0;
    const reposNodes = userObj.repositories?.nodes || [];

    for (const repo of reposNodes) {
      const langEdges = repo.languages?.edges || [];
      for (const edge of langEdges) {
        const name = edge.node?.name;
        const color = edge.node?.color || '#cccccc';
        const size = edge.size || 0;
        if (name) {
          if (!languageMap[name]) {
            languageMap[name] = { bytes: 0, color };
          }
          languageMap[name].bytes += size;
          totalLanguageBytes += size;
        }
      }
    }

    const languages: LanguageStat[] = Object.entries(languageMap)
      .map(([name, info]) => ({
        name,
        bytes: info.bytes,
        color: info.color,
        percentage: totalLanguageBytes > 0 ? parseFloat(((info.bytes / totalLanguageBytes) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 8); // Return top 8 languages only

    // Process GraphQL Contribution Calendar & Streaks
    const calendar = userObj.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      throw new Error('Contribution calendar missing in GraphQL response');
    }

    const totalContributions = calendar.totalContributions || 0;
    const weeks = calendar.weeks || [];

    // Flatten weeks into daily array
    const days: Array<{ date: string; count: number }> = [];
    for (const week of weeks) {
      if (week.contributionDays) {
        for (const day of week.contributionDays) {
          days.push({
            date: day.date,
            count: day.contributionCount || 0,
          });
        }
      }
    }

    // Sort by date descending
    days.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate current streak
    let currentStreak = 0;
    if (days.length > 0) {
      if (days[0].count > 0) {
        // Today has contributions, streak is active starting today
        let count = 0;
        for (let i = 0; i < days.length; i++) {
          if (days[i].count > 0) {
            count++;
          } else {
            break;
          }
        }
        currentStreak = count;
      } else if (days.length > 1 && days[1].count > 0) {
        // Check if days[0] (today) and days[1] (yesterday) are consecutive days
        const d0 = new Date(days[0].date);
        const d1 = new Date(days[1].date);
        const diffTime = Math.abs(d0.getTime() - d1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          // Streak active starting yesterday
          let count = 0;
          for (let i = 1; i < days.length; i++) {
            if (days[i].count > 0) {
              count++;
            } else {
              break;
            }
          }
          currentStreak = count;
        }
      }
    }

    // Calculate longest streak using chronological order
    const chronologicalDays = [...days].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let longestStreak = 0;
    let tempStreak = 0;
    for (const d of chronologicalDays) {
      if (d.count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    const streak: ContributionStreak = {
      currentStreak,
      longestStreak,
      totalContributions,
      contributionYears: [new Date().getFullYear()],
    };

    // Calculate commits/PRs/issues/reposCreated
    const coll = userObj.contributionsCollection;
    const stats = {
      totalStars,
      totalForks,
      totalCommits: coll?.totalCommitContributions || 0,
      totalPRs: coll?.totalPullRequestContributions || 0,
      totalIssues: coll?.totalIssueContributions || 0,
      totalReposCreated: coll?.totalRepositoryContributions || ownedRepos.length,
    };

    // Map profile data
    const profile: GitHubProfile = {
      username: rawProfile.login,
      name: rawProfile.name || rawProfile.login,
      avatarUrl: rawProfile.avatar_url,
      bio: rawProfile.bio || 'Full stack developer',
      followers: rawProfile.followers || 0,
      following: rawProfile.following || 0,
      publicRepos: rawProfile.public_repos || 0,
      totalStars,
      totalForks,
      createdAt: rawProfile.created_at,
      location: rawProfile.location || null,
      blog: rawProfile.blog || null,
      company: rawProfile.company || null,
      twitterUsername: rawProfile.twitter_username || null,
    };

    // Aggregate everything into one clean structured object
    const aggregatedData = {
      profile,
      stats,
      languages,
      streak,
      topRepos: topRepositories,
      recentActivity: [] as GitHubEvent[], // Unused but part of interface
    };

    // Store in cache
    localCache[username.toLowerCase()] = {
      data: aggregatedData,
      timestamp: Date.now(),
    };

    return NextResponse.json(aggregatedData);
  } catch (error: any) {
    console.error('Error fetching aggregated GitHub stats:', error);
    return NextResponse.json(
      { 
        error: 'API error', 
        message: error.message || 'An unexpected error occurred while calling the GitHub API.' 
      }, 
      { status: 500 }
    );
  }
}
