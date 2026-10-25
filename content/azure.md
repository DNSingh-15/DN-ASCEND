---
name: Azure
icon: 🔵
category: Cloud & DevOps
track: cloud
color: #0078d4
order: 11
description: Microsoft Azure is a cloud platform for building, deploying and managing applications, with strong integration for .NET, Windows and enterprise identity.
---

## What is Azure?
video: azure tutorial for beginners
summary: Azure is Microsoft's cloud platform for storage, databases, servers, networking and security.

**Microsoft Azure** is a cloud platform that provides services such as storage, databases, servers, networking and security. You provision resources on demand, pay for what you use, and avoid maintaining physical hardware.

Remember it like this: **Azure = Microsoft's cloud platform.**

Common uses:

* Build applications
* Deploy applications
* Store data
* Manage cloud resources

### Key Points
* Azure is the second-largest public cloud and integrates tightly with Microsoft products.
* Pay-as-you-go, with reserved pricing for long-term savings.

## Resource Groups
video: azure resource group tutorial
summary: A resource group is a logical container that holds related Azure resources so they can be managed, billed and deleted together.

Every Azure resource (a web app, database, storage account) must belong to a **resource group**. A resource group is a logical folder that groups resources that share a lifecycle, such as all the parts of one application in one environment.

```flow
Subscription | billing
Resource Group | rg-shop-prod
App Service | shop-api || Azure SQL | shop-db || Storage Account | shopassets || Key Vault | shop-kv
```

Benefits:

* Delete the whole environment with one action.
* Apply the same access control (RBAC) and tags to everything in the group.
* See costs grouped by application or environment.

```bash
az group create --name rg-shop-prod --location centralindia
```

### Key Points
* Group by lifecycle and environment (dev, staging, prod).
* Resource groups are free; you pay for the resources inside them.

## Microsoft Entra ID
video: microsoft entra id azure active directory tutorial
summary: Microsoft Entra ID, formerly Azure Active Directory, manages users, groups, logins and permissions.

**Microsoft Entra ID** (formerly Azure Active Directory) is Azure's identity service. It manages **users**, **groups** and **authentication** (login), and controls **who can do what** through roles.

Remember it like this: **Entra ID = Login and Permissions.**

Use cases:

* User authentication (single sign-on to your apps and Microsoft 365).
* Role management with **RBAC** (e.g. "Contributor" on one resource group).
* Securing Azure resources and apps with **managed identities**.

```flow
User | logs in
Entra ID | who are you?
> token
Azure App Service | what can you do?
Azure SQL
```

A **managed identity** lets your app authenticate to other Azure services without storing passwords or keys in code.

### Key Points
* Authentication = proving identity; authorization = RBAC roles.
* Prefer managed identities over connection strings with passwords.

## Azure App Service
video: azure app service tutorial
summary: Azure App Service is a fully managed platform for hosting web apps, REST APIs and backends without managing servers.

**Azure App Service** is a fully managed platform for hosting web applications, REST APIs and backend services. You upload the code, and Azure handles the rest:

* Infrastructure and OS updates
* Runtime installation
* Load balancing
* Scaling
* Security

Use cases: host web apps, host REST APIs, deploy applications, auto-scale, secure hosting with HTTPS.

```text
Users ──► App Service (managed VM fleet, load balanced)
```

The features below are the building blocks you configure for an App Service.

### Key Points
* PaaS: you manage the code, Azure manages the platform.
* Supports .NET, Node.js, Python, Java, PHP and containers.

## App Service: Creating a Web App
video: azure create web app app service portal
summary: Creating a web app means choosing a name, runtime, region and pricing plan in the Azure Portal or CLI.

Creating a **Web App** provisions a new App Service to host your application. You choose:

* A unique name (becomes `name.azurewebsites.net`)
* The **runtime** (Node.js 20, Python 3.12, .NET 8, container)
* The **region** (closest to your users, e.g. Central India)
* The **pricing plan** (App Service Plan: Free, Basic, Standard, Premium)

```bash
az appservice plan create -g rg-shop-prod -n plan-shop --sku B1 --is-linux
az webapp create -g rg-shop-prod -p plan-shop -n shop-api --runtime "NODE:20-lts"
```

```flow
Azure Portal / CLI
Create Web App
Deploy Code
```

### Key Points
* The App Service Plan holds the compute; many apps can share one plan.
* Pick the region near your users and your database.

## App Service: Publishing and Deployment Center
video: azure app service deployment github actions
summary: Publish code to App Service from ZIP, Visual Studio or GitHub, and let the Deployment Center automate releases.

