import { ActivityDetails } from "../types";

const cache = new Map<string, ActivityDetails>();

export async function getActivityDetails(aid: string) {
  if (cache.has(aid)) {
    return cache.get(aid)!;
  }

  const response = await fetch(`/api/activity?aid=${encodeURIComponent(aid)}`);
  if (!response.ok) {
    throw new Error(`Failed to load activity ${aid}`);
  }

  const data = (await response.json()) as ActivityDetails;
  cache.set(aid, data);
  return data;
}
