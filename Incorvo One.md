# INCORVO ONE — MASTER ARCHITECTURE & ERP PLATFORM SPECIFICATION

**Tagline:** One System for Every Business  
**Parent Company:** Quenix Analytics Pvt. Ltd.  

---

## 📄 SECTION A: EXECUTIVE PRODUCT OVERVIEW & REAL-WORLD EXAMPLES

This document outlines the platform — a single SaaS system that lets a business manage inventory, billing, procurement, warehousing, and multi-channel sales (retail, B2B, and in-store POS) from one place, with analytics and role-based access built in from the start. Below, each module is broken down with what it does and a real-world example of how it plays out day-to-day.

### 1. Inventory Management
The foundation of the platform — a live, always-accurate picture of every product a business holds, wherever it's stored.
- **Universal Product Catalog:** One catalog that can hold any kind of product: simple standalone items, products with variants (size/color), bundled kits made of multiple items, or batch/serial-tracked goods. Businesses can add custom fields per product (e.g., “shelf life,” “vendor SKU,” “warranty period”) without needing developer help.
  - *Example:* A distributor sells both loose screws (simple product) and pre-packed tool kits (bundle of 5 items) — both live in the same catalog, but the system treats them differently when stock is deducted.
- **Real-Time Stock Tracking:** Every sale, purchase, transfer, or return updates stock instantly across the system — no end-of-day batch syncs, no manual reconciliation.
  - *Example:* A retail cashier sells the last unit of a product at 2:15 PM — the warehouse team and the online store (if connected) see “0 in stock” at 2:15 PM too, not the next morning.
- **Multi-Location Inventory:** Stock is tracked separately per warehouse, store, or storage bin, but can also be viewed as one consolidated number across the whole business.
  - *Example:* A business with 3 retail stores and 1 central warehouse can see “120 units total” at a glance, or drill down to see it's 40 in Warehouse, 30 in Store A, 50 in Store B.
- **Stock Transfers:** Move inventory between locations with a formal transfer request — marked “in transit” until the receiving location confirms it arrived.
  - *Example:* Warehouse sends 200 units to Store B. Store B's stock doesn't increase until someone there scans and confirms receipt — preventing “phantom stock” showing as available before it physically arrives.
- **Batch, Lot & Expiry Tracking:** For pharma, food, or cosmetics clients, track which batch/lot a unit belongs to and its expiry date, with automatic alerts as expiry approaches.
  - *Example:* A pharma distributor gets an automatic alert 60 days before a batch of medicine expires, so they can push it for sale or return it to the supplier before it becomes a write-off.
- **Low Stock & Reorder Alerts:** Set a minimum quantity per product; when stock drops below it, the system notifies the purchase team — or auto-drafts a purchase order.
  - *Example:* “Reorder Product X when stock falls below 50 units” — the system emails the procurement manager, or creates a draft PO ready for one-click approval.
- **Stock Adjustments & Audits:** Correct stock manually (for damage, theft, or count mismatches) with a mandatory reason code, and run periodic physical counts against system records.
  - *Example:* A warehouse audit finds 5 units missing — staff logs an adjustment with reason “Damaged in transit,” which is recorded and reportable, rather than the stock number silently changing.
- **Unit of Measure (UOM) Conversion:** Buy in one unit, sell in another, and let the system handle the math.
  - *Example:* A business buys cooking oil in 15-litre cartons from the supplier but sells it in 1-litre bottles to customers — the system auto-converts so “10 cartons received” correctly shows as “150 litres in stock.”

### 2. Billing & Invoicing
Turns every sale — retail or B2B — into a compliant, trackable financial record, without the business needing a separate accounting tool for day-to-day billing.
- **GST/Tax-Compliant Invoicing:** Taxes are calculated automatically based on product/HSN code and region, and invoices follow local compliance formats.
  - *Example:* A product tagged with HSN code 3004 automatically pulls the correct GST slab, so staff never have to manually calculate or guess the tax rate.
- **Multiple Invoice Types:** Beyond a standard sales invoice, the system supports proforma invoices (pre-sale quotes), credit/debit notes (for returns or corrections), and recurring invoices (for subscription-style B2B clients).
  - *Example:* A B2B customer on a monthly supply contract gets an invoice auto-generated and emailed on the 1st of every month, without anyone manually creating it.
- **Partial & Split Payments:** Customers can pay part of an invoice now and the rest later, or split one bill across cash + card + UPI — with the system tracking exactly what's still owed.
  - *Example:* A wholesale customer pays 50% upfront and 50% on delivery — the invoice shows “₹25,000 paid, ₹25,000 due,” not just “paid” or “unpaid.”
- **Payment Reminders & Ledger:** Every customer has a running ledger of invoices, payments, and dues, with automated reminders sent as due dates approach or pass.
  - *Example:* A customer with a 30-day credit term automatically gets a reminder email on day 25, and another on day 31 if still unpaid.

### 3. Purchase Order & Procurement Management
Manages the buying side of the business — from raising a purchase request to confirming what actually arrived.
- **Purchase Order Creation:** Raise a PO against a specific supplier with item-wise quantities, agreed rates, taxes, and expected delivery dates.
  - *Example:* The procurement manager creates a PO for “500 units of Product Y from Supplier A, delivery expected in 7 days” — this becomes the reference document for everything that follows.
- **Approval Workflows:** POs above a set value require sign-off from a manager (or a chain of managers) before they're sent to the supplier.
  - *Example:* Any PO above ₹1,00,000 needs Finance Head approval — the system routes it automatically and blocks it from being finalized until approved.
- **Supplier/Vendor Management:** A central database of suppliers with contact details, historical pricing, past order performance, and reliability notes.
  - *Example:* Before placing a new order, the buyer can see “Supplier A has delivered late 3 of the last 10 orders” and decide to split the order with a backup supplier.
- **Goods Receipt Note (GRN):** When goods arrive, staff check them against the original PO — flagging shortages, damages, or extra quantity — before stock is officially added.
  - *Example:* A PO was for 500 units, but only 480 arrived, with 5 damaged — the GRN records this discrepancy, and only 475 good units are added to sellable stock.
- **Auto-Procurement Triggers:** When stock hits the reorder point, the system can auto-generate a draft PO to the preferred supplier for that item, ready for review.
  - *Example:* Product Z hits its reorder threshold overnight — by morning, a draft PO to the usual supplier is already sitting in the procurement manager's queue, just needing approval.
- **Purchase Returns:** Send defective or excess stock back to a supplier, with a debit note generated and inventory automatically adjusted down.
  - *Example:* 20 damaged units are returned to Supplier A — the system generates a debit note for that value and removes those 20 units from stock.

### 4. QR Code & Barcode System
The physical-to-digital bridge — every product gets a scannable identity that ties its real-world movement to the system's records.
- **Unique QR/Barcode Generation:** Every product, batch, or even individual unit (depending on what the business needs) gets a unique, auto-generated QR/barcode.
  - *Example:* A furniture business generates one QR code per finished item (not just per product type), so each sofa can be individually traced from production to sale.
- **Bulk Label Printing:** Print QR/barcode labels for hundreds of products at once, formatted for standard label printers.
  - *Example:* After a stock intake of 1,000 new units, the warehouse team prints all 1,000 labels in one batch job instead of one at a time.
