const appState = {
    pageWidth: 150,
    pageHeight: 230,
    blockThickness: 20,
    boardThickness: 2.5,
    coverMargin: 3,
    fabricMargin: 20,
    displayUnit: 'mm',
};

const formatMeasurement = (valueInMillimeters) => {
    const value = appState.displayUnit === 'cm' ? valueInMillimeters / 10 : valueInMillimeters;
    return value.toFixed(appState.displayUnit === 'cm' ? 2 : 1);
};

const getCalculatedDimensions = (inputs) => {
    const pageW = inputs.pageWidth;
    const pageH = inputs.pageHeight;
    const blockT = inputs.blockThickness;
    const boardT = inputs.boardThickness;
    const coverMargin = inputs.coverMargin;
    const fabricMargin = inputs.fabricMargin;

    const boardW = pageW - 0.5 * blockT + coverMargin;
    const boardH = pageH + 2 * coverMargin;
    const spineW = blockT + 2 * boardT;
    const gutter = blockT / 2 + boardT;
    const boundaryW = 2 * boardW + spineW + 2 * gutter;
    const fabricW = 2 * boardW + spineW + 2 * gutter + 2 * fabricMargin;
    const fabricH = boardH + 2 * fabricMargin;

    return {
        pageW,
        pageH,
        blockT,
        boardW,
        boardH,
        boardT,
        spineW,
        gutter,
        boundaryW,
        fabricMargin,
        fabricW,
        fabricH,
        coverMargin,
    };
};

const renderInputField = (id, label, value, colorClass) => `
    <div class="flex items-center gap-3">
        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 ${colorClass}"></span>
        <label for="${id}" class="flex-shrink-0 w-32 text-sm font-medium text-slate-600">${label} (${appState.displayUnit})</label>
        <input
            type="number"
            id="${id}"
            name="${id}"
            value="${formatMeasurement(value)}"
            step="any"
            class="w-full p-2 border border-slate-200 rounded-md shadow-sm transition-all focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
        />
    </div>
`;

const renderFinalDimensions = (dims) => {
    const { boardW, boardH, spineW, gutter, boundaryW, fabricW, fabricH } = dims;
    const unit = appState.displayUnit;
    const unitButtons = ['mm', 'cm'].map((unitOption) => `
        <button
            type="button"
            data-unit="${unitOption}"
            aria-pressed="${unit === unitOption}"
            class="rounded-md px-3 py-1 text-sm font-medium ${unit === unitOption ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
        >${unitOption}</button>
    `).join('');

    return `
        <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
            <h2 class="text-lg font-semibold text-slate-700">Final Dimensions</h2>
            <div class="flex gap-1" role="group" aria-label="Measurement units">
                ${unitButtons}
            </div>
        </div>
        <div class="space-y-2 text-sm text-slate-700">
            <p><strong class="text-board-item">Cover Board:</strong> ${formatMeasurement(boardW)} × ${formatMeasurement(boardH)} ${unit}</p>
            <p><strong class="text-calculated-item">Spine (s):</strong> ${formatMeasurement(spineW)} ${unit}</p>
            <p><strong class="text-calculated-item">Gutter (g):</strong> ${formatMeasurement(gutter)} ${unit}</p>
            <hr class="my-2 border-slate-200" />
            <p class="font-semibold"><strong>Total Fabric:</strong> ${formatMeasurement(fabricW)} × ${formatMeasurement(fabricH)} ${unit}</p>
            <p class="font-semibold"><strong>Cover Board Boundaries:</strong> ${formatMeasurement(boundaryW)} × ${formatMeasurement(boardH)} ${unit}</p>
        </div>
    `;
};

