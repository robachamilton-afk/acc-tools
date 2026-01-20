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

      // Upload to ACC
      const result = await uploadAssetsToACC(
        input.accessToken,
        input.projectId,
        assets
      );

      return result;
    }),
});
