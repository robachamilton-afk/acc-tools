/**
 * ACC (Autodesk Construction Cloud) Router
 * 
 * Handles APS OAuth and ACC API operations.
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getAPSAuthUrl,
  exchangeCodeForToken,
  listHubs,
  listProjects,
  uploadAssetsToACC,
} from "./_core/aps";
import { getDb } from "./db";

export const accRouter = router({
  /**
   * Get APS OAuth authorization URL
   */
  getAuthUrl: publicProcedure
    .input(
      z.object({
        redirectUri: z.string(),
        state: z.string().optional(),
      })
    )
    .query(({ input }) => {
      const authUrl = getAPSAuthUrl(input.redirectUri, input.state);
      return { authUrl };
    }),

  /**
   * Exchange authorization code for access token
   */
  exchangeCode: publicProcedure
    .input(
      z.object({
        code: z.string(),
        redirectUri: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const tokens = await exchangeCodeForToken(input.code, input.redirectUri);
      return tokens;
    }),

  /**
   * Debug: Get raw hubs API response
   */
  debugHubsRaw: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
      })
    )
    .query(async ({ input }) => {
      const response = await fetch(`https://developer.api.autodesk.com/project/v1/hubs`, {
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
        },
      });
      const rawData = await response.json();
      return { 
        status: response.status,
        statusText: response.statusText,
        rawData 
      };
    }),

  /**
   * List ACC hubs
   */
  listHubs: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
      })
    )
    .query(async ({ input }) => {
      const hubs = await listHubs(input.accessToken);
      return { hubs };
    }),

  /**
   * List ACC projects
   */
  listProjects: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        hubId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const projects = await listProjects(input.accessToken, input.hubId);
      return { projects };
    }),

  /**
   * Debug: Test location API
   */
  debugLocations: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.log(`[ACC Debug] Testing location API with project: ${input.projectId}`);
      const { listLocations } = await import("./_core/aps");
      try {
        const locations = await listLocations(input.accessToken, input.projectId);
        console.log(`[ACC Debug] Success! Found ${locations.length} locations`);
        return { success: true, locations, error: null };
      } catch (error: any) {
        console.error(`[ACC Debug] Location API error:`, error);
        return { success: false, locations: [], error: error.message };
      }
    }),

  /**
   * Upload assets to ACC
   */
  uploadAssets: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        projectId: z.string(),
        jobId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      console.log(`[ACC tRPC] uploadAssets mutation called with jobId=${input.jobId}, projectId=${input.projectId}`);
      const db = await getDb();
      
      if (!db) {
        throw new Error("Database not available");
      }
      
      // Get assets for this extraction
      const { eq } = await import("drizzle-orm");
      const { assets: assetsTable } = await import("../drizzle/schema");
      
      const assets = await db
        .select()
        .from(assetsTable)
        .where(eq(assetsTable.jobId, input.jobId));

      if (assets.length === 0) {
        throw new Error("No assets found for this extraction");
      }

      // Upload to ACC with progress tracking
      const result = await uploadAssetsToACC(
        input.accessToken,
        input.projectId,
        assets,
        (progress) => {
          console.log(`Upload progress: ${progress.uploaded}/${progress.total} (Batch ${progress.currentBatch}/${progress.totalBatches})`);
        }
      );

      return result;
    }),
});
