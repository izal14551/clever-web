export function getAppsScriptUrl(): string {
  return process.env.APPS_SCRIPT_URL ?? "";
}

export function hasAppsScriptUrl(): boolean {
  return getAppsScriptUrl().startsWith("http");
}

export function buildAppsScriptUrl(
  params?: Record<string, string | number | null | undefined>,
): URL | null {
  const baseUrl = getAppsScriptUrl();

  if (!baseUrl.startsWith("http")) {
    return null;
  }

  const url = new URL(baseUrl);

  if (!params) {
    return url;
  }

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url;
}
