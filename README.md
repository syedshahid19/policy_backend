# Policy Management & Monitoring System

## Overview  
A Node.js-based backend system designed to efficiently handle bulk policy data ingestion using worker threads and provide intelligent APIs for querying and aggregation. Additionally, it features real-time server CPU monitoring and scheduled message posting functionality for automation and reliability.

---

## Features

### 📦 Task 1: Data Ingestion & Query APIs

#### 1. Bulk Upload API (CSV/XLSX → MongoDB)
- Uploads and processes large CSV/XLSX files.
- Uses **Worker Threads** to offload parsing and insertion to background threads.
- Ensures non-blocking performance while handling thousands of records.
- Saves parsed data into **separate MongoDB collections**:
  - `Agent`
  - `User`
  - `UserAccount`
  - `Category`
  - `Carrier`
  - `Policy`

#### 2. Search API by Username
- Fetches **user-related policy information** using the `username`.

#### 3. Aggregated Policy API
- Returns **aggregated policy data per user**.

---

### ⚙️ Task 2: Server Monitoring & Scheduling

#### 1. Real-Time CPU Monitoring & Auto-Restart
- Tracks **Node.js server CPU usage** in real-time.
- Automatically **restarts the server** if CPU utilization exceeds **70%**, ensuring optimal performance and preventing overload.

#### 2. Scheduled Post-Service API
- Accepts `message`, `day`, and `time` as parameters.
- **Schedules and inserts** the message into the database at the specified future timestamp.
- Helps in automating notifications, reminders, or task execution based on time.

---

## Tech Stack
- **Backend:** Node.js, Express.js

## **Setting Up and Running the Application Locally**

### **1. Clone the Repository**
Open a terminal or command prompt and run the following command:
```bash
git clone https://github.com/syedshahid19/policy_backend.git
```

### **2. Open the Project in VS Code**
- Open **VS Code** and click on **"Open Folder"** from the left panel.
- Navigate to the directory where the repository was cloned and select the folder.

### **3. Install Dependencies**
Install the necessary dependencies for the backend using the terminal.

**Note:** Replace `C:\Desktop` with your actual system path.

**Backend:**
  ```bash
  cd C:\Desktop\Policy-Backend
  npm install
  ```

### **4. Configure Environment Variables**
Create a `.env` file inside the **backend** folder (`Policy-Backend`) and add the following configuration:
```env
PORT = 4000  # Specify the desired port
DATABASE_URL ="" # Specify Your DB URL
```

### **5. Start the Application**
Execute the following command to launch the application:
```bash
npm run dev
```




