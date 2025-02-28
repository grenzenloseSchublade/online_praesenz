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
                // Smooth coloring
                const smoothed = iteration + 1 - Math.log(Math.log(Math.sqrt(zx2 + zy2))) / Math.log(2);
                const normalized = smoothed / maxIterations;

                // Optimierte Interpolation
                const index = Math.min(Math.floor(normalized * (palette.length - 1)), palette.length - 2);
                const t = (normalized * (palette.length - 1)) - index;

                const color1 = hexToRgb(palette[index]);
                const color2 = hexToRgb(palette[index + 1]);

                color = [
                    Math.floor(color1[0] * (1 - t) + color2[0] * t),
                    Math.floor(color1[1] * (1 - t) + color2[1] * t),
                    Math.floor(color1[2] * (1 - t) + color2[2] * t)
                ];
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