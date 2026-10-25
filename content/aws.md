---
name: AWS
icon: ☁️
category: Cloud & DevOps
track: cloud
color: #ff9900
order: 10
description: Amazon Web Services is the largest cloud platform, offering on-demand compute, storage, databases, networking and security without managing physical servers.
---

## What is AWS?
video: aws tutorial for beginners
summary: AWS is a cloud platform offering storage, databases, servers, networking and security on demand.

**AWS (Amazon Web Services)** is a cloud platform that provides services such as storage, databases, servers, networking and security. You rent what you need, pay for what you use, and do not maintain physical servers.

```text
Users
   │
   ▼
AWS Services
```

Common uses: build, deploy and manage applications, host websites and APIs, store data, run machine learning workloads, and back up and recover systems.

### Key Points
* Cloud = rent infrastructure on demand instead of buying hardware.
* Pay-as-you-go pricing.
* Services are organised by region (e.g. `ap-south-1` Mumbai).

## IAM (Identity and Access Management)
video: aws iam users roles policies tutorial
summary: IAM controls who can access AWS resources and what actions they are allowed to perform.

**IAM** controls **who** can access AWS and **what** they can do. Its main building blocks are:

* **Users** - a person or an account (avoid using the root account day to day).
* **Groups** - collections of users sharing the same permissions.
* **Roles** - temporary permissions assumed by services or users (e.g. a Lambda function reading from S3).
* **Policies** - JSON documents that allow or deny actions on resources.

```json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::my-bucket/*"
}
```

```flow
title: IAM access check
User / Service | assumes a role
IAM Policy check | allow or deny
> allowed
AWS Resources
```

Follow **least privilege**: grant only the permissions needed, and enable **MFA** on the root and admin accounts.

### Key Points
* Never use the root account for daily work.
* Use roles, not long-lived access keys, for services.
* Deny is the default; policies explicitly allow.

## VPC (Virtual Private Cloud)
video: aws vpc subnets tutorial
summary: A VPC is your private, isolated network in AWS, split into public and private subnets with controlled routing.

A **VPC** is your own private network inside AWS. You define its IP range and split it into **subnets**:

* **Public subnet** - has a route to an Internet Gateway; for load balancers and public-facing servers.
* **Private subnet** - no direct internet access; for databases and internal services. Outbound internet access goes through a **NAT Gateway**.

```flow
title: VPC 10.0.0.0/16
Internet
Internet Gateway | entry point to the VPC
Public subnet | Load Balancer
Private subnet | App servers (EC2/ECS)
Private subnet | RDS database
```

Security controls: **Security Groups** (stateful firewall per resource) and **Network ACLs** (stateless rules per subnet).

### Key Points
* Put databases in private subnets, never in public ones.
* Spread subnets across at least two Availability Zones.

## EC2 (Elastic Compute Cloud)
video: aws ec2 instance tutorial
summary: EC2 provides virtual servers in the cloud that you can size, configure and scale to run any application.

**EC2** is a virtual server (instance) in AWS. You choose the CPU, RAM, storage, operating system and network, and you can start or stop it at any time.

Typical uses: host applications, run backend services, install custom software.

```text
Internet
    │
    ▼
EC2 Server (Nginx + Node.js app)
```

Key concepts:

* **Instance types** - families such as `t3` (general purpose, burstable) or `c6i` (compute-optimised).
* **AMI** - the template (OS image) used to launch an instance.
* **Auto Scaling Group** - automatically adds or removes instances based on load.
* **Elastic IP** - a fixed public IP address.

Because servers are managed by you, you must handle OS patches and security updates. Consider managed options (ECS, Lambda) when you do not need that control.

### Key Points
* EC2 = full control, full responsibility.
* Use Auto Scaling Groups behind a load balancer for resilience.

## S3 (Simple Storage Service)
video: aws s3 bucket tutorial
summary: S3 is durable object storage for files such as images, videos, documents and backups.

**S3** is an **object storage** service. You store files (objects) inside **buckets**, and each object is retrieved by its key (name). It is extremely durable and scales without limits.

Use cases: images, videos, documents, backups, static websites, data lakes.

```text
Application
     │
     ▼
  S3 Bucket
```

```bash
aws s3 cp report.pdf s3://my-app-bucket/reports/report.pdf
aws s3 ls s3://my-app-bucket/reports/
```

