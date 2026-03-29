# Hospital Management System - Startup Guide

This document provides step-by-step instructions on how to set up, run, and use the Hospital Management System application.

## 📋 Prerequisites

Before you start, ensure you have the following installed on your system:
- **Java Development Kit (JDK) 17** or higher
- **Maven** (optional if you rely on your IDE, but recommended for CLI builds)
- **MySQL Server**
- Your favorite IDE (IntelliJ IDEA, Eclipse, or VS Code)

## 🗄️ Database Setup

The application connects to a local MySQL instance. 
1. Open your MySQL service and ensure it is running on the default port `3306`.
2. The application is configured with the following credentials (found in `application.properties`):
   - **Username:** `root`
   - **Password:** `jesin`
3. You do **not** need to create the database manually; the Spring Boot application configuration (`createDatabaseIfNotExist=true`) will automatically create the `hospital_db` database for you!
4. On startup, initial data (including the default `admin` account) will be automatically injected.

## 🚀 How to Run the Application

You can start the server via your Command Line or your IDE.

### Option A: Using your IDE (Recommended)
1. Open the project folder `C:\Jesin\Antigravity\Hospital_Management_System` in your IDE.
2. Wait for the IDE to finish indexing and downloading the Maven dependencies specified in `pom.xml`.
3. Locate `src/main/java/com/hospital/management/HospitalManagementApplication.java`.
4. Run or Debug the `main` method in this configuration class.

### Option B: Using Maven (Command Line)
1. Open your terminal in the project directory.
2. Run the below command to start the Spring Boot Application:
   ```bash
   mvn spring-boot:run
   ```
*(If you do not have Maven mapped to your PATH variables, this command will error out. Use Option A instead if that happens.)*

## 🏥 Using the App

The application runs entirely locally. It uses a modern RESTful architecture.

### 1. Access the App
Once the server starts without errors, open your web browser and navigate to:
**http://localhost:8080/**

### 2. Login
A default Admin account has been configured for your convenience:
- **Username**: `admin`
- **Password**: `admin123`

### 3. Core Modules (Navigation bar)

After logging in, you can seamlessly navigate the different modules via the sidebar on the `Dashboard`:
*   **Dashboard**: Displays live statistics of total registered Patients, Doctors, active Appointments, and generated Revenue.
*   **Patients**: Add, view, edit or delete patients. Includes tracking their previous Medical Histories.
*   **Doctors**: View and edit specialized doctor profiles, including their general scheduling hours.
*   **Appointments**: Book a new appointment combining an existing Patient ID and Doctor ID. You can easily mark the status as `Completed` or `Cancelled`.
*   **Medical Records**: Clinical tracker where Doctors and Admins can log Diagnosis checks and Prescriptions tied to specific patients.
*   **Billing**: Handles hospital consultation fees, medicine fees, and test fees. You can finalize an invoice, mark it as `Paid`, and instantly **Download a PDF** copy to your computer!

## 👥 Role Based Access Control Workflow
The app features strict backend API security using structured JSON Web Tokens (JWT).
- Only **Admins** and **Receptionists** can edit/delete accounts and bills.
- If you'd like to test the restricted flows, simply log out and click **Register Here** on the login page to create a mock `Doctor` or `Patient` account and see how their views are slightly restricted!