const renderKeyFormulas = (dims) => {
    const { pageW, blockT, coverMargin, boardW, boardT, spineW, gutter, fabricMargin, fabricW } = dims;
    const unit = appState.displayUnit;

    return `
        <div class="bg-slate-50 p-1.5 rounded">
            <strong class="text-board-item">Board Width:</strong>
            ${formatMeasurement(pageW)} - 0.5×${formatMeasurement(blockT)} + ${formatMeasurement(coverMargin)} = <strong>${formatMeasurement(boardW)} ${unit}</strong>
        </div>
        <div class="bg-slate-50 p-1.5 rounded">
            <strong class="text-calculated-item">Spine:</strong>
            ${formatMeasurement(blockT)} + 2×${formatMeasurement(boardT)} = <strong>${formatMeasurement(spineW)} ${unit}</strong>
        </div>
        <div class="bg-slate-50 p-1.5 rounded">
            <strong class="text-calculated-item">Gutter:</strong>
            ${formatMeasurement(blockT)} / 2 + ${formatMeasurement(boardT)} = <strong>${formatMeasurement(gutter)} ${unit}</strong>
        </div>
        <div class="bg-slate-50 p-1.5 rounded">
            <strong>Fabric Width:</strong>
            2×${formatMeasurement(boardW)} + ${formatMeasurement(spineW)} + 2×${formatMeasurement(gutter)} + 2×${formatMeasurement(fabricMargin)} = <strong>${formatMeasurement(fabricW)} ${unit}</strong>
        </div>
    `;
};

const updateCalculatedViews = () => {
    const dims = getCalculatedDimensions(appState);
    const finalDimensions = document.getElementById('final-dimensions');
    const keyFormulas = document.getElementById('key-formulas');
    const flatLayout = document.getElementById('flat-layout');

    if (finalDimensions) {
        finalDimensions.innerHTML = renderFinalDimensions(dims);
    }
    if (keyFormulas) {
        keyFormulas.innerHTML = renderKeyFormulas(dims);
    }
    if (flatLayout) {
        flatLayout.innerHTML = renderFlatLayoutSVG(dims);
    }
};

