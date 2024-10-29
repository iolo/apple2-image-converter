const sourceInput = document.getElementById('sourceInput');
const sourceCanvas = document.getElementById('sourceCanvas');
const sourceCtx = sourceCanvas.getContext('2d');
const hgrCanvas = document.getElementById('hgrCanvas');
const hgrCtx = hgrCanvas.getContext('2d');
const dhgrCanvas = document.getElementById('dhgrCanvas');
const dhgrCtx = dhgrCanvas.getContext('2d');

//
// apple ][ hi-res mode
//

const HGR_PALETTE = [
    [0x00, 0x00, 0x00],
    [0xbb, 0x36, 0xff],
    [0x43, 0xc8, 0x00],
    [0xfe, 0xfe, 0xfe], // FIXME: fake
    [0x01, 0x01, 0x01], // FIXME: fake
    [0x07, 0xa8, 0xe0],
    [0xf9, 0x56, 0x1d],
    [0xff, 0xff, 0xff],
];

const HGR_COLORS = {
    BLACK: 0x000000,
    PURPLE: 0xbb36ff,
    GREEN: 0x43c800,
    WHITE_1: 0xfefefe, // FIXME: fake
    BLACK_1: 0x010101, // FIXME: fake
    BLUE: 0x07a8e0,
    ORANGE: 0xf9561d,
    WHITE: 0xffffff,
};

const HGR_PIXELS = {
    [HGR_COLORS.BLACK]: [0, 0, 0],
    [HGR_COLORS.PURPLE]: [0, 1, 0],
    [HGR_COLORS.GREEN]: [1, 0, 0],
    [HGR_COLORS.WHITE_1]: [1, 1, 0], // FIXME: fake
    [HGR_COLORS.BLACK_1]: [0, 0, 1], // FIXME: fake
    [HGR_COLORS.BLUE]: [0, 1, 1],
    [HGR_COLORS.ORANGE]: [1, 0, 1],
    [HGR_COLORS.WHITE]: [1, 1, 1],
};

const HGR_COLORS_PAL = [
    {
        BLACK: 0x000000,
        PURPLE: 0xbb36ff,
        GREEN: 0x43c800,
        WHITE: 0xffffff,
    },
    {
        BLACK: 0x000000,
        BLUE: 0x07a8e0,
        ORANGE: 0xf9561d,
        WHITE: 0xffffff,
    }
];
const HGR_PIXELS_PAL = [
    {
        [HGR_COLORS.BLACK]: [0, 0],
        [HGR_COLORS.PURPLE]: [0, 1],
        [HGR_COLORS.GREEN]: [1, 0],
        [HGR_COLORS.WHITE]: [1, 1],
    },
    {
        [HGR_COLORS.BLACK]: [0, 0],
        [HGR_COLORS.BLUE]: [1, 0],
        [HGR_COLORS.ORANGE]: [0, 1],
        [HGR_COLORS.WHITE]: [1, 1],
    }
];

//
// apple //e double hi-res mode
//

const DHGR_PALETTE = [
    [0, 0, 0],
    [1, 30, 169],
    [0, 135, 45],
    [47, 69, 255],
    [154, 104, 0],
    [185, 185, 185],
    [0, 222, 0],
    [83, 250, 208],
    [231, 36, 66],
    [230, 73, 228],
    [104, 104, 104],
    [120, 187, 255],
    [255, 124, 0],
    [255, 171, 153],
    [255, 252, 0],
    [255, 255, 255],
];

const DHGR_COLORS = {
    BLACK: rgb(0, 0, 0),
    DK_BLUE: rgb(1, 30, 169),
    DK_GREEN: rgb(0, 135, 45),
    BLUE: rgb(47, 69, 255),
    BROWN: rgb(154, 104, 0),
    GREY1: rgb(185, 185, 185),
    GREEN: rgb(0, 222, 0),
    AQUA: rgb(83, 250, 208),
    RED: rgb(231, 36, 66),
    PURPLE: rgb(230, 73, 228),
    GREY2: rgb(104, 104, 104),
    LT_BLUE: rgb(120, 187, 255),
    ORANGE: rgb(255, 124, 0),
    PINK: rgb(255, 171, 153),
    YELLOW: rgb(255, 252, 0),
    WHITE: rgb(255, 255, 255),
};