**Publish** deploys your application code to App Service. You can deploy from a ZIP file, Visual Studio, VS Code, or the CLI.

```bash
az webapp deploy --resource-group rg-shop-prod --name shop-api --src-path app.zip
```

The **Deployment Center** connects a source repository for automatic deployments. Connect GitHub, Azure DevOps or Bitbucket and every push triggers a build and deploy (CI/CD).

```flow
GitHub
Deployment Center | builds and deploys on each push
App Service
```

### Key Points
* Publish for one-off deploys; Deployment Center for continuous deployment.
* Use a pipeline to run tests before deploying.

## App Service: Deployment Slots
video: azure app service deployment slots swap
summary: Deployment slots let you test a new version in a staging slot and swap it into production with zero downtime.

A **deployment slot** is a separate live environment attached to your app (for example `staging`). You deploy the new version to the staging slot, test it, then **swap** it with production.

```flow
Deploy v2 | to Staging slot, production still runs v1
Test staging | https://shop-api-staging.azurewebsites.net
Swap slots | Staging <-> Production
Users hit v2 | zero downtime
> rollback: swap again
v1 is back | in seconds
```

```bash
az webapp deployment slot create -g rg-shop-prod -n shop-api --slot staging
az webapp deployment slot swap   -g rg-shop-prod -n shop-api --slot staging
```

Slot-specific settings (such as a staging database connection string) can be marked "deployment slot setting" so they do not swap.

### Key Points
* Slots give zero-downtime releases and instant rollback.
* Use slot settings for values that must differ between environments.

## App Service: Scaling
video: azure app service scale up scale out
summary: Scale App Service vertically to a bigger plan or horizontally to more instances, with autoscale rules based on load.

Scaling increases resources as traffic grows.

* **Vertical scaling (scale up)** - move to a bigger plan (more CPU/RAM per instance). Limited by the largest plan.
* **Horizontal scaling (scale out)** - run more instances behind the built-in load balancer.
* **Autoscale** - rules such as "add an instance when CPU is above 70% for 5 minutes, remove one when below 30%."

```flow
Users
Load Balancer
App 1 || App 2
> scale out when traffic grows
```

Benefits: auto scaling, high availability (instances spread across fault domains), and better performance under load.

```bash
az monitor autoscale create -g rg-shop-prod --resource shop-plan \
  --resource-type Microsoft.Web/serverfarms --min-count 1 --max-count 5 --count 2
```

### Key Points
* Scale out for availability; scale up when a single instance is too small.
* Autoscale rules should use real metrics (CPU, requests, queue length).

## App Service: General Settings
video: azure app service stack settings always on http version
summary: General settings control runtime version, startup command, Always On and HTTP version for the app.

The **General Settings** blade configures the runtime environment:

* **Runtime version** - Node.js, Python, .NET version to run.
* **Startup command** - how to launch the app (e.g. `npm start`, `gunicorn app:app`).
* **Always On** - keeps the app loaded instead of idling out (requires Basic tier or higher). Important for background jobs and to avoid cold starts.
* **HTTP version** - enable HTTP/2 for better performance.

```text
Startup command example:
  gunicorn --bind 0.0.0.0:8000 app:app
```

### Key Points
* Always On prevents the app from sleeping after inactivity.
* Set the startup command explicitly when the platform cannot guess it.

## App Service: Configuration and App Settings
video: azure app service environment variables app settings
summary: Configuration stores environment variables, API keys and connection strings for your app outside the code.

**Configuration** (App Settings and Connection Strings) stores values your app reads at runtime: environment variables, API keys, connection strings and secrets. Keeping them here means you do not hard-code them in source code.

```text
Application
      │
      ▼
Configuration (App Settings / Connection Strings)
```

```bash
az webapp config appsettings set -g rg-shop-prod -n shop-api \
  --settings NODE_ENV=production DB_HOST=shop-db.database.windows.net
```

For sensitive values, store the secret in **Azure Key Vault** and reference it from the app setting, so the value is never shown in plain text:

```text
@Microsoft.KeyVault(SecretUri=https://shop-kv.vault.azure.net/secrets/DbPassword/)
```

### Key Points
* Never commit secrets to Git.
* Use Key Vault references for passwords and API keys.

## App Service: Custom Domain and SSL
video: azure app service custom domain ssl certificate
summary: Map your own domain to App Service and enable free or managed SSL certificates for HTTPS.

A **custom domain** maps your own address (for example `www.company.com`) to the application. Add a CNAME (or A) record at your DNS provider pointing to the app, verify ownership, then add an **SSL certificate** so traffic uses HTTPS.

