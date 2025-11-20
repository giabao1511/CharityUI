# Creator Dashboard API Endpoints

This document describes all API endpoints for the Creator/Fund Manager dashboard functionality.

## Base URL
All endpoints are prefixed with: `/v1/creator`

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer {access_token}
```

---

## Dashboard Statistics

### Get Creator Statistics
Get overall statistics for the creator's campaigns.

**Endpoint:** `GET /v1/creator/stats`

**Response:**
```json
{
  "data": {
    "totalRaised": 265800,
    "activeCampaignsCount": 3,
    "totalVolunteers": 24,
    "totalDonations": 186,
    "totalBackers": 3186
  }
}
```

---

## Campaign Management

### Get Creator's Campaigns
Get all campaigns owned/managed by the authenticated creator.

**Endpoint:** `GET /v1/creator/campaigns`

**Query Parameters:**
- `status` (optional): Filter by campaign status (number)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `search` (optional): Search campaigns by name

**Response:**
```json
{
  "data": [
    {
      "fundId": 1,
      "fundName": "Clean Water for Rural Africa",
      "bannerUrl": "https://example.com/banner.jpg",
      "status": 1,
      "statusName": "Active",
      "targetAmount": 150000,
      "currentAmount": 89500,
      "startDate": "2024-01-15",
      "endDate": "2025-06-30",
      "backersCount": 1240,
      "volunteersCount": 12,
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-11-10T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

### Create New Campaign
Create a new campaign for an organization.

**Endpoint:** `POST /v1/creator/campaigns/{organizationId}`

**Request Body:**
```json
{
  "fundName": "Education for All",
  "description": "Providing education to underprivileged children",
  "targetAmount": 50000,
  "startDate": "2024-12-01",
  "endDate": "2025-12-31",
  "categoryId": 2,
  "bannerUrl": "https://example.com/banner.jpg"
}
```

**Response:**
```json
{
  "data": {
    "fundId": 123,
    "fundName": "Education for All",
    "status": 1,
    "statusName": "Active",
    // ... other campaign fields
  }
}
```

### Update Campaign
Update an existing campaign.

**Endpoint:** `PUT /v1/creator/campaigns/{campaignId}`

**Request Body:**
```json
{
  "fundName": "Updated Campaign Name",
  "description": "Updated description",
  "targetAmount": 60000
}
```

**Response:**
```json
{
  "data": {
    "fundId": 123,
    "fundName": "Updated Campaign Name",
    // ... updated campaign fields
  }
}
```

### Get Campaign Analytics
Get detailed analytics for a specific campaign.

**Endpoint:** `GET /v1/creator/campaigns/{campaignId}/analytics`

**Response:**
```json
{
  "data": {
    "campaign": {
      "fundId": 1,
      "fundName": "Clean Water for Rural Africa",
      // ... campaign fields
    },
    "stats": {
      "totalRaised": 89500,
      "backersCount": 1240,
      "volunteersCount": 12,
      "donationsCount": 856,
      "averageDonation": 104.56,
      "recentDonations": [
        {
          "amount": 250,
          "donorName": "Sarah Johnson",
          "donatedAt": "2024-11-15T10:30:00Z"
        }
      ]
    }
  }
}
```

---

## Activity Feed

### Get Recent Activity
Get recent activity across all creator's campaigns.

**Endpoint:** `GET /v1/creator/activities`

**Query Parameters:**
- `campaignId` (optional): Filter by specific campaign
- `type` (optional): Filter by activity type (donation, volunteer, milestone, comment, update)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": "act-1",
      "type": "donation",
      "campaignId": 1,
      "campaignName": "Clean Water for Rural Africa",
      "description": "New donation received",
      "amount": 250,
      "userName": "Sarah Johnson",
      "timestamp": "2024-11-15T10:30:00Z"
    },
    {
      "id": "act-2",
      "type": "volunteer",
      "campaignId": 1,
      "campaignName": "Clean Water for Rural Africa",
      "description": "New volunteer registration",
      "userName": "Michael Chen",
      "timestamp": "2024-11-15T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

---

## Volunteer Management

### Get Campaign Volunteers
Get all volunteers registered for a specific campaign.

**Endpoint:** `GET /v1/creator/campaigns/{campaignId}/volunteers`

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, active, rejected, inactive)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "data": [
    {
      "volunteerId": 1,
      "fundId": 1,
      "userId": 101,
      "userName": "Michael Chen",
      "userEmail": "michael.chen@example.com",
      "registeredAt": "2024-11-15T10:00:00Z",
      "status": "active",
      "skills": ["Engineering", "Project Management"],
      "availability": "Weekends",
      "notes": "Experienced in water infrastructure projects"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 24
  }
}
```

### Update Volunteer Status
Update the status of a volunteer registration.

**Endpoint:** `PUT /v1/creator/volunteers/{volunteerId}/status`

**Request Body:**
```json
{
  "status": "approved"
}
```

**Possible status values:**
- `pending`: Initial registration state
- `approved`: Creator has approved the volunteer
- `active`: Volunteer is actively working
- `inactive`: Volunteer is no longer active
- `rejected`: Creator has rejected the volunteer

**Response:**
```json
{
  "data": {
    "volunteerId": 1,
    "fundId": 1,
    "userId": 101,
    "userName": "Michael Chen",
    "status": "approved",
    // ... other volunteer fields
  }
}
```

---

## Milestone Management

### Get Campaign Milestones
Get all milestones for a specific campaign.

**Endpoint:** `GET /v1/creator/campaigns/{campaignId}/milestones`

**Response:**
```json
{
  "data": [
    {
      "milestoneId": 1,
      "title": "First 3 Wells Completed",
      "description": "Successfully drilled and installed 3 water wells",
      "targetAmount": 30000,
      "isCompleted": true,
      "completedAt": "2024-11-10T14:00:00Z",
      "order": 1
    },
    {
      "milestoneId": 2,
      "title": "10 Wells Completed",
      "description": "Reach milestone of 10 functioning wells",
      "targetAmount": 100000,
      "isCompleted": false,
      "order": 2
    }
  ]
}
```

### Create Milestone
Create a new milestone for a campaign.

**Endpoint:** `POST /v1/creator/campaigns/{campaignId}/milestones`

**Request Body:**
```json
{
  "title": "First 5 Schools Built",
  "description": "Complete construction of 5 schools",
  "targetAmount": 50000,
  "order": 1
}
```

**Response:**
```json
{
  "data": {
    "milestoneId": 3,
    "title": "First 5 Schools Built",
    "description": "Complete construction of 5 schools",
    "targetAmount": 50000,
    "isCompleted": false,
    "order": 1
  }
}
```

### Update Milestone
Update an existing milestone.

**Endpoint:** `PUT /v1/creator/milestones/{milestoneId}`

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "targetAmount": 60000,
  "isCompleted": true
}
```

**Response:**
```json
{
  "data": {
    "milestoneId": 3,
    "title": "Updated Title",
    "description": "Updated description",
    "targetAmount": 60000,
    "isCompleted": true,
    "completedAt": "2024-11-15T10:00:00Z",
    "order": 1
  }
}
```

### Delete Milestone
Delete a milestone.

**Endpoint:** `DELETE /v1/creator/milestones/{milestoneId}`

**Response:**
```json
{
  "data": {
    "success": true
  }
}
```

---

## Donation Management

### Get Campaign Donations
Get all donations for a specific campaign.

**Endpoint:** `GET /v1/creator/campaigns/{campaignId}/donations`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `startDate` (optional): Filter donations from this date (ISO 8601)
- `endDate` (optional): Filter donations until this date (ISO 8601)

**Response:**
```json
{
  "data": [
    {
      "donationId": 1,
      "amount": 250,
      "donorName": "Sarah Johnson",
      "donorEmail": "sarah@example.com",
      "isAnonymous": false,
      "message": "Great cause! Keep up the good work.",
      "donatedAt": "2024-11-15T10:30:00Z"
    },
    {
      "donationId": 2,
      "amount": 1000,
      "donorName": "Anonymous",
      "isAnonymous": true,
      "donatedAt": "2024-11-14T15:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 856
  }
}
```

---

## Campaign Updates

### Get Campaign Updates
Get all updates/posts for a campaign.

**Endpoint:** `GET /v1/creator/campaigns/{campaignId}/updates`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "data": [
    {
      "updateId": 1,
      "title": "Third Well Successfully Completed!",
      "content": "We're excited to announce the completion of our third well...",
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "createdAt": "2024-11-10T14:00:00Z",
      "likesCount": 45,
      "commentsCount": 12
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

### Post Campaign Update
Create a new update/post for a campaign.

**Endpoint:** `POST /v1/creator/campaigns/{campaignId}/updates`

**Request Body:**
```json
{
  "title": "Great Progress Update",
  "content": "We've made significant progress this month...",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

**Response:**
```json
{
  "data": {
    "updateId": 26,
    "title": "Great Progress Update",
    "content": "We've made significant progress this month...",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "createdAt": "2024-11-15T11:00:00Z"
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "errors": [
      {
        "field": "fieldName",
        "message": "Validation error message"
      }
    ]
  }
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## Notes for Backend Implementation

1. **Authorization**: All endpoints should verify that the authenticated user has permission to access/modify the requested resources (campaigns, volunteers, etc.).

2. **Pagination**: Implement consistent pagination across all list endpoints with `page`, `limit`, and `total` fields.

3. **Data Validation**: Validate all input data according to the schema requirements (e.g., dates, amounts, status values).

4. **Status Values**: Ensure volunteer status transitions are logical (e.g., can't go from rejected to active directly).

5. **Cascading Operations**: When deleting campaigns, consider what happens to related volunteers, milestones, etc.

6. **Real-time Updates**: Consider implementing WebSocket or Server-Sent Events for real-time activity feed updates.

7. **File Uploads**: For images in campaign updates, use the existing upload endpoints (`/v1/fund-charity/upload-media`) and store the returned URLs.

8. **Analytics Calculations**: The analytics endpoint should calculate average donations, counts, etc. from the database in real-time.

9. **Activity Logging**: All significant actions (donations, volunteer registrations, milestone completions) should be logged to the activity feed automatically.

10. **Date Handling**: All dates should be in ISO 8601 format (e.g., "2024-11-15T10:30:00Z").
