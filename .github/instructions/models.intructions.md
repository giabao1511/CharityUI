# Organization Model Documentation

## Overview
The Organization model is the core entity in this crowdfunding/charitable donation platform. It represents charitable organizations, nonprofits, or community groups that use the platform to raise funds for various causes.

### Key Capabilities
- **Campaign Management**: Organizations can create and manage multiple fundraising campaigns
- **Financial Tracking**: Built-in wallet system to track donations and expenses
- **Banking Integration**: Support for multiple bank accounts to receive and disburse funds
- **Team Collaboration**: Multi-user support with role-based access control
- **Media Management**: Upload and manage photos, documents, and other media files
- **Status Verification**: Organizations go through verification/approval processes

### Platform Purpose
This is a crowdfunding platform similar to GoFundMe or JustGiving, where verified organizations can:
1. Register and get verified by platform administrators
2. Create fundraising campaigns for specific causes
3. Receive donations through integrated payment systems
4. Track funds transparently through wallet mechanisms
5. Manage team members who can help run campaigns
6. Build trust through media galleries and detailed descriptions

## Database Schema

### Organization Table
**Table Name:** `Organizations`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `orgId` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique organization identifier |
| `orgName` | STRING(255) | NOT NULL | Organization name |
| `email` | STRING(255) | - | Contact email address |
| `phoneNumber` | STRING(50) | - | Contact phone number |
| `address` | TEXT | - | Physical address |
| `description` | TEXT | - | Organization description/mission |
| `website` | STRING(255) | - | Organization website URL |
| `avatar` | STRING(255) | - | Avatar/logo image URL |
| `statusId` | INTEGER | NOT NULL, FOREIGN KEY | Status reference (pending, active, suspended, etc.) |
| `createdBy` | INTEGER | NOT NULL | User ID who created the organization |
| `createdAt` | DATE | DEFAULT NOW | Record creation timestamp |
| `updatedAt` | DATE | DEFAULT NOW | Record update timestamp |

## Relationships

### One-to-Many Relationships

#### 1. Organization → OrgBank (banks)
- **Foreign Key:** `orgId`
- **As:** `banks`
- **Description:** Organizations can have multiple bank accounts for receiving donations

#### 2. Organization → Campaign (campaigns)
- **Foreign Key:** `orgId`
- **As:** `campaigns`
- **Description:** Organizations can create and manage multiple fundraising campaigns

#### 3. Organization → UserRole (userRoles)
- **Foreign Key:** `orgId`
- **As:** `userRoles`
- **Description:** Organizations can have multiple users with different roles (admin, member, etc.)

#### 4. Organization → OrgMedia (media)
- **Foreign Key:** `orgId`
- **As:** `media`
- **Description:** Organizations can upload multiple media files (images, documents)

#### 5. Organization → Wallet (wallets)
- **Foreign Key:** `ownerId`
- **Scope:** `ownerType: 'Organization'`
- **As:** `wallets`
- **Description:** Organizations have wallets to track incoming and outgoing funds

### Many-to-One Relationships

#### Organization → OrgStatus (status)
- **Foreign Key:** `statusId`
- **As:** `status`
- **Description:** Each organization has a current status (Active, Pending, Suspended, etc.)

## Related Models

### OrgBank Model
**Table Name:** `OrgBanks`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `bankAccountId` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique bank account identifier |
| `orgId` | INTEGER | NOT NULL, FOREIGN KEY | Reference to organization |
| `bankName` | STRING(255) | - | Name of the bank |
| `accountNumber` | STRING(50) | - | Bank account number |
| `accountHolder` | STRING(255) | - | Account holder name |
| `branch` | STRING(255) | - | Bank branch name/location |

**Relationship:** Belongs to Organization

### OrgMedia Model
**Table Name:** `OrgMedia`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `orgMediaId` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique media identifier |
| `orgId` | INTEGER | NOT NULL, FOREIGN KEY | Reference to organization |
| `mediaTypeId` | INTEGER | NOT NULL, FOREIGN KEY | Type of media (image, document, etc.) |
| `url` | STRING(255) | NOT NULL | URL to the media file (S3 bucket) |

