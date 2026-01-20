# ACC Assets API Implementation Notes

## Key Findings

### Batch Create Assets Endpoint

**Endpoint:** `POST https://developer.api.autodesk.com/construction/assets/v2/projects/{projectId}/assets:batch-create`

**Authentication:** 3-legged OAuth with `data:write` and `data:create` scopes

**Rate Limit:** Up to 100 assets per batch request

### Required Fields per Asset:
- `clientAssetId` (string) - Asset name/identifier (appears as "Asset ID" in UI)
- `categoryId` (string) - Category the asset belongs to
- `statusId` (UUID) - Status from the category's status set

### Optional Fields:
- `description` (string, max 1000 chars)
- `locationId` (UUID) - From Locations API
- `barcode` (string)
- `customAttributes` (object) - Key-value pairs with custom attribute names and values

### Custom Attributes Data Types:
- `text`: string value
- `date`: ISO8601 date string (e.g., "2020-04-10")
- `select`: valid ID from predefined list
- `multi-select`: array of valid IDs
- `boolean`: boolean value
- `numeric`: string that parses as float

## Implementation Strategy

1. **Get Categories:** First need to fetch available categories in the project
2. **Map Assets to Categories:** Match extracted assets to appropriate ACC categories
3. **Batch Upload:** Group assets into batches of 100
4. **Handle Custom Attributes:** Map our extracted fields to ACC custom attributes
5. **Progress Tracking:** Report progress after each batch

## API Endpoints Needed:
- GET `/construction/assets/v2/projects/{projectId}/categories` - List categories
- POST `/construction/assets/v2/projects/{projectId}/assets:batch-create` - Create assets
- GET `/construction/assets/v2/projects/{projectId}/categories/{categoryId}/custom-attributes` - Get custom attributes for category
