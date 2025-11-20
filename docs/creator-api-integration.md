# Creator Dashboard - Existing API Integration

This document maps the Creator Dashboard functionality to **existing backend API endpoints**. Instead of creating new `/v1/creator/*` endpoints, we leverage the existing API structure.

## Overview

The Creator Dashboard uses existing endpoints from:
- **Organizations API** (`/v1/organizations`)
- **Campaigns API** (`/v1/campaigns` and `/v1/fund-charity`)
- **Users API** (`/v1/users`)

## Endpoint Mapping

### 1. Dashboard Statistics

**Feature:** Get overall creator statistics (total raised, active campaigns, etc.)

**Implementation:**
```typescript
// GET creator's organizations
GET /v1/organizations?createdBy={userId}

// GET campaigns for each organization
GET /v1/campaigns?orgId={orgId}

// Calculate statistics client-side from the responses
```

**Data Aggregation (Client-Side):**
- Total raised: Sum `currentAmount` from all campaigns
- Active campaigns: Count campaigns with `status = 1` (Active)
- Total volunteers: Sum from volunteer registrations if available
- Total backers: Sum `backersCount` from all campaigns

---

### 2. Campaign Management

#### Get Creator's Campaigns
```typescript
// Step 1: Get organizations owned by user
GET /v1/organizations?createdBy={userId}

// Step 2: Get campaigns for those organizations
GET /v1/campaigns?orgId={orgId}&page=1&limit=10
```

#### Create Campaign
```typescript
POST /v1/campaigns/{orgId}

Request Body:
{
  "fundName": "Campaign Name",
  "description": "Description",
  "targetAmount": 100000,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "categoryId": 1,
  "bannerUrl": "https://..."
}
```

#### Update Campaign
```typescript
PUT /v1/fund-charity/{campaignId}

Request Body:
{
  "fundName": "Updated Name",
  "description": "Updated description",
  "targetAmount": 150000
}
```

#### Get Campaign Details
```typescript
GET /v1/campaigns/detail/{campaignId}
```

---

### 3. Activity Feed

**Feature:** Show recent activities across creator's campaigns

**Implementation:**
Since there's no dedicated activity endpoint, we need to:

**Option A - Client-Side Aggregation:**
```typescript
// Get campaign details which includes recent donations/updates
GET /v1/campaigns/detail/{campaignId}

// Aggregate and sort activities from multiple campaigns client-side
```

**Option B - Backend Implementation Needed:**
Request backend team to create:
```typescript
GET /v1/users/my-campaigns/activities
// Returns donations, volunteer registrations, milestones across user's campaigns
```

---

### 4. Volunteer Management ✅ IMPLEMENTED

**Status:** ✅ **Fully Integrated with Real API**

**Live Endpoints:**
```typescript
// Get volunteers for a campaign
GET /v1/volunteers/:campaignId

Response: {
  data: [
    {
      registrationId: 1,
      campaignId: 1,
      registeredAt: "2025-11-17T19:24:55.000Z",
      userInfo: {
        userId: 3,
        firstName: "Tran",
        lastName: "Hoang",
        email: "danghoang0902zaqw@gmail.com"
      },
      status: {
        volunteerStatusId: 1,  // 1=Pending, 2=Active, 3=Rejected
        statusName: "Chờ xét duyệt"
      }
    }
  ],
  pagination: {
    total: 4,
    page: 1,
    limit: 10
  }
}

// Update volunteer status
PUT /v1/volunteers/status/:registrationId

Request: {
  statusId: 1  // 1=Pending, 2=Active, 3=Rejected
}
```

**Implementation Notes:**
- Frontend transforms API response to internal `VolunteerRegistration` type
- Status mapping: Pending (1) → "pending", Active (2) → "active", Rejected (3) → "rejected"
- The UI handles "approved" status by mapping it to "active" (status ID 2)

---

### 5. Milestone Management

**Status:** Backend endpoints needed

**Required Endpoints (Request from backend team):**
```typescript
// Get campaign milestones
GET /v1/fund-charity/{campaignId}/milestones

// Create milestone
POST /v1/fund-charity/{campaignId}/milestones
Request: {
  title: "Milestone Title",
  description: "Description",
  targetAmount: 50000,
  order: 1
}

// Update milestone
PUT /v1/fund-charity/milestones/{milestoneId}
Request: {
  title: "Updated Title",
  isCompleted: true
}

// Delete milestone
DELETE /v1/fund-charity/milestones/{milestoneId}
```

**Temporary Solution:**
Use mock data until backend implements these endpoints.

---

### 6. Donations

**Status:** Backend endpoints needed

**Required Endpoints (Request from backend team):**
```typescript
// Get donations for a campaign
GET /v1/fund-charity/{campaignId}/donations?page=1&limit=20
Response: {
  data: [
    {
      donationId: 1,
      amount: 250,
      donorName: "Sarah Johnson",
      donorEmail: "sarah@example.com",
      isAnonymous: false,
      message: "Great cause!",
      donatedAt: "2024-11-15T10:30:00Z"
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 150
  }
}
```

**Temporary Solution:**
Use mock data or display aggregate donation info from campaign details.

---

### 7. Campaign Updates/Posts

**Status:** Backend endpoints needed

