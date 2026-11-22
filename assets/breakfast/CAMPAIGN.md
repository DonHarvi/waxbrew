# Blogger breakfast offer

Source: owner-provided `ТЗ для блогеров — WaxBrew Будва.pdf`, dated 2026-11-17, gift terms on page 3. The offer is one dessert per guest with a breakfast order at Tre Canne, valid through 2026-12-31 inclusive in Europe/Podgorica.

Separate campaign pages:

- Serbian: `/dorucak/poklon/`
- Russian: `/zavtrak/podarok/`
- English: `/all-day-breakfast/gift/`

The regular breakfast pages remain available. The brief's example pointed at `/dorucak/`; new campaign links must use `/dorucak/poklon/`. These temporary personalised offer pages use `noindex,follow` and are not added to the sitemap.

## Approved offer

On 2026-11-22 the owner confirmed one dessert of the guest's choice: brownie, lemon cake or cheesecake. Renata (`detaljzivota`), Dragana (`dragana_cvijet_iz_kamena`) and Ana (`___anamarkovic___`) are active in `blogger-campaign.json`. Codes are `WAXBREW-RENATA`, `WAXBREW-DRAGANA` and `WAXBREW-ANA`. Manuela (`mjfiiii`) is inactive pending the owner's confirmation of audience geography (Budva/coastal audience); do not activate her based only on the conditional approval. Publication of the site is separate from configuring these coupons.

Add approved entries in `bloggers`, keyed by the exact `utm_content` slug. Each entry has `name` (public creator name), `code` (approved POS code in the form `WAXBREW-…`, ASCII uppercase letters/digits/hyphens), and `active: true`. Slugs use lowercase ASCII letters, digits, underscore, hyphen or dot, up to 64 characters. Record POS redemptions against the same creator/code.

Link format: `/dorucak/poklon/?utm_source=instagram&utm_medium=stories&utm_campaign=blogeri&utm_content=APPROVED_SLUG`. Replace the placeholder with a configured lowercase slug. Language links preserve the validated attribution. Unknown or disabled creators and incomplete offer details never produce a real coupon.

Links to distribute only after publication:

- Renata: `https://waxbrew.com/dorucak/poklon/?utm_source=instagram&utm_medium=stories&utm_campaign=blogeri&utm_content=detaljzivota`
- Dragana: `https://waxbrew.com/dorucak/poklon/?utm_source=instagram&utm_medium=stories&utm_campaign=blogeri&utm_content=dragana_cvijet_iz_kamena`
- Ana: `https://waxbrew.com/dorucak/poklon/?utm_source=instagram&utm_medium=stories&utm_campaign=blogeri&utm_content=___anamarkovic___`

For layout review, append `?preview=1`. This shows `WAXBREW-DEMO` with a prominent non-redeemable label; campaign events are suppressed in preview. Normal GA page views are still handled by the shared site analytics. Do not distribute demo links as campaign links.

## Measurement and limitations

`view_breakfast_offer` records offer status, `view_breakfast_coupon` records the first coupon reveal on the page, and `copy_breakfast_coupon` records successful code copying. Campaign events carry the validated creator slug and language. Route, internal directions and loyalty clicks are also tracked. Coupon opens, copies and screenshots do not establish redemption; redeemed gifts are counted in the POS as described in the brief. Browser screenshots themselves cannot be detected.

This is a static, reusable creator coupon, not a unique single-use voucher. The barista checks the date and one-dessert-per-guest condition. The browser prevents new reveals after expiry using Montenegro time; it cannot revoke saved screenshots or independently verify the device clock.

The browser fetches configuration without caching, uses text content for names/codes, and rechecks expiry on reveal, copy and return to the page. No recipient information is collected. The source export and full blogger brief are not published.

## Maintenance

Edit the shared breakfast pages first, then run `python3 scripts/build-breakfast-offer.py` to regenerate the three campaign variants. Campaign styles and behavior live in `offer.css` and `offer.js`. Keep the deadline in the JSON and all translated coupon terms consistent. The shared hero photo `combo-syrniki.webp` was extracted from the owner's `waxbrew-breakfast-combo-a6-cream-hero.pdf`, page 1, and converted to WebP without changing the composition.
