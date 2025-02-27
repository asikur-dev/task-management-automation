-- Insert Companies
INSERT INTO
    companies (
        id,
        company_name,
        admin_email,
        password_hash,
        logo_url,
        color_scheme,
        subscription_plan
    )
VALUES (
        1,
        'Alpha Corp',
        'alpha_admin@alpha.com',
        'hashedpass_alpha',
        'https://alpha.com/logo.png',
        '#FF0000',
        'Pro'
    ),
    (
        2,
        'Beta LLC',
        'beta_admin@beta.com',
        'hashedpass_beta',
        'https://beta.com/logo.png',
        '#00FF00',
        'Free'
    ),
    (
        3,
        'Gamma Inc',
        'gamma_admin@gamma.com',
        'hashedpass_gamma',
        'https://gamma.com/logo.png',
        '#0000FF',
        'Enterprise'
    );

-- Insert Managers
INSERT INTO
    managers (
        id,
        company_id,
        name,
        email,
        password_hash,
        is_active
    )
VALUES (
        1,
        1,
        'Alice Admin',
        'alice@alpha.com',
        'hashpwd_alice',
        1
    ),
    (
        2,
        1,
        'Bob Boss',
        'bob@alpha.com',
        'hashpwd_bob',
        1
    ),
    (
        3,
        2,
        'Charlie Chief',
        'charlie@beta.com',
        'hashpwd_charlie',
        1
    ),
    (
        4,
        2,
        'Dora Director',
        'dora@beta.com',
        'hashpwd_dora',
        1
    ),
    (
        5,
        3,
        'Erin Exec',
        'erin@gamma.com',
        'hashpwd_erin',
        1
    ),
    (
        6,
        3,
        'Frank Fleet',
        'frank@gamma.com',
        'hashpwd_frank',
        1
    );

-- Insert Employees
INSERT INTO
    employees (
        id,
        manager_id,
        name,
        email,
        time_zone,
        check_in_time,
        check_out_time
    )
VALUES (
        1,
        1,
        'AlEmp1',
        'alemp1@alpha.com',
        'America/New_York',
        '09:00:00',
        '17:00:00'
    ),
    (
        2,
        1,
        'AlEmp2',
        'alemp2@alpha.com',
        'America/Chicago',
        '09:30:00',
        '17:30:00'
    ),
    (
        3,
        2,
        'BobEmp1',
        'bobemp1@alpha.com',
        'America/Denver',
        '08:00:00',
        '16:00:00'
    ),
    (
        4,
        3,
        'CharlieEmp1',
        'charlieemp1@beta.com',
        'America/Phoenix',
        '08:30:00',
        '16:30:00'
    );

-- Insert Non-Working Days (By Day of Week)
INSERT INTO
    non_working_days (
        id,
        company_id,
        day_of_week,
        description
    )
VALUES (1, 1, 0, 'Sunday'),
    (2, 1, 6, 'Saturday'),
    (3, 2, 0, 'Sunday'),
    (4, 2, 6, 'Saturday'),
    (5, 3, 0, 'Sunday'),
    (6, 3, 6, 'Saturday');

-- Insert Non-Working Days (Specific Dates)
INSERT INTO
    non_working_days (
        id,
        company_id,
        date_value,
        description
    )
VALUES (
        7,
        1,
        '2025-01-10',
        'Alpha Founders Day'
    ),
    (
        8,
        2,
        '2025-01-05',
        'Beta Special Holiday'
    ),
    (
        9,
        3,
        '2025-01-12',
        'Gamma Offsite'
    );

-- Insert Employee Leaves
INSERT INTO
    employee_leaves (
        id,
        employee_id,
        start_date,
        end_date,
        reason
    )
VALUES (
        1,
        1,
        '2025-01-03',
        '2025-01-04',
        'Vacation'
    ),
    (
        2,
        3,
        '2025-01-07',
        '2025-01-07',
        'Medical'
    );

-- Insert Check-In Sessions
INSERT INTO
    checkin_sessions (
        id,
        employee_id,
        session_type,
        session_date,
        email_sending_time,
        session_start_time,
        session_end_time,
        fill_time_seconds
    )
VALUES (
        1,
        2,
        'morning',
        '2025-01-01',
        '2025-01-01 09:30:00',
        '2025-01-01 09:45:00',
        '2025-01-01 09:50:00',
        300
    );

-- Insert Tasks
INSERT INTO
    tasks (
        id,
        checkin_session_id,
        task_title,
        task_details,
        status
    )
VALUES (
        1,
        1,
        'Prepare Report',
        'End-of-year financials',
        'pending'
    ),
    (
        2,
        1,
        'Email Clients',
        'Send welcome emails',
        'pending'
    );

-- Insert Conversation Messages
INSERT INTO
    conversation_messages (
        id,
        checkin_session_id,
        role,
        message_content
    )
VALUES (
        1,
        1,
        'user',
        'Good morning, I have a few tasks today.'
    ),
    (
        2,
        1,
        'assistant',
        'Great! Let me list them...'
    );