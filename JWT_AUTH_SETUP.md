# JWT Authentication Setup for Admin Routes

## Overview
This document describes the JWT authentication implementation for protecting all admin routes in the Sanjivani Encyclopedia application.

## Server-Side Implementation

### 1. JWT Middleware (`server/middleware/auth.js`)
- **File**: `server/middleware/auth.js`
- **Purpose**: Protects admin routes by verifying JWT tokens
- **Function**: `adminAuth` middleware
- **Token Header**: `x-auth-token`
- **Validation**: 
  - Checks for token presence
  - Verifies token signature using `JWT_SECRET`
  - Ensures token contains `adminId` field
  - Adds decoded admin info to `req.admin`

### 2. Protected Routes
All admin operations are now protected with JWT authentication:

#### Course Management (`server/routes/course.js`)
- ✅ **Public**: `GET /api/courses` - View all courses
- 🔒 **Protected**: `POST /api/courses` - Create new course
- 🔒 **Protected**: `PUT /api/courses/:id` - Update course
- 🔒 **Protected**: `DELETE /api/courses` - Delete courses

#### Topic Management (`server/routes/topic.js`)
- ✅ **Public**: `GET /api/topics/topic/:id` - View single topic
- ✅ **Public**: `GET /api/topics/:courseId` - View topics by course
- 🔒 **Protected**: `POST /api/topics` - Create new topic
- 🔒 **Protected**: `PUT /api/topics/:id` - Update topic
- 🔒 **Protected**: `DELETE /api/topics` - Delete topics

#### Content Management (`server/routes/topicContent.js`)
- ✅ **Public**: `GET /api/topic-content/approved/:topicId` - View approved content
- ✅ **Public**: `POST /api/topic-content` - Submit content for approval
- 🔒 **Protected**: `GET /api/topic-content/pending` - View pending requests
- 🔒 **Protected**: `PUT /api/topic-content/approve/:id` - Approve content
- 🔒 **Protected**: `DELETE /api/topic-content/reject/:id` - Reject content
- 🔒 **Protected**: `PUT /api/topic-content/:id` - Update content
- 🔒 **Protected**: `DELETE /api/topic-content/:id` - Delete content
- 🔒 **Protected**: `POST /api/topic-content/admin` - Admin add content directly

### 3. Authentication Routes (`server/routes/auth.js`)
- `POST /api/auth/admin/login` - Admin login (returns JWT token)
- `POST /api/auth/admin/logout` - Admin logout (client-side token removal)

## Client-Side Implementation

### 1. Axios Utility (`client/src/utils/axios.js`)
- **File**: `client/src/utils/axios.js`
- **Purpose**: Centralized API client with automatic token handling
- **Features**:
  - Automatically adds `x-auth-token` header to all requests
  - Handles 401 responses by redirecting to login
  - Removes expired/invalid tokens from localStorage

### 2. Updated Admin Components
All admin components now use the `api` utility instead of direct axios calls:
- `AdminCourses.jsx` - Course management
- `AdminTopics.jsx` - Topic management  
- `AdminContentPage.jsx` - Content management
- `AdminPendingPage.jsx` - Pending approvals

### 3. Logout Functionality
- Logout buttons added to all admin pages
- Removes token from localStorage
- Redirects to admin login page

## Environment Configuration

### Required Environment Variables
```bash
# Server (.env file)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
PORT=5000
```

### Client Environment Variables
```bash
# Client (.env file)
VITE_API_BASE_URL=http://localhost:5000
```

## Security Features

### 1. Token Validation
- JWT tokens expire after 1 hour
- Server validates token signature and structure
- Automatic token refresh not implemented (manual logout required)

### 2. Route Protection
- All admin write operations require valid JWT
- Public read operations remain accessible
- 401 responses automatically redirect to login

### 3. Token Storage
- Tokens stored in localStorage
- Automatic cleanup on authentication errors
- Secure token transmission via headers

## Usage Flow

### 1. Admin Login
1. Admin navigates to `/admin/login`
2. Enters username/password
3. Server validates credentials
4. JWT token returned and stored in localStorage
5. Redirected to `/admin/courses`

### 2. Protected Operations
1. All admin API calls automatically include JWT token
2. Server validates token before processing request
3. If valid, operation proceeds; if invalid, 401 returned

### 3. Logout
1. Admin clicks logout button
2. Token removed from localStorage
3. Redirected to login page

## Testing

### 1. Valid Token
- Admin can perform all protected operations
- Token automatically included in requests

### 2. Invalid/Expired Token
- 401 responses trigger automatic logout
- Redirect to login page
- Token removed from localStorage

### 3. No Token
- Protected routes return 401
- Client automatically redirects to login

## Future Enhancements

### 1. Token Refresh
- Implement refresh token mechanism
- Automatic token renewal before expiration

### 2. Role-Based Access
- Extend JWT payload with admin roles
- Implement role-based route protection

### 3. Session Management
- Track active admin sessions
- Implement forced logout functionality

## Troubleshooting

### Common Issues

1. **401 Unauthorized Errors**
   - Check if JWT_SECRET is set in server .env
   - Verify token is present in localStorage
   - Check token expiration

2. **Token Not Being Sent**
   - Ensure admin components use `api` utility
   - Check axios interceptor configuration

3. **Login Redirects**
   - Verify PrivateRoute component logic
   - Check token storage/retrieval

### Debug Steps

1. Check browser localStorage for token
2. Verify server .env configuration
3. Check network requests for token headers
4. Review server logs for authentication errors