const DHGR_PIXELS = {
    [DHGR_COLORS.BLACK]: [0, 0, 0, 0],
    [DHGR_COLORS.DK_BLUE]: [0, 0, 0, 1],
    [DHGR_COLORS.DK_GREEN]: [0, 0, 1, 0],
    [DHGR_COLORS.BLUE]: [0, 0, 1, 1],
    [DHGR_COLORS.BROWN]: [0, 1, 0, 0],
    [DHGR_COLORS.GREY1]: [0, 1, 0, 1],
    [DHGR_COLORS.GREEN]: [0, 1, 1, 0],
    [DHGR_COLORS.AQUA]: [0, 1, 1, 1],
    [DHGR_COLORS.RED]: [1, 0, 0, 0],
    [DHGR_COLORS.PURPLE]: [1, 0, 0, 1],
    [DHGR_COLORS.GREY2]: [1, 0, 1, 0],
    [DHGR_COLORS.LT_BLUE]: [1, 0, 1, 1],
    [DHGR_COLORS.ORANGE]: [1, 1, 0, 0],
    [DHGR_COLORS.PINK]: [1, 1, 0, 1],
    [DHGR_COLORS.YELLOW]: [1, 1, 1, 0],
    [DHGR_COLORS.WHITE]: [1, 1, 1, 1],
};

const OUTPUT_WIDTH = 140;
const OUTPUT_HEIGHT = 192;
const PREVIEW_WIDTH = OUTPUT_WIDTH * 2;
const PREVIEW_HEIGHT = OUTPUT_HEIGHT;
const MONO_WHITE = 'green';
const MONO_BLACK = 'black';

drawPalette(hgrCanvas, HGR_PALETTE);
drawPalette(dhgrCanvas, DHGR_PALETTE);

function drawPalette(canvas, palette) {
    const ctx = canvas.getContext('2d');
    canvas.width = PREVIEW_WIDTH;
    canvas.height = PREVIEW_HEIGHT;
    const w = canvas.width / palette.length;
    for (let i = 0; i < palette.length; i += 1) {
        const [r, g, b] = palette[i];
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(i * w, 0, w, canvas.height);
    }
}

sourceInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
        return alert('No file selected');
    }
    const reader = new FileReader();
    // if mime type is image, load it as image
    if (file.type.startsWith('image/')) {
        reader.onload = (event) => {
            if (typeof event.target.result !== 'string') {
                return alert('Failed to load image');
            }
            const img = new Image();
            img.onload = () => {
                sourceCanvas.width = img.width;
                sourceCanvas.height = img.height;
                sourceCtx.drawImage(img, 0, 0);
                const scaledCanvas = document.createElement('canvas');
                scaledCanvas.width = OUTPUT_WIDTH;
                scaledCanvas.height = OUTPUT_HEIGHT;
                const scaledContext = scaledCanvas.getContext('2d');
                scaledContext.imageSmoothingEnabled = true;
                scaledContext.imageSmoothingQuality = 'high';
                scaledContext.drawImage(sourceCanvas, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);
                const scaledImageData = scaledContext.getImageData(0, 0, scaledCanvas.width, scaledCanvas.height);
                rgbToHgr(scaledImageData.data, scaledCanvas.width, scaledCanvas.height);
                rgbToDhgr(scaledImageData.data, scaledCanvas.width, scaledCanvas.height);
            };
            // data:image/png;base64,...
            // trigger img.onload above
            img.src = event.target.result;
        };
        // trigger reader.onload above
        reader.readAsDataURL(file);
    } else if (/\.(bin|a2fc)$/i.test(file.name)) {
        // if file extension is .bin or .a2fc, load it as APPLE ][ binary
        reader.onload = (event) => {
            if (!(event.target.result instanceof ArrayBuffer)) {
                return alert('Failed to load APPLE ][ binary');
            }
            const data = new Uint8ClampedArray(event.target.result);
            if (/\.bin$/i.test(file.name)) {
                hgrToRgb(data);
                //hgrToMono(data);
            } else {
                dhgrToRgb(data);
                //dhgrToMono(data);
            }
        }
        // trigger reader.onload above
        reader.readAsArrayBuffer(file);
    }
});

