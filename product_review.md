# HMMS Product Review & Role Logic

## Executive Summary
This document outlines the **Role-Based Logic** for the Hospital Maintenance Management System (HMMS). It defines exactly what each user type can see and do, clarifying the workflows currently implemented vs. those planned.

---

## 1. user Role: ADMIN (`ADMIN`)
**Persona:** Super-user, IT Head, or Chief Engineer.
**Logic:** Has unrestricted access to configure the system and oversee all operations.

### Capabilities
*   **User Management:** Can Create, Edit, or Deactivate users. (Exclusive to Admin).
*   **System Settings:** Access to global configurations (Departments, Locations).
*   **View All:** Can see all Work Orders, Assets, and Reports across ALL departments.

### Key Workflow
1.  **Onboarding:** Admin creates accounts for Facility Managers and Technicians.
2.  **Oversight:** Admin logs in to view the "Dashboard" for high-level KPIs (e.g., "Critical" tickets open).

---

## 2. User Role: FACILITY MANAGER (`MANAGER`)
**Persona:** Department Head (e.g., "Radiology Manager" or "Building Maintenance Manager").
**Logic:** Responsible for the *operation* of a specific department or the entire facility's maintenance team.

### Capabilities
*   **Work Order Management:**
    *   **Approve:** Only Managers can "Approve/Close" a completed ticket.
    *   **Assign:** Can re-assign tickets to different technicians.
    *   **Escalate:** Can change priority to High/Critical.
*   **Reports:** detailed view of their department’s performance.
*   **Inventory:** Can approve Requisitions (Phase 3).

### Key Workflow
1.  **Triage:** Manager sees a "Pending" work order -> Assigns it to a `TECHNICIAN`.
2.  **Review:** Manager sees a "Completed" work order -> Reviews photos/notes -> Clicks "Close" (Final Approval).

---

## 3. User Role: TECHNICIAN (`TECHNICIAN`)
**Persona:** Field worker, Electrician, Plumber, Biomed Engineer.
**Logic:** Mobile-first workflow. Focused on *executing* individual tasks.

### Capabilities
*   **"My Jobs" View:** default view shows only tickets assigned to *them*.
*   **Execution:**
    *   Can update status (`IN_PROGRESS`, `ON_HOLD`, `COMPLETED`).
    *   Can upload **Photos** (Proof of work).
    *   Can log **Time** (Minutes spent).
    *   **Cannot** Close/Approve tickets (must wait for Manager).
*   **Asset Scan:** Can scan QR codes to find asset history.

### Key Workflow
1.  **Start:** Technician opens app -> Sees "AC Repair" assigned.
2.  **Work:** Taps "Start" (Status: In Progress). Fixes the AC.
3.  **Finish:** Uploads photo of fixed unit -> Taps "Complete".

---

## 4. User Role: STAFF (`STAFF`)
**Persona:** Doctors, Nurses, Receptionists.
**Logic:** The "Custoemrs" of the maintenance team. They simply need things fixed.

### Capabilities
*   **Request Only:** Can only *Create* Work Orders.
*   **View Own:** Can only see status of tickets *they* created.
*   **No Access:** Cannot see Inventory, Assets, or other departments' tickets.

### Key Workflow
1.  **Request:** Nurse notices a broken light -> Logs in -> Fills "Create Work Order" form.
2.  **Wait:** Sees status change from "Pending" to "In Progress" to "Completed".

---

## Access Matrix (Phase 1)

| Feature | Admin | Manager | Technician | Staff |
| :--- | :---: | :---: | :---: | :---: |
| **Login** | ✅ | ✅ | ✅ | ✅ |
| **Dashboard** | Full Stats | Dept Stats | My Stats | - |
| **Work Orders** | Create/Edit/Del | Edit/Assign/Close | Update Status/Log | Create Only |
| **Assets** | Full Access | Full Access | Read/Scan | - |
| **Users** | Full Access | Read Only | - | - |
| **Settings** | Full Access | - | - | - |

---

## Current Implementation Limitations (Web)
*   **UI:** Currently, the Web Sidebar shows all links to everyone (visual bug). Ideally, `Users` and `Settings` should be hidden for Non-Admins.
*   **Navigation:** `Preventive` and `Inventory` are placeholders (Phase 2).
