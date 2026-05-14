# Troubleshooting

A field guide to bugs we've actually hit in production, what they looked like,
and what was actually wrong. Each entry is symptom → diagnosis → fix → where it
lives in the code. Add entries when you debug something that took more than 20
minutes to figure out — future-you will thank you.

---

## 1. AI-generated itinerary silently returns a template instead of AI output

**Symptom**
- User clicks **Suggest Itinerary**.
- The page populates in ~2 seconds with what looks like a generic / templated
  itinerary, not a custom one for their dates and destination.
- No error toast or banner.
- Network panel shows the `generate-itinerary` request returned in ~23 ms — far
  too fast for an Anthropic round-trip (real calls take 3–30 seconds).

**Diagnosis path**
1. The 23 ms response time means the function bailed before reaching Anthropic.
   That's either a fast-exit in our own code (`!ANTHROPIC_API_KEY` → 503,
   `!user` → 401) or a platform-level rejection before the function ran.
2. Direct `curl` with just the anon key returns `{"message":"Invalid
   credentials","code":"INVALID_CREDENTIALS"}` HTTP 401 — that's Supabase's
   platform-level JWT check, not our function code (our 401 returns
   `{"error":"Unauthorized"}`).
3. For a signed-in user, the Supabase client should attach their JWT
   automatically — so the platform check should pass. But it wasn't.
4. The `supabase.functions.invoke()` call resolves the access token via the
   `fetchWithAuth` wrapper, which calls `auth.getSession()` and falls back to
   the anon key if the session is null:
   `accessToken = (await getAccessToken()) ?? supabaseKey`.

**Root cause**
`lock: false` was set on the Supabase auth client in `src/lib/supabase.js`.
This disabled the Web Locks API serialization that prevents concurrent
`getSession()` calls from racing. When `autoRefreshToken: true` fired a
background refresh at the same moment the user clicked Suggest Itinerary,
`getSession()` returned `null` mid-refresh. The wrapper then sent the **anon
key** as the Bearer token. Supabase's platform JWT verifier rejected it in
~23 ms with `{message: "Invalid credentials"}`.

The error was silent because `generateItinerary()` in `src/lib/itinerary.js`
caught the failure with just `console.warn(...)` and silently returned the
built-in template. The UI had no idea AI had failed.

**Fix**
- `src/lib/supabase.js` — remove `lock: false`. Lets the default Web Locks
  implementation serialize concurrent `getSession()` calls. Commit `60e7874`.
- `src/lib/itinerary.js` — `generateItinerary()` now returns an `aiError`
  field alongside the fallback days so callers can surface it. Commit `14d47d0`.
- `src/pages/Itinerary.jsx` — added an amber `genWarning` banner that shows
  the actual error text when AI falls back to a template, plus a red `genError`
  banner for hard failures. Both render at the top of `page-body` where they're
  visible. Commits `14d47d0`, `38d8673`, `8fccc37`, `a731f34`.

**Prevention**
Never pass `lock: false` to `createClient`. The `lock` option expects a custom
lock function, not a boolean — `false` is parsed as "no lock function provided"
which actually falls through to defaults in some versions but causes races in
others. Just omit it.

---

## 2. Edge Function returns 200 OK with `{message: ...}` body

**Symptom**
- Amber banner: `AI unavailable — showing a template itinerary instead.
  (Invalid response: keys=[message])`.
- Function call succeeds (2xx) but the SDK returns a body that has only a
  `message` field, no `days`/`skeleton`/`items`.

**Diagnosis path**
1. `FunctionsClient.invoke()` only treats non-2xx as errors. A 2xx with a
   weird body slips past the `if (error)` check entirely and lands in `data`.
2. None of our edge function code returns `{message: ...}` — every return path
   uses `{error: ...}` or `{days/skeleton/items/ok: ...}`. So it has to come
   from a layer outside our function.
