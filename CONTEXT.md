# Manna: Daily Word — Current Context

Last updated: 2026-08-28

## Status: Build debugging in progress

## Completed

- [x] Expo SDK 54 project created fresh
- [x] All packages installed (expo-router, supabase, fonts, SVG, haptics, expo-constants, expo-linking)
- [x] GitHub repo: `gbrunomobile-del/scripture-path` — force pushed clean version
- [x] Supabase project: `yilfglqkcomxwovcwsbw` (af-south-1) — migration applied
- [x] EAS project linked: `36e64c67-be88-4250-b108-bcd2318475c8`
- [x] Apple credentials: cert `75441E101CCB135D6B3F440AC2D07340`, profile `T34A6YU8QH`
- [x] iPhone registered: UDID `00008150-001A25AC1446401C`
- [x] App Store Connect: Manna Daily Word, App ID `6805827641`
- [x] All screen files written: auth, tabs, session, complete, reading, book
- [x] `.npmrc` with `legacy-peer-deps=true`
- [x] `index.ts` points to `expo-router/entry`
- [x] `metro.config.js` added for path resolution
- [x] `privacy.html` written and pushed to GitHub
- [x] Living Stone iOS build SUCCEEDED and submitted to TestFlight ✅

## Active issue

EAS build failing at bundling stage:
- Error: `Unable to resolve module ../lib/supabase from app/session/[day].tsx`
- Files exist locally and in git — path resolution issue
- metro.config.js added to fix — awaiting build result

## Build history (most recent first)

- `02906113` — queued (metro.config fix)
- `d6e437b7` — queued (previous attempt)
- `b8ac08df` — failed (expo-linking missing)
- `86987c57` — failed (lockfile out of sync)
- `de353de3` — failed (expo-linking missing)
- `e0585f5a` — ✅ SUCCEEDED but showed blank template screen
- `ce99d402` — failed (SDK mismatch)

## Key credentials

| Item | Value |
|---|---|
| Apple ID | gbruno.mobile@gmail.com |
| Team ID | 2S9MC2X2L6 |
| Bundle ID | com.scripturepath.app |
| App Store Connect App ID | 6805827641 |
| EAS Project ID | 36e64c67-be88-4250-b108-bcd2318475c8 |
| Supabase URL | https://yilfglqkcomxwovcwsbw.supabase.co |
| iPhone UDID | 00008150-001A25AC1446401C |
| Provisioning Profile | T34A6YU8QH (Ad Hoc, active until Aug 27 2027) |
| Distribution Cert | 75441E101CCB135D6B3F440AC2D07340 |

## Next steps after build succeeds

1. Open build URL in Safari on iPhone → tap Install → Trust
2. Test all screens on device
3. Fill in App Store Connect listing (description, keywords, privacy URL, age rating)
4. Run production build: `eas build --platform ios --profile production`
5. Submit: `eas submit --platform ios`
