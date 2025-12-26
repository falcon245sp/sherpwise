#!/bin/bash
set -euo pipefail

# Setup Google Cloud Secret Manager secrets for Ontara Web
# Usage: GCP_PROJECT_ID=your-project-id ./setup-secrets.sh

GCP_PROJECT_ID=${GCP_PROJECT_ID:-}

if [ -z "$GCP_PROJECT_ID" ]; then
    echo "❌ Error: GCP_PROJECT_ID not set"
    echo "Usage: GCP_PROJECT_ID=your-project-id ./setup-secrets.sh"
    exit 1
fi

echo "🔐 Setting up Secret Manager secrets for Ontara Web..."
gcloud config set project "$GCP_PROJECT_ID"

# Function to create or update secret
create_or_update_secret() {
    local secret_name=$1
    local secret_value=$2
    
    if gcloud secrets describe "$secret_name" --project="$GCP_PROJECT_ID" &> /dev/null; then
        echo "📝 Updating secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=-
    else
        echo "✨ Creating secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets create "$secret_name" \
            --data-file=- \
            --replication-policy="automatic"
    fi
}

# Prompt for secret values
echo ""
echo "Please provide the following secret values:"
echo ""

read -p "NEXT_PUBLIC_ONTARA_API_URL: " ONTARA_API_URL
read -p "NEXT_PUBLIC_ONTARA_MCP_URL: " ONTARA_MCP_URL
read -p "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: " CLERK_PUBLISHABLE_KEY
read -sp "CLERK_SECRET_KEY: " CLERK_SECRET_KEY
echo ""
read -sp "ONTARA_API_KEY: " ONTARA_API_KEY
echo ""

# Create/update secrets
create_or_update_secret "ontara-web-api-url" "$ONTARA_API_URL"
create_or_update_secret "ontara-web-mcp-url" "$ONTARA_MCP_URL"
create_or_update_secret "ontara-web-clerk-publishable-key" "$CLERK_PUBLISHABLE_KEY"
create_or_update_secret "ontara-web-clerk-secret" "$CLERK_SECRET_KEY"
create_or_update_secret "ontara-web-api-key" "$ONTARA_API_KEY"

# Grant service account access to secrets
SERVICE_ACCOUNT="ontara-web@${GCP_PROJECT_ID}.iam.gserviceaccount.com"

echo ""
echo "🔑 Granting service account access to secrets..."

for secret in "ontara-web-api-url" "ontara-web-mcp-url" "ontara-web-clerk-publishable-key" "ontara-web-clerk-secret" "ontara-web-api-key"; do
    gcloud secrets add-iam-policy-binding "$secret" \
        --member="serviceAccount:$SERVICE_ACCOUNT" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet || true
done

echo ""
echo "✅ Secrets configured successfully!"
