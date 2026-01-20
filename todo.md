# ACC Asset Extractor - Project TODO

## Phase 1: Database & Backend Setup
- [x] Design database schema for assets, extraction jobs, and metadata
- [x] Create database tables with Drizzle ORM
- [x] Set up tRPC procedures for job management
- [x] Integrate Python extraction scripts with backend

## Phase 2: Configuration Page
- [x] Build rclone remote path input form
- [ ] Add PDF count validation
- [ ] Implement path validation and directory listing
- [x] Create start extraction button with job initialization

## Phase 3: Processing Dashboard
- [x] Implement real-time progress tracking with polling
- [x] Build document review progress display
- [x] Add asset extraction progress display
- [x] Create live stats panel (total assets, category breakdown)
- [ ] Show current document being processed
- [ ] Display estimated time remaining
- [ ] Build scrolling feed of recently extracted assets

## Phase 4: Data Validation Page
- [x] Create searchable/filterable asset table
- [x] Add confidence score flagging
- [ ] Implement edit asset functionality
- [ ] Add merge assets capability
- [ ] Implement delete assets
- [ ] Build category distribution charts
- [ ] Add location coverage visualization

## Phase 5: Export Page
- [ ] Generate ACC-compatible Excel export
- [x] Provide raw JSON download
- [x] Provide CSV download
- [x] Build statistics dashboard
- [x] Add download buttons for all formats

