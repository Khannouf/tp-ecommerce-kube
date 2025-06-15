# doc

## 🏗️ Architecture

Le projet est composé de trois microservices principaux :

- **Product Service** - Gestion des produits et stocks
- **Cart Service** - Gestion des paniers utilisateur
- **Order Service** - Gestion des commandes

## 📁 Structure du Projet

```
ecommerce-microservices/
│
├── product-service/                    # 🛍️ Microservice Produits
│   ├── src/
│   │   ├── product/
│   │   │   ├── entities/
│   │   │   │   └── product.entity.ts
│   │   │   ├── dto/
│   │   │   │   └── get-product.dto.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   └── product.module.ts
│   │   ├── stock/
│   │   │   ├── entities/
│   │   │   │   └── stock.entity.ts
│   │   │   ├── stock.service.ts
│   │   │   └── stock.module.ts
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   └── database.service.ts
│   │   ├── config.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── deploy/
│   │   ├── local/
│   │   │   ├── docker-compose.yml
│   │   │   └── init-db.sql
│   │   └── local-k8s/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── configmap.yaml
│   │       ├── secret.yaml
│   │       └── httproute.yaml
│   ├── Dockerfile
│   ├── Makefile
│   └── package.json
│
├── cart-service/                       # 🛒 Microservice Panier
│   ├── src/
│   │   ├── cart/
│   │   │   ├── entities/
│   │   │   │   ├── cart.entity.ts
│   │   │   │   └── cart-product.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-cart.dto.ts
│   │   │   │   └── update-cart.dto.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.service.ts
│   │   │   └── cart.module.ts
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── database.service.ts
│   │   ├── config.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── deploy/
│   │   ├── local/
│   │   │   ├── docker-compose.yml
│   │   │   └── init-db.sql
│   │   └── local-k8s/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── configmap.yaml
│   │       ├── secret.yaml
│   │       └── httproute.yaml
│   ├── Dockerfile
│   └── package.json
│
├── order-service/                      # 📦 Microservice Commandes
│   ├── src/
│   │   ├── order/
│   │   │   ├── entities/
│   │   │   │   ├── order.entity.ts
│   │   │   │   └── order-product.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-order.dto.ts
│   │   │   │   └── update-order.dto.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   └── order.module.ts
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── database.service.ts
│   │   ├── config.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── deploy/
│   │   ├── local/
│   │   │   ├── docker-compose.yml
│   │   │   └── init-db.sql
│   │   └── local-k8s/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── configmap.yaml
│   │       ├── secret.yaml
│   │       └── httproute.yaml
│   ├── Dockerfile
│   └── package.json
│
└── README.md                           # Documentation principale

# Caractéristiques d'architecture microservices :
# ✅ Services indépendants avec leurs propres bases de données
# ✅ Communication via HTTP/REST APIs
# ✅ Déploiement containerisé séparé (Docker + Kubernetes)
# ✅ Configuration et secrets isolés par service
# ✅ Gestion des migrations de base de données autonome
# ✅ Possibilité de scaler individuellement chaque service

```

## 🚀 Technologies Utilisées

- **Framework** : NestJS
- **Base de données** : PostgreSQL
- **ORM** : TypeORM
- **Language** : TypeScript
- **Conteneurisation** : Docker
- **Orchestration** : Kubernetes
- **Tests** : Jest

## 📋 Services Détaillés

### Product Service (Port 3000)

**Responsabilités :**

- Gestion du catalogue produits
- Gestion des stocks
- API de consultation des produits

**Entités principales :**

- `Product` : Informations produit (nom, description, prix, image, stock)
- `Stock` : Gestion des quantités en stock

**Endpoints :**

- `GET /products` - Liste tous les produits
- `GET /products/:id` - Détails d'un produit

**Base de données :** `products`

### Cart Service (Port 3000)

**Responsabilités :**

- Gestion des paniers utilisateur
- Ajout/suppression de produits dans le panier
- Validation de disponibilité des produits via Product Service

**Entités principales :**

- `Cart` : Panier utilisateur
- `CartProduct` : Produits dans le panier avec quantités

**Endpoints :**

- `GET /cart` - Récupère le panier de l'utilisateur (via header `x-user-id`)
- `GET /cart/getCart/:userId` - Récupère le panier par ID utilisateur
- `PATCH /cart` - Met à jour le panier (ajouter/modifier quantités)
- `DELETE /cart` - Vide le panier

**Validation des stocks :**
Le Cart Service vérifie la disponibilité des produits via le champ `isAvailable` retourné par le Product Service, mais ne fait pas de validation de stock détaillée.

**Base de données :** `cart`

### Order Service (Port 3000)

**Responsabilités :**

- Création de commandes à partir des paniers
- Validation des stocks et prix avant commande
- Historique des commandes
- Suppression automatique du panier après commande réussie

**Entités principales :**

- `Order` : Commande avec statut et prix total
- `OrderProduct` : Produits commandés avec quantités

**Endpoints :**

- `POST /order` - Crée une commande à partir du panier (via header `x-user-id`)
- `GET /order` - Liste toutes les commandes
- `GET /order/:id` - Détails d'une commande

**Validation avancée :**
L'Order Service effectue une validation complète :

