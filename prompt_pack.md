# Incubyte Salary Management: Prompt Pack

> **Your setup (updated 28 Oct):** Ruby 3.3.13 + Rails 7.2.4 + Node 24 are installed in WSL Ubuntu. The projects live in `D:\t\incubyte-assement\backend` (Rails API, already created) and `D:\t\incubyte-assement\frontend` (empty, for React/Vite). Run all Ruby/Rails/npm commands inside Ubuntu: `wsl -d Ubuntu`, then `cd /mnt/d/t/incubyte-assement/backend`. If `bin/rails` says permission denied, use `ruby bin/rails ...`. Skip prompt 0a (already done). Start with prompt 0.


Paste these prompts into Cursor or Claude Code **in order**, one per step. Each step: paste the prompt, review the diff, run the quick check, then commit with the given message. Small, clean commits are part of what Incubyte grades.

**Ground rules (read once)**
- Do **not** commit a step until its quick check passes.
- Every prompt tells the AI to append to `docs/ai-prompts.md`. Before committing, make sure the log holds the prompt you actually used and one line on what you changed or rejected. Edit it so it is true. Incubyte reads this log.
- Review the code before you commit it. In the interview they will ask about your design decisions, your AI workflow and trade-offs, so understand every file.
- Frontend is plain **JavaScript** React (Vite `react` template, not TypeScript).
- Repo layout (monorepo): `backend/` (Rails), `frontend/` (React/Vite), `docs/`, `REQUIREMENTS.md`, `README.md`.
- Stack: Ruby 3.3, Rails 7.2 (API mode), Minitest (Rails default, fast), SQLite locally, Postgres in deploy, React + Vite + MUI + Recharts + React Router.
- Do not send anything to Incubyte until you've finished and read the draft in Prompt 13.

**Prompt index**
0a. Set up your machine (Windows/WSL2, Mac/Linux)
0. Repo + AI log + requirements one-pager
1. Rails API scaffold + auth
2. Models, migrations, indexes
3. Seed 10,000 employees
4. Stats service objects + tests
5. API endpoints
6. React app shell + login
7. Employees table + forms
8. Dashboard charts
9. CSV import/export + salary history UI
10. Tests pass + polish
11. Deploy (Render, single service)
12. README + demo video script
13. Reply email to Sandli (draft only)

---

## Prompt 0a: Set up your machine (Ruby 3.3, Rails 7.2, Node, Git)

**Goal:** get a working Ruby/Rails/Node/Git toolchain. This is not a prompt for the AI. Run the commands yourself. Total time: about 30–45 minutes, mostly downloads and the Ruby compile.

### Option A (recommended on Windows): WSL2 Ubuntu + rbenv

Rails is far smoother on Linux, and Cursor and Claude Code both work with WSL.

**1. Install WSL2 + Ubuntu.** Open **PowerShell as Administrator**:
```powershell
wsl --install -d Ubuntu
```
Restart when asked. Ubuntu opens and asks you to create a Linux username and password. Remember the password, because `sudo` needs it. Verify in PowerShell:
```powershell
wsl -l -v
```
It should show Ubuntu with VERSION 2. If it says 1, run `wsl --set-version Ubuntu 2`.

**2. Open the Ubuntu terminal and install build dependencies:**
```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install git curl build-essential autoconf bison libssl-dev libyaml-dev \
  libreadline-dev zlib1g-dev libffi-dev libgdbm-dev libncurses5-dev libsqlite3-dev \
  sqlite3 libpq-dev postgresql-client unzip
```

**3. Install rbenv + ruby-build, then Ruby 3.3:**
```bash
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init - bash)"' >> ~/.bashrc
source ~/.bashrc
rbenv install -l | grep '^3\.3'        # pick the newest 3.3.x from this list
rbenv install 3.3.6                    # replace 3.3.6 with the newest 3.3.x if it differs (takes ~5-10 min)
rbenv global 3.3.6
```

**4. Install Rails 7.2 and Bundler:**
```bash
gem install bundler
gem install rails -v '~> 7.1.0'
rbenv rehash
```

**5. Install Node (LTS) via nvm:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.bashrc
nvm install --lts
```

**6. Configure Git + GitHub:**
```bash
git config --global user.name "Nitin Kumar"
git config --global user.email "nk378266@gmail.com"
git config --global init.defaultBranch main
sudo apt -y install gh   # if not found, see https://github.com/cli/cli/blob/trunk/docs/install_linux.md
gh auth login            # choose GitHub.com, HTTPS, login with browser
```

**7. Verify (all must print versions, no errors):**
```bash
ruby -v          # ruby 3.3.x
rails -v         # Rails 7.2.x
bundler -v
node -v && npm -v
git --version
sqlite3 --version
gh auth status
```

**Windows tips**
- **Keep your project inside Linux**, e.g. `~/projects/salary-management`, not under `/mnt/c/...`. Files on `/mnt/c` are very slow for Rails and npm.
- Open it in your editor from the Ubuntu terminal with `cd ~/projects/salary-management && cursor .` (or `code .`). Cursor/VS Code will offer to install its WSL server. Accept.
- Run Claude Code (if you use it) inside the Ubuntu terminal.
- Ports like `localhost:3000` and `localhost:5173` are reachable from your Windows browser.

### Option B (alternative): native Windows with RubyInstaller

Use this only if WSL2 won't install (for example virtualization is disabled in BIOS). Expect more friction with native gems.

In **PowerShell**:
```powershell
winget install RubyInstallerTeam.RubyWithDevKit.3.3
winget install OpenJS.NodeJS.LTS
winget install Git.Git
winget install GitHub.cli
```
Close and reopen PowerShell, then run the DevKit setup. When it asks, press **Enter** to choose the default option 1 or 3:
```powershell
ridk install
gem install bundler
gem install rails -v "~> 7.1.0"
```
Verify:
```powershell
ruby -v; rails -v; node -v; npm -v; git --version; gh --version
```
Note: SQLite gems on Windows sometimes need `gem install sqlite3 --platform=x64-mingw-ucrt`. If you hit gem errors, switch to Option A instead of fighting it.

### Option C: Mac / Linux (short)

```bash
# macOS (Homebrew):
brew install rbenv ruby-build node git gh sqlite libpq
# Ubuntu/Debian: do steps 2, 3, 5 and 6 from Option A instead.

echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc && source ~/.zshrc   # use bash/.bashrc if you use bash
rbenv install 3.3.6 && rbenv global 3.3.6                          # use newest 3.3.x from `rbenv install -l`
gem install bundler && gem install rails -v '~> 7.1.0'
ruby -v && rails -v && node -v && git --version && gh auth status
```

**Quick check:** the verify commands above all print versions. Finally run `rails new /tmp/smoketest --api --skip-git && cd /tmp/smoketest && bin/rails about`. It should print Rails and Ruby versions with no gem errors. Then delete `/tmp/smoketest`.

**Commit:** none.

---

## Prompt 0: Repo + AI log + requirements one-pager

**Goal:** create the public repo and write the docs *before* any code. The assignment explicitly asks for the requirements doc first.

First do this yourself:
```bash
mkdir -p ~/projects/salary-management && cd ~/projects/salary-management
git init
gh repo create salary-management --public --source=. --remote=origin
```

Then open the empty folder in Cursor/Claude Code and paste:

```text
You are helping me build a take-home assessment: a Salary Management web app for an HR Manager at "ACME", a company with 10,000 employees across multiple countries, replacing Excel. Graders look at clear thinking, product sense, engineering judgment, clean code, meaningful fast tests, incremental commits, and how I use AI.

Fixed decisions:
- Monorepo: backend/ (Rails 7.2 API-only, Ruby 3.3, Minitest, SQLite in dev/test, Postgres in production) and frontend/ (React + Vite, JavaScript, MUI, Recharts). In production, Rails serves the built React app from one service.
- Auth: email+password login for an HR user (a single role). One seeded demo user.
- One base currency: USD. Each country has a currency code and a conversion rate to USD. All aggregate stats use salary converted to USD.
- Features: employee CRUD, search/filter, pagination, CSV import/export, salary change history (audit), dashboard with stats.
- Dashboard stats: headcount, total payroll, avg/median/min/max salary; breakdown by country, department and job title with headcount and avg/median/p25/p75/p90; salary distribution histogram; median pay by tenure band (0-2, 2-5, 5+ years); outliers vs median for the same job title + country.

