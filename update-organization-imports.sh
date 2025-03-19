#!/bin/bash

# This script will update all API route files to use the new organization utility

# Add import statement to all files that need it
find /Users/msainz/Projects/proptuna_app/src/app/api -type f -name "route.ts" -exec sed -i '' -e '1,5s/import { NextRequest, NextResponse } from "next\/server";/import { NextRequest, NextResponse } from "next\/server";\nimport { getCurrentOrganizationId } from "@\/lib\/organization";/' {} \;

# Replace hardcoded organization IDs with the function call
find /Users/msainz/Projects/proptuna_app/src/app/api -type f -name "route.ts" -exec sed -i '' -e 's/const organizationId = "123e4567-e89b-12d3-a456-426614174000";/const organizationId = getCurrentOrganizationId();/' {} \;

echo "Updated all API route files to use the organization utility"
