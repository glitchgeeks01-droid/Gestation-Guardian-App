const fs = require('fs');

let css = fs.readFileSync('style-skeuomorphic.css', 'utf8');

// The block we appended started with:
// /* =========================================
//    GLASSMORPHIC / 3D ICONS (LUCIDE SVGs)
//    ========================================= */
const startMarker = '/* =========================================\n   GLASSMORPHIC / 3D ICONS (LUCIDE SVGs)\n   ========================================= */';

const newCssBlock = `
${startMarker}

/* Global SVG styling for depth */
.lucide {
  stroke-width: 2.5;
  filter: drop-shadow(0px 2px 1px rgba(255,255,255,0.6)) drop-shadow(0px -1px 1px rgba(0,0,0,0.2));
  transition: all 0.3s ease;
}

/* Base Bento Icon Depth */
.bento-icon {
  border-radius: 18px !important; /* Squircle shape instead of perfect circle */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 52px !important;
  height: 52px !important;
  margin-bottom: 12px !important;
  box-shadow: 
    inset 0 4px 6px rgba(255, 255, 255, 0.9),
    inset 0 -4px 6px rgba(0, 0, 0, 0.1),
    0 8px 12px -4px rgba(0, 0, 0, 0.15),
    0 16px 24px -8px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(255,255,255,0.7) !important;
  position: relative;
  overflow: hidden;
}

/* Inner glow for glass depth */
.bento-icon::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
  border-radius: 18px 18px 0 0;
}

/* Beautiful Color Palette per Icon Type */
/* 1. Log BP (Teal/Sage) */
.bento-card:nth-child(1) .bento-icon {
  background: linear-gradient(135deg, #B5D5C5 0%, #7AA896 100%) !important;
  box-shadow: inset 0 4px 6px rgba(255,255,255,0.7), inset 0 -4px 6px rgba(50,80,70,0.3), 0 10px 20px -5px rgba(122,168,150,0.5) !important;
}
.bento-card:nth-child(1) .lucide { stroke: #2E5041; }

/* 2. Kick Counter (Warm Peach) */
.bento-card:nth-child(2) .bento-icon {
  background: linear-gradient(135deg, #FFD8C4 0%, #E29578 100%) !important;
  box-shadow: inset 0 4px 6px rgba(255,255,255,0.8), inset 0 -4px 6px rgba(130,60,40,0.2), 0 10px 20px -5px rgba(226,149,120,0.5) !important;
}
.bento-card:nth-child(2) .lucide { stroke: #803A24; }

/* 3. Log Vital Data (Soft Lavender) */
.bento-card:nth-child(3) .bento-icon {
  background: linear-gradient(135deg, #E6DDF2 0%, #B4A0CD 100%) !important;
  box-shadow: inset 0 4px 6px rgba(255,255,255,0.8), inset 0 -4px 6px rgba(70,50,90,0.2), 0 10px 20px -5px rgba(180,160,205,0.5) !important;
}
.bento-card:nth-child(3) .lucide { stroke: #4F386E; }

/* 4. AI Assistant (Muted Mustard/Gold) */
.bento-card:nth-child(4) .bento-icon {
  background: linear-gradient(135deg, #FAEDCB 0%, #D4C99E 100%) !important;
  box-shadow: inset 0 4px 6px rgba(255,255,255,0.9), inset 0 -4px 6px rgba(100,90,50,0.2), 0 10px 20px -5px rgba(212,201,158,0.5) !important;
}
.bento-card:nth-child(4) .lucide { stroke: #70622F; }

/* 5. Reports (Gentle Sky Blue) */
.bento-card:nth-child(5) .bento-icon {
  background: linear-gradient(135deg, #D6EADF 0%, #9DB8C4 100%) !important;
  box-shadow: inset 0 4px 6px rgba(255,255,255,0.8), inset 0 -4px 6px rgba(50,70,90,0.2), 0 10px 20px -5px rgba(157,184,196,0.5) !important;
}
.bento-card:nth-child(5) .lucide { stroke: #32586E; }

/* 6. Reminders (Soft Rose) */
.bento-card:nth-child(6) .bento-icon {
  background: linear-gradient(135deg, #FAD4D4 0%, #E09898 100%) !important;
  box-shadow: inset 0 4px 6px rgba(255,255,255,0.9), inset 0 -4px 6px rgba(100,50,50,0.2), 0 10px 20px -5px rgba(224,152,152,0.5) !important;
}
.bento-card:nth-child(6) .lucide { stroke: #803D3D; }


/* Bottom Nav Depth */
.nav-icon {
  background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 100%) !important;
  box-shadow: 
    inset 0 2px 4px rgba(255,255,255,1),
    inset 0 -2px 4px rgba(0,0,0,0.1),
    0 4px 8px rgba(0,0,0,0.08) !important;
  border: 1px solid rgba(255,255,255,0.6) !important;
  border-radius: 14px !important;
  width: 40px !important;
  height: 40px !important;
}
.nav-icon .lucide {
  stroke: #738875;
}
.nav-item.active .nav-icon {
  background: linear-gradient(135deg, #95C398 0%, #6F9B73 100%) !important;
  box-shadow: 
    inset 0 2px 4px rgba(255,255,255,0.6),
    inset 0 -4px 6px rgba(30,60,35,0.4),
    0 8px 16px -4px rgba(111,155,115,0.6) !important;
  border-color: rgba(255,255,255,0.4) !important;
}
.nav-item.active .nav-icon .lucide {
  stroke: #FFFFFF !important;
  filter: drop-shadow(0px 1px 2px rgba(20,50,25,0.4)) !important;
}

/* Vital Summary Icons */
.vital-icon {
  border-radius: 18px !important;
  background: linear-gradient(135deg, #FAF9F6 0%, #E8E5E1 100%) !important;
  box-shadow: 
    inset 0 4px 6px rgba(255,255,255,1),
    inset 0 -4px 6px rgba(0,0,0,0.05),
    0 10px 15px -3px rgba(0,0,0,0.1) !important;
  border: 1px solid rgba(255,255,255,1) !important;
  width: 56px !important;
  height: 56px !important;
}
.vital-icon.heart-icon .lucide { stroke: #D25F5F; }
.vital-icon.weight-icon .lucide { stroke: #4A6E82; }
.vital-icon.sleep-icon .lucide { stroke: #6B5B95; }
`;

const startIndex = css.indexOf(startMarker);
if (startIndex !== -1) {
  css = css.substring(0, startIndex) + newCssBlock;
  fs.writeFileSync('style-skeuomorphic.css', css, 'utf8');
  console.log('Replaced icon styles.');
} else {
  fs.appendFileSync('style-skeuomorphic.css', newCssBlock);
  console.log('Appended icon styles.');
}