Do these things now, no application code yet:
1. Create REQUIREMENTS.md (strictly ONE page, about 400-500 words) with sections: Goal, Persona and key questions the HR manager needs answered, Scope and Features (must-have), Deliberately Left Out (with a one-line reason each: for example multi-role permissions/SSO, payroll/tax calculation, live FX rates, bonuses/equity/currency history, approval workflows, audit-log UI beyond per-employee history, i18n, background job infra), Assumptions (one base currency USD with an editable per-country rate; one salary figure per employee = annual base salary in local currency; single HR role), and Success criteria (10,000 rows list and stats respond fast; tests are fast and deterministic).
2. Create docs/ai-prompts.md with a header explaining that this file logs the prompts I used with AI tools, in order, with a one-line note on what I accepted, changed or rejected. Add the first entry for this prompt.
3. Create docs/design-notes.md, docs/tradeoffs.md and docs/performance.md as short stubs with headings only (I'll fill them as I build): Architecture overview; Data model; Trade-offs; Performance considerations.
4. Create .gitignore for Ruby/Rails, Node, SQLite files, .env, and OS junk, plus a minimal README.md with the project name and "work in progress".
Keep wording concise and concrete. Do not invent features outside the fixed decisions.
```

**Commit message:** `docs: add requirements one-pager, AI prompt log and design doc stubs`

**Quick check:** `REQUIREMENTS.md` fits one page (about 450 words). Read it and tweak anything you disagree with. `git push -u origin main` and confirm the repo is public on GitHub.

---

## Prompt 1: Rails API scaffold + auth

**Goal:** a running Rails API with email/password login returning a token.

```text
The Rails 7.2 API-only app ALREADY EXISTS in backend/ (created with `rails new . --api --database=sqlite3`, Ruby 3.3.13, Minitest). Do NOT run rails new again. Work inside backend/ on the existing app. Then:

1. Gemfile: add `bcrypt`, `rack-cors`; add `pg` in the production group only (sqlite3 stays for development/test). Configure `config/database.yml` so production uses DATABASE_URL.
2. Create the `users` table + model (email unique and case-insensitive, name, password_digest) using `has_secure_password`. Validate email format and password length >= 8.
3. Token auth with no extra gems: use Rails 7.2 `generates_token_for :api, expires_in: 12.hours` on User (embed password_salt so tokens die when the password changes). Add `Authenticatable` concern in ApplicationController: read `Authorization: Bearer <token>`, `User.find_by_token_for(:api, token)`, otherwise render 401 JSON `{error: "unauthorized"}`.
4. Routes under `/backend/v1`: `POST /session` (email+password -> `{token, user:{id,email,name}}`, 401 on bad credentials with the same message for unknown email or wrong password), `GET /me`. Add `GET /up` health check (Rails default) left unauthenticated.
5. CORS: allow `http://localhost:5173` in development only.
6. Add tests (Minitest): login success, wrong password, unknown email, /me with and without a token, an expired token (use `travel_to`). Add `test/fixtures/users.yml` with one user (use `BCrypt::Password.create("password123", cost: 4)` in fixtures for speed; also set `BCrypt::Engine.cost = BCrypt::Engine::MIN_COST` in the test env).
7. Append this prompt and a one-line outcome note to docs/ai-prompts.md, and add a "Auth" section to docs/design-notes.md (token approach, expiry, why not JWT/sessions) and a trade-off entry in docs/tradeoffs.md (stateless tokens: no server-side revoke; acceptable for this scope).
```

**Commit message:** `feat(api): scaffold Rails API with token-based email/password auth and tests`

**Quick check:** `cd backend && bin/rails test` is green. `bin/rails s`, then `curl -s -X POST localhost:3000/backend/v1/session -H 'Content-Type: application/json' -d '{"email":"x","password":"y"}'` returns 401.

---

## Prompt 2: Models, migrations, indexes

**Goal:** correct data model with indexes designed for 10k-row filtering and aggregation.

```text
In backend/, add the domain model. Use migrations, models, validations and Minitest model tests.

Tables:
- countries: code (ISO-2, unique), name, currency_code (3 letters), usd_rate decimal(14,6) not null (1 unit of local currency = usd_rate USD), timestamps.
- employees: first_name, last_name, email (unique, case-insensitive via a unique index on lower(email) -- note SQLite and Postgres both support expression indexes), country_id (FK), department (string), job_title (string), salary decimal(14,2) not null (annual base salary in the country's local currency), salary_usd decimal(14,2) not null (denormalized, = salary * country.usd_rate, rounded to 2 dp), hired_on date not null, timestamps.
- salary_changes: employee_id (FK, on delete cascade), old_salary decimal(14,2) nullable, new_salary decimal(14,2) not null, currency_code, reason string nullable, changed_by_id (FK users, nullable), created_at. No updated_at.

Indexes on employees: country_id; department; job_title; [job_title, country_id]; hired_on; salary_usd; [last_name, first_name]. Index on salary_changes: [employee_id, created_at].

Model behavior:
- Employee `belongs_to :country`, `has_many :salary_changes, dependent: :delete_all`. Validations: names, email format, salary > 0, hired_on not in the future, department and job_title present.
- A `before_validation` callback computes salary_usd from salary and country.usd_rate.
- An `after_save` records a SalaryChange when salary changes (on create: old_salary nil). Allow passing `changed_by` and `reason` through attr_accessors on the model.
- Country: `after_update` that, when usd_rate changes, runs ONE `UPDATE employees SET salary_usd = ROUND(salary * ?, 2) WHERE country_id = ?` (no per-row callbacks). Document this in docs/design-notes.md as the denormalization trade-off (fast aggregates vs consistency maintenance).
- Employee scope helpers: `search(q)` (case-insensitive match on first_name, last_name, email using LOWER(col) LIKE so it works in SQLite and Postgres; escape % and _), `in_country`, `in_department`, `with_title`, `salary_between(min, max)` on salary_usd.
- A `Tenure` helper: `Employee#tenure_years(as_of: Date.current)`.

Tests (fast, deterministic, fixtures with 2 countries and ~6 employees): salary_usd computed correctly; changing salary creates a history row with old/new; changing country rate updates salary_usd in a single query; validations; search escapes wildcards; tenure with a fixed as_of.

Append this prompt + outcome to docs/ai-prompts.md. Fill the "Data model" section of docs/design-notes.md with a small table or mermaid ER diagram and the index rationale.
```

**Commit message:** `feat(api): add country, employee and salary_change models with indexes and tests`

**Quick check:** `bin/rails db:migrate && bin/rails test` is green. `bin/rails db:schema:dump` leaves `db/schema.rb` committed. Skim schema.rb to confirm the indexes exist.

---

## Prompt 3: Seed 10,000 employees fast

**Goal:** a deterministic, realistic, fast seed (should run in seconds, not minutes).

```text
In backend/, write db/seeds.rb (delegating to a small plain Ruby class in app/services/seeding/employee_seeder.rb so it is testable).

Requirements:
- Seed countries (about 8: India INR, United States USD, United Kingdom GBP, Germany EUR, Singapore SGD, Australia AUD, Canada CAD, Brazil BRL) with realistic approximate usd_rate values hard-coded and commented as "illustrative rates".
- Create the demo user: demo@acme.test / Password123! (name "HR Manager"). Idempotent via find_or_create_by.
- Create exactly 10,000 employees. Use `Random.new(42)` so output is deterministic. Realistic distribution: weighted countries (India and US biggest); ~8 departments (Engineering, Sales, Marketing, HR, Finance, Operations, Support, Product); 3-6 job titles per department with levels (e.g. Software Engineer I/II/Senior/Staff, Sales Executive, Account Manager...). Salary is generated in USD-equivalent from a title-level base × country cost factor × random noise (normal-ish, +/-15%), then converted to local currency and rounded to a sensible step. Include a handful (~40) of deliberate outliers (far above and below the median for their title+country) so the outlier feature has something to show. Names: built-in lists of ~100 first names and ~100 last names per country flavor (no Faker needed; if you use Faker, add it only to the development/test group and tell me). Unique emails like `first.last.N@acme.test`. hired_on spread over the last 12 years with a bias toward recent years.
- PERFORMANCE: use `Employee.insert_all` in batches of 1,000 (insert_all skips callbacks, so compute salary_usd yourself in the seeder) and then bulk-insert one initial SalaryChange row per employee with `insert_all` (reason "Initial salary"), using the ids returned. Wrap in a single transaction. Print elapsed time.
- Seeding must be idempotent: if employees exist, skip unless ENV["RESEED"]=="1", in which case delete salary_changes and employees first.
- Add a Minitest test for the seeder that runs it with a small count (the count passed as an argument, e.g. 200) and asserts counts, deterministic output for the same seed, valid salary_usd, and that outliers exist. It must run in < 1 second.
- Add a "Seeding" paragraph to docs/performance.md (batching, insert_all, single transaction, measured time -- fill in my measured time after I run it).

Append this prompt + outcome to docs/ai-prompts.md.
```

**Commit message:** `feat(api): add deterministic bulk seed for 10,000 employees with demo user`

**Quick check:** `bin/rails db:reset` (or `db:setup`) finishes in a few seconds. `bin/rails runner 'puts Employee.count, SalaryChange.count, Country.count'` prints 10000, 10000, 8. Write the real elapsed time into `docs/performance.md`.

---

## Prompt 4: Stats service objects + tests

**Goal:** the core business logic, isolated from controllers, with the heaviest tests.

```text
In backend/app/services/stats/, build plain-Ruby service objects. They are the core logic of the app and must be easy to read and fully unit-tested.

Shared:
- `Stats::Percentile.call(sorted_values, p)` using linear interpolation between closest ranks (the same method as NumPy's default / Excel PERCENTILE.INC). Return nil for an empty array. Median = p50. Document the method in a comment.
- All stats operate on `salary_usd`. Fetch data with a single `pluck` per call (e.g. `pluck(:country_id, :salary_usd)`), group and sort in Ruby. 10k rows is small and this keeps SQLite/Postgres parity (SQL percentile functions differ between them). Document this choice in docs/tradeoffs.md.
- Accept an optional ActiveRecord relation (so filters can be applied later) and, where time matters, an `as_of:` date parameter (default Date.current) so tests are deterministic.

Services:
1. `Stats::Summary` -> {headcount, total_payroll_usd, avg, median, min, max}. Handle zero employees (nil/0 values, no exceptions).
2. `Stats::Breakdown.new(by: :country|:department|:job_title)` -> array of {key (country uses code + name), headcount, avg, median, p25, p75, p90}, sorted by headcount desc. Whitelist `by` (raise ArgumentError otherwise).
3. `Stats::Distribution.new(bins: 20)` -> histogram of salary_usd: array of {from, to, count}. Use equal-width bins from min to max; max falls into the last bin; handle all-equal salaries and empty data.
4. `Stats::TenureBands` -> median salary_usd and headcount for bands "0-2", "2-5", "5+" (years since hired_on as of as_of; 0-2 means >= 0 and < 2, 2-5 means >= 2 and < 5, 5+ means >= 5).
5. `Stats::Outliers.new(threshold: 0.4, min_group_size: 5, limit: 50)` -> employees whose salary_usd deviates from the median salary_usd of their (job_title, country) group by more than `threshold` (fraction of median), only for groups with at least min_group_size members. Return employee id, name, job_title, country, salary_usd, group_median, deviation_pct (signed), group_size; sorted by absolute deviation desc, limited. Document the rule in docs/design-notes.md and why it is "median-based" (robust to the outliers themselves).

Tests in test/services/stats/ using small hand-computed fixtures/factories created inline (no 10k data). Cover: percentile on odd/even/single/empty arrays with known answers; summary with known numbers; breakdown grouping and percentiles with known answers; distribution bin edges, all-equal, empty; tenure band boundaries exactly at 2 and 5 years using a fixed as_of; outliers: flagged high, flagged low, small group ignored, threshold boundary, ordering, and limit. All tests must be deterministic and run in well under a second total.

Append this prompt + outcome to docs/ai-prompts.md.
```

**Commit message:** `feat(api): add stats service objects (summary, breakdown, distribution, tenure, outliers) with unit tests`

**Quick check:** `bin/rails test test/services` is green and fast. Hand-check one percentile test number yourself (e.g. p25 of 10,20,30,40,50 is 20).

---

## Prompt 5: API endpoints

**Goal:** a REST API over the models and stats, with validation, pagination, filters, and request tests.

```text
In backend/, add the JSON API under /backend/v1. All endpoints except POST /session and /up require the bearer token. Keep controllers thin: delegate to models and the service objects from app/services/stats. Return consistent error JSON: `{error: "message", details: {...}}` with correct status codes (401, 404, 422).

Endpoints:
- `GET /employees` with params: q (search), country (code), department, job_title, min_salary_usd, max_salary_usd, sort (whitelist: name, salary_usd, hired_on, country, job_title, department) and dir (asc|desc), page (default 1), per_page (default 25, max 100). Response `{data:[...], meta:{page, per_page, total, total_pages}}`. Use `includes(:country)` or a join to avoid N+1, and `count` only once. Implement pagination with limit/offset by hand (no gem).
- `GET /employees/:id` (includes country info), `POST /employees`, `PATCH /employees/:id`, `DELETE /employees/:id`. Strong params. When salary changes, record `changed_by` (current user) and an optional `change_reason` param. 422 with field errors on validation failure.
- `GET /employees/:id/salary_changes` -> history newest first.
- `GET /meta/filters` -> {countries:[{code,name,currency_code}], departments:[...], job_titles:[...]} (distinct values).
- `GET /countries`, `PATCH /countries/:code` (only usd_rate editable; must be > 0).
- Stats: `GET /stats/summary`, `GET /stats/breakdown?by=country|department|job_title`, `GET /stats/distribution?bins=20`, `GET /stats/tenure`, `GET /stats/outliers?threshold=0.4&limit=50`. Clamp/validate params. Wrap each stats response in a small `Rails.cache.fetch` (memory store, 60s TTL, key includes Employee.count and Employee.maximum(:updated_at)) and note the cache in docs/performance.md. Disable the cache in the test env so tests stay deterministic.
- (CSV import/export come in Prompt 9; do not build them now.)

Request/integration tests (Minitest, fixtures): auth required (401 without a token) for each controller; employees index pagination meta, search, each filter, sort whitelist (invalid sort is ignored or returns 422), create/update/delete happy and 422 paths, salary change creates history with the current user, countries rate update changes salary_usd, stats endpoints return the expected shape on the fixtures.

Add an "API" section to docs/design-notes.md (endpoint table). Append this prompt + outcome to docs/ai-prompts.md.
```

**Commit message:** `feat(api): add employees, countries, meta and stats endpoints with request tests`

**Quick check:** `bin/rails test` is green. Seed the dev DB, start the server, then:
```bash
TOKEN=$(curl -s -X POST localhost:3000/backend/v1/session -H 'Content-Type: application/json' -d '{"email":"demo@acme.test","password":"Password123!"}' | ruby -rjson -e 'puts JSON.parse(STDIN.read)["token"]')
curl -s -H "Authorization: Bearer $TOKEN" "localhost:3000/backend/v1/stats/summary"
curl -s -H "Authorization: Bearer $TOKEN" "localhost:3000/backend/v1/employees?per_page=5&q=sharma"
```
Both should return fast (well under a second).

---

## Prompt 6: React app shell + login

**Goal:** Vite React app with MUI, routing, login, and an authenticated layout.

```text
In frontend/, create a React app with Vite (JavaScript, NOT TypeScript): `npm create vite@latest frontend -- --template react`. Install: @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom recharts. (Optional: @tanstack/react-query for data fetching -- use it if it keeps the code simpler, and tell me.) Also add Vitest + @testing-library/react for a few tests.

Build:
1. `vite.config.js`: dev proxy `/api` -> http://localhost:3000. Build output goes to `../backend/public` (set `build.outDir` to '../backend/public' and `emptyOutDir: true`). Add a `build:rails` npm script if helpful.
2. `src/backend/client.js`: a small fetch wrapper: base path `/backend/v1`, attaches the bearer token from localStorage, parses JSON, throws an error object with status and body on non-2xx, and on 401 clears the token and redirects to /login.
3. `src/auth/AuthContext.jsx`: login(email, password), logout(), the current user, loading state; on app start, if a token exists call GET /me.
4. Routing (react-router-dom): `/login`, and protected routes `/` (Dashboard placeholder), `/employees` (placeholder), `/settings/countries` (placeholder). A `ProtectedRoute` component redirects to /login when logged out.
5. Layout: MUI AppBar with the app name "ACME Salary Manager", nav links (Dashboard, Employees, Countries), user email and a Logout button. Responsive container.
6. Login page: MUI form with email and password, error alert on failure, loading state on the button, prefilled with nothing (the demo credentials will go in the README, not in the code). Basic MUI theme file in src/theme.js.
7. Rails must serve the SPA in production: add a catch-all route in the API app (non-/api GET requests render public/index.html) via a small controller (`FallbackController#index` using `send_file`), and ensure the Rails API app serves static files (`config.public_file_server.enabled = true`, and enable `ActionDispatch::Static` if needed in API mode).

Tests (Vitest): the api client attaches the token and handles 401; the Login page shows an error on failed login (mock fetch). Keep these few and fast.

Append this prompt + outcome to docs/ai-prompts.md.
```

**Commit message:** `feat(web): add Vite React app shell with MUI, routing and login`

**Quick check:** run the Rails server (`cd backend && bin/rails s`) and the React dev server (`cd frontend && npm run dev`). Open http://localhost:5173, log in as `demo@acme.test` / `Password123!`, and see the nav. Logging out sends you back to /login. `npm test` is green.

---

## Prompt 7: Employees table + forms

**Goal:** the HR manager's main working screen.

```text
In frontend/, build the Employees feature with MUI.

1. `/employees` page: toolbar with a search box (debounced 300ms), filter selects for Country, Department and Job title (options from GET /meta/filters), and min/max salary (USD) inputs; a "Clear filters" button; an "Add employee" button. Keep the filter state in the URL query string so refresh/back works.
2. Table (MUI Table is fine; use server-side pagination with TablePagination, per_page options 25/50/100, and server-side sorting by clicking column headers: Name, Department, Job title, Country, Salary (local), Salary (USD), Hired on). Show loading and empty states, and an error state with retry. Format salary with Intl.NumberFormat using the employee's currency_code; format USD separately.
3. Create/Edit: an MUI Dialog (or separate page) with a form: first name, last name, email, country (select), department (free text with suggestions from meta), job title (free text with suggestions), salary (local currency, shows the currency code of the selected country and a live USD equivalent using the country rate), hired on (date), and "reason for change" (shown only when editing and the salary changed). Show server-side 422 field errors under the matching fields. Disable submit while saving; success shows a Snackbar and refreshes the table.
4. Delete: a confirm dialog, then a Snackbar.
5. Row click or an icon opens a Salary History drawer for that employee using GET /employees/:id/salary_changes (date, old -> new, reason, who changed it).
6. Components should be small and reusable (EmployeeTable, EmployeeFilters, EmployeeFormDialog, SalaryHistoryDrawer, a useEmployees hook). No giant files.

Tests (Vitest + Testing Library, mocked fetch): the table renders rows and pagination meta; typing in the search triggers a request with q after the debounce (use fake timers); the form shows server validation errors. Keep to 3-5 tests.

Append this prompt + outcome to docs/ai-prompts.md.
```

**Commit message:** `feat(web): add employees table with filters, pagination, forms and salary history drawer`

**Quick check:** with 10k seeded rows, scroll through pages, sort by Salary (USD), search for a name, filter by country, add an employee, edit its salary with a reason, and open the history drawer. Check the UI stays responsive.

---

## Prompt 8: Dashboard charts

**Goal:** the "how does the org pay people" view.

```text
In frontend/, build the Dashboard page (route `/`) with MUI + Recharts, using the /stats endpoints.

Sections:
1. KPI cards: Headcount, Total payroll (USD), Average, Median, Min, Max salary (USD). Format compactly (e.g. $1.2M) with full values in a tooltip.
2. "Pay by group": a segmented control (Country / Department / Job title) calling /stats/breakdown?by=...; show a table with headcount, avg, median, p25, p75, p90 (sortable client-side, with a search box for job titles since there are many) plus a Recharts bar chart of median with p25-p75 shown (a stacked/range bar or a simple grouped bar of p25/median/p75 -- pick the simplest that reads clearly).
3. "Salary distribution": a Recharts bar histogram from /stats/distribution (bins selectable 10/20/40), x-axis in USD, tooltip with the count.
4. "Median pay by tenure": bars for 0-2, 2-5, 5+ years, with headcount in the tooltip.
5. "Pay outliers": table from /stats/outliers (name, title, country, salary USD, group median, deviation % colored red/blue for high/low, group size) with a threshold slider (20%-100%) that re-queries; clicking a row links to /employees?q=<email>.
6. Each section is its own component with its own loading and error state (skeleton for loading). A page-level refresh button. Responsive grid layout. Keep charts accessible: titles, axis labels, tooltips.

Add 2-3 Vitest tests with mocked fetch (KPI cards render values; breakdown toggle changes the requested `by`; outlier slider triggers a request with the threshold).

Append this prompt + outcome to docs/ai-prompts.md. Take screenshots later for the README.
```

**Commit message:** `feat(web): add dashboard with KPIs, group breakdowns, distribution, tenure and outlier views`

**Quick check:** the numbers on the dashboard match the output of `curl .../stats/summary`. Spot-check one group's median by hand with `bin/rails runner` or a SQLite query. Every section loads in about 1 second on 10k rows.

---

## Prompt 9: CSV import/export + salary history

**Goal:** the Excel-replacement features.

```text
Add CSV export and import.

API (backend/):
1. `GET /backend/v1/employees/export` streams a CSV honoring the same filters/sort as the index (no pagination). Columns: first_name,last_name,email,country_code,department,job_title,salary,hired_on (ISO 8601). Stream in batches with `find_each`/`in_batches` (response streaming via ActionController::Live is NOT needed; build lines with an Enumerator and `response.stream` or just chunk to a String if simpler -- tell me what you chose). Sanitize against CSV/formula injection: prefix cells starting with = + - @ with a single quote. Use the correct Content-Type and a filename with the date.
2. `POST /backend/v1/employees/import` (multipart `file`). Use Ruby's CSV with headers. Limits: 5 MB, 10,000 rows max. Validate each row (country_code must exist, salary > 0, hired_on parsable, email valid). Upsert by email (case-insensitive): create new, update changed salary/fields for existing, recording SalaryChange rows with reason "CSV import". Process in a single transaction in batches; invalid rows do NOT abort valid rows. Support a `dry_run=true` param that validates and reports without writing. Response: `{created, updated, unchanged, failed, errors:[{row, email, messages}]}` (cap errors list at 100). Put the logic in `app/services/employee_csv_importer.rb` and `employee_csv_exporter.rb`, not in the controller.
3. Tests: exporter output headers and a formula-injection case; importer creates, updates, skips unchanged, reports bad rows with row numbers, dry-run writes nothing, creates history rows, rejects an oversized or empty file, handles a missing header. Use small inline CSV strings.

UI (frontend/):
4. In the Employees toolbar: "Export CSV" (downloads using the current filters via fetch with the token -> blob -> download link) and "Import CSV" (dialog: choose a file, a "Validate only" checkbox, then submit; shows the summary counts and an error table with row numbers; refreshes the table on success). Also a "Download template" link generating a one-row sample CSV client-side.
5. One Vitest test for the import dialog showing the summary and errors (mocked fetch).

Update docs/design-notes.md (CSV format, upsert key, limits) and docs/tradeoffs.md (synchronous import with a 10k-row cap instead of a background job; why). Append this prompt + outcome to docs/ai-prompts.md.
```

**Commit message:** `feat: add CSV export and validated import with dry-run, plus UI`

**Quick check:** export the file and import it back with Validate only. The result should be about `unchanged: 10000`. Edit two salaries and one bad country code in the CSV and import. The result should show 2 updated and 1 failed with the row number, and the history drawer should show "CSV import".

---

## Prompt 10: Tests pass + polish

**Goal:** a clean, green, readable repo.

```text
Do a quality pass over the whole repo. Do not add new features.

1. Run `cd backend && bin/rails test` and `cd frontend && npm test -- --run`; fix anything failing or flaky. The Rails suite must be fast (report total time) and deterministic (no dependence on the current date without travel_to/as_of, no random without a seed, no test-order dependence; run it twice with different seeds: `bin/rails test --seed 1` and `--seed 999`).
2. Add Rubocop with the rails-omakase config if not present (`bundle exec rubocop`), fix offenses, and add ESLint for web if Vite didn't. Make `npm run lint` and `bundle exec rubocop` pass.
3. Review for N+1 queries, missing indexes for the filters I support, unbounded queries, and missing auth checks on every endpoint. Fix issues you find and list them.
4. Review the UI for loading/empty/error states, keyboard accessibility of forms and dialogs, and obvious console errors.
5. Remove dead code, unused deps and TODOs. Ensure no secrets are committed (check `git grep -n -i -E "password|secret|key"` results are only legitimate), `.env` is ignored, `config/master.key` is ignored, and that production secrets come from env vars (SECRET_KEY_BASE, DATABASE_URL).
6. Fill in docs/performance.md with real measurements I can reproduce (seed time, employees index p50 for page 1 and a filtered query, stats endpoints cold vs cached), and docs/tradeoffs.md with the final list (denormalized salary_usd, stats computed in Ruby instead of SQL percentiles, one base currency with manual rates, token auth without revocation, sync CSV import, SQLite dev/Postgres prod parity risks and how I mitigated them, memory cache per process).
7. Add a root `Makefile` or `bin/setup` shortcuts: `make setup` (bundle, npm install, db setup+seed), `make test`, `make dev`.
8. Append this prompt + outcome to docs/ai-prompts.md.
```

**Commit message:** `chore: lint, fix flaky tests, performance and trade-off notes`

**Quick check:** both test suites are green twice in a row, `make test` works from a fresh clone, and the Rails suite runs in a few seconds.

---

## Prompt 11: Deploy (Render, single service)

**Goal:** one public URL serving the React app and the API, with seeded data.

Suggested host: **Render** (web service + Postgres). Fly.io and Railway also work, but check each one's current free-tier terms. Free Postgres on some hosts expires or sleeps, so check this before you submit and before the review, then re-check the live link on the day you send it.

```text
Prepare the app for deployment as ONE service on Render (Docker), with Postgres.

1. Create a root-level multi-stage `Dockerfile`: stage 1 (node:lts-slim) builds the React app (`cd frontend && npm ci && npm run build`, output to ../backend/public); stage 2 (ruby:3.3-slim) installs build deps and libpq, `bundle install --without development test` (deployment mode), copies backend/ and the built assets, sets RAILS_ENV=production, RAILS_SERVE_STATIC_FILES=true, exposes the port from $PORT and runs `bin/rails server -b 0.0.0.0 -p ${PORT:-3000}`. Add a root `.dockerignore` (node_modules, .git, log, tmp, sqlite files, .env).
2. Production config: Postgres via DATABASE_URL, `config.force_ssl` appropriate behind Render's proxy (assume_ssl true), SECRET_KEY_BASE from env, `config.hosts` allowing the Render hostname (or clearing it with a note), log to STDOUT, and CORS not needed in prod (same origin).
3. An entrypoint/pre-deploy step that runs `bin/rails db:prepare` on boot. Seeding must be a ONE-OFF: do not seed on every boot. I will run `bin/rails db:seed` once from the Render shell or via a one-time job. Make sure db/seeds.rb works on Postgres (insert_all batching, expression index on lower(email)) and tell me anything Postgres-specific to check.
4. Add `render.yaml` (Blueprint) with a web service (docker, health check path /up, env vars: SECRET_KEY_BASE generateValue, DATABASE_URL from the database, RAILS_ENV, RAILS_SERVE_STATIC_FILES) and a Postgres database on the free plan.
5. Add a "Deployment" section to docs/design-notes.md describing the single-service choice (simplest, no CORS, one deploy) and its trade-off (the frontend and API scale together).
6. Give me a short step-by-step checklist of the exact clicks/commands I run on Render, including how to run the seed once and how to confirm it worked. Do not put secrets in the repo.

Append this prompt + outcome to docs/ai-prompts.md.
```

**Your steps (the AI should confirm them in the checklist):**
1. Push to GitHub, then on Render: **New → Blueprint** → select the repo → apply.
2. After the first deploy, open the service **Shell** and run `bin/rails db:seed`. Seeding 10,000 rows should take a few seconds.
3. Visit the live URL, log in with `demo@acme.test` / `Password123!`, and click through every page.

**Commit message:** `chore(deploy): add Dockerfile, render.yaml and production config for single-service deploy`

**Quick check:** `curl -s https://<your-app>.onrender.com/up` returns 200, the dashboard loads with 10,000 employees, login works, and a CSV export downloads. Free instances may sleep and take about a minute to wake on the first request. Mention this in the README.

---

## Prompt 12: README + demo video script

**Goal:** README that a reviewer can use in 2 minutes, and a 3–5 minute demo.

```text
Write the final README.md at the repo root. Keep it practical and scannable. Sections:
1. Title, one-line summary, **Live demo URL** (placeholder LIVE_URL_HERE), **Demo video URL** (placeholder VIDEO_URL_HERE), and demo login (demo@acme.test / Password123!). Note that the free-tier host may take ~1 minute to wake up.
2. Screenshots (placeholders in docs/screenshots/ for dashboard and employees pages).
3. Features (bullets matching REQUIREMENTS.md) and what is deliberately out of scope (link to REQUIREMENTS.md).
4. Tech stack and why (Rails API + React/Vite + MUI + Recharts, SQLite dev / Postgres prod, Minitest/Vitest).
5. Architecture overview (small diagram: browser -> Rails (serves React build + /backend/v1) -> DB) and where the core logic lives (app/services/stats, csv importer/exporter).
6. Getting started locally (prereqs Ruby 3.3, Node LTS; `make setup`, `make dev`, ports 3000/5173), running tests (`make test`), re-seeding (`RESEED=1 bin/rails db:seed`).
7. API summary table (link to docs/design-notes.md).
8. How I used AI: tools used, my workflow (requirements first, small prompts per layer, review + tests before each commit), a link to docs/ai-prompts.md, and 3 honest examples of where I corrected or rejected the AI's output (leave bullet stubs for me to fill with true examples from my log -- do NOT invent them).
9. Documentation index: REQUIREMENTS.md, docs/design-notes.md, docs/tradeoffs.md, docs/performance.md, docs/ai-prompts.md.
10. Known limitations and what I'd do next (be honest and brief).
Do not claim anything the code doesn't do. Also create docs/demo-script.md: a 4-minute demo script with timestamps (0:00 problem and persona, 0:30 login, 0:45 dashboard stats and charts and outliers, 1:45 employees table search/filter/sort/pagination at 10k rows, 2:30 add/edit with salary history, 3:00 CSV export/import dry run, 3:30 tests running + commit history + AI log, 3:50 wrap up with trade-offs) with what to say and what to click.
Append this prompt + outcome to docs/ai-prompts.md.
```

**Commit message:** `docs: add README, demo script and documentation index`

**Quick check:** open the README on GitHub and make sure the links work. Replace `LIVE_URL_HERE` and `VIDEO_URL_HERE`. Fill the three "AI corrections" with real examples from `docs/ai-prompts.md`. If you don't have three, list fewer.

**Video (do this yourself):** record with Loom (or any screen recorder) following `docs/demo-script.md`. Keep the video under 5 minutes. Set the link to "anyone with the link can view", paste it into the README, then commit as `docs: add live and demo video links`.

---

## Prompt 13: Reply email to Sandli (DRAFT ONLY, do not send)

**Goal:** the final submission email, sent as a **reply on the same thread**. This prompt only drafts. You send it yourself, after the repo is public, the live link works, and the video link opens in an incognito window.

Optionally ask your AI tool to tailor it:
```text
Draft a short reply email (under 150 words) to the Incubyte recruiter for my take-home submission. Do not send anything. Use a friendly, professional tone, first person, and include these placeholders: REPO_URL, LIVE_URL, VIDEO_URL. Mention: the repo is public; login credentials for the live app; REQUIREMENTS.md and docs/ are included (requirements, design notes, trade-offs, performance notes, and the AI prompt log); the commit history shows how it evolved. Keep one line on the key assumptions I made, and say I'm happy to walk through any decision.
```

**Draft (fill the placeholders):**

> **Subject:** Re: Salary Management Assessment: Submission (Nitin Kumar)
>
> Hi Sandli,
>
> Thanks for the assessment. I've completed the Salary Management app for ACME's HR manager. The links are below.
>
> - Repo (public): REPO_URL
> - Live app: LIVE_URL (login: demo@acme.test / Password123!). The free-tier host can take about a minute to wake up on the first load.
> - Demo video: VIDEO_URL
>
> It's a Rails API with a React (Vite + MUI) frontend and 10,000 seeded employees across 8 countries. It has employee CRUD with search, filters and pagination, CSV import/export, salary change history, and a dashboard with pay stats by country, department and job title, a salary distribution, tenure bands and outlier detection.
>
> The repo includes `REQUIREMENTS.md`, plus design notes, trade-offs, performance notes and my AI prompt log under `docs/`. The commit history shows how the solution evolved. My main assumptions were a single USD base currency with a per-country conversion rate and a single HR user role.
>
> I'm happy to walk through any decision.
>
> Thanks,
> Nitin Kumar
> +91 9014640626

**Before you send:** confirm the repo is public (open it in incognito), the live link logs in, the video plays without an account, and `docs/ai-prompts.md` is accurate. Reply **on the original thread** (don't start a new email), and send it yourself.

**Commit message:** none (the email is not part of the repo).

---

## Final checklist

- [ ] Prompt log (`docs/ai-prompts.md`) is complete and truthful
- [ ] Commits are small, with meaningful messages (about 13+ commits)
- [ ] `bin/rails test` and `npm test` are green; the Rails suite runs in a few seconds
- [ ] Live URL works, seeded with 10,000 employees
- [ ] Demo video link works in incognito
- [ ] README has the live link, video link, login, and real AI-correction examples
- [ ] Repo is public
- [ ] Reply sent on the original thread
