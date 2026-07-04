import { 
  GitHubProfile, 
  GitHubRepo, 
  LanguageStat, 
  ContributionStreak, 
  GitHubEvent, 
  GitHubStatsData 
} from '@/types/github.types';

// Analytical Rank Calculation
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.39894228 * Math.exp(-z * z / 2);
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z >= 0 ? 1 - p : p;
}

export function calculateRank(stats: {
  commits: number;
  prs: number;
  issues: number;
  stars: number;
  followers: number;
  repos: number;
}) {
  const score = (stats.commits * 2) + 
                (stats.prs * 3) + 
                (stats.issues * 1) + 
                (stats.stars * 4) + 
                (stats.followers * 2) + 
                (stats.repos * 1);

  // Log-normal distribution parameters representing all Github users
  const logScore = Math.log(score || 1);
  const mu = 6.9;
  const sigma = 1.39;
  const z = (logScore - mu) / sigma;
  const percentile = (1 - normalCDF(z)) * 100; // Returns 0 to 100

  let grade = 'C';
  if (percentile <= 1.0) grade = 'S';
  else if (percentile <= 12.5) grade = 'A+';
  else if (percentile <= 25.0) grade = 'A';
  else if (percentile <= 37.5) grade = 'A-';
  else if (percentile <= 50.0) grade = 'B+';
  else if (percentile <= 62.5) grade = 'B';
  else if (percentile <= 75.0) grade = 'C+';
  else grade = 'C';

  return { score, percentile, grade };
}

// Cached Aggregate Data shape
export interface ExtendedGitHubData extends GitHubStatsData {
  rawReposData: any[]; // cached raw repos for filtering forks on the fly
  stats: {
    totalStars: number;
    totalForks: number;
    totalCommits: number;
    lifetimeCommits: number;
    totalPRs: number;
    totalPRReviews: number; // added
    totalIssues: number;
    totalReposCreated: number;
    contributedTo: number;
    score: number;
    percentile: number;
    rankGrade: string;
  };
}

// Cache implementation (1 hour TTL)
interface CacheEntry {
  data: ExtendedGitHubData;
  timestamp: number;
}
const localCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 3600 * 1000; // 1 hour

