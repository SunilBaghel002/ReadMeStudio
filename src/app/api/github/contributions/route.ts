import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;

  // Fallback mock data if token is not configured
  if (!token) {
    console.warn('GITHUB_TOKEN is missing. Returning mock contributions data.');
    return NextResponse.json(getMockContributions());
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
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
                weekday
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error(`GraphQL fetch failed with status ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
      throw new Error(json.errors[0]?.message || 'GraphQL Query Error');
    }

    const user = json.data?.user;
    if (!user) {
      throw new Error('User not found in GraphQL response');
    }

    const collection = user.contributionsCollection;
    const calendar = collection.contributionCalendar;

    // Flatten days
    const days: Array<{ date: string; count: number; weekday: number }> = [];
    let mostActiveDay = { date: '', count: 0 };

    calendar.weeks.forEach((week: any) => {
      if (week.contributionDays) {
        week.contributionDays.forEach((day: any) => {
          const count = day.contributionCount || 0;
          days.push({
            date: day.date,
            count,
            weekday: day.weekday,
          });

          if (count > mostActiveDay.count) {
            mostActiveDay = { date: day.date, count };
          }
        });
      }
    });

    // Sort chronologically
    days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < days.length; i++) {
      if (days[i].count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    // Determine current active streak
    let lastActiveIndex = -1;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) {
        lastActiveIndex = i;
        break;
      }
    }

    if (lastActiveIndex !== -1) {
      const lastActiveDay = days[lastActiveIndex];
      const lastActiveDate = new Date(lastActiveDay.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      lastActiveDate.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today.getTime() - lastActiveDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        let count = 0;
        for (let i = lastActiveIndex; i >= 0; i--) {
          if (days[i].count > 0) {
            count++;
          } else {
            break;
          }
        }
        currentStreak = count;
      }
    }

    return NextResponse.json({
      totalContributions: calendar.totalContributions || 0,
      commits: collection.totalCommitContributions || 0,
      prs: collection.totalPullRequestContributions || 0,
      issues: collection.totalIssueContributions || 0,
      reposCreated: collection.totalRepositoryContributions || 0,
      currentStreak,
      longestStreak,
      mostActiveDay,
    });
  } catch (error: any) {
    console.error('GraphQL Contributions Error:', error);
    return NextResponse.json(getMockContributions());
  }
}

function getMockContributions() {
  return {
    totalContributions: 624,
    commits: 498,
    prs: 84,
    issues: 31,
    reposCreated: 11,
    currentStreak: 18,
    longestStreak: 42,
    mostActiveDay: { date: new Date().toISOString().split('T')[0], count: 14 },
  };
}
