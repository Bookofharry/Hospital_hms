# Hospital Maintenance Management System (HMMS) — Product Summary & System Design

## 1) Executive Summary
The Hospital Maintenance Management System (HMMS) is a web + mobile platform that centralizes hospital maintenance operations: work orders, preventive maintenance, asset tracking, inventory/consumables, requisitions, utility/oxygen tracking, and reporting dashboards. It reduces downtime, improves response times, strengthens compliance/auditability, and provides real-time visibility for administrators, facility managers, and technicians.

---

## 2) Platforms & Users
### Platforms
- **Mobile:** iOS/Android (Technicians + on-site staff)
- **Web:** Responsive portal (Admins, Managers, Procurement, Reports)

### User Roles (RBAC)
- **Admin:** organization setup, user/role management, compliance oversight
- **Facility Manager:** assign work, approve closures, schedules, escalations
- **Technician:** execute jobs, update work orders, log parts/time/photos
- **Staff (Nurse/Doctor/Dept User):** raise issues, track requests, receive updates
- **Procurement Officer:** manage consumables, requisitions, vendors
- **Vendor/Contractor:** limited access to assigned work orders only
- **IT:** integrations, security policies, audit access

---

## 3) Core Modules
1. **Auth & User Management**
   - JWT auth, optional OTP/2FA for sensitive roles
   - Roles, permissions, departments, sections
2. **Work Order Management**
   - Request creation (priority: Low/Medium/High/Critical)
   - Assignment (technicians/internal teams/vendors)
   - Status flow + notes + photos + time logs
   - Closure + approval workflow
3. **Asset Management**
   - Equipment registry (make/model/serial/location/warranty)
   - QR code tagging + scan-to-open asset profile
   - Maintenance history, lifecycle/depreciation tracking
4. **Preventive Maintenance**
   - Recurring schedules (daily/weekly/monthly/custom)
   - Auto-generated work orders with checklists
   - Compliance tracking and overdue escalation
5. **Inventory Management**
   - Spare parts & stock control, min thresholds, low stock alerts
   - Vendor/supplier catalog
6. **Consumables Management**
   - Department consumables list managed by procurement
   - Collection logs (date + collecting officer)
   - Reorder alerts + audit trail
7. **Oxygen Management**
   - Cylinder movement tracking: filled-in / empty-out per department
   - Consumption charts by department over time (monthly view)
8. **Requisition for Work/Repairs**
   - Formal requisition forms routed to maintenance
   - Time-bound delivery + escalation after expiry
   - Unique ID + movement tracking + recipient alerts
9. **Repairs & Memo**
   - Monthly repairs list + consumables used + reasons for delay
   - Cost per asset reporting to evaluate long-term viability
10. **Dashboards & Reporting**
   - KPIs: MTTR, MTBF, Downtime, Compliance %, backlog by dept
   - Utility charts: electricity, water, diesel, oxygen
   - Export: PDF/Excel, audit trails

---

## 4) Key Objectives (Measurable)
- Reduce equipment downtime by **30%**
- Improve response time for **critical repairs**
- Compliance readiness: audit logs, checklist completion, SLA adherence
- Centralize maintenance data for analytics and decision-making
- Digitize and standardize workflows across departments

---

## 5) Scope
### In Scope
- RBAC + secure authentication
- Work order + requisitions + escalation workflows
- Asset registry with QR code tagging
- Preventive schedules per asset and/or per staff with deadlines stored in DB
- Inventory/spares + consumables + oxygen tracking
- Notifications + dashboards + reports

### Out of Scope (Phase 1)
- Billing/finance modules
- Patient health records storage (integration via API is allowed)
- Non-hospital facilities

---

## 6) Product UX Structure (High-Level Screens)
### Web (Admin/Manager/Procurement)
- Login + 2FA (role-based)
- Dashboard (KPIs + alerts + charts)
- Work Orders (list, filters, assign, approve closure)
- Assets (registry + QR print/export)
- Preventive Maintenance (calendar + templates + compliance)
- Inventory (stock, vendors, requisitions)
- Consumables (department lists, collections log)
- Oxygen (movement logs + consumption charts)
- Utilities (electricity/water/diesel/oxygen charts)
- Reports (PDF/Excel exports)
- Settings (roles, departments, escalation rules)

### Mobile (Technician)
- Assigned Work Orders (today/overdue)
- Work Order Detail (checklist, notes, photos, time log)
- QR Scan (open asset/work order quickly)
- Offline updates queue + sync status
- Push notifications (new assignment/escalation)

---

## 7) System Architecture (How Frontend/Backend/DB Are Wired)

### 7.1 Overview
**Client Apps**
- React Native Mobile
- React.js Web

**Backend**
- Node.js + Express (REST API)
- Real-time: Socket.io (web), FCM (mobile push)

**Data Layer**
- **PostgreSQL** (transactional: users, work orders, assets, inventory, requisitions, schedules)
- **MongoDB** (document logs/attachments metadata, flexible audit/event streams, large log entries)
- **Object Storage:** AWS S3 (images, documents, signatures)

