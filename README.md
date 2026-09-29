# menu-demo

A fictional Makassar QR menu and one-page site sample. **DEMO only**: all business details, prices, contact actions, hours, addresses, menu details and tags are made up. No customer or client data is included. Food photographs were AI-generated for illustration and do not depict actual products. The WhatsApp action opens a prefilled draft only; choose and verify the recipient, items and quantities before sending. The demo has no business WhatsApp number configured.

The menu is a responsive, photo-led sample with ID/EN, light/dark themes, scroll-snap categories, search, dish detail sheets, quantity steppers and a floating WhatsApp order draft. The small screens use local WebP food images; menu-card photos lazy-load. The source JPEG illustrations are kept as higher-quality editable masters. Each client menu starts from `menu.json`.

Menu edits: update `menu.json`, then run `node build.mjs` before publishing. The builder embeds that JSON plus local CSS and JavaScript in `index.html` to reduce render-blocking network requests; `index.template.html`, `design-tokens.css`, `style.css`, and `app.js` are its editable UI sources. For a real client, replace and verify all details, tags and photos with the owner's approval, replace the WhatsApp number, and test every link. GitHub Pages hosting is free on this public demo while the platform remains available. A custom domain, paid storage, bandwidth/support, migration and uptime guarantee are excluded. Proposed edits are handled within 24 hours after complete approved material; this is a response target, not uptime/support SLA.

Both samples use a shared `design-tokens.css` color system. The clinic page is fictional, shows no fabricated reviews, and uses illustrative Unsplash photos (see `CREDITS.md`).
