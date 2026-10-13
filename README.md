# Book Cover Calculator

A visual calculator for planning the dimensions of a hardcover book cover. Enter the page-block and material measurements to see the cover-board, spine, gutter, fabric, and cover-board-boundaries dimensions update alongside a flat-layout diagram.

The calculator is also useful when making quilted or appliqué journals: the **Cover Board Boundaries** measurement gives the overall width and height of the cover area, which you can use as a reference when deciding how much batting to prepare.

## Use the calculator

1. Open `index.html` in a modern web browser.
2. Enter your measurements in the inputs at the top of the page. The example values are in millimetres.
3. Choose **mm** or **cm** to change the displayed units. The input values and calculated dimensions update together.
4. Use the live flat layout and cross-sectional diagram to check the arrangement and folds.

Keep `index.html`, `app.jsx`, `style.css`, and the diagram images together in the same folder. The page loads Tailwind CSS from its CDN, so an internet connection is needed for its utility styles.

## Measurements

### Inputs

- **Page Block — Width, Height, Thickness:** Dimensions of the book's page block.
- **Board Thick:** Thickness of one cover board.
- **Cover Margin:** Allowance added around the page block when sizing each cover board.
- **Fabric Margin:** Extra fabric left around the outside for wrapping and turning in the cover.

### Calculated dimensions

- **Cover Board:** Width and height of one cover board.
- **Spine (s):** Width of the spine area between the boards.
- **Gutter (g):** Fold allowance between a cover board and the spine.
- **Total Fabric:** Overall fabric-cut width and height, including the fabric margin.
- **Cover Board Boundaries:** Overall width across both boards, spine, and gutters, and the cover-board height. This excludes the fabric margin, making it a useful cover-area reference for estimating batting dimensions.

The flat layout illustrates how the page block, boards, spine, gutters, and fabric margins fit together. The formulas below describe the calculator's current assumptions; measurements are in millimetres internally and converted for display when centimetres are selected.

| Dimension | Formula |
| --- | --- |
| Cover board width | Page-block width − 0.5 × page-block thickness + cover margin |
| Cover board height | Page-block height + 2 × cover margin |
| Spine | Page-block thickness + 2 × board thickness |
| Gutter | 0.5 × page-block thickness + board thickness |
| Cover board boundaries (width) | 2 × cover board width + spine + 2 × gutter |
| Cover board boundaries (height) | Cover board height |
| Fabric width | Cover board boundaries (width) + 2 × fabric margin |
| Fabric height | Cover board height + 2 × fabric margin |

## Personal improvements

- Moved the inputs and measurements to the top so they are easy to find while working.
- Condensed the formula dimensions to make the calculation panel more compact.
- Added **Cover Board Boundaries** so the overall cover-area measurement is available as a reference for batting used in quilted or appliqué journals.