//
// https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
//

function findClosestColor(r, g, b, palette) {
    let minDistance = Infinity;
    let closestColor = palette[0];

    for (const color of palette) {
        const dr = r - color[0];
        const dg = g - color[1];
        const db = b - color[2];
        const distance = dr * dr + dg * dg + db * db;

        if (distance < minDistance) {
            minDistance = distance;
            closestColor = color;
        }
    }

    return closestColor;
}

/**
 * @param {Uint8ClampedArray} source
 * @param {number} width
 * @param {number} height
 * @param {Array<Array<number>>} palette
 * @returns {Uint8ClampedArray}
 */
function applyFloydSteinberg(source, width, height, palette) {
    const data = Uint8ClampedArray.from(source);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];

            const [nr, ng, nb] = findClosestColor(r, g, b, palette);
            data[offset] = nr;
            data[offset + 1] = ng;
            data[offset + 2] = nb;

            const er = r - nr;
            const eg = g - ng;
            const eb = b - nb;

            if (x + 1 < width) {
                const offset = (y * width + x + 1) * 4;
                data[offset] += er * 7 / 16;
                data[offset + 1] += eg * 7 / 16;
                data[offset + 2] += eb * 7 / 16;
            }
            if (y + 1 < height) {
                if (x > 0) {
                    const offset = ((y + 1) * width + x - 1) * 4;
                    data[offset] += er * 3 / 16;
                    data[offset + 1] += eg * 3 / 16;
                    data[offset + 2] += eb * 3 / 16;
                }
                const offset = ((y + 1) * width + x) * 4;
                data[offset] += er * 5 / 16;
                data[offset + 1] += eg * 5 / 16;
                data[offset + 2] += eb * 5 / 16;
                if (x + 1 < width) {
                    const offset = ((y + 1) * width + x + 1) * 4;
                    data[offset] += er * 1 / 16;
                    data[offset + 1] += eg * 1 / 16;
                    data[offset + 2] += eb * 1 / 16;
                }
            }
        }
    }
    return data;
}