## Phase 6: Styling & Polish
- [x] Apply MCE brand colors (#1d4ed8 primary)
- [x] Ensure light/dark theme consistency
- [x] Add loading states and error handling
- [x] Implement responsive design
- [ ] Add animations and transitions

## Phase 7: Testing & Deployment
- [x] Test complete extraction workflow
- [x] Verify real-time updates work correctly
- [x] Test all export formats
- [x] Create initial checkpoint

## Phase 8: Demo Data Feature
- [x] Create demo data generator with realistic solar farm assets
- [x] Add "Load Demo Data" button to configuration page
- [x] Generate sample extraction job with completed status
- [x] Populate with realistic asset categories (inverters, cables, transformers, etc.)
- [x] Include varied confidence scores and locations


## Phase 9: Dark Mode & Branding Updates
- [ ] Change default theme to dark mode
- [ ] Add MCE logo to application
- [ ] Create header component with logo and branding
- [ ] Add header to all pages
- [ ] Ensure dark mode styling matches MCE website

## Phase 10: ACC Excel Export
- [ ] Create Excel generation helper using openpyxl
- [ ] Implement ACC-compatible format with all required columns
- [ ] Add tRPC procedure for Excel export
- [ ] Add Excel download button to Export page
- [ ] Test Excel file structure and compatibility

## Phase 11: MCE Design Standards Update (Jan 15, 2026)
- [x] Pull STYLE_GUIDE.md from mce-website GitHub repo
- [x] Review MCE design standards (colors, typography, spacing, components)
- [x] Update primary color from blue to orange (MCE brand color)
- [x] Update all page gradients to use slate instead of blue
- [x] Add backdrop blur to header navigation
- [ ] Add hover effects and transitions to cards
- [ ] Fix ACC Excel export 500 error (Python CLI works, Node.js integration needs debugging)
- [ ] Test complete export workflow (JSON, CSV, Excel)
- [ ] Ensure consistent visual design across all pages


## Phase 12: Header and Color Fixes (Jan 15, 2026)
- [x] Fix header to say "MAIN CHARACTER ENERGY" as main title
- [x] Add "ACC Asset Extractor" as subtitle below
- [x] Review and fix header background color to match MCE website
- [x] Check all color values against MCE STYLE_GUIDE.md
- [x] Ensure proper contrast and visual hierarchy


## Phase 13: Fix Excel Export Python Version Issue (Jan 15, 2026)
- [x] Change excelExport.ts to use /usr/bin/python3.11 (absolute path)
- [x] Clear Python environment variables (PYTHONPATH, PYTHONHOME, VIRTUAL_ENV)
- [x] Test Excel export with corrected Python version
- [x] Verify Excel file downloads successfully in browser (9.2K valid file)
- [x] Confirm ACC-compatible format is correct (Microsoft Excel 2007+)


## Phase 14: ACC API Integration (Jan 20, 2026)
- [x] Add APS credentials to environment variables
- [x] Create APS OAuth module in server/_core/aps.ts
- [x] Add ACC API client for project listing and asset upload
- [x] Create tRPC procedure for ACC OAuth flow
- [x] Create tRPC procedure for listing ACC projects
- [x] Create tRPC procedure for pushing assets to ACC
- [x] Add "Push to ACC" button to Export page
- [ ] Implement full OAuth flow with project selection dialog
- [ ] Test ACC upload with real credentials
- [ ] Update documentation with ACC integration guide


## Phase 15: Complete ACC OAuth Workflow (Jan 20, 2026)
- [x] Add OAuth callback route to handle authorization code
- [x] Implement token storage (in-memory for now)
- [x] Create project selection dialog component
- [x] Add tRPC mutation to initiate OAuth flow
- [x] Implement basic asset upload (placeholder)
- [ ] Implement actual ACC API asset creation
- [ ] Add progress tracking UI with real-time updates
- [ ] Handle upload errors and retry logic
- [ ] Test complete workflow with real ACC project
- [ ] Update documentation with usage guide


## Phase 16: Complete ACC API Implementation (Jan 20, 2026)
- [x] Research ACC Data Management API for asset creation
- [x] Implement batch asset creation (100 assets per batch)
- [x] Implement custom attributes mapping
- [x] Add batch processing with rate limiting
- [x] Add progress tracking with console logging
- [x] Implement error handling per batch
- [x] Add detailed success/error reporting
- [ ] Test with real ACC project and credentials
- [ ] Update documentation with complete workflow


## Phase 17: Fix OAuth Scope Issue (Jan 20, 2026)
- [x] Research correct OAuth scopes for ACC Assets API
- [x] Update getAPSAuthUrl to include account:read scope
- [ ] Test OAuth flow with updated scopes
- [ ] Verify API access works after authentication


## Phase 18: Fix OAuth Callback Routing Issue (Jan 20, 2026)
- [ ] Investigate Manus proxy routing issue with /api/acc/oauth/callback
- [ ] Implement alternative OAuth callback approach (client-side code handling)
- [ ] Update ACCProjectDialog to handle authorization code directly
- [ ] Test OAuth flow with new implementation
- [ ] Verify token exchange and storage works correctly


## Phase 19: Fix Personal ACC Account Support (Jan 20, 2026)
- [ ] Investigate why personal ACC accounts don't return hubs
- [ ] Modify dialog to skip hub selection for personal accounts
- [ ] Implement direct project listing without hub requirement
- [ ] Test with personal ACC account (rob.ac.hamilton@gmail.com)
- [ ] Verify "Future Solar Farm" project appears in dropdown


## Phase 20: Fix ACC Categories API Error (Jan 20, 2026)
- [x] Resolve manual ACC app authorization requirement (SOLVED: User must enable app in ACC Account Admin)
- [x] Verify hub and project listing works after authorization
- [ ] Fix "The requested resource does not exist" error in categories API
- [ ] Verify correct ACC Assets API endpoint for categories
- [ ] Test asset upload with correct category mapping
- [ ] Verify assets appear in ACC project


## Phase 21: Automatic Category Handling (Jan 20, 2026)
- [ ] Research ACC Assets API for category creation endpoint
- [ ] Implement automatic category creation if API supports it
- [ ] Add fallback to create default "Equipment" category with "Active" status
- [ ] Test asset upload with auto-created category
- [ ] Verify assets appear in ACC project


## Phase 22: Fix Batch-Create and Location Creation (Jan 20, 2026)
- [x] Fix batch-create endpoint to use correct V2 API
- [x] Test basic asset upload without locations
- [ ] Implement location creation API integration
- [ ] Create locations before uploading assets
- [ ] Map asset locations to created location IDs
- [ ] Test complete upload workflow with locations


## Phase 23: Fix Missing Assets Issue (Jan 20, 2026)
- [x] Investigate why only 147 assets show in export when 537 were extracted
- [x] Check database query in Export page
- [x] Check if assets are being filtered out
- [x] Verify all 537 assets are in the database
- [x] Fix query to include all assets
- [x] Test ACC upload with all 537 assets

## Phase 24: Location Handling and Asset Name Cleanup (Jan 20, 2026)
- [ ] Clean up asset names in demo data (remove location from names)
- [ ] Research ACC Locations API endpoints
- [ ] Implement location creation before asset upload
- [ ] Map location names to location IDs
- [ ] Assign location IDs to assets during upload
- [ ] Test complete workflow with proper locations


## Phase 25: Debug Location Tree API (Jan 20, 2026)
- [x] Investigate "container is unprocessable" error from Locations API
- [x] Test if location tree exists for the project
- [x] Confirmed root location ID: 39ca28b5-b2fa-463b-b5ef-d3ee24ccf8bf
- [x] Fixed asset name field (use 'name' instead of 'assetName')
- [x] Fixed batch insert to handle all 521 assets (was only inserting 147)
- [x] Location creation code already implemented in uploadAssetsToACC
- [x] Fixed BIM 360 project ID format (strip 'b.' prefix for Locations API)
- [x] Successfully created 34 locations (Block 01-16, MV Line 1-16, Central, Site Entrance)
- [x] Test complete upload with all 521 assets and location assignments
- [x] Verify assets have locations assigned in ACC

## Phase 26: Add Client-Side Upload Progress (Jan 20, 2026)
- [ ] Add progress state to ACCProjectDialog
- [ ] Show progress bar during upload
- [ ] Display current batch and asset count
- [ ] Show location creation progress
- [ ] Add detailed status messages for each step

## Phase 27: Debug Location Assignment (Jan 20, 2026)
- [x] Add detailed logging to location creation process
- [x] Verify locations are being created in ACC
- [x] Check if locationId is being properly assigned to assets
- [x] Test location API with actual upload flow
- [x] Fixed project ID format issue (BIM 360 'b.' prefix)