- Vérification des stocks disponibles pour chaque produit
- Calcul du prix total
- Validation des quantités demandées vs stock disponible

**Base de données :** `order`

## 🔄 Communication Inter-Services

Les services communiquent via HTTP/REST :

- **Cart Service** → **Product Service** : Validation de l'existence et disponibilité des produits (champ `isAvailable`)
- **Order Service** → **Product Service** : Validation des produits et vérification des stocks détaillés
- **Order Service** → **Cart Service** : Récupération du panier complet et suppression après commande

**Points importants :**

- Le Cart Service vérifie uniquement la disponibilité basique (`isAvailable`)
- L'Order Service effectue la validation de stock complète avant création de commande
- La validation de stock se fait au niveau de l'Order Service pour éviter les conditions de course

Configuration des URLs de services :

```tsx
PRODUCT_SERVICE_URL: "http://products-service.local.svc.cluster.local"
CART_SERVICE_URL: "http://cart-service.local.svc.cluster.local"

```

## 🗄️ Modèle de Données

### Product Service

```sql
-- Table products
CREATE TABLE product (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  imageUrl VARCHAR,
  stock INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table stock
CREATE TABLE stock (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  productId INTEGER REFERENCES product(id),
  quantity INTEGER NOT NULL
);

```

### Cart Service

```sql
-- Table cart
CREATE TABLE cart (
  id INTEGER PRIMARY KEY,
  userId INTEGER NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table cart_product
CREATE TABLE cart_product (
  id INTEGER PRIMARY KEY,
  cartId INTEGER REFERENCES cart(id) ON DELETE CASCADE,
  productId INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1
);

```

### Order Service

```sql
-- Table orders
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  userId INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  totalPrice DECIMAL(10,2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table orders_product
CREATE TABLE orders_product (
  id INTEGER PRIMARY KEY,
  orderId INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  productId INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1
);

```

## 🏃‍♂️ Démarrage Rapide

### Prérequis

- Node.js 22+
- Docker & Docker Compose
- PostgreSQL (si développement local)

### Installation

1. **Cloner le repository**

```bash
git clone <repository-url>
cd ecommerce-microservices

```

1. **Installer les dépendances pour chaque service**

```bash
# Product Service
cd product-service
npm install
cd ..

# Cart Service
cd cart-service
npm install
cd ..

# Order Service
cd order-service
npm install
cd ..

```

### Développement Local avec Docker Compose

Chaque service dispose de sa propre configuration Docker Compose dans `deploy/local/`:

```bash
# Créer le réseau Docker partagé
docker network create microservices-network-tpecommerce

# Démarrer Product Service
cd product-service/deploy/local
docker-compose up -d

# Démarrer Cart Service
cd ../../cart-service/deploy/local
docker-compose up -d

# Démarrer Order Service
cd ../../order-service/deploy/local
docker-compose up -d

```

### Développement Local (mode dev)

```bash
# Terminal 1 - Product Service
cd product-service
npm run start:dev

# Terminal 2 - Cart Service
cd cart-service
npm run start:dev

# Terminal 3 - Order Service
cd order-service
npm run start:dev

```

## 🐳 Déploiement

### Docker

Chaque service dispose d'un Dockerfile multi-stage optimisé :

```bash
# Build et push des images - Product Service avec Makefile
cd product-service
make build/docker
make push/docker

# Build des autres services
cd ../cart-service
docker build -t cart-service:latest .

cd ../order-service
docker build -t order-service:latest .

```

### Kubernetes

Les manifestes Kubernetes sont disponibles dans `deploy/local-k8s/` pour chaque service :

```bash
# Déploiement sur Kubernetes
kubectl apply -f product-service/deploy/local-k8s/
kubectl apply -f cart-service/deploy/local-k8s/
kubectl apply -f order-service/deploy/local-k8s/

# Charger les images dans kind (si nécessaire)
kind load docker-image product-service:latest
kind load docker-image cart-service:latest
kind load docker-image order-service:latest

```

**Configuration Kubernetes inclut :**

- ConfigMaps pour la configuration
- Secrets pour les credentials
- Deployments avec init containers pour l'initialisation DB
- Services pour l'exposition
- HTTPRoutes pour le routage (Gateway API)

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov

```

## 📊 Monitoring et Observabilité

### Health Checks

Chaque service expose un endpoint de health check configuré dans Kubernetes.

### Logs

Les services utilisent la console standard pour le logging, avec différents niveaux selon l'environnement.

## 🔧 Configuration

### Variables d'Environnement

Chaque service utilise les variables suivantes :

```
# Base de données
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=service_db
DATABASE_SSL=false
DATABASE_SYNC=false

# Services (pour Order et Cart)
PRODUCT_SERVICE_URL=http://localhost:3000
CART_SERVICE_URL=http://localhost:3000

# Application
NODE_ENV=development
PORT=3000

```

### Migrations

```bash
# Créer une migration
npm run migration:create

# Exécuter les migrations
npm run migration:run

# Rollback
npm run migration:revert

```

## 🔐 Sécurité

- Authentification par header `x-user-id`
- Validation des données avec class-validator
- Vérifier les logs des containers en cas de problème
