import type { DailyAnswer } from './daily-quiz';
export type LearnerUser = { id: string; name: string; email: string };
export type SavedProgress = {
  completedIds: string[];
  pathId: string;
  dailyAnswers: DailyAnswer[];
  completedDays: string[];
  streak: number;
};
export type SessionSnapshot = { user: LearnerUser; csrfToken: string; progress: SavedProgress };
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function accountRequest<T>(
  path: string,
  options: { body?: unknown; csrf?: string; signal?: AbortSignal } = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method: options.body === undefined ? 'GET' : 'POST',
      credentials: 'same-origin',
      headers: {
        ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(options.csrf ? { 'X-CSRF-Token': options.csrf } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal ?? AbortSignal.timeout(15000),
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new ApiError('Could not reach account saving. Check your connection and try again.', 0);
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail;
    throw new ApiError(
      typeof detail === 'string'
        ? detail
        : response.status === 422
          ? 'Check the form fields and try again.'
          : 'Account saving is unavailable. Please try again.',
      response.status,
    );
  }
  return data as T;
}