// apple IIx hi-res base offset of each line
const HB = [
    0x000, 0x400, 0x800, 0xC00, 0x1000, 0x1400, 0x1800, 0x1C00,
    0x080, 0x480, 0x880, 0xC80, 0x1080, 0x1480, 0x1880, 0x1C80,
    0x100, 0x500, 0x900, 0xD00, 0x1100, 0x1500, 0x1900, 0x1D00,
    0x180, 0x580, 0x980, 0xD80, 0x1180, 0x1580, 0x1980, 0x1D80,
    0x200, 0x600, 0xA00, 0xE00, 0x1200, 0x1600, 0x1A00, 0x1E00,
    0x280, 0x680, 0xA80, 0xE80, 0x1280, 0x1680, 0x1A80, 0x1E80,
    0x300, 0x700, 0xB00, 0xF00, 0x1300, 0x1700, 0x1B00, 0x1F00,
    0x380, 0x780, 0xB80, 0xF80, 0x1380, 0x1780, 0x1B80, 0x1F80,
    0x028, 0x428, 0x828, 0xC28, 0x1028, 0x1428, 0x1828, 0x1C28,
    0x0A8, 0x4A8, 0x8A8, 0xCA8, 0x10A8, 0x14A8, 0x18A8, 0x1CA8,
    0x128, 0x528, 0x928, 0xD28, 0x1128, 0x1528, 0x1928, 0x1D28,
    0x1A8, 0x5A8, 0x9A8, 0xDA8, 0x11A8, 0x15A8, 0x19A8, 0x1DA8,
    0x228, 0x628, 0xA28, 0xE28, 0x1228, 0x1628, 0x1A28, 0x1E28,
    0x2A8, 0x6A8, 0xAA8, 0xEA8, 0x12A8, 0x16A8, 0x1AA8, 0x1EA8,
    0x328, 0x728, 0xB28, 0xF28, 0x1328, 0x1728, 0x1B28, 0x1F28,
    0x3A8, 0x7A8, 0xBA8, 0xFA8, 0x13A8, 0x17A8, 0x1BA8, 0x1FA8,
    0x050, 0x450, 0x850, 0xC50, 0x1050, 0x1450, 0x1850, 0x1C50,
    0x0D0, 0x4D0, 0x8D0, 0xCD0, 0x10D0, 0x14D0, 0x18D0, 0x1CD0,
    0x150, 0x550, 0x950, 0xD50, 0x1150, 0x1550, 0x1950, 0x1D50,
    0x1D0, 0x5D0, 0x9D0, 0xDD0, 0x11D0, 0x15D0, 0x19D0, 0x1DD0,
    0x250, 0x650, 0xA50, 0xE50, 0x1250, 0x1650, 0x1A50, 0x1E50,
    0x2D0, 0x6D0, 0xAD0, 0xED0, 0x12D0, 0x16D0, 0x1AD0, 0x1ED0,
    0x350, 0x750, 0xB50, 0xF50, 0x1350, 0x1750, 0x1B50, 0x1F50,
    0x3D0, 0x7D0, 0xBD0, 0xFD0, 0x13D0, 0x17D0, 0x1BD0, 0x1FD0,
];

function rgb(r, g, b) {
    return (r << 16) | (g << 8) | b;
}

function forEachPixelBlock(data, width, height, pixels, callback) {
    for (let y = 0; y < 192; y++) {
        let offset = HB[y];
        for (let x = 0; x < 140; x += 7) {
            const index = (y * 140 + x) * 4; // 4=RGBA
            const A = rgb(data[index], data[index + 1], data[index + 2]);
            const B = rgb(data[index + 4], data[index + 5], data[index + 6]);
            const C = rgb(data[index + 8], data[index + 9], data[index + 10]);
            const D = rgb(data[index + 12], data[index + 13], data[index + 14]);
            const E = rgb(data[index + 16], data[index + 17], data[index + 18]);
            const F = rgb(data[index + 20], data[index + 21], data[index + 22]);
            const G = rgb(data[index + 24], data[index + 25], data[index + 26]);
            const a = pixels[A];
            const b = pixels[B];
            const c = pixels[C];
            const d = pixels[D];
            const e = pixels[E];
            const f = pixels[F];
            const g = pixels[G];
            callback(offset, a, b, c, d, e, f, g);
            offset += 2;
        }
    }
}

/**
 * @param {Uint8ClampedArray} source
 * @param {number} width
 * @param {number} height
 */
function rgbToHgr(source, width, height) {
    const data = applyFloydSteinberg(source, width, height, HGR_PALETTE);

    hgrCanvas.width = PREVIEW_WIDTH;
    hgrCanvas.height = PREVIEW_HEIGHT;
    hgrCtx.imageSmoothingEnabled = false;
    createImageBitmap(new ImageData(data, width, height))
        .then(it => hgrCtx.drawImage(it, 0, 0, hgrCanvas.width, hgrCanvas.height));

    const main = new Uint8ClampedArray(0x2000);
    // |address  | $2000        | $2001        |
    // |---------|--------------|--------------|
    // |byte bit | 7 6 54 32 10 | 7 65 43 21 0 |
    // |pixel    | P D CC BB AA | P GG FF EE D |
    // |color bit| 2 1 01 01 01 | 2 01 01 01 0 |
    forEachPixelBlock(data, width, height, HGR_PIXELS, (offset, a, b, c, d, e, f, g) => {
        let byte0 = d[1] << 6 | c[0] << 5 | c[1] << 4 | b[0] << 3 | b[1] << 2 | a[0] << 1 | a[1];
        let byte1 = g[0] << 6 | g[1] << 5 | f[0] << 4 | f[1] << 3 | e[0] << 2 | e[1] << 1 | d[0];
        // FIXME: more accurate palette bit
        if (a[2] || b[2] || c[2] || d[2]) byte0 |= 0x80;
        if (e[2] || f[2] || g[2]) byte1 |= 0x80;
        main[offset] = byte0;
        main[offset + 1] = byte1;
    });

    const hgrBlob = new Blob([main], {type: 'application/octet-stream'});
    const hgrLink = document.getElementById('hgrLink');
    hgrLink.href = URL.createObjectURL(hgrBlob);
}

