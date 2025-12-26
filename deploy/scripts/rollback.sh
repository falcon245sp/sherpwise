#!/bin/bash
set -euo pipefail

# Rollback Ontara Web deployment
# Usage: ./rollback.sh [vercel|cloud-run] [revision]

PLATFORM=${1:-}
REVISION=${2:-}

if [ -z "$PLATFORM" ]; then
    echo "❌ Error: Platform not specified"
    echo "Usage: ./rollback.sh [vercel|cloud-run] [revision]"
    exit 1
fi

case "$PLATFORM" in
    vercel)
        echo "🔄 Rolling back Vercel deployment..."
        
        if [ -z "$REVISION" ]; then
            # List recent deployments
            echo "Recent deployments:"
            vercel ls --token="$VERCEL_TOKEN"
            echo ""
            read -p "Enter deployment URL to rollback to: " REVISION
        fi
        
        vercel promote "$REVISION" --token="$VERCEL_TOKEN"
        echo "✅ Rollback complete!"
        ;;
        
    cloud-run)
        echo "🔄 Rolling back Cloud Run deployment..."
        
        GCP_PROJECT_ID=${GCP_PROJECT_ID:-}
        GCP_REGION=${GCP_REGION:-us-central1}
        SERVICE_NAME="ontara-web"
        
        if [ -z "$GCP_PROJECT_ID" ]; then
            echo "❌ Error: GCP_PROJECT_ID not set"
            exit 1
        fi
        
        if [ -z "$REVISION" ]; then
            # List recent revisions
            echo "Recent revisions:"
            gcloud run revisions list \
                --service="$SERVICE_NAME" \
                --region="$GCP_REGION" \
                --project="$GCP_PROJECT_ID"
            echo ""
            read -p "Enter revision name to rollback to: " REVISION
        fi
        
        # Update traffic to point to specified revision
        gcloud run services update-traffic "$SERVICE_NAME" \
            --to-revisions="$REVISION=100" \
            --region="$GCP_REGION" \
            --project="$GCP_PROJECT_ID"
        
        echo "✅ Rollback complete!"
        ;;
        
    *)
        echo "❌ Error: Invalid platform '$PLATFORM'"
        echo "Valid platforms: vercel, cloud-run"
        exit 1
        ;;
esac
