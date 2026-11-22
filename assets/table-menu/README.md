# Tre Canne table menu

Public address: `https://waxbrew.com/tre-canne/menu/`.
Printed QR target: `https://waxbrew.com/tre-canne/menu/?from=table`.
Keep this route stable when updating the menu so printed codes remain valid.

The user confirmed that the menu is for Tre Canne. The existing `/menu` page is Textura's menu and is kept separately. The initial items and breakfast offer came from the supplied prototype dated 2026-11-05. Matched dine-in prices were reconciled against `articles-export-1795354288.csv` (Tre Canne) on 2026-11-22; Glovo, promo and breakfast-component prices are excluded. The earlier Textura export is not a source for this menu. No raw POS exports or unrelated archive files were copied into the repository.

The Tre Canne export contains no archive flag and all 188 rows have `SELLABLE=true`; do not treat that field as confirmation of current availability. Preserve the curated menu and add only requested dishes. Meat crepes (article 219, EUR 4.50) and lentil soup (221, EUR 4.00) are included. The owner confirmed on 2026-11-22 that `Porridge` (83) is the existing milk porridge with pear, and `Rice Porridge` (220) is rice porridge with raspberries; both are EUR 4.00 and included. The current menu selection is retained; no specific archived items were identified. The POS `Cheesecake` (99, EUR 6.00) does not specify a flavour; the existing pistachio cheesecake and breakfast set remain unchanged.

## Updating the menu

Edit `assets/table-menu/menu.json` and run `python3 scripts/build-table-menu.py` from the repository. The renderer uses Python's standard library. Repeated items share a single price entry, so the Popular and Food sections stay consistent. Commit both the JSON and rendered `tre-canne/menu/index.html`.

English content is present in the HTML without JavaScript. The existing language preference is reused; EN/SR/RU buttons translate the full menu. A supported `?lang=en|sr|ru` query takes precedence over the saved preference. Prices do not change when switching languages.

## Printing

`output/pdf/waxbrew-tre-canne-menu-a6.pdf`: one card, 105 × 148 mm.
`output/pdf/waxbrew-tre-canne-menu-a4.pdf`: four A6 cards on A4 with cutting guides.
Print at **100% / actual size**, with scaling disabled. The QR is 55 mm square including a four-module white quiet zone. SVG and PNG QR originals are in this directory. All four codes on the rendered A4 and the rendered A6 were decoded and matched the target URL.

The QR opens the production URL. Publish the page before putting cards on tables.

`python3 scripts/build-menu-qr.py` regenerates the QR files and PDFs (ReportLab and Pillow required). The card uses Arial fonts from macOS; adjust the font paths if building on a different host.

## Analytics

The existing GA4 property is reused. `table_menu_open` distinguishes `entry_source: table_qr` from `website`; additional events track category selections, language changes and breakfast/location links. Only the known `from=table` marker is used; arbitrary query text is never sent to analytics.
