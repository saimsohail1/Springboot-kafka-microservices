# Order Service - EKS Deployment

## Prerequisites

1. **EKS Cluster** - An EKS cluster must be created and accessible
2. **kubectl configured** - kubectl must be configured to connect to your EKS cluster
3. **IAM Permissions** - Your AWS user needs EKS permissions
4. **ECR Access** - EKS nodes need permission to pull images from ECR

## Deployment Steps

### Step 1: Create EKS Cluster (if not exists)
```bash
# Check if cluster exists
aws eks list-clusters --region eu-west-1

# If cluster doesn't exist, create one (requires eks:CreateCluster permission)
# This is typically done through AWS Console or eksctl
```

### Step 2: Configure kubectl to connect to EKS
```bash
# Update kubeconfig for your cluster
aws eks update-kubeconfig --name <cluster-name> --region eu-west-1

# Verify connection
kubectl cluster-info
```

### Step 3: Create IAM Role for EKS Node Group (if needed)
The EKS node group needs permission to pull images from ECR:
- Attach `AmazonEC2ContainerRegistryReadOnly` policy to the node group IAM role

### Step 4: Deploy Order Service
```bash
# Apply all manifests
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### Step 5: Verify Deployment
```bash
# Check deployment status
kubectl get deployments -n microservices

# Check pods
kubectl get pods -n microservices

# Check service
kubectl get svc -n microservices

# View logs
kubectl logs -f deployment/order-service -n microservices
```

### Step 6: Access the Service
```bash
# Get LoadBalancer URL
kubectl get svc order-service -n microservices

# Test the service
curl http://<LOADBALANCER-URL>/api/orders
```

## Important Notes

- **Database**: This deployment assumes PostgreSQL and Kafka are available in the cluster
- **Secrets**: Update the secret.yaml with proper database credentials
- **Image Pull**: Ensure EKS nodes can pull from ECR (IAM role permissions)
- **Health Checks**: The deployment uses `/actuator/health` endpoint (add Spring Boot Actuator if not present)

