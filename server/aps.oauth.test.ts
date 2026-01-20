/**
 * Test APS OAuth configuration and flow
 */
import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";
import { getAPSAuthUrl } from "./_core/aps";

describe("APS OAuth Configuration", () => {
  it("should have APS_CLIENT_ID configured", () => {
    expect(ENV.APS_CLIENT_ID).toBeTruthy();
    expect(ENV.APS_CLIENT_ID.length).toBeGreaterThan(10);
  });

  it("should have APS_CLIENT_SECRET configured", () => {
    expect(ENV.APS_CLIENT_SECRET).toBeTruthy();
    expect(ENV.APS_CLIENT_SECRET.length).toBeGreaterThan(10);
  });

  it("should generate valid OAuth authorization URL", () => {
    const redirectUri = "http://localhost:3000/api/acc/oauth/callback";
    const authUrl = getAPSAuthUrl(redirectUri);

    expect(authUrl).toContain("https://developer.api.autodesk.com/authentication/v2/authorize");
    expect(authUrl).toContain(`client_id=${ENV.APS_CLIENT_ID}`);
    expect(authUrl).toContain("response_type=code");
    expect(authUrl).toContain("scope=data%3Aread");
    expect(authUrl).toContain("redirect_uri=");
  });

  it("should include required scopes for ACC Assets API", () => {
    const redirectUri = "http://localhost:3000/api/acc/oauth/callback";
    const authUrl = getAPSAuthUrl(redirectUri);

    // Required scopes for ACC Assets API: data:read, data:write, data:create
    expect(authUrl).toContain("data%3Aread"); // data:read
    expect(authUrl).toContain("data%3Awrite"); // data:write
    expect(authUrl).toContain("data%3Acreate"); // data:create
    expect(authUrl).toContain("account%3Aread"); // account:read for listing hubs
  });
});
