import { NextResponse } from 'next/server';
import { fetchGitHubData } from '@/lib/githubFetcher';

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

  try {
    const data = await fetchGitHubData(username);
    return NextResponse.json(data);
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
