--
-- PostgreSQL database dump
--

\restrict ZCLuNsEEkeUZmw4KAnhrou28RUm7VSMzoatZnJQHdcPYlsk0pNUIbqb5qqmizBI

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 15.14 (Debian 15.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: edusync
--

INSERT INTO public.accounts VALUES (1, 'ACC001', 50000.00, 'First National Bank', NULL, '2025-10-20 18:58:29.898668', 'USD', 'Primary business account', 'Main Bank Account', 'ACTIVE', 'BANK', '2025-10-20 18:58:29.898668');
INSERT INTO public.accounts VALUES (2, 'ACC002', 5000.00, NULL, NULL, '2025-10-20 18:58:29.898668', 'USD', 'Petty cash for small expenses', 'Cash Account', 'ACTIVE', 'CASH', '2025-10-20 18:58:29.898668');
INSERT INTO public.accounts VALUES (3, 'ACC003', -2500.00, 'Visa Business', NULL, '2025-10-20 18:58:29.898668', 'USD', 'Business credit card', 'Credit Card', 'ACTIVE', 'CREDIT_CARD', '2025-10-20 18:58:29.898668');


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: edusync
--



--
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: edusync
--



--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: edusync
--

INSERT INTO public.departments VALUES (1, NULL, 'IT', '2025-10-20 18:52:03.629719', 'Information Technology Department', NULL, true, 'IT Department', NULL, '2025-10-20 18:52:03.629731');


--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: edusync
--



--
-- Data for Name: payroll; Type: TABLE DATA; Schema: public; Owner: edusync
--



--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: edusync
--

INSERT INTO public.staff VALUES (1, NULL, '2025-10-20 18:52:10.031056', NULL, 1, 'ivan.ivanov@edusync.com', 'EMP001', 'FULL_TIME', 'Ivan', NULL, '2024-10-01', 'Ivanov', '+79001234567', 'Software Engineer', 120000.00, 'ACTIVE', NULL, '2025-10-20 18:52:10.031082', NULL);
INSERT INTO public.staff VALUES (2, NULL, '2025-10-20 19:00:58.428116', NULL, 1, 'sarah.johnson@edusync.com', 'EMP002', 'FULL_TIME', 'Sarah', NULL, '2024-08-15', 'Johnson', '+1987654321', 'Marketing Manager', 95000.00, 'ACTIVE', NULL, '2025-10-20 19:00:58.428136', NULL);


--
-- Data for Name: staff_documents; Type: TABLE DATA; Schema: public; Owner: edusync
--



--
-- Data for Name: staff_evaluations; Type: TABLE DATA; Schema: public; Owner: edusync
--



--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: edusync
--

INSERT INTO public.students VALUES (1, 'Москва, ул. Ленина, 1', 95, '2025-10-20 18:52:18.04533', 1, '2000-05-15', 'anna.petrova@edusync.com', '2024-09-01', 'PAID', 'Anna', 4.50, 'maria.petrova@example.com', 'Maria Petrova', '+79001111111', 'Petrova', '2024-10-01', '+79009876543', 'Computer Science', 'ACTIVE', 'STU001', '2025-10-20 18:52:18.045355');
INSERT INTO public.students VALUES (2, '123 Main St, New York, NY 10001', 92, '2025-10-20 19:00:54.462501', 2, '2001-03-20', 'john.smith@edusync.com', '2024-09-15', 'PAID', 'John', 3.80, 'robert.smith@example.com', 'Robert Smith', '+1234567891', 'Smith', '2024-10-15', '+1234567890', 'Business Administration', 'ACTIVE', 'STU002', '2025-10-20 19:00:54.462518');
INSERT INTO public.students VALUES (3, '456 Oak St, Los Angeles, CA 90210', 88, '2025-10-20 19:14:25.177427', 1, '2002-07-10', 'emily.davis@edusync.com', '2024-09-01', 'PAID', 'Emily', 3.90, 'michael.davis@example.com', 'Michael Davis', '+1555123457', 'Davis', '2024-10-15', '+1555123456', 'Engineering', 'ACTIVE', 'STU003', '2025-10-20 19:14:25.177448');


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: edusync
--

INSERT INTO public.transactions VALUES (3, 1, 500.00, 'Miscellaneous', '2025-10-20 18:58:57.276202', 'admin', '2024-10-10', 'Consulting fee received', 'Consulting services', 'Cash', 'CONS001', NULL, 'COMPLETED', NULL, 'Other Income', 'TXN003', 'INCOME', '2025-10-20 18:58:57.276202');
INSERT INTO public.transactions VALUES (4, 3, 300.00, 'Office Supplies', '2025-10-20 18:58:57.276202', 'admin', '2024-10-12', 'Office supplies purchase', 'Monthly office supplies', 'Credit Card', 'SUP001', NULL, 'COMPLETED', NULL, 'Stationery', 'TXN004', 'EXPENSE', '2025-10-20 18:58:57.276202');
INSERT INTO public.transactions VALUES (5, 1, 150.00, 'Utilities', '2025-10-20 18:58:57.276202', 'admin', '2024-10-08', 'Monthly electricity bill', 'October electricity bill', 'Bank Transfer', 'UTIL001', NULL, 'PENDING', NULL, 'Electricity', 'TXN005', 'EXPENSE', '2025-10-20 18:58:57.276202');
INSERT INTO public.transactions VALUES (6, 1, 1500.00, 'Tuition', '2025-10-20 18:59:43.281774', 'admin', '2024-10-18', 'Monthly tuition from new student', 'Monthly tuition payment', 'Bank Transfer', 'STU002', NULL, 'COMPLETED', NULL, 'Monthly Fee', 'TXN006', 'INCOME', '2025-10-20 18:59:43.281774');
INSERT INTO public.transactions VALUES (7, 3, 200.00, 'Office Supplies', '2025-10-20 18:59:43.281774', 'admin', '2024-10-16', 'Computer equipment purchase', 'IT equipment', 'Credit Card', 'EQ001', NULL, 'COMPLETED', NULL, 'Equipment', 'TXN007', 'EXPENSE', '2025-10-20 18:59:43.281774');
INSERT INTO public.transactions VALUES (8, 1, 800.00, 'Consulting', '2025-10-20 18:59:43.281774', 'admin', '2024-10-14', 'Training services provided', 'Professional training', 'Bank Transfer', 'TRAIN001', NULL, 'COMPLETED', NULL, 'Training', 'TXN008', 'INCOME', '2025-10-20 18:59:43.281774');
INSERT INTO public.transactions VALUES (1, 1, 2500.00, 'Tuition', '2025-10-20 18:58:57.276202', 'admin', '2024-10-15', 'Tuition payment from Anna Petrova', 'Student tuition payment', 'Bank Transfer', 'STU001', NULL, 'COMPLETED', 1, 'Semester Fee', 'TXN001', 'INCOME', '2025-10-20 18:58:57.276202');
INSERT INTO public.transactions VALUES (2, 1, 1200.00, 'Salaries', '2025-10-20 18:58:57.276202', 'admin', '2024-10-01', 'Salary payment to Ivan Ivanov', 'Monthly salary payment', 'Bank Transfer', 'EMP001', 1, 'COMPLETED', NULL, 'Monthly Salary', 'TXN002', 'EXPENSE', '2025-10-20 18:58:57.276202');
INSERT INTO public.transactions VALUES (9, 1, 2000.00, 'Tuition', '2025-10-20 19:01:04.79269', 'admin', '2024-10-19', 'Tuition payment from John Smith', 'Student tuition payment', 'Bank Transfer', 'STU002', NULL, 'COMPLETED', 2, 'Semester Fee', 'TXN009', 'INCOME', '2025-10-20 19:01:04.79269');
INSERT INTO public.transactions VALUES (10, 1, 950.00, 'Salaries', '2025-10-20 19:01:04.79269', 'admin', '2024-10-01', 'Salary payment to Sarah Johnson', 'Monthly salary payment', 'Bank Transfer', 'EMP002', 2, 'COMPLETED', NULL, 'Monthly Salary', 'TXN010', 'EXPENSE', '2025-10-20 19:01:04.79269');
INSERT INTO public.transactions VALUES (11, 1, 1200.00, 'Consulting', '2025-10-20 19:01:04.79269', 'admin', '2024-10-17', 'Training services provided to external client', 'Professional training services', 'Bank Transfer', 'TRAIN002', NULL, 'COMPLETED', NULL, 'Training', 'TXN011', 'INCOME', '2025-10-20 19:01:04.79269');
INSERT INTO public.transactions VALUES (12, 3, 450.00, 'Marketing', '2025-10-20 19:01:04.79269', 'admin', '2024-10-13', 'Digital marketing campaign expenses', 'Online advertising campaign', 'Credit Card', 'MKT001', NULL, 'COMPLETED', NULL, 'Advertising', 'TXN012', 'EXPENSE', '2025-10-20 19:01:04.79269');
INSERT INTO public.transactions VALUES (14, 1, 4500.00, 'Tuition Invoice', '2025-10-20 19:05:58.945137', 'admin', '2024-10-20', 'Tuition Invoice for John Smith - Fall 2024', 'Fall 2024 semester tuition invoice', 'Bank Transfer', 'INV-2024-002', NULL, 'PENDING', 2, 'Semester Fee', 'INV002', 'INCOME', '2025-10-20 19:05:58.945137');
INSERT INTO public.transactions VALUES (16, 1, 1200.00, 'Fees Invoice', '2025-10-20 19:05:58.945137', 'admin', '2024-10-20', 'Lab Fee Invoice for John Smith', 'Computer Science lab fee', 'Bank Transfer', 'INV-2024-004', NULL, 'PENDING', 2, 'Lab Fee', 'INV004', 'INCOME', '2025-10-20 19:05:58.945137');
INSERT INTO public.transactions VALUES (17, 1, 300.00, 'Fees Invoice', '2025-10-20 19:05:58.945137', 'admin', '2024-10-20', 'Library Fee Invoice for Anna Petrova', 'Annual library access fee', 'Bank Transfer', 'INV-2024-005', NULL, 'PENDING', 1, 'Library Fee', 'INV005', 'INCOME', '2025-10-20 19:05:58.945137');
INSERT INTO public.transactions VALUES (19, 1, 1800.00, 'Department Expense Invoice', '2025-10-20 19:06:08.914021', 'admin', '2024-10-20', 'IT Department - Office Supplies Invoice', 'Office supplies for IT department', 'Bank Transfer', 'INV-IT-002', NULL, 'PENDING', NULL, 'Office Supplies', 'INV007', 'EXPENSE', '2025-10-20 19:06:08.914021');
INSERT INTO public.transactions VALUES (21, 1, 1500.00, 'Department Expense Invoice', '2025-10-20 19:06:08.914021', 'admin', '2024-10-20', 'IT Department - Training Invoice', 'Staff training and certification', 'Bank Transfer', 'INV-IT-004', NULL, 'PENDING', NULL, 'Training', 'INV009', 'EXPENSE', '2025-10-20 19:06:08.914021');
INSERT INTO public.transactions VALUES (22, 1, 900.00, 'Department Expense Invoice', '2025-10-20 19:06:08.914021', 'admin', '2024-10-20', 'IT Department - Utilities Invoice', 'Monthly utilities for IT department', 'Bank Transfer', 'INV-IT-005', NULL, 'PENDING', NULL, 'Utilities', 'INV010', 'EXPENSE', '2025-10-20 19:06:08.914021');
INSERT INTO public.transactions VALUES (13, 1, 5000.00, 'Tuition Invoice', '2025-10-20 19:05:58.945137', 'admin', '2024-10-20', 'Tuition Invoice for Anna Petrova - Fall 2024', 'Invoice paid successfully', 'Bank Transfer', 'INV-2024-001', NULL, 'COMPLETED', 1, 'Semester Fee', 'INV001', 'INCOME', '2025-10-20 19:05:58.945137');
INSERT INTO public.transactions VALUES (15, 1, 800.00, 'Fees Invoice', '2025-10-20 19:05:58.945137', 'admin', '2024-10-20', 'Registration Fee Invoice for Anna Petrova', 'Invoice paid successfully', 'Bank Transfer', 'INV-2024-003', NULL, 'COMPLETED', 1, 'Registration Fee', 'INV003', 'INCOME', '2025-10-20 19:05:58.945137');
INSERT INTO public.transactions VALUES (18, 1, 2500.00, 'Department Expense Invoice', '2025-10-20 19:06:08.914021', 'admin', '2024-10-20', 'IT Department - Computer Equipment Invoice', 'Invoice paid successfully', 'Bank Transfer', 'INV-IT-001', NULL, 'COMPLETED', NULL, 'IT Equipment', 'INV006', 'EXPENSE', '2025-10-20 19:06:08.914021');
INSERT INTO public.transactions VALUES (20, 1, 3200.00, 'Department Expense Invoice', '2025-10-20 19:06:08.914021', 'admin', '2024-10-20', 'IT Department - Software License Invoice', 'Invoice paid successfully', 'Bank Transfer', 'INV-IT-003', NULL, 'COMPLETED', NULL, 'Software License', 'INV008', 'EXPENSE', '2025-10-20 19:06:08.914021');
INSERT INTO public.transactions VALUES (23, 1, 6000.00, 'Tuition Invoice', '2025-10-20 19:14:31.515188', 'admin', '2024-10-20', 'Tuition Invoice for Emily Davis - Fall 2024', 'Fall 2024 semester tuition invoice', 'Bank Transfer', 'INV-2024-013', NULL, 'PENDING', 3, 'Semester Fee', 'INV013', 'INCOME', '2025-10-20 19:14:31.515188');
INSERT INTO public.transactions VALUES (24, 1, 1200.00, 'Fees Invoice', '2025-10-20 19:14:31.515188', 'admin', '2024-10-20', 'Engineering Lab Fee Invoice for Emily Davis', 'Engineering lab equipment fee', 'Bank Transfer', 'INV-2024-014', NULL, 'PENDING', 3, 'Lab Fee', 'INV014', 'INCOME', '2025-10-20 19:14:31.515188');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: edusync
--

INSERT INTO public.users VALUES (1, '2025-10-20 19:17:36.428567', 'admin@edusync.com', true, 'Admin User', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN', '2025-10-20 19:17:36.428567');
INSERT INTO public.users VALUES (2, '2025-10-20 19:17:36.428567', 'john.smith@edusync.com', true, 'John Smith', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', '2025-10-20 19:17:36.428567');
INSERT INTO public.users VALUES (3, '2025-10-20 19:17:36.428567', 'sarah.johnson@edusync.com', true, 'Sarah Johnson', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', '2025-10-20 19:17:36.428567');
INSERT INTO public.users VALUES (4, '2025-10-20 19:17:36.428567', 'mike.chen@edusync.com', true, 'Mike Chen', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', '2025-10-20 19:17:36.428567');
INSERT INTO public.users VALUES (5, '2025-10-20 19:17:36.428567', 'lisa.rodriguez@edusync.com', false, 'Lisa Rodriguez', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', '2025-10-20 19:17:36.428567');
INSERT INTO public.users VALUES (6, '2025-10-20 19:19:08.416294', 'test@edusync.com', true, 'Test User', '$2a$10$fxcecVaMv7AZpDS30L12x.eJOhcuPGnp/B75VmJ53n7JUpnWUIvC2', 'USER', '2025-10-20 19:19:08.416336');
INSERT INTO public.users VALUES (7, '2025-10-20 19:30:35.871371', 'st22@gmail.com', true, 'Temir Stamak', '$2a$10$g2lMrOU7M5EALImEU4wJm./h0FYskjxePu8lszUv0qfjFIKiGxE06', 'USER', '2025-10-20 19:30:35.871398');
INSERT INTO public.users VALUES (8, '2025-10-20 19:32:35.611449', 'john@gmail.com', true, 'John Doe ', '$2a$10$65wjd2Sri3uAsLHsvP6MSucfZffWGBwo5ahVEG4AtswMfsYmlGsNq', 'USER', '2025-10-20 19:32:35.611482');
INSERT INTO public.users VALUES (9, '2025-10-22 19:03:58.41679', 'test@example.com', true, 'Test User', '$2a$10$l0JYrGro3jOpnzwUEeWasekYLhc/MI4VCEvdTPfUuztEhk2YLWjOK', 'USER', '2025-10-22 19:03:58.416847');
INSERT INTO public.users VALUES (10, '2025-10-22 19:04:39.873389', 'test2@example.com', true, 'Test User 2', '$2a$10$jQ5fgD3zwjJnk6dTbI3aS.cw9S8NhH3uqRCM12byx82WSBi0Og6A.', 'USER', '2025-10-22 19:04:39.873455');
INSERT INTO public.users VALUES (11, '2025-10-22 19:05:40.842782', 'gateway@test.com', true, 'Test Gateway', '$2a$10$p/JSxL0FbBF0qKDy8mEOyOvpByXOVmC6U0PenHluTQ24rAsHodhDO', 'USER', '2025-10-22 19:05:40.842868');
INSERT INTO public.users VALUES (12, '2025-10-22 19:05:52.853037', 'final@test.com', true, 'Final Test', '$2a$10$q2FYot7QmmPgg6Bg9qk/cOdu8fyIUQPYi6TcSeJEbWpZPPWjemA0.', 'USER', '2025-10-22 19:05:52.853051');
INSERT INTO public.users VALUES (13, '2025-10-22 19:12:16.058046', 'direct@test.com', true, 'Direct Test', '$2a$10$rUBfEa9/gAARnJDSNdJL/ej.D83zY2bz5TO2a2ZYaj9awJteXYtWS', 'USER', '2025-10-22 19:12:16.058198');
INSERT INTO public.users VALUES (14, '2025-10-22 19:15:42.118542', 'cors@test.com', true, 'CORS Test', '$2a$10$478tH7fRmn.ZxT3f.2Yj5.3CmCfbXWYDMd0wwg3hd0qQh/rOpo8nG', 'USER', '2025-10-22 19:15:42.118558');


--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.accounts_id_seq', 3, true);


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.attendance_id_seq', 1, false);


--
-- Name: budgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.budgets_id_seq', 1, false);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.departments_id_seq', 1, true);


--
-- Name: leave_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.leave_requests_id_seq', 1, false);


--
-- Name: payroll_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.payroll_id_seq', 1, false);


--
-- Name: staff_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.staff_documents_id_seq', 1, false);


--
-- Name: staff_evaluations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.staff_evaluations_id_seq', 1, false);


--
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.staff_id_seq', 2, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.students_id_seq', 3, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.transactions_id_seq', 24, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: edusync
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- PostgreSQL database dump complete
--

\unrestrict ZCLuNsEEkeUZmw4KAnhrou28RUm7VSMzoatZnJQHdcPYlsk0pNUIbqb5qqmizBI