const renderFlatLayoutSVG = (dims) => {
    if (dims.fabricW <= 0 || dims.fabricH <= 0) {
        return '';
    }

    const cutOffset = 2 * dims.fabricMargin - dims.boardT * Math.sqrt(2);
    const leftBoardX = dims.fabricMargin;
    const rightBoardX = dims.fabricMargin + dims.boardW + dims.gutter + dims.spineW + dims.gutter;
    const spineX = dims.fabricMargin + dims.boardW + dims.gutter;
    const pageLeftX = dims.fabricMargin + dims.coverMargin;
    const pageRightX = rightBoardX;
    const pageTopY = dims.fabricMargin + dims.coverMargin;

    return `
        <svg viewBox="-60 -40 ${dims.fabricW + 120} ${dims.fabricH + 80}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    .label{font:500 12px 'Inter',sans-serif;text-anchor:middle;stroke:none}.label-sm{font:400 10px 'Inter',sans-serif;text-anchor:middle;stroke:none}
                </style>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z"/>
                </marker>
            </defs>

            <path d="M ${cutOffset} 0 L ${dims.fabricW - cutOffset} 0 L ${dims.fabricW} ${cutOffset} L ${dims.fabricW} ${dims.fabricH - cutOffset} L ${dims.fabricW - cutOffset} ${dims.fabricH} L ${cutOffset} ${dims.fabricH} L 0 ${dims.fabricH - cutOffset} L 0 ${cutOffset} Z" fill="#f4a9a8" class="stroke-page-block" stroke-width="1.5"/>

            <g class="stroke-board-item" stroke-width="1.5" fill="none" stroke="#22c55e">
                <rect x="${leftBoardX}" y="${dims.fabricMargin}" width="${dims.boardW}" height="${dims.boardH}" rx="2" ry="2"/>
                <rect x="${rightBoardX}" y="${dims.fabricMargin}" width="${dims.boardW}" height="${dims.boardH}" rx="2" ry="2"/>
            </g>

            <rect x="${spineX + dims.boardT}" y="${dims.fabricMargin + dims.coverMargin}" width="${dims.spineW - 2 * dims.boardT}" height="${dims.boardH - 2 * dims.coverMargin}" class="fill-calculated-light"/>
            <rect x="${spineX}" y="${dims.fabricMargin}" width="${dims.spineW}" height="${dims.boardH}" fill="none" stroke="#eab308" stroke-width="1.5"/>

            <rect x="${pageLeftX}" y="${pageTopY}" width="${dims.pageW - dims.blockT / 2}" height="${dims.pageH}" class="fill-page-light"/>
            <rect x="${pageRightX}" y="${pageTopY}" width="${dims.pageW - dims.blockT / 2}" height="${dims.pageH}" class="fill-page-light"/>

            <g class="stroke-page-block fill-page-block">
                <line x1="${pageLeftX + dims.pageW / 2}" y1="${pageTopY}" x2="${pageLeftX + dims.pageW / 2}" y2="${pageTopY + dims.pageH}" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
                <text x="${pageLeftX + dims.pageW / 2 + 10}" y="${pageTopY + dims.pageH / 2}" class="label text-page-block" transform="rotate(-90, ${pageLeftX + dims.pageW / 2}, ${pageTopY + dims.pageH / 2})">h (${formatMeasurement(dims.pageH)} ${appState.displayUnit})</text>

                <line x1="${pageRightX}" y1="${pageTopY + dims.pageH / 2}" x2="${pageRightX + dims.pageW}" y2="${pageTopY + dims.pageH / 2}" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
                <text x="${pageRightX + dims.pageW / 2}" y="${pageTopY + dims.pageH / 2 - 8}" class="label text-page-block">w (${formatMeasurement(dims.pageW)} ${appState.displayUnit})</text>
            </g>

            <g class="stroke-margin-item fill-margin-item">
                <line x1="-5" y1="${dims.fabricMargin + dims.boardH / 2}" x2="${leftBoardX}" y2="${dims.fabricMargin + dims.boardH / 2}" marker-end="url(#arrow)"/>
                <text x="-20" y="${dims.fabricMargin + dims.boardH / 2 + 4}" class="label-sm text-margin-item">
                    cover<tspan x="-20" dy="1.2em">margin</tspan><tspan x="-20" dy="1.2em">${formatMeasurement(dims.coverMargin)} ${appState.displayUnit}</tspan>
                </text>

                <line x1="${dims.fabricW - dims.fabricMargin - dims.boardW / 2}" y1="${dims.fabricMargin + dims.boardH + 5}" x2="${dims.fabricW - dims.fabricMargin - dims.boardW / 2}" y2="${dims.fabricH}" marker-end="url(#arrow)"/>
                <text x="${dims.fabricW - dims.fabricMargin - dims.boardW / 2}" y="${dims.fabricH + 15}" class="label-sm text-margin-item">fabric margin (${formatMeasurement(dims.fabricMargin)} ${appState.displayUnit})</text>
            </g>

            <g class="stroke-calculated-item fill-calculated-item">
                <line x1="${dims.fabricMargin + dims.boardW}" y1="${dims.fabricMargin + dims.boardH + 5}" x2="${dims.fabricMargin + dims.boardW + dims.gutter}" y2="${dims.fabricMargin + dims.boardH + 5}" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
                <text x="${dims.fabricMargin + dims.boardW + dims.gutter / 2}" y="${dims.fabricMargin + dims.boardH + 18}" class="label text-calculated-item">g (${formatMeasurement(dims.gutter)} ${appState.displayUnit})</text>

                <line x1="${spineX}" y1="${dims.fabricMargin + dims.boardH / 2}" x2="${spineX + dims.spineW}" y2="${dims.fabricMargin + dims.boardH / 2}" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
                <text x="${spineX + dims.spineW / 2}" y="${dims.fabricMargin + dims.boardH / 2 - 8}" class="label text-calculated-item">s (${formatMeasurement(dims.spineW)} ${appState.displayUnit})</text>
            </g>

            <g class="stroke-board-item fill-board-item">
                <line x1="${dims.fabricW - dims.fabricMargin}" y1="${dims.fabricH - dims.fabricMargin}" x2="${dims.fabricW - dims.fabricMargin + dims.boardT}" y2="${dims.fabricH - dims.fabricMargin + dims.boardT}"/>
                <text x="${dims.fabricW - dims.fabricMargin + dims.boardT + 8}" y="${dims.fabricH - dims.fabricMargin + dims.boardT + 20}" class="label-sm text-board-item" text-anchor="start">board th (${formatMeasurement(dims.boardT)} ${appState.displayUnit})</text>
            </g>
        </svg>
    `;
};

