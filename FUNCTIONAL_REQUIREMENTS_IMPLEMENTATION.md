# Functional Requirements Implementation Summary

## Overview
This document outlines the implementation of functional requirements for the Artisan Connect platform as specified in the requirements document.

---

## Customer (Service Seeker) Requirements

### ✅ FR 3.1.1 - Filter Service Providers by Category and Sub-Category
**Status:** Implemented  
**Location:** `backend/src/controllers/providerController.js`  
**Endpoint:** `GET /api/providers`  
**Query Parameters:**
- `category` - Filter by service category
- `subCategory` - Filter by sub-category
- `availableNow` - Filter only available providers (true/false)

**Implementation:** The `getProviders` function filters providers based on category and subCategory fields.

---

### ✅ FR 3.1.2 - Display Available Providers within 5km Radius
**Status:** Implemented  
**Location:** `backend/src/controllers/providerController.js`  
**Endpoint:** `GET /api/providers`  
**Query Parameters:**
- `lat` - Customer's latitude
- `lng` - Customer's longitude
- `radius` - Search radius in km (default: 20km)
- `availableNow` - Filter for available providers

**Implementation:** Uses MongoDB geospatial queries with `$near` operator to find providers within the specified radius. Filters by `isAvailable` flag when `availableNow=true`.

---

### ✅ FR 3.1.3 - View Provider Profile with Reliability Score
**Status:** Implemented  
**Location:** `backend/src/models/Provider.js`, `backend/src/controllers/providerController.js`  
**Endpoint:** `GET /api/providers/:id`  

**Model Fields:**
- `reliabilityScore` (0-100) - Auto-calculated based on job completion and reviews
- `rating` - Average rating from reviews
- `numReviews` - Total number of reviews
- `bio` - Provider biography
- `workExperienceYears` - Years of experience
- `skills` - Array of skills

**Reviews:** Implemented via Review model - customers can view provider reviews and ratings.

---

### ✅ FR 3.1.4 - Submit Quote Request with Job Description and Photos
**Status:** Implemented  
**Location:** `backend/src/models/QuoteRequest.js`, `backend/src/controllers/quoteRequestController.js`  
**Endpoint:** `POST /api/quote-requests`  
**Request Body:**
```json
{
  "category": "Plumbing",
  "subCategory": "Pipe Repair",
  "jobDescription": "Faucet leaking in kitchen",
  "preferredTime": "2024-02-15T10:00:00Z",
  "location": {
    "city": "Karachi",
    "area": "Clifton",
    "lat": 24.8065,
    "lng": 67.0311,
    "address": "House 123, Street ABC"
  }
}
```
**Files:** Supports up to 5 photo uploads via multipart/form-data

**Implementation:** QuoteRequest model includes jobDescription, photos array, and location data. Photos are uploaded to `/uploads` directory.

---

### ✅ FR 3.1.5 - Track Service Status
**Status:** Implemented  
**Location:** `backend/src/models/ServiceRequest.js`, `backend/src/controllers/serviceRequestController.js`  
**Endpoint:** `GET /api/requests/my-requests`  

**Status Flow:**
- `requested` - Initial request created
- `quote_sent` - Provider sent a quote
- `accepted` - Customer accepted quote
- `in_progress` - Service started
- `completed` - Service completed
- `cancelled` - Request cancelled

**Implementation:** ServiceRequest model tracks status and timestamps at each stage.

---

## Service Provider (Artisan) Requirements

### ✅ FR 3.2.1 - Create Account with Service Category and Rates
**Status:** Implemented  
**Location:** `backend/src/models/Provider.js`, `backend/src/controllers/providerController.js`  
**Endpoint:** `PUT /api/providers/me`  

**Required Fields:**
- `name` - Provider name
- `category` - Primary service category
- `hourlyRate` - Hourly rate or fixed rate
- `subCategory` - Optional sub-category

**Implementation:** Provider profile can be created/updated via `updateProviderMe` endpoint. Links to User account automatically.

---

### ✅ FR 3.2.2 - Live Availability Toggle
**Status:** Implemented  
**Location:** `backend/src/controllers/providerController.js`  
**Endpoint:** `POST /api/providers/me/toggle-availability`  

**Functionality:** Toggles `isAvailable` field in Provider model.

**Response:**
```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "message": "You are now available for work"
  }
}
```

---

### ✅ FR 3.2.3 - Real-time Notifications for Quote Requests
**Status:** Implemented  
**Location:** `backend/src/models/Notification.js`, `backend/src/controllers/notificationController.js`  
**Endpoint:** `GET /api/notifications`  

**Notification Types:**
- `quote_request` - New quote request available
- `quote_accepted` - Customer accepted your quote
- `quote_rejected` - Customer rejected/rejected quote
- `service_started` - Service started
- `service_completed` - Service completed
- `review_received` - Customer left a review

**Endpoints:**
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

---

### ✅ FR 3.2.4 - Submit Fixed Quote or Reject Request
**Status:** Implemented  
**Location:** `backend/src/controllers/quoteRequestController.js`  
**Endpoints:** 
- `POST /api/quote-requests/:quoteRequestId/submit-quote` - Submit quote
- `POST /api/quote-requests/:quoteRequestId/reject` - Reject request

**Submit Quote Body:**
```json
{
  "quoteAmount": 5000,
  "message": "I can fix this in 2 hours"
}
```

**Implementation:** Providers can submit quotes with amounts and messages. Customers receive these quotes and can accept/reject them.

---

