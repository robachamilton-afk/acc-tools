import { ENV } from './env';
import fs from 'fs';

// Debug log file
const DEBUG_LOG = '/tmp/acc-upload-debug.log';
function debugLog(message: string) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  console.log(message);
  try {
    fs.appendFileSync(DEBUG_LOG, logLine);
  } catch (e) {
    // Ignore file write errors
  }
}

const APS_AUTH_URL = "https://developer.api.autodesk.com/authentication/v2";
const APS_DATA_URL = "https://developer.api.autodesk.com";
const APS_ACC_URL_V1 = "https://developer.api.autodesk.com/construction/assets/v1";
const APS_ACC_URL_V2 = "https://developer.api.autodesk.com/construction/assets/v2";
const APS_LOCATIONS_URL = "https://developer.api.autodesk.com/construction/locations/v2";

export interface APSTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
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

export interface APSCategory {
  id: string;
  name: string;
  statusSetId?: string;
  isRoot?: boolean;
  isLeaf?: boolean;
}

export interface APSAsset {
  clientAssetId: string;
  categoryId: string;
  statusId: string;
  description?: string;
  locationId?: string;
  barcode?: string;
  customAttributes?: Record<string, any>;
}

export interface APSLocation {
  id: string;
  parentId: string | null;
  type: string;
  name: string;
  description?: string | null;
  barcode?: string | null;
  order: number;
}

export interface APSUploadProgress {
  total: number;
  uploaded: number;
  failed: number;
  currentBatch: number;
  totalBatches: number;
}

/**
 * Get APS OAuth authorization URL
 */