- **Scan-to-Search:** Scanning any product's code instantly brings up everything about it — current stock, price, location, batch, and history.
  - *Example:* A warehouse worker scans an item on a shelf and immediately sees “42 units left, located in Bin A-12, expires March 2027.”
- **Scan-Based Stock Operations:** Stock-in, stock-out, transfers, and audits can all be done by scanning rather than manual data entry, cutting down errors.
  - *Example:* During a stock transfer, staff scan each box as it's loaded onto the truck and again as it's unloaded — no manual quantity typing, no miscounts.
- **Traceability:** Follow a product's complete journey — procurement → warehouse → sale — using its code, useful for recalls, warranty claims, or audits.
  - *Example:* If a batch of a product is found defective, the business can scan-search that batch code and instantly see every customer who purchased from it — critical for a fast, targeted recall.

### 5. Point of Sale (POS) Billing
The front-line billing experience for retail staff — fast, scan-driven, and directly connected to live inventory.
- **Scan-and-Bill POS Interface:** Cashiers scan each item's QR/barcode to add it to the bill, with price and tax auto-populated — no manual lookup.
  - *Example:* A customer brings 8 items to the counter — the cashier scans all 8 in under a minute, and the bill total, tax, and change due are calculated automatically.
- **Offline Mode:** The POS keeps working even if the internet drops, queuing transactions locally and syncing automatically once the connection is back.
  - *Example:* A store loses internet for 20 minutes during peak hours — billing continues uninterrupted, and all 15 transactions from that window sync to the central system the moment Wi-Fi returns.
- **Multiple Payment Modes:** Accept cash, card, UPI, and wallets, including splitting one bill across more than one payment method.
  - *Example:* A customer pays ₹500 in cash and the remaining ₹1,200 via UPI on the same bill — the system logs both amounts separately for reconciliation.
- **Discounts & Promotions:** Apply discounts at the item level (e.g., “10% off this product”) or bill level (e.g., “flat ₹100 off above ₹2,000”), including coupon codes.
  - *Example:* A “Buy 2 Get 1 Free” promotion is set up once by the manager, and the discount applies automatically at checkout whenever a customer buys 3 of that item.
- **Returns & Exchanges at POS:** Process a return or exchange directly from the billing screen, with inventory and the customer ledger updated automatically.
  - *Example:* A customer returns a defective item bought last week — staff scan the original receipt, process the return, and the item is instantly added back into sellable (or damaged) stock.
- **Day-End Cash Reconciliation:** At shift close, the system compares the cash it expects to be in the register against what's actually counted.
  - *Example:* The system expected ₹18,400 in cash based on transactions, but only ₹18,200 was counted — the ₹200 shortfall is flagged for the manager to review, rather than going unnoticed.
- **Receipt Printing & Digital Receipts:** Print a physical receipt or send a digital copy via SMS, email, or WhatsApp — customer's choice.
  - *Example:* A customer skips the paper receipt and instead gets the invoice sent to their WhatsApp instantly.

### 6. Warehouse Management
Brings structure to physical storage and fulfillment so nothing gets “lost” in a warehouse and orders go out accurately.
- **Bin/Rack-Level Location Mapping:** Every product's exact physical location — aisle, rack, bin — is recorded, not just “in the warehouse somewhere.”
  - *Example:* Instead of searching the whole warehouse, a picker's task list says “Product X — Aisle 3, Rack B, Bin 12,” cutting fulfillment time significantly.
- **Pick, Pack & Dispatch Workflow:** A structured, trackable process for fulfilling an order: generate a picking list, confirm packing, then mark dispatched.
  - *Example:* An order for 10 different products auto-generates a single picking list sorted by warehouse location, so the picker walks the warehouse once instead of ten separate trips.
- **Inbound & Outbound Logistics:** Track shipments coming in from suppliers and going out to customers or other locations, all within one dashboard.
  - *Example:* The warehouse manager can see “3 inbound shipments expected today, 5 outbound orders to dispatch” on one screen each morning.
- **Warehouse-Wise Reporting:** Reports showing which products are moving fast vs. sitting idle, and how efficiently warehouse space is being used, per location.
  - *Example:* A report reveals that 30% of warehouse space is tied up in products that haven't sold in 6 months — prompting a clearance sale or better purchasing decisions going forward.

### 7. Retail & B2B Sales Management
Supports the two very different sales motions a business often runs side by side — walk-in retail and contract-based B2B — without needing separate systems.
- **Retail Storefront Operations:** Full POS and inventory sync across all retail outlets, so a multi-store chain is managed from one account.
  - *Example:* A business with 5 outlets sees combined sales performance across all stores, or filters down to see how just one underperforming store is doing.
- **B2B Order Management:** Separate pricing tiers, bulk order handling, and credit terms for wholesale/distributor customers, distinct from retail walk-ins.
  - *Example:* A distributor customer gets a 15% bulk discount and 30-day credit terms automatically applied, while a retail walk-in pays full price on the spot.
- **Customer-Specific Pricing:** Different price lists or discount slabs can be assigned to different customer categories or even individual customers.
  - *Example:* “Distributor tier” customers automatically see 20% off list price, “Retailer tier” sees 10% off, and general walk-ins see full price — all from the same product catalog.
- **Order-to-Cash Workflow:** A tracked path from initial quotation through sales order, invoice, and final payment — visible at every stage.
  - *Example:* A sales manager can see a B2B deal move from “Quote sent” → “Order confirmed” → “Invoiced” → “Payment received,” with timestamps at each step.
- **Customer & Vendor Portals:** Optional self-service login for B2B customers to view their order history, reorder past purchases, and download their own invoices.
  - *Example:* A regular distributor logs into their own portal at midnight to place next week's order, without needing to call or email the business.

### 8. Analytics & Reporting
Turns the operational data the platform is already capturing into decisions the business can act on.
- **Real-Time Dashboards:** Live views of sales, inventory, purchases, and cash flow, with each user role seeing the dashboard relevant to them.
  - *Example:* The owner sees an overall revenue dashboard, while the warehouse manager's dashboard shows stock and fulfillment metrics only.
- **Inventory Analytics:** Identify fast-moving vs. dead stock, calculate stock valuation (FIFO/LIFO/weighted average), and forecast reorder needs.
  - *Example:* The system flags that a product hasn't sold a single unit in 4 months and is tying up ₹50,000 in capital — a clear candidate for a clearance discount.
- **Sales & Revenue Reports:** Break down performance by product, category, location, or salesperson.
  - *Example:* A regional manager can instantly see which of the 3 stores under them is driving the most revenue this month, and which product category is underperforming.
- **Profitability Reports:** See actual margins, not just revenue, broken down by product, category, or customer.
  - *Example:* A product might have high sales volume but thin margins — this report surfaces that, so the business isn't chasing revenue that isn't actually profitable.
- **Custom Report Builder:** Build and export ad-hoc reports (Excel/PDF) using any combination of filters and metrics, without needing developer help.
  - *Example:* The finance team builds a one-off report for “all B2B invoices over ₹50,000 from Q1” for an internal audit, without asking IT to write a custom query.
