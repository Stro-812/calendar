# COROS API Application — S10.run

> Submit via the COROS Help Center form: "Submit an API Application"
> (https://support.coros.com/hc/en-us/articles/17085887816340-Submit-an-API-Application)

## Application fields

**Platform / Company name:** S10.run

**Website:** https://s10.run (English: https://eng.s10.run)

**Product description:**
S10.run is an online running-training platform and coach marketplace with
approximately **50,000 athletes** and **~180 professional running coaches**
(marathon, track & field, trail, ultra). The platform provides AI-generated
training plans, athlete–coach communication (via a Telegram bot), long-term
planning, and detailed performance analytics. It also runs weekly online
"Running Challenges," for which it automatically generates official finish
protocols. An iOS app is available on the App Store.

**Current integration status:**
We currently import athlete workout tracks via the **Strava API**. We want to
add a **direct COROS integration** so athletes who train with COROS watches can
sync their data to S10.run natively, without relying on a third-party bridge.

**Why we need COROS API access:**
We request read access to authorized users' training data to:
1. Import completed workouts (split-by-split data, pace, heart rate, and `.fit`
   files with full GPS tracks) for coach review and analytics.
2. Verify results for our weekly Running Challenges (automatic finish protocols).
3. Feed real training load back into our AI plan adjustment.

All data is accessed only after explicit user authorization via OAuth 2.0, used
solely to provide the training service to that user, and handled in line with
GDPR / EU data-protection requirements.

**Requested access:** Read-only — workout list, workout details/splits, workout
notes/feedback, and `.fit` file download.

## OAuth 2.0 authorization

- **Grant type:** Authorization Code
- **Redirect URI:** `https://s10.run/coros`

## Expected volume

- Total athletes on the platform: **~50,000**
- Estimated API sync volume: **~300 requests/day**

**Rate-limit request:** Our understanding is that `.fit` file downloads are
capped at ~50 files/day. Given our platform scale (~50,000 athletes, ~300
syncs/day), we would like to **confirm whether this limit is per-user or
per-application, and request an appropriate quota** for a platform-level
integration. We cache all downloaded files server-side and sync incrementally
to keep request volume to the minimum necessary.

## Technical contact

- **Name:** [технический контакт]
- **Email:** mail@stro.run

## Data retention & security

- OAuth access/refresh tokens stored encrypted.
- Downloaded workout files cached on our servers to respect API rate limits and
  avoid re-fetching.
- Users can disconnect COROS at any time; disconnecting revokes the token and
  stops all further data access.
