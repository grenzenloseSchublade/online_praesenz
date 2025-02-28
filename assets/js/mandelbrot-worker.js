// Web Worker für Mandelbrot-Menge-Berechnung
self.onmessage = function (e) {
    const data = e.data;
    const width = data.width;
    const height = data.height;
    const maxIterations = data.maxIterations;
    const colorScheme = data.colorScheme;
    const colorPalettes = data.colorPalettes;

    // Chunk-Informationen
    const startY = data.startY;
    const endY = data.endY;
    const workerId = data.workerId;

    // Erstelle ImageData nur für den zugewiesenen Chunk
    const chunkHeight = endY - startY;
    const imageData = new ImageData(width, chunkHeight);
    const pixelData = imageData.data;

    // Mandelbrot-Bereich
    const xMin = -2.0;
    const xMax = 1.0;
    const yMin = -1.5;
    const yMax = 1.5;

    // Farbpalette
    const palette = colorPalettes[colorScheme];

    // Vorberechnete Farbwerte für bessere Performance
    const precomputedColors = precomputeColors(palette, 1000);

    // Berechnung für den zugewiesenen Chunk
    for (let y = 0; y < chunkHeight; y++) {
        const actualY = y + startY;
        const cy = yMin + (yMax - yMin) * actualY / height;

        for (let x = 0; x < width; x++) {
            const cx = xMin + (xMax - xMin) * x / width;

            // Mandelbrot-Iteration mit Optimierungen
            let zx = 0;
            let zy = 0;
            let iteration = 0;
            let zx2 = 0;
            let zy2 = 0;

            // Hauptschleife mit frühem Abbruch
            while (iteration < maxIterations && (zx2 + zy2) < 4) {
                zy = 2 * zx * zy + cy;
                zx = zx2 - zy2 + cx;
                zx2 = zx * zx;
                zy2 = zy * zy;
                iteration++;
            }

            // Farbberechnung
            let color;
            if (iteration === maxIterations) {
                color = [0, 0, 0]; // Schwarz für Punkte in der Menge
            } else {
                // Verbesserte Smooth-Coloring-Formel
                const log_zn = Math.log(zx2 + zy2) / 2;
                const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
                const smoothed = iteration + 1 - nu;

                // Verbesserte Farbverteilung mit Histogramm-Ähnlichem Effekt
                // Verwendet eine Sigmoid-Funktion für weichere Übergänge
                const t = smoothed / maxIterations;
                const sigmoid = 1 / (1 + Math.exp(-12 * (t - 0.5)));
                const normalized = Math.pow(sigmoid, 0.5); // Quadratwurzel für bessere Verteilung

                // Verwende vorberechnete Farben für bessere Performance
                const colorIndex = Math.min(Math.floor(normalized * 999), 998);
                color = precomputedColors[colorIndex];
            }

            // Pixel setzen
            const pixelIndex = (y * width + x) * 4;
            pixelData[pixelIndex] = color[0];     // R
            pixelData[pixelIndex + 1] = color[1]; // G
            pixelData[pixelIndex + 2] = color[2]; // B
            pixelData[pixelIndex + 3] = 255;      // A
        }
    }

    // Ergebnis zurücksenden mit Chunk-Informationen
    self.postMessage({
        imageData: imageData,
        startY: startY,
        endY: endY,
        workerId: workerId
    }, [imageData.data.buffer]);
};

// Hilfsfunktion: HEX zu RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

// Vorberechnung von Farben für bessere Performance
function precomputeColors(palette, steps) {
    const colors = new Array(steps);

    for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);

        // Verbesserte Farbinterpolation mit Gamma-Korrektur und Farbton-Rotation
        // Verwende eine kubische Funktion für natürlichere Übergänge
        const adjustedT = t * t * (3 - 2 * t); // Kubische Hermite-Interpolation
        const position = adjustedT * (palette.length - 1);
        const index = Math.min(Math.floor(position), palette.length - 2);
        const fraction = position - index;

        // Gamma-korrigierte Interpolation für natürlichere Farbübergänge
        const color1 = hexToRgb(palette[index]);
        const color2 = hexToRgb(palette[index + 1]);

        // Umwandlung in linearen Farbraum für bessere Interpolation
        const r1 = Math.pow(color1[0] / 255, 2.2);
        const g1 = Math.pow(color1[1] / 255, 2.2);
        const b1 = Math.pow(color1[2] / 255, 2.2);

        const r2 = Math.pow(color2[0] / 255, 2.2);
        const g2 = Math.pow(color2[1] / 255, 2.2);
        const b2 = Math.pow(color2[2] / 255, 2.2);

        // Kubische Interpolation im linearen Farbraum für weichere Übergänge
        const cubicFraction = fraction * fraction * (3 - 2 * fraction);
        const r = r1 * (1 - cubicFraction) + r2 * cubicFraction;
        const g = g1 * (1 - cubicFraction) + g2 * cubicFraction;
        const b = b1 * (1 - cubicFraction) + b2 * cubicFraction;

        // Zurück in sRGB-Farbraum
        colors[i] = [
            Math.round(Math.pow(r, 1 / 2.2) * 255),
            Math.round(Math.pow(g, 1 / 2.2) * 255),
            Math.round(Math.pow(b, 1 / 2.2) * 255)
        ];
    }

    return colors;
} 