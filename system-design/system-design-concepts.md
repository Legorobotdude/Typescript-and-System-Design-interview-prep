# System Design Concepts for Interviews

## Key Principles to Remember

1. **Clarify requirements** - Always ask about scale, features, constraints
2. **Start high-level** - Draw the big picture first, then dive into components
3. **Consider trade-offs** - There's no perfect solution, discuss pros/cons
4. **Think about scale** - How does it handle 1M users? 100M users?

---

## Core Concepts

### 1. Scalability Patterns

#### Horizontal vs Vertical Scaling
- **Vertical**: Add more power (CPU, RAM) to existing machine
  - Pros: Simple, no code changes
  - Cons: Hardware limits, single point of failure
- **Horizontal**: Add more machines
  - Pros: Better fault tolerance, scales indefinitely
  - Cons: More complex, requires load balancing

#### Load Balancing
- Distributes traffic across multiple servers
- Algorithms: Round Robin, Least Connections, IP Hash, Weighted
- Layer 4 (TCP) vs Layer 7 (HTTP)

#### Database Scaling
- **Replication**: Copy data across servers (master-slave, master-master)
- **Sharding**: Split data across databases (horizontal partitioning)
- **Partitioning**: Split tables into smaller pieces

### 2. Caching Strategies

#### Cache Levels
1. **Client-side**: Browser cache, mobile app cache
2. **CDN**: Static assets (images, CSS, JS)
3. **Application**: Redis, Memcached
4. **Database**: Query cache, result cache

#### Cache Patterns
- **Cache-Aside**: App checks cache, loads from DB on miss
- **Write-Through**: Write to cache and DB simultaneously
- **Write-Behind**: Write to cache, async write to DB
- **Refresh-Ahead**: Refresh cache before expiration

#### Eviction Policies
- LRU (Least Recently Used)
- LFU (Least Frequently Used)
- FIFO (First In First Out)
- TTL (Time To Live)

### 3. Database Design

#### SQL vs NoSQL
**SQL (PostgreSQL, MySQL)**
- Structured data, complex queries
- ACID transactions
- Relations, joins

**NoSQL**
- **Document**: MongoDB (flexible schema, JSON)
- **Key-Value**: Redis (fast, simple)
- **Column**: Cassandra (wide-column, time-series)
- **Graph**: Neo4j (relationships)

#### Indexing
- B-Tree indexes for equality and range queries
- Hash indexes for exact matches
- Full-text indexes for search
- Composite indexes for multiple columns

#### Normalization vs Denormalization
- **Normalize**: Reduce redundancy, ensure consistency
- **Denormalize**: Improve read performance, accept redundancy

### 4. API Design

#### REST Principles
- Resources (nouns): `/users`, `/posts`
- HTTP Methods: GET, POST, PUT, DELETE, PATCH
- Stateless: Each request independent
- Response codes: 200, 201, 400, 401, 404, 500

#### GraphQL
- Query exactly what you need
- Single endpoint
- Strongly typed schema
- Reduces over-fetching

#### Rate Limiting
- Token bucket
- Leaky bucket
- Fixed window
- Sliding window

### 5. Message Queues & Async Processing

#### When to Use
- Decouple services
- Handle traffic spikes
- Background jobs
- Event-driven architecture

#### Popular Solutions
- **RabbitMQ**: Message broker, routing
- **Kafka**: Distributed streaming, high throughput
- **SQS**: AWS managed queue
- **Redis Pub/Sub**: Simple, fast

#### Patterns
- **Producer-Consumer**: Basic async processing
- **Pub-Sub**: One message, many subscribers
- **Request-Reply**: Async RPC
- **Dead Letter Queue**: Failed message handling

### 6. Microservices Architecture

#### Characteristics
- Independent deployment
- Single responsibility
- Own database per service
- Communicate via APIs

#### Challenges
- Distributed transactions
- Service discovery
- Inter-service communication
- Data consistency

#### Patterns
- **API Gateway**: Single entry point
- **Circuit Breaker**: Fail fast, prevent cascading failures
- **Service Mesh**: Observability, security (Istio)
- **Saga Pattern**: Distributed transactions

### 7. Security & Auth

#### Authentication vs Authorization
- **Authentication**: Who are you? (Login)
- **Authorization**: What can you do? (Permissions)

#### Common Patterns
- **Session-based**: Server stores session, cookie holds ID
- **Token-based**: JWT, stateless
- **OAuth 2.0**: Third-party login
- **API Keys**: Service-to-service

