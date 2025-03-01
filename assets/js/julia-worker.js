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

    // Berechne den Julia-Set für diesen Chunk
    const result = calculateJuliaChunk(width, height, realPart, imagPart, maxIterations,
        colorScheme, viewX, viewY, zoomLevel,
        colorPalettes, startY, endY);

    // Sende das Ergebnis zurück
    self.postMessage({
        imageData: result.imageData,
        startY: startY,
        endY: endY,
        workerId: workerId,
        iterationData: result.iterationData
    });
};

// Berechnet einen Chunk des Julia-Sets
function calculateJuliaChunk(width, height, realPart, imagPart, maxIterations,
    colorScheme, viewX, viewY, zoomLevel,
    colorPalettes, startY, endY) {
    // Erstelle ImageData für diesen Chunk
    const imageData = new ImageData(width, endY - startY);

    // Speichere Iterationsdaten für Echtzeit-Informationen
    const iterationData = {
        width: width,
        height: height,
        data: new Uint16Array(width * height)
    };

    // Berechne Grenzen basierend auf Zoom und Ansicht
    const xRange = 3.0 / zoomLevel;
    const yRange = 3.0 / zoomLevel;
    const xMin = viewX - xRange / 2;
    const yMin = viewY - yRange / 2;

    // Vorberechnete Farben für bessere Performance
    const colorPalette = colorPalettes[colorScheme];
    const precomputedColors = precomputeColors(colorPalette, maxIterations);

    // Für jeden Pixel in diesem Chunk
    for (let y = startY; y < endY; y++) {
        for (let x = 0; x < width; x++) {
            // Umrechnung in komplexe Koordinaten
            const zx = xMin + (x / width) * xRange;
            const zy = yMin + (y / height) * yRange;

            // Julia-Set-Iteration
            let iteration = 0;
            let zx2 = zx;
            let zy2 = zy;

            // Speichere den letzten Wert für Smooth Coloring
            let lastZx = 0;
            let lastZy = 0;

            // Iteriere bis zur Flucht oder maximalen Iteration
            while (zx2 * zx2 + zy2 * zy2 < 4 && iteration < maxIterations) {
                lastZx = zx2;
                lastZy = zy2;

                // z = z² + c
                const xtemp = zx2 * zx2 - zy2 * zy2 + realPart;
                zy2 = 2 * zx2 * zy2 + imagPart;
                zx2 = xtemp;

                iteration++;
            }

            // Speichere Iterationsdaten für Echtzeit-Informationen
            iterationData.data[y * width + x] = iteration;

            // Berechne Farbe basierend auf Iteration
            let color;

            if (iteration === maxIterations) {
                // Punkt ist in der Julia-Menge
                color = [0, 0, 0, 255]; // Schwarz
            } else {
                // Smooth Coloring für bessere Farbübergänge
                const zn2 = zx2 * zx2 + zy2 * zy2;
                const nu = Math.log(Math.log(zn2) / 2 / Math.log(2)) / Math.log(2);
                const smoothed = iteration + 1 - nu;

                // Normalisiere den Wert für bessere Farbverteilung
                const normalized = Math.sqrt(smoothed / maxIterations);

                // Kubische Interpolation für weichere Übergänge
                color = precomputedColors[Math.min(Math.floor(normalized * (precomputedColors.length - 1)), precomputedColors.length - 1)];
            }

            // Setze Pixel im ImageData
            const pixelIndex = (y - startY) * width + x;
            const dataIndex = pixelIndex * 4;

            imageData.data[dataIndex] = color[0];     // R
            imageData.data[dataIndex + 1] = color[1]; // G
            imageData.data[dataIndex + 2] = color[2]; // B
            imageData.data[dataIndex + 3] = color[3]; // A
        }
    }

    return {
        imageData: imageData,
        iterationData: iterationData
    };
}

// Vorberechnung von Farben für bessere Performance
function precomputeColors(palette, maxIterations) {
    const colors = [];
    const steps = 1000; // Anzahl der vorberechneten Farben

    for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        colors.push(interpolateColor(palette, t));
    }

    return colors;
}

// Kubische Interpolation zwischen Farben
function interpolateColor(palette, t) {
    // Stelle sicher, dass t im Bereich [0, 1] liegt
    t = Math.max(0, Math.min(1, t));

    // Anzahl der Farbsegmente
    const segments = palette.length - 1;

    // Berechne das aktuelle Segment
    const segment = Math.min(Math.floor(t * segments), segments - 1);

    // Normalisiere t für dieses Segment
    const segmentT = (t * segments) - segment;

    // Kubische Interpolation (Smoothstep)
    const smoothT = segmentT * segmentT * (3 - 2 * segmentT);

    // Gamma-korrigierte Interpolation für bessere Farbwahrnehmung
    return gammaInterpolate(
        hexToRgb(palette[segment]),
        hexToRgb(palette[segment + 1]),
        smoothT
    );
}

// Gamma-korrigierte Interpolation zwischen zwei Farben
function gammaInterpolate(color1, color2, t) {
    // Konvertiere sRGB zu linearem RGB für korrekte Interpolation
    const linearColor1 = color1.map(c => Math.pow(c / 255, 2.2));
    const linearColor2 = color2.map(c => Math.pow(c / 255, 2.2));

    // Verbesserte Interpolation mit Smoothstep für weichere Übergänge
    const smoothT = t * t * (3 - 2 * t);

    // Lineare Interpolation im linearen Farbraum
    const linearResult = linearColor1.map((c, i) => c + smoothT * (linearColor2[i] - c));

    // Konvertiere zurück zu sRGB mit verbesserter Farbsättigung
    const result = linearResult.map(c => {
        // Erhöhe die Farbsättigung für intensivere Farben
        const saturated = Math.max(0, Math.min(1, c * 1.1));
        return Math.round(Math.pow(saturated, 1 / 2.2) * 255);
    });

    // Füge Alpha-Kanal hinzu
    return [...result, 255];
}

// Hilfsfunktion: HEX zu RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
} 