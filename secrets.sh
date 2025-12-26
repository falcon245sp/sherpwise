#!/bin/bash
# Secure Secrets Management Script
# This script safely loads secrets into environment variables without storing them in git

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to safely add to shell profile
add_to_profile() {
    local profile_file=""
    
    # Detect shell and profile file
    if [[ "$SHELL" == *"zsh"* ]]; then
        profile_file="$HOME/.zshrc"
    elif [[ "$SHELL" == *"bash"* ]]; then
        profile_file="$HOME/.bashrc"
        # On macOS, .bash_profile is often used instead
        if [[ "$OSTYPE" == "darwin"* ]] && [[ -f "$HOME/.bash_profile" ]]; then
            profile_file="$HOME/.bash_profile"
        fi
    else
        echo -e "${YELLOW}Unknown shell. Please manually add to your shell profile.${NC}"
        return 1
    fi
    
    echo "$profile_file"
}

# Function to check if secrets are already configured
check_existing_config() {
    local profile_file=$(add_to_profile)
    if [[ -f "$profile_file" ]] && grep -q "ONTARA_SECRETS" "$profile_file"; then
        return 0
    fi
    return 1
}

# Main setup function
setup_secrets() {
    echo -e "${GREEN}🔐 Setting up secure secrets management...${NC}"
    
    # Create secrets directory in user's home (outside of git repo)
    local secrets_dir="$HOME/.ontara-secrets"
    mkdir -p "$secrets_dir"
    chmod 700 "$secrets_dir"
    
    # Create the secrets file
    local secrets_file="$secrets_dir/secrets.env"
    
    if [[ ! -f "$secrets_file" ]]; then
        echo -e "${YELLOW}Creating new secrets file...${NC}"
        
        # Copy existing secrets
        cat > "$secrets_file" << 'EOSECRETS'
# Ontara Secrets
# This file is stored outside the git repository for security

# Google Cloud / Gemini API Key
export GOOGLE_API_KEY=AIzaSyA7UJ_BGbOe8WAbrijUxs_OZaNUeebsE6U
export GOOGLE_CLOUD_API_KEY=AIzaSyA7UJ_BGbOe8WAbrijUxs_OZaNUeebsE6U
export GEMINI_API_KEY=AIzaSyA7UJ_BGbOe8WAbrijUxs_OZaNUeebsE6U

# Neo4j Database Configuration
export NEO4J_URI=neo4j+s://48ba7a5e.databases.neo4j.io
export NEO4J_USER=neo4j
export NEO4J_USERNAME=neo4j
export NEO4J_PASSWORD=P4J0fHRK1YvpUkSCO6dZoUlMlj_WYQcjXvRUP1ORtQ8
export NEO4J_DATABASE=neo4j

# GCP Configuration (for deployment)
export GCP_PROJECT_ID=ontara-platform
export GCP_REGION=us-central1

# Backend Configuration
export DEBUG=false
export LOG_LEVEL=INFO
export API_PORT=8000
export BACKEND_PORT=8000
export CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# MCP Server Configuration
export MCP_SERVER_URL=http://localhost:3000
export MCP_ENABLED=true
export MCP_TIMEOUT=30.0

# BERT Tester Configuration
export REACT_APP_BERT_TESTER_API_URL=https://bert-tester-api-103199808504.us-central1.run.app
export REACT_APP_ENVIRONMENT=production
EOSECRETS
        chmod 600 "$secrets_file"
        echo -e "${GREEN}✅ Secrets file created at: $secrets_file${NC}"
    else
        echo -e "${YELLOW}Secrets file already exists at: $secrets_file${NC}"
    fi
    
    # Add to shell profile if not already there
    if ! check_existing_config; then
        local profile_file=$(add_to_profile)
        if [[ -n "$profile_file" ]]; then
            echo -e "${YELLOW}Adding secrets loader to $profile_file...${NC}"
            cat >> "$profile_file" << EOF

# Ontara Secrets Management
if [[ -f "$secrets_file" ]]; then
    source "$secrets_file"
fi
