// Web Worker für Julia-Menge-Berechnung
self.onmessage = function (e) {
    const data = e.data;
    const width = data.width;
    const height = data.height;
    const realPart = data.realPart;
    const imagPart = data.imagPart;
    const maxIterations = data.maxIterations;
    const colorScheme = data.colorScheme;
    const viewX = data.viewX;
    const viewY = data.viewY;
    const zoomLevel = data.zoomLevel;
    const colorPalettes = data.colorPalettes;

    // Chunk-Informationen
    const startY = data.startY;
    const endY = data.endY;
    const workerId = data.workerId;

    // Erstelle ImageData nur für den zugewiesenen Chunk
    const chunkHeight = endY - startY;
    const imageData = new ImageData(width, chunkHeight);
    const pixelData = imageData.data;

    // Sichtbarer Bereich basierend auf Zoom und Position
    const xRange = 3.0 / zoomLevel;
    const yRange = 3.0 / zoomLevel;
    const xMin = viewX - xRange / 2;
    const xMax = viewX + xRange / 2;
    const yMin = viewY - yRange / 2;
    const yMax = viewY + yRange / 2;

    // Farbpalette
    const palette = colorPalettes[colorScheme];

    // Berechnung für den zugewiesenen Chunk
    for (let y = 0; y < chunkHeight; y++) {
        const actualY = y + startY;
        const zy = yMin + (yMax - yMin) * actualY / height;

        for (let x = 0; x < width; x++) {
            // Komplexe Zahl z für diesen Pixel
            const zx = xMin + (xMax - xMin) * x / width;

            // Julia-Iteration mit Optimierungen
            let iteration = 0;
            let zx2 = zx;
            let zy2 = zy;
            let zx2_squared = zx2 * zx2;
            let zy2_squared = zy2 * zy2;

            // Hauptschleife mit frühem Abbruch
            while (iteration < maxIterations && (zx2_squared + zy2_squared) < 4) {
                zy2 = 2 * zx2 * zy2 + imagPart;
                zx2 = zx2_squared - zy2_squared + realPart;
                zx2_squared = zx2 * zx2;
                zy2_squared = zy2 * zy2;
                iteration++;
            }

            // Farbberechnung
            let color;
            if (iteration === maxIterations) {
                color = [0, 0, 0]; // Schwarz für Punkte in der Menge
            } else {
                // Smooth coloring
                const smoothed = iteration + 1 - Math.log(Math.log(Math.sqrt(zx2_squared + zy2_squared))) / Math.log(2);
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