Storage classes trade cost for access speed: **Standard** (frequent access), **Standard-IA** (infrequent), **Glacier** (archive, cheapest and slowest to retrieve).

Important: buckets are **private by default**. Use presigned URLs or CloudFront for controlled public access rather than making a bucket public.

### Key Points
* Object storage, not a file system.
* Use lifecycle rules to move old objects to cheaper classes.
* Keep buckets private; share with presigned URLs.

## Lambda (Serverless Functions)
video: aws lambda tutorial
summary: Lambda runs your code in response to events without you managing any servers.

**AWS Lambda** runs your code only when it is triggered. You upload a function, set a memory limit and a timeout, and AWS handles the servers, scaling and patching. You pay per request and per millisecond of execution.

Use cases: backend APIs, file processing (resize an image when uploaded to S3), scheduled automation, event handling.

```text
Request
   │
   ▼
Lambda
```

```js
export const handler = async (event) => {
  const name = event.queryStringParameters?.name ?? 'world';
  return { statusCode: 200, body: JSON.stringify({ message: `Hello ${name}` }) };
};
```

Limits to know: maximum run time of 15 minutes per invocation, and **cold starts** (the first call after idle takes longer).

### Key Points
* Serverless: no servers to manage, scales to zero.
* Best for short, event-driven tasks.
* Keep functions small and stateless.

## API Gateway
video: aws api gateway lambda tutorial
summary: API Gateway creates, secures and manages HTTP APIs that route requests to backends such as Lambda.

**API Gateway** creates and manages the HTTP endpoints of your application. It receives requests, checks authentication, applies throttling, and forwards the request to a backend such as Lambda.

Responsibilities:

* Receive API requests.
* Call Lambda (or EC2, ECS, or another HTTP endpoint).
* Secure APIs with IAM, Cognito, or JWT authorizers.
* Throttle and rate-limit clients.

```flow
direction: right
Client
API Gateway | auth, throttling, routing
Lambda | backend function
```

Two types: **REST APIs** (more features) and **HTTP APIs** (cheaper, faster, simpler).

### Key Points
* Public entry point for serverless backends.
* Use authorizers so Lambda only runs for authenticated users.

## DynamoDB
video: aws dynamodb tutorial for beginners
summary: DynamoDB is a fully managed NoSQL key-value and document database with single-digit millisecond performance at any scale.

**DynamoDB** is a fully managed NoSQL database. You do not manage servers, it scales automatically, and reads/writes take single-digit milliseconds.

Core ideas:

* **Partition key** (required) decides where an item is stored. Choose a key with high cardinality (e.g. `userId`) to spread load.
* **Sort key** (optional) orders items with the same partition key (e.g. `orderDate`).
* Access by key is fast; scanning the whole table is expensive. Design tables around your **access patterns**.

```text
Table: Orders
PK = userId   SK = orderId    attributes...
u#1           o#100           total=500
u#1           o#101           total=250
u#2           o#200           total=900
```

Use cases: user data, orders, sessions, shopping carts, leaderboards.

Example query with the CLI:

```bash
aws dynamodb get-item \
  --table-name Orders \
  --key '{"userId":{"S":"u#1"},"orderId":{"S":"o#100"}}'
```

### Key Points
* Model tables around access patterns, not around entities.
* Avoid hot partition keys.
* Scans are expensive; prefer queries by key.

## Step Functions
video: aws step functions tutorial
summary: Step Functions orchestrate multiple AWS services into a visual workflow with retries, branches and error handling.

**Step Functions** connect several AWS services into one workflow (a **state machine**). Each step can call a Lambda function or another service, and Step Functions handles ordering, retries, branches and errors.

Use cases: automate multi-step tasks, run several Lambda functions in sequence, build order-processing or approval workflows.

```flow
Start
Lambda | validate order
Lambda | charge payment
End
```

It keeps state between steps, so you do not have to write retry and wait logic inside your Lambda code.

### Key Points
* Use it to coordinate multiple services with visibility into each step.
* Standard workflows for long jobs; Express workflows for high-volume short jobs.

## SQS and SNS (Messaging)
video: aws sqs sns tutorial
summary: SQS is a message queue for decoupling and buffering work, while SNS publishes notifications to many subscribers.

**SQS (Simple Queue Service)** is a managed **message queue**. A producer sends a message, and a consumer picks it up later. It absorbs spikes and decouples services.

**SNS (Simple Notification Service)** is a **publish/subscribe** topic. One message is pushed to many subscribers (email, SMS, SQS queues, Lambda, HTTP).

