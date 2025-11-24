# HR System – Backend (Milestone 1 Submission)

This repository contains the **Milestone 1** backend implementation for the **HR System**, focusing on the following three subsystems:

- **Employee Profile Subsystem**
- **Organization Structure Subsystem**
- **Performance Management Subsystem**

The backend is implemented using **NestJS** and **MongoDB (Mongoose)**.  
Milestone 1 requires each subsystem to include **database schemas (models)** and **dummy integration endpoints** demonstrating how subsystems communicate.

---

## 📌 Table of Contents
- [Project Overview](#project-overview)
- [Subsystems Implemented](#subsystems-implemented)
  - [1. Employee Profile](#1-employee-profile)
  - [2. Organization Structure](#2-organization-structure)
  - [3. Performance Management](#3-performance-management)
- [Database Models (Schemas)](#database-models-schemas)
- [Integration Between Subsystems](#integration-between-subsystems)
- [API Endpoints (Dummy)](#api-endpoints-dummy)
- [Project Folder Structure](#project-folder-structure)
- [How to Run the Project](#how-to-run-the-project)
- [Technologies Used](#technologies-used)
- [Team Members](#team-members)

---

# 📘 Project Overview

The HR System consists of multiple subsystems. For **Milestone 1**, the goal is to:

### ✔️ Set up project structure  
### ✔️ Create database schemas for each subsystem  
### ✔️ Demonstrate integration between subsystems using dummy data  
### ✔️ Implement basic module structure in NestJS  

This backend includes three major subsystems and provides dummy data to show cross-module communication.

---

# 🧩 Subsystems Implemented

## 1. Employee Profile

The **Employee Profile** subsystem manages core employee master data including:
- Personal details
- Contact information
- Employment information
- Department & Position references
- Manager references

### Responsibilities:
- Store employee records  
- Provide employee details  
- Integrate with Organization Structure  
- Share data with Performance module

---

## 2. Organization Structure

The **Organization Structure** subsystem defines:
- Departments
- Positions
- Reporting lines (who reports to whom)
- Pay grades (placeholder)
- Department/Position activation state

### Responsibilities:
- Maintain organization hierarchy  
- Provide department and position data  
- Connect employees to their department & position  

---

## 3. Performance Management

The **Performance** subsystem handles:
- Performance templates  
- Appraisal cycles  
- Employee evaluations  
- Manager reviews  
- Dispute information (embedded)

### Responsibilities:
- Provide appraisal structure  
- Integrate with Employee & Organization Structure  
- Dummy appraisals for integration demonstration  

---

# 🗂 Database Models (Schemas)

### 📌 Employee Profile:
- **Employee**
  - Personal data  
  - Contact data  
  - Employment data  
  - References:
    - `department` → Department  
    - `position` → Position  
    - `manager` → Employee  

---

### 📌 Organization Structure:
- **Department**
  - `code`, `name`, `isActive`, `costCenter`

- **Position**
  - `code`, `title`
  - `department` (ref)
  - `reportsTo` (ref)
  - `payGrade` (optional)
  - `isManager`, `isActive`

---

### 📌 Performance Management:
- **PerformanceTemplate**
  - Template name, type, criteria list

- **PerformanceCycle**
  - Name, start/end dates, applicable departments, linked template

- **PerformanceAppraisal**
  - Employee & Manager references  
  - Ratings list  
  - Status (Draft, Submitted, Published, etc.)  
  - Dispute fields (embedded)  

---

# 🔗 Integration Between Subsystems

Integration is a core requirement of Milestone 1.  
The system currently integrates using **dummy data**:

### Employee Profile ↔ Organization Structure
- `employee.department` → Department schema  
- `employee.position` → Position schema  
- EmployeeService retrieves data from DepartmentService  

### Performance ↔ Employee Profile
- `PerformanceAppraisal.employee` → Employee  
- `PerformanceAppraisal.manager` → Employee  

### Performance ↔ Organization Structure
- `PerformanceCycle.applicableDepartments` → Department  

### Multi-level Integration Example:
`GET /performance/dummy` returns:
- Dummy appraisal  
- Dummy employee  
- Dummy department  
- Dummy position  

This proves complete module-to-module communication.

---

# 🌐 API Endpoints (Dummy)

These dummy endpoints are included to demonstrate subsystem interaction.

| Subsystem | Endpoint | Description |
|----------|----------|-------------|
| Organization Structure | `GET /departments/dummy` | Returns dummy department |
| Organization Structure | `GET /positions/dummy` | Returns dummy position referencing department |
| Employee Profile | `GET /employees/dummy` | Returns dummy employee referencing department & position |
| Performance | `GET /performance/dummy` | Returns dummy appraisal referencing employee & cycle |

These endpoints **prove integration** between all modules.

---

# 📁 Project Folder Structure

