-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "StateUser" AS ENUM ('ENABLED', 'DISABLED');

-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('IN_PROGRESS', 'CHECKED', 'OFFLINE', 'ONLINE');

-- CreateEnum
CREATE TYPE "NotifyOrderBy" AS ENUM ('EMAIL', 'MESSAGE');

-- CreateEnum
CREATE TYPE "RankAdmin" AS ENUM ('SUPER_ADMIN', 'STANDARD_ADMIN', 'STOCK_MANAGER', 'DELIVERY_PERSON');

-- CreateEnum
CREATE TYPE "StateAdmin" AS ENUM ('ENABLED', 'SUSPENDED', 'DISABLED');

-- CreateEnum
CREATE TYPE "StateCollection" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "CategoryProduct" AS ENUM ('CLOTHING', 'SHOES', 'PERFUMES', 'OTHER');

-- CreateEnum
CREATE TYPE "StateProduct" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "StateCart" AS ENUM ('ENABLED', 'DISABLED');

-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PREPARATION', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ShippingType" AS ENUM ('STANDARD', 'EXPRESS', 'OVERNIGHT');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('IN_TWO_SLICES', 'IN_ONE_SLICE');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('AIRTEL_MONEY', 'MPESA', 'CASH_ON_DELIVERY', 'CARD', 'PAYPAL', 'AIRTEL_MONEY_ON_CONFIRMATION_CASH_ON_DELIVERY', 'MPESA_ON_CONFIRMATION_CASH_ON_DELIVERY');

-- CreateEnum
CREATE TYPE "StateDelivery" AS ENUM ('DELIVERED', 'NODELIVERED');

-- CreateEnum
CREATE TYPE "StatusInvoice" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StatusTransaction" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SALE', 'RECEIPT', 'REFUND', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "address" VARCHAR(255),
    "city" VARCHAR(255),
    "zipCode" VARCHAR(15),
    "country" VARCHAR(100),
    "avatar" VARCHAR(255),
    "role" "RoleUser" NOT NULL DEFAULT 'USER',
    "state" "StateUser" NOT NULL DEFAULT 'ENABLED',
    "status" "StatusUser" NOT NULL DEFAULT 'OFFLINE',
    "notifyOrderBy" "NotifyOrderBy" NOT NULL DEFAULT 'EMAIL',
    "notifyNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "rank" "RankAdmin" NOT NULL DEFAULT 'STANDARD_ADMIN',
    "daysOverdue" INTEGER,
    "state" "StateAdmin" NOT NULL DEFAULT 'ENABLED',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenRefresh" VARCHAR(255) NOT NULL,
    "fingerPrint" VARCHAR(255),
    "tokenKey" VARCHAR(255),
    "tokenKeyUsed" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(25) NOT NULL,
    "category" "CategoryProduct" NOT NULL DEFAULT 'OTHER',
    "description" TEXT,
    "image" VARCHAR(255),
    "color" VARCHAR(25),
    "state" "StateCollection" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(25) NOT NULL,
    "category" "CategoryProduct" NOT NULL DEFAULT 'OTHER',
    "description" TEXT,
    "features" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "image" VARCHAR(255),
    "sizes" TEXT,
    "colors" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "trackingNumber" VARCHAR(50) NOT NULL,
    "state" "StateProduct" NOT NULL DEFAULT 'AVAILABLE',
    "collectionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "state" "StateCart" NOT NULL DEFAULT 'ENABLED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size" VARCHAR(25) NOT NULL,
    "color" VARCHAR(25) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderNumber" VARCHAR(25) NOT NULL,
    "userId" INTEGER,
    "cartId" INTEGER,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "StatusOrder" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'AIRTEL_MONEY',
    "paymentType" "PaymentType" NOT NULL DEFAULT 'IN_ONE_SLICE',
    "shippingAddress" VARCHAR(255) NOT NULL,
    "shippingType" "ShippingType" NOT NULL DEFAULT 'STANDARD',
    "trackingNumber" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" SERIAL NOT NULL,
    "deliveryNumber" VARCHAR(25) NOT NULL,
    "deliveryPersonId" INTEGER,
    "userId" INTEGER,
    "orderId" INTEGER NOT NULL,
    "state" "StateDelivery" NOT NULL DEFAULT 'NODELIVERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "invoiceNumber" VARCHAR(25) NOT NULL,
    "userId" INTEGER,
    "orderId" INTEGER NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "shippingAmount" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "status" "StatusInvoice" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "trackingNumber" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "transactionNumber" VARCHAR(25) NOT NULL,
    "userId" INTEGER,
    "invoiceId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL DEFAULT 'AIRTEL_MONEY',
    "status" "StatusTransaction" NOT NULL DEFAULT 'PENDING',
    "type" "TransactionType" NOT NULL DEFAULT 'SALE',
    "reference" VARCHAR(255),
    "trackingNumber" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountLedger" (
    "id" SERIAL NOT NULL,
    "wording" TEXT NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "entryType" "EntryType" NOT NULL DEFAULT 'CREDIT',
    "description" TEXT,
    "balance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_firstName_idx" ON "User"("firstName");

