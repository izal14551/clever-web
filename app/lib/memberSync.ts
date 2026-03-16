import { getAppsScriptUrl } from "@/app/lib/appsScript";

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

  if (!scriptUrl || !scriptUrl.startsWith("http")) {
    return;
  }

  try {
    await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        action: "upsertMember",
        ...payload,
        lastLoginAt: new Date().toISOString(),
      }),
    });
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

  if (!scriptUrl || !scriptUrl.startsWith("http")) {
    return;
  }

  try {
    await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        action: "updateMemberName",
        ...payload,
        updatedAt: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Gagal update username member ke spreadsheet:", error);
  }
}