const renderApp = () => {
    const root = document.getElementById('root');
    if (!root) {
        return;
    }

    const dims = getCalculatedDimensions(appState);
    root.innerHTML = `
        <div class="min-h-screen bg-slate-50 p-2 sm:p-4">
            <div class="max-w-7xl mx-auto">
                <header class="text-center mb-3">
                    <h1 class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500">
                        Book Cover Calculator
                    </h1>
                    <p class="mt-1 text-sm text-slate-500">Visual tool for crafting the perfect book cover</p>
                </header>

                <div class="grid grid-cols-1 gap-3 h-[calc(100vh-110px)]">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 h-2/5">
                        <div class="bg-white rounded-lg shadow-sm p-4">
                            <h2 class="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-3">Page Block</h2>
                            <div class="space-y-3">
                                ${renderInputField('pageWidth', 'Width:', appState.pageWidth, 'color-page-block')}
                                ${renderInputField('pageHeight', 'Height:', appState.pageHeight, 'color-page-block')}
                                ${renderInputField('blockThickness', 'Thickness:', appState.blockThickness, 'color-page-block')}
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm p-4">
                            <h2 class="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-3">Materials</h2>
                            <div class="space-y-3">
                                ${renderInputField('boardThickness', 'Board Thick:', appState.boardThickness, 'color-board-item')}
                                ${renderInputField('coverMargin', 'Cover Margin:', appState.coverMargin, 'color-margin-item')}
                                ${renderInputField('fabricMargin', 'Fabric Margin:', appState.fabricMargin, 'color-margin-item')}
                            </div>
                        </div>

                        <div id="final-dimensions" class="bg-white rounded-lg shadow-sm p-4">
                            ${renderFinalDimensions(dims)}
                        </div>

                        <div class="bg-white rounded-lg shadow-sm p-3">
                            <h2 class="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-1 mb-2">Key Formulas</h2>
                            <div id="key-formulas" class="space-y-1 text-[11px] leading-tight">
                                ${renderKeyFormulas(dims)}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 h-3/5">
                        <div class="bg-white rounded-lg shadow-lg p-4 flex flex-col">
                            <h3 class="text-center font-semibold text-slate-700 mb-3 text-lg">Cross-Sectional Diagram</h3>
                            <div class="flex-grow flex items-center justify-center min-h-0">
                                <img src="Fold diagram.png" alt="Folded book cross-section diagram" class="max-w-full max-h-full object-contain"/>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-lg p-4 flex flex-col">
                            <h3 class="text-center font-semibold text-slate-700 mb-3 text-lg">Live Updating Flat Layout</h3>
                            <div id="flat-layout" class="flex-grow min-h-0">
                                ${renderFlatLayoutSVG(dims)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const inputs = root.querySelectorAll('input[type="number"]');
    inputs.forEach((input) => {
        input.addEventListener('input', (event) => {
            const { name, value } = event.target;
            const parsedValue = Number.parseFloat(value);
            const conversionFactor = appState.displayUnit === 'cm' ? 10 : 1;
            appState[name] = Number.isFinite(parsedValue) ? parsedValue * conversionFactor : 0;
            updateCalculatedViews();
        });
    });

    root.onclick = (event) => {
        const button = event.target.closest('button[data-unit]');
        if (button) {
            appState.displayUnit = button.dataset.unit;
            renderApp();
        }
    };
};

document.addEventListener('DOMContentLoaded', renderApp);