export async function fetchGitHubData(username: string): Promise<ExtendedGitHubData> {
  const cacheKey = username.toLowerCase();
  const cached = localCache[cacheKey];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Cache Hit] Returning cached GitHub data for: ${username}`);
    return cached.data;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN is not configured on the server.');
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`,
  };

  // 1. Fetch REST Profile
  const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 } });
  if (profileRes.status === 404) {
    throw new Error(`GitHub user @${username} was not found.`);
  }
  if (!profileRes.ok) {
    throw new Error(`Failed to fetch profile: ${profileRes.statusText}`);
  }

  const rawProfile = await profileRes.json();
  const userNodeId = rawProfile.node_id;

  // 2. Fetch GraphQL data (with ContributedTo, PR reviews, and isFork repo flag, without heavy nested default branch commits traversal)
  const graphqlQuery = `
    query($username: String!, $cursor: String) {
      user(login: $username) {
        id
        repositoriesContributedTo(contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, PULL_REQUEST_REVIEW]) {
          totalCount
        }
        repositories(ownerAffiliations: OWNER, first: 100, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            name
            isFork
            forkCount
            stargazerCount
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
          totalPullRequestReviewContributions
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

  let userObj: any = null;
  let reposNodes: any[] = [];
  let graphQLSuccess = false;
  let cursor: string | null = null;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const graphRes: Response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: graphqlQuery,
          variables: { username: rawProfile.login, cursor },
        }),
        next: { revalidate: 3600 },
      });

      if (graphRes.ok) {
        const graphJson: any = await graphRes.json();
        if (!graphJson.errors) {
          const pageUserObj: any = graphJson.data?.user;
          if (pageUserObj) {
            if (!userObj) {
              userObj = pageUserObj;
            }
            const nodes = pageUserObj.repositories?.nodes || [];
            reposNodes.push(...nodes);
            
            hasNextPage = pageUserObj.repositories?.pageInfo?.hasNextPage || false;
            cursor = pageUserObj.repositories?.pageInfo?.endCursor || null;
            graphQLSuccess = true;
          } else {
            break;
          }
        } else {
          console.warn(`[GitHub Fetcher] GraphQL query errors:`, graphJson.errors);
          break;
        }
      } else {
        console.warn(`[GitHub Fetcher] GraphQL status failed: ${graphRes.status} ${graphRes.statusText}`);
        break;
      }
    }
  } catch (err: any) {
    console.warn(`[GitHub Fetcher] GraphQL network/Bad Gateway failed: ${err.message}. Running REST fallback...`);
  }

  if (!graphQLSuccess) {
    try {
      console.log(`[GitHub Fetcher] Fetching fallback repos via REST for: ${username}`);
      let page = 1;
      let rawRepos: any[] = [];
      while (true) {
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`, { 
          headers, 
          next: { revalidate: 3600 } 
        });
        if (!reposRes.ok) {
          throw new Error(`REST repositories query failed with status: ${reposRes.status}`);
        }
        const pageData = await reposRes.json();
        rawRepos.push(...pageData);
        if (pageData.length < 100) break;
        page++;
      }
      
      reposNodes = rawRepos.map((r: any) => ({
        name: r.name,
        isFork: r.fork,
        forkCount: r.forks_count,
        stargazerCount: r.stargazers_count,
        languages: {
          edges: r.language ? [{
            size: 10000,
            node: {
              name: r.language,
              color: '#cccccc'
            }
          }] : []
        }
      }));

      userObj = {
        repositoriesContributedTo: { totalCount: 0 },
        contributionsCollection: {
          totalCommitContributions: 0,
          totalPullRequestContributions: 0,
          totalPullRequestReviewContributions: 0,
          totalIssueContributions: 0,
          totalRepositoryContributions: rawProfile.public_repos || 0,
          contributionCalendar: {
            totalContributions: (rawProfile.public_repos || 0) * 12,
            weeks: []
          }
        }
      };
    } catch (fallbackErr: any) {
      console.error(`[GitHub Fetcher] REST fallback failed:`, fallbackErr.message);
      throw new Error(`GitHub statistics fetch failed: GraphQL request failed (e.g. Bad Gateway) and REST fallback also failed.`);
    }
  }

  // Sort and process default non-fork stats
  const ownedRepos = reposNodes.filter((r: any) => !r.isFork);
  let totalStars = 0;
  let totalForks = 0;
  ownedRepos.forEach((r: any) => {
    totalStars += r.stargazerCount || 0;
    totalForks += r.forkCount || 0;
  });

  // Top repositories (by stars)
  const topRepositories: GitHubRepo[] = [...ownedRepos]
    .sort((a: any, b: any) => b.stargazerCount - a.stargazerCount)
    .slice(0, 6)
    .map((r: any) => ({
      name: r.name,
      htmlUrl: `https://github.com/${username}/${r.name}`,
      description: null,
      stars: r.stargazerCount || 0,
      forks: r.forkCount || 0,
      language: r.languages?.edges?.[0]?.node?.name || null,
    }));

  const lastYearCommits = userObj.contributionsCollection?.totalCommitContributions || 0;

  // Fetch lifetime commits from Commit Search API (fast, handles public commits across all repos)
  let lifetimeCommits = lastYearCommits;
  try {
    console.log(`[GitHub Fetcher] Fetching lifetime commits via Search API for: ${username}`);
    const commitsSearchRes = await fetch(`https://api.github.com/search/commits?q=author:${rawProfile.login}`, {
      headers: {
        ...headers,
        Accept: 'application/vnd.github.cloak-preview+json',
      },
      next: { revalidate: 3600 }
    });
    if (commitsSearchRes.ok) {
      const searchJson = await commitsSearchRes.json();
      if (searchJson.total_count !== undefined) {
        lifetimeCommits = searchJson.total_count;
      }
    }
  } catch (searchErr: any) {
    console.warn(`[GitHub Fetcher] Commit search failed: ${searchErr.message}. Defaulting to calendar contributions.`);
  }

  if (lifetimeCommits < lastYearCommits) {
    lifetimeCommits = lastYearCommits;
  }

  // Process Calendar and Streaks
  const calendar = userObj.contributionsCollection?.contributionCalendar;
  const totalContributions = calendar?.totalContributions || 0;
  const weeks = calendar?.weeks || [];
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

  days.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let currentStreak = 0;
  if (days.length > 0) {
    if (days[0].count > 0) {
      let count = 0;
      for (let i = 0; i < days.length; i++) {
        if (days[i].count > 0) count++;
        else break;
      }
      currentStreak = count;
    } else if (days.length > 1 && days[1].count > 0) {
      const d0 = new Date(days[0].date);
      const d1 = new Date(days[1].date);
      const diffTime = Math.abs(d0.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        let count = 0;
        for (let i = 1; i < days.length; i++) {
          if (days[i].count > 0) count++;
          else break;
        }
        currentStreak = count;
      }
    }
  }

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

  const contributedTo = userObj.repositoriesContributedTo?.totalCount || 0;
  const followers = rawProfile.followers || 0;
  const publicRepos = rawProfile.public_repos || ownedRepos.length;

  // Calculate languages from owned repos by default
  const languageMap: Record<string, { bytes: number; color: string }> = {};
  let totalLanguageBytes = 0;
  for (const repo of ownedRepos) {
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
    .sort((a, b) => b.bytes - a.bytes);

  // Perform rank calculation
  const rankObj = calculateRank({
    commits: lifetimeCommits,
    prs: userObj.contributionsCollection?.totalPullRequestContributions || 0,
    issues: userObj.contributionsCollection?.totalIssueContributions || 0,
    stars: totalStars,
    followers: followers,
    repos: publicRepos,
  });

  const profile: GitHubProfile = {
    username: rawProfile.login,
    name: rawProfile.name || rawProfile.login,
    avatarUrl: rawProfile.avatar_url,
    bio: rawProfile.bio || 'Full stack developer',
    followers: followers,
    following: rawProfile.following || 0,
    publicRepos: publicRepos,
    totalStars,
    totalForks,
    createdAt: rawProfile.created_at,
    location: rawProfile.location || null,
    blog: rawProfile.blog || null,
    company: rawProfile.company || null,
    twitterUsername: rawProfile.twitter_username || null,
  };

  const aggregatedData: ExtendedGitHubData = {
    profile,
    stats: {
      totalStars,
      totalForks,
      totalCommits: lastYearCommits,
      lifetimeCommits,
      totalPRs: userObj.contributionsCollection?.totalPullRequestContributions || 0,
      totalPRReviews: userObj.contributionsCollection?.totalPullRequestReviewContributions || 0,
      totalIssues: userObj.contributionsCollection?.totalIssueContributions || 0,
      totalReposCreated: publicRepos,
      contributedTo,
      score: rankObj.score,
      percentile: parseFloat(rankObj.percentile.toFixed(2)),
      rankGrade: rankObj.grade,
    },
    languages,
    streak,
    topRepos: topRepositories,
    recentActivity: [] as GitHubEvent[],
    rawReposData: reposNodes, // Cache all repos (forked + owned)
  };

  localCache[cacheKey] = {
    data: aggregatedData,
    timestamp: Date.now(),
  };

  return aggregatedData;
}
