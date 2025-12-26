#!/bin/bash
set -euo pipefail

# Deploy Ontara Web to Google Cloud Run
# Usage: ./deploy-cloud-run.sh

GCP_PROJECT_ID=${GCP_PROJECT_ID:-}
GCP_REGION=${GCP_REGION:-us-central1}
SERVICE_NAME="ontara-web"
IMAGE_NAME="gcr.io/${GCP_PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Deploying Ontara Web to Cloud Run..."

# Validate GCP_PROJECT_ID
if [ -z "$GCP_PROJECT_ID" ]; then
    echo "❌ Error: GCP_PROJECT_ID not set"
    echo "Usage: GCP_PROJECT_ID=your-project-id ./deploy-cloud-run.sh"
    exit 1
fi

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI not installed"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set project
echo "📋 Setting GCP project to $GCP_PROJECT_ID..."
gcloud config set project "$GCP_PROJECT_ID"

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    secretmanager.googleapis.com \
    --quiet

# Create secrets if they don't exist
echo "🔐 Setting up secrets..."
./setup-secrets.sh

# Build and push Docker image
echo "🐳 Building Docker image..."
gcloud builds submit \
    --tag "$IMAGE_NAME" \
    --timeout=30m \
    ../..

# Deploy to Cloud Run
echo "☁️  Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image "$IMAGE_NAME" \
    --platform managed \
    --region "$GCP_REGION" \
    --allow-unauthenticated \
    --service-account "${SERVICE_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
    --min-instances 0 \
    --max-instances 10 \
    --cpu 1 \
    --memory 512Mi \
    --timeout 300s \
    --set-env-vars "NODE_ENV=production" \
    --set-secrets "NEXT_PUBLIC_ONTARA_API_URL=ontara-web-api-url:latest" \
    --set-secrets "NEXT_PUBLIC_ONTARA_MCP_URL=ontara-web-mcp-url:latest" \
    --set-secrets "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=ontara-web-clerk-publishable-key:latest" \
    --set-secrets "CLERK_SECRET_KEY=ontara-web-clerk-secret:latest" \
    --set-secrets "ONTARA_API_KEY=ontara-web-api-key:latest"

# Get service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --region "$GCP_REGION" \
    --format 'value(status.url)')

echo ""
echo "✅ Deployment complete!"
echo "🌍 Service URL: $SERVICE_URL"
echo ""
echo "📊 To view logs:"
echo "   gcloud logs tail --follow --project=$GCP_PROJECT_ID --resource-type=cloud_run_revision --service-name=$SERVICE_NAME"
