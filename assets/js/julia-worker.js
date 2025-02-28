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

    // Farbpalette mit Fallback
    let palette = colorPalettes[colorScheme];
    if (!palette) {
        console.error("Worker: Farbschema nicht gefunden:", colorScheme);
        palette = colorPalettes['blau-rot'] || ['#000000', '#0000FF', '#FFFFFF', '#FF0000', '#000000'];
    }

    // Vorberechnete Farbwerte für bessere Performance
    const precomputedColors = precomputeColors(palette, 1000);

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
                // Punkte in der Menge sind schwarz
                color = [0, 0, 0];
            } else {
                // Verbesserte Smooth-Coloring-Formel
                // Berechne den glatten Wert basierend auf dem letzten z-Wert
                const log_zn = Math.log(zx2_squared + zy2_squared) / 2;
                const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
                const smoothed = iteration + 1 - nu;

                // Fortschrittliche Normalisierung für bessere Farbverteilung
                // Verwende Quadratwurzel für natürlichere Verteilung
                const normalized = Math.sqrt(smoothed / maxIterations);

                // Wähle die Farbe aus der vorberechneten Palette
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
    try {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    } catch (error) {
        console.error("Fehler bei Farbkonvertierung:", error);
        return [0, 0, 0];
    }
}

// Vorberechnung von Farben für bessere Performance
function precomputeColors(palette, steps) {
    try {
        const colors = new Array(steps);

        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);

            // Kubische Interpolation für weichere Farbübergänge
            const position = t * (palette.length - 1);
            const index = Math.min(Math.floor(position), palette.length - 2);
            const fraction = position - index;

            // Kubische Hermite-Interpolation (Smoothstep)
            const fraction2 = fraction * fraction;
            const fraction3 = fraction2 * fraction;
            const smoothFraction = 3 * fraction2 - 2 * fraction3;

            // Farbinterpolation mit Gamma-Korrektur für bessere Wahrnehmung
            const color1 = hexToRgb(palette[index]);
            const color2 = hexToRgb(palette[index + 1]);

            // Gamma-korrigierte Interpolation
            function gammaInterpolate(a, b, t) {
                // Gamma-Dekodierung (sRGB zu linear)
                const aLinear = Math.pow(a / 255, 2.2);
                const bLinear = Math.pow(b / 255, 2.2);

                // Lineare Interpolation im linearen Farbraum
                const result = aLinear * (1 - t) + bLinear * t;

                // Gamma-Kodierung (linear zu sRGB)
                return Math.round(Math.pow(result, 1 / 2.2) * 255);
            }

            colors[i] = [
                gammaInterpolate(color1[0], color2[0], smoothFraction),
                gammaInterpolate(color1[1], color2[1], smoothFraction),
                gammaInterpolate(color1[2], color2[2], smoothFraction)
            ];
        }

        return colors;
    } catch (error) {
        console.error("Fehler bei Farbvorberechnung:", error);
        // Fallback: Einfache Graustufenpalette
        const fallbackColors = new Array(steps);
        for (let i = 0; i < steps; i++) {
            const value = Math.round((i / (steps - 1)) * 255);
            fallbackColors[i] = [value, value, value];
        }
        return fallbackColors;
    }
} 