**Required Endpoints (Request from backend team):**
```typescript
// Get campaign updates
GET /v1/fund-charity/{campaignId}/updates?page=1&limit=10

// Post campaign update
POST /v1/fund-charity/{campaignId}/updates
Request: {
  title: "Progress Update",
  content: "We've made great progress...",
  images: ["https://..."]
}
```

**Temporary Solution:**
Use mock data until backend implements these endpoints.

---

### 8. File Uploads

**Use Existing Endpoints:**

#### Campaign Banner
```typescript
POST /v1/fund-charity/upload-banner
Content-Type: multipart/form-data

Form Data:
file: <binary>

Response:
{
  data: {
    Location: "https://s3.amazonaws.com/...",
    Key: "banners/image.jpg"
  }
}
```

#### Campaign Media
```typescript
POST /v1/fund-charity/upload-media
Content-Type: multipart/form-data

Form Data:
files: <binary>
files: <binary>

Response:
{
  data: [
    {
      Location: "https://s3.amazonaws.com/...",
      Key: "media/image1.jpg"
    }
  ]
}
```

---

## Implementation Strategy

### Phase 1: Use Existing Endpoints ✅ (Completed)
- ✅ Organizations API
- ✅ Campaigns API (list, create, update, detail)
- ✅ File uploads (banner, media)
- ✅ Volunteer management API (GET/PUT)
- ✅ Client-side statistics aggregation

### Phase 2: Mock Data for Missing Features (Current - Temporary)
- ⏳ Milestones (use mock data)
- ⏳ Donations list (use mock data)
- ⏳ Activity feed (aggregate from available data)
- ⏳ Campaign updates/posts (use mock data)

### Phase 3: Backend Implementation (Future)
Request backend team to implement:
1. ~~Volunteer management endpoints~~ ✅ **COMPLETED!**
2. Milestone CRUD endpoints
3. Donations listing endpoint
4. Campaign updates/posts endpoints
5. Activity feed aggregation endpoint

---

## Service Implementation Example

```typescript
// lib/services/creator.service.ts

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";
import {mockVolunteerRegistrations, mockRecentActivity} from "@/lib/mock-creator-data";

/**
 * Get creator's campaigns using existing organization API
 */
export async function getCreatorCampaigns(filters?: {
  status?: number;
  page?: number;
  limit?: number;
}) {
  // First, get user's organizations
  // This would require getting userId from auth context
  const queryParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${API_ENDPOINTS.CAMPAIGNS.LIST}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const result = await apiClient<any>(url);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return {
    campaigns: result.data || [],
    pagination: result.pagination
  };
}

/**
 * Get volunteers - Use mock data until backend implements
 */
export async function getCampaignVolunteers(campaignId: string | number) {
  // TODO: Replace with real API when backend implements
  // const result = await apiClient(`/v1/fund-charity/${campaignId}/volunteers`);

  // For now, filter mock data
  const volunteers = mockVolunteerRegistrations.filter(
    v => v.fundId === Number(campaignId)
  );

  return {
    volunteers,
    pagination: { page: 1, limit: 100, total: volunteers.length }
  };
}

/**
 * Get activity feed - Aggregate from available data
 */
export async function getCreatorActivity() {
  // TODO: Replace with real API when backend implements
  // For now, use mock data
  return {
    activities: mockRecentActivity,
    pagination: { page: 1, limit: 20, total: mockRecentActivity.length }
  };
}
```

---

## Backend Team Requests

### ✅ Completed
1. **Volunteer Management** ✨
   - ✅ `GET /v1/volunteers/:campaignId`
   - ✅ `PUT /v1/volunteers/status/:registrationId`

### Priority 1 (High Priority)
1. **Donations List**
   - `GET /v1/fund-charity/{campaignId}/donations`

### Priority 2 (Medium Priority)
2. **Milestones**
   - `GET /v1/fund-charity/{campaignId}/milestones`
   - `POST /v1/fund-charity/{campaignId}/milestones`
   - `PUT /v1/fund-charity/milestones/{milestoneId}`
   - `DELETE /v1/fund-charity/milestones/{milestoneId}`

4. **Campaign Updates**
   - `GET /v1/fund-charity/{campaignId}/updates`
   - `POST /v1/fund-charity/{campaignId}/updates`

### Priority 3 (Nice to Have)
5. **Activity Feed**
   - `GET /v1/users/my-campaigns/activities`

6. **Dashboard Statistics**
   - `GET /v1/users/creator-stats` (aggregated stats)

---

## Summary

**Current Implementation:**
- ✅ Use existing `/v1/organizations` and `/v1/campaigns` endpoints
- ✅ **Volunteer Management** - Fully integrated with real API!
  - `GET /v1/volunteers/:campaignId`
  - `PUT /v1/volunteers/status/:registrationId`
- ✅ Client-side aggregation for statistics
- ⏳ Mock data for features not yet available (milestones, donations, activity feed)

**Completed Features:**
- Campaign CRUD operations
- File uploads (banners, media)
- Volunteer listing and status management
- Real-time volunteer status updates with optimistic UI

**Future Enhancements:**
- Backend team implements remaining endpoints (milestones, donations, updates)
- Replace remaining mock data with real API calls
- Add real-time features (WebSockets for activity feed)

This approach allows the frontend to be fully functional while backend features are developed incrementally. **Volunteer management is now production-ready!** 🎉