### ✅ FR 3.2.5 - Auto-update Reliability Score
**Status:** Implemented  
**Location:** `backend/src/controllers/reviewController.js`  
**Endpoint:** `POST /api/reviews/provider/:providerId/update-reliability`  

**Calculation Formula:**
```javascript
reliabilityScore = 
  (completionRate * 0.6) +           // 60% weight
  (averageRating * 20 * 0.3) +       // 30% weight (convert 0-5 to 0-100)
  (Math.min(numReviews * 2, 10) * 0.1)  // 10% weight (max 10 points)
```

**Auto-update:** Triggered when:
- A new review is submitted
- Provider completes a service
- Job status changes

---

## Admin Requirements

### ✅ FR 3.3.1 - Manage Service Categories and Sub-Categories
**Status:** Implemented  
**Location:** `backend/src/controllers/categoryController.js`  
**Endpoints:**
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `POST /api/categories/:categoryId/subcategories` - Add subcategory
- `DELETE /api/categories/:categoryId` - Delete category
- `DELETE /api/categories/:categoryId/subcategories/:subId` - Delete subcategory

**Implementation:** Category model supports nested subcategories with auto-generated slugs.

---

### ✅ FR 3.3.2 - View and Manage Customer/Provider Accounts
**Status:** Implemented  
**Location:** `backend/src/routes/adminRoutes.js`  

**Customer Management:**
- `GET /api/admin/customers` - List all customers
- `PUT /api/admin/customer/:id/status` - Update customer status (active/suspended)

**Provider Management:**
- `GET /api/admin/providers` - List all providers
- `PUT /api/admin/provider/:id/status` - Update provider status (pending/active/suspended)

**Account Status:**
- `active` - Account is active
- `suspended` - Account suspended by admin
- `pending` - Account pending verification (providers only)

---

### ✅ FR 3.3.3 - View All Transactions
**Status:** Implemented  
**Location:** `backend/src/routes/adminRoutes.js`  
**Endpoint:** `GET /api/admin/transactions`  

**Response:** Returns all orders with:
- Order ID and token
- Customer information
- Total price
- Payment method and status
- Order status
- Timestamp

**Additional Metrics:**
- `GET /api/admin/metrics` - Returns counts for customers, providers, bookings, orders, etc.

---

## Additional Features Implemented

### Notification System
- Real-time notifications for providers when quote requests are created
- Notification history for users
- Unread count tracking
- Mark notifications as read

### Review System
- Customers can review providers after service completion
- Provider ratings automatically updated
- Work history visible in provider profiles
- Review photos support

### Reliability Score System
- Automatically calculated based on:
  - Job completion rate (60%)
  - Average rating (30%)
  - Number of reviews (10%)
- Updated whenever a job is completed or reviewed

### Geo-location Support
- Geospatial queries for finding nearby providers
- Configurable search radius
- Location data stored for quote requests

---

## API Endpoints Summary

### Customer Endpoints
- `POST /api/quote-requests` - Create quote request
- `GET /api/quote-requests/my-requests` - Get my quote requests
- `POST /api/quote-requests/:id/accept/:quoteId` - Accept a quote
- `GET /api/providers` - Search providers (with filters)
- `GET /api/providers/:id` - Get provider details
- `GET /api/requests/my-requests` - Track service status
- `POST /api/reviews` - Submit review
- `GET /api/notifications` - Get notifications

### Provider Endpoints
- `PUT /api/providers/me` - Update provider profile
- `POST /api/providers/me/toggle-availability` - Toggle availability
- `GET /api/quote-requests/available` - Get available quote requests
- `POST /api/quote-requests/:id/submit-quote` - Submit quote
- `POST /api/quote-requests/:id/reject` - Reject request
- `GET /api/reviews/provider/:id` - Get provider reviews
- `PUT /api/requests/:id/status` - Update service status

### Admin Endpoints
- `GET /api/admin/customers` - List customers
- `PUT /api/admin/customer/:id/status` - Update customer status
- `GET /api/admin/providers` - List providers
- `PUT /api/admin/provider/:id/status` - Update provider status
- `GET /api/admin/transactions` - View all transactions
- `GET /api/admin/metrics` - Get platform metrics
- `POST /api/categories` - Create category
- `DELETE /api/categories/:id` - Delete category
- `POST /api/categories/:id/subcategories` - Add subcategory

---

## Database Models

### New Models Created
1. **QuoteRequest** - Quote requests from customers
2. **Review** - Customer reviews for providers
3. **Notification** - Real-time notifications

### Updated Models
1. **Provider** - Added `reliabilityScore` field
2. **ServiceRequest** - Added `quote_sent` status
3. **User** - Already had status management fields

---

## Testing Recommendations

1. **Quote Request Flow:**
   - Create quote request with photos
   - Provider receives notification
   - Provider submits quote
   - Customer accepts quote
   - Service status updates accordingly

2. **Reliability Score:**
   - Complete multiple services
   - Submit reviews
   - Verify score updates automatically

3. **Availability Filter:**
   - Toggle provider availability
   - Search with `availableNow=true`
   - Verify only available providers returned

4. **Admin Functions:**
   - Create/delete categories
   - Suspend/activate user accounts
   - View transaction history

---

## Notes

- All endpoints require authentication via JWT token
- Admin endpoints require `isAdmin: true` flag
- Photo uploads limited to 5 files per request
- Reliability score calculation runs automatically on service completion
- Notifications are created server-side when relevant events occur
- Geospatial queries require MongoDB with 2dsphere index
- All timestamps are automatically tracked via Mongoose