A common pattern is **SNS fan-out to SQS**:

```flow
title: SNS fan-out to SQS
Order Service | publishes an event
SNS topic "orders" | one message, many subscribers
SQS inventory-queue || SQS billing-queue || Email | via SNS
Inventory worker || Billing worker
```

| | SQS | SNS |
|---|-----|-----|
| Model | Queue (one consumer gets each message) | Pub/sub (all subscribers get it) |
| Pull or push | Consumers poll | Pushes to subscribers |

### Key Points
* SQS = buffer work; SNS = broadcast events.
* Use dead-letter queues (DLQ) for messages that keep failing.

## RDS (Relational Database Service)
video: aws rds postgresql tutorial
summary: RDS runs managed relational databases such as PostgreSQL and MySQL with automated backups, patching and failover.

**RDS** runs managed relational databases (PostgreSQL, MySQL, MariaDB, SQL Server, Oracle). AWS handles installation, patching, automated backups and failover, while you keep full SQL.

Key features:

* **Multi-AZ** - a synchronous standby in another Availability Zone takes over automatically if the primary fails.
* **Read replicas** - scale read traffic.
* **Automated backups and point-in-time recovery.**
* **Storage auto scaling.**

```flow
App | in a private subnet
RDS Primary | AZ-a
> sync and async replication
Standby | AZ-b, synchronous || Read Replica | asynchronous
```

Use RDS when you need a relational database but do not want to manage the server. Use **Aurora** for higher performance with PostgreSQL/MySQL compatibility.

### Key Points
* Multi-AZ is for availability; read replicas are for read scaling.
* Keep RDS in private subnets and restrict access with security groups.

## CloudWatch
video: aws cloudwatch logs alarms tutorial
summary: CloudWatch collects logs and metrics from AWS resources and triggers alarms when thresholds are crossed.

**CloudWatch** monitors AWS applications and infrastructure. It stores **logs**, records **metrics** and raises **alarms**.

* **Logs** - application and service logs (Lambda writes its logs here automatically).
* **Metrics** - CPU, memory, request counts, error rate.
* **Alarms** - notify (via SNS) or trigger Auto Scaling when a metric crosses a threshold.
* **Dashboards** - visual overview of health.

```flow
Application
CloudWatch | logs + metrics
Alarm | threshold crossed
SNS
Email / Slack
```

### Key Points
* Enable logs for every service; they are your first debugging tool.
* Alarms turn metrics into action.

## ECS (Elastic Container Service)
video: aws ecs fargate tutorial
summary: ECS runs Docker containers on AWS, either on EC2 instances or serverless with Fargate.

**ECS** runs Docker containers on AWS. You define a **task definition** (which image, CPU, memory, ports) and a **service** (how many copies to keep running). ECS places and restarts containers for you.

Launch types:

* **Fargate** - serverless containers; you specify CPU and memory, AWS manages the servers.
* **EC2** - containers run on EC2 instances you manage.

Use cases: deploy containers, run microservices, scale applications.

```flow
Docker Image | from ECR
ECS Task Definition | image, CPU, memory, ports
ECS Service | runs N tasks behind a load balancer
```

### Key Points
* Fargate removes server management; EC2 gives more control and cost options.
* Pair ECS services with an Application Load Balancer.

## Docker
video: docker tutorial for beginners
summary: Docker packages an application and all its dependencies into a portable container that runs the same everywhere.

**Docker** packages an application and its dependencies into a **container**. A container runs the same way on your laptop, a test server and in production, which removes "it works on my machine" problems.

Key terms:

* **Dockerfile** - the recipe for building an image.
* **Image** - a read-only template built from the Dockerfile.
* **Container** - a running instance of an image.

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t my-api:1.0 .
docker run -p 3000:3000 my-api:1.0
```

```flow
Code
Docker Image | built from the Dockerfile
Container | running instance
```

### Key Points
* Image = blueprint; container = running copy.
* Keep images small (alpine base, multi-stage builds).
* Never bake secrets into an image.

## ECR (Elastic Container Registry)
video: aws ecr docker push tutorial
summary: ECR is AWS's private registry for storing and versioning Docker images that ECS and EKS pull from.

**ECR** is AWS's managed Docker registry. It is the place where you push your images so ECS or EKS can pull them securely. It integrates with IAM, so access is controlled by permissions rather than public passwords.

```bash
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-south-1.amazonaws.com