**Relationships:**
- Belongs to Organization
- Belongs to Media (for media type lookup)

### OrgStatus Model
**Table Name:** `OrgStatuses`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `orgStatusId` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique status identifier |
| `statusName` | STRING | NOT NULL | Status name (e.g., "Active", "Pending", "Suspended") |

**Relationship:** Has many Organizations

## Business Logic

### Organization Lifecycle

1. **Creation**
   - User creates an organization with basic info and bank details
   - System automatically creates:
     - Organization record with `Active` status
     - UserRole linking creator with `Organization` role
     - OrgBank records for payment processing
     - Wallet with 0 balance for fund tracking

2. **Status Management**
   - Organizations have different statuses tracked via `statusId`
   - Common statuses: Active, Pending, Suspended, Inactive

3. **Fund Management**
   - Each organization has a wallet (`ownerType: 'Organization'`)
   - Wallet tracks balance and transaction history
   - Bank accounts store payout information

4. **Team Collaboration**
   - Multiple users can be associated via UserRole
   - Different roles control access levels (admin, member, viewer)

## Data Integrity

### Constraints
- `orgName` is required - every organization must have a name
- `statusId` is required - organizations must have a valid status
- `createdBy` is required - audit trail for who created the organization

### Cascading Rules
- When organization is deleted, related records (banks, media, campaigns) should be handled appropriately
- Consider soft delete pattern for audit purposes

## Implementation Details

### Model Definition (Sequelize)

```javascript
'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) {
      // One organization has many bank accounts
      Organization.hasMany(models.OrgBank, {
        foreignKey: 'orgId',
        as: 'banks'
      })

      // One organization has many campaigns
      Organization.hasMany(models.Campaign, {
        foreignKey: 'orgId',
        as: 'campaigns'
      })

      // One organization has many user roles (team members)
      Organization.hasMany(models.UserRole, {
        foreignKey: 'orgId',
        as: 'userRoles'
      })

      // One organization has many media files
      Organization.hasMany(models.OrgMedia, {
        foreignKey: 'orgId',
        as: 'media'
      })

      // One organization has wallets (polymorphic relation)
      Organization.hasMany(models.Wallet, {
        foreignKey: 'ownerId',
        scope: { ownerType: 'Organization' },
        as: 'wallets'
      })

      // Many organizations belong to one status
      Organization.belongsTo(models.OrgStatus, {
        foreignKey: 'statusId',
        as: 'status'
      })
    }
  }

  Organization.init(
    {
      orgId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      orgName: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255)
      },
      phoneNumber: {
        type: DataTypes.STRING(50)
      },
      address: {
        type: DataTypes.TEXT
      },
      description: {
        type: DataTypes.TEXT
      },
      website: {
        type: DataTypes.STRING(255)
      },
      avatar: {
        type: DataTypes.STRING(255)
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Organization'
    }
  )

  return Organization
}
```

### Related Model Implementations

#### OrgBank Model
```javascript
'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class OrgBank extends Model {
    static associate(models) {
      OrgBank.belongsTo(models.Organization, {
        foreignKey: 'orgId',
        as: 'organization'
      })
    }
  }

  OrgBank.init(
    {
      bankAccountId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      bankName: {
        type: DataTypes.STRING(255)
      },
      accountNumber: {
        type: DataTypes.STRING(50)
      },
      accountHolder: {
        type: DataTypes.STRING(255)
      },
      branch: {
        type: DataTypes.STRING(255)
      }
    },
    {
      sequelize,
      modelName: 'OrgBank'
    }
  )

  return OrgBank
}
```

#### OrgMedia Model
```javascript
'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class OrgMedia extends Model {
    static associate(models) {
      OrgMedia.belongsTo(models.Organization, {
        foreignKey: 'orgId',
        as: 'organization'
      })
      OrgMedia.belongsTo(models.Media, {
        foreignKey: 'mediaTypeId',
        as: 'mediaType'
      })
    }
  }

  OrgMedia.init(
    {
      orgMediaId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      mediaTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'OrgMedia'
    }
  )

  return OrgMedia
}
```

