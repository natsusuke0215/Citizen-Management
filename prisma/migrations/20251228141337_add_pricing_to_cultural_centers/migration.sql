-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'FACILITY_MANAGER',
    "phone" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isEmailNotificationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isPushNotificationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isPublicProfile" BOOLEAN NOT NULL DEFAULT false,
    "theme" TEXT DEFAULT 'system'
);

-- CreateTable
CREATE TABLE "districts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "households" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "householdId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "street" TEXT,
    "ward" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "householdType" TEXT,
    "issueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "splitFromId" TEXT,
    CONSTRAINT "households_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "households_splitFromId_fkey" FOREIGN KEY ("splitFromId") REFERENCES "households" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "placeOfBirth" TEXT,
    "origin" TEXT,
    "ethnicity" TEXT,
    "religion" TEXT,
    "nationality" TEXT,
    "education" TEXT,
    "gender" TEXT NOT NULL,
    "occupation" TEXT,
    "workplace" TEXT,
    "idType" TEXT,
    "idNumber" TEXT,
    "idIssueDate" DATETIME,
    "idIssuePlace" TEXT,
    "registrationDate" DATETIME,
    "previousAddress" TEXT,
    "relationship" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "moveOutDate" DATETIME,
    "moveOutPlace" TEXT,
    "notes" TEXT,
    "householdId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "persons_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "data" TEXT,
    "userId" TEXT NOT NULL,
    "householdId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "requests_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cultural_centers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "floor" INTEGER,
    "room" TEXT,
    "amenities" TEXT,
    "area" REAL,
    "yearBuilt" INTEGER,
    "imageUrl" TEXT,
    "baseHourlyRate" REAL NOT NULL DEFAULT 300,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "cultural_center_bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "type" TEXT NOT NULL DEFAULT 'EVENT',
    "fee" REAL,
    "feePaid" BOOLEAN NOT NULL DEFAULT false,
    "culturalCenterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_center_bookings_culturalCenterId_fkey" FOREIGN KEY ("culturalCenterId") REFERENCES "cultural_centers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cultural_center_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "person_change_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "changeDate" DATETIME NOT NULL,
    "description" TEXT,
    "oldData" TEXT,
    "newData" TEXT,
    "changedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "person_change_history_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "household_change_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "householdId" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "changeDate" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "oldData" TEXT,
    "newData" TEXT,
    "changedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "household_change_history_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "temporary_absences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "reason" TEXT,
    "destination" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "temporary_absences_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "temporary_residences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "householdId" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "originalAddress" TEXT,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "temporary_residences_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cultural_center_assets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "condition" TEXT NOT NULL DEFAULT 'GOOD',
    "location" TEXT,
    "culturalCenterId" TEXT,
    "notes" TEXT,
    "imageUrl" TEXT,
    "lastChecked" DATETIME,
    "goodQuantity" INTEGER,
    "fairQuantity" INTEGER,
    "poorQuantity" INTEGER,
    "damagedQuantity" INTEGER,
    "repairingQuantity" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_center_assets_culturalCenterId_fkey" FOREIGN KEY ("culturalCenterId") REFERENCES "cultural_centers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cultural_center_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "activityType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "culturalCenterId" TEXT NOT NULL,
    "organizer" TEXT,
    "participantCount" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_center_activities_culturalCenterId_fkey" FOREIGN KEY ("culturalCenterId") REFERENCES "cultural_centers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cultural_center_usage_fees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "paymentDate" DATETIME,
    "paymentMethod" TEXT,
    "receiptNumber" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_center_usage_fees_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "cultural_center_bookings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "households_householdId_key" ON "households"("householdId");

-- CreateIndex
CREATE UNIQUE INDEX "persons_idNumber_key" ON "persons"("idNumber");

-- CreateIndex
CREATE UNIQUE INDEX "cultural_center_usage_fees_bookingId_key" ON "cultural_center_usage_fees"("bookingId");
