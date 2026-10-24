# EduPortal (Web Security Project)

A full stack student **education portal** built to demonstrate how common web
vulnerabilities work, how they are exploited, and how they are properly fixed.
The same application ships in **two switchable versions** , a deliberately
**Vulnerable** version and a hardened **Safe** version, controlled by a single
configuration flag.

> Course: Information Security · Part 2 

---

## 📌 Use Case

EduPortal is a realistic education platform with:
- **Login / Authentication**
- **Student dashboard**
- **Course search**
- **Discussion board** (comments)
- **Personalized welcome page**
- **Account settings** (change password)

These real features make the attacks meaningful and genuinely demonstrable.

---

## Tech Stack & Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend | Node.js + Express | Web server, routing, session handling |
| Views | EJS | Server-rendered HTML (escaped vs raw output shows XSS clearly) |
| Database | Microsoft SQL Server (`mssql` driver) | Real, query-driven backend — SQL injection is genuine, not faked |
| Session | express-session | Session cookie that makes the CSRF attack real |
| Toggle | `MODE` environment flag | Switches the entire app between Vulnerable and Safe |

**Two versions, one codebase:** every route checks `MODE` and runs either the
insecure or the hardened code path. No duplicate project — the difference in
security posture is a single switch.

---

##  Project Structure
eduportal-security/
├── config.js # settings + MODE flag
├── db.js # SQL Server connection pool
├── utils.js # escapeHtml + auth helper
├── server.js # Express app, session, routing
├── setup.sql # database schema + seed data
├── routes/
│ ├── auth.js # login (SQL injection point)
│ ├── courses.js # search (reflected XSS + SQLi) + welcome (DOM XSS)
│ ├── comments.js # discussion board (stored XSS)
│ └── account.js # change password (CSRF)
├── views/ # EJS templates
├── public/ # CSS + client-side JS (welcome.js = DOM XSS)
└── attacker/
└── csrf.html # external malicious page (CSRF proof-of-concept)


---

## How to Run Both Versions

**Prerequisites:** Node.js, Microsoft SQL Server (with SQL Authentication enabled).

1. Create the database — run `setup.sql` in SQL Server Management Studio.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run a version:
   ```bash
   npm run vuln    # Vulnerable version  ->  http://localhost:3000
   npm run safe    # Safe version        ->  http://localhost:3000
   ```
Restart with the other command to switch versions.

**Demo accounts:** `admin / admin123`, `saad / saad123`

---

## Implemented Vulnerabilities & Fixes

| # | Vulnerability | Location | Fix in Safe version |
|---|---------------|----------|---------------------|
| 1 | **Reflected XSS** | Course search (`/search?q=`) | HTML output encoding |
| 2 | **Stored XSS** | Discussion comments | HTML output encoding |
| 3 | **DOM-based XSS** | Welcome page (`/welcome#`) | `textContent` instead of `innerHTML` |
| 4 | **CSRF** | Change password | Per-session CSRF token |
| 5 | **SQLi — Easy** | Login (bypass) | Parameterized query |
| 6 | **SQLi — Intermediate** | Search (error-based) | Parameterized query + generic errors |
| 7 | **SQLi — Advanced** | Search (UNION chain) | Parameterized query |

---

##  Example Payloads (Vulnerable version)

**Reflected XSS**

/search?q=<img src=x onerror=alert(document.domain)>

**Stored XSS** (post as a comment)

<img src=x onerror=alert(‘Stored-XSS’)>

**DOM-based XSS**

/welcome#<img src=x onerror=alert(‘DOM-XSS’)>

**CSRF** — open `attacker/csrf.html` (different origin) while logged in; it silently changes the password.

**SQL Injection — Easy** (login username)

admin’ --

**SQL Injection — Intermediate** (search, error-based)

zzz%’ AND 1=CONVERT(int,(SELECT TOP 1 username FROM users))--

**SQL Injection — Advanced** (search, UNION chain)

zzz%’ UNION SELECT 1, table_name, 3 FROM information_schema.tables--
zzz%’ UNION SELECT 1, column_name, 3 FROM information_schema.columns WHERE table_name='users'--
zzz%’ UNION SELECT 1, username, password FROM users--


---

## Safe Version Defenses Summary

- **XSS:** all user input is HTML-escaped before rendering; DOM sink uses `textContent`.
- **CSRF:** state-changing requests require a valid per-session token (else `403 Forbidden`).
- **SQL Injection:** all queries use bound parameters; database errors are hidden behind generic messages.

In Safe mode every payload above fails: XSS payloads render as plain text, the
CSRF attack is rejected, and SQL injection returns no data.

---

## Authors

- **Eeman** — XSS (reflected, stored, DOM), SQL Injection (all three levels), documentation
- **Abeera** — project setup, server & layout, CSRF attack and defense

---

## Evidence

See the evidence document in `/docs` for every working payload with
screenshots proving the exploit succeeded (Vulnerable) and was blocked (Safe).

