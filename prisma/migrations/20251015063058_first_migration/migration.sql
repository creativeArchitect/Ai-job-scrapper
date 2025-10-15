-- CreateTable
CREATE TABLE "ScrapedJob" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT,
    "salary" TEXT,
    "eligibleYear" TEXT,
    "requiredExp" TEXT,
    "skills" TEXT[],
    "jobUrl" TEXT NOT NULL,
    "postPlatform" TEXT NOT NULL,
    "aiScore" DOUBLE PRECISION,
    "experienceLevel" TEXT,
    "position" TEXT,
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapedJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedJob_jobUrl_key" ON "ScrapedJob"("jobUrl");

-- CreateIndex
CREATE INDEX "ScrapedJob_postPlatform_createdAt_idx" ON "ScrapedJob"("postPlatform", "createdAt");