docker tag my-api:1.0 123456789012.dkr.ecr.ap-south-1.amazonaws.com/my-api:1.0
docker push 123456789012.dkr.ecr.ap-south-1.amazonaws.com/my-api:1.0
```

### Key Points
* ECR is the AWS equivalent of Docker Hub, but private and IAM-controlled.
* Enable image scanning to find vulnerabilities.

## DockerHub
video: docker hub push pull images
summary: Docker Hub is a public online registry where you store, pull and share Docker images.

**Docker Hub** stores Docker images online. You push images you build, pull images others published (for example `node` or `postgres`), and share your own publicly or privately.

```text
Docker Image
      │
      ▼
 Docker Hub
```

```bash
docker push yourname/my-api:1.0
docker pull postgres:16
```

Use Docker Hub for public base images. For private company images on AWS, many teams use ECR instead.

### Key Points
* Push and pull images by name and tag.
* Avoid `latest` in production; pin versions.

## GitHub Actions
video: github actions tutorial deploy
summary: GitHub Actions runs automated workflows that build, test and deploy your code whenever events like a push occur.

**GitHub Actions** automates build, test and deployment directly from your repository. You describe a **workflow** in a YAML file, and it runs on events such as a push or pull request.

Use cases: build the project, run tests, deploy the application.

```text
Git Push
    │
    ▼
GitHub Actions
```

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-deploy
          aws-region: ap-south-1
```

Store secrets in **GitHub Secrets** and use OIDC to assume an AWS IAM role, so you do not need long-lived access keys.

### Key Points
* Workflow → jobs → steps.
* Use OIDC with IAM roles instead of storing AWS keys.

## CI/CD
video: ci cd pipeline explained
summary: CI/CD automatically builds, tests and deploys code so releases are faster and less error-prone.

**CI (Continuous Integration)** means every change is automatically built and tested as soon as it is merged. **CD (Continuous Delivery/Deployment)** means a tested change is automatically released to an environment (delivery stops before production; deployment goes all the way).

```flow
direction: right
Code
Build
Test
Deploy
```

Benefits: faster deployment, less manual work, smaller and safer changes, and continuous updates.

### Key Points
* CI catches bugs early; CD removes manual release steps.
* Pipeline stages: build, test, scan, deploy, verify.

## Serverless Architecture
video: aws serverless architecture api gateway lambda dynamodb
summary: A serverless architecture combines API Gateway, Lambda and managed data stores so you run no servers at all.

A **serverless** architecture uses managed services end to end. Here a request flows through API Gateway into Lambda, which reads and writes managed storage.

```flow
Client
API Gateway
Lambda
S3 || DynamoDB
```

Benefits: no servers to patch, automatic scaling, pay only for usage. Trade-offs: cold starts, execution time limits, and harder local debugging.

### Key Points
* Ideal for variable or spiky traffic.
* Watch cold starts and vendor lock-in.

## Container Deployment
video: aws container deployment github actions ecs
summary: A typical container pipeline builds the image in GitHub Actions, stores it in a registry and runs it on ECS.

Full pipeline from code to running containers on AWS:

```flow
Developer
GitHub
GitHub Actions | build, test, docker build
ECR (or DockerHub) | store image
ECS | run containers behind a load balancer
```

Steps in short: push code → Actions builds the image → pushes it to ECR tagged with the commit SHA → updates the ECS service to use the new task definition → ECS performs a rolling deployment.

### Key Points
* Tag images with the commit SHA for traceability.
* ECS rolling deployments give zero-downtime releases when health checks pass.

## Quick Revision
video: aws services overview for beginners
summary: A one-table recap of the core AWS services and what each one is used for.

| Service | Purpose |
|---------|---------|
| IAM | Manage users and permissions |
| VPC | Private network |
| EC2 | Virtual servers |
| S3 | Store files |
| Lambda | Run code without servers |
| API Gateway | Create and secure APIs |
| DynamoDB | NoSQL database |
| RDS | Managed relational database |
| SQS / SNS | Queues and notifications |
| Step Functions | Workflows |
| CloudWatch | Logs and monitoring |
| Docker | Containerization |
| ECR / DockerHub | Store Docker images |
| GitHub Actions | CI/CD |
| ECS | Run Docker containers |

### Key Points
* Compute: EC2, Lambda, ECS. Storage: S3. Database: DynamoDB, RDS. Network: VPC. Security: IAM.