export function getAPSAuthUrl(redirectUri: string, state?: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: ENV.APS_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "data:read data:write data:create account:read",
  });

  if (state) {
    params.append("state", state);
  }

  return `${APS_AUTH_URL}/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<APSTokenResponse> {
  const response = await fetch(`${APS_AUTH_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: ENV.APS_CLIENT_ID,
      client_secret: ENV.APS_CLIENT_SECRET,
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
 * List asset categories in a project
 */
export async function listCategories(
  accessToken: string,
  projectId: string
): Promise<APSCategory[]> {
    const response = await fetch(`${APS_ACC_URL_V1}/projects/${projectId}/categories`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list categories: ${error}`);
  }

  const data = await response.json();
  return data.results.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    statusSetId: cat.statusSetId,
    isRoot: cat.isRoot,
    isLeaf: cat.isLeaf,
  }));
}

/**
 * Get default status for a category
 */
export async function getCategoryDefaultStatus(
  accessToken: string,
  projectId: string,
  categoryId: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `${APS_ACC_URL_V1}/projects/${projectId}/categories/${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    // Return the first status ID from the status set
    return data.statusSetId || null;
  } catch (error) {
    console.error("Failed to get category default status:", error);
    return null;
  }
}

/**
 * Get all location nodes in a project's location tree
 */
export async function listLocations(
  accessToken: string,
  projectId: string
): Promise<APSLocation[]> {
  try {
    // Strip 'b.' prefix if present (BIM 360 project IDs)
    const cleanProjectId = projectId.startsWith('b.') ? projectId.substring(2) : projectId;
    console.log(`[Locations API] Listing locations for project: ${projectId} (clean: ${cleanProjectId})`);
    
    const response = await fetch(
      `${APS_LOCATIONS_URL}/projects/${cleanProjectId}/trees/default/nodes`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`[Locations API] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Locations API] Error response: ${errorText}`);
      throw new Error(`Failed to list locations: ${errorText}`);
    }

    const data = await response.json();
    console.log(`[Locations API] Found ${data.results?.length || 0} location nodes`);
    return data.results || [];
  } catch (error) {
    console.error("Failed to list locations:", error);
    throw error;
  }
}

/**
 * Create a new location node in the project's location tree
 */
export async function createLocation(
  accessToken: string,
  projectId: string,
  parentId: string,
  name: string,
  barcode?: string
): Promise<APSLocation> {
  try {
    // Strip 'b.' prefix if present (BIM 360 project IDs)
    const cleanProjectId = projectId.startsWith('b.') ? projectId.substring(2) : projectId;
    
    const response = await fetch(
      `${APS_LOCATIONS_URL}/projects/${cleanProjectId}/trees/default/nodes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId,
          type: "Area",
          name,
          barcode,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create location: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to create location "${name}":`, error);
    throw error;
  }
}

/**
 * Upload assets to ACC project in batches
 */
export async function uploadAssetsToACC(
  accessToken: string,
  projectId: string,
  assets: any[],
  onProgress?: (progress: APSUploadProgress) => void
): Promise<{ success: boolean; message: string; count: number; errors: string[] }> {
  // Clear previous log
  try { fs.writeFileSync(DEBUG_LOG, ''); } catch (e) {}
  
  debugLog(`[ACC Upload] ========== UPLOAD START ==========`);
  debugLog(`[ACC Upload] Project ID: ${projectId}`);
  debugLog(`[ACC Upload] Assets to upload: ${assets.length}`);
  debugLog(`[ACC Upload] Sample asset: ${JSON.stringify(assets[0], null, 2)}`);
  
  const BATCH_SIZE = 100; // ACC API limit
  const totalBatches = Math.ceil(assets.length / BATCH_SIZE);
  let uploaded = 0;
  let failed = 0;
  const errors: string[] = [];
  
  console.log(`[ACC Upload] Will process ${totalBatches} batches of up to ${BATCH_SIZE} assets each`);

  // Get categories to find default category and status
  const categories = await listCategories(accessToken, projectId);
  
  if (categories.length === 0) {
    throw new Error("No asset categories found in project. Please set up asset categories in ACC first.");
  }

  // Find a leaf category (isLeaf=true) with a valid status
  // Skip root and parent categories
  let defaultCategory = null;
  let defaultStatusId = null;
  
  for (const category of categories) {
    // Skip root categories and try to find leaf categories
    if (category.isLeaf || !category.isRoot) {
      const statusId = await getCategoryDefaultStatus(accessToken, projectId, category.id);
      if (statusId) {
        defaultCategory = category;
        defaultStatusId = statusId;
        console.log(`[ACC Upload] Using category: ${category.name} (ID: ${category.id})`);
        break;
      }
    }
  }
  
  // If no usable category found, create one automatically
  if (!defaultCategory || !defaultStatusId) {
    console.log('[ACC Upload] No usable category found, creating default category...');
    
    // Find ROOT category
    const rootCategory = categories.find(cat => cat.isRoot);
    if (!rootCategory) {
      throw new Error('No ROOT category found in project');
    }

    // Create a status set with "Active" status (or reuse if exists)
    let statusSet;
    let statusSetId;
    let firstStatusId;
    
    const statusSetResponse = await fetch(
      `${APS_ACC_URL_V1}/projects/${projectId}/status-step-sets`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Asset Status',
          description: 'Default status set for assets',
          values: [
            {
              label: 'Active',
              description: 'Asset is active',
              color: 'green',
            },
          ],
        }),
      }
    );

    if (!statusSetResponse.ok) {
      const errorText = await statusSetResponse.text();
      // If status set already exists, extract it from the error response
      if (errorText.includes('DUPLICATE_STATUS_SET_NAME')) {
        console.log('[ACC Upload] Asset Status set already exists, reusing it...');
        try {
          const errorData = JSON.parse(errorText);
          const existingStatusSet = errorData.errorMetadata?.conflictingEntities?.[0];
          if (existingStatusSet) {
            statusSet = existingStatusSet;
            statusSetId = existingStatusSet.id;
            firstStatusId = existingStatusSet.values[0].id;
          } else {
            throw new Error('Could not extract existing status set from error');
          }
        } catch (parseError) {
          throw new Error(`Failed to parse status set error: ${errorText}`);
        }
      } else {
        throw new Error(`Failed to create status set: ${errorText}`);
      }
    } else {
      statusSet = await statusSetResponse.json();
      statusSetId = statusSet.id;
      firstStatusId = statusSet.values[0].id;
    }

    // Create "Equipment" category under ROOT (or find if it already exists)
    let newCategory;
    const categoryResponse = await fetch(
      `${APS_ACC_URL_V1}/projects/${projectId}/categories`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Equipment',
          description: 'Equipment and machinery',
          parentId: rootCategory.id,
        }),
      }
    );

    if (!categoryResponse.ok) {
      const errorText = await categoryResponse.text();
      // If category already exists, try to find it
      if (errorText.includes('DUPLICATE_CATEGORY_NAME')) {
        console.log('[ACC Upload] Equipment category already exists, finding it...');
        const existingCategory = categories.find(cat => cat.name === 'Equipment');
        if (!existingCategory) {
          throw new Error('Equipment category exists but could not be found');
        }
        newCategory = existingCategory;
      } else {
        throw new Error(`Failed to create category: ${errorText}`);
      }
    } else {
      newCategory = await categoryResponse.json();
    }

    // Assign status set to the new category
    const assignResponse = await fetch(
      `${APS_ACC_URL_V1}/projects/${projectId}/categories/${newCategory.id}/status-step-set/${statusSetId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!assignResponse.ok) {
      const error = await assignResponse.text();
      console.warn(`Failed to assign status set to category: ${error}`);
    }

    defaultCategory = newCategory;
    defaultStatusId = firstStatusId;
    console.log(`[ACC Upload] Created category: ${newCategory.name} (ID: ${newCategory.id})`);
  }

  // Create locations for assets (optional - skip if locations API not available)
  debugLog('[ACC Upload] Creating locations...');
  let locations: APSLocation[] = [];
  let rootLocation: APSLocation | undefined;
  let locationNameToId = new Map<string, string>();
  
  try {
    debugLog('[ACC Upload] Fetching existing locations from project...');
    locations = await listLocations(accessToken, projectId);
    debugLog(`[ACC Upload] Found ${locations.length} existing location nodes`);
    rootLocation = locations.find(loc => loc.type === 'Root');
    
    if (!rootLocation) {
      debugLog('[ACC Upload] ⚠️  No root location found, skipping location creation');
    } else {
      debugLog(`[ACC Upload] ✓ Root location found: ${rootLocation.name} (ID: ${rootLocation.id})`);
    }
  } catch (error: any) {
    debugLog(`[ACC Upload] ❌ Locations API error: ${error.message}`);
    debugLog('[ACC Upload] Skipping location creation due to API error');
  }
  
  // Extract unique location names from assets and create them if root location is available
  if (rootLocation) {
    const uniqueLocationNames = new Set<string>();
    assets.forEach(asset => {
      if (asset.location) {
        uniqueLocationNames.add(asset.location);
      }
    });
    
    debugLog(`[ACC Upload] Found ${uniqueLocationNames.size} unique locations in assets: ${Array.from(uniqueLocationNames).join(', ')}`);
    
    // Check which locations already exist
    debugLog('[ACC Upload] Checking for existing locations...');
    locations.forEach(loc => {
      if (loc.name && uniqueLocationNames.has(loc.name)) {
        locationNameToId.set(loc.name, loc.id);
        debugLog(`[ACC Upload]   ✓ "${loc.name}" already exists (ID: ${loc.id})`);
      }
    });
    
    // Create missing locations
    const missingLocations = Array.from(uniqueLocationNames).filter(name => !locationNameToId.has(name));
    debugLog(`[ACC Upload] Need to create ${missingLocations.length} new locations`);
    
    for (const locationName of missingLocations) {
      try {
        debugLog(`[ACC Upload]   Creating "${locationName}" under root (${rootLocation.id})...`);
        const newLocation = await createLocation(
          accessToken,
          projectId,
          rootLocation.id,
          locationName
        );
        locationNameToId.set(locationName, newLocation.id);
        debugLog(`[ACC Upload]   ✓ Created "${locationName}" (ID: ${newLocation.id})`);
      } catch (error: any) {
        debugLog(`[ACC Upload]   ❌ Failed to create "${locationName}": ${error.message}`);
        // Continue without this location
      }
    }
    
    debugLog(`[ACC Upload] Location mapping complete: ${locationNameToId.size} locations available`);
  } else {
    debugLog('[ACC Upload] Skipping location creation (no root location)');
  }

  // Process in batches
  for (let i = 0; i < totalBatches; i++) {
    const batchStart = i * BATCH_SIZE;
    const batchEnd = Math.min(batchStart + BATCH_SIZE, assets.length);
    const batch = assets.slice(batchStart, batchEnd);

    // Map our assets to ACC format
    const accAssets: APSAsset[] = batch.map((asset) => {
      const accAsset: APSAsset = {
        clientAssetId: asset.name || asset.assetId || `Asset-${asset.id}`,
        categoryId: defaultCategory.id,
        statusId: defaultStatusId,
        description: asset.description || asset.type || "",
      };
      
      // Add location if available
      if (asset.location) {
        if (locationNameToId.has(asset.location)) {
          accAsset.locationId = locationNameToId.get(asset.location);
        } else {
          console.log(`[ACC Upload] Warning: No location ID found for "${asset.location}" (asset: ${asset.name})`);
        }
      }
      
      return accAsset;
    });

    try {
      const response = await fetch(
        `${APS_ACC_URL_V2}/projects/${projectId}/assets:batch-create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accAssets),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error(`[ACC Upload] Batch ${i + 1}/${totalBatches} failed:`, error);
        errors.push(`Batch ${i + 1}: ${error}`);
        failed += batch.length;
      } else {
        const result = await response.json();
        console.log(`[ACC Upload] Batch ${i + 1}/${totalBatches} response:`, JSON.stringify(result, null, 2));
        uploaded += batch.length;
      }
    } catch (error) {
      console.error(`Batch ${i + 1} error:`, error);
      errors.push(`Batch ${i + 1}: ${error instanceof Error ? error.message : String(error)}`);
      failed += batch.length;
    }

    // Report progress
    if (onProgress) {
      onProgress({
        total: assets.length,
        uploaded,
        failed,
        currentBatch: i + 1,
        totalBatches,
      });
    }

    // Small delay between batches to respect rate limits
    if (i < totalBatches - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return {
    success: uploaded > 0,
    message: `Uploaded ${uploaded} of ${assets.length} assets${failed > 0 ? `, ${failed} failed` : ""}`,
    count: uploaded,
    errors,
  };
}
