import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/lib/memberSync", () => ({
  syncMemberProfile: vi.fn(),
}));

vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

import { authOptions } from "@/app/lib/auth";
import { syncMemberProfile } from "@/app/lib/memberSync";
import { getToken } from "next-auth/jwt";
import { proxy } from "@/proxy";

describe("auth callbacks", () => {
  it("syncs Google users during sign in", async () => {
    const result = await authOptions.callbacks?.signIn?.({
      user: {
        id: "u1",
        name: "Mom Rani",
        email: "mom@example.com",
        image: "avatar.png",
      },
      account: { provider: "google" },
    } as never);

    expect(result).toBe(true);
    expect(syncMemberProfile).toHaveBeenCalledWith({
      userId: "u1",
      name: "Mom Rani",
      email: "mom@example.com",
      image: "avatar.png",
    });
  });

  it("updates jwt and session names consistently", async () => {
    const token = await authOptions.callbacks?.jwt?.({
      token: { sub: "u1" },
      user: { name: "Nama Awal" },
    } as never);
    const updatedToken = await authOptions.callbacks?.jwt?.({
      token,
      trigger: "update",
      session: { name: "Nama Baru" },
    } as never);
    const session = await authOptions.callbacks?.session?.({
      session: { user: { name: "Lama" }, expires: "" },
      token: updatedToken,
    } as never);

    expect(updatedToken?.name).toBe("Nama Baru");
    expect(session?.user).toMatchObject({ id: "u1", name: "Nama Baru" });
  });
});

describe("proxy auth gate", () => {
  beforeEach(() => {
    vi.mocked(getToken).mockReset();
  });

  it("allows authenticated requests", async () => {
    vi.mocked(getToken).mockResolvedValue({ sub: "u1" } as never);

    const response = await proxy({
      url: "http://localhost/menu",
      nextUrl: { pathname: "/menu" },
    } as never);

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("redirects guests to login with callbackUrl", async () => {
    vi.mocked(getToken).mockResolvedValue(null);

    const response = await proxy({
      url: "http://localhost/menu/settings",
      nextUrl: { pathname: "/menu/settings" },
    } as never);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/login?callbackUrl=%2Fmenu%2Fsettings",
    );
  });
});