```text
www.company.com
        │  (DNS CNAME record)
        ▼
Azure App Service (HTTPS with SSL certificate)
```

```bash
az webapp config hostname add -g rg-shop-prod --webapp-name shop-api --hostname www.company.com
```

App Service offers free managed certificates, or you can upload your own.

### Key Points
* Verify domain ownership with a DNS record before binding.
* Enforce HTTPS so all traffic is encrypted.

## App Service: Monitoring
video: azure monitor app insights logs alerts
summary: Azure Monitor and Application Insights collect logs, metrics and alerts to track app health and performance.

App Service sends data to **Azure Monitor**:

* **Logs** - application and platform logs (Log Analytics).
* **Metrics** - response time, HTTP 5xx count, CPU and memory.
* **Alerts** - notify you when a metric crosses a threshold.
* **Application Insights** - traces requests, dependencies and exceptions across your app.

```text
Application
      │
      ▼
Azure Monitor (Logs, Metrics, Alerts)
```

### Key Points
* Turn on Application Insights early; it is the fastest way to find slow requests.
* Create alerts on error rate and response time, not just CPU.

## Azure Blob Storage
video: azure blob storage tutorial
summary: Blob Storage stores unstructured files such as images, videos, documents and backups, similar to AWS S3.

**Azure Blob Storage** stores unstructured data such as images, videos, documents and backups. Think of it as **Azure's S3**.

Concepts:

* **Storage account** - the top-level namespace for your data.
* **Container** - like a bucket; holds blobs.
* **Blob** - the file itself.
* **Access tiers** - Hot (frequent), Cool, Cold and Archive (cheapest, slowest).

```text
Application
     │
     ▼
Blob Storage (Storage Account → Container → Blob)
```

```bash
az storage blob upload --account-name shopassets --container-name invoices \
  --name 2026/inv-001.pdf --file ./inv-001.pdf --auth-mode login
```

Keep containers private and use **SAS** (shared access signature) tokens for time-limited access.

### Key Points
* Blob = object storage; the Azure counterpart of S3.
* Use lifecycle management to move old blobs to Cool or Archive tiers.

## Azure Functions
video: azure functions tutorial serverless
summary: Azure Functions run small pieces of code in response to events without managing servers, like AWS Lambda.

**Azure Functions** runs your code without managing servers. You write a function, pick a **trigger** (HTTP request, timer, blob upload, queue message) and Azure runs it and scales it automatically.

Remember it like this: **Azure Functions = Azure's Lambda.**

Use cases: backend APIs, automation, file processing (resize an image uploaded to Blob Storage), scheduled jobs.

```text
Request
   │
   ▼
Azure Function
```

```js
module.exports = async function (context, req) {
  const name = req.query.name || 'world';
  context.res = { status: 200, body: `Hello ${name}` };
};
```

Hosting plans: **Consumption** (pay per execution, scales to zero), **Premium** (no cold starts), and **Dedicated** (on App Service plans).

### Key Points
* Triggers and bindings wire your function to other services with less code.
* Consumption plan is cheapest for spiky workloads.

## Azure API Management (APIM)
video: azure api management gateway tutorial
summary: API Management creates, secures, throttles and publishes APIs, acting as the Azure equivalent of an API gateway.

**Azure API Management (APIM)** creates, secures, publishes and manages APIs. It is the Azure equivalent of an API Gateway.

Remember it like this: **APIM = Azure API Gateway.**

Responsibilities:

* Receive API requests from clients.
* Call backend services (Functions, App Service, AKS).
* Secure APIs with subscription keys, OAuth/Entra ID and IP filters.
* Apply rate limits, quotas, caching and transformations.
* Provide a developer portal with documentation.

```flow
Client
API Management | auth, throttling, policies
Azure Function | backend
```

### Key Points
* One front door for many backend APIs.
* Policies in APIM let you change behaviour without changing backend code.

## Azure SQL Database
video: azure sql database tutorial
summary: Azure SQL Database is a fully managed relational SQL Server database with automatic backups, patching and high availability.

**Azure SQL Database** is a managed relational database based on SQL Server. Microsoft handles patching, backups, and high availability, while you keep full T-SQL and relational features.

Key features:

* **Service tiers** - General Purpose, Business Critical, Hyperscale and serverless (auto-pause when idle).
* **Automatic backups** with point-in-time restore.
* **Built-in high availability** and optional geo-replication.
* **Firewall rules** and Microsoft Entra authentication.

```sql
CREATE TABLE dbo.Products (
  Id    INT IDENTITY PRIMARY KEY,
  Name  NVARCHAR(200) NOT NULL,
  Price DECIMAL(10,2) NOT NULL
);
```