- **Scheduled Reports:** Key reports are automatically emailed to the right stakeholders on a set schedule.
  - *Example:* Every Monday at 9 AM, the previous week's sales summary lands in the owner's inbox automatically.

### 9. User Management & Access Control
Ensures the right people see and do only what they're supposed to — important once a business has more than a handful of staff using the system.
- **Role-Based Access Control (RBAC):** Predefined roles (Admin, Warehouse Staff, Cashier, Accountant, Procurement Manager) plus the ability to create custom roles with specific permissions.
  - *Example:* A cashier can process sales and returns but can't see purchase costs or edit product pricing — because that's outside their role.
- **Multi-User, Multi-Location Access:** Users can be scoped to specific warehouses, stores, or departments, seeing only what's relevant to them.
  - *Example:* A Store B manager logs in and only sees Store B's inventory and sales — Store A and the central warehouse are invisible to them.
- **Activity Logs & Audit Trail:** Every create, edit, or delete action is logged with who did it and when — nothing happens invisibly.
  - *Example:* If a product's price is changed unexpectedly, the owner can check the audit trail and see exactly which staff account changed it, and at what time.
- **Two-Factor Authentication (2FA):** An extra login verification step (e.g., OTP) for sensitive roles like Admin and Finance, reducing the risk of unauthorized access.
  - *Example:* Even if an Admin's password is compromised, an attacker still can't log in without the OTP sent to the Admin's registered phone.

### 10. SaaS Platform Capabilities
The layer that makes this a true multi-business product rather than a single custom build — this is what lets the client sell it as a subscription platform to other businesses.
- **Multi-Tenant Architecture:** Each business that signs up gets its own isolated environment — data, settings, and users are never shared or visible across tenants.
  - *Example:* Business A and Business B both use the platform, but neither can ever see the other's inventory, sales, or customer data — even though they share the same underlying system.
- **Subscription & Billing Plans:** Tiered plans (e.g., Basic/Pro/Enterprise) with limits on users, warehouses, or transaction volume, billed automatically on a recurring basis.
  - *Example:* A small shop signs up for the ₹999/month Basic plan (1 store, 2 users), while a growing distributor upgrades to Enterprise for unlimited warehouses and users.
- **Onboarding Wizard:** A guided setup flow for new businesses — company details, tax settings, initial product/stock import, and inviting their team — so they're operational within a day, not weeks.
  - *Example:* A new signup uploads their existing Excel product list during onboarding, and the system bulk-imports it into their catalog automatically.
- **Notifications Engine:** Automated email, SMS, and WhatsApp alerts for order updates, low stock, payment reminders, and pending approvals.
  - *Example:* A procurement manager gets a WhatsApp message the moment a PO they raised is approved, without needing to log in and check.
- **Data Backup & Security:** Regular automated backups and encrypted storage, so a system failure or accidental deletion never means permanently lost business data.
  - *Example:* If a warehouse manager accidentally deletes a large batch of stock records, the business can restore from the previous night's backup rather than losing the data permanently.

### 11. GST & Tax Compliance
- **Automated GST Calculation:** Tax is calculated automatically on every invoice based on the product's HSN/SAC code and applicable rate slab, removing any manual tax entry or guesswork.
  - *Example:* A product mapped to HSN code 3004 automatically applies the correct GST rate on every bill, without staff needing to look it up.
- **CGST / SGST / IGST Handling:** The system automatically determines whether a transaction is intra-state or inter-state and applies CGST+SGST or IGST accordingly.
  - *Example:* A sale within the same state splits tax into CGST + SGST, while a sale to a customer in another state automatically applies IGST instead.
- **GSTR-1, GSTR-3B & Other Return-Ready Reports:** The platform generates GST return reports in the exact format required for filing, pulling directly from actual sales and purchase data — so there's no separate manual compilation needed.
  - *Example:* At month-end, the business generates a ready GSTR-1 report showing all outward supplies, matched against actual invoices raised that month.
- **TDS / TCS Support:** Handle other applicable taxes beyond GST — such as TDS on services or TCS on specified goods — with automatic calculation and reporting.
  - *Example:* A B2B transaction that attracts TCS has the tax automatically calculated and recorded at the time of billing, ready for quarterly reporting.
- **Multi-State / Multi-GSTIN Support:** For businesses operating in more than one state, each branch can be mapped to its own GSTIN, with tax and returns handled separately per registration.
  - *Example:* A business with branches in two states files separate, correctly segregated GST returns for each state's GSTIN, without mixing up the data.
- **Audit-Ready Tax Trail:** Every tax entry is logged and traceable back to its source invoice, making it easy to respond to a GST audit or notice without digging through paper records.
  - *Example:* If the tax department raises a query on a specific month's filing, the business can pull up every invoice behind that return in seconds.

---

## 🏛️ SECTION B: MASTER ARCHITECTURE & 43 MODULE SPECIFICATIONS

### ARCHITECTURAL ROLES & SYSTEM MANDATE

As Principal SaaS Architect, ERP Product Architect, Backend Engineer, Database Architect, Security Engineer, and Senior UI/UX Engineer, the platform design is governed by the following core principles:

1. **Non-Destructive Evolution:** This is an existing project. Existing functionality must NOT be removed, renamed, simplified, duplicated, or broken. Working modules must NOT be rebuilt unnecessarily.
2. **Modular Multi-Tenancy:** A true multi-tenant SaaS architecture where businesses only enable modules relevant to their operating domain (e.g., Pharmacy vs. Restaurant vs. Wholesaler vs. Hotel).
3. **Unified Business Data Foundation:** Avoid creating isolated duplicate customer, product, or inventory models for different industries. Shared core entities (`Tenant`, `Company`, `Branch`, `Store`, `Warehouse`, `User`, `Role`, `Product`, `Customer`, `Supplier`, `Invoice`) are extended by industry modules via specialized sub-tables.
4. **Clean Event-Driven Communication:** Modules interact across clean boundaries via asynchronous event streams and adapter interfaces rather than direct, uncontrolled internal dependencies.

---

## 🔍 SYSTEM ANALYSIS & EXISTING CAPABILITIES INVENTORY

