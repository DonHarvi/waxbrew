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

`view_breakfast_offer` records offer status, `view_breakfast_coupon` records the first coupon reveal on the page. Campaign events carry the validated creator slug and language. Route, internal directions and loyalty clicks are also tracked. Coupon opens and screenshots do not establish redemption; redeemed gifts are counted in the POS as described in the brief. Browser screenshots themselves cannot be detected.

This is a static, reusable creator coupon, not a unique single-use voucher. The barista checks the date and one-dessert-per-guest condition. The browser prevents new reveals after expiry using Montenegro time; it cannot revoke saved screenshots or independently verify the device clock.

The browser fetches configuration without caching, uses text content for names/codes, and rechecks expiry on reveal and return to the page. No recipient information is collected. The source export and full blogger brief are not published.

## Maintenance

### Advertising audiences

Shared `assets/analytics.js` loads `assets/marketing.js`. Meta dataset/pixel: `2044160039594691`; GA4: `G-PMMNXCF8LX`.

Advertising consent defaults to denied. The visitor can allow or decline advertising cookies in English, Serbian or Russian and change their choice using the footer button. The choice expires after 180 days. Meta is loaded only after permission; Google `ad_storage`, `ad_user_data` and `ad_personalization` follow the same choice. Existing Google analytics collection is unchanged. This is advertising consent, not a replacement of the site's overall privacy policy. No noscript pixel bypass is installed.

Meta events after consent:

| Event | Trigger | Parameters |
| --- | --- | --- |
| `PageView` | Current page, once | Standard Meta page data |
| `BloggerVisit` | Offer page with a configured, active blogger | `campaign=blogeri`, `blogger_id`, `language`, `location_name=tre_canne` |
| `BreakfastCouponOpen` | First coupon reveal | Same parameters plus `coupon_code` |

The current offer-page view is sent if consent is granted after the page opens. Earlier clicks are not replayed. Events are deduplicated per page; `preview=1` never loads Meta. Unknown/inactive bloggers do not generate these custom events. Opening a coupon is not a purchase or a redemption.

Account-side setup is separate and has not been performed by this code change:

- Meta: create website Custom Audiences on this dataset for `BloggerVisit` (90 days) and `BreakfastCouponOpen` (30 days). Optional per-creator audiences filter `blogger_id`.
- GA4: create audiences for `view_breakfast_offer` (90 days) and `view_breakfast_coupon` (30 days), with same-event conditions `campaign_name=blogeri` and `blogger_id` matching one of `detaljzivota`, `dragana_cvijet_iz_kamena`, `___anamarkovic___`. Register event-scoped `blogger_id` as a custom dimension for creator reporting/filtering; `coupon_code` is optional.
- Verify the GA4 property is linked to the intended Google Ads account with personalised advertising enabled, then verify audience export. The site's consent signals do not establish this account link.
- In Events Manager and GA4, verify real incoming visits. Browser checks establish correct requests, not account-side audience creation or eligibility for delivery.

Audience collection depends on consent and browser/ad-blocking settings. Audiences must meet the advertising platform's eligibility requirements before campaigns can serve.

### Editing the offer

Edit the shared breakfast pages first, then run `python3 scripts/build-breakfast-offer.py` to regenerate the three campaign variants. Campaign styles and behavior live in `offer.css` and `offer.js`. Keep the deadline in the JSON and all translated coupon terms consistent. The shared hero photo `combo-syrniki.webp` was extracted from the owner's `waxbrew-breakfast-combo-a6-cream-hero.pdf`, page 1, and converted to WebP without changing the composition.
