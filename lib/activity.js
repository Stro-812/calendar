const ACTIVITY_URL = "https://s10.run/activity?aid=";

function formatDuration(seconds) {
  if (seconds == null) {
    return "";
  }

  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function formatPace(seconds) {
  if (seconds == null) {
    return "";
  }

  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function formatDistance(km) {
  if (km == null) {
    return "";
  }

  return Number.isInteger(km) ? `${km} км` : `${String(km).replace(".", ",")} км`;
}

export function extractMountPagePayload(html) {
  const marker = "mountPage('personalStatistics',";
  const start = html.indexOf(marker);
  if (start === -1) {
    throw new Error("mountPage payload not found");
  }

  const slice = html.slice(start + marker.length);
  let depth = 0;
  let jsonStart = -1;
  let jsonEnd = -1;

  for (let index = 0; index < slice.length; index += 1) {
    const char = slice[index];
    if (char === "{") {
      if (depth === 0) {
        jsonStart = index;
      }
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        jsonEnd = index + 1;
        break;
      }
    }
  }

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("mountPage object boundaries not found");
  }

  return JSON.parse(slice.slice(jsonStart, jsonEnd));
}

export function normalizeActivity(payload) {
  const fast = payload.track?.lapsmean?.fast;
  const slow = payload.track?.lapsmean?.slow;

  return {
    studentName: [payload.studentInfo?.firstName, payload.studentInfo?.lastName].filter(Boolean).join(" "),
    distance: payload.track?.distance ?? 0,
    pace: payload.track?.pace ?? "",
    bpm: payload.track?.bpm ?? 0,
    cadence: payload.track?.cadence ?? 0,
    impulse: payload.track?.impulse ?? 0,
    gs: payload.track?.gs ?? 0,
    trainerName: payload.task?.trainerInfo?.lastName ?? "",
    trainerComment: payload.task?.trainerComment ?? "",
    reportComment: payload.task?.reportComment ?? "",
    fast: fast
      ? {
          averageTime: formatDuration(fast.averageTime),
          averagePace: formatPace(fast.averagePace),
          standardDeviation: formatDuration(fast.standardDeviation),
          averageHR: fast.averageHR ?? 0,
          averageDistance: formatDistance(fast.averageDistance),
          count: fast.count ?? 0
        }
      : undefined,
    slow: slow
      ? {
          averageTime: formatDuration(slow.averageTime),
          averagePace: formatPace(slow.averagePace),
          standardDeviation: formatDuration(slow.standardDeviation),
          averageHR: slow.averageHR ?? 0,
          averageDistance: formatDistance(slow.averageDistance),
          count: slow.count ?? 0
        }
      : undefined
  };
}

export async function fetchActivityDetails(aid) {
  const response = await fetch(`${ACTIVITY_URL}${aid}`);
  if (!response.ok) {
    throw new Error(`Failed to load activity ${aid}`);
  }

  const html = await response.text();
  return normalizeActivity(extractMountPagePayload(html));
}
