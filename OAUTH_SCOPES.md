# OAuth Scopes for ACC Assets API

Based on APS documentation research:

## Required Scopes for ACC Assets:

**For Reading Assets:**
- `data:read` - View your data

**For Creating/Updating Assets:**
- `data:write` - Manage your data
- `data:create` - Write data

**For Account/Project Access:**
- `account:read` - View your product and service accounts (required for listing hubs/projects)

## Current Implementation Issue:

The error "client_id specified does not have access to the api product" (AUTH-001) suggests we need to request the correct combination of scopes.

## Recommended Scope String:

For full ACC Assets functionality:
```
data:read data:write data:create account:read
```

This should be passed as a single space-separated string in the OAuth authorization URL.

## References:
- https://aps.autodesk.com/en/docs/oauth/v2/developers_guide/scopes
- https://aps.autodesk.com/en/docs/acc/v1/reference/http/assets-assets-batch-create-POST-v2/
