# Provider Onboarding & Verification Flow

## Complete Flow Implementation

### ✅ 1. Sign Up as Provider
**Location:** `frontend/src/pages/SignupPage.jsx`

- User selects "Provide Services" button
- Fills basic info (name, email, password)
- Account created with `role: "provider"`
- Redirected to `/provider-onboarding`

---

### ✅ 2. Provider Onboarding Form
**Location:** `frontend/src/pages/ProviderOnboarding.jsx`

**Required Fields:**
- Full Name *
- Phone *
- Hourly Rate *
- Category *
- CNIC (ID Card Number)
- Age
- Work Experience (years)
- Skills
- Bio
- Subcategory (optional)

**File Uploads:**
- Avatar (Profile Picture)
- Cover Photo
- Documents (ID Card/CV in PDF format)

**After Submission:**
- Success message displayed: "✅ Profile submitted successfully! Please wait for admin review and verification."
- Provider data stored in database
- User status set to 'pending'
- Page reloads after 3 seconds

---

### ✅ 3. Login Redirect Logic
**Location:** `frontend/src/context/AuthContext.jsx`

**Updated Behavior:**
```javascript
if (payload.isAdmin) {
  navigate("/admin");
} else if (payload.role === "provider" && !payload.providerProfileId) {
  // Provider without profile, redirect to onboarding
  navigate("/provider-onboarding");
} else {
  navigate("/dashboard");
}
```

**What Happens:**
- Provider logs in → checks if `providerProfileId` exists
- If NO profile → redirected to `/provider-onboarding`
- If profile exists → redirected to `/dashboard`

---

### ✅ 4. Backend - Login Response
**Location:** `backend/src/controllers/userController.js`

**Updated Response:**
```javascript
res.json({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  role: user.role,
  avatarUrl: user.avatarUrl || "",
  providerProfileId: providerProfileId, // ← NEW FIELD
  token: generateToken(user._id),
});
```

**Checks:** If provider has a linked profile, includes `providerProfileId` in response

---

### ✅ 5. User Model Update
**Location:** `backend/src/models/User.js`

**Added Field:**
```javascript
providerProfileId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Provider",
  default: null,
}
```

---

### ✅ 6. Admin Verification
**Location:** `frontend/src/pages/AdminDashboard.jsx`

**Features:**
- View all providers with verification status
- Status badges: `pending` / `verified` / `unverified`
- Verify/Unverify buttons
- Provider appears in list after submission

**Verification Actions:**
- Click ✓ (green) → Sets status to `verified`
- Click ✗ (red) → Sets status to `unverified`

---

### ✅ 7. Provider Dashboard (After Verification)
**Location:** `frontend/src/pages/UserDashboard.jsx`

Once verified, provider can:
- View their profile
- Toggle availability status via `/api/providers/me/toggle-availability`
- View service requests
- Manage bookings

---

## User Journey

### Scenario 1: New Provider Signup
```
1. Sign Up → Select "Provide Services"
2. Redirected to → Provider Onboarding
3. Fill profile → Upload documents
4. Submit → "Wait for admin review" message
5. Login → Still redirected to onboarding (profile pending)
6. Admin verifies → Provider receives notification
7. Login → Redirected to dashboard ✓
8. Can toggle availability ✓
```

### Scenario 2: Provider Already Verified
```
1. Login → Has providerProfileId
2. Redirected to → Dashboard ✓
3. Can toggle availability ✓
4. Can receive service requests ✓
```

---

## Important Features

### ✅ Profile Completion Check
- Login checks for `providerProfileId`
- Prevents access to dashboard without profile
- Forces onboarding completion

### ✅ Document Upload
- ID Card/CV upload for verification
- Avatar and cover photo for profile
- Documents stored in `uploads/` directory

### ✅ Admin Verification Status
- Three states: `pending`, `verified`, `unverified`
- Only verified providers can toggle availability
- Pending providers stuck on onboarding page

### ✅ Success Message
```
✅ Profile submitted successfully! 
Please wait for admin review and verification.

You will be able to toggle your availability 
after admin verification.
```

---

## API Endpoints Used

### Provider Onboarding
- `PUT /api/providers/me` - Create/update provider profile
- `POST /api/providers/me/documents` - Upload documents
- `GET /api/categories` - Get categories

### Login & Auth
- `POST /api/users/login` - Login (returns providerProfileId)
- `GET /api/users/profile` - Get user profile

### Admin Verification
- `GET /api/admin/providers` - List provider users
- `PATCH /api/providers/:id/verify` - Verify/unverify provider

### Availability Toggle
- `POST /api/providers/me/toggle-availability` - Toggle availability

---

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: "customer" | "provider" | "admin",
  status: "active" | "suspended" | "pending",
  providerProfileId: ObjectId (ref: Provider) // NEW
}
```

### Provider Model
```javascript
{
  name: String,
  hourlyRate: Number,
  category: String,
  subCategory: String,
  skills: [String],
  bio: String,
  verificationStatus: "pending" | "verified" | "unverified",
  isAvailable: Boolean,
  documents: [{ name, url, uploadedAt }],
  // ... other fields
}
```

---

## Testing Checklist

- [ ] Provider signup redirects to onboarding
- [ ] Provider without profile redirected to onboarding on login
- [ ] Profile submission shows success message
- [ ] Documents upload successfully
- [ ] Admin can see pending providers
- [ ] Admin can verify providers
- [ ] Verified provider can access dashboard
- [ ] Verified provider can toggle availability
- [ ] Unverified provider cannot toggle availability

---

## Notes

- Provider must complete onboarding before accessing dashboard
- Admin verification is required before availability toggle
- All documents/files stored in `backend/uploads/`
- Verification status tracked in both User and Provider models
- ProviderProfileId links User to Provider for seamless flow














