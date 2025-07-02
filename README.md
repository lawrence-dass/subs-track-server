# 📊 Subs-Track Server

A comprehensive subscription tracking API built with Node.js and Express that helps users manage and monitor their recurring subscriptions.

## ✨ Features

- 🔐 **User Authentication** - JWT-based secure authentication
- 📋 **Subscription Management** - Create, read, update, delete, and cancel subscriptions
- 🆓 **Trial Support** - Comprehensive trial subscription handling
- 🌐 **Website Integration** - Track subscription websites
- 🔒 **Security** - Arcjet integration for enhanced security
- 📧 **Email Notifications** - Automated email reminders (coming soon)
- ⚡ **Workflow Automation** - Upstash workflow integration
- 🚀 **Production Ready** - Environment-based configuration

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Security**: Arcjet protection
- **Workflow**: Upstash Workflow
- **Email**: Nodemailer
- **Deployment**: Vercel
- **Development**: Nodemon, ESLint

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd substrack-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.development.local` file in the root directory:
   ```env
   # Server Configuration
   PORT=5500
   NODE_ENV=development
   SERVER_URL=http://localhost:5500
   
   # Database
   DB_URI=mongodb://localhost:27017/substrack
   # OR for MongoDB Atlas:
   # DB_URI=mongodb+srv://username:password@cluster.mongodb.net/substrack
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # Arcjet Security
   ARCJET_ENV=development
   ARCJET_KEY=your-arcjet-key
   
   # Upstash Workflow
   QSTASH_URL=https://qstash.upstash.io
   QSTASH_TOKEN=your-qstash-token
   QSTASH_CURRENT_SIGNING_KEY=your-current-signing-key
   QSTASH_NEXT_SIGNING_KEY=your-next-signing-key
   
   # Email Configuration
   EMAIL_PASSWORD=your-email-app-password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5500`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/signup` | Register new user | ❌ |
| POST | `/api/v1/auth/signin` | User login | ❌ |
| POST | `/api/v1/auth/signout` | User logout | ❌ |

### Subscriptions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/subscriptions/` | Create subscription | ✅ |
| GET | `/api/v1/subscriptions/user/:id` | Get user subscriptions | ✅ |
| PUT | `/api/v1/subscriptions/:id` | Edit subscription | ✅ |
| PUT | `/api/v1/subscriptions/:id/cancel` | Cancel subscription | ✅ |
| DELETE | `/api/v1/subscriptions/:id` | Delete subscription | ✅ |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users/` | Get all users | ✅ |

## 📋 Schema Documentation

### User Schema
```javascript
{
  name: String,          // Required, 2-50 characters
  email: String,         // Required, unique, valid email
  password: String,      // Required, min 6 characters (hashed)
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

### Subscription Schema
```javascript
{
  name: String,          // Required, 2-100 characters
  price: Number,         // Required, >= 0
  currency: String,      // Default: "USD"
  frequency: String,     // "daily", "weekly", "monthly", "yearly"
  category: String,      // Required
  websiteUrl: String,    // Optional, valid URL
  startDate: String,     // Required
  paymentMethod: String, // Required
  isTrial: Boolean,      // Default: false
  trialInfo: {
    trialDuration: Number,        // Default: 30
    trialDurationUnit: String,    // "days", "weeks", "months"
    trialEndDate: String,         // Default: ""
    postTrialPrice: Number,       // Default: 0
    autoConvertToRegular: Boolean, // Default: true
    reminderSent: Boolean,        // Default: false
    cancellationDate: Date        // Default: null
  },
  status: String,        // "active", "cancelled", "expired"
  user: ObjectId,        // Reference to User
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

## 🔧 API Usage Examples

### Authentication

**Sign Up**
```javascript
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Sign In**
```javascript
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Subscription Management

**Create Subscription**
```javascript
POST /api/v1/subscriptions/
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "Entertainment",
  "websiteUrl": "https://netflix.com",
  "startDate": "2024-01-01",
  "paymentMethod": "Credit Card",
  "isTrial": false
}
```

**Edit Subscription**
```javascript
PUT /api/v1/subscriptions/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Netflix Premium Family",
  "price": 19.99,
  "websiteUrl": "https://netflix.com/family"
}
```

**Cancel Subscription**
```javascript
PUT /api/v1/subscriptions/:id/cancel
Authorization: Bearer <your-jwt-token>
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage  
- **Arcjet Protection** - Advanced security middleware
- **Input Validation** - Mongoose schema validation
- **Authorization Checks** - Route-level permission validation
- **CORS Configuration** - Cross-origin request handling

## 🌍 Environment Configuration

The application supports multiple environments:

- **Development**: `.env.development.local`
- **Production**: `.env.production.local`

Key environment variables:
- `NODE_ENV` - Environment mode
- `JWT_SECRET` - JWT signing secret (keep secure!)
- `DB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5500)

## 📦 Scripts

```bash
# Development
npm run dev          # Start with nodemon (auto-reload)

# Production
npm start           # Start production server

# Linting
npm run lint        # Run ESLint checks
```

## 🚀 Deployment

The application is deployed on **AWS** with plans for automated CI/CD using GitHub Actions.

### Current Deployment
- **Platform**: Amazon Web Services (AWS)
- **Environment**: Production server running on AWS infrastructure
- **Configuration**: Environment variables managed through AWS services
- **Production URL**: Configured via `SERVER_URL` environment variable

### Planned CI/CD Pipeline with GitHub Actions

🔄 **Automated Deployment Workflow** (Coming Soon):

```yaml
# .github/workflows/deploy.yml (Planned)
name: Deploy to AWS
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to AWS
        # AWS deployment steps here
```

### Legacy Vercel Configuration
```json
{
  "version": 2,
  "builds": [{ "src": "app.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/app.js" }]
}
```

## 🛣 Roadmap

- [ ] **CI/CD Pipeline** - GitHub Actions automated testing and deployment
- [ ] Add TypeScript support
- [ ] Swagger API documentation
- [ ] Frontend application
- [ ] Email notification system
- [ ] Subscription analytics
- [ ] Payment method validation
- [ ] Currency conversion support
- [ ] AWS infrastructure optimization
- [ ] Automated testing suite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ using Node.js and Express** 