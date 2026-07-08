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
    totalStars: number;      // all owned repos incl. forks (matches shion.dev target)
    ownedStars: number;      // non-fork only, for breakdown in UI
    totalForks: number;
    totalCommits: number;
    lifetimeCommits: number;
    totalPRs: number;         // all-time, all states
    totalPRReviews: number;
    totalIssues: number;      // all-time, all states
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

  // 2. Fetch GraphQL data. Includes:
  //    - All-time PR/Issue totals (totalCount, all states) — Priority-1 fix
  //    - contributionYears so we can stitch a multi-year calendar for streaks
  //    - repositoriesContributedTo, per-repo languages, PR reviews
  const graphqlQuery = `
    query($username: String!, $cursor: String) {
      user(login: $username) {
        id
        createdAt
        pullRequests { totalCount }
        issues { totalCount }
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
          contributionYears
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

      // Honest zeros — do NOT fabricate contribution totals from repo count.
      // Better to under-report than to lie.
      userObj = {
        createdAt: rawProfile.created_at,
        pullRequests: { totalCount: 0 },
        issues: { totalCount: 0 },
        repositoriesContributedTo: { totalCount: 0 },
        contributionsCollection: {
          contributionYears: [],
          totalCommitContributions: 0,
          totalPullRequestContributions: 0,
          totalPullRequestReviewContributions: 0,
          totalIssueContributions: 0,
          totalRepositoryContributions: rawProfile.public_repos || 0,
          contributionCalendar: {
            totalContributions: 0,
            weeks: []
          }
        }
      };
    } catch (fallbackErr: any) {
      console.error(`[GitHub Fetcher] REST fallback failed:`, fallbackErr.message);
      throw new Error(`GitHub statistics fetch failed: GraphQL request failed (e.g. Bad Gateway) and REST fallback also failed.`);
    }
  }

  // ---- Stars: totalStars includes forks (matches shion.dev target of ~550).
  //       ownedStars is exposed separately so the UI can show a breakdown.
  const ownedRepos = reposNodes.filter((r: any) => !r.isFork);
  let totalStars = 0;    // all owned repos incl. forks
  let ownedStars = 0;    // non-fork only
  let totalForks = 0;
  for (const r of reposNodes) {
    totalStars += r.stargazerCount || 0;
    totalForks += r.forkCount || 0;
  }
  for (const r of ownedRepos) {
    ownedStars += r.stargazerCount || 0;
  }

  // Top repositories (by stars) — from owned non-fork repos.
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

  // ---- Multi-year contribution calendar.
  // GitHub's contributionsCollection defaults to the last 365 days, which was
  // producing wrong streak/total numbers for older accounts. Fetch every year
  // the user has contributed in via aliased sub-queries in one request, then
  // merge days across years using max-per-date (adjacent-year padding never
  // clobbers a real count).
  const contributionYears: number[] = userObj.contributionsCollection?.contributionYears || [];
  const byDate: Record<string, number> = {};
  let commitsAllYears = 0;
  let contributionsAllYears = 0;

  if (contributionYears.length > 0) {
    const years = [...contributionYears].sort((a, b) => a - b);
    const aliasBlocks = years.map((y) => {
      const from = `${y}-01-01T00:00:00Z`;
      const to = `${y}-12-31T23:59:59Z`;
      return `
        y${y}: contributionsCollection(from: "${from}", to: "${to}") {
          totalCommitContributions
          contributionCalendar {
            totalContributions
            weeks { contributionDays { contributionCount date } }
          }
        }`;
    }).join('\n');

    const multiYearQuery = `query($username: String!) { user(login: $username) { ${aliasBlocks} } }`;
    try {
      const myRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query: multiYearQuery, variables: { username: rawProfile.login } }),
        next: { revalidate: 3600 },
      });
      if (myRes.ok) {
        const myJson: any = await myRes.json();
        if (!myJson.errors) {
          const u = myJson.data?.user || {};
          for (const y of years) {
            const cc = u[`y${y}`];
            if (!cc) continue;
            commitsAllYears += cc.totalCommitContributions || 0;
            contributionsAllYears += cc.contributionCalendar?.totalContributions || 0;
            for (const w of cc.contributionCalendar?.weeks || []) {
              for (const d of w.contributionDays || []) {
                // Always record the date (even count=0) so streaks see real
                // gaps. Merge with max so an adjacent-year 0 never clobbers
                // a real count.
                const cur = d.contributionCount || 0;
                const prev = byDate[d.date];
                byDate[d.date] = prev === undefined ? cur : Math.max(prev, cur);
              }
            }
          }
        } else {
          console.warn('[GitHub Fetcher] multi-year GraphQL errors:', myJson.errors);
        }
      }
    } catch (err: any) {
      console.warn('[GitHub Fetcher] multi-year fetch failed:', err.message);
    }
  }

  // Fallback: if the multi-year fetch produced nothing, seed from the
  // last-365-day calendar we already have on userObj.
  if (Object.keys(byDate).length === 0) {
    const cal = userObj.contributionsCollection?.contributionCalendar;
    for (const w of cal?.weeks || []) {
      for (const d of w.contributionDays || []) {
        byDate[d.date] = d.contributionCount || 0;
      }
    }
    contributionsAllYears = cal?.totalContributions || 0;
    commitsAllYears = userObj.contributionsCollection?.totalCommitContributions || 0;
  }

  const lastYearCommits = userObj.contributionsCollection?.totalCommitContributions || 0;
  let lifetimeCommits = Math.max(commitsAllYears, lastYearCommits);

  // Streak calculation over the merged multi-year calendar, clipped to
  // [account creation, today] so future padding never counts.
  const createdAtDate = (userObj.createdAt || rawProfile.created_at || '').slice(0, 10);
  const todayISO = new Date().toISOString().slice(0, 10);
  const sortedDates = Object.keys(byDate)
    .filter((dt) => (!createdAtDate || dt >= createdAtDate) && dt <= todayISO)
    .sort(); // ascending YYYY-MM-DD lex == chronological

  let longestStreak = 0;
  let temp = 0;
  for (const dt of sortedDates) {
    if (byDate[dt] > 0) {
      temp++;
      if (temp > longestStreak) longestStreak = temp;
    } else {
      temp = 0;
    }
  }

  // Current streak: walk back from today. Today may still be ongoing (count 0)
  // so if the very last day is 0 we skip it and continue from the day before.
  let currentStreak = 0;
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const c = byDate[sortedDates[i]] || 0;
    if (c > 0) currentStreak++;
    else if (i === sortedDates.length - 1) continue; // today ongoing
    else break;
  }

  const streak: ContributionStreak = {
    currentStreak,
    longestStreak,
    totalContributions: contributionsAllYears,
    contributionYears: contributionYears.length ? contributionYears : [new Date().getFullYear()],
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

  // All-time PR / issue totals (all states). GraphQL totalCount on
  // user.pullRequests / user.issues is the field that matches shion.dev.
  const totalPRs = userObj.pullRequests?.totalCount
    ?? userObj.contributionsCollection?.totalPullRequestContributions
    ?? 0;
  const totalIssues = userObj.issues?.totalCount
    ?? userObj.contributionsCollection?.totalIssueContributions
    ?? 0;

  // Perform rank calculation on the corrected all-time values.
  const rankObj = calculateRank({
    commits: lifetimeCommits,
    prs: totalPRs,
    issues: totalIssues,
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
      ownedStars,
      totalForks,
      totalCommits: lastYearCommits,
      lifetimeCommits,
      totalPRs,
      totalPRReviews: userObj.contributionsCollection?.totalPullRequestReviewContributions || 0,
      totalIssues,
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
