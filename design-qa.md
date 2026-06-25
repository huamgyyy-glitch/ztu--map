# Design QA — 昭通古城奇妙游

## Evidence

- Source visual truth: `UI设计方案/第二轮-参考页仿制/首页-开本古城游览手册风.png`
- Inner-page sources: `UI设计方案/第三轮-五个内页桌面稿/*.png`
- Implementation screenshots: `qa-screenshots/home-desktop-final.png`, `home-mobile-final.png`, and five inner-page desktop captures
- Combined comparison: `qa-screenshots/home-comparison.jpg`
- Viewports: desktop 1440×900; mobile 390×844
- State: default homepage; route detail open; map marker popup open; food and architecture details open; cinema default and empty-player states

## Full-view comparison

- The implementation preserves the source’s dominant open-book silhouette, wooden desk surround, central fold, oversized brush title, five colored entrance cards, top utilities, hanging tag, camera/eave/lantern/food edge decorations, and paper-note corners.
- The implementation uses independent transparent assets and code-native controls rather than flattening the mockup into a background image.
- The five inner pages preserve the same physical-book system and the source mockups’ principal compositions and selected interaction states.

## Required fidelity surfaces

- Typography: brush-style display headings and serif body hierarchy match the intended character; responsive wrapping is controlled.
- Spacing/layout: first viewport, title zone, five-card rail, inner-page spread, and desktop/mobile gutters are stable.
- Colors/tokens: rice-paper cream, dark ink, orange, bean green, muted blue, red, and lavender are consistently mapped.
- Image quality/assets: original supplied PNG/JPG assets are used without stretching; no green, black, white, or checkerboard contamination is visible.
- Copy/content: required page titles, subtitles, entrance names, route nodes, food details, architecture details, and cinema empty-state copy are present.

## Findings

- No actionable P0/P1/P2 issues remain.
- [P3] The approved mockup contains more bespoke watercolor scenery around the hero than the implementation. The implementation intentionally uses the supplied real photos with soft masks to keep assets authentic and code-separable.
- [P3] The mobile layout uses a vertical entrance journal rather than compressing five cards into one row; this is an intentional responsive adaptation.

## Patches made

- Fixed map popup layering so all map markers remain clickable.
- Added real AMap loading and POI search when environment credentials are present.
- Removed mobile horizontal overflow caused by off-canvas desk and corner decorations.
- Added missing loading wait to automated homepage verification.

## Verification

- Production build: passed.
- Automated interaction checks: 9/9 passed.
- Mobile horizontal overflow: none at 390px.
- Homepage visual fidelity: meets the requested 80% threshold.

final result: passed
