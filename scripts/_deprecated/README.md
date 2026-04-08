# Deprecated scripts

Scripts in this folder are **no longer run**. They are kept in git history for reference only. Do not resurrect them without reading the rationale below.

## `fetch-hotel-images.js` — deprecated 2026-04-09

**What it did.** Fetched each hotel's website, extracted the `og:image` (or `twitter:image`, or the first large `<img>`) via regex, downloaded it, resized to 800×500, saved to `public/images/hotels/{slug}.jpg`. No attribution, no license check, no consent.

**Why it was removed.** Scraping hero images from third-party commercial websites for use on a competing commercial platform is copyright infringement. It is not transformative use, it is not news reporting, and it is not editorial illustration. EU copyright law (CDSMD 2019) has no fair-use doctrine that would cover this. UK copyright has no general fair-use doctrine at all. The risk was takedown notices at minimum, a lawsuit at worst — and the risk compounded with every new hotel added. Running this script was the single largest legal exposure in the repo.

**What replaces it.** A four-tier image sourcing strategy, to be built in Phase 2.3:

1. **Wikimedia Commons API** (estimated 40–60% coverage of heritage properties). CC-licensed photos with attribution metadata. Free, clean, scalable. See `scripts/fetch-from-wikimedia.ts` (to be written).
2. **Unsplash / Pexels** for category and country hero imagery — commercial use permitted.
3. **Verified Profile subscribers license their own photos** as part of the Phase 3 hotel onboarding form, under a non-exclusive royalty-free display licence.
4. **Direct email request** to hotels for one press-kit image with documented permission — slow but legally airtight.

Every image shown on the site must have a corresponding row in the `hotel_images` table (to be created in Phase 2) with fields for `source`, `source_url`, `attribution`, and `license`. Every image rendered in the UI must show attribution somewhere on the page.

**Legal strategy context.** Copyright attaches automatically to the hotels' original photography — they do not need to register anything to have rights. The fact that the image is publicly accessible on their website does not grant a licence to copy it. The original script's User-Agent even announced itself as `HeritasianBot/1.0`, which would have made the infringement trivially provable in any future dispute. Deleting the script is not enough — the images it already downloaded need to be audited and replaced during the Phase 2 image migration.

**If you are thinking of re-enabling this.** Don't. Talk to the editor first. The alternative strategy is cheaper, cleaner, and builds relationships with the hotels you eventually want to sell Verified Profiles to.

— 2026-04-09
