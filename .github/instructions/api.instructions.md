# Organization API Documentation

## Base URL
```
/v1/organizations
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Create Organization
Creates a new organization with bank accounts and automatically assigns the creator as organization admin.

**Endpoint:** `POST /v1/organizations`

**Authentication:** Required

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orgName": "Hope Foundation",
  "email": "contact@hopefoundation.org",
  "phoneNumber": "+84-123-456-789",
  "address": "123 Main St, District 1, Ho Chi Minh City",
  "description": "Supporting education for underprivileged children",
  "website": "https://hopefoundation.org",
  "avatar": "https://s3.amazonaws.com/bucket/avatars/hope-logo.png",
  "banks": [
    {
      "bankName": "Vietcombank",
      "bankAccount": "0123456789",
      "accountHolder": "Hope Foundation",
      "branch": "District 1 Branch"
    },
    {
      "bankName": "Techcombank",
      "bankAccount": "9876543210",
      "accountHolder": "Hope Foundation",
      "branch": "HCMC Main Branch"
    }
  ]
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `orgName` | string | Yes | Organization name |
| `email` | string | No | Contact email |
| `phoneNumber` | string | No | Contact phone number |
| `address` | string | No | Physical address |
| `description` | string | No | Organization mission/description |
| `website` | string | No | Organization website URL |
| `avatar` | string | No | Avatar/logo URL (upload separately via `/upload-avatar`) |
| `banks` | array | Yes | Array of bank account objects |
| `banks[].bankName` | string | Yes | Bank name |
| `banks[].bankAccount` | string | Yes | Bank account number |
| `banks[].accountHolder` | string | Yes | Account holder name |
| `banks[].branch` | string | No | Bank branch location |

**Success Response:**
- **Status Code:** `201 Created`
- **Response Body:**
```json
{
  "data": {
    "organization": {
      "orgId": 1,
      "orgName": "Hope Foundation",
      "email": "contact@hopefoundation.org",
      "phoneNumber": "+84-123-456-789",
      "address": "123 Main St, District 1, Ho Chi Minh City",
      "description": "Supporting education for underprivileged children",
      "website": "https://hopefoundation.org",
      "avatar": "https://s3.amazonaws.com/bucket/avatars/hope-logo.png",
      "statusId": 1,
      "createdBy": 123,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "role": {
      "userRoleId": 1,
      "userId": 123,
      "orgId": 1,
      "roleId": 2,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "banks": {
      "bankAccountId": 1,
      "orgId": 1,
      "bankName": "Vietcombank",
      "bankAccount": "0123456789",
      "accountHolder": "Hope Foundation",
      "branch": "District 1 Branch"
    },
    "wallet": {
      "walletId": 1,
      "ownerId": 1,
      "ownerType": "Organization",
      "balance": 0,
      "statusId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- **Status Code:** `400 Bad Request` - Validation error
- **Status Code:** `401 Unauthorized` - Missing or invalid token
- **Status Code:** `500 Internal Server Error` - Server error

---

### 2. Get Organizations (List)
Retrieves a paginated list of organizations with search and sorting capabilities.

**Endpoint:** `GET /v1/organizations`

**Authentication:** Not required

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `limit` | integer | No | 10 | Items per page |
| `search` | string | No | - | Search by name, email, or phone |
| `sortBy` | string | No | createdAt | Field to sort by |
| `sortOrder` | string | No | DESC | Sort order (ASC/DESC) |

**Example Request:**
```
GET /v1/organizations?page=1&limit=10&search=hope&sortBy=orgName&sortOrder=ASC
```

**Success Response:**
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "data": [
    {
      "orgId": 1,
      "orgName": "Hope Foundation",
      "email": "contact@hopefoundation.org",
      "phoneNumber": "+84-123-456-789",
      "address": "123 Main St, District 1, Ho Chi Minh City",
      "description": "Supporting education for underprivileged children",
      "website": "https://hopefoundation.org",
      "avatar": "https://s3.amazonaws.com/bucket/avatars/hope-logo.png",
      "statusId": 1,
      "createdBy": 123,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "orgId": 2,
      "orgName": "Children's Hope",
      "email": "info@childrenshope.org",
      "phoneNumber": "+84-987-654-321",
      "address": "456 Hope St, District 3, Ho Chi Minh City",
      "description": "Providing healthcare for children",
      "website": "https://childrenshope.org",
      "avatar": "https://s3.amazonaws.com/bucket/avatars/children-hope.png",
      "statusId": 1,
      "createdBy": 456,
      "createdAt": "2024-01-16T14:20:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2
  }
}
```

**Search Behavior:**
- Searches across `orgName`, `email`, and `phoneNumber` fields
- Uses SQL LIKE with wildcards (partial matching)
- Case-insensitive search

---

### 3. Get Organization by ID
Retrieves detailed information about a specific organization including all related data.

**Endpoint:** `GET /v1/organizations/:orgId`

**Authentication:** Not required

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `orgId` | integer | Organization ID |

**Example Request:**
```
GET /v1/organizations/1
```

**Success Response:**
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "data": {
    "orgId": 1,
    "orgName": "Hope Foundation",
    "email": "contact@hopefoundation.org",
    "phoneNumber": "+84-123-456-789",
    "address": "123 Main St, District 1, Ho Chi Minh City",
    "description": "Supporting education for underprivileged children",
    "website": "https://hopefoundation.org",
    "avatar": "https://s3.amazonaws.com/bucket/avatars/hope-logo.png",
    "statusId": 1,
    "createdBy": 123,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "banks": [
      {
        "bankAccountId": 1,
        "orgId": 1,
        "bankName": "Vietcombank",
        "accountNumber": "0123456789",
        "accountHolder": "Hope Foundation",
        "branch": "District 1 Branch"
      }
    ],
    "campaigns": [
      {
        "campaignId": 1,
        "orgId": 1,
        "campaignName": "Back to School 2024",
        "description": "Providing school supplies for 1000 students",
        "goalAmount": 100000000,
        "currentAmount": 45000000,
        "startDate": "2024-01-01",
        "endDate": "2024-12-31",
        "status": {
          "campaignStatusId": 1,
          "statusName": "Active"
        }
      }
    ],
    "userRoles": [
      {
        "userRoleId": 1,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "role": {
          "roleId": 2,
          "roleName": "Organization Admin"
        }
      }
    ],
    "media": [
      {
        "orgMediaId": 1,
        "orgId": 1,
        "mediaTypeId": 1,
        "url": "https://s3.amazonaws.com/bucket/media/office-photo.jpg"
      }
    ],
    "wallets": [
      {
        "walletId": 1,
        "ownerId": 1,
        "ownerType": "Organization",
        "balance": 45000000,
        "status": {
          "walletStatusId": 1,
          "statusName": "Active"
        }
      }
    ]
  }
}
```

**Included Relations:**
- `banks` - All bank accounts
- `campaigns` - All campaigns with status
- `userRoles` - Team members with roles
- `media` - Uploaded media files
- `wallets` - Financial wallets with status

**Error Responses:**
- **Status Code:** `404 Not Found` - Organization doesn't exist
- **Status Code:** `400 Bad Request` - Invalid organization ID format

---

### 4. Update Organization
Updates an existing organization's information, including banks and media.

**Endpoint:** `PUT /v1/organizations/:orgId`

**Authentication:** Required

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `orgId` | integer | Organization ID to update |

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orgName": "Hope Foundation International",
  "email": "contact@hopefoundation.org",
  "phoneNumber": "+84-123-456-789",
  "address": "456 New St, District 1, Ho Chi Minh City",
  "description": "Supporting education and healthcare for underprivileged children",
  "website": "https://hopefoundation.international",
  "avatar": "https://s3.amazonaws.com/bucket/avatars/new-logo.png",
  "media": [
    {
      "url": "https://s3.amazonaws.com/bucket/media/office-photo.jpg",
      "mediaType": 1
    },
    {
      "url": "https://s3.amazonaws.com/bucket/media/team-photo.jpg",
      "mediaType": 1
    }
  ],
  "banks": [
    {
      "bankAccountId": 1,
      "bankName": "Vietcombank",
      "bankAccount": "0123456789",
      "accountHolder": "Hope Foundation International",
      "branch": "District 1 Branch"
    },
    {
      "bankName": "BIDV",
      "bankAccount": "1122334455",
      "accountHolder": "Hope Foundation International",
      "branch": "Central Branch"
    }
  ]
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `orgName` | string | No | Updated organization name |
| `email` | string | No | Updated email |
| `phoneNumber` | string | No | Updated phone |
| `address` | string | No | Updated address |
| `description` | string | No | Updated description |
| `website` | string | No | Updated website |
| `avatar` | string | No | Updated avatar URL |
| `media` | array | No | Array of media objects |
| `media[].url` | string | Yes | Media file URL |
| `media[].mediaType` | integer | Yes | Media type ID |
| `banks` | array | No | Array of bank account objects |
| `banks[].bankAccountId` | integer | No | Existing bank ID (for updates) |
| `banks[].bankName` | string | Yes | Bank name |
| `banks[].bankAccount` | string | Yes | Account number |
| `banks[].accountHolder` | string | Yes | Account holder name |
| `banks[].branch` | string | No | Branch location |

**Update Logic:**

**Media Updates:**
- Media not in new list = deleted from DB and S3
- Media in new list but not in DB = created
- Existing media preserved if included in update

**Bank Updates:**
- Banks with `bankAccountId` in existing records = updated
- Banks without `bankAccountId` = created as new
- Banks not in new list = deleted

**Success Response:**
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "data": {
    "orgId": 1,
    "orgName": "Hope Foundation International",
    "email": "contact@hopefoundation.org",
    "phoneNumber": "+84-123-456-789",
    "address": "456 New St, District 1, Ho Chi Minh City",
    "description": "Supporting education and healthcare for underprivileged children",
    "website": "https://hopefoundation.international",
    "avatar": "https://s3.amazonaws.com/bucket/avatars/new-logo.png",
    "statusId": 1,
    "createdBy": 123,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T15:45:00.000Z",
    "media": [
      {
        "orgMediaId": 1,
        "orgId": 1,
        "url": "https://s3.amazonaws.com/bucket/media/office-photo.jpg",
        "mediaType": {
          "mediaId": 1,
          "mediaName": "Image"
        }
      },
      {
        "orgMediaId": 2,
        "orgId": 1,
        "url": "https://s3.amazonaws.com/bucket/media/team-photo.jpg",
        "mediaType": {
          "mediaId": 1,
          "mediaName": "Image"
        }
      }
    ],
    "banks": [
      {
        "bankAccountId": 1,
        "orgId": 1,
        "bankName": "Vietcombank",
        "bankAccount": "0123456789",
        "accountHolder": "Hope Foundation International",
        "branch": "District 1 Branch"
      },
      {
        "bankAccountId": 2,
        "orgId": 1,
        "bankName": "BIDV",
        "bankAccount": "1122334455",
        "accountHolder": "Hope Foundation International",
        "branch": "Central Branch"
      }
    ],
    "campaigns": [],
    "wallets": [
      {
        "walletId": 1,
        "ownerId": 1,
        "ownerType": "Organization",
        "balance": 45000000,
        "status": {
          "walletStatusId": 1,
          "statusName": "Active"
        }
      }
    ]
  }
}
```

**Error Responses:**
- **Status Code:** `400 Bad Request` - Validation error
- **Status Code:** `401 Unauthorized` - Not authenticated
- **Status Code:** `404 Not Found` - Organization not found
- **Status Code:** `500 Internal Server Error` - Server error

---

### 5. Upload Organization Avatar
Uploads an organization avatar/logo image to S3.

**Endpoint:** `POST /v1/organizations/upload-avatar`

**Authentication:** Required

**Request Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Request Body:**
- Form data with file field
- File is automatically resized via middleware
- Supported formats: JPG, PNG, GIF

**Form Data:**
```
file: <binary file data>
```

**Success Response:**
- **Status Code:** `201 Created`
- **Response Body:**
```json
{
  "data": {
    "Location": "https://s3.amazonaws.com/bucket-name/avatars/org-1234567890.jpg",
    "ETag": "\"d41d8cd98f00b204e9800998ecf8427e\"",
    "Bucket": "bucket-name",
    "Key": "avatars/org-1234567890.jpg"
  }
}
```

**Usage Flow:**
1. Upload avatar using this endpoint
2. Get back S3 URL in response
3. Use the URL when creating/updating organization

**Error Responses:**
- **Status Code:** `400 Bad Request` - Invalid file or missing file
- **Status Code:** `401 Unauthorized` - Not authenticated
- **Status Code:** `413 Payload Too Large` - File too large
- **Status Code:** `500 Internal Server Error` - Upload failed

---

### 6. Upload Organization Media
Uploads multiple media files (images, documents) for an organization to S3.

**Endpoint:** `POST /v1/organizations/upload-media`

**Authentication:** Required

**Request Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Request Body:**
- Form data with multiple file fields
- Files are automatically resized via middleware
- Supports multiple file uploads

**Form Data:**
```
files: <binary file data 1>
files: <binary file data 2>
files: <binary file data 3>
```

**Success Response:**
- **Status Code:** `201 Created`
- **Response Body:**
```json
{
  "data": [
    {
      "Location": "https://s3.amazonaws.com/bucket-name/media/org-media-1234567890.jpg",
      "ETag": "\"a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6\"",
      "Bucket": "bucket-name",
      "Key": "media/org-media-1234567890.jpg"
    },
    {
      "Location": "https://s3.amazonaws.com/bucket-name/media/org-media-0987654321.jpg",
      "ETag": "\"p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1\"",
      "Bucket": "bucket-name",
      "Key": "media/org-media-0987654321.jpg"
    }
  ]
}
```

**Usage Flow:**
1. Upload media files using this endpoint
2. Get back array of S3 URLs
3. Include URLs in organization update request with mediaType

**Error Responses:**
- **Status Code:** `400 Bad Request` - Invalid files
- **Status Code:** `401 Unauthorized` - Not authenticated
- **Status Code:** `413 Payload Too Large` - Files too large
- **Status Code:** `500 Internal Server Error` - Upload failed

---

## Common Error Response Format

All error responses follow this structure:

```json
{
  "error": {
    "message": "Error message description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Status Codes Summary

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or invalid input |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Not authorized to perform action |
| 404 | Not Found - Resource doesn't exist |
| 413 | Payload Too Large - File size exceeds limit |
| 500 | Internal Server Error - Server error |

---

## Implementation Details

### Route Definitions

The organization routes are defined using Express Router with validation and authentication middleware:

```javascript
const express = require('express')
const router = express.Router()
const { isAuthorized } = require('../middlewares/auth.middlewares.js')
const OrganizationControllers = require('../controllers/organizations.controllers')
const {
  createOrganizationValidator,
  organizationIdValidator,
  getOrganizationsValidator,
  updateOrganizationValidator
} = require('../validations/organizations.validations')
const catchAsync = require('../middlewares/catchAsync.middleware.js')
const {
  uploadOrgAvatar,
  resizeOrgAvatar,
  uploadOrgMedia,
  resizeOrgMedia
} = require('../middlewares/uploadFile.middlewares.js')

// List and create organizations
router
  .route('/')
  .post(
    isAuthorized,
    createOrganizationValidator,
    catchAsync(OrganizationControllers.createOrganization)
  )
  .get(
    getOrganizationsValidator,
    catchAsync(OrganizationControllers.getOrganizations)
  )

// Upload avatar
router
  .route('/upload-avatar')
  .post(
    isAuthorized,
    uploadOrgAvatar,
    resizeOrgAvatar,
    OrganizationControllers.uploadOrgAvatar
  )

// Upload media files
router
  .route('/upload-media')
  .post(
    isAuthorized,
    uploadOrgMedia,
    resizeOrgMedia,
    OrganizationControllers.uploadMedia
  )

// Get, update specific organization
router
  .route('/:orgId')
  .get(
    organizationIdValidator,
    catchAsync(OrganizationControllers.getOrganizationById)
  )
  .put(
    organizationIdValidator,
    updateOrganizationValidator,
    catchAsync(OrganizationControllers.updateOrganization)
  )

module.exports = router
```

### Controller Implementation

Controllers handle HTTP request/response logic and delegate business logic to services:

```javascript
const HTTP_STATUS = require('../constants/httpStatus')
const OrganizationServices = require('../services/organizations.services')
const { uploadFileToS3 } = require('../utils/s3-bucket')

class OrganizationControllers {
  // Create new organization
  async createOrganization(req, res) {
    const { userId } = req.user
    const {
      orgName,
      bankName,
      accountNumber,
      accountHolder,
      branch,
      email,
      phoneNumber,
      address,
      description,
      website,
      avatar,
      banks
    } = req.body

    const result = await OrganizationServices.createOrganization(userId, {
      orgName,
      bankName,
      accountNumber,
      accountHolder,
      branch,
      email,
      phoneNumber,
      address,
      description,
      website,
      avatar,
      banks
    })

    return res.status(HTTP_STATUS.CREATED).json({
      data: { ...result }
    })
  }

  // Upload avatar to S3
  async uploadOrgAvatar(req, res) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      ContentType: req.file?.mimetype,
      Key: req.file?.filename,
      Body: req.file?.buffer
    }
    const result = await uploadFileToS3(params)
    return res.status(HTTP_STATUS.CREATED).json({
      data: result
    })
  }

  // Get single organization by ID
  async getOrganizationById(req, res) {
    const { orgId } = req.params
    const result = await OrganizationServices.getOrganizationById(orgId)
    return res.status(HTTP_STATUS.OK).json({
      data: result
    })
  }

  // Get paginated list of organizations
  async getOrganizations(req, res) {
    const { page, limit, search, sortBy, sortOrder } = req.query
    const result = await OrganizationServices.getOrganizations({
      page,
      limit,
      search,
      sortBy,
      sortOrder
    })
    return res.status(HTTP_STATUS.OK).json({
      ...result
    })
  }

  // Update organization
  async updateOrganization(req, res) {
    const { orgId } = req.params
    const {
      orgName,
      bankName,
      accountNumber,
      accountHolder,
      branch,
      email,
      phoneNumber,
      address,
      description,
      website,
      avatar,
      media,
      banks
    } = req.body

    const result = await OrganizationServices.updateOrganization(orgId, {
      orgName,
      bankName,
      accountNumber,
      accountHolder,
      branch,
      email,
      phoneNumber,
      address,
      description,
      website,
      avatar,
      media,
      banks
    })

    return res.status(HTTP_STATUS.OK).json({
      data: result
    })
  }

  // Upload multiple media files to S3
  async uploadMedia(req, res) {
    const files = req.files || []
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: file.filename,
          Body: file.buffer,
          ContentType: file.mimetype
        }
        const uploaded = await uploadFileToS3(params)
        return uploaded
      })
    )
    return res.status(HTTP_STATUS.CREATED).json({
      data: uploadResults
    })
  }
}

module.exports = new OrganizationControllers()
```

### Service Layer Implementation

Services contain the business logic and database operations:

```javascript
const { orgStatus, roleType, walletStatus } = require('../constants/enum')
const HTTP_STATUS = require('../constants/httpStatus')
const { ORGANIZATION_MESSAGES } = require('../constants/message')
const { AppError } = require('../controllers/error.controllers')
const db = require('../models')
const { deleteImageFromS3 } = require('../utils/s3-bucket')

class OrganizationServices {
  /**
   * Create a new organization with banks, user role, and wallet
   * Uses database transaction to ensure atomicity
   */
  async createOrganization(userId, data) {
    const t = await db.sequelize.transaction()

    try {
      // Create organization record
      const organization = await db.Organization.create(
        {
          orgName: data.orgName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          description: data.description,
          website: data.website,
          avatar: data.avatar,
          createdBy: userId,
          statusId: orgStatus.Active
        },
        { transaction: t }
      )

      const orgId = organization.orgId

      // Assign creator as organization admin
      const userRole = await db.UserRole.create(
        {
          userId,
          orgId,
          roleId: roleType.Organization
        },
        { transaction: t }
      )

      // Create bank accounts
      for (const bank of data.banks) {
        await db.OrgBank.create(
          {
            orgId,
            bankName: bank.bankName,
            bankAccount: bank.bankAccount,
            branch: bank.branch,
            accountHolder: bank.accountHolder,
            statusId: orgStatus.Active
          },
          { transaction: t }
        )
      }

      const banks = await db.OrgBank.findOne({ where: { orgId }, transaction: t })

      // Create wallet for financial tracking
      const wallet = await db.Wallet.create(
        {
          ownerId: orgId,
          ownerType: 'Organization',
          balance: 0,
          statusId: walletStatus.Active
        },
        { transaction: t }
      )

      await t.commit()

      return {
        organization: organization.get({ plain: true }),
        role: userRole.get({ plain: true }),
        banks: banks.get({ plain: true }),
        wallet: wallet.get({ plain: true })
      }
    } catch (error) {
      await t.rollback()
      throw error
    }
  }

  /**
   * Get organization by ID with all related data
   */
  async getOrganizationById(organizationId) {
    const organization = await db.Organization.findByPk(organizationId, {
      include: [
        {
          model: db.OrgBank,
          as: 'banks'
        },
        {
          model: db.Campaign,
          as: 'campaigns',
          attributes: { exclude: ['statusId'] },
          include: [
            {
              model: db.CampaignStatus,
              as: 'status'
            }
          ]
        },
        {
          model: db.UserRole,
          as: 'userRoles',
          attributes: ['userRoleId', 'createdAt', 'updatedAt'],
          include: [
            {
              model: db.Role,
              as: 'role',
              attributes: ['roleId', 'roleName']
            }
          ]
        },
        {
          model: db.OrgMedia,
          as: 'media'
        },
        {
          model: db.Wallet,
          as: 'wallets',
          attributes: { exclude: ['statusId'] },
          include: [
            {
              model: db.WalletStatus,
              as: 'status'
            }
          ]
        }
      ]
    })

    return organization
  }

  /**
   * Get paginated list of organizations with search
   */
  async getOrganizations({ page, limit, search, sortBy = 'createdAt', sortOrder = 'DESC' }) {
    page = Number(page) || 1
    limit = Number(limit) || 10
    const offset = (page - 1) * limit

    // Build search conditions
    const whereClause = {}
    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { orgName: { [db.Sequelize.Op.like]: `%${search}%` } },
        { email: { [db.Sequelize.Op.like]: `%${search}%` } },
        { phoneNumber: { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    }

    const organizations = await db.Organization.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, sortOrder]]
    })

    return {
      data: organizations.rows,
      pagination: {
        page,
        limit,
        total: organizations.count
      }
    }
  }

  /**
   * Update organization with media and bank management
   * Handles adding/removing media files and bank accounts
   */
  async updateOrganization(organizationId, data) {
    const organization = await db.Organization.findByPk(organizationId, {
      include: [
        { model: db.OrgMedia, as: 'media' },
        { model: db.OrgBank, as: 'banks' }
      ]
    })

    if (!organization) {
      throw new AppError(
        ORGANIZATION_MESSAGES.ORGANIZATION_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    return await db.sequelize.transaction(async (t) => {
      // Update basic organization info
      await organization.update(
        {
          orgName: data.orgName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          description: data.description,
          website: data.website,
          avatar: data.avatar
        },
        { transaction: t }
      )

      // Handle media updates
      if (data.media && data.media.length > 0) {
        const existingMedia = organization.media.map((m) => m.url)
        const mediaToDelete = existingMedia.filter(
          (url) => !data.media.map((m) => m.url).includes(url)
        )
        const mediaToAdd = data.media.filter((m) => !existingMedia.includes(m.url))

        // Delete removed media
        if (mediaToDelete.length > 0) {
          await db.OrgMedia.destroy({
            where: { orgId: organizationId, url: mediaToDelete },
            transaction: t
          })
          await deleteImageFromS3(mediaToDelete)
        }

        // Add new media
        if (mediaToAdd.length > 0) {
          const mediaRecords = mediaToAdd.map((media) => ({
            orgId: organizationId,
            mediaTypeId: media.mediaType,
            url: media.url
          }))
          await db.OrgMedia.bulkCreate(mediaRecords, { transaction: t })
        }
      }

      // Handle bank account updates
      if (data.banks && data.banks.length > 0) {
        const existingBankIds = organization.banks.map((b) => b.bankAccountId)
        const newBankIds = data.banks
          .filter((b) => b.bankAccountId)
          .map((b) => b.bankAccountId)
        const banksToDelete = existingBankIds.filter((id) => !newBankIds.includes(id))

        // Delete removed banks
        if (banksToDelete.length > 0) {
          await db.OrgBank.destroy({
            where: { bankAccountId: banksToDelete },
            transaction: t
          })
        }

        // Update or create banks
        for (const bank of data.banks) {
          if (bank.bankAccountId && existingBankIds.includes(bank.bankAccountId)) {
            // Update existing bank
            await db.OrgBank.update(
              {
                bankName: bank.bankName,
                bankAccount: bank.bankAccount,
                branch: bank.branch,
                accountHolder: bank.accountHolder
              },
              { where: { bankAccountId: bank.bankAccountId }, transaction: t }
            )
          } else {
            // Create new bank
            await db.OrgBank.create(
              {
                orgId: organizationId,
                bankName: bank.bankName,
                bankAccount: bank.bankAccount,
                branch: bank.branch,
                accountHolder: bank.accountHolder,
                statusId: orgStatus.Active
              },
              { transaction: t }
            )
          }
        }
      }

      // Fetch updated organization with all relations
      const updatedOrganization = await db.Organization.findByPk(organizationId, {
        include: [
          {
            model: db.OrgMedia,
            as: 'media',
            attributes: { exclude: ['mediaTypeId'] },
            include: [
              {
                model: db.Media,
                as: 'mediaType',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              }
            ]
          },
          { model: db.OrgBank, as: 'banks' },
          { model: db.Campaign, as: 'campaigns' },
          {
            model: db.Wallet,
            as: 'wallets',
            attributes: { exclude: ['statusId'] },
            include: [{ model: db.WalletStatus, as: 'status' }]
          }
        ],
        transaction: t
      })

      return updatedOrganization
    })
  }
}

module.exports = new OrganizationServices()
```

---

## Middleware & Validation

### Authentication Middleware

The `isAuthorized` middleware verifies JWT tokens and attaches user info to the request:

```javascript
// Protects routes requiring authentication
// Extracts userId from JWT token
// Attaches user object to req.user
```

### File Upload Middlewares

**Upload Avatar:**
```javascript
// uploadOrgAvatar: Handles single file upload
// resizeOrgAvatar: Resizes image for optimal storage
// Generates unique filename
// Stores in memory buffer for S3 upload
```

**Upload Media:**
```javascript
// uploadOrgMedia: Handles multiple file uploads
// resizeOrgMedia: Resizes images
// Supports batch upload of organization media
```

### Validation Schemas

**createOrganizationValidator:**
- Validates required fields: orgName, banks
- Ensures email format is correct
- Validates phone number format
- Checks banks array has at least one entry

**updateOrganizationValidator:**
- All fields optional
- Validates format when provided
- Ensures data types match schema

**getOrganizationsValidator:**
- Validates pagination parameters (page, limit)
- Ensures sortBy is a valid field
- Validates sortOrder is ASC or DESC

**organizationIdValidator:**
- Validates orgId is a positive integer
- Checks orgId parameter exists

---

## Complete Integration Example

### Client-Side Usage (React/JavaScript)

```javascript
// Example: Complete organization registration flow

class OrganizationService {
  constructor(apiBaseUrl) {
    this.baseUrl = apiBaseUrl
    this.token = localStorage.getItem('authToken')
  }

  // Step 1: Upload avatar
  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseUrl}/organizations/upload-avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    })

    const result = await response.json()
    return result.data.Location // S3 URL
  }

  // Step 2: Upload media files
  async uploadMedia(files) {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    const response = await fetch(`${this.baseUrl}/organizations/upload-media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    })

    const result = await response.json()
    return result.data.map(item => item.Location) // Array of S3 URLs
  }

  // Step 3: Create organization
  async createOrganization(orgData) {
    const response = await fetch(`${this.baseUrl}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(orgData)
    })

    return await response.json()
  }

  // Complete registration workflow
  async registerOrganization({ basicInfo, avatar, mediaFiles, banks }) {
    try {
      // Upload avatar
      const avatarUrl = await this.uploadAvatar(avatar)

      // Upload media files
      const mediaUrls = await this.uploadMedia(mediaFiles)

      // Create organization with uploaded URLs
      const organizationData = {
        ...basicInfo,
        avatar: avatarUrl,
        banks: banks
      }

      const result = await this.createOrganization(organizationData)
      return result

    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  // Get organization details
  async getOrganization(orgId) {
    const response = await fetch(`${this.baseUrl}/organizations/${orgId}`)
    return await response.json()
  }

  // Search organizations
  async searchOrganizations({ page = 1, limit = 10, search = '' }) {
    const params = new URLSearchParams({ page, limit, search })
    const response = await fetch(`${this.baseUrl}/organizations?${params}`)
    return await response.json()
  }

  // Update organization
  async updateOrganization(orgId, updateData) {
    const response = await fetch(`${this.baseUrl}/organizations/${orgId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(updateData)
    })

    return await response.json()
  }
}

// Usage in React component
const orgService = new OrganizationService('https://api.example.com/api')

// Register new organization
const handleRegister = async (formData) => {
  const result = await orgService.registerOrganization({
    basicInfo: {
      orgName: 'Hope Foundation',
      email: 'contact@hope.org',
      phoneNumber: '+84-123-456-789',
      address: '123 Main St',
      description: 'Helping children',
      website: 'https://hope.org'
    },
    avatar: avatarFile, // File object from input
    mediaFiles: [file1, file2], // Array of File objects
    banks: [
      {
        bankName: 'Vietcombank',
        bankAccount: '0123456789',
        accountHolder: 'Hope Foundation',
        branch: 'District 1'
      }
    ]
  })

  console.log('Organization created:', result.data)
}
```

---

## Testing Examples

### Unit Tests (Jest/Mocha)

```javascript
describe('Organization API Tests', () => {

  test('POST /organizations - should create organization', async () => {
    const orgData = {
      orgName: 'Test Org',
      email: 'test@org.com',
      phoneNumber: '+84-123-456-789',
      address: '123 Test St',
      description: 'Test organization',
      website: 'https://test.org',
      avatar: 'https://s3.amazonaws.com/avatar.png',
      banks: [
        {
          bankName: 'Test Bank',
          bankAccount: '1234567890',
          accountHolder: 'Test Org',
          branch: 'Main Branch'
        }
      ]
    }

    const response = await request(app)
      .post('/v1/organizations')
      .set('Authorization', `Bearer ${authToken}`)
      .send(orgData)
      .expect(201)

    expect(response.body.data).toHaveProperty('organization')
    expect(response.body.data).toHaveProperty('wallet')
    expect(response.body.data.organization.orgName).toBe('Test Org')
  })

  test('GET /organizations/:orgId - should return organization', async () => {
    const response = await request(app)
      .get('/v1/organizations/1')
      .expect(200)

    expect(response.body.data).toHaveProperty('orgId')
    expect(response.body.data).toHaveProperty('banks')
    expect(response.body.data).toHaveProperty('campaigns')
  })

  test('GET /organizations - should return paginated list', async () => {
    const response = await request(app)
      .get('/v1/organizations?page=1&limit=10&search=hope')
      .expect(200)

    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('pagination')
    expect(response.body.pagination.page).toBe(1)
    expect(response.body.pagination.limit).toBe(10)
  })

  test('PUT /organizations/:orgId - should update organization', async () => {
    const updateData = {
      orgName: 'Updated Org Name',
      email: 'updated@org.com'
    }

    const response = await request(app)
      .put('/v1/organizations/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(200)

    expect(response.body.data.orgName).toBe('Updated Org Name')
  })
})
```

---

## Performance Considerations

### Database Indexing
```sql
-- Recommended indexes for optimal query performance
CREATE INDEX idx_organization_status ON Organizations(statusId);
CREATE INDEX idx_organization_name ON Organizations(orgName);
CREATE INDEX idx_organization_email ON Organizations(email);
CREATE INDEX idx_organization_created ON Organizations(createdAt);
CREATE INDEX idx_orgbank_org ON OrgBanks(orgId);
CREATE INDEX idx_orgmedia_org ON OrgMedia(orgId);
```

### Caching Strategy
- Cache frequently accessed organizations (e.g., featured orgs)
- Cache organization lists with TTL of 5 minutes
- Invalidate cache on organization updates
- Use Redis for distributed caching

### Pagination Best Practices
- Default limit to 10-20 items per page
- Maximum limit of 100 items per page
- Use cursor-based pagination for large datasets
- Include total count for UI pagination controls

---

## Security Best Practices

### Input Validation
- Sanitize all user inputs to prevent XSS
- Validate email and phone formats
- Limit file upload sizes (avatars: 5MB, media: 10MB each)
- Whitelist allowed file types (JPEG, PNG, PDF)

### Authorization
- Verify user owns organization before allowing updates
- Check user roles before granting access
- Implement rate limiting on public endpoints
- Use HTTPS for all API communications

### Data Protection
- Never expose full bank account numbers in responses
- Mask sensitive data (e.g., show last 4 digits only)
- Encrypt sensitive fields at rest
- Log all modifications for audit trail

### File Upload Security
- Scan uploaded files for malware
- Validate file types by content, not just extension
- Use signed URLs for S3 access
- Set appropriate S3 bucket policies
