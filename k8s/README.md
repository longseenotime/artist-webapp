# Kubernetes Deployment for Artist Webapp

This directory contains Kubernetes manifests to deploy the artist webapp to a Kubernetes cluster.

## Prerequisites

- Kubernetes cluster access with Gateway API support
- `kubectl` configured to connect to your cluster
- Docker image: `ghcr.io/longseenotime/artist-webapp:latest`
- Gateway API CRDs installed in the cluster

## Deployment Steps

1. **Create the namespace (optional but recommended):**
   ```bash
   kubectl create namespace artist-webapp
   ```

2. **Deploy the application:**
   ```bash
   # Apply all manifests
   kubectl apply -f k8s/ -n artist-webapp
   
   # Or apply them individually in order:
   kubectl apply -f k8s/configmap.yaml -n artist-webapp
   kubectl apply -f k8s/persistent-volumes.yaml -n artist-webapp
   kubectl apply -f k8s/deployment.yaml -n artist-webapp
   kubectl apply -f k8s/service.yaml -n artist-webapp
   kubectl apply -f k8s/gateway.yaml -n artist-webapp
   ```

3. **Check deployment status:**
   ```bash
   kubectl get pods -n artist-webapp
   kubectl get services -n artist-webapp
   kubectl get pvc -n artist-webapp
   kubectl get httproute -n artist-webapp
   ```

4. **Get the HTTPRoute status:**
   ```bash
   kubectl describe httproute artist-webapp-route -n artist-webapp
   ```

## Configuration

### Storage
- **Database**: 1GB persistent volume for SQLite database
- **Uploads**: 5GB persistent volume for uploaded artwork images
- **Storage Class**: Uses `snow` storage class

### Resources
- **CPU**: 250m request, 500m limit
- **Memory**: 256Mi request, 512Mi limit

### Networking
- **Service Type**: ClusterIP (internal only)
- **Gateway API**: Uses HTTPRoute for external access (no separate Gateway needed)
- **Port**: Service and container both use port 3000
- **Domain**: Configure your domain in `gateway.yaml` (replace `artist-webapp.example.com`)

## Accessing the Application

Once deployed and domain configured:
- **Website**: `http://artist-webapp.example.com/` (replace with your domain)
- **Admin Panel**: `http://artist-webapp.example.com/admin/login`
- **Credentials**: admin / admin123

**Important**: Update the hostname in `k8s/gateway.yaml` to match your actual domain before deploying.

## Scaling

To scale the application:
```bash
kubectl scale deployment artist-webapp --replicas=3 -n artist-webapp
```

## Updating the Application

To update to a new version:
```bash
kubectl set image deployment/artist-webapp artist-webapp=ghcr.io/longseenotime/artist-webapp:latest -n artist-webapp
```

## Troubleshooting

View logs:
```bash
kubectl logs -f deployment/artist-webapp -n artist-webapp
```

Describe resources:
```bash
kubectl describe deployment artist-webapp -n artist-webapp
kubectl describe service artist-webapp-service -n artist-webapp
```

## Cleanup

To remove the application:
```bash
kubectl delete -f k8s/ -n artist-webapp
kubectl delete namespace artist-webapp
```

## Notes

- The application uses persistent volumes to maintain data between pod restarts
- Database and uploaded images are stored in separate persistent volumes
- Health checks are configured for both liveness and readiness probes
- The service is configured as LoadBalancer type for external access