/**
 * @param {Uint8ClampedArray} source
 * @param {number} width
 * @param {number} height
 */
function rgbToDhgr(source, width, height) {
    const data = applyFloydSteinberg(source, width, height, DHGR_PALETTE);

    dhgrCanvas.width = PREVIEW_WIDTH;
    dhgrCanvas.height = PREVIEW_HEIGHT;
    dhgrCtx.imageSmoothingEnabled = false;
    createImageBitmap(new ImageData(data, width, height))
        .then(it => dhgrCtx.drawImage(it, 0, 0, dhgrCanvas.width, dhgrCanvas.height));

    const main = new Uint8ClampedArray(0x2000);
    const aux = new Uint8ClampedArray(0x2000);
    // |bank     | aux        | main        | aux         | main       |
    // |address  | $2000      | $2000       | $2001       | $2001      |
    // |---------|------------|-------------|-------------|------------|
    // |byte bit | 7 654 3210 | 7 65 4321 0 | 7 6 5432 10 | 7 6543 210 |
    // |pixel    | P BBB AAAA | P DD CCCC B | P F EEEE DD | P GGGG FFF |
    // |color bit| b 123 0123 |   23 0123 0 |   3 0123 01 |   0123 012 |
    forEachPixelBlock(data, width, height, DHGR_PIXELS, (offset, a, b, c, d, e, f, g) => {
        const byte0 = b[1] << 6 | b[2] << 5 | b[3] << 4 | a[0] << 3 | a[1] << 2 | a[2] << 1 | a[3];
        const byte1 = d[2] << 6 | d[3] << 5 | c[0] << 4 | c[1] << 3 | c[2] << 2 | c[3] << 1 | b[0];
        const byte2 = f[3] << 6 | e[0] << 5 | e[1] << 4 | e[2] << 3 | e[3] << 2 | d[0] << 1 | d[1];
        const byte3 = g[0] << 6 | g[1] << 5 | g[2] << 4 | g[3] << 3 | f[0] << 2 | f[1] << 1 | f[2];
        // FIXME: by document, aux first... but...??
        main[offset] = byte0;
        aux[offset] = byte1;
        main[offset + 1] = byte2;
        aux[offset + 1] = byte3;
    });

    const dhgrLink = document.getElementById('dhgrLink');
    dhgrLink.href = URL.createObjectURL(new Blob([main, aux], {type: 'application/octet-stream'}));
}

/**
 * @param {Uint8ClampedArray} source
 */
function hgrToMono(source) {
    for (let y = 0; y < 192; y++) {
        let x = 0;
        for (let offset = 0; offset < 40; offset += 1) {
            const byte0 = source[HB[y] + offset];
            for (let i = 0; i < 7; i += 1) {
                hgrCtx.fillStyle = (byte0 & (0x01 << i)) ? MONO_WHITE : MONO_BLACK;
                hgrCtx.fillRect(x++, y, 1, 1);
            }
        }
    }
}

/**
 * @param {Uint8ClampedArray} source
 */
