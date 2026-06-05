
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 旧排行榜
const OLD_URL = 'https://qmgfcirrgwzcmmyjnecn.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZ2ZjaXJyZ3d6Y21teWpuZWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMzY2NzQsImV4cCI6MjA4MzYxMjY3NH0.CU4roI0pWPHARNydPu_EeUBoz7G2dtxhw9InUFSBZ80';

// 新排行榜
const NEW_URL = 'https://mcjyuveyfgefdtyavygj.supabase.co';
const NEW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1janl1dmV5ZmdlZmR0eWF2eWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NjQyMjAsImV4cCI6MjA5NTI0MDIyMH0.-ZCKodHMGKUHLNURxm0ACp7wGhTPb4cPHTBHx07Wihc';

const STORAGE_KEY = 'bj8z_use_new_leaderboard';

const oldClient = createClient(OLD_URL, OLD_KEY);
const newClient = createClient(NEW_URL, NEW_KEY);

const getClient = (useNew: boolean): SupabaseClient => useNew ? newClient : oldClient;

export const getUseNewDb = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
};

export const setUseNewDb = (useNew: boolean) => {
  localStorage.setItem(STORAGE_KEY, String(useNew));
};

export interface LeaderboardEntry {
    id: string;
    created_at: string;
    player_name: string;
    score: number;
    challenge_id: string | null;
    difficulty: string;
    details: {
        title: string;
        rank: string;
    };
}

export const uploadScore = async (entry: Omit<LeaderboardEntry, 'id' | 'created_at'>, useNew: boolean) => {
    return await getClient(useNew).from('leaderboard').insert([entry]);
};

export const getLeaderboard = async (challengeId: string | null = null, limit = 50, offset = 0, useNew = false) => {
    const client = getClient(useNew);
    let query = client
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1);

    if (challengeId) {
        query = query.eq('challenge_id', challengeId);
    }

    return await query;
};

export const ALLOWED_RANKS = ['SSS', 'A', 'C', 'F', 'S', 'B'];
export const ALLOWED_TITLES = ['高中毕业生', '遗憾离场'];
export const MAX_LEADERBOARD_SCORE = 10000;

export const filterLeaderboardEntry = (e: any): boolean =>
    ALLOWED_RANKS.includes(e.details?.rank) &&
    ALLOWED_TITLES.includes(e.details?.title) &&
    e.score <= MAX_LEADERBOARD_SCORE;
