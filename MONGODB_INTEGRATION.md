# MongoDB Integration for EcoCred App

## Overview
This document describes the complete MongoDB integration for the EcoCred application, replacing AsyncStorage with a robust database backend for data persistence.

## Architecture

### Backend Models
- **Transaction**: Stores payment transactions, carbon credits earned, and environmental impact data
- **Balance**: Tracks user account balance and currency
- **CarbonCredits**: Manages carbon credits, total earned/spent, and tracking
- **UserProfile**: Stores user preferences, theme settings, and profile information

### API Endpoints

#### Transactions (`/api/transactions`)
- `GET /user/:userId` - Get all transactions for a user
- `GET /:transactionId` - Get a specific transaction
- `POST /payment` - Process a payment (creates transaction, updates balance & credits)
- `POST /bonus` - Add a bonus transaction
- `PATCH /:transactionId/status` - Update transaction status

#### Balance (`/api/balance`)
- `GET /user/:userId` - Get user balance
- `PATCH /user/:userId` - Update user balance
- `POST /user/:userId/add` - Add funds to balance

#### Carbon Credits (`/api/carbon-credits`)
- `GET /user/:userId` - Get user carbon credits
- `PATCH /user/:userId` - Update carbon credits
- `POST /user/:userId/add` - Add carbon credits
- `POST /user/:userId/spend` - Spend carbon credits

#### User Profile (`/api/profile`)
- `GET /user/:userId` - Get user profile
- `POST /user/:userId` - Create or update user profile
- `PATCH /user/:userId/preferences` - Update user preferences
- `GET /user/:userId/theme` - Get user theme
- `PATCH /user/:userId/theme` - Update user theme
- `DELETE /user/:userId` - Delete user profile

## Frontend Integration

### Service Layer
- **`apiService.ts`**: Contains all API call functions with proper error handling
- **`mongoStorage.ts`**: MongoDB-specific storage operations
- **`storage.ts`**: Updated to use MongoDB when user is logged in, falls back to AsyncStorage for offline mode

### Key Features
1. **Hybrid Storage**: Uses MongoDB when user is logged in, AsyncStorage for offline mode
2. **Automatic User ID Management**: Sets user ID after successful login
3. **Theme Persistence**: Stores theme preferences in both MongoDB and AsyncStorage
4. **Error Handling**: Comprehensive error handling with fallbacks
5. **Type Safety**: Full TypeScript support with proper interfaces

## Data Flow

### Login Process
1. User enters phone number and receives OTP
2. After successful OTP verification, backend returns JWT token and user ID
3. Frontend stores JWT token and sets user ID for MongoDB operations
4. All subsequent data operations use MongoDB instead of AsyncStorage

### Payment Process
1. User initiates payment
2. Frontend calls `/api/transactions/payment` endpoint
3. Backend processes payment atomically:
   - Deducts amount from user balance
   - Adds carbon credits (1 credit per ₹100 spent)
   - Creates transaction record
4. Frontend receives updated transaction data

### Theme Management
1. User toggles theme
2. Frontend updates both MongoDB and AsyncStorage
3. Theme persists across app sessions and devices

## Database Schema

### Transaction Schema
```javascript
{
  userId: ObjectId,
  id: String (unique),
  merchant: String,
  amount: Number,
  credits: Number,
  date: String,
  time: String,
  fullDate: String,
  category: String,
  type: 'payment' | 'bonus',
  icon: String,
  status: 'Completed' | 'Pending' | 'Failed',
  carbonImpact: {
    co2Offset: String,
    treesEquivalent: String,
    creditsEarned: Number,
    breakdown: [{ item: String, value: String }]
  }
}
```

### Balance Schema
```javascript
{
  userId: ObjectId (unique),
  amount: Number,
  currency: String,
  lastUpdated: Date
}
```

### CarbonCredits Schema
```javascript
{
  userId: ObjectId (unique),
  credits: Number,
  totalEarned: Number,
  totalSpent: Number,
  lastUpdated: Date
}
```

### UserProfile Schema
```javascript
{
  userId: ObjectId (unique),
  fullName: String,
  email: String,
  phoneNumber: String,
  dateOfBirth: String,
  address: String,
  preferences: {
    theme: 'light' | 'dark',
    notifications: Boolean,
    carbonTracking: Boolean
  },
  joinDate: Date,
  lastActive: Date
}
```

## Setup Instructions

### Backend Setup
1. Ensure MongoDB is running
2. Set `MONGO_URI` in `.env` file
3. Install dependencies: `npm install`
4. Start server: `npm run dev`

### Frontend Setup
1. Update API configuration in `src/config/api.ts` with correct backend URL
2. Ensure backend is running before testing
3. Login with valid credentials to enable MongoDB integration

## Testing

### Manual Testing
1. Start backend server
2. Login to the app
3. Make a payment - check MongoDB for transaction record
4. Toggle theme - verify persistence
5. Check balance and carbon credits updates

### API Testing
Use tools like Postman or curl to test individual endpoints:

```bash
# Get user balance
curl -X GET http://localhost:3000/api/balance/user/USER_ID

# Process payment
curl -X POST http://localhost:3000/api/transactions/payment \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","amount":500,"merchant":"Test Store","category":"Test"}'
```

## Benefits

1. **Data Persistence**: User data persists across devices and app reinstalls
2. **Scalability**: Can handle multiple users and large amounts of data
3. **Backup & Recovery**: Database backups ensure data safety
4. **Analytics**: Can analyze user behavior and transaction patterns
5. **Offline Support**: Graceful fallback to AsyncStorage when offline
6. **Type Safety**: Full TypeScript support prevents runtime errors

## Migration Notes

- Existing AsyncStorage data remains as fallback
- New users automatically use MongoDB
- Theme preferences sync between MongoDB and AsyncStorage
- No data loss during migration process

## Troubleshooting

### Common Issues
1. **Connection Failed**: Check MongoDB URI and network connectivity
2. **User Not Found**: Ensure user ID is set after login
3. **API Errors**: Check backend server status and logs
4. **Theme Not Persisting**: Verify both MongoDB and AsyncStorage updates

### Debug Steps
1. Check browser/device console for errors
2. Verify backend server is running
3. Check MongoDB connection status
4. Test API endpoints directly
5. Verify user ID is set in AsyncStorage

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data updates
2. **Data Analytics**: Dashboard for transaction and carbon credit analytics
3. **Backup Strategy**: Automated database backups
4. **Performance Optimization**: Caching and query optimization
5. **Multi-tenant Support**: Support for multiple organizations