Use Azure SQL when your data is relational and you need ACID transactions, the same way you would use PostgreSQL elsewhere.

### Key Points
* Managed SQL Server; choose a tier by performance and budget.
* Restrict access with firewall rules and private endpoints.

## Azure Cosmos DB
video: azure cosmos db tutorial
summary: Cosmos DB is a globally distributed, fully managed NoSQL database with low latency, similar to AWS DynamoDB.

**Azure Cosmos DB** is a fully managed, globally distributed NoSQL database. It offers single-digit millisecond reads and writes and can replicate data to many regions with a few clicks.

Remember it like this: **Cosmos DB = Azure's DynamoDB.**

Use cases: store user data, orders and application data at global scale.

```text
Application
      │
      ▼
 Cosmos DB (replicated across regions)
```

Core concepts: **containers** hold items; a **partition key** decides how data is distributed (choose it as carefully as the DynamoDB partition key). APIs include SQL (NoSQL document), MongoDB, Cassandra, Gremlin and Table.

### Key Points
* Choose the partition key from your access patterns.
* Multi-region replication is built in; you choose the consistency level.

## Azure Key Vault
video: azure key vault secrets tutorial
summary: Key Vault securely stores secrets, keys and certificates so applications never hard-code sensitive values.

**Azure Key Vault** securely stores **secrets** (passwords, connection strings), **keys** (encryption keys) and **certificates**. Applications read them at runtime using their managed identity, so no secret lives in code or config files.

```text
App Service (managed identity)
      │  reads secret at runtime (RBAC-controlled)
      ▼
Key Vault ──► DbPassword, StripeKey, TLS cert
```

```bash
az keyvault secret set --vault-name shop-kv --name DbPassword --value "••••••"
```

### Key Points
* Equivalent to AWS Secrets Manager / Parameter Store.
* Combine with managed identity and Key Vault references in App Service.

## Containers
video: azure containers docker tutorial
summary: Containers package an application with its dependencies so it runs the same way everywhere.

A **container** packages an application with all its dependencies so it runs the same everywhere. The image is built once and run in development, testing and production.

Remember it like this: **Containers = Build Once, Run Anywhere.**

```flow
Application
Docker Image | app plus dependencies
Container | runs the same everywhere
```

Use cases: package applications, deploy anywhere, run microservices, simplify deployment.

### Key Points
* A container is an isolated process with its own filesystem and dependencies.
* Containers are the unit of deployment for Container Apps and AKS.

## Docker
video: docker tutorial for beginners
summary: Docker builds images from a Dockerfile and runs them as containers on your machine or in Azure.

**Docker** builds and runs containers. A **Dockerfile** describes how to build an image, and running the image creates a container.

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "-b", "0.0.0.0:8000", "app:app"]
```

```bash
docker build -t shop-api:1.0 .
docker run -p 8000:8000 shop-api:1.0
```

```flow
Code
Docker Image | built from the Dockerfile
Container | running instance
```

### Key Points
* Image = blueprint; container = running instance.
* Keep images small and never store secrets inside them.

## Docker Hub
video: docker hub push pull images
summary: Docker Hub is a public registry for storing, pulling and sharing Docker images.

**Docker Hub** stores Docker images online. You push your images and pull public images such as `node` or `nginx`.

```text
Docker Image
      │
      ▼
Docker Hub
```

```bash
docker push yourname/shop-api:1.0
```

For private images used in Azure, many teams use **Azure Container Registry (ACR)** instead. It keeps images inside your Azure subscription and integrates with Entra ID and managed identities.

### Key Points
* Docker Hub is public by default; use private repositories for company code.
* ACR is the Azure-native private registry.

## Azure Container Registry (ACR)
video: azure container registry acr docker push
summary: ACR is Azure's private registry for storing Docker images that Container Apps and AKS pull at deploy time.

**Azure Container Registry (ACR)** is a private Docker registry inside your Azure subscription. It is where you push the images that Container Apps or AKS will run. Access is controlled with Entra ID and RBAC, so you do not need shared passwords.

```bash
az acr create -g rg-shop-prod -n shopacr --sku Basic
az acr login --name shopacr
docker tag shop-api:1.0 shopacr.azurecr.io/shop-api:1.0
docker push shopacr.azurecr.io/shop-api:1.0
```

### Key Points
* ACR is the Azure equivalent of AWS ECR.
* Use managed identity for pulls from Container Apps instead of admin credentials.

## Azure Container Apps
video: azure container apps tutorial
summary: Container Apps runs containers serverlessly with automatic scaling, including scale to zero, without managing Kubernetes.

**Azure Container Apps** runs containers without you managing servers or Kubernetes clusters. It scales automatically (including down to zero instances) and supports HTTP-based and event-driven scaling.

Use cases: deploy containers, host microservices, auto scaling.

```text
Docker Image (from ACR)
      │
      ▼