3. Most likely source: Supabase's newer platform JWT verification middleware
   (rolled out alongside the asymmetric ES256 signing keys). For some
   misconfigurations it returns `200 OK` with `{message: ..., code: ...}`
   instead of the older `401`.

**Root cause**
Edge function has "Enforce JWT Verification" enabled in the Supabase dashboard,
**and** the platform middleware's new error response shape leaks through the
SDK's HTTP-error check.

**Fix**
1. **Dashboard:** Edge Functions → `generate-itinerary` → toggle "Verify JWT
   with legacy secret" → **OFF**. Our `requireUser()` in
   `supabase/functions/_shared/cors.ts` already validates tokens by hitting
   `/auth/v1/user`, so disabling the platform layer doesn't reduce security —
   it removes a redundant check that's malfunctioning.
2. **Code defense:** `platformErrorIfAny()` in `src/lib/itinerary.js` detects
   responses that have only `message`/`code` (no expected payload fields) and
   converts them to a proper thrown error so they surface in the banner with
   the actual platform message. Commit `a731f34`.

---

## 3. User bounced back to sign-in after sign-up + first navigation

**Symptom**
- User signs up successfully and lands on the dashboard.
- They open a trip, click any tab (e.g. **Plan** / Itinerary), and the entire
  app immediately renders the `LandingPage` (sign-in screen).
- No error, no console output unless you're watching auth events.

**Diagnosis path**
1. `App.jsx` renders `<LandingPage />` whenever `!user`. So `user` became `null`
   somewhere between the click and the next render.
2. `AuthContext` was naively running `setUser(session?.user ?? null)` on every
   `onAuthStateChange` event.
3. Supabase fires `session: null` *transiently* during:
   - `TOKEN_REFRESHED` races where the new session hasn't been written back
     yet (especially common right after sign-up, before the refresh token
     fully settles in the auth DB).
   - Some PWA / bfcache lifecycle events.
   - Brief windows during auto-refresh.

**Root cause**
Each transient null-session event was flipping `user → null` for a moment,
which made React unmount the entire signed-in tree (replacing it with
`<LandingPage />`).

**Fix**
`src/context/AuthContext.jsx` — only clear `user` on **real** sign-out signals:
- `SIGNED_OUT` event (explicit log-out)
- `INITIAL_SESSION` event with no session (confirmed unauthenticated)

All other events with `session=null` preserve the existing `user` state.
Commit `183c5ba`.

---

## 4. Supabase Data API GRANT cutover (May 30 / Oct 30 2026)

**Symptom (future, if unhandled)**
- After Oct 30, 2026: every `supabase.from('trips').select()` and other
  Data API calls fail with PostgREST `PGRST106` "relation does not exist
  in API" or HTTP 401/403.
- App boots, auth works, but trips never load.

**Root cause**
Supabase policy change: tables in the `public` schema are no longer
auto-exposed to the Data API (PostgREST, GraphQL, supabase-js). Each table
needs an explicit `GRANT` for the role that should be able to query it. New
projects: enforced May 30. Existing projects: enforced Oct 30.

