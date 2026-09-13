# Self-test guide — Website + Medzoos + DoctorApp

Use this to test the system yourself. Check boxes as you go.

**What you will run**

| Surface | Folder | How to start | Open |
|--------|--------|--------------|------|
| Backend | `medzoos-backend` | your usual start (port **5001**) | `http://localhost:5001/api/health` |
| Patient **website** | `Frontend` | `cd Frontend && npm run dev` | `http://localhost:3000` |
| Patient **app** | `Medzoos` | `cd Medzoos && npm start` then `npm run android` | Phone/emulator |
| Doctor **app** | `DoctorApp` | `cd DoctorApp && npm start` then `npm run android` | Phone/emulator (Metro **8084**) |

For both Android apps (USB):

```bash
adb reverse tcp:5001 tcp:5001
adb reverse tcp:8081 tcp:8081   # Medzoos Metro
adb reverse tcp:8084 tcp:8084   # DoctorApp Metro
```

**Accounts**

| Role | Login |
|------|--------|
| Doctor (DoctorApp) | `doctor@medzoos.com` / `password123` (or `doctor123@gmail.com` / `password123`) |
| Patient — **website** phone OTP | Phone `03361400372` or `+923361400372` → OTP **`123456`** |
| Patient — **website** phone OTP (2nd) | Phone `03361400373` or `+923361400373` → OTP **`123456`** |
| Patient — **Medzoos app** phone | Same phones → OTP **`123456`** (dev / local) |
| Patient — email | Register once on website or app (email + password), then reuse |

**Tip:** Use the same patient for website and Medzoos when you want to see the same appointments. Doctor always uses **DoctorApp**.

---

## Part A — Start everything (5 min)

- [ ] Backend health OK: open `http://localhost:5001/api/health`
- [ ] Website: `http://localhost:3000` loads
- [ ] Medzoos app opens and can reach API (login works)
- [ ] DoctorApp opens → login with demo doctor
- [ ] DoctorApp → **Profile → Schedule**: at least one day this week has slots

---

## Part B — Full doctor visit (do this first)

Do this once with **website as patient**, then again with **Medzoos as patient** (or pick one device if time is short).

### B1 · Online visit (video)

**Patient (Website `localhost:3000` or Medzoos)**

1. [ ] Sign in
2. [ ] Open **Doctors** → pick a doctor (same doctor you logged into in DoctorApp)
3. [ ] Book **Online** → choose date/slot → patient details → payment (Stripe **or** pay later / pay at clinic if shown) → share medical history (optional) → confirm
4. [ ] Open **Account → Appointments** (website) or **You → Appointments** (Medzoos) — status **Pending**

**Doctor (DoctorApp)**

5. [ ] **Appointments** → open the new visit → **Confirm Visit**

**Patient**

6. [ ] Refresh appointments → status **Confirmed**
7. [ ] Open visit → see timeline / pre-visit tips
8. [ ] Open **Chat** → send a message

**Doctor**

9. [ ] Open same appointment → **Chat** → reply (patient should see it)
10. [ ] Open **Video** / **Consultation** → start visit
11. [ ] Add notes / diagnosis → add **prescription** → set **follow-up** (e.g. 7 days) → **Complete**

**Patient**

12. [ ] Visit is **Completed**
13. [ ] See visit summary + prescription
14. [ ] See **Follow-up recommended** → **Book follow-up**
15. [ ] Leave a **review** (if shown)

### B2 · In-clinic visit

**Patient**

1. [ ] Book **In-person** at a clinic/location → **Pay at clinic** → share records → confirm

**Doctor**

2. [ ] **Confirm** → **Check In** → **Start Visit**
3. [ ] If unpaid: **Mark paid**
4. [ ] Complete + prescription + follow-up

**Patient**

5. [ ] Upload a **visit document** before/during prep (photo of lab/Rx)
6. [ ] After complete: summary + Rx + follow-up card look correct
7. [ ] Timeline shows: booked → confirmed → checked in → completed

### B3 · Edge cases (quick)

- [ ] Patient **reschedules** a pending/confirmed visit → new time shows on DoctorApp
- [ ] Patient **cancels** a visit → doctor sees cancelled
- [ ] Doctor marks **No-show** on another pending visit
- [ ] Doctor **Remind** on a follow-up; **Cancel** a follow-up → patient stop seeing book CTA

---

## Part C — Website-only patient flows

Open `http://localhost:3000`

- [ ] Home / find doctors / filters work
- [ ] Doctor profile → book flow (steps above)
- [ ] **Account → Appointments**: list, open detail, timeline, reschedule, cancel
- [ ] Appointments: visit documents upload, follow-up book modal
- [ ] Lab tests browse → book (if you use labs)
- [ ] Medicines / cart / checkout (COD or Stripe test card)
- [ ] Profile / addresses update
- [ ] Sign out → sign in again

---

## Part D — Medzoos app-only patient flows

- [ ] Onboarding (first install) → register / login
- [ ] Home loads (doctors, labs, hospitals)
- [ ] Book doctor (same as Part B)
- [ ] You → Appointments + detail (timeline, docs, chat, video join)
- [ ] Home **Follow-up recommended** card (after doctor sets follow-up)
- [ ] Health → medical records upload
- [ ] Health → family vault (create / add member) — optional
- [ ] Medicines or Pharmacies → cart → checkout
- [ ] Drawer → Prescriptions upload order
- [ ] Copilot chat opens (optional)
- [ ] Community feed opens (optional; may show mock if empty)
- [ ] Notifications / Settings / Sign out

---

## Part E — DoctorApp-only flows

- [ ] Login with demo account; logout; login again
- [ ] **Home** dashboard shows stats / today’s list
- [ ] **Appointments** filters: All / Today / Upcoming / Completed / Cancelled
- [ ] **Consult** tab shows active visits
- [ ] **Patients** → open a patient → history / schedule follow-up
- [ ] **Profile → Schedule** edit slots + save
- [ ] **Follow-ups** list: Remind / Cancel
- [ ] **Notifications** open / mark read
- [ ] Create prescription from appointment / Prescription screen
- [ ] Cancel visit with reason; Mark no-show

---

## Part F — Pass / fail notes

Write bugs here while testing:

| # | Surface (Web / Medzoos / DoctorApp) | Step | What happened | Expected |
|---|-------------------------------------|------|---------------|----------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## Suggested order for one sitting (~45–90 min)

1. Part A — setup  
2. Part B1 — one full **online** visit (website **or** Medzoos + DoctorApp)  
3. Part B2 — one **in-clinic** visit  
4. Part B3 — cancel / reschedule  
5. Skim Parts C / D / E for anything you care about  

If something fails, note it in Part F and continue — don’t stop the whole run.