### 1. Existing Feature Inventory
- **Authentication & Multi-Tenancy:** Multi-tenant workspace isolation, auth session state, role selection (`SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `PARENT`).
- **Core Entities:** Master product catalog (`products`), customer/people rosters, user permissions.
- **Inventory Engine:** Stock tracking, batch/expiry fields, multi-location/store capability.
- **POS & Billing Engine:** High-performance billing interface, multi-tender payments, offline draft support.
- **GST Tax Engine:** Tax slabs (0%, 5%, 12%, 18%, 28%), HSN mapping, CGST/SGST vs IGST split calculations.
- **Print & Digital Dispatch:** Thermal receipt engine, PDF print rendering, WhatsApp notification dispatch integration.

### 2. Missing & Partial Capabilities Inventory
- **PARTIAL:** Offline POS Synchronization queue with deduplication locks.
- **PARTIAL:** Event-driven accounting auto-posting from POS/billing events.
- **MISSING:** Industry extension schemas (Pharmacy Drug Licenses, Restaurant KDS/KOT, Hotel Reservations, Garments Matrix).
- **MISSING:** Reusable universal workflow/approval engine across modules.
- **MISSING:** Enterprise Integration Hub adapters (Razorpay, Shiprocket, Tally, Shopify, WhatsApp Business Platform).

---

## 🗺️ MASTER MODULE DEPENDENCY MAP

```
                        [ INCORVO ONE ]
                               │
                 [ ONE BUSINESS DATA FOUNDATION ]
                               │
    ┌──────────────────────────┼──────────────────────────┐
    ▼                          ▼                          ▼
[ INVENTORY ] ──────────► [ SALES & POS ] ──────────► [ PURCHASE ]
    │                          │                          │
    ▼                          ▼                          ▼
[ WAREHOUSE ] ──────────► [ LOGISTICS ] ──────────► [ ACCOUNTING ]
    │                          │                          │
    └──────────────────────────┼──────────────────────────┘
                               ▼
               [ COMPLIANCE & GST (GSTR/IRN) ]
                               │
            [ ANALYTICS & AI BI (READ-ONLY) ]
```

---

## 🎯 43 MASTER MODULE SPECIFICATIONS

---

### 01. INVENTORY MANAGEMENT MODULE

#### Status: IMPLEMENTED (Core) / EXTENDING (Advanced)

* **Product Master Structure:** Categories, Subcategories, Brands, SKU, HSN/SAC, Variants, Attributes, Size/Color Matrices, Images, Custom Fields, Product Tags.
* **Product Classification Support:** Simple Products, Variant Products, Bundles, Kits, Composite Products, Batch Products, Serial-Number Products, IMEI-Tracked Goods.
* **Inventory Capabilities:** Real-time stock, Multi-location, Multi-store, Multi-warehouse, Available to Promise (ATP), Reserved Stock, In-transit Stock, Opening Stock, Minimum/Maximum Stock, Safety Stock, Dynamic Reorder Points (ROL).
* **Stock Operations:** Stock In, Stock Out, Stock Transfer (STIR), Stock Adjustment, Reconciliation, Physical Stock Counting, Cycle Counting, Damaged Stock, Expired Stock, Quarantine Isolation.
* **Batch & Lot Controls:** Batch Number, Lot Number, Manufacturing Date, Expiry Date, Batch Purchase Price, Batch Selling Price, FEFO Enforcement.
* **UOM & Conversions:** Piece, Box, Carton, Strip, Tablet, Kg, Gram, Litre, Custom Units with fractional UOM conversion matrices.
* **Valuation & Analytics:** FIFO, Weighted Average Costing (WAC), Landed Costing, Dead Stock, Slow-Moving Stock, Fast-Moving Stock, Inventory Ageing, Stock Turnover Ratio.

---

### 02. BARCODE & QR CODE MODULE

#### Status: IMPLEMENTED (Core) / EXTENDABLE

* **Generation & Printing:** Barcode (EAN-13, CODE-128) & QR Generation, Custom Label Designer, Bulk Thermal Label Printing (ZPL/TSPL), Hardware Scanner Support (USB/Bluetooth/Camera).
* **Scan-to-Action Operations:** Scan to Search Product, Receive Stock (GRN), Transfer Stock, POS Sale, Audit Stock, Pick Orders, Pack Orders.
* **Traceability:** Full batch-level and serial-number level supply chain lineage tracing and automated 1-click batch recall alerts.

---

### 03. POINT OF SALE (POS) MODULE

#### Status: IMPLEMENTED (Core) / EXTENDING (Offline Sync & Industry Layouts)

* **Multi-Industry Layouts:** Fast POS interfaces optimized for Retail, Pharmacy, Supermarket, Restaurant (KDS/KOT), Garments, Electronics.
* **Terminal Features:** Barcode/QR Billing, Product Quick Search, Touch POS, Keyboard Shortcuts, Hold/Resume Cart, Multiple Counters, Multiple Registers.
* **Payment Modes:** Cash, UPI, Credit/Debit Card, Mobile Wallet, Split Payment, Partial Payment, Customer Credit, Gift Card, Store Credit Vouchers.
* **Promotions & Pricing:** Item Discount, Invoice Discount, Percentage/Flat Discounts, Coupons, Buy X Get Y (BOGO), Quantity Price Slabs, Scheduled Promotions, Customer-Specific Pricing Matrix.
* **Returns & Cashier Controls:** Sales Return, Item Exchange, Cash Refund, Store Credit Voucher, Shift Opening Float, Shift Closing Count, Blind Cash Reconciliation, Manager Override PINs.
* **Offline Operations:** Full offline billing using IndexedDB local storage with background synchronization manager and client UUID deduplication.

---

### 04. BILLING & INVOICING MODULE

#### Status: IMPLEMENTED

* **Document Types:** GST Invoice, Tax Invoice, Non-GST Invoice, Retail Invoice, B2B Invoice, Proforma Invoice, Quotation, Estimate, Recurring Invoice, Delivery Challan, Credit Note, Debit Note, Purchase Invoice.
* **Customization & Print:** Multiple Templates, Custom Visual Designer, Business Logo, Terms & Conditions, Bank Account Info, Dynamic UPI QR Code, Digital Signatures, Thermal (58mm/80mm), A4, A5 printing.
* **Digital Sharing:** PDF Export, Email Dispatch, SMS Alerts, WhatsApp API Sharing.
* **Numbering Sequences:** Isolated custom invoice numbering sequences by Company, Branch, Store, and Financial Year.

---

### 05. SALES MANAGEMENT MODULE

#### Status: PARTIAL

* **End-to-End Workflow:** Lead ➔ Quotation ➔ Sales Order ➔ Inventory Reservation ➔ Picking ➔ Packing ➔ Dispatch ➔ Delivery ➔ Invoice ➔ Payment Settlement.
* **Sales Motions:** Retail Walk-in, B2B Wholesale, Pre-orders, Backorders, Recurring Orders.
* **Salesforce Governance:** Salesperson Assignment, Sales Targets, Commission Structures, Territory Scoping, Performance Tracking.

---

### 06. PROCUREMENT MODULE

#### Status: PARTIAL

* **Procurement Workflow:** Purchase Request (PR) ➔ RFQ ➔ Supplier Quotations ➔ Comparison Matrix ➔ Purchase Order (PO) ➔ Multi-Tier Approval ➔ GRN ➔ QC Inspection ➔ Purchase Invoice ➔ Payment.
* **Supplier Governance:** Supplier Master Directory, Contracted Pricing, Purchase History, Preferred Suppliers, Lead Time SLAs, Minimum Order Quantities (MOQ), Purchase Returns, Debit Notes.
* **Auto-Replenishment:** Automated draft PO generation when stock drops below safety reorder points.

---

### 07. WAREHOUSE MANAGEMENT MODULE (WMS)

#### Status: PARTIAL

* **Spatial Hierarchy:** Warehouse ➔ Zone ➔ Aisle ➔ Rack ➔ Shelf ➔ Bin.
* **Warehouse Operations:** Receiving, Put-away Optimization, Picking, Wave Picking, Batch Picking, Packing Verification, Dispatch, Inter-Bin Transfers, Cycle Counting.
* **Stock State Tracking:** Available, Reserved, In-Transit, Damaged, Quarantined, Expired.
* **Analytics:** Bin occupancy rates, volumetric capacity, and picker productivity metrics.

---

### 08. DELIVERY & LOGISTICS MODULE

#### Status: MISSING (V2 Priority)

* **Order Delivery Engine:** Delivery Orders, Delivery Zones, Dynamic Delivery Charges, Delivery Time Slots, Scheduled Delivery, Same-Day Express, Customer Pickup, COD Management.
* **Driver Fleet Management:** Driver Profiles, Availability Toggles, Vehicle Allocation, Order Assignment, Workload Balancing.
* **Delivery Lifecycle States:** Pending ➔ Assigned ➔ Picked Up ➔ Out for Delivery ➔ Nearby ➔ Delivered ➔ Failed ➔ Returned.
* **Proof of Delivery (POD):** OTP Verification, Customer Digital Signature, Photo Capture, Delivery Note.
* **Future Telematics Architecture:** Hooks for GPS live tracking, route optimization engines, and driver mobile apps.

---

### 09. CRM (CUSTOMER RELATIONSHIP MANAGEMENT)

#### Status: PARTIAL

* **Customer Master Records:** Customer Profiles, Customer Groups/Tiers, Leads, Opportunities, Follow-up Logs, Pipeline Visualizer, Customer Notes, Interaction History.
* **360-Degree Customer Mapping:** Direct linkage to Purchases, Invoices, Payments, Returns, Credit Balance, Loyalty Points, Support Tickets, Communication History.
* **Credit Governance:** Credit Limits, Credit Terms, Outstanding Receivables Balance, Customer Ageing Buckets (0-30, 31-60, 61-90, 90+), Customer Segmentation, Customer Lifetime Value (CLTV).

---

### 10. LOYALTY & REWARDS MODULE

#### Status: PARTIAL

* **Reward Infrastructure:** Points Accumulation Engine, Reward Rules, Membership Tiers (Bronze/Silver/Gold), Coupons, Birthday Offers, Referral Codes, Cashbacks, Gift Cards, Customer Wallet, Store Credit Vouchers, Redemption Cap Rules.

---

### 11. ACCOUNTING & FINANCE MODULE

#### Status: PARTIAL (V2 Priority for Full Double-Entry)

* **Core Accounting:** Chart of Accounts, General Ledger, Journal Entries, Accounts Payable (AP), Accounts Receivable (AR), Cash Book, Bank Book, Expense Management, Income Categorization.
* **Voucher Types:** Payment Voucher, Receipt Voucher, Contra Voucher, Journal Voucher.
* **Financial Statements:** Profit & Loss (P&L), Balance Sheet, Cash Flow Statement, Trial Balance, Customer Ageing, Supplier Ageing, Outstanding Receivables/Payables.
* **Reconciliation:** Bank Reconciliation Statement (BRS) with automated accounting transaction posting originating directly from POS, Billing, and Purchase GRN events.

---

### 12. GST & INDIA COMPLIANCE MODULE

#### Status: IMPLEMENTED (Core) / EXTENDING (E-Invoice & E-Way Bill)

* **Tax Structure:** GSTIN Master, Multi-GSTIN Support per Legal Entity, HSN/SAC Code Mapping, CGST + SGST (Intra-State) vs IGST (Inter-State) Auto-Split.
* **GST Returns:** GSTR-1 Outward Supply JSON, GSTR-3B Tax Summary Worksheet, GSTR-2B Input Tax Credit (ITC) Reconciliation Assistant.
* **Direct Compliance Integrations:** E-Invoice (IRN Generation, Invoice QR), E-Way Bill Dispatch Credentials, TDS (Section 194C/J), TCS (Section 206C(1H)).
* **Audit & Adapter Pattern:** Immutable Tax Audit Trail, CA/Accountant Dedicated Access Roles. Provider-agnostic adapter interfaces allowing replacement of GST/e-invoice GSP gateways without modifying business logic.

---

### 13. HRMS (HUMAN RESOURCE MANAGEMENT)

#### Status: MISSING (V2 Priority)

* **Employee Master:** Profiles, Departments, Designations, Branches, Reporting Managers, Employee Document Vault, Joining ➔ Probation ➔ Confirmation ➔ Exit Workflows.
* **Attendance Engine:** Biometric Terminal Integration, Web Clock-In, Mobile Geofence Clock-In, Shift Schedules, Roster Management, Late Entry Penalties, Overtime Computation, Regularization Requests.
* **Leave Management:** Policy Definition, Balance Ledgers, Application Workflows, Approval Chains, Holiday Calendars.
* **Operational HR:** Employee Asset Tracking, Company Announcements, Onboarding & Offboarding Checklists.

---

### 14. PAYROLL MODULE

#### Status: MISSING (V2 Priority)

* **Execution Engine:** Consumes real-time Attendance, Leave Balances, Overtime Hours, and Salary Structures.
* **Earnings & Deductions:** Basic, HRA, Allowances, Incentives, Commission, Overtime, Bonus, Advance Recovery, Loan Deductions, Provident Fund (PF), ESI, Professional Tax (PT), TDS.
* **Outputs:** Monthly Payroll Register, Bank Payout Statements, Digital Employee Payslips.

---

### 15. PHARMACY INDUSTRY MODULE

#### Status: PARTIAL

* **Medicine Master Extensions:** Brand Name, Generic Name, Chemical Composition, Salt, Manufacturer, Batch Number, Expiry Date, MRP, Purchase Price, GST Slab, Shelf/Rack Bin.
* **Unit Formats:** Strip, Tablet, Box, Bottle, Custom UOM Conversion Math.
* **Compliance Safeguards:** Batch-wise Inventory, Near-Expiry Warnings, Hard Lock on Expired Stock, FEFO Enforcement, Batch Recall Alerts, Supplier Defective Return, Doctor Prescription File Attachment, Drug Licence Number Print on Invoices.

---

### 16. PHARMACY WHOLESALE MODULE

#### Status: MISSING (V2 Priority)

* **B2B Retailer Governance:** Retailer Chemist Accounts, Bulk Ordering Matrix, Retailer-Specific Price Lists, Schemes (e.g., 10+1 Free), Credit Terms, Credit Limit Enforcement, Outstanding Collection Tracking.
* **Medical Representative (Salesman) Tracking:** Territory Management, Beat/Route Plans, Customer Visit Logs, Order Booking, Collection Entry, Target VS Achievement Analytics.
* **Warehouse Execution:** Batch-specific picking, packing, dispatch manifests, and delivery tracking.

---

### 17. SUPERMARKET & LARGE RETAIL MODULE

#### Status: PARTIAL

* **Retail Scale Infrastructure:** Large Product Catalog, Multi-Counter Checkout, Price Look-Up (PLU) Codes, Weighted Produce Product Support, Electronic Scale Integration Architecture, Thermal Shelf Edge Label Design, Automated Promotional Bundles, Cashier Shift Reconciliation, Store-Wise Analytics.

---

### 18. GARMENTS & APPAREL MODULE

#### Status: MISSING (V2 Priority)

* **Apparel Hierarchy:** Style Code, Collection, Season, Brand Name.
* **Variant Matrix:** Product ➔ Size (S/M/L/XL/XXL) ➔ Color ➔ Fit. Individual barcode labels generated per size/color variant.
* **Retail Operations:** Item Exchange Workflows, Store-to-Store Stock Transfers, Variant-Level Inventory Matrix Views.

---

### 19. ELECTRONICS & DURABLES MODULE

#### Status: MISSING (V2 Priority)

* **Serial & Trackers:** Individual Unit Serial Number, IMEI Tracking, Model Number, Manufacturer Warranty Period, Accessory Bundling.
* **Post-Sales Service:** Warranty Claim Tracking, Repair/Service Ticket Logs, Annual Maintenance Contracts (AMC) Management.

---

### 20. RESTAURANT & CAFE MODULE

#### Status: MISSING (V2 Priority)

* **Menu Architecture:** Menu Master, Categories, Item Variants, Modifiers, Add-ons, Combo Meals.
* **Dining Modes:** Dine-In Table Management, Takeaway, Online Delivery.
* **Kitchen Workflow:** Waiter Mobile Ordering ➔ Kitchen Order Ticket (KOT) ➔ Kitchen Display System (KDS) / Kitchen Thermal Printers ➔ Order Prepared ➔ Served ➔ Bill Settlement.
* **Table Management:** Split Bill, Merge Tables, Move Table.
* **Food Costing & Recipe BOM:** Recipe Ingredient Bill of Materials, Automatic Ingredient Stock Deduction on KOT, Kitchen Wastage Logging, Food Costing Analytics.

---

### 21. HOTEL & HOSPITALITY MODULE

#### Status: FUTURE (V3 Priority)

* **Reservation Engine:** Room Types, Room Master, Live Availability Matrix, Interactive Booking Calendar, Guest Profile Database.
* **Front Desk:** Guest Check-In, Check-Out, Room Allocation, Deposit Collection, Advance Invoices, Cancellation Rules.
* **Housekeeping & Services:** Housekeeping Room Status (Clean/Dirty/Maintenance), Room Service Ordering, Minibar Billing.
* **Integrated POS & Channel Integration:** Direct posting of restaurant POS bills to guest room folios; integration hooks for OTA / Channel Managers.

---

### 22. E-COMMERCE & OMNICHANNEL MODULE

#### Status: MISSING (V2 Priority)

* **Single Inventory Master:** Synchronized real-time stock across POS, Direct E-commerce Storefront, Marketplaces, and B2B Portals.
* **Official API Adapters:** Integration adapter interfaces for Shopify, WooCommerce, Amazon, Flipkart, and Meesho.
* **Sync Engine:** Bi-directional real-time synchronization of Products, Prices, Stock Levels, Orders, Customer Details, and Fulfillment Tracking.

---

### 23. MOBILE APPLICATION ECOSYSTEM

#### Status: PARTIAL (Web Responsive) / MISSING (Native Apps V2)

* **API Endpoints Designed For:**
  1. **INCORVO OWNER:** Executive Dashboard, Real-time Sales Ticker, Reports, Approvals, Alerts.
  2. **INCORVO POS:** Mobile/Tablet Rapid Billing.
  3. **INCORVO SALES:** Field Agent Customer Orders, Collections, Beat Routes, Targets.
  4. **INCORVO WAREHOUSE:** Receiving GRN, Barcode Scan, Pick, Pack, Transfer, Count.
  5. **INCORVO DELIVERY:** Driver Orders, Route Navigation, OTP Verification, Proof of Delivery.
  6. **INCORVO EMPLOYEE:** Employee Clock-in, Attendance Logs, Leave Applications, Payslip Downloads.

---

### 24. DOCUMENT MANAGEMENT MODULE

#### Status: PARTIAL

* **Central Document Vault:** Attach files directly to Customers, Suppliers, Employees, Products, Orders, Invoices, Purchases, and Deliveries.
* **Document Types:** Contracts, GST Registration Certificates, Trade Licenses, Purchase Bills, Prescriptions, Warranty Cards, Delivery Proofs.
* **Alert System:** Automated document expiry alert worker (e.g., Drug License, GST Registration, Contract Renewals).

---

### 25. WORKFLOW & REUSABLE APPROVAL ENGINE

#### Status: MISSING (V2 Priority — Reusable Engine)

* **Centralized Reusable Engine:** Do NOT hardcode approval logic inside individual modules. Build a single engine `WorkflowApprovalService`.
* **Configurable Rules:** Define monetary thresholds, category rules, and multi-tier manager roles.
* **Use Cases:** Purchase Orders (> ₹100k), Cashier Discounts, Refund Approvals, Manual Stock Adjustments, Expense Approvals, Vendor Payments, Employee Leave, Credit Limit Overrides, Base Price Changes.

---

### 26. COMMUNICATION ENGINE

#### Status: PARTIAL (WhatsApp/SMS Outbound)

* **Provider-Agnostic Dispatcher:** Centralized service `NotificationDispatcher` decoupled from underlying vendors via adapter patterns.
* **Channels:** Email (SMTP/SendGrid), SMS Gateways, WhatsApp Business Platform API, Mobile Push (FCM), In-App System Alerts.
* **Event Triggers:** Low Stock, Batch Expiry, Payment Due Reminders, PO Approval Requests, Order Confirmation, Dispatch Tracking, Delivery OTP, Suspicious Activity, Daily Executive Summaries.

---

### 27. ANALYTICS & REPORTING MODULE

#### Status: IMPLEMENTED (Core Dashboards) / EXTENDING (Ad-hoc Builder)

* **Role-Based Dashboards:** Owner, CFO, Sales Manager, Purchasing Head, Warehouse Lead, HR Manager, Store Supervisor.
* **Comprehensive Reports:** Sales, Revenue, Gross Margin, Purchases, Inventory Valuation (FIFO/WAC), Stock Ageing, Dead Stock, Fast/Slow Moving SKUs, Customer Receivables, Supplier Payables, Tax Liability, Delivery SLAs.
* **Features:** Filters, Drill-down views, Excel export, PDF export, Scheduled Email Reports, Ad-hoc Drag-and-Drop Report Builder.

---

### 28. AI & BUSINESS INTELLIGENCE LAYER

#### Status: PARTIAL (Aira AI Assistant Core) / FUTURE (Advanced BI V3)

* **Conversational AI Assistant (Aira):** Answers queries regarding daily sales, low stock alerts, expiring medicine batches, customer dues, and store benchmarks.
* **Predictive Intelligence:** Demand Forecasting, Dynamic Reorder Recommendations, Dead-Stock Detection, Anomaly Detection (suspicious voids/discounts), Automated Expense Classification, Supplier Comparison.
* **CRITICAL SAFETY GOVERNANCE:** AI must NEVER autonomously execute sensitive operations (Payments, Refunds, Tax Filings, Stock Deletions, Price Overrides, Payroll Execution, Financial Postings) without explicit human authorization.

---

### 29. INTEGRATION HUB

#### Status: PARTIAL (Provider Adapters Required)

* **Decoupled Provider Adapters:**
  - **Payments:** Razorpay, Cashfree, PayU, PhonePe, Dynamic UPI, EDC Pin-Pad Terminals.
  - **Communications:** WhatsApp Business API, SMS Gateways, SendGrid/Email.
  - **Accounting Export:** Tally Prime XML, Zoho Books API.
  - **E-Commerce:** Shopify, WooCommerce APIs.
  - **Marketplaces:** Amazon, Flipkart, Meesho.
  - **Logistics:** Shiprocket, Delhivery, BlueDart APIs.
  - **Compliance:** NIC GST Portal, E-Invoice IRP Gateway, E-Way Bill Portal.
  - **Hardware:** Biometric Attendance Terminals, Weighing Scales, Thermal Printers.
  - **Identity:** Google SSO, Microsoft SSO, OTP Gateways.
* **Architecture Rules:** Use interfaces, adapters, provider configs, webhooks, exponential backoff retries, and transaction idempotency keys.

---

### 30. API & DEVELOPER PLATFORM

#### Status: IMPLEMENTED (Core REST APIs) / EXTENDING (Webhooks)

* **Versioned REST API Infrastructure:** `/api/v1/products`, `/api/v1/inventory`, `/api/v1/customers`, `/api/v1/suppliers`, `/api/v1/orders`, `/api/v1/invoices`, `/api/v1/payments`, `/api/v1/employees`, `/api/v1/reports`.
* **Webhook Architecture:** Event webhooks for `order.created`, `order.paid`, `invoice.created`, `inventory.updated`, `payment.received`, `delivery.completed`.
* **Security Guardrails:** Bearer JWT authentication, RBAC authorization, IP rate limiting, strict tenant isolation middleware.

---

### 31. SECURITY & GOVERNANCE

#### Status: IMPLEMENTED (Core RBAC & Isolation)

* **Security Controls:** Role-Based Access Control (RBAC), Fine-grained permission keys, Multi-Factor Authentication (2FA/MFA), Session Management, Active Device Management, Login Audit History.
* **Immutable Audit Logging:** Captures WHO, WHAT, WHEN, WHERE (IP/Device), OLD VALUE, NEW VALUE for every sensitive data mutation.
* **Tenant Guardrails:** Strict data boundary enforcement (PostgreSQL Row-Level Security). Data from Tenant A is strictly inaccessible by Tenant B.
* **Encryption & Recovery:** AES-256 Data at Rest Encryption, TLS 1.3 Data in Transit, Daily Automated Backups, Point-In-Time Recovery (PITR), Data Export Tools.

---

### 32. MULTI-COMPANY & MULTI-BRANCH TOPOLOGY

#### Status: IMPLEMENTED (Core Tenant Schema)

* **Structural Hierarchy:** Account (Tenant) ➔ Legal Company ➔ Branch ➔ Store ➔ Warehouse.
* **Scoped Access Controls:** Users scoped to single store, multiple stores, single legal entity, or consolidated enterprise account.
* **Legal Entity Scoping:** Separate GSTIN, Bank Accounts, Invoice Sequences, Financial Accounting Ledgers, and Employee Rosters per Legal Company.

---

### 33. SAAS PLATFORM & SUBSCRIPTION ENGINE

#### Status: IMPLEMENTED (Core Infrastructure)

* **Multi-Tenant SaaS Management:** Automated Tenant Provisioning, Subscription Plans (Starter, Professional, Business, Enterprise), Trial Period Governance, Auto-Renewals, Upgrades/Downgrades, Feature Add-ons.
* **Entitlement Management:** Dynamic feature flags and metered resource limits (Per-User, Per-Store, Per-Module caps) driven by configurable entitlements rather than hardcoded rules.

---

### 34. CUSTOMER & SUPPLIER PORTALS

#### Status: PARTIAL (Self-Service Views)

* **B2B Customer Portal:** Order Placement, Invoice Download, Payment Settlement, Outstanding Dues Statement, Quick Re-ordering, Return Requests.
* **Supplier Portal:** Purchase Order Review, Delivery ASN Submission, Digital Invoice Upload, Return Debit Notes, Vendor Ledger Statements.

---

### 35. UNIVERSAL SEARCH ENGINE

#### Status: IMPLEMENTED (Core Search)

* **Global Search Scope:** Products, SKUs, Barcodes, Customer Names, Phone Numbers, Invoice Numbers, Order IDs, Supplier Records, Employee Profiles.
* **Tenant Isolation:** All search queries strictly injected with tenant-scoped filtering clauses.

---

### 36. DATA IMPORT & EXPORT ENGINE

#### Status: IMPLEMENTED (Core Importers)

* **Bulk Processing:** Excel (.xlsx) and CSV bulk upload processing for Products, Customers, Suppliers, Opening Stock, Employee Profiles, Price Lists.
* **Data Safeguards:** Pre-import Data Validation, Dry-Run Preview, Line-by-Line Error Log Generation, Single-Transaction Rollback Strategy.

---

### 37. COMMON PLATFORM DATA MODEL REQUIREMENTS

#### Status: ARCHITECTURAL RULE (Enforced)

Shared core data entities MUST be extended by industry-specific modules rather than creating duplicate isolated tables:

```sql
-- Core Shared Model
CREATE TABLE products (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  sku VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  base_price NUMERIC(12,2) NOT NULL
);

-- Pharmacy Industry Extension
CREATE TABLE pharmacy_product_details (
  product_id UUID PRIMARY KEY REFERENCES products(id),
  generic_name VARCHAR(255),
  composition TEXT,
  drug_license_category VARCHAR(50),
  is_schedule_h_drug BOOLEAN DEFAULT FALSE
);

-- Electronics Industry Extension
CREATE TABLE electronics_product_details (
  product_id UUID PRIMARY KEY REFERENCES products(id),
  model_number VARCHAR(100),
  warranty_months INT DEFAULT 12,
  requires_imei BOOLEAN DEFAULT TRUE
);
```

---

### 38. EVENT-DRIVEN MODULE COMMUNICATION

#### Status: ARCHITECTURAL RULE (Enforced)

Modules must decouple side-effects through an event bus using idempotent consumers:

```
[ POS SALE COMPLETED EVENT ]
             │
             ├──► Inventory Module  ──► Deduct Stock
             ├──► Accounting Module ──► Post Sales & Tax Journal
             ├──► Loyalty Module    ──► Award Points
             ├──► Analytics Module  ──► Update Live Ticker
             └──► Notification Hub  ──► Dispatch WhatsApp Receipt
```

---

### 39. UI / UX DESIGN SYSTEM GUIDELINES

#### Status: IMPLEMENTED (Modern Clean SaaS System)

* **Interface Standard:** Professional, modern, high-density SaaS ERP dashboard. Desktop-first, fully responsive for tablets and mobile operational screens.
* **Component Library:** Collapsible Sidebar Navigation, Top Action Bar, Global Search Input, Notification Center, Dashboard Cards, SVG Micro-Charts, Data Tables, Filter Toolbars, Slide-out Drawers, High-Contrast Modals.
* **Visual Restraint:** Avoid oversized cards, excessive rainbow gradients, distracting animations, large empty whitespace, over-rounded elements, and inconsistent color tokens.

---

### 40. PERFORMANCE & SCALABILITY ARCHITECTURE

#### Status: IMPLEMENTED (Modular Core)

* **Scalability Path:** Designed to scale cleanly from 10 to 100,000+ users. Clean modular monolith architecture today with isolated module boundaries allowing future extraction into microservices (Notifications, Analytics, File Import/Export) when traffic demands.
* **Caching Layer:** Redis used strictly for Sessions, Rate Limiting, Active Cart Locks, Dashboard Caches, and Job Queues. Database remains the single source of truth.

---

### 41. SYSTEM OBSERVABILITY & LOGGING

#### Status: IMPLEMENTED (Core Logging)

* **Structured Logging:** All logs emitted in JSON format containing `request_id`, `tenant_id`, `user_id`, `module`, `action`, `duration_ms`, and `error_stack`.
* **Monitoring Infrastructure:** Health check endpoints (`/healthz`), centralized error tracking hooks, and transaction execution duration timers.

---

### 42. BACKGROUND JOB PROCESSING

#### Status: IMPLEMENTED (Async Queue Engine)

* **Asynchronous Execution:** Long-running operations (Invoice PDF Emailing, WhatsApp Receipts, Report Exports, Reorder Calculations, Expiry Alerts, E-commerce Sync, AI Processing) are offloaded to background queues (Redis/BullMQ) to prevent blocking main HTTP server threads.

---

### 43. MASTER MODULE STRUCTURE DIRECTORY

```
INCORVO ONE
├── CORE
│   ├── Inventory
│   ├── POS
│   ├── Billing
│   ├── Sales
│   ├── Purchase
│   ├── Warehouse
│   ├── Delivery
│   ├── CRM
│   ├── Loyalty
│   ├── Accounting
│   ├── GST
│   ├── Expenses
│   └── Documents
├── PEOPLE
│   ├── HRMS
│   ├── Attendance
│   ├── Leave
│   └── Payroll
├── COMMERCE
│   ├── Retail
│   ├── B2B
│   ├── Wholesale
│   ├── E-Commerce
│   ├── Marketplace
│   ├── Customer Portal
│   ├── Supplier Portal
│   └── Salesman
├── INDUSTRIES
│   ├── Pharmacy
│   ├── Pharmacy Wholesale
│   ├── Supermarket
│   ├── Retail
│   ├── Wholesale
│   ├── Restaurant
│   ├── Cafe
│   ├── Hotel
│   ├── Garments
│   └── Electronics
├── INTELLIGENCE
│   ├── Dashboards
│   ├── Analytics
│   ├── Forecasting
│   ├── Recommendations
│   ├── Anomaly Detection
│   └── AI Assistant (Aira)
└── PLATFORM
    ├── Multi-Tenant
    ├── Multi-Company
    ├── Multi-Branch
    ├── Subscription
    ├── RBAC
    ├── Workflow
    ├── Notifications
    ├── Integration Hub
    ├── API
    ├── Webhooks
    ├── Security
    ├── Audit
    ├── Offline Sync
    └── Backup
```

---

## 🚀 2-PHASE IMPLEMENTATION ROADMAP

To ensure commercial viability while establishing a scalable architecture, development is structured into 2 distinct execution phases:

---

### 🔹 PHASE 1: V1 COMMERCIAL FOUNDATION (CURRENT FOCUS)

#### 🎯 Goal: Deliver the core multi-tenant ERP platform powering Retail, Supermarkets, Basic Pharmacy, and B2B Operations.

1. **Platform & Security Foundation:**
   - Multi-Tenant Isolation (PostgreSQL RLS) & Automated Provisioning
   - Account ➔ Company ➔ Branch ➔ Store Topology
   - RBAC Security & Audit Trail Logging
   - Subscription Entitlements & Metered Limits
2. **Core Commercial Operations:**
   - Universal Product Master & Custom Attribute Builder
   - Real-Time Inventory Ledger, Multi-Location & Batch/Expiry Controls
   - Barcode/QR Code Generator, Thermal Label Printer Studio, Scan-to-Bill
   - High-Speed Touch/Keyboard POS Terminal with Offline IndexedDB Sync
   - Comprehensive Billing & Invoicing Engine (GST, Retail, B2B, Proforma, Credit/Debit Notes)
   - Sales Order to Cash Pipeline & Procurement PO Approval Workflows
   - Supplier & Customer Master Ledgers with Dunning Payment Reminders
   - Basic Warehouse Bin Allocations & Wave/Batch Picking Lists
3. **Compliance & Analytics:**
   - GST Engine: CGST/SGST/IGST Split, HSN Slabs, GSTR-1, GSTR-3B, GSTR-2B Recon
   - Payment Multi-Tender Settlement (Cash, Cards, UPI, Store Credit Vouchers)
   - Executive Dashboards, Inventory Valuation (FIFO/WAC), Sales & Tax Reports
   - Notification Hub (WhatsApp, SMS, Email Dispatch) & Universal Search

---

### 🔸 PHASE 2: V2 & V3 ENTERPRISE & INDUSTRY EXTENSIONS

#### 🎯 Goal: Scale into specialized verticals, deep financial accounting, telematics, and AI intelligence.

1. **V2 Operations & Specialized Verticals:**
   - Full Double-Entry Accounting & General Ledger (P&L, Balance Sheet, Trial Balance, BRS)
   - HRMS & Automated Payroll (Biometric Attendance, Shifts, Leaves, Payslips)
   - Complete Delivery & Logistics Engine (Driver Assignment, OTP POD, Route Hooks)
   - Advanced CRM Pipeline & Loyalty Points / Membership Tiers
   - Pharmacy Wholesale (Salesman Beat Routes, Retailer Schemes)
   - Restaurant & Cafe Module (Menu Modifiers, Table Management, KOT/KDS, Ingredient BOM Deduction)
   - Garments Apparel Matrix (Size/Color Grid Barcoding) & Electronics IMEI/Warranty Tracking
   - Omnichannel E-commerce API Adapters (Shopify, WooCommerce, Amazon, Flipkart)
   - Dedicated Native Mobile Operational Apps (Owner, POS, Sales, Warehouse, Delivery, Employee)
   - Reusable Workflow & Approval Engine across all modules
2. **V3 Advanced Intelligence & Ecosystem:**
   - Hotel & Hospitality Module (Room Reservations, Folio Billing, Housekeeping)
   - E-Invoice (IRN) & E-Way Bill Direct GSP API Integrations
   - Advanced BI, Demand Forecasting, Anomaly Detection & Conversational AI Assistant (Aira)
   - Integration Hub Ecosystem (Tally XML, Shiprocket, Payment Terminals, Enterprise SSO)

---

## ⚡ FINAL OPERATIONAL SUMMARY

```
                INCORVO ONE

         ONE BUSINESS DATA FOUNDATION

 Inventory ─ Sales ─ Purchase ─ Accounting
     │         │         │          │
 Warehouse ─ Delivery ─ CRM ─ Payments
     │                              │
   POS ─ HRMS ─ Payroll ─ Compliance
                    │
                Analytics
                    │
                    AI
```

- **One Platform**
- **One Business Identity**
- **One Operational Data Model**
- **Industry-Specific Extensions On Top**
- **One System for Every Business.**