#### OrgStatus Model
```javascript
'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class OrgStatus extends Model {
    static associate(models) {
      OrgStatus.hasMany(models.Organization, {
        foreignKey: 'statusId',
        as: 'organizations'
      })
    }
  }

  OrgStatus.init(
    {
      orgStatusId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      statusName: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'OrgStatus'
    }
  )

  return OrgStatus
}
```

## Usage Examples

### Example 1: Creating a Complete Organization

This example shows the full organization creation process including transaction management:

```javascript
async function createOrganization(userId, organizationData) {
  const transaction = await sequelize.transaction();

  try {
    // Step 1: Create the organization
    const organization = await Organization.create(
      {
        orgName: "Hope Foundation",
        email: "contact@hopefoundation.org",
        phoneNumber: "+84-123-456-789",
        address: "123 Main St, District 1, Ho Chi Minh City",
        description: "Supporting education for underprivileged children",
        website: "https://hopefoundation.org",
        avatar: "https://s3.amazonaws.com/bucket/avatars/hope-logo.png",
        statusId: 1, // Active status
        createdBy: userId
      },
      { transaction }
    );

    // Step 2: Create user role (make creator an admin)
    await UserRole.create(
      {
        userId: userId,
        orgId: organization.orgId,
        roleId: 2 // Organization Admin role
      },
      { transaction }
    );

    // Step 3: Create bank accounts
    const bankAccounts = [
      {
        orgId: organization.orgId,
        bankName: "Vietcombank",
        accountNumber: "0123456789",
        accountHolder: "Hope Foundation",
        branch: "District 1 Branch"
      },
      {
        orgId: organization.orgId,
        bankName: "Techcombank",
        accountNumber: "9876543210",
        accountHolder: "Hope Foundation",
        branch: "Central Branch"
      }
    ];

    for (const bank of bankAccounts) {
      await OrgBank.create(bank, { transaction });
    }

    // Step 4: Create wallet for fund tracking
    await Wallet.create(
      {
        ownerId: organization.orgId,
        ownerType: 'Organization',
        balance: 0,
        statusId: 1 // Active wallet
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();

    return organization;

  } catch (error) {
    // Rollback on error
    await transaction.rollback();
    throw error;
  }
}
```

### Example 2: Querying Organization with All Relations

```javascript
async function getCompleteOrganization(orgId) {
  const organization = await Organization.findByPk(orgId, {
    include: [
      {
        model: OrgBank,
        as: 'banks',
        attributes: ['bankAccountId', 'bankName', 'accountNumber', 'accountHolder', 'branch']
      },
      {
        model: Campaign,
        as: 'campaigns',
        attributes: { exclude: ['statusId'] },
        include: [
          {
            model: CampaignStatus,
            as: 'status',
            attributes: ['campaignStatusId', 'statusName']
          }
        ]
      },
      {
        model: UserRole,
        as: 'userRoles',
        attributes: ['userRoleId', 'userId', 'createdAt'],
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['roleId', 'roleName']
          },
          {
            model: User,
            as: 'user',
            attributes: ['userId', 'username', 'email']
          }
        ]
      },
      {
        model: OrgMedia,
        as: 'media',
        attributes: { exclude: ['mediaTypeId'] },
        include: [
          {
            model: Media,
            as: 'mediaType',
            attributes: ['mediaId', 'mediaName']
          }
        ]
      },
      {
        model: Wallet,
        as: 'wallets',
        attributes: { exclude: ['statusId'] },
        include: [
          {
            model: WalletStatus,
            as: 'status',
            attributes: ['walletStatusId', 'statusName']
          }
        ]
      },
      {
        model: OrgStatus,
        as: 'status',
        attributes: ['orgStatusId', 'statusName']
      }
    ]
  });

  return organization;
}
```

### Example 3: Updating Organization with Media Management

