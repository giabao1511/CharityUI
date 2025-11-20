# How to Access Volunteer Management in Creator Dashboard

## ✅ Completed Implementation

The volunteer management feature is now fully integrated with the real backend API and accessible through the Creator Dashboard!

## 📍 How to Access

### Route Structure
```
/[locale]/creator/campaigns/[slug]
```

### Example URLs:
- English: `/en/creator/campaigns/1`
- Vietnamese: `/vi/creator/campaigns/5`

### Navigation Flow:

1. **Go to Creator Dashboard**
   - URL: `/[locale]/creator`
   - This is the main creator dashboard homepage

2. **View Your Campaigns**
   - URL: `/[locale]/creator/campaigns`
   - Shows a list of all your campaigns in a table format

3. **Select a Campaign**
   - Click "Manage" or "View" on any campaign in the table
   - Or click on a campaign card
   - URL: `/[locale]/creator/campaigns/[campaignId]`

4. **Volunteer Management Section**
   - The volunteer management section is displayed on the campaign detail page
   - Located below the campaign statistics and milestone manager
   - Shows all volunteers registered for that specific campaign

## 🎯 What You Can Do

### View Volunteers
- See all volunteers registered for the campaign
- View volunteer information:
  - Name
  - Email
  - Registration date
  - Current status
  - Skills
  - Availability

### Manage Volunteer Status

**For Pending Volunteers:**
- ✅ **Approve** - Marks volunteer as approved (status becomes "approved")
- ❌ **Reject** - Rejects the volunteer application (status becomes "rejected")

**For Approved Volunteers:**
- 🎯 **Activate** - Activates the volunteer (status becomes "active")

**For Active/Rejected/Inactive Volunteers:**
- Status is displayed as a badge (no actions available)

## 🔄 API Integration

The volunteer management now uses **real backend APIs**:

### GET Volunteers
```
GET /v1/volunteers/:campaignId
```
- Fetches all volunteers for a specific campaign
- Returns paginated results with volunteer details

### UPDATE Volunteer Status
```
PUT /v1/volunteers/status/:registrationId
Body: { statusId: 1 | 2 | 3 }
```
- Status IDs:
  - `1` = Pending (Chờ xét duyệt)
  - `2` = Active (Đang hoạt động)
  - `3` = Rejected (Đã từ chối)

## ✨ Features

- ✅ Real-time status updates with loading indicators
- ✅ Optimistic UI updates
- ✅ Error handling with toast notifications
- ✅ Success confirmation messages
- ✅ Responsive table layout
- ✅ Bilingual support (English/Vietnamese)
- ✅ Status badge color coding
- ✅ Skills and availability display

## 📱 User Experience

### Loading States
- Spinner animation appears on buttons during API calls
- Prevents duplicate actions during processing

### Success Feedback
- Green toast notification when volunteer is approved
- Red toast notification when volunteer is rejected
- Blue toast notification when status is updated

### Error Handling
- Displays error message if API call fails
- Reverts optimistic updates on error
- User-friendly error messages

## 🗂️ File Locations

### Pages
- **Dashboard Home:** [app/[locale]/creator/page.tsx](../app/[locale]/creator/page.tsx)
- **Campaigns List:** [app/[locale]/creator/campaigns/page.tsx](../app/[locale]/creator/campaigns/page.tsx)
- **Campaign Detail:** [app/[locale]/creator/campaigns/[slug]/page.tsx](../app/[locale]/creator/campaigns/[slug]/page.tsx)

### Components
- **Campaign Detail Client:** [components/creator/campaign-detail-client.tsx](../components/creator/campaign-detail-client.tsx)
- **Volunteer List:** [components/creator/volunteer-list.tsx](../components/creator/volunteer-list.tsx)

### Services
- **Creator Service:** [lib/services/creator.service.ts](../lib/services/creator.service.ts)
  - `getCampaignVolunteers(campaignId)` - Fetches volunteers
  - `updateVolunteerStatus(volunteerId, status)` - Updates status

### API Config
- **API Endpoints:** [lib/api-config.ts](../lib/api-config.ts)
  - Lines 66-74: VOLUNTEERS endpoints

### Translations
- **English:** [messages/en.json](../messages/en.json) (creator.volunteers section)
- **Vietnamese:** [messages/vi.json](../messages/vi.json) (creator.volunteers section)

## 🎨 UI Preview

### Empty State
When no volunteers have registered:
```
┌──────────────────────────────────────┐
│  👥 Volunteer Management            │
│  Manage volunteer registrations     │
├──────────────────────────────────────┤
│                                      │
│          👥                         │
│  No volunteer registrations yet     │
│                                      │
└──────────────────────────────────────┘
```

### With Volunteers
```
┌──────────────────────────────────────────────────────────────┐
│  👥 Volunteer Management                                     │
│  Manage volunteer registrations for this campaign           │
├──────────────────────────────────────────────────────────────┤
│ Name          Email           Status    Actions             │
├──────────────────────────────────────────────────────────────┤
│ John Doe      john@email.com  Pending   [Approve] [Reject] │
│ Jane Smith    jane@email.com  Active    Active              │
│ Bob Johnson   bob@email.com   Rejected  Rejected            │
└──────────────────────────────────────────────────────────────┘
```

## 📊 Status Flow

```
Registration
     ↓
  PENDING (1)
     ↓
  [Approve] → APPROVED → [Activate] → ACTIVE (2)
     ↓
  [Reject] → REJECTED (3)
```

## 🔐 Authentication

- User must be signed in to access Creator Dashboard
- Only campaign owners can manage volunteers
- API automatically validates user permissions via JWT token

## 🚀 Next Steps

The volunteer management is now **production-ready**! No further action needed for this feature.

### Optional Enhancements (Future):
- Add filtering by status (pending/active/rejected)
- Add search by volunteer name/email
- Export volunteer list to CSV
- Send email notifications to volunteers
- Add volunteer notes/comments section
- Bulk approve/reject actions

---

**Last Updated:** November 18, 2024
**Status:** ✅ Fully Implemented and Production Ready