**Auth**
- JWT access tokens + refresh tokens
- Optional OAuth2 integration (hospital SSO)
- OTP/2FA for Admin/Manager roles

**Integrations**
- EHR/ERP/BMS via API gateway layer (Phase 2+)

---

### 7.2 Data Flow (Typical)
1. User logs in → Backend issues JWT (+ refresh)
2. Frontend requests data → REST endpoints (RBAC enforced)
3. Work order updates → saved in Postgres (canonical state) + event log in Mongo
4. Images/signatures → uploaded to S3 (pre-signed URL), metadata stored in DB
5. Real-time updates:
   - Socket.io emits status changes to web dashboard
   - FCM pushes assignment/overdue alerts to mobile

---

## 8) Domain Model (Entities & Relationships)

### 8.1 PostgreSQL (Canonical/Transactional)
**User**
- id, name, email, phone, role, departmentId, section, status, createdAt

**Department**
- id, name, code

**Asset**
- id, name, type, make, model, serialNumber, location, departmentId
- warrantyEndDate, installationDate, status, lifecycleStage

**WorkOrder**
- id, code, title, description, priority, status
- assetId (nullable), departmentId, createdBy, assignedTo (user/vendor)
- slaDueAt, startedAt, completedAt, closedBy, approvedBy
- downtimeMinutes, resolutionCategory

**WorkOrderTimeLog**
- id, workOrderId, userId, startedAt, endedAt, minutes

**WorkOrderNote**
- id, workOrderId, authorId, note, createdAt

**PreventivePlan**
- id, name, assetId, frequencyType (daily/weekly/monthly/custom), interval
- nextDueAt, checklistTemplateId, isActive

**PreventiveInstance**
- id, preventivePlanId, generatedWorkOrderId, dueAt, status

**InventoryItem**
- id, name, category, sku, unit, quantity, minThreshold, supplierId, location

**Supplier**
- id, name, contactName, phone, email, address

**InventoryTransaction**
- id, itemId, type (IN/OUT/ADJUST), quantity, referenceType, referenceId, createdBy, createdAt

**Consumable**
- id, name, departmentId, unit, reorderLevel, currentBalance (optional derived)

**ConsumableCollection**
- id, consumableId, departmentId, quantity, collectedBy, collectedAt, notes

**OxygenCylinder**
- id, tagCode, size, status (filled/empty/in_transit), currentDepartmentId

**OxygenMovement**
- id, cylinderId, fromDepartmentId, toDepartmentId
- movementType (FILLED_IN / EMPTY_OUT / TRANSFER), movedAt, movedBy

**Requisition**
- id, code, departmentId, requestedBy, assignedToDepartmentId
- title, description, priority, status, dueAt, escalatedAt

**RequisitionMovement**
- id, requisitionId, fromRole, toRole, action, timestamp, remarks

**UtilityReading**
- id, type (electricity/water/diesel/oxygen), departmentId (nullable)
- readingValue, readingUnit, periodStart, periodEnd, recordedBy, recordedAt

**AuditLog (lightweight index)**
- id, actorId, action, entityType, entityId, createdAt, correlationId

---

### 8.2 MongoDB (Flexible Logs / Events)
**EventStream**
- _id, correlationId, entityType, entityId
- eventType (WORK_ORDER_UPDATED, SLA_ESCALATED, INVENTORY_LOW, etc.)
- payload (json), createdAt

**AttachmentMeta**
- _id, entityType, entityId, fileType, s3Key, url, uploadedBy, uploadedAt

(You can keep *all* audit logs in Postgres if you want simplicity; Mongo is optional for heavy event streams.)

---

## 9) Status Flows (State Machines)

### 9.1 Work Order Status
- **Pending → Assigned → In Progress → (On Hold) → Completed → Closed/Approved**
Rules:
- Only Manager/Admin can **Close/Approve**
- Technician can set **In Progress**, **On Hold**, **Completed**
- **Critical** priority triggers tighter SLA + stronger escalation

### 9.2 Requisition Status
- **Submitted → Received → In Review → Approved/Rejected → In Execution → Delivered → Closed**
Rules:
- Due date expiry triggers escalation to superior officer + alerts

---

## 10) Notifications & Escalation Rules
### Notification Types
- New work order created (department managers)
- Assignment to technician/vendor
- SLA nearing due (e.g., 75% of time used)
- SLA breach (escalate)
- Low stock / reorder level reached
- Preventive maintenance overdue
- Requisition received / action needed / overdue

### Channels
- In-app notifications (web/mobile)
- Push notifications (FCM) for mobile
- Optional email/SMS in future

---

## 11) API Design (REST) — Key Endpoints

### Auth
- POST `/auth/login`
- POST `/auth/verify-otp` (optional)
- POST `/auth/refresh`
- POST `/auth/logout`

### Users & Roles
- GET `/users`
- POST `/users`
- PATCH `/users/:id`
- GET `/roles/permissions`

