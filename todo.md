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
- [ ] Test complete extraction workflow
- [ ] Verify real-time updates work correctly
- [ ] Test all export formats
- [ ] Create initial checkpoint

## Phase 8: Demo Data Feature
- [x] Create demo data generator with realistic solar farm assets
- [x] Add "Load Demo Data" button to configuration page
- [x] Generate sample extraction job with completed status
- [x] Populate with realistic asset categories (inverters, cables, transformers, etc.)
- [x] Include varied confidence scores and locations