**Fix**
Run the GRANT block at the bottom of `supabase/schema.sql` (the "2026-05-14
DATA API GRANT MIGRATION" section) once via the Supabase SQL Editor before
Oct 30. Idempotent. Commit `1908349`.

**Prevention**
Every new table that needs Data API access ships with a matching `grant
select, insert, update, delete on public.<table> to authenticated;` line in
the same migration that creates it. RLS still enforces per-row authz; grants
only control table-level visibility.

---

## 5. `position: fixed` on the mobile trip workspace had `height: 0`

**Symptom**
- On mobile, the trip detail card opens but is invisible / collapses to zero
  height.
- `getBoundingClientRect()` on the `.card` element returned
  `{x: 22.68, height: 0}`.

**Root cause**
The `<TripDetail>` component was wrapped in a div with
`style={{ animation: 'dashScaleIn 0.35s ease' }}`. The animation applied
`transform: scale(0.95)` on the first frame. CSS transforms create a new
**containing block** for absolutely / fixed-positioned descendants — so
`position: fixed` inside the card was now positioned relative to the scaled
wrapper (which had no laid-out height yet) instead of the viewport.

**Fix**
`src/pages/Dashboard.jsx` — removed the animated wrapper. The card mounts
without animation, which is fine because the dashboard list animates instead.

**Prevention**
Don't wrap fixed-positioned content in elements that get a `transform` value
(including `scale`, `translate`, `rotate`). If you need the animation, animate
something *inside* the fixed element, not an ancestor of it.

---

## 6. React hooks order violation in `App.jsx`

**Symptom**
- React error: "Rendered more hooks than during the previous render" /
  "Rules of Hooks" warning.
- Some users couldn't sign in past the first frame.

**Root cause**
`useTrips()` was being called *after* an early conditional return:

```jsx
const { setActiveTripId, trips, tripsLoaded, joinTripViaInvite } = useTrips();
// ...
if (!user) return <LandingPage />;
const { activeTrip } = useTrips();  // ← second hook call after conditional return
```

When `!user`, the second `useTrips()` never ran, so the hook count differed
across renders.

**Fix**
Merged `activeTrip` into the original destructure at the top of the function.
Single `useTrips()` call before any conditional returns.

**Prevention**
All hook calls must happen unconditionally at the top of a component, in the
same order every render. ESLint's `react-hooks/rules-of-hooks` catches this —
keep it enabled.

---

## 7. Console noise: "A listener indicated an asynchronous response by returning true, but the message channel closed"

**Symptom**
- The exact error string appears in the browser console, sometimes repeatedly.
- Comes through as `Uncaught (in promise) Error`.

**Root cause**
**Not our code.** This comes from browser extensions (Chrome and some
Firefox) that register `chrome.runtime.onMessage` listeners and return `true`
to indicate they'll respond asynchronously via `sendResponse`. If the message
channel closes before `sendResponse` is called — usually because of a tab
navigation, extension reload, or a listener that forgets to send a response —
the runtime throws this into the page's console.

Common culprits: LastPass / 1Password / Bitwarden, Honey / Capital One
Shopping, Grammarly, React DevTools (older versions), Redux DevTools, heavy
ad blockers, "Save to Notion/Pocket/Raindrop" type extensions.

**How to verify it's an extension**
Open the site in an Incognito window (Ctrl+Shift+N) — Chrome disables
extensions there by default. If the error disappears, that's confirmation.
Disable extensions one at a time in `chrome://extensions/` to identify which.

**Fix**
None possible on the app side. You can't catch the error (it's not from our
bundle), you can't filter it from the console, and the offending extension
will produce it on every site the user visits. It's pure noise — ignore it.

You can confirm the string isn't from our code by grepping `dist/` after a
build: it won't be there.

---

## Quick diagnostic playbook

When something breaks and you don't know where to start:

1. **Open the amber/red banner on the affected page** if there is one — the
   `Itinerary` page's banner now includes the actual error text and platform
   message (commit `8fccc37`, `a731f34`).
2. **Network panel** — look at the request's status, response time, and full
   response body. A sub-100 ms response on an AI call means it never reached
   the model.
3. **Supabase dashboard** → Edge Functions → `<function>` → **Logs** tab.
   Click the failing action, then refresh logs. You'll see:
   - No new lines → request never reached the function (CORS, JWT, or routing)
   - Stack trace → bug in function code
   - 200 with expected body → something downstream is interfering
4. **Check auth events** in the browser console:
   ```js
   supabase.auth.onAuthStateChange((e, s) => console.log('[auth]', e, !!s))
   ```
   Paste in DevTools before reproducing — tells you exactly which event fired
   `session=null` if you're getting bounced to sign-in.
5. **Reproduce in Incognito** to rule out browser extensions.