### Work Orders
- GET `/work-orders?status=&priority=&departmentId=&assignedTo=`
- POST `/work-orders`
- GET `/work-orders/:id`
- PATCH `/work-orders/:id` (status, assignment, fields)
- POST `/work-orders/:id/notes`
- POST `/work-orders/:id/time-logs`
- POST `/work-orders/:id/complete`
- POST `/work-orders/:id/approve-close`

### Assets
- GET `/assets`
- POST `/assets`
- GET `/assets/:id`
- PATCH `/assets/:id`
- GET `/assets/:id/history`
- POST `/assets/:id/qr` (returns printable payload)

### Preventive Maintenance
- GET `/preventive/plans`
- POST `/preventive/plans`
- PATCH `/preventive/plans/:id`
- GET `/preventive/calendar?from=&to=`
- POST `/preventive/run-generator` (internal/cron)

### Inventory
- GET `/inventory/items`
- POST `/inventory/items`
- POST `/inventory/transactions`
- GET `/inventory/alerts/low-stock`

### Consumables
- GET `/consumables`
- POST `/consumables`
- POST `/consumables/:id/collections`
- GET `/consumables/:id/collections?from=&to=`

### Oxygen
- GET `/oxygen/cylinders`
- POST `/oxygen/movements`
- GET `/oxygen/consumption?departmentId=&from=&to=`

### Requisitions
- GET `/requisitions`
- POST `/requisitions`
- GET `/requisitions/:id`
- POST `/requisitions/:id/movements`
- POST `/requisitions/:id/escalate` (auto or manual)

### Reports
- GET `/reports/kpis?from=&to=`
- GET `/reports/exports/pdf?...`
- GET `/reports/exports/excel?...`

---

## 12) Frontend Architecture (Web + Mobile)

### Shared Principles
- Strict RBAC: UI hides actions + backend enforces permissions
- Offline-first on mobile: store pending updates locally, sync when online
- Centralized state: React Query (or Redux Toolkit) for caching & invalidation
- Real-time: subscribe to Socket.io channels by department/role

### Web (React.js)
- Routes by module: Dashboard, Work Orders, Assets, Preventive, Inventory, Consumables, Oxygen, Requisitions, Reports, Settings
- Charting: Recharts/Chart.js
- Export flows: request → backend generates → user downloads

### Mobile (React Native)
- Tabs: Assigned, Scan, Create/Report, Notifications, Profile
- Work order detail optimized for field use:
  - Start/stop timer
  - Checklist
  - Photo capture → S3 upload
  - Signature capture (optional)
- Offline sync queue:
  - store mutations (status updates, notes, logs)
  - retry with backoff

---

## 13) Backend Architecture (Node.js + Express)

### Layers
- **Routes → Controllers → Services → Repositories/ORM**
- Policy checks (RBAC) at middleware + service level
- Background jobs:
  - preventive generator (cron)
  - escalation checker (cron)
  - low-stock checker (cron)
  - report generation

### Recommended Components
- ORM: Prisma/TypeORM/Sequelize for PostgreSQL
- Validation: Zod/Joi
- Logging: structured logs + correlationId
- Rate limiting + audit trails

---

## 14) Security & Compliance (Non-Functional)
- Response time: < 3 seconds for most operations
- Availability target: 99.5%
- Encryption: TLS in transit, encryption at rest where supported
- Audit logs: who did what, when, from where (IP/device optional)
- Least privilege access (RBAC + scoped data access by department)
- Data retention policy for logs/attachments
- Do **not** store patient records (only maintenance-related data)

---

## 15) Suggested MVP (Phase 1) Delivery Plan
### Phase 1 (Core)
- Auth + RBAC + departments
- Work orders + attachments + time logs + closure approval
- Assets + QR scan
- Basic dashboards + KPIs
- Notifications (in-app + push)

### Phase 2 (Operations Expansion)
- Preventive maintenance generator + compliance
- Inventory + low stock alerts
- Consumables workflow

### Phase 3 (Utilities + Oxygen + Requisitions)
- Oxygen movement + consumption charts
- Utilities dashboard
- Requisition workflows + escalation + movement tracking
- Advanced reporting exports

---

## 16) What “Good Product Design” Means Here (Quality Bar)
- Clear role-based workflows (who can do what)
- Minimal steps for technicians in the field
- Strong visibility for managers (SLA, overdue, backlog)
- Reliable audit trails + reporting
- Configurable: departments, SLAs, escalation rules, checklists
- Offline support for real hospital environments

---

## 17) Conclusion
HMMS moves hospital maintenance from reactive to proactive by combining structured work order execution, preventive scheduling, inventory/consumables control, oxygen/utilities tracking, and compliance-ready reporting. The proposed architecture cleanly wires web/mobile clients to a secure API backed by PostgreSQL (transactions), optional MongoDB (event streams/logs), and S3 for attachments, enabling scalable multi-hospital deployment.