```javascript
async function updateOrganization(orgId, updateData) {
  const transaction = await sequelize.transaction();

  try {
    // Find existing organization
    const organization = await Organization.findByPk(orgId, {
      include: [
        { model: OrgMedia, as: 'media' },
        { model: OrgBank, as: 'banks' }
      ],
      transaction
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    // Update basic information
    await organization.update(
      {
        orgName: updateData.orgName,
        email: updateData.email,
        phoneNumber: updateData.phoneNumber,
        address: updateData.address,
        description: updateData.description,
        website: updateData.website,
        avatar: updateData.avatar
      },
      { transaction }
    );

    // Handle media updates (delete old, add new)
    if (updateData.media && updateData.media.length > 0) {
      const existingUrls = organization.media.map(m => m.url);
      const newUrls = updateData.media.map(m => m.url);

      // Delete media not in new list
      const urlsToDelete = existingUrls.filter(url => !newUrls.includes(url));
      if (urlsToDelete.length > 0) {
        await OrgMedia.destroy({
          where: { orgId, url: urlsToDelete },
          transaction
        });
      }

      // Add new media
      const urlsToAdd = updateData.media.filter(m => !existingUrls.includes(m.url));
      if (urlsToAdd.length > 0) {
        const mediaRecords = urlsToAdd.map(media => ({
          orgId,
          mediaTypeId: media.mediaType,
          url: media.url
        }));
        await OrgMedia.bulkCreate(mediaRecords, { transaction });
      }
    }

    await transaction.commit();
    return organization;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### Example 4: Searching Organizations with Pagination

```javascript
async function searchOrganizations(filters) {
  const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = filters;
  const offset = (page - 1) * limit;

  // Build search conditions
  const whereClause = {};
  if (search) {
    whereClause[Op.or] = [
      { orgName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phoneNumber: { [Op.like]: `%${search}%` } }
    ];
  }

  // Execute query with pagination
  const result = await Organization.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [[sortBy, sortOrder]],
    include: [
      {
        model: OrgStatus,
        as: 'status',
        attributes: ['orgStatusId', 'statusName']
      }
    ]
  });

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total: result.count,
      totalPages: Math.ceil(result.count / limit)
    }
  };
}
```

## Common Use Cases

### Use Case 1: Organization Registration Flow
1. User fills out registration form with organization details
2. User uploads organization logo/avatar
3. User adds one or more bank accounts for receiving funds
4. System creates organization with "Pending" status
5. Admin reviews and approves, changing status to "Active"
6. Organization can now create campaigns

### Use Case 2: Campaign Creation
1. Organization admin logs in
2. Creates new campaign with goals and timeline
3. Uploads campaign media (photos, videos)
4. Campaign becomes visible to donors
5. Donations flow into organization wallet
6. Funds can be withdrawn to registered bank accounts

### Use Case 3: Team Management
1. Organization owner invites team members
2. Assigns roles (admin, editor, viewer)
3. Team members can collaborate on campaigns
4. Role-based permissions control access

### Use Case 4: Financial Transparency
1. All donations recorded in wallet
2. Wallet balance always accurate
3. Transaction history available
4. Withdrawals linked to bank accounts
5. Public can see campaign progress and funds raised

## Best Practices

### Transaction Management
Always use database transactions when creating or updating organizations to ensure data consistency:
- Organization creation involves multiple tables (Organization, UserRole, OrgBank, Wallet)
- If any step fails, rollback all changes
- Prevents orphaned records or inconsistent state

### Validation Rules
- Validate email format before saving
- Ensure phone numbers follow expected format
- Verify bank account numbers are valid
- Check that avatar/media URLs are accessible
- Confirm organization name is unique

### Security Considerations
- Never expose sensitive bank account details in public APIs
- Encrypt sensitive information at rest
- Implement role-based access control for updates
- Validate user permissions before allowing modifications
- Log all changes for audit trail

### Performance Optimization
- Index frequently queried fields (orgName, email, statusId)
- Use pagination for listing organizations
- Lazy load relationships only when needed
- Cache frequently accessed organization data
- Optimize image sizes for avatars and media
