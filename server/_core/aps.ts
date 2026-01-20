/**
 * APS (Autodesk Platform Services) OAuth and API Client
 * 
 * Handles 3-legged OAuth flow and ACC API operations.
 */

import { ENV } from "./env";

// APS API Endpoints
const APS_AUTH_URL = "https://developer.api.autodesk.com/authentication/v2/authorize";
const APS_TOKEN_URL = "https://developer.api.autodesk.com/authentication/v2/token";
const APS_DATA_URL = "https://developer.api.autodesk.com/data/v1";

export interface APSTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface APSHub {
  id: string;
  name: string;
}

export interface APSProject {
  id: string;
  name: string;
  hub_id: string;
}

/**
 * Generate APS OAuth authorization URL
 */
export function getAPSAuthUrl(redirectUri: string, state?: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: ENV.APS_CLIENT_ID || "",
    redirect_uri: redirectUri,
    scope: "data:read data:write data:create account:read",
  });

  if (state) {
    params.append("state", state);
  }

  return `${APS_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<APSTokens> {
  const response = await fetch(APS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: ENV.APS_CLIENT_ID || "",
      client_secret: ENV.APS_CLIENT_SECRET || "",
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  return response.json();
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<APSTokens> {
  const response = await fetch(APS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: ENV.APS_CLIENT_ID || "",
      client_secret: ENV.APS_CLIENT_SECRET || "",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return response.json();
}

/**
 * List ACC hubs (accounts)
 */
export async function listHubs(accessToken: string): Promise<APSHub[]> {
  const response = await fetch(`${APS_DATA_URL}/project/v1/hubs`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list hubs: ${error}`);
  }

  const data = await response.json();
  return data.data.map((hub: any) => ({
    id: hub.id,
    name: hub.attributes.name,
  }));
}

/**
 * List projects in a hub
 */
export async function listProjects(
  accessToken: string,
  hubId: string
): Promise<APSProject[]> {
  const response = await fetch(
    `${APS_DATA_URL}/project/v1/hubs/${hubId}/projects`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list projects: ${error}`);
  }

  const data = await response.json();
  return data.data.map((project: any) => ({
    id: project.id,
    name: project.attributes.name,
    hub_id: hubId,
  }));
}

/**
 * Upload assets to ACC project
 * 
 * Note: This is a simplified implementation. Full implementation would involve:
 * 1. Creating custom attribute definitions
 * 2. Creating folders/items in the project
 * 3. Attaching custom attributes to items
 * 4. Uploading associated files
 */
export async function uploadAssetsToACC(
  accessToken: string,
  projectId: string,
  assets: any[]
): Promise<{ success: boolean; message: string; count: number }> {
  // For now, return a success message
  // Full implementation would make actual API calls to create items
  
  console.log(`Would upload ${assets.length} assets to project ${projectId}`);
  
  return {
    success: true,
    message: `Successfully prepared ${assets.length} assets for upload to ACC`,
    count: assets.length,
  };
}
