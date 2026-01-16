#!/bin/bash

# AWS ECR Configuration
AWS_ACCOUNT_ID="905418111634"
AWS_REGION="${AWS_REGION:-eu-west-1}"  # Default to eu-west-1, change if needed
ECR_REPO_PREFIX="springboot-kafka-microservices"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Pushing Microservices to AWS ECR ===${NC}"
echo "Account: $AWS_ACCOUNT_ID"
echo "Region: $AWS_REGION"
echo ""

ECR_BASE_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
SERVICES=("order-service" "inventory-service" "payment-service")

# Step 1: Create ECR repositories
echo -e "${GREEN}Step 1: Creating ECR repositories...${NC}"
for SERVICE in "${SERVICES[@]}"; do
    REPO_NAME="$ECR_REPO_PREFIX/$SERVICE"
    echo "Creating: $REPO_NAME"
    aws ecr create-repository \
        --repository-name "$REPO_NAME" \
        --region "$AWS_REGION" \
        --image-scanning-configuration scanOnPush=true \
        --image-tag-mutability MUTABLE 2>&1 | grep -v "already exists" || echo "  Repository exists or created"
done
echo ""

# Step 2: Authenticate Docker with ECR
echo -e "${GREEN}Step 2: Authenticating Docker with ECR...${NC}"
aws ecr get-login-password --region "$AWS_REGION" | \
    docker login --username AWS --password-stdin "$ECR_BASE_URL"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker login failed. Check AWS credentials.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker authenticated${NC}"
echo ""

# Step 3: Tag and push images
echo -e "${GREEN}Step 3: Tagging and pushing images...${NC}"
for SERVICE in "${SERVICES[@]}"; do
    REPO_NAME="$ECR_REPO_PREFIX/$SERVICE"
    ECR_IMAGE="$ECR_BASE_URL/$REPO_NAME:latest"
    LOCAL_IMAGE="springboot-kafka-microservices-$SERVICE:latest"
    
    echo "Processing $SERVICE..."
    
    # Check if image exists locally
    if ! docker images | grep -q "springboot-kafka-microservices-$SERVICE.*latest"; then
        echo -e "${YELLOW}  Image not found locally, building...${NC}"
        docker-compose build "$SERVICE" || {
            echo -e "${RED}  Failed to build $SERVICE${NC}"
            continue
        }
    fi
    
    # Tag the image
    echo "  Tagging: $LOCAL_IMAGE -> $ECR_IMAGE"
    docker tag "$LOCAL_IMAGE" "$ECR_IMAGE"
    
    # Push the image
    echo "  Pushing to ECR..."
    docker push "$ECR_IMAGE"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}  ✓ Successfully pushed $SERVICE${NC}"
    else
        echo -e "${RED}  ✗ Failed to push $SERVICE${NC}"
    fi
    echo ""
done

echo -e "${GREEN}=== Complete ===${NC}"
echo ""
echo "Images available at:"
for SERVICE in "${SERVICES[@]}"; do
    REPO_NAME="$ECR_REPO_PREFIX/$SERVICE"
    echo "  $ECR_BASE_URL/$REPO_NAME:latest"
done