function hgrToRgb(source) {
    for (let y = 0; y < 192; y++) {
        let x = 0;
        for (let offset = 0; offset < 40; offset += 2) {
            const byte0 = source[HB[y] + offset];
            const byte1 = source[HB[y] + offset + 1];
            // |address  | $2000        | $2001        |
            // |---------|--------------|--------------|
            // |byte bit | 7 6 54 32 10 | 7 65 43 21 0 |
            // |pixel    | P D CC BB AA | P GG FF EE D |
            // |color bit| 2 1 01 01 01 | 2 01 01 01 0 |
            const palette0 = (byte0 & 0b10000000) >> 5;
            const palette1 = (byte1 & 0b10000000) >> 5;
            const pixels = [
                palette0 | (byte0 & 0b00000011),
                palette0 | ((byte0 & 0b00001100) >> 2),
                palette0 | ((byte0 & 0b00110000) >> 4),
                palette0 | ((byte0 & 0b01000000) >> 6) | ((byte1 & 0b00000001) << 1),
                palette1 | ((byte1 & 0b00000110) >> 1),
                palette1 | ((byte1 & 0b00011000) >> 3),
                palette1 | ((byte1 & 0b01100000) >> 5),
            ];
            pixels.forEach((pixel, i) => {
                const [r, g, b] = HGR_PALETTE[pixel];
                hgrCtx.fillStyle = `rgb(${r},${g},${b})`;
                hgrCtx.fillRect(x, y, 2, 1);
                x += 2;
            });
        }
    }
}

/**
 * @param {Uint8ClampedArray} source
 */
function dhgrToMono(source) {
    for (let y = 0; y < 192; y++) {
        let x = 0;
        for (let offset = 0; offset < 40; offset += 2) {
            const byte0 = source[HB[y] + offset]; // main
            const byte1 = source[0x2000 + HB[y] + offset]; // aux
            const byte2 = source[HB[y] + offset + 1]; // main
            const byte3 = source[0x2000 + HB[y] + offset + 1]; // aux
            for (const byte of [byte0, byte1, byte2, byte3]) {
                for (let i = 0; i < 7; i += 1) {
                    dhgrCtx.fillStyle = (byte & (0x01 << i)) ? MONO_WHITE : MONO_BLACK;
                    dhgrCtx.fillRect(x++, y, 1, 1);
                }
            }
        }
    }
}

/**
 * @param {Uint8ClampedArray} source
 */
function dhgrToRgb(source) {
    for (let y = 0; y < 192; y++) {
        let x = 0;
        for (let offset = 0; offset < 40; offset += 2) {
            // FIXME: by document, aux first... but...??
            const byte0 = source[HB[y] + offset]; // main
            const byte1 = source[0x2000 + HB[y] + offset]; // aux
            const byte2 = source[HB[y] + offset + 1]; // main
            const byte3 = source[0x2000 + HB[y] + offset + 1]; // aux
            // |bank     | aux        | main        | aux         | main       |
            // |address  | $2000      | $2000       | $2001       | $2001      |
            // |---------|------------|-------------|-------------|------------|
            // |byte bit | 7 654 3210 | 7 65 4321 0 | 7 6 5432 10 | 7 6543 210 |
            // |pixel    | P BBB AAAA | P DD CCCC B | P F EEEE DD | P GGGG FFF |
            // |color bit| b 123 0123 |   23 0123 0 |   3 0123 01 |   0123 012 |
            const pixels = [
                (byte0 & 0b00001111),
                ((byte0 & 0b01110000) >> 4) | ((byte1 & 0b00000001) << 3),
                ((byte1 & 0b00011110) >> 1),
                ((byte1 & 0b01100000) >> 5) | ((byte2 & 0b00000011) << 2),
                ((byte2 & 0b00111100) >> 2),
                ((byte2 & 0b01000000) >> 6) | ((byte3 & 0b00000111) << 1),
                ((byte3 & 0b01111000) >> 3)
            ];
            pixels.forEach((pixel, i) => {
                const [r, g, b] = DHGR_PALETTE[pixel];
                dhgrCtx.fillStyle = `rgb(${r},${g},${b})`;
                dhgrCtx.fillRect(x, y, 2, 1);
                x += 2;
            });
        }
    }
}