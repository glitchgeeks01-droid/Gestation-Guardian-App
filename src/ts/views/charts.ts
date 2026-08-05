// @ts-nocheck
// js/charts.js

/**
 * Gestation Guardian - Lightweight Visualizations
 * Draws sparklines and progress rings using Canvas API without heavy libraries
 */

export const Charts = {
    
    // Draw a simple sparkline (line chart) on a canvas
    drawSparkline(canvasId, dataPoints, color = '#6DA171', strokeWidth = 3) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !dataPoints || dataPoints.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Handle device pixel ratio for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        
        // We only want to scale it once
        if (!canvas.dataset.scaled) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.dataset.scaled = 'true';
        }
        
        ctx.clearRect(0, 0, width, height);
        
        // If only one data point, just draw a dot in the middle
        if (dataPoints.length === 1) {
            ctx.beginPath();
            ctx.arc(width/2, height/2, strokeWidth, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            return;
        }
        
        // Find min and max for scaling
        const min = Math.min(...dataPoints);
        const max = Math.max(...dataPoints);
        const range = max - min === 0 ? 1 : max - min; // Avoid div by 0
        
        // Add some padding
        const padding = strokeWidth * 2;
        const drawWidth = width - (padding * 2);
        const drawHeight = height - (padding * 2);
        
        const stepX = drawWidth / (dataPoints.length - 1);
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        dataPoints.forEach((val, i) => {
            const x = padding + (i * stepX);
            // Invert Y since canvas 0,0 is top-left
            const normalizedY = (val - min) / range;
            const y = height - padding - (normalizedY * drawHeight);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }
};

window.Charts = Charts;

// Expose for HTML inline handlers
(window as any).Charts = Charts;