-- CreateIndex
CREATE INDEX "User_lastName_idx" ON "User"("lastName");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE INDEX "Admin_userId_idx" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenRefresh_key" ON "Session"("tokenRefresh");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenKey_key" ON "Session"("tokenKey");

-- CreateIndex
CREATE INDEX "Session_tokenRefresh_idx" ON "Session"("tokenRefresh");

-- CreateIndex
CREATE INDEX "Session_userId_fingerPrint_idx" ON "Session"("userId", "fingerPrint");

-- CreateIndex
CREATE INDEX "Session_tokenKey_idx" ON "Session"("tokenKey");

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_fingerPrint_key" ON "Session"("userId", "fingerPrint");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_name_key" ON "Collection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_sku_key" ON "Collection"("sku");

-- CreateIndex
CREATE INDEX "Collection_name_idx" ON "Collection"("name");

-- CreateIndex
CREATE INDEX "Collection_sku_idx" ON "Collection"("sku");

-- CreateIndex
CREATE INDEX "Collection_description_idx" ON "Collection"("description");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_trackingNumber_key" ON "Product"("trackingNumber");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_sku_idx" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_description_idx" ON "Product"("description");

-- CreateIndex
CREATE INDEX "Product_trackingNumber_idx" ON "Product"("trackingNumber");

-- CreateIndex
CREATE INDEX "Favorite_userId_productId_idx" ON "Favorite"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_productId_key" ON "Favorite"("userId", "productId");

-- CreateIndex
CREATE INDEX "Review_userId_productId_idx" ON "Review"("userId", "productId");

-- CreateIndex
CREATE INDEX "Review_comment_idx" ON "Review"("comment");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_productId_key" ON "Review"("userId", "productId");

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "CartItem_cartId_productId_size_color_idx" ON "CartItem"("cartId", "productId", "size", "color");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_size_color_key" ON "CartItem"("cartId", "productId", "size", "color");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_cartId_key" ON "Order"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_trackingNumber_key" ON "Order"("trackingNumber");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_trackingNumber_idx" ON "Order"("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_deliveryNumber_key" ON "Delivery"("deliveryNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_orderId_key" ON "Delivery"("orderId");

-- CreateIndex
CREATE INDEX "Delivery_deliveryNumber_idx" ON "Delivery"("deliveryNumber");

-- CreateIndex
CREATE INDEX "Delivery_orderId_idx" ON "Delivery"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_orderId_key" ON "Invoice"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_trackingNumber_key" ON "Invoice"("trackingNumber");

-- CreateIndex
CREATE INDEX "Invoice_trackingNumber_idx" ON "Invoice"("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionNumber_key" ON "Transaction"("transactionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_trackingNumber_key" ON "Transaction"("trackingNumber");

-- CreateIndex
CREATE INDEX "Transaction_transactionNumber_idx" ON "Transaction"("transactionNumber");

-- CreateIndex
CREATE INDEX "Transaction_trackingNumber_idx" ON "Transaction"("trackingNumber");

-- CreateIndex
CREATE INDEX "AccountLedger_wording_idx" ON "AccountLedger"("wording");

-- CreateIndex
CREATE INDEX "AccountLedger_description_idx" ON "AccountLedger"("description");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_deliveryPersonId_fkey" FOREIGN KEY ("deliveryPersonId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountLedger" ADD CONSTRAINT "AccountLedger_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
