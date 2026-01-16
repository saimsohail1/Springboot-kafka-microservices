# Event-Driven Microservices with Kafka

This project implements an event-driven microservices architecture using Spring Boot and Apache Kafka.

## Architecture

- **Order Service** (Port 8081): Creates orders and publishes `OrderCreatedEvent` to Kafka
- **Inventory Service** (Port 8082): Consumes order events and updates inventory
- **Payment Service** (Port 8083): Consumes order events and creates payment records

## Prerequisites

1. **Docker Desktop** - For running Kafka and Zookeeper
2. **PostgreSQL** - Database for all three services
3. **Java 21+** - JDK 21 or higher
4. **Maven** - Build tool

## Setup Instructions

### 1. Start Docker Desktop
Ensure Docker Desktop is running on your machine.

### 2. Start PostgreSQL
Make sure PostgreSQL is running on `localhost:5432` with:
- Username: `postgres`
- Password: `1234`

If using Homebrew:
```bash
brew services start postgresql@14  # or your version
```

Create the databases:
```bash
psql -U postgres -h localhost
CREATE DATABASE orders;
CREATE DATABASE inventory;
CREATE DATABASE payments;
\q
```

### 3. Start Kafka and Zookeeper
```bash
docker-compose up -d
```

Wait a few seconds for Kafka to be ready.

### 4. Build the Services
```bash
export PATH=/opt/maven/bin:$PATH  # If Maven is not in PATH

cd Order-service && mvn clean package -DskipTests && cd ..
cd Inventory-service && mvn clean package -DskipTests && cd ..
cd Payment-service && mvn clean package -DskipTests && cd ..
```

### 5. Start the Services

**Option 1: Using the provided script**
```bash
./start-services.sh
```

**Option 2: Manual start (in separate terminals)**

Terminal 1 - Order Service:
```bash
cd Order-service
mvn spring-boot:run
```

Terminal 2 - Inventory Service:
```bash
cd Inventory-service
mvn spring-boot:run
```

Terminal 3 - Payment Service:
```bash
cd Payment-service
mvn spring-boot:run
```

### 6. Test the Flow

**Option 1: Using the test script**
```bash
./test-flow.sh
```

**Option 2: Manual testing**

1. Create an order:
```bash
curl -X POST http://localhost:8081/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PROD-001",
    "quantity": 5,
    "price": 99.99
  }'
```

2. Check inventory:
```bash
curl http://localhost:8082/api/inventory/PROD-001
```

3. Check payments:
```bash
curl http://localhost:8083/api/payments
```

4. Get all orders:
```bash
curl http://localhost:8081/api/orders
```

## Event Flow

1. **Order Creation**: POST request to Order Service creates an order in the database
2. **Event Publishing**: Order Service publishes `OrderCreatedEvent` to Kafka topic `order.created`
3. **Inventory Update**: Inventory Service consumes the event and updates stock
4. **Payment Creation**: Payment Service consumes the event and creates a payment record

## Stop Services

**Using the script:**
```bash
./stop-services.sh
```

**Manual:**
- Stop each service (Ctrl+C in each terminal)
- Stop Docker containers: `docker-compose down`

## Service Endpoints

### Order Service (Port 8081)
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders

### Inventory Service (Port 8082)
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/{productId}` - Get inventory for a specific product

### Payment Service (Port 8083)
- `GET /api/payments` - Get all payments
- `POST /api/payments?orderId={id}&amount={amount}` - Create a payment