#### Security Measures
- HTTPS/TLS
- Rate limiting
- Input validation
- SQL injection prevention
- XSS prevention
- CSRF tokens

### 8. Monitoring & Observability

#### The Three Pillars
1. **Metrics**: CPU, memory, request rate, latency
2. **Logs**: Application events, errors
3. **Traces**: Request flow across services

#### Key Metrics
- **Latency**: Response time (p50, p95, p99)
- **Throughput**: Requests per second
- **Error Rate**: Failed requests / total requests
- **Saturation**: Resource utilization

---

## Common Interview Questions

### 1. Design a URL Shortener
**Requirements**: Shorten URLs, redirect, analytics
**Components**:
- Load balancer
- API servers (generate short URL, redirect)
- Database (URL mapping)
- Cache (popular URLs)
- Analytics service

**Key Decisions**:
- ID generation: Base62 encoding, hash function, counter
- Database: SQL for consistency, NoSQL for scale
- Cache: Redis for hot URLs

### 2. Design a Rate Limiter
**Requirements**: Limit requests per user/IP
**Algorithms**:
- Token bucket
- Leaky bucket
- Fixed window counter
- Sliding window log

**Implementation**:
- In-memory (single server): Map with counters
- Distributed: Redis with TTL
- Middleware: Check before processing

### 3. Design a Chat System
**Requirements**: 1-on-1, group chat, real-time
**Components**:
- WebSocket servers (real-time connection)
- Message queue (delivery guarantee)
- Database (message history)
- Presence service (online/offline)

**Key Decisions**:
- Protocol: WebSocket vs Long Polling
- Message delivery: At-least-once, exactly-once
- Storage: Sharding by conversation ID

### 4. Design Instagram/Twitter Feed
**Requirements**: Post, follow, timeline
**Components**:
- User service
- Post service
- Timeline service
- Media storage (S3)
- CDN (images)

**Key Decisions**:
- Fan-out approach: Write vs Read
  - Fan-out on write: Pre-compute timeline (fast read, slow write)
  - Fan-out on read: Compute on request (fast write, slow read)
  - Hybrid: Fan-out for small followers, read for celebrities

### 5. Design Notification System
**Requirements**: Email, SMS, push, in-app
**Components**:
- API Gateway
- Notification service
- Message queue
- Template service
- Provider integration (SendGrid, Twilio)

**Challenges**:
- Prevent duplicates: Deduplication
- Handle failures: Retry with backoff
- Rate limiting: Per user, per provider

---

## Estimation & Back-of-Envelope Calculations

### Key Numbers to Know
- 1 million = 10^6
- 1 billion = 10^9
- QPS (Queries Per Second) = Daily active users × Avg actions / 86400

### Storage Estimates
- 1 KB = 1,000 bytes
- 1 MB = 1,000 KB
- 1 GB = 1,000 MB
- 1 TB = 1,000 GB

### Latency Numbers
- Memory: 100 ns
- SSD: 100 μs
- Network (same datacenter): 500 μs
- Disk: 10 ms
- Network (cross-continent): 100 ms

### Example Calculation
**Problem**: Design Twitter, estimate storage for 1 year
- 500M daily active users
- Each user tweets 2 times/day
- Average tweet: 300 bytes

**Calculation**:
- Daily tweets: 500M × 2 = 1B tweets/day
- Daily storage: 1B × 300 bytes = 300 GB/day
- Yearly storage: 300 GB × 365 ≈ 110 TB/year

---

## Interview Strategy

### 1. Clarify (5 min)
- Users: How many? Daily active?
- Features: Core vs nice-to-have
- Scale: Read/write ratio
- Performance: Latency requirements

### 2. High-Level Design (10 min)
- Draw boxes: Client, LB, Servers, DB, Cache
- Data flow: Request → Response
- Main components and responsibilities

### 3. Deep Dive (20 min)
- Database schema
- API design
- Algorithm details
- Scaling strategy

### 4. Wrap Up (5 min)
- Bottlenecks
- Trade-offs made
- Monitoring & alerts
- Future improvements

### Tips
- **Think aloud**: Explain your reasoning
- **Ask questions**: Don't assume
- **Consider trade-offs**: No perfect solution
- **Draw diagrams**: Visual > words
- **Start simple**: Add complexity gradually
- **Know your numbers**: Latency, QPS, storage
