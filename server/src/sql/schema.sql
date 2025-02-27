-- 1) COMPANIES
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255) DEFAULT NULL,
    color_scheme VARCHAR(100) DEFAULT NULL,
    subscription_plan VARCHAR(50) DEFAULT 'Free',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2) MANAGERS
CREATE TABLE IF NOT EXISTS managers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);

-- 3) EMPLOYEES
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manager_id INT NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    time_zone VARCHAR(100) NOT NULL,
    check_in_time TIME NOT NULL,
    check_out_time TIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES managers (id) ON DELETE CASCADE
);

-- 4) NON_WORKING_DAYS
CREATE TABLE IF NOT EXISTS non_working_days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    date_value DATE DEFAULT NULL,
    day_of_week TINYINT DEFAULT NULL,
    description VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nwd_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);

-- 5) EMPLOYEE_LEAVES
CREATE TABLE IF NOT EXISTS employee_leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
);

-- 6) CHECKIN_SESSIONS
CREATE TABLE IF NOT EXISTS checkin_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL DEFAULT(UUID()), -- Use UUID v4    employee_id INT NOT NULL,
    employee_id INT NOT NULL,
    session_type ENUM('morning', 'evening') NOT NULL,
    session_date DATE NOT NULL,
    email_sending_time DATETIME DEFAULT NULL,
    session_start_time DATETIME DEFAULT NULL,
    session_end_time DATETIME DEFAULT NULL,
    fill_time_seconds INT DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    device_info VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_employee FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
);

-- 7) TASKS
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    checkin_session_id VARCHAR(255) NOT NULL,
    task_title VARCHAR(255) NOT NULL,
    task_details TEXT DEFAULT NULL,
    status ENUM(
        'pending',
        'in_progress',
        'completed',
        'blocked'
    ) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_session FOREIGN KEY (checkin_session_id) REFERENCES checkin_sessions (id) ON DELETE CASCADE
);

-- 8) CONVERSATION_MESSAGES
CREATE TABLE IF NOT EXISTS conversation_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    checkin_session_id INT NOT NULL,
    role ENUM('user', 'assistant', 'system') NOT NULL,
    message_content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_conv_session FOREIGN KEY (checkin_session_id) REFERENCES checkin_sessions (id) ON DELETE CASCADE
);