Container Apps
```

```bash
az containerapp create -g rg-shop-prod -n shop-api \
  --environment shop-env --image shopacr.azurecr.io/shop-api:1.0 \
  --ingress external --target-port 8000
```

### Key Points
* Best choice for most container workloads that do not need full Kubernetes.
* Scale to zero keeps idle costs low.

## Azure Kubernetes Service (AKS)
video: azure kubernetes service aks tutorial
summary: AKS is Azure's managed Kubernetes service for orchestrating large fleets of containers.

**Azure Kubernetes Service (AKS)** is a managed Kubernetes service. Kubernetes orchestrates containers: it schedules them, restarts failed ones, does rolling updates, and scales them. Azure manages the control plane for you.

Use cases: orchestrate containers, scale large applications, run complex microservice platforms.

```text
Docker Image
      │
      ▼
AKS Cluster (pods, services, autoscaling)
```

AKS is more powerful but more complex than Container Apps. Choose it when you need full Kubernetes features or control.

### Key Points
* Container Apps for simplicity; AKS for full Kubernetes control.
* Kubernetes concepts to know: pod, deployment, service, ingress.

## GitHub Actions
video: github actions tutorial deploy azure
summary: GitHub Actions builds, tests and deploys your code to Azure whenever changes are pushed.

**GitHub Actions** automates build, test and deployment from your repository. Workflows live in `.github/workflows` and run on events such as a push.

Use cases: build the project, run tests, deploy the application to Azure.

```text
Git Push
    │
    ▼
GitHub Actions
```

```yaml
# .github/workflows/deploy.yml
name: Deploy to Azure
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      - uses: azure/webapps-deploy@v3
        with:
          app-name: shop-api
          package: .
```

Authenticate with **OIDC federated credentials** through Entra ID, so no long-lived secret is stored.

### Key Points
* Store IDs and secrets in GitHub Secrets; prefer OIDC over passwords.
* Workflow → jobs → steps.

## CI/CD
video: ci cd pipeline explained
summary: CI/CD automatically builds, tests and deploys code so releases are fast, repeatable and low-risk.

**CI (Continuous Integration)** builds and tests every change as it is merged. **CD (Continuous Delivery/Deployment)** releases tested changes automatically to an environment.

```flow
direction: right
Code
Build
Deploy
```

Benefits: faster deployment, less manual work, and continuous updates. On Azure you can use GitHub Actions, Azure DevOps Pipelines, or the Deployment Center for App Service.

### Key Points
* Automate build, test, and deploy; keep manual approvals for production where needed.
* Use environment-specific configuration and slots or revisions for safe releases.

## Container Deployment Flow
video: azure container deployment github actions container apps
summary: The full path from a developer's push through GitHub Actions and ACR to Container Apps or AKS.

The full pipeline from code to running containers on Azure:

```flow
Developer
GitHub
GitHub Actions | build image, run tests
Docker Hub / ACR | store image
Container Apps / AKS | run containers
```

Steps in short: push code → Actions builds the image → pushes it to ACR tagged with the commit SHA → deploys a new revision to Container Apps (or updates the AKS deployment) → traffic shifts once health checks pass.

### Key Points
* Prefer ACR over Docker Hub for private images on Azure.
* Tag images with the commit SHA so every deployment is traceable.

## Quick Revision
video: azure services overview for beginners
summary: A one-table recap of the core Azure services and what each one is used for.

| Service | Purpose |
|---------|---------|
| Resource Group | Group related resources |
| Entra ID | Users, login and permissions |
| App Service | Host web apps and APIs |
| Blob Storage | Store files (Azure S3) |
| Azure Functions | Run code without servers (Azure Lambda) |
| API Management | Create and secure APIs (Azure API Gateway) |
| Azure SQL | Managed relational database |
| Cosmos DB | Managed NoSQL database (Azure DynamoDB) |
| Key Vault | Store secrets and keys |
| Docker / Docker Hub | Build and share containers |
| ACR | Private container registry |
| Container Apps | Serverless containers |
| AKS | Managed Kubernetes |
| GitHub Actions | CI/CD |

### Key Points
* Compute: App Service, Functions, Container Apps, AKS. Storage: Blob. Data: Azure SQL, Cosmos DB. Security: Entra ID, Key Vault.
