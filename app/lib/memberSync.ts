import { getAppsScriptApiKey, getAppsScriptUrl } from "@/app/lib/appsScript";

interface MemberProfilePayload {
  userId: string;
  name: string;
  email: string;
  image?: string;
}

export async function syncMemberProfile(
  payload: MemberProfilePayload,
): Promise<void> {
  const scriptUrl = getAppsScriptUrl();
  const apiKey = getAppsScriptApiKey();

  if (!scriptUrl || !scriptUrl.startsWith("http") || !apiKey) {
    return;
  }

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        action: "upsertMember",
        apiKey,
        ...payload,
        lastLoginAt: new Date().toISOString(),
      }),
    });

    const response = (await res.json()) as { ok?: boolean; message?: string };
    if (!res.ok || !response.ok) {
      throw new Error(response.message || "Sync member gagal.");
    }
  } catch (error) {
    console.error("Gagal sinkronisasi member ke spreadsheet:", error);
  }
}

interface UpdateMemberUsernamePayload {
  userId: string;
  email: string;
  name: string;
}

export async function updateMemberUsername(
  payload: UpdateMemberUsernamePayload,
): Promise<void> {
  const scriptUrl = getAppsScriptUrl();
  const apiKey = getAppsScriptApiKey();

  if (!scriptUrl || !scriptUrl.startsWith("http") || !apiKey) {
    return;
  }

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        action: "updateMemberName",
        apiKey,
        ...payload,
        updatedAt: new Date().toISOString(),
      }),
    });

    const response = (await res.json()) as { ok?: boolean; message?: string };
    if (!res.ok || !response.ok) {
      throw new Error(response.message || "Update username gagal.");
    }
  } catch (error) {
    console.error("Gagal update username member ke spreadsheet:", error);
    throw error;
  }
}
