import'data:text/javascript,"assets/index-DqVKc7tA.js";if(!import.meta.resolve)throw Error("import.meta.resolve not supported")';export function __vite_legacy_guard(){import.meta.url,import(`_`).catch(()=>1),(async function*(){})().next()}(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var t=`<!-- pages/bluetooth.html -->
<div id="page-bluetooth" class="page">
    
    <!-- Top Glass Header -->
    <header class="glass-header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                <i data-lucide="arrow-left"></i>
            </a>
            <h1 style="font-size: 20px; color: var(--clr-dark-green);">Connect Devices</h1>
        </div>
        
        <!-- User Profile Photo Placeholder -->
        <div style="width: 40px; height: 40px; background: var(--clr-border-input); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
            <i data-lucide="user" style="color: var(--clr-text-muted);"></i>
        </div>
    </header>

    <div class="bt-main">
        
        <!-- Hero Section with Scanning Animation -->
        <div class="bt-hero">
            <div class="scanning-animation">
                <div class="scan-ring"></div>
                <div class="scan-ring"></div>
                <div class="scan-ring"></div>
                <div class="scan-center">
                    <i data-lucide="bluetooth" class="scan-center-icon"></i>
                </div>
            </div>
            
            <h2 class="mt-4">Connect Your<br>Devices</h2>
            <p style="font-size: 18px; color: var(--clr-text-muted-alt); text-align: center; margin-top: 8px;">
                Real-time insights for a safer journey.
            </p>
        </div>

        <!-- Device List -->
        <div class="bt-device-list">
            
            <!-- BP Monitor -->
            <div class="card-device">
                <div class="card-device-icon-bg green">
                    <i data-lucide="heart-pulse"></i>
                </div>
                <div class="card-device-content">
                    <h3>BP Monitor</h3>
                    <p>Omron / iHealth</p>
                </div>
                <button class="btn btn-connect" onclick="Bluetooth.connect('bp')">Connect</button>
            </div>

            <!-- Smartwatch -->
            <div class="card-device">
                <div class="card-device-icon-bg purple">
                    <i data-lucide="watch"></i>
                </div>
                <div class="card-device-content">
                    <h3>Smartwatch</h3>
                    <p>Apple Watch / Fitbit</p>
                </div>
                <button class="btn btn-connect" onclick="Bluetooth.connect('watch')">Connect</button>
            </div>

            <!-- Pulse Oximeter -->
            <div class="card-device">
                <div class="card-device-icon-bg teal">
                    <i data-lucide="activity"></i>
                </div>
                <div class="card-device-content">
                    <h3>Pulse Oximeter</h3>
                    <p>Digital Vitals Trackers</p>
                </div>
                <button class="btn btn-connect" onclick="Bluetooth.connect('spo2')">Connect</button>
            </div>
            
        </div>

        <!-- Info Anchor Card -->
        <div class="card-info w-full">
            <i data-lucide="activity" class="card-info-bg-icon"></i>
            <div style="position: relative; z-index: 1;">
                <p class="micro-label" style="margin-bottom: 8px;">WHY CONNECT?</p>
                <p style="font-size: 16px; color: var(--clr-text-muted-alt); line-height: 1.62;">
                    Syncing your devices allows us to detect subtle patterns in your health, providing you and your doctor with precise, real-time insights for a safer journey.
                </p>
            </div>
        </div>

    </div>

    <!-- Bottom Glass Footer -->
    <footer class="glass-footer">
        <a href="#/dashboard" class="btn btn-accent">
            Continue
            <i data-lucide="arrow-right"></i>
        </a>
        <a href="#/dashboard" class="btn btn-text w-full text-center">
            Skip for now
        </a>
    </footer>

</div>
`,n=`<!-- pages/care-guide.html -->
<div id="page-care-guide" class="page" style="padding-bottom: 100px;">
    <!-- Top App Bar -->
    <header class="glass-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button onclick="App.goBack(); return false;" style="width: 24px; height: 24px; color: var(--clr-dark-green); background: none; border: none; padding: 0;">
          <i data-lucide="arrow-left"></i>
        </button>
        <h1 style="font-size: 20px; color: var(--clr-dark-green);">The Sanctuary</h1>
      </div>
      <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden;">
        <img src="https://i.pravatar.cc/100?img=1" alt="User Profile" style="width: 100%; height: 100%;">
      </div>
    </header>

    <!-- Scrollable Main Content -->
    <div style="padding: 96px 24px 24px; max-width: 512px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
      
      <!-- Hero Section -->
      <div class="card-info" style="display: flex; flex-direction: column; gap: 16px; background: var(--clr-primary); color: white;">
        <span style="font-size: 10px; font-weight: 800; letter-spacing: 2px; color: rgba(255,255,255,0.8);">EDUCATION MODULE</span>
        <h2 style="font-size: 28px; font-weight: 800; line-height: 1.2;">Maternal &<br>Newborn Care<br>Guide</h2>
        <p style="font-size: 15px; color: rgba(255,255,255,0.9); line-height: 1.5;">A comprehensive roadmap for your journey from pregnancy to the first steps of motherhood.</p>
        <i data-lucide="book-open" class="card-info-bg-icon" style="color: rgba(255,255,255,0.1);"></i>
      </div>

      <!-- The 10 Points List -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Point 01 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">01</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Antenatal Care</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px; margin-bottom: 12px;">Consistent monitoring is vital. Aim for 4+ scheduled visits to ensure safety. Involve partners in the process and learn to recognize danger signs like <span style="color: var(--clr-danger); font-weight: 600;">sudden bleeding or high fever</span>.</p>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--clr-bg-subtle); padding: 6px 12px; border-radius: var(--r-pill); color: var(--clr-text-muted); font-size: 12px; font-weight: 700;">
            <i data-lucide="users" style="width: 14px; height: 14px;"></i> PARTNER SUPPORT
          </div>
        </div>

        <!-- Point 02 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-purple);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-purple-bg); color: var(--clr-purple); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">02</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Delivery Planning</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Prepare for a facility birth with skilled attendants. Having a dedicated plan reduces stress and ensures immediate professional intervention if required for you or the baby.</p>
        </div>

        <!-- Point 03 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: #EAB308;"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: rgba(234,179,8,0.1); color: #EAB308; font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">03</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Mental Well-being</h3>
          </div>
          <p style="font-style: italic; color: var(--clr-text-muted); margin-bottom: 8px; border-left: 2px solid var(--clr-border-subtle); padding-left: 12px;">"Support networks are the foundation of a healthy recovery."</p>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Embrace shared parenting. Maternal health is not just physical; your emotional resilience thrives when responsibilities are distributed.</p>
        </div>

        <!-- Point 04 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">04</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Newborn Care</h3>
          </div>
          <img src="https://images.unsplash.com/photo-1544126592-807ade215a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Baby hand" style="width: 100%; height: 120px; object-fit: cover; border-radius: 12px; margin-bottom: 12px;">
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Prioritize skin-to-skin contact immediately after birth. This regulates the baby's temperature, heartbeat, and fosters deep emotional bonding.</p>
        </div>

        <!-- Point 05 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">05</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Exclusive Breastfeeding</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px; margin-bottom: 12px;">Commit to exclusive breastfeeding for the first 6 months. Colostrum, the first milk, acts as the baby's <span style="color: var(--clr-dark-green); font-weight: 600;">first natural vaccine</span>.</p>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--clr-green-10); padding: 6px 12px; border-radius: var(--r-pill); color: var(--clr-primary); font-size: 12px; font-weight: 700;">
            <i data-lucide="shield" style="width: 14px; height: 14px;"></i> ESSENTIAL IMMUNITY
          </div>
        </div>

        <!-- Point 06 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">06</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Feeding Transition</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Starting at 6 months, introduce soft, mashed, and nutrient-dense foods while continuing to breastfeed to support rapid growth.</p>
        </div>

        <!-- Point 07 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">07</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Micronutrients</h3>
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
            <span style="background: var(--clr-bg-subtle); border: 1px solid var(--clr-border-subtle); padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 700;">IRON</span>
            <span style="background: var(--clr-bg-subtle); border: 1px solid var(--clr-border-subtle); padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 700;">FOLATE</span>
            <span style="background: var(--clr-bg-subtle); border: 1px solid var(--clr-border-subtle); padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 700;">VIT A</span>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Essential for both mother and child to prevent anemia and support the development of the baby's immune system and vision.</p>
        </div>

        <!-- Point 08 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px; border: 2px solid var(--clr-danger);">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-danger);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: rgba(239,68,68,0.1); color: var(--clr-danger); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">08</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Danger Signs</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px; margin-bottom: 12px;">Seek immediate help if you notice: difficulty feeding, blue skin tint, or extreme lethargy. Trust your maternal instincts.</p>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(239,68,68,0.1); padding: 6px 12px; border-radius: var(--r-pill); color: var(--clr-danger); font-size: 12px; font-weight: 700;">
            <i data-lucide="alert-triangle" style="width: 14px; height: 14px;"></i> EMERGENCY PROTOCOL
          </div>
        </div>

        <!-- Point 09 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: #3B82F6;"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: rgba(59,130,246,0.1); color: #3B82F6; font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">09</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Registration</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px; margin-bottom: 12px;">Legal proof of identity is a human right. Complete digital birth registration early to ensure access to healthcare and education services.</p>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: #3B82F6; padding: 6px 12px; border-radius: var(--r-pill); color: white; font-size: 12px; font-weight: 700;">
            <i data-lucide="file-check" style="width: 14px; height: 14px;"></i> DIGITAL PORTAL
          </div>
        </div>

        <!-- Point 10 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">10</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Family Planning</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Healthy spacing of 3 years between births allows the mother's body to fully recover and ensures each child receives optimal care and nutrition.</p>
        </div>

      </div>

      <!-- Completion Area -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 16px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--clr-green-10); display: flex; justify-content: center; align-items: center;">
          <i data-lucide="check" style="width: 40px; height: 40px; color: var(--clr-primary);"></i>
        </div>
        <h4 style="font-size: 20px; font-weight: 700; color: var(--clr-text-heading);">Guide Completed</h4>
        <p style="color: var(--clr-text-muted); font-size: 15px;">Knowledge is your superpower.</p>
        <button class="btn btn-primary" style="margin-top: 8px;" onclick="App.goBack();">FINISH</button>
      </div>

    </div>
</div>
`,r=`<!-- pages/contractions.html -->
<div id="page-contractions" class="page">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                <i data-lucide="arrow-left"></i>
            </a>
            <h1 style="font-size: 20px; color: var(--clr-dark-green);">Contraction Timer</h1>
        </div>
    </header>

    <div style="padding: 96px 24px 100px; display: flex; flex-direction: column; align-items: center; height: 100%;">
        
        <div style="text-align: center; margin-bottom: 40px;">
            <p style="font-size: 16px; color: var(--clr-text-muted);">Track duration and frequency</p>
        </div>
        
        <!-- Large Interactive Circle (Purple theme for contractions) -->
        <div id="contraction-button" class="ripple" onclick="Kicks.toggleContraction()" style="
            width: 280px; height: 280px; 
            border-radius: 50%; 
            background: var(--clr-bg-white); 
            border: 8px solid var(--clr-purple-bg);
            box-shadow: 0 16px 40px rgba(139, 92, 246, 0.2);
            display: flex; flex-direction: column; 
            justify-content: center; align-items: center;
            margin-bottom: 40px; cursor: pointer;
            transition: all 0.3s ease;
        ">
            <h1 id="contraction-state-display" style="font-size: 32px; color: var(--clr-purple); line-height: 1.2;">Tap to<br>Start</h1>
            <p id="contraction-timer-display" style="font-size: 24px; color: var(--clr-text-heading); font-weight: 700; margin-top: 12px; display: none; font-variant-numeric: tabular-nums;">00:00</p>
        </div>
        
        <!-- Metrics -->
        <div style="display: flex; gap: 16px; width: 100%; margin-bottom: 48px;">
            <div class="card-white" style="flex: 1; text-align: center; padding: 16px;">
                <p class="micro-label" style="color: var(--clr-text-muted);">AVG DURATION</p>
                <p id="avg-duration" style="font-size: 20px; font-weight: 700; margin-top: 4px;">--</p>
            </div>
            <div class="card-white" style="flex: 1; text-align: center; padding: 16px;">
                <p class="micro-label" style="color: var(--clr-text-muted);">AVG FREQUENCY</p>
                <p id="avg-frequency" style="font-size: 20px; font-weight: 700; margin-top: 4px;">--</p>
            </div>
        </div>
        
        <!-- Rule of 5-1-1 Banner -->
        <div class="card-info w-full" style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2);">
            <div style="display: flex; gap: 12px; align-items: flex-start;">
                <i data-lucide="alert-circle" style="color: #F59E0B; width: 24px; height: 24px; flex-shrink: 0;"></i>
                <div>
                    <h4 style="font-weight: 700; color: #B45309; margin-bottom: 4px;">The 5-1-1 Rule</h4>
                    <p style="font-size: 14px; color: #92400E;">Go to the hospital if contractions are <b>5</b> minutes apart, last <b>1</b> minute, for <b>1</b> hour.</p>
                </div>
            </div>
        </div>

    </div>
</div>
`,i=`<!-- pages/dashboard.html -->
<div id="page-dashboard" class="page" style="padding-bottom: 100px;">
    
    <!-- Top Nav -->
    <header style="display: flex; justify-content: space-between; align-items: center; padding: 24px;">
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 48px; height: 48px; background: var(--clr-border-input); border-radius: 50%; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                <!-- Profile Image -->
                <i data-lucide="user" style="color: var(--clr-text-muted);"></i>
            </div>
            <div>
                <p style="font-size: 12px; color: var(--clr-text-muted); line-height: 1.2;">Good Morning,</p>
                <h2 id="dash-name" style="font-size: 20px; line-height: 1.2; color: var(--clr-text-heading);">Sarah</h2>
            </div>
        </div>
        <div style="display: flex; gap: 16px;">
            <a href="#/reminders" style="position: relative; color: var(--clr-text-body-alt2);">
                <i data-lucide="bell"></i>
                <span style="position: absolute; top: 0; right: 0; width: 8px; height: 8px; background: var(--clr-danger); border-radius: 50%;"></span>
            </a>
            <a href="#" style="color: var(--clr-text-body-alt2);">
                <i data-lucide="menu"></i>
            </a>
        </div>
    </header>

    <div style="padding: 0 24px;">
        
        <!-- Trimester-Aware Week Card -->
        <div class="card-white" style="margin-bottom: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px; background: var(--clr-bg-card); box-shadow: none;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p id="dash-trimester-label" class="micro-label" style="color: var(--clr-text-warm); margin-bottom: 4px;">SECOND TRIMESTER</p>
                    <h3 id="dash-week" style="font-size: 24px;">Week 24</h3>
                </div>
                <div style="font-size: 40px;">
                    <!-- Emoji representing baby size -->
                    <span id="dash-baby-size">🌽</span>
                </div>
            </div>
            
            <div>
                <div style="height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
                    <div id="dash-progress-bar" style="height: 100%; width: 60%; background: var(--clr-primary); border-radius: 4px;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--clr-text-muted);">
                    <span id="dash-progress-text">60%</span>
                    <span id="dash-days-left">112 days to go</span>
                </div>
            </div>
        </div>

        <!-- GESTOSIS Risk Banner -->
        <a href="#/risk-assessment" style="display: block; margin-bottom: 32px;">
            <div id="dash-risk-banner" style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: var(--clr-green-10); border-radius: 20px; border-left: 6px solid var(--clr-primary);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i data-lucide="activity" id="dash-risk-icon" style="color: var(--clr-primary);"></i>
                    <div>
                        <p style="font-size: 12px; font-weight: 700; color: var(--clr-text-body-alt);">GESTOSIS RISK SCORE</p>
                        <p id="dash-risk-text" style="font-size: 18px; font-weight: 700; color: var(--clr-primary);">Low (4)</p>
                    </div>
                </div>
                <i data-lucide="chevron-right" style="color: var(--clr-text-muted);"></i>
            </div>
        </a>

        <!-- Today's Vitals Strip -->
        <div style="margin-bottom: 32px;">
            <h3 style="font-size: 18px; margin-bottom: 16px;">Today's Vitals</h3>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                
                <!-- BP -->
                <div style="background: var(--clr-bg-card); border-radius: 24px; padding: 16px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                    <div style="width: 32px; height: 32px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-primary); margin-bottom: 8px; box-shadow: var(--shadow-xs);">
                        <i data-lucide="heart-pulse" style="width: 16px; height: 16px;"></i>
                    </div>
                    <p id="dash-vital-bp" style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading); line-height: 1.2;">118<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">/76</span></p>
                </div>
                
                <!-- Weight -->
                <div style="background: var(--clr-bg-card); border-radius: 24px; padding: 16px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                    <div style="width: 32px; height: 32px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #E8547A; margin-bottom: 8px; box-shadow: var(--shadow-xs);">
                        <i data-lucide="scale" style="width: 16px; height: 16px;"></i>
                    </div>
                    <p id="dash-vital-weight" style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading); line-height: 1.2;">65<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">kg</span></p>
                </div>
                
                <!-- Sleep/Glucose (Dynamic) -->
                <div style="background: var(--clr-bg-card); border-radius: 24px; padding: 16px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                    <div style="width: 32px; height: 32px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-purple); margin-bottom: 8px; box-shadow: var(--shadow-xs);">
                        <i data-lucide="moon" style="width: 16px; height: 16px;"></i>
                    </div>
                    <p id="dash-vital-sleep" style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading); line-height: 1.2;">7.5<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">hrs</span></p>
                </div>
                
            </div>
            
            <button class="btn btn-text w-full mt-4" style="border: 1px dashed var(--clr-border-device); border-radius: var(--r-pill);" onclick="document.getElementById('nav-log-btn').click();">
                <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
                Log a New Vital
            </button>
        </div>

        <!-- Bento Grid Apps -->
        <div style="margin-bottom: 32px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                
                <a href="#/log-bp" style="background: var(--clr-bg-card); border-radius: 32px; padding: 24px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-primary); box-shadow: var(--shadow-xs);">
                        <i data-lucide="activity"></i>
                    </div>
                    <h4 style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading);">Blood<br>Pressure</h4>
                </a>
                
                <a href="#/kick-counter" style="background: var(--clr-bg-card); border-radius: 32px; padding: 24px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-purple); box-shadow: var(--shadow-xs);">
                        <i data-lucide="baby"></i>
                    </div>
                    <h4 style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading);">Kick<br>Counter</h4>
                </a>
                
                <a href="#" onclick="AIBot.openChat(); return false;" style="background: var(--clr-bg-card); border-radius: 32px; padding: 24px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #E8547A; box-shadow: var(--shadow-xs);">
                        <i data-lucide="bot"></i>
                    </div>
                    <h4 style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading);">AI<br>Assistant</h4>
                </a>
                
                <a href="#/medical-history" style="background: var(--clr-bg-card); border-radius: 32px; padding: 24px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-info-brown); box-shadow: var(--shadow-xs);">
                        <i data-lucide="clipboard-list"></i>
                    </div>
                    <h4 style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading);">Medical<br>History</h4>
                </a>
                
            </div>
        </div>

        <!-- Quick Symptoms -->
        <div style="margin-bottom: 32px;">
            <h3 style="font-size: 18px; margin-bottom: 16px;">How are you feeling?</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                <button class="btn btn-secondary" style="height: 44px; padding: 0 20px; font-size: 14px; width: auto; font-weight: 500;" onclick="Vitals.logSymptom('headache', this)">Headache</button>
                <button class="btn btn-secondary" style="height: 44px; padding: 0 20px; font-size: 14px; width: auto; font-weight: 500;" onclick="Vitals.logSymptom('swelling', this)">Swelling</button>
                <button class="btn btn-secondary" style="height: 44px; padding: 0 20px; font-size: 14px; width: auto; font-weight: 500;" onclick="Vitals.logSymptom('nausea', this)">Nausea</button>
                <button class="btn btn-secondary" style="height: 44px; padding: 0 20px; font-size: 14px; width: auto; font-weight: 500;" onclick="Vitals.logSymptom('fatigue', this)">Fatigue</button>
            </div>
        </div>

        <!-- Medical Disclaimer -->
        <div style="margin-bottom: 32px; padding: 16px; background: rgba(0,0,0,0.03); border-radius: 16px; text-align: center;">
            <p style="font-size: 11px; color: var(--clr-text-muted); line-height: 1.4;">
                <i data-lucide="info" style="width: 12px; height: 12px; display: inline-block; margin-bottom: -2px;"></i>
                <strong>Medical Disclaimer:</strong> Gestation Guardian provides risk alerts for clinician review based on logged data. It does not provide medical diagnosis or replace professional medical advice. Always consult your healthcare provider.
            </p>
        </div>

    </div>
</div>


`,a=`<!-- pages/health-hub.html -->
<div id="page-health-hub" class="page">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                    <i data-lucide="arrow-left"></i>
                </a>
                <h1 style="font-size: 20px; color: var(--clr-dark-green);">Health Records</h1>
            </div>
            
            <button onclick="document.getElementById('nav-log-btn').click();" style="background: none; border: none; color: var(--clr-primary); font-weight: 600; display: flex; align-items: center; gap: 4px;">
                <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Log
            </button>
        </div>
    </header>

    <div style="padding: 80px 24px 100px; display: flex; flex-direction: column; gap: 16px;">
        <!-- Timeline will be injected here -->
        <div id="health-records-timeline" style="display: flex; flex-direction: column; gap: 16px;">
            <!-- Empty state -->
            <div id="health-records-empty" style="display: none; text-align: center; padding: 48px 24px; color: var(--clr-text-muted);">
                <i data-lucide="clipboard-list" style="width: 48px; height: 48px; margin: 0 auto 16px; opacity: 0.5;"></i>
                <p>No health records logged yet.</p>
                <button class="btn btn-primary mt-4" style="border-radius: var(--r-pill); display: inline-flex; width: auto; padding: 0 24px;" onclick="document.getElementById('nav-log-btn').click();">Log your first entry</button>
            </div>
        </div>
    </div>
</div>


`,o=`<!-- pages/kick-counter.html -->
<div id="page-kick-counter" class="page">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                <i data-lucide="arrow-left"></i>
            </a>
            <h1 style="font-size: 20px; color: var(--clr-dark-green);">Kick Counter</h1>
        </div>
    </header>

    <div style="padding: 96px 24px 100px; display: flex; flex-direction: column; align-items: center; height: 100%;">
        
        <div style="text-align: center; margin-bottom: 40px;">
            <p style="font-size: 16px; color: var(--clr-text-muted);">Aim for 10 kicks in 2 hours</p>
        </div>
        
        <!-- Large Interactive Circle -->
        <div id="kick-button" class="ripple" onclick="Kicks.logKick()" style="
            width: 280px; height: 280px; 
            border-radius: 50%; 
            background: var(--clr-bg-white); 
            border: 8px solid var(--clr-green-tint);
            box-shadow: 0 16px 40px rgba(109, 161, 113, 0.2);
            display: flex; flex-direction: column; 
            justify-content: center; align-items: center;
            margin-bottom: 40px; cursor: pointer;
            transition: transform 0.1s;
        ">
            <h1 id="kick-count-display" style="font-size: 96px; color: var(--clr-primary); line-height: 1;">0</h1>
            <p style="font-size: 18px; color: var(--clr-text-muted); font-weight: 600; margin-top: -8px;">KICKS</p>
        </div>
        
        <!-- Session Controls -->
        <div style="display: flex; justify-content: space-between; width: 100%; max-width: 320px; align-items: center;">
            <div style="text-align: left;">
                <p class="micro-label" style="color: var(--clr-text-muted);">SESSION TIME</p>
                <p id="kick-timer-display" style="font-size: 24px; font-weight: 700; color: var(--clr-text-heading); font-variant-numeric: tabular-nums;">00:00</p>
            </div>
            
            <button id="kick-control-btn" class="btn btn-secondary" style="width: auto; padding: 0 24px;" onclick="Kicks.toggleSession()">
                Start Session
            </button>
        </div>
        
        <!-- Recent Sessions List -->
        <div class="card-white w-full mt-6" style="margin-top: 48px;">
            <h3 style="font-size: 16px; margin-bottom: 16px;">Recent Sessions</h3>
            <div id="kick-history-list" style="display: flex; flex-direction: column; gap: 12px;">
                <!-- Populated by JS -->
                <p style="color: var(--clr-text-muted); text-align: center; font-size: 14px; padding: 16px 0;">No sessions yet today.</p>
            </div>
        </div>

    </div>
</div>


`,s=`<!-- pages/log-bp.html -->
<div id="page-log-bp" class="page">
    
    <!-- Top Glass Header -->
    <header class="glass-header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                <i data-lucide="arrow-left"></i>
            </a>
            <h1 style="font-size: 20px; color: var(--clr-dark-green);">Log Blood Pressure</h1>
        </div>
    </header>

    <div style="padding: 96px 24px 100px; max-width: 512px; margin: 0 auto;">
        
        <form onsubmit="event.preventDefault(); Vitals.saveBP();" style="display: flex; flex-direction: column; gap: 24px;">
            
            <div class="card-white">
                <div style="display: flex; gap: 16px; align-items: center; justify-content: center; margin-bottom: 24px;">
                    <!-- Systolic -->
                    <div style="text-align: center;">
                        <input type="number" id="bp-sys" class="input-form" style="width: 100px; height: 80px; font-size: 32px; font-weight: 700; text-align: center;" placeholder="120" required>
                        <p class="micro-label" style="margin-top: 8px; color: var(--clr-text-muted);">SYS (mmHg)</p>
                    </div>
                    
                    <div style="font-size: 32px; font-weight: 300; color: var(--clr-text-muted);">/</div>
                    
                    <!-- Diastolic -->
                    <div style="text-align: center;">
                        <input type="number" id="bp-dia" class="input-form" style="width: 100px; height: 80px; font-size: 32px; font-weight: 700; text-align: center;" placeholder="80" required>
                        <p class="micro-label" style="margin-top: 8px; color: var(--clr-text-muted);">DIA (mmHg)</p>
                    </div>
                </div>

                <!-- Pulse -->
                <div class="input-group" style="align-items: center;">
                    <label class="label text-center w-full">Pulse (BPM)</label>
                    <input type="number" id="bp-pulse" class="input-form" style="width: 120px; text-align: center;" placeholder="72">
                </div>
            </div>

            <!-- Position Selector -->
            <div>
                <label class="label" style="margin-bottom: 12px; display: block;">Position</label>
                <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: none; -webkit-overflow-scrolling: touch;">
                    <label style="flex: 0 0 120px;">
                        <input type="radio" name="bp-position" value="sitting" checked style="display: none;">
                        <div class="btn btn-secondary" style="height: 48px; border-radius: var(--r-card);">Sitting</div>
                    </label>
                    <label style="flex: 0 0 120px;">
                        <input type="radio" name="bp-position" value="lying" style="display: none;">
                        <div class="btn btn-secondary" style="height: 48px; border-radius: var(--r-card);">Lying</div>
                    </label>
                    <label style="flex: 0 0 120px;">
                        <input type="radio" name="bp-position" value="standing" style="display: none;">
                        <div class="btn btn-secondary" style="height: 48px; border-radius: var(--r-card);">Standing</div>
                    </label>
                </div>
            </div>

            <!-- Arm Selector -->
            <div>
                <label class="label" style="margin-bottom: 12px; display: block;">Arm Used</label>
                <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: none; -webkit-overflow-scrolling: touch;">
                    <label style="flex: 0 0 120px;">
                        <input type="radio" name="bp-arm" value="left" checked style="display: none;">
                        <div class="btn btn-secondary" style="height: 48px; border-radius: var(--r-card);">Left</div>
                    </label>
                    <label style="flex: 0 0 120px;">
                        <input type="radio" name="bp-arm" value="right" style="display: none;">
                        <div class="btn btn-secondary" style="height: 48px; border-radius: var(--r-card);">Right</div>
                    </label>
                </div>
            </div>

            <!-- Notes -->
            <div class="input-group">
                <label class="label">Notes (Optional)</label>
                <textarea id="bp-notes" class="input-form" style="height: 100px; resize: none; padding: 16px;" placeholder="How are you feeling?"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 16px;">
                Save Reading
            </button>
        </form>
    </div>
    
    <!-- CSS for radio button selection states -->
    <style>
        input[type="radio"]:checked + .btn-secondary {
            background: var(--clr-primary);
            color: white;
            border-color: var(--clr-primary);
        }
    </style>
</div>
`,c=`<!-- pages/log-vitals.html -->
<div id="page-log-vitals" class="page">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                <i data-lucide="arrow-left"></i>
            </a>
            <h1 style="font-size: 20px; color: var(--clr-dark-green);">Log Other Vitals</h1>
        </div>
    </header>

    <div style="padding: 96px 24px 100px; max-width: 512px; margin: 0 auto;">
        
        <form onsubmit="event.preventDefault(); Vitals.saveVitals();" style="display: flex; flex-direction: column; gap: 24px;">
            
            <p style="color: var(--clr-text-muted); text-align: center;">Only log what you measured today. Empty fields will be ignored.</p>
            
            <!-- Weight -->
            <div class="card-white" style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: rgba(232, 84, 122, 0.1); color: #E8547A; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <i data-lucide="scale"></i>
                </div>
                <div style="flex: 1;">
                    <label class="label" style="margin-bottom: 4px; display: block;">Weight</label>
                    <div style="position: relative;">
                        <input type="number" step="0.1" id="vital-weight" class="input-form" placeholder="65.0" style="padding-right: 48px;">
                        <span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); font-weight: 500;">kg</span>
                    </div>
                </div>
            </div>

            <!-- Sleep -->
            <div class="card-white" style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: var(--clr-purple-bg); color: var(--clr-purple); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <i data-lucide="moon"></i>
                </div>
                <div style="flex: 1;">
                    <label class="label" style="margin-bottom: 4px; display: block;">Sleep Duration</label>
                    <div style="position: relative;">
                        <input type="number" step="0.5" id="vital-sleep" class="input-form" placeholder="7.5" style="padding-right: 48px;">
                        <span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); font-weight: 500;">hrs</span>
                    </div>
                </div>
            </div>

            <!-- Temperature -->
            <div class="card-white" style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: rgba(245, 158, 11, 0.1); color: #F59E0B; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <i data-lucide="thermometer"></i>
                </div>
                <div style="flex: 1;">
                    <label class="label" style="margin-bottom: 4px; display: block;">Body Temperature</label>
                    <div style="position: relative;">
                        <input type="number" step="0.1" id="vital-temp" class="input-form" placeholder="98.6" style="padding-right: 48px;">
                        <span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); font-weight: 500;">°F</span>
                    </div>
                </div>
            </div>

            <!-- Blood Glucose (GDM Tracking) -->
            <div class="card-white" style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: rgba(239, 68, 68, 0.1); color: #EF4444; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <i data-lucide="droplet"></i>
                </div>
                <div style="flex: 1;">
                    <label class="label" style="margin-bottom: 4px; display: block;">Blood Glucose (Fasting/Post-meal)</label>
                    <div style="position: relative;">
                        <input type="number" id="vital-glucose" class="input-form" placeholder="e.g. 95" style="padding-right: 56px;">
                        <span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); font-weight: 500;">mg/dL</span>
                    </div>
                </div>
            </div>

            <!-- Urine Protein (Preeclampsia Tracking) -->
            <div class="card-white" style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: rgba(59, 130, 246, 0.1); color: #3B82F6; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <i data-lucide="test-tube"></i>
                </div>
                <div style="flex: 1;">
                    <label class="label" style="margin-bottom: 4px; display: block;">Urine Protein (Dipstick)</label>
                    <select id="vital-protein" class="input-form">
                        <option value="" selected>Not tested</option>
                        <option value="negative">Negative / Trace</option>
                        <option value="+1">+1 (Mild)</option>
                        <option value="+2">+2 (Moderate)</option>
                        <option value="+3">+3 (High/Severe)</option>
                    </select>
                </div>
            </div>

            <!-- Stress Slider -->
            <div class="card-white">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <div style="width: 48px; height: 48px; background: var(--clr-green-10); color: var(--clr-primary); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                        <i data-lucide="brain"></i>
                    </div>
                    <div>
                        <label class="label">Stress Level</label>
                        <p style="font-size: 14px; color: var(--clr-text-muted);">How overwhelmed do you feel today?</p>
                    </div>
                </div>
                
                <input type="range" id="vital-stress" min="1" max="10" value="3" style="width: 100%; margin: 16px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--clr-text-muted); font-weight: 500;">
                    <span>Calm (1)</span>
                    <span>High (10)</span>
                </div>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 16px;">
                Save Vitals
            </button>
        </form>
    </div>
</div>
`,l=`<!-- pages/medical-history.html -->
<div id="page-medical-history" class="page">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                    <i data-lucide="arrow-left"></i>
                </a>
                <h1 style="font-size: 20px; color: var(--clr-dark-green);">Medical History</h1>
            </div>
            
            <a href="#" style="color: var(--clr-primary);">
                <i data-lucide="share"></i>
            </a>
        </div>
    </header>

    <div style="padding: 80px 24px 100px;">
        
        <div style="margin-bottom: 24px;">
            <p style="color: var(--clr-text-muted); font-size: 14px; margin-bottom: 16px;">This data is securely stored and used to inform your GESTOSIS risk score. Share this with your doctor.</p>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 18px;">Pregnancy Profile</h3>
                <button class="btn btn-text" style="color: var(--clr-primary); font-size: 14px; font-weight: 600;" onclick="UI.showToast('Edit mode enabled')">Edit</button>
            </div>
        </div>

        <div class="card-white" style="margin-bottom: 24px; padding: 0; overflow: hidden;">
            
            <!-- Row 1 -->
            <div style="padding: 16px; border-bottom: 1px solid var(--clr-divider); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="font-size: 14px; font-weight: 600; color: var(--clr-text-heading);">First Pregnancy</p>
                    <p style="font-size: 12px; color: var(--clr-text-muted);">Nulliparity</p>
                </div>
                <!-- Toggle Switch styling via CSS -->
                <label class="toggle-switch">
                    <input type="checkbox" id="hist-first-preg">
                    <span class="slider"></span>
                </label>
            </div>
            
            <!-- Row 2 -->
            <div style="padding: 16px; border-bottom: 1px solid var(--clr-divider); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="font-size: 14px; font-weight: 600; color: var(--clr-text-heading);">Multiple Gestation</p>
                    <p style="font-size: 12px; color: var(--clr-text-muted);">Twins, triplets, etc.</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="hist-multiple">
                    <span class="slider"></span>
                </label>
            </div>

            <!-- Row 3 -->
            <div style="padding: 16px; border-bottom: 1px solid var(--clr-divider); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="font-size: 14px; font-weight: 600; color: var(--clr-text-heading);">Prior Preeclampsia</p>
                    <p style="font-size: 12px; color: var(--clr-text-muted);">In a previous pregnancy</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="hist-prior-pe">
                    <span class="slider"></span>
                </label>
            </div>

            <!-- Row 4 -->
            <div style="padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="font-size: 14px; font-weight: 600; color: var(--clr-text-heading);">Chronic Hypertension</p>
                    <p style="font-size: 12px; color: var(--clr-text-muted);">Pre-existing high BP</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="hist-chronic-htn">
                    <span class="slider"></span>
                </label>
            </div>

        </div>

        <h3 style="font-size: 18px; margin-bottom: 16px;">Vitals History</h3>
        
        <div class="card-white" style="padding: 0; overflow: hidden; margin-bottom: 24px;">
            <div class="tab-switcher" style="margin: 16px;">
                <a href="#" class="tab-btn active">Blood Pressure</a>
                <a href="#" class="tab-btn">Weight</a>
            </div>
            
            <!-- Sparkline Chart -->
            <div style="padding: 16px 16px 24px;">
                <canvas id="bp-history-chart" width="300" height="120" style="width: 100%; height: 120px;"></canvas>
            </div>
            
            <div style="padding: 16px; border-top: 1px solid var(--clr-divider); background: var(--clr-bg-card);">
                <p style="font-size: 12px; color: var(--clr-text-muted); text-align: center;">Recent Logs</p>
                <div id="hist-bp-logs" style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
                    <!-- Populated by JS -->
                </div>
            </div>
        </div>

    </div>

    <style>
        /* Simple toggle switch CSS */
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
        }
        .toggle-switch input { 
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--clr-border-input);
            transition: .4s;
            border-radius: 24px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        input:checked + .slider {
            background-color: var(--clr-primary);
        }
        input:checked + .slider:before {
            transform: translateX(24px);
        }
    </style>
</div>


`,u=`<!-- pages/onboarding.html -->
<div id="page-onboarding" class="page active">
    <!-- Background image container (simulated with CSS for now) -->
    <div class="onboarding-bg" style="background-image: url('assets/images/maternity-bg.jpg'); background-color: var(--clr-green-tint);"></div>
    
    <!-- Gradient overlay for text legibility -->
    <div class="onboarding-overlay"></div>
    
    <!-- Main content container -->
    <div class="onboarding-content">
        <!-- Top branding area -->
        <div class="onboarding-header">
            <!-- Space for logo if we add it back, but spec says "Typography Branding (Logo Image Removed)" -->
            <h1>Gestation<br>Guardian</h1>
            <p class="subtitle">Your trusted companion for a safer, healthier pregnancy journey.</p>
        </div>
        
        <!-- Bottom actions area -->
        <div class="onboarding-actions">
            <!-- Micro label divider -->
            <div class="divider-with-text">
                <span>Empowering Every Step</span>
            </div>
            
            <a href="#/signup" class="btn btn-primary">
                Get Started
                <i data-lucide="arrow-right"></i>
            </a>
            
            <a href="#/signin" class="btn btn-secondary">
                Sign In
            </a>
            
            <!-- Footer Quote -->
            <div class="card-quote mt-6">
                <i data-lucide="quote" style="color: var(--clr-primary); align-self: flex-start; margin-top: 4px;"></i>
                <p>A mother's journey is the greatest adventure. Let us watch over you.</p>
            </div>
        </div>
    </div>
</div>
`,d=`<!-- pages/profile.html -->
<div id="page-profile" class="page" style="padding-bottom: 100px;">
    <!-- Top App Bar -->
    <header class="glass-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button onclick="App.goBack(); return false;" style="width: 24px; height: 24px; color: var(--clr-dark-green); background: none; border: none; padding: 0;">
          <i data-lucide="arrow-left"></i>
        </button>
        <h1 style="font-size: 20px; color: var(--clr-dark-green);">Profile</h1>
      </div>
    </header>

    <!-- Scrollable Main Content -->
    <div style="padding: 96px 24px 24px; max-width: 512px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
      
      <!-- Profile Header Area -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 8px;">
        <div style="position: relative; width: 96px; height: 96px;">
          <img src="https://i.pravatar.cc/150?img=47" alt="User Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid white; box-shadow: var(--shadow-sm);">
          <div style="position: absolute; bottom: 0; right: 0; background: var(--clr-primary); width: 28px; height: 28px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white;">
            <i data-lucide="shield-check" style="color: white; width: 14px; height: 14px;"></i>
          </div>
        </div>
        <h2 style="font-size: 24px; color: var(--clr-text-heading); font-weight: 700;">Sarah</h2>
        <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--clr-green-10); padding: 6px 12px; border-radius: var(--r-pill); color: var(--clr-primary); font-size: 14px; font-weight: 600;">
          <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
          <span>Week 24</span>
        </div>
      </div>

      <!-- Personal Details Card -->
      <div class="card-white" style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <i data-lucide="user" style="color: var(--clr-primary); width: 20px; height: 20px;"></i>
          <h3 style="font-size: 18px; color: var(--clr-text-heading);">Personal Details</h3>
        </div>
        
        <div class="input-group">
          <label class="label">Full Name</label>
          <input type="text" value="Sarah" class="input-form">
        </div>

        <div style="display: flex; gap: 16px;">
          <div class="input-group" style="flex: 1;">
            <label class="label">Age</label>
            <input type="number" value="28" class="input-form">
          </div>
          <div class="input-group" style="flex: 1;">
            <label class="label">Date of Birth</label>
            <input type="text" value="12/05/1995" class="input-form">
          </div>
        </div>

        <div class="input-group">
          <label class="label">Primary Phone Number</label>
          <div style="position: relative;">
            <span style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); font-weight: 500;">+91</span>
            <input type="tel" value="9876543210" class="input-form" style="padding-left: 56px;">
          </div>
        </div>

        <div class="input-group">
          <label class="label">Email Address</label>
          <input type="email" value="sarah@example.com" class="input-form">
        </div>
      </div>

      <!-- Health & Preferences Card -->
      <div class="card-white" style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <i data-lucide="activity" style="color: var(--clr-primary); width: 20px; height: 20px;"></i>
          <h3 style="font-size: 18px; color: var(--clr-text-heading);">Health & Preferences</h3>
        </div>

        <div class="input-group">
          <label class="label">Blood Group</label>
          <select class="input-form">
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>O+</option>
          </select>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
        <button class="btn btn-primary" onclick="UI.showToast('Profile Saved'); App.goBack();">Save Changes</button>
        <button class="btn btn-secondary" onclick="UI.showToast('Exporting data...')">
          <i data-lucide="download" style="width: 18px; height: 18px;"></i> Export Health Data (JSON)
        </button>
        <button class="btn btn-text" onclick="window.location.hash='#/onboarding'" style="color: var(--clr-danger); margin-top: 8px;">
          <i data-lucide="log-out" style="width: 18px; height: 18px;"></i> Sign Out
        </button>
      </div>

    </div>
</div>
`,f=`<!-- pages/reminders.html -->
<div id="page-reminders" class="page" style="padding-bottom: 100px;">
    <!-- Top App Bar -->
    <header class="glass-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button onclick="App.goBack(); return false;" style="width: 24px; height: 24px; color: var(--clr-dark-green); background: none; border: none; padding: 0;">
          <i data-lucide="arrow-left"></i>
        </button>
        <h1 style="font-size: 20px; color: var(--clr-dark-green);">Health Reminders</h1>
      </div>
    </header>

    <!-- Scrollable Main Content -->
    <div style="padding: 96px 24px 24px; max-width: 512px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
      
      <!-- Hero / Add Reminder CTA -->
      <div class="card-info" style="display: flex; flex-direction: column; gap: 16px;">
        <h2 style="font-size: 24px; color: var(--clr-text-heading); font-weight: 700; z-index: 1;">Organize your wellness routine</h2>
        <button class="btn btn-primary" style="z-index: 1;" onclick="document.getElementById('add-reminder-modal').style.display='flex'">
          <i data-lucide="plus"></i> Add Reminder
        </button>
        <i data-lucide="bell" class="card-info-bg-icon"></i>
      </div>

      <!-- Active Schedules Section -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 14px; font-weight: 700; color: var(--clr-text-body-alt); letter-spacing: 1px;">ACTIVE SCHEDULES</h3>
          <button class="btn-text" id="btn-clear-reminders">Edit all</button>
        </div>

        <div id="reminders-list" style="display: flex; flex-direction: column; gap: 12px;">
          <!-- Card 1 -->
          <div class="card-white" style="display: flex; justify-content: space-between; align-items: center; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 40px; height: 40px; background: var(--clr-green-10); border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-primary);">
                <i data-lucide="pill"></i>
              </div>
              <div>
                <h4 style="font-size: 16px; font-weight: 600; color: var(--clr-text-heading);">Prenatal Vitamins</h4>
                <p style="font-size: 14px; color: var(--clr-text-muted); margin-top: 2px;">09:00 AM - Daily</p>
              </div>
            </div>
            <!-- Toggle Switch Mock -->
            <div style="width: 48px; height: 28px; background: var(--clr-primary); border-radius: 14px; position: relative; cursor: pointer;">
              <div style="width: 24px; height: 24px; background: white; border-radius: 50%; position: absolute; top: 2px; right: 2px; box-shadow: var(--shadow-sm);"></div>
            </div>
          </div>
          
          <!-- Card 2 -->
          <div class="card-white" style="display: flex; justify-content: space-between; align-items: center; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 40px; height: 40px; background: rgba(59, 130, 246, 0.1); border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #3B82F6;">
                <i data-lucide="droplet"></i>
              </div>
              <div>
                <h4 style="font-size: 16px; font-weight: 600; color: var(--clr-text-heading);">Hydration</h4>
                <p style="font-size: 14px; color: var(--clr-text-muted); margin-top: 2px;">02:00 PM - Daily</p>
              </div>
            </div>
            <div style="width: 48px; height: 28px; background: var(--clr-border-subtle); border-radius: 14px; position: relative; cursor: pointer;">
              <div style="width: 24px; height: 24px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; box-shadow: var(--shadow-sm);"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Add Reminder Modal -->
    <div id="add-reminder-modal" style="display:none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: flex-end;">
      <div style="background: var(--clr-bg-white); width: 100%; border-radius: 32px 32px 0 0; padding: 32px 24px 64px; box-shadow: 0 -10px 40px rgba(0,0,0,0.1);">
        <h3 style="font-size: 20px; font-weight: 700; color: var(--clr-text-heading); margin-bottom: 24px; text-align: center;">New Reminder</h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="input-group">
            <label class="label">Reminder Name</label>
            <input type="text" id="new-reminder-title" class="input-form" placeholder="e.g. Prenatal Vitamins">
          </div>
          <div class="input-group">
            <label class="label">Time</label>
            <input type="time" id="new-reminder-time" class="input-form">
          </div>
        </div>
        
        <div style="display: flex; gap: 12px; margin-top: 32px;">
          <button class="btn btn-secondary" style="flex: 1; height: 56px;" onclick="document.getElementById('add-reminder-modal').style.display='none'">Cancel</button>
          <button class="btn btn-primary" style="flex: 1; height: 56px;" onclick="document.getElementById('add-reminder-modal').style.display='none'; UI.showToast('Reminder saved', 'success')">Save</button>
        </div>
      </div>
    </div>
</div>
`,p=`<!-- pages/risk-assessment.html -->
<div id="page-risk-assessment" class="page" style="background: var(--clr-bg-warm);">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
            <h1 style="font-size: 18px; color: var(--clr-dark-green);">Health Profile</h1>
        </div>
    </header>

    <div style="padding: 96px 24px 100px; max-width: 600px; margin: 0 auto;">
        
        <div style="text-align: center; margin-bottom: 32px;">
            <i data-lucide="clipboard-plus" style="width: 48px; height: 48px; color: var(--clr-primary); margin-bottom: 12px;"></i>
            <h2 style="font-size: 24px;">Let's establish your baseline</h2>
            <p style="color: var(--clr-text-muted); font-size: 14px; margin-top: 8px;">Please answer these 12 questions to calculate your initial GESTOSIS risk score. Your data is secure.</p>
        </div>
        
        <form id="assessment-form" onsubmit="event.preventDefault(); Assessment.submit();" style="display: flex; flex-direction: column; gap: 24px;">
            
            <!-- Q1: Age -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">1. What is your age?</label>
                <input type="number" id="q-age" class="input-form" placeholder="e.g., 28" required>
            </div>

            <!-- Q2: First Pregnancy -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">2. Is this your first pregnancy?</label>
                <div style="display: flex; gap: 12px;">
                    <label style="flex: 1;">
                        <input type="radio" name="q-first-preg" value="yes" style="display: none;" required>
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">Yes</div>
                    </label>
                    <label style="flex: 1;">
                        <input type="radio" name="q-first-preg" value="no" style="display: none;">
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">No</div>
                    </label>
                </div>
            </div>

            <!-- Q3: Prior PE -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">3. Have you had preeclampsia in a previous pregnancy?</label>
                <div style="display: flex; gap: 12px;">
                    <label style="flex: 1;">
                        <input type="radio" name="q-prior-pe" value="yes" style="display: none;" required>
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">Yes</div>
                    </label>
                    <label style="flex: 1;">
                        <input type="radio" name="q-prior-pe" value="no" style="display: none;">
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">No</div>
                    </label>
                </div>
            </div>

            <!-- Q4: Chronic HTN -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">4. Do you have pre-existing (chronic) high blood pressure?</label>
                <div style="display: flex; gap: 12px;">
                    <label style="flex: 1;">
                        <input type="radio" name="q-chronic-htn" value="yes" style="display: none;" required>
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">Yes</div>
                    </label>
                    <label style="flex: 1;">
                        <input type="radio" name="q-chronic-htn" value="no" style="display: none;">
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">No</div>
                    </label>
                </div>
            </div>

            <!-- Q5: Diabetes -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">5. Do you have diabetes?</label>
                <select id="q-diabetes" class="input-form" required>
                    <option value="" disabled selected>Select an option</option>
                    <option value="none">No</option>
                    <option value="gestational">Gestational Diabetes (Pregnancy-induced)</option>
                    <option value="type1_2">Type 1 or Type 2 Diabetes</option>
                </select>
            </div>

            <!-- Q6: Family History -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">6. Is there a family history of preeclampsia or hypertension?</label>
                <div style="display: flex; gap: 12px;">
                    <label style="flex: 1;">
                        <input type="radio" name="q-family" value="yes" style="display: none;" required>
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">Yes</div>
                    </label>
                    <label style="flex: 1;">
                        <input type="radio" name="q-family" value="no" style="display: none;">
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">No</div>
                    </label>
                </div>
            </div>

            <!-- Q7: BMI -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">7. What is your height and pre-pregnancy weight?</label>
                <div style="display: flex; gap: 16px;">
                    <div style="flex: 1; position: relative;">
                        <input type="number" id="q-height" class="input-form" placeholder="160" required style="padding-right: 40px;">
                        <span style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted);">cm</span>
                    </div>
                    <div style="flex: 1; position: relative;">
                        <input type="number" id="q-weight" class="input-form" placeholder="65" required style="padding-right: 40px;">
                        <span style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted);">kg</span>
                    </div>
                </div>
            </div>

            <!-- Q8: Booking BP -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">8. What was your booking (initial) blood pressure?</label>
                <div style="display: flex; gap: 16px; align-items: center;">
                    <input type="number" id="q-booking-sys" class="input-form" placeholder="SYS" style="flex: 1; text-align: center;">
                    <span style="color: var(--clr-text-muted);">/</span>
                    <input type="number" id="q-booking-dia" class="input-form" placeholder="DIA" style="flex: 1; text-align: center;">
                </div>
                <p style="font-size: 12px; color: var(--clr-text-muted); margin-top: 8px;">Leave blank if unknown.</p>
            </div>

            <!-- Q9: Current BP -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">9. What is your most recent blood pressure?</label>
                <div style="display: flex; gap: 16px; align-items: center;">
                    <input type="number" id="q-current-sys" class="input-form" placeholder="SYS" style="flex: 1; text-align: center;" required>
                    <span style="color: var(--clr-text-muted);">/</span>
                    <input type="number" id="q-current-dia" class="input-form" placeholder="DIA" style="flex: 1; text-align: center;" required>
                </div>
            </div>

            <!-- Q10: Symptoms -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">10. Are you currently experiencing any of these symptoms?</label>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <label class="checkbox-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                        <input type="checkbox" name="q-symptoms" value="severe_headache" style="width: 20px; height: 20px; accent-color: var(--clr-primary);">
                        <span>Severe headache</span>
                    </label>
                    <label class="checkbox-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                        <input type="checkbox" name="q-symptoms" value="vision_changes" style="width: 20px; height: 20px; accent-color: var(--clr-primary);">
                        <span>Visual disturbances (blurriness, spots)</span>
                    </label>
                    <label class="checkbox-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                        <input type="checkbox" name="q-symptoms" value="ruq_pain" style="width: 20px; height: 20px; accent-color: var(--clr-primary);">
                        <span>Upper abdominal pain</span>
                    </label>
                    <label class="checkbox-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                        <input type="checkbox" name="q-symptoms" value="swelling" style="width: 20px; height: 20px; accent-color: var(--clr-primary);">
                        <span>Sudden swelling of face or hands</span>
                    </label>
                </div>
            </div>

            <!-- Q11: Weight Gain -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">11. Have you experienced rapid weight gain recently (≥2kg/week)?</label>
                <div style="display: flex; gap: 12px;">
                    <label style="flex: 1;">
                        <input type="radio" name="q-weight-gain" value="yes" style="display: none;" required>
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">Yes</div>
                    </label>
                    <label style="flex: 1;">
                        <input type="radio" name="q-weight-gain" value="no" style="display: none;">
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">No</div>
                    </label>
                </div>
            </div>

            <!-- Q12: Proteinuria -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">12. Do you have protein in your urine (Proteinuria)?</label>
                <select id="q-protein" class="input-form" required>
                    <option value="" disabled selected>Select from latest test</option>
                    <option value="negative">Negative</option>
                    <option value="trace">Trace</option>
                    <option value="1plus">1+</option>
                    <option value="2plus">2+</option>
                    <option value="3plus">3+ or higher</option>
                    <option value="unknown">Not Tested / Unknown</option>
                </select>
            </div>

            <button type="submit" class="btn btn-primary" style="height: 56px; font-size: 16px; margin-top: 16px;">
                Complete Setup
            </button>
        </form>
    </div>

    <!-- Styles for custom radio buttons -->
    <style>
        input[type="radio"]:checked + .q-radio-btn {
            background: var(--clr-primary);
            color: white;
            border-color: var(--clr-primary);
        }
    </style>
</div>
`,m=`<!-- pages/signin.html -->
<div id="page-signin" class="page">
    <div class="signin-bg"></div>
    
    <div class="signin-content">
        <!-- Branding Header -->
        <div class="brand-header">
            <!-- Use a placeholder div for logo if image not available -->
            <div style="width: 96px; height: 96px; background: var(--clr-primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 24px;">
                <i data-lucide="shield" style="color: white; width: 48px; height: 48px;"></i>
            </div>
            <h1>Gestation Guardian</h1>
            <p style="font-weight: 600; font-size: 16px; color: var(--clr-text-body-alt);">Monitor. Protect. Nurture.</p>
        </div>

        <!-- Glass Card for Auth -->
        <div class="card-glass w-full">
            
            <!-- Tab Switcher (Simulated links for SPA) -->
            <div class="tab-switcher mb-6" style="margin-bottom: 32px;">
                <a href="#/signin" class="tab-btn active">Sign In</a>
                <a href="#/signup" class="tab-btn">Sign Up</a>
            </div>

            <form id="form-signin" onsubmit="event.preventDefault(); Auth.handleSignIn();">
                <!-- Form Fields Container -->
                <div style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 32px;">
                    
                    <!-- Email Field -->
                    <div class="input-group">
                        <label class="label">Email Address</label>
                        <div style="position: relative;">
                            <i data-lucide="mail" class="input-icon-left"></i>
                            <input type="email" id="signin-email" class="input-auth" placeholder="name@example.com" required>
                        </div>
                    </div>

                    <!-- Password Field -->
                    <div class="input-group">
                        <div class="label-row" style="padding: 0;">
                            <label class="label">Password</label>
                            <a href="#" class="btn-text-link">Forgot?</a>
                        </div>
                        <div style="position: relative;">
                            <i data-lucide="lock" class="input-icon-left"></i>
                            <input type="password" id="signin-password" class="input-auth" placeholder="••••••••" required>
                            <button type="button" class="input-icon-right" onclick="Auth.togglePassword('signin-password')">
                                <i data-lucide="eye"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
                <button type="submit" class="btn btn-action">
                    Sign In
                </button>
            </form>

            <div class="divider-with-text mt-6 mb-6" style="margin: 32px 0;">
                <span>OR</span>
            </div>

            <!-- Social Sign-in -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <button type="button" class="btn btn-google">
                    <i data-lucide="chrome" style="color: #4285F4;"></i> <!-- Fallback for Google logo -->
                    Continue with Google
                </button>
                <button type="button" class="btn btn-apple">
                    <i data-lucide="apple"></i>
                    Continue with Apple
                </button>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
            <p style="font-weight: 700; font-size: 16px; color: var(--clr-text-primary);">
                Don't have an account? <br>
                <a href="#/signup" style="color: var(--clr-primary);">Create one</a>
            </p>
        </div>
    </div>
</div>
`,h=`<!-- pages/signup.html -->
<div id="page-signup" class="page">
    
    <div class="signup-content">
        <!-- Solid White Card -->
        <div class="card-white w-full" style="padding-top: 40px;">
            
            <div class="signup-header">
                <!-- Placeholder for logo -->
                <div style="width: 80px; height: 80px; background: var(--clr-primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 12px;">
                    <i data-lucide="shield" style="color: white; width: 40px; height: 40px;"></i>
                </div>
                <h2>Create Your<br>Safe Space</h2>
                <p style="font-weight: 500; font-size: 16px; color: var(--clr-text-body); margin-top: 12px;">Let's get started on your journey</p>
            </div>

            <form id="form-signup" class="signup-form" onsubmit="event.preventDefault(); Auth.handleSignUp();">
                
                <!-- Full Name -->
                <div class="input-group">
                    <label class="label">Full Name</label>
                    <div style="position: relative;">
                        <input type="text" id="su-name" class="input-form" placeholder="Eleanor Vance" required>
                        <i data-lucide="user" class="input-icon-right" style="pointer-events: none;"></i>
                    </div>
                </div>

                <!-- Phone & OTP Section -->
                <div class="input-group">
                    <label class="label">Phone Number</label>
                    <div style="display: flex; gap: 8px;">
                        <input type="tel" id="su-phone" class="input-form" style="flex: 1;" placeholder="+91 98765 43210" required>
                        <button type="button" class="btn btn-primary" style="width: auto; padding: 0 24px; height: 58px; font-size: 14px;" onclick="Auth.sendOTP()">Send</button>
                    </div>
                </div>

                <div id="otp-section" class="input-group hidden">
                    <label class="label">Enter OTP</label>
                    <div class="otp-group">
                        <input type="text" maxlength="1" class="input-otp" data-index="1">
                        <input type="text" maxlength="1" class="input-otp" data-index="2">
                        <input type="text" maxlength="1" class="input-otp" data-index="3">
                        <input type="text" maxlength="1" class="input-otp" data-index="4">
                    </div>
                </div>

                <!-- Email -->
                <div class="input-group">
                    <label class="label">Email</label>
                    <input type="email" id="su-email" class="input-form" placeholder="name@example.com" required>
                </div>

                <!-- Password -->
                <div class="input-group">
                    <label class="label">Password</label>
                    <div style="position: relative;">
                        <input type="password" id="su-password" class="input-form" placeholder="Create a password" required>
                        <button type="button" class="input-icon-right" onclick="Auth.togglePassword('su-password')">
                            <i data-lucide="eye"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Date of Birth -->
                <div class="input-group">
                    <label class="label">Date of Birth</label>
                    <input type="date" id="su-dob" class="input-form" required>
                </div>

                <!-- LMP / EDD -->
                <div class="input-group">
                    <label class="label">Last Menstrual Period (LMP)</label>
                    <input type="date" id="su-lmp" class="input-form" onchange="Auth.calculateEDD()" required>
                    <p id="su-edd-display" style="font-size: 12px; color: var(--clr-text-muted); margin-top: 4px;"></p>
                </div>

                <!-- Blood Group -->
                <div class="input-group">
                    <label class="label">Blood Group</label>
                    <select id="su-blood" class="input-form" required>
                        <option value="" disabled selected>Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                <button type="submit" class="btn btn-action" style="margin-top: 16px;">
                    Continue to Health Profile
                </button>
            </form>
            
            <div style="text-align: center; margin-top: 24px;">
                <p style="font-size: 14px; color: var(--clr-text-muted);">
                    Already have an account? <a href="#/signin" style="color: var(--clr-primary); font-weight: 700;">Sign In</a>
                </p>
            </div>
            
        </div>
    </div>
</div>
`,g=window.location.protocol===`file:`?`http://10.0.2.2:3000/api`:`/api`,_={KEYS:{PROFILE:`gg_profile`,BP_LOGS:`gg_bp_logs`,VITALS_LOGS:`gg_vitals_logs`,GLUCOSE_LOGS:`gg_glucose_logs`,URINE_LOGS:`gg_urine_logs`,HB_LOGS:`gg_hb_logs`,KICKS:`gg_kick_sessions`,CONTRACTIONS:`gg_contractions`,SYMPTOMS:`gg_symptoms`,HISTORY:`gg_medical_history`,REMINDERS:`gg_reminders`,SETTINGS:`gg_settings`},userId:`default_user_123`,getSyncQueue(){let e=localStorage.getItem(`gg_sync_queue`);return e?JSON.parse(e):[]},saveSyncQueue(e){localStorage.setItem(`gg_sync_queue`,JSON.stringify(e))},async processSyncQueue(){if(!navigator.onLine)return;let e=this.getSyncQueue();if(e.length!==0){console.log(`Processing ${e.length} queued operations...`);try{(await fetch(`${g}/sync`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({operations:e})})).ok&&(console.log(`Sync successful, clearing queue.`),this.saveSyncQueue([]))}catch(e){console.error(`Sync failed, will retry later.`,e)}}},initSyncEngine(){window.addEventListener(`online`,()=>{console.log(`Back online. Triggering sync...`),this.processSyncQueue()}),setTimeout(()=>this.processSyncQueue(),2e3)},async _get(e,t=null){if(navigator.onLine)try{let t=await fetch(`${g}/users/${this.userId}/collections/${e}`);if(t.ok){let n=await t.json();return localStorage.setItem(e,JSON.stringify(n)),n}}catch(t){console.warn(`Network fetch failed for ${e}, falling back to local:`,t)}try{let n=localStorage.getItem(e);if(!n)return t;try{return JSON.parse(n)}catch{return JSON.parse(atob(n))}}catch(n){return console.error(`Error reading ${e} from storage:`,n),t}},async _set(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch(t){console.error(`Error saving ${e} to local storage:`,t)}if(navigator.onLine)try{if((await fetch(`${g}/users/${this.userId}/collections/${e}`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)})).ok)return}catch(t){console.warn(`Network write failed for ${e}, queuing for offline sync:`,t)}let n=this.getSyncQueue().filter(t=>t.key!==e);n.push({userId:this.userId,key:e,data:t,timestamp:Date.now()}),this.saveSyncQueue(n)},_generateId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)},async getProfile(){return await this._get(this.KEYS.PROFILE)},async saveProfile(e){await this._set(this.KEYS.PROFILE,e)},async getLogs(e){let t=await this._get(e,[]);return!t||Object.keys(t).length===0?[]:t},async addLog(e,t){let n=await this.getLogs(e),r={id:this._generateId(),timestamp:new Date().toISOString(),...t};return n.unshift(r),await this._set(e,n),r},async getLatestBP(){let e=await this.getLogs(this.KEYS.BP_LOGS);return e.length>0?e[0]:null},async getLatestUrine(){let e=await this.getLogs(this.KEYS.URINE_LOGS);return e.length>0?e[0]:null},async getTodaySymptoms(){let e=await this.getLogs(this.KEYS.SYMPTOMS),t=new Date().toDateString();return e.filter(e=>new Date(e.timestamp).toDateString()===t)},async getCurrentGestationalWeek(){let e=await this.getProfile();if(!e||!e.lmp)return 0;let t=new Date(e.lmp),n=Math.abs(new Date-t),r=Math.floor(n/(1e3*60*60*24)),i=Math.floor(r/7);return Math.min(Math.max(i,0),42)},async getCurrentTrimester(){let e=await this.getCurrentGestationalWeek();return e<13?1:e<27?2:3},async clearAll(){Object.values(this.KEYS).forEach(e=>localStorage.removeItem(e))}};window.Store=_;var v={updateBottomNav(e){let t=document.getElementById(`bottom-nav`);if(t){if([`onboarding`,`signin`,`signup`,`bluetooth`].includes(e)){t.classList.add(`hidden`);return}t.classList.remove(`hidden`),document.querySelectorAll(`.nav-item`).forEach(t=>{t.getAttribute(`data-target`)===e?t.classList.add(`active`):t.classList.remove(`active`)})}},showToast(e,t=`success`,n=3e3){let r=document.getElementById(`toast-container`);if(!r)return;let i=document.createElement(`div`);i.className=`toast ${t}`,i.innerHTML=`
            <i data-lucide="${t===`success`?`check-circle`:`alert-triangle`}"></i>
            <span>${e}</span>
        `,r.appendChild(i),window.lucide&&window.lucide.createIcons({root:i}),requestAnimationFrame(()=>{i.classList.add(`show`)}),setTimeout(()=>{i.classList.remove(`show`),setTimeout(()=>i.remove(),300)},n)},initBottomSheet(){let e=document.getElementById(`log-sheet-overlay`),t=document.getElementById(`nav-log-btn`),n=document.querySelector(`.bottom-sheet`);if(!e||!t||!n)return;t.addEventListener(`click`,t=>{t.preventDefault(),e.classList.remove(`hidden`)}),e.addEventListener(`click`,t=>{t.target===e&&e.classList.add(`hidden`)});let r=0;n.addEventListener(`touchstart`,e=>{r=e.touches[0].clientY},{passive:!0}),n.addEventListener(`touchmove`,t=>{t.touches[0].clientY-r>50&&e.classList.add(`hidden`)},{passive:!0}),n.querySelectorAll(`a`).forEach(t=>{t.addEventListener(`click`,()=>{e.classList.add(`hidden`)})})},haptic(e=10){navigator.vibrate&&navigator.vibrate(e)}};document.addEventListener(`DOMContentLoaded`,()=>{v.initBottomSheet()}),window.UI=v;var y={init(e){e===`signup`&&this.setupOTPInputs()},togglePassword(e){let t=document.getElementById(e);t&&(t.type===`password`?t.type=`text`:t.type=`password`)},sendOTP(){let e=document.getElementById(`su-phone`).value;if(!e||e.length<10){v.showToast(`Please enter a valid phone number`,`error`);return}v.showToast(`OTP sent via SMS`,`success`),document.getElementById(`otp-section`).classList.remove(`hidden`),setTimeout(()=>{document.querySelector(`.input-otp[data-index="1"]`).focus()},100)},setupOTPInputs(){document.querySelectorAll(`.input-otp`).forEach(e=>{e.addEventListener(`keyup`,t=>{let n=e,r=parseInt(n.dataset.index);if(n.value.length===1&&r<4){let e=document.querySelector(`.input-otp[data-index="${r+1}"]`);e&&e.focus()}if(t.key===`Backspace`&&n.value.length===0&&r>1){let e=document.querySelector(`.input-otp[data-index="${r-1}"]`);e&&(e.focus(),e.value=``)}})})},calculateEDD(){let e=document.getElementById(`su-lmp`),t=document.getElementById(`su-edd-display`);if(!e||!e.value)return;let n=new Date(e.value),r=new Date(n.getTime());r.setDate(r.getDate()+280),t.textContent=`Estimated Due Date: ${r.toLocaleDateString(void 0,{year:`numeric`,month:`long`,day:`numeric`})}`},async handleSignUp(){let e=document.getElementById(`su-name`).value,t=document.getElementById(`su-phone`).value,n=document.getElementById(`su-email`).value,r=document.getElementById(`su-dob`).value,i=document.getElementById(`su-lmp`).value,a=document.getElementById(`su-blood`).value,o=document.querySelectorAll(`.input-otp`),s=``;if(o.forEach(e=>s+=e.value),s.length<4){v.showToast(`Please verify your phone number with the OTP`,`error`);return}let c=new Date(r),l=new Date,u=l.getFullYear()-c.getFullYear(),d=l.getMonth()-c.getMonth();(d<0||d===0&&l.getDate()<c.getDate())&&u--;let f=new Date(i),p=new Date(f.getTime());p.setDate(p.getDate()+280);let m={name:e,phone:t,email:n,dob:r,age:u,lmp:i,edd:p.toISOString().split(`T`)[0],bloodGroup:a,isFirstPregnancy:!1,priorPE:!1,priorPTB:!1,chronicHTN:!1,diabetes:`none`,multipleGestation:!1,familyHistory:!1};await _.saveProfile(m),v.showToast(`Account created securely`,`success`),setTimeout(()=>{window.location.hash=`#/risk-assessment`},1e3)},async handleSignIn(){let e=document.getElementById(`signin-email`).value,t=document.getElementById(`signin-password`).value;if(!e||!t){v.showToast(`Please enter your credentials`,`error`);return}if(!await _.getProfile()){let t=new Date;t.setDate(t.getDate()-140),await _.saveProfile({name:`Demo User`,email:e,lmp:t.toISOString().split(`T`)[0],age:28,bloodGroup:`O+`})}v.showToast(`Signed in successfully`,`success`),setTimeout(()=>{window.location.hash=`#/dashboard`},1e3)}};window.Auth=y,window.Auth=y;var b={connectedDevices:[],init(){console.log(`Bluetooth Manager Initialized`),this.connectedDevices=[],this.updateUI()},connect(e){v.showToast(`Scanning for ${e.toUpperCase()} devices...`,`success`,2e3);let t=document.querySelectorAll(`.card-device`),n=null;t.forEach(t=>{let r=t.querySelector(`button`);r&&r.getAttribute(`onclick`).includes(e)&&(n=r)}),n&&(n.innerText,n.innerText=`Connecting...`,n.style.opacity=`0.7`,setTimeout(()=>{this.connectedDevices.push(e),n.innerText=`Connected`,n.style.background=`var(--clr-accent-green)`,n.style.color=`white`,n.style.opacity=`1`,n.disabled=!0,v.showToast(`${e.toUpperCase()} Connected Successfully!`,`success`),this.updateUI()},2e3))},updateUI(){},async receiveData(e,t){console.log(`Received data from ${e}:`,t),e===`bp`&&(await _.addLog(_.KEYS.BP_LOGS,{date:new Date().toISOString().split(`T`)[0],time:new Date().toTimeString().split(` `)[0],sys:t.sys,dia:t.dia,pulse:t.pulse,position:`sitting`,arm:`left`,notes:`Auto-synced from BP Monitor`}),v.showToast(`New Blood Pressure reading synced`,`success`))}};window.Bluetooth=b,window.Bluetooth=b;var x={kickSessionActive:!1,kickCount:0,kickStartTime:null,kickInterval:null,isContractionActive:!1,contractionStartTime:null,contractionInterval:null,lastContractionEndTime:null,currentContractionDuration:0,init(){let e=document.getElementById(`kick-control-btn`);e&&(e.addEventListener(`mousedown`,()=>e.style.transform=`scale(0.95)`),e.addEventListener(`mouseup`,()=>e.style.transform=`scale(1)`),e.addEventListener(`mouseleave`,()=>e.style.transform=`scale(1)`),e.addEventListener(`touchstart`,()=>e.style.transform=`scale(0.95)`),e.addEventListener(`touchend`,()=>e.style.transform=`scale(1)`))},toggleSession(){let e=document.getElementById(`kick-control-btn`);e&&(this.kickSessionActive?(this.endKickSession(),e.textContent=`Start Session`,e.classList.replace(`btn-danger`,`btn-secondary`)):(this.startKickSession(),e.textContent=`End Session`,e.classList.replace(`btn-secondary`,`btn-danger`),e.style.background=`var(--clr-danger)`,e.style.color=`white`))},startKickSession(){this.kickSessionActive=!0,this.kickCount=0,this.kickStartTime=Date.now(),this.updateKickDisplay(),this.kickInterval=setInterval(()=>{this.updateKickTimer()},1e3),v.showToast(`Session started. Tap the circle when you feel a kick.`)},async endKickSession(){this.kickSessionActive=!1,clearInterval(this.kickInterval);let e=Math.floor((Date.now()-this.kickStartTime)/1e3);(e>60||this.kickCount>0)&&(await _.addLog(_.KEYS.KICKS,{date:new Date().toISOString().split(`T`)[0],time:new Date().toTimeString().split(` `)[0],count:this.kickCount,durationSeconds:e}),v.showToast(`Session saved: ${this.kickCount} kicks in ${this.formatTime(e)}`,`success`)),this.kickCount=0,this.updateKickDisplay(),document.getElementById(`kick-timer-display`).textContent=`00:00`},logKick(){if(this.kickSessionActive||this.toggleSession(),this.kickCount++,this.updateKickDisplay(),v.haptic(),this.kickCount>=10){let e=Math.floor((Date.now()-this.kickStartTime)/1e3);v.showToast(`Great! 10 kicks reached in ${this.formatTime(e)}.`,`success`)}},updateKickDisplay(){let e=document.getElementById(`kick-count-display`);e&&(e.textContent=this.kickCount)},updateKickTimer(){let e=document.getElementById(`kick-timer-display`);if(!e)return;let t=Math.floor((Date.now()-this.kickStartTime)/1e3);e.textContent=this.formatTime(t)},async initContractions(){await this.updateContractionAverages()},async toggleContraction(){let e=document.getElementById(`contraction-button`),t=document.getElementById(`contraction-state-display`),n=document.getElementById(`contraction-timer-display`);if(!(!e||!t))if(this.isContractionActive){this.isContractionActive=!1,clearInterval(this.contractionInterval);let r=Math.floor((Date.now()-this.contractionStartTime)/1e3),i=null;this.lastContractionEndTime&&(i=Math.floor((this.contractionStartTime-this.lastContractionEndTime)/1e3)),this.lastContractionEndTime=Date.now(),r>10&&(await _.addLog(_.KEYS.CONTRACTIONS,{timestamp:new Date().toISOString(),durationSec:r,frequencySec:i}),await this.updateContractionAverages()),e.style.background=`var(--clr-bg-white)`,e.style.borderColor=`var(--clr-purple-bg)`,t.innerHTML=`Tap to<br>Start`,t.style.color=`var(--clr-purple)`,n.style.display=`none`}else this.isContractionActive=!0,this.contractionStartTime=Date.now(),navigator.vibrate&&navigator.vibrate([50,50,50]),e.style.background=`var(--clr-purple-bg)`,e.style.borderColor=`var(--clr-purple)`,t.textContent=`Contracting...`,t.style.color=`white`,n.style.display=`block`,n.style.color=`white`,n.textContent=`00:00`,this.contractionInterval=setInterval(()=>{let e=Math.floor((Date.now()-this.contractionStartTime)/1e3);n.textContent=this.formatTime(e)},1e3)},async updateContractionAverages(){let e=await _.getLogs(_.KEYS.CONTRACTIONS);if(e.length===0)return;let t=e.slice(0,5),n=0,r=0,i=0;t.forEach(e=>{n+=e.durationSec,e.frequencySec&&(r+=e.frequencySec,i++)});let a=n/t.length;if(document.getElementById(`avg-duration`).textContent=this.formatTime(Math.round(a)),i>0){let e=r/i,t=Math.floor(e/60),n=Math.round(e%60);document.getElementById(`avg-frequency`).textContent=`${t}m ${n}s apart`}},formatTime(e){return`${Math.floor(e/60).toString().padStart(2,`0`)}:${(e%60).toString().padStart(2,`0`)}`}};window.Kicks=x,window.Kicks=x;var S={async logSymptom(e,t){let n=await _.getTodaySymptoms(),r=n.length>0?n[0]:null;if(!r)r=await _.addLog(_.KEYS.SYMPTOMS,{symptoms:[e],severity:1,notes:`Quick log from dashboard`}),v.showToast(`Logged symptom: ${e}`);else if(r.symptoms||(r.symptoms=[]),!r.symptoms.includes(e)){r.symptoms.push(e);let t=await _.getLogs(_.KEYS.SYMPTOMS),n=t.findIndex(e=>e.id===r.id);n!==-1&&(t[n]=r,await _._set(_.KEYS.SYMPTOMS,t)),v.showToast(`Added symptom: ${e}`)}t&&(t.classList.replace(`btn-secondary`,`btn-primary`),t.style.background=`var(--clr-primary)`,t.style.color=`white`),window.DashboardUI&&DashboardUI.init()},async saveBP(){let e=parseInt(document.getElementById(`bp-sys`).value),t=parseInt(document.getElementById(`bp-dia`).value),n=parseInt(document.getElementById(`bp-pulse`).value)||0,r=`sitting`,i=document.getElementsByName(`bp-position`);for(let e of i)e.checked&&(r=e.value);let a=`left`,o=document.getElementsByName(`bp-arm`);for(let e of o)e.checked&&(a=e.value);let s=document.getElementById(`bp-notes`).value;if(!e||!t){v.showToast(`Please enter both Systolic and Diastolic values`,`error`);return}if(e<50||e>250||t<30||t>150){v.showToast(`Values seem out of normal human range. Please check.`,`error`);return}await _.addLog(_.KEYS.BP_LOGS,{sys:e,dia:t,pulse:n,position:r,arm:a,notes:s,date:new Date().toISOString().split(`T`)[0],time:new Date().toTimeString().split(` `)[0]}),v.showToast(`Blood Pressure reading saved successfully`,`success`),setTimeout(()=>j.goBack(),1e3)},async saveVitals(){let e=parseFloat(document.getElementById(`vital-weight`).value),t=parseFloat(document.getElementById(`vital-sleep`).value),n=parseInt(document.getElementById(`vital-stress`).value),r=parseFloat(document.getElementById(`vital-temp`).value),i=parseFloat(document.getElementById(`vital-glucose`).value),a=document.getElementById(`vital-protein`).value,o={};if(e&&(o.weight=e),t&&(o.sleep=t),n&&(o.stress=n),r&&(o.temperature=r),i&&(o.glucose=i),a&&(o.protein=a),Object.keys(o).length===0){v.showToast(`Please enter at least one vital sign`,`error`);return}await _.addLog(_.KEYS.VITALS_LOGS,o),v.showToast(`Vitals saved successfully`,`success`),setTimeout(()=>j.goBack(),1e3)},initBPPage(){},initVitalsPage(){let e=document.getElementById(`vital-stress`);e&&e.addEventListener(`input`,e=>{})}};window.Vitals=S,window.Vitals=S;var C={init(){console.log(`Assessment initialized`)},async submit(){let e=parseInt(document.getElementById(`q-age`).value)||25,t=document.querySelector(`input[name="q-first-preg"]:checked`)?.value===`yes`,n=document.querySelector(`input[name="q-prior-pe"]:checked`)?.value===`yes`,r=document.querySelector(`input[name="q-chronic-htn"]:checked`)?.value===`yes`,i=document.getElementById(`q-diabetes`).value||`none`,a=document.querySelector(`input[name="q-family"]:checked`)?.value===`yes`,o=parseInt(document.getElementById(`q-height`).value)||160,s=parseInt(document.getElementById(`q-weight`).value)||65,c=parseInt(document.getElementById(`q-booking-sys`).value)||null,l=parseInt(document.getElementById(`q-booking-dia`).value)||null,u=parseInt(document.getElementById(`q-current-sys`).value)||null,d=parseInt(document.getElementById(`q-current-dia`).value)||null,f=document.querySelectorAll(`input[name="q-symptoms"]:checked`),p=Array.from(f).map(e=>e.value),m=document.querySelector(`input[name="q-weight-gain"]:checked`)?.value===`yes`,h=document.getElementById(`q-protein`).value||`unknown`,g=await _.getProfile()||{};if(g.age=e,g.isFirstPregnancy=t,g.priorPE=n,g.chronicHTN=r,g.diabetes=i,g.familyHistory=a,g.height=o,g.prePregnancyWeight=s,g.bookingBPSys=c,g.bookingBPDia=l,await _.saveProfile(g),u&&d){let e=await _.getLogs(_.KEYS.BP_LOGS);e.push({sys:u,dia:d,position:`sitting`,timestamp:new Date().toISOString(),date:new Date().toLocaleDateString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`}),time:new Date().toLocaleTimeString(`en-US`,{hour:`2-digit`,minute:`2-digit`})}),await _._set(_.KEYS.BP_LOGS,e)}if(p.length>0){let e=await _.getLogs(_.KEYS.VITALS_LOGS);e.push({symptoms:p,timestamp:new Date().toISOString()}),await _._set(_.KEYS.VITALS_LOGS,e)}if(h!==`unknown`){let e=await _.getLogs(`gg_urine_logs`)||[];e.push({protein:h,timestamp:new Date().toISOString()}),await _._set(`gg_urine_logs`,e)}if(m){let e=await _.getLogs(_.KEYS.VITALS_LOGS),t=new Date,n=new Date(t.getTime()-10080*60*1e3);e.push({weight:s,timestamp:n.toISOString()}),e.push({weight:s+2.5,timestamp:t.toISOString()}),await _._set(_.KEYS.VITALS_LOGS,e)}v.showToast(`Health profile saved. Analyzing risk...`,`success`),setTimeout(()=>{window.location.hash=`#/bluetooth`},1e3)}};window.Assessment=C;var w={calcBMI(e,t){if(!e||!t)return 0;let n=t/100;return e/(n*n)},async evaluateCurrentState(){let e=await _.getProfile();if(!e)return{score:0,band:`Low`,color:`#436746`,action:`Complete profile`};let t=await _.getLatestBP(),n=await _.getLatestUrine(),r=await _.getLogs(_.KEYS.VITALS_LOGS),i=await _.getTodaySymptoms(),a=0,o=[];(e.age<20||e.age>35)&&(a+=2,o.push(`Age risk`)),e.isFirstPregnancy&&(a+=2,o.push(`Nulliparity`)),e.priorPE&&(a+=4,o.push(`Prior PE history`)),e.chronicHTN&&(a+=3,o.push(`Chronic hypertension`)),e.diabetes!==`none`&&(a+=2,o.push(`Diabetes`)),e.familyHistory&&(a+=2,o.push(`Family history`)),e.multipleGestation&&(a+=2,o.push(`Multiple gestation`));let s=e.height||160,c=e.prePregnancyWeight||65;if(this.calcBMI(c,s)>=30&&(a+=2,o.push(`BMI ≥30`)),t&&(t.sys>=160||t.dia>=110?(a+=7,o.push(`Severe-range BP`)):t.sys>=140||t.dia>=90?(a+=5,o.push(`BP ≥140/90`)):(t.sys>=130||t.dia>=80)&&(a+=2,o.push(`Elevated BP`))),r.length>0){let e=r[0],t=e.protein;t===`+3`?(a+=6,o.push(`Proteinuria 3+`)):t===`+2`?(a+=4,o.push(`Proteinuria 2+`)):t===`+1`?(a+=2,o.push(`Proteinuria 1+`)):n&&(n.protein===`3plus`?(a+=6,o.push(`Proteinuria 3+`)):n.protein===`2plus`?(a+=4,o.push(`Proteinuria 2+`)):n.protein===`1plus`&&(a+=2,o.push(`Proteinuria 1+`)));let i=e.glucose;i&&(i>=200?(a+=5,o.push(`Severe Hyperglycemia`)):i>=140?(a+=3,o.push(`Elevated Blood Glucose`)):i<60&&(a+=4,o.push(`Hypoglycemia`)))}else n&&(n.protein===`3plus`?(a+=6,o.push(`Proteinuria 3+`)):n.protein===`2plus`?(a+=4,o.push(`Proteinuria 2+`)):n.protein===`1plus`&&(a+=2,o.push(`Proteinuria 1+`)));let l=new Set;if(i.forEach(e=>{e.symptoms&&e.symptoms.forEach(e=>l.add(e))}),l.has(`severe_headache`)&&(a+=2,o.push(`Severe headache`)),l.has(`vision_changes`)&&(a+=2,o.push(`Visual disturbances`)),l.has(`ruq_pain`)&&(a+=3,o.push(`RUQ/Epigastric pain`)),l.has(`swelling`)&&(a+=1,o.push(`Sudden swelling`)),r.length>=2){let e=r[0].weight,t=r[1].weight,n=(new Date(r[0].timestamp)-new Date(r[1].timestamp))/(1e3*60*60*24);e&&t&&n>0&&(e-t)/n*7>=2&&(a+=1,o.push(`Weight gain ≥2kg/wk`))}let u,d,f;return a<=5?(u=`Low`,d=`#436746`,f=`Continue routine monitoring`):a<=12?(u=`Moderate`,d=`#80543B`,f=`Increase BP logging frequency. Mention at next doctor visit.`):a<=20?(u=`High`,d=`#BA1A1A`,f=`Contact your healthcare provider today for an assessment.`):(u=`Critical`,d=`#BA1A1A`,f=`EMERGENCY: Proceed to the nearest hospital immediately.`),this._checkAndTriggerAlerts(a,u,f),{score:a,band:u,color:d,factors:o,action:f}},_checkAndTriggerAlerts(e,t,n){let r=localStorage.getItem(`gg_last_alert`),i=r?JSON.parse(r):{time:0,band:``},a=Date.now();(t!==`Low`&&t!==i.band||t!==`Low`&&a-i.time>864e5)&&((t===`Critical`||t===`High`)&&v.showToast(`ALERT: ${n}`,`error`,1e4),localStorage.setItem(`gg_last_alert`,JSON.stringify({time:a,band:t})))}};window.Scoring=w,window.Scoring=w;async function T(e){let t=e.toLowerCase(),n=`Based on clinical guidelines, I'd recommend discussing this with your doctor at your next visit.`;t.includes(`iron`)||t.includes(`diet`)||t.includes(`food`)?n=`A balanced diet is crucial during pregnancy! Excellent sources of iron include lean red meat, poultry, beans, lentils, spinach, and iron-fortified cereals. Remember to pair iron-rich foods with vitamin C for better absorption.`:t.includes(`sleep`)?n=`Sleeping on your left side (SOS) is highly recommended during the second and third trimesters as it improves blood flow to the placenta and your baby. Try using a pregnancy pillow for extra support!`:t.includes(`kick`)||t.includes(`movement`)?n=`Tracking baby kicks is a great way to monitor your baby's well-being. You should generally feel about 10 movements within 2 hours. If you notice a significant decrease, contact your healthcare provider immediately.`:t.includes(`blood pressure`)||t.includes(`bp`)?n=`Monitoring blood pressure is important to watch for signs of preeclampsia. A normal reading is typically around 120/80. If it consistently reads higher than 140/90, please consult your doctor.`:t.includes(`contraction`)||t.includes(`labor`)?n=`Braxton Hicks (practice contractions) are normal and usually irregular. True labor contractions will become closer together, stronger, and more regular. If you're unsure or before 37 weeks, always call your provider.`:(t.includes(`nausea`)||t.includes(`morning sickness`))&&(n=`Nausea is very common, especially in the first trimester. Try eating small, frequent meals, keeping crackers by your bed, and staying hydrated. Ginger and vitamin B6 can also help.`);let r=Math.floor(Math.random()*1e3)+1e3;return new Promise(e=>setTimeout(()=>e(n),r))}var E={init(){this.setupDraggableFab(),this.setupChatUI()},setupDraggableFab(){let e=document.getElementById(`ai-bot-fab`),t=document.getElementById(`ai-chat-overlay`);if(!e||!t)return;let n=!1,r=0,i=0,a=0,o=0,s=!1;e.addEventListener(`touchstart`,t=>{let n=t.touches[0];r=n.clientY,i=n.clientX;let c=window.getComputedStyle(e).transform,l=0,u=0;if(c!==`none`){let e=new DOMMatrix(c);l=e.m41,u=e.m42}o=l,a=u,s=!1,e.style.transition=`none`},{passive:!0}),e.addEventListener(`touchmove`,t=>{n=!0;let c=t.touches[0],l=c.clientY-r,u=c.clientX-i;(Math.abs(l)>15||Math.abs(u)>15)&&(s=!0);let d=a+l,f=o+u;e.style.transform=`translate(${f}px, ${d}px) scale(1.05)`},{passive:!0}),e.addEventListener(`touchend`,t=>{if(n=!1,e.style.transition=`transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)`,s){let t=window.getComputedStyle(e).transform;if(t!==`none`){let n=new DOMMatrix(t);e.style.transform=`translate(${n.m41}px, ${n.m42}px) scale(1)`}}else e.style.transform=`translate(${o}px, ${a}px) scale(1)`,this.openChat()}),e.addEventListener(`mousedown`,t=>{n=!0,s=!1,r=t.clientY,i=t.clientX;let c=window.getComputedStyle(e).transform,l=0,u=0;if(c!==`none`){let e=new DOMMatrix(c);l=e.m41,u=e.m42}o=l,a=u,e.style.transition=`none`}),window.addEventListener(`mousemove`,t=>{if(!n)return;let c=t.clientY-r,l=t.clientX-i;(Math.abs(c)>5||Math.abs(l)>5)&&(s=!0),e.style.transform=`translate(${o+l}px, ${a+c}px) scale(1.05)`}),window.addEventListener(`mouseup`,()=>{if(n)if(n=!1,e.style.transition=`transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)`,!s)e.style.transform=`translate(${o}px, ${a}px) scale(1)`,this.openChat();else{let t=window.getComputedStyle(e).transform;if(t!==`none`){let n=new DOMMatrix(t);e.style.transform=`translate(${n.m41}px, ${n.m42}px) scale(1)`}}}),e.addEventListener(`click`,e=>{s||this.openChat()})},setupChatUI(){let e=document.getElementById(`close-ai-chat`),t=document.getElementById(`ai-chat-overlay`),n=document.getElementById(`global-chat-form`);e&&e.addEventListener(`click`,()=>{this.closeChat()}),t&&t.addEventListener(`click`,e=>{e.target===t&&this.closeChat()}),n&&n.addEventListener(`submit`,e=>{e.preventDefault(),this.sendMessage()});let r=document.getElementById(`global-chat-input`);r&&r.addEventListener(`keydown`,e=>{e.key===`Enter`&&!e.shiftKey&&(e.preventDefault(),this.sendMessage())})},openChat(){let e=document.getElementById(`ai-chat-overlay`);e&&e.classList.remove(`hidden`)},closeChat(){let e=document.getElementById(`ai-chat-overlay`);e&&e.classList.add(`hidden`)},async sendMessage(){let e=document.getElementById(`global-chat-input`),t=e.value.trim();if(!t)return;let n=document.getElementById(`global-chat-history`);if(!n)return;let r=document.createElement(`div`);r.style.display=`flex`,r.style.gap=`12px`,r.style.alignItems=`flex-start`,r.style.maxWidth=`85%`,r.style.alignSelf=`flex-end`,r.style.flexDirection=`row-reverse`,r.innerHTML=`
            <div style="width: 32px; height: 32px; background: var(--clr-bg-card); color: var(--clr-primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; border: 1px solid var(--clr-divider);">
                <i data-lucide="user" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="background: var(--clr-primary); padding: 16px; border-radius: 20px 4px 20px 20px; box-shadow: var(--shadow-sm);">
                <p style="font-size: 14px; color: white; line-height: 1.5;">
                    ${t.replace(/</g,`&lt;`)}
                </p>
            </div>
        `,n.appendChild(r),e.value=``,e.style.height=`48px`,window.lucide&&window.lucide.createIcons({root:r}),n.scrollTop=n.scrollHeight;let i=document.createElement(`div`);i.style.display=`flex`,i.style.gap=`12px`,i.style.alignItems=`flex-start`,i.style.maxWidth=`85%`,i.id=`ai-typing-indicator`,i.innerHTML=`
            <div style="width: 32px; height: 32px; background: #E8547A; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                <i data-lucide="bot" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="background: white; padding: 16px; border-radius: 4px 20px 20px 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--clr-divider);">
                <p style="font-size: 14px; color: var(--clr-text-body); line-height: 1.5; font-style: italic;">
                    Typing...
                </p>
            </div>
        `,n.appendChild(i),window.lucide&&window.lucide.createIcons({root:i}),n.scrollTop=n.scrollHeight;try{let e=await T(t),r=document.getElementById(`ai-typing-indicator`);r&&r.remove();let i=document.createElement(`div`);i.style.display=`flex`,i.style.gap=`12px`,i.style.alignItems=`flex-start`,i.style.maxWidth=`85%`,i.innerHTML=`
                <div style="width: 32px; height: 32px; background: #E8547A; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                    <i data-lucide="bot" style="width: 16px; height: 16px;"></i>
                </div>
                <div style="background: white; padding: 16px; border-radius: 4px 20px 20px 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--clr-divider);">
                    <p style="font-size: 14px; color: var(--clr-text-body); line-height: 1.5;">
                        ${e}
                    </p>
                </div>
            `,n.appendChild(i),window.lucide&&window.lucide.createIcons({root:i}),n.scrollTop=n.scrollHeight}catch(e){console.error(`AI query failed:`,e);let t=document.getElementById(`ai-typing-indicator`);t&&t.remove()}}};window.AIBot=E;var D={async init(){await this.renderTimeline()},formatTime(e){return new Date(e).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})},formatDate(e){return new Date(e).toLocaleDateString([],{weekday:`short`,month:`short`,day:`numeric`})},async renderTimeline(){let e=document.getElementById(`health-records-timeline`),t=document.getElementById(`health-records-empty`);if(!e||!t)return;let n=[],r=async(e,t)=>{(await _.getLogs(e)||[]).forEach(e=>{n.push({...e,_type:t})})};if(await r(_.KEYS.BP_LOGS,`bp`),await r(_.KEYS.VITALS_LOGS,`vitals`),await r(_.KEYS.KICKS,`kicks`),await r(_.KEYS.CONTRACTIONS,`contractions`),await r(_.KEYS.SYMPTOMS,`symptoms`),n.length===0){t.style.display=`block`;return}else t.style.display=`none`;n.sort((e,t)=>new Date(t.timestamp).getTime()-new Date(e.timestamp).getTime());let i={};n.forEach(e=>{let t=this.formatDate(e.timestamp);i[t]||(i[t]=[]),i[t].push(e)});let a=``;for(let[e,t]of Object.entries(i))a+=`<div style="margin-top: 8px;"><h3 style="font-size: 14px; color: var(--clr-text-muted); font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${e}</h3>`,t.forEach(e=>{let t=this.formatTime(e.timestamp),n=`activity`,r=`var(--clr-primary)`,i=`Health Log`,o=``;e._type===`bp`?(n=`heart-pulse`,i=`Blood Pressure`,o=`<span style="font-size: 18px; font-weight: 700;">${e.sys}/${e.dia}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">mmHg</span>`,e.pulse&&(o+=` &middot; ${e.pulse} bpm`)):e._type===`vitals`?e.weight?(n=`scale`,r=`#E8547A`,i=`Weight`,o=`<span style="font-size: 18px; font-weight: 700;">${e.weight}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">kg</span>`):e.sleep&&(n=`moon`,r=`var(--clr-purple)`,i=`Sleep`,o=`<span style="font-size: 18px; font-weight: 700;">${e.sleep}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">hours</span>`):e._type===`kicks`?(n=`baby`,r=`var(--clr-purple)`,i=`Kick Session`,o=`<span style="font-size: 18px; font-weight: 700;">${e.count}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">kicks in ${Math.round(e.duration/60)} min</span>`):e._type===`symptoms`?(n=`alert-circle`,r=`var(--clr-danger)`,i=`Symptom Logged`,o=`<span style="font-size: 16px; font-weight: 600; text-transform: capitalize;">${e.symptom}</span>`):e._type===`contractions`&&(n=`timer`,r=`var(--clr-info-brown)`,i=`Contraction`,o=`Duration: ${Math.round(e.duration)}s &middot; Intensity: ${e.intensity||`N/A`}`),a+=`
                    <div class="card-white" style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px; padding: 16px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${r}1A; color: ${r}; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                            <i data-lucide="${n}" style="width: 20px; height: 20px;"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <h4 style="font-weight: 600; font-size: 14px; color: var(--clr-text-heading);">${i}</h4>
                                <span style="font-size: 12px; color: var(--clr-text-muted);">${t}</span>
                            </div>
                            <div style="color: var(--clr-text-body);">${o}</div>
                            ${e.notes?`<div style="font-size: 12px; color: var(--clr-text-muted); margin-top: 4px; background: rgba(0,0,0,0.03); padding: 8px; border-radius: 8px; font-style: italic;">"${e.notes}"</div>`:``}
                        </div>
                    </div>
                `}),a+=`</div>`;e.innerHTML=``,e.appendChild(t),e.insertAdjacentHTML(`beforeend`,a),window.lucide&&window.lucide.createIcons({root:e})}};window.HealthRecords=D;var O={async init(){console.log(`Dashboard initialized`);let e=await _.getProfile();if(e){document.getElementById(`dash-name`).textContent=e.name.split(` `)[0]||`User`;let t=await _.getCurrentGestationalWeek(),n=await _.getCurrentTrimester();document.getElementById(`dash-week`).textContent=`Week ${t}`;let r=`FIRST TRIMESTER`;n===2&&(r=`SECOND TRIMESTER`),n===3&&(r=`THIRD TRIMESTER`),document.getElementById(`dash-trimester-label`).textContent=r;let i=Math.min(Math.round(t/40*100),100);document.getElementById(`dash-progress-bar`).style.width=`${i}%`,document.getElementById(`dash-progress-text`).textContent=`${i}%`;let a=Math.max(280-t*7,0);document.getElementById(`dash-days-left`).textContent=`${a} days to go`;let o=[`🫐`,`🍇`,`🍓`,`🍋`,`🍑`,`🥑`,`🧅`,`🌽`,`🍆`,`🥥`,`🍍`,`🍉`],s=Math.floor(Math.min(t/4,o.length-1));document.getElementById(`dash-baby-size`).textContent=o[s]}let t=await _.getLatestBP();t&&(document.getElementById(`dash-vital-bp`).innerHTML=`${t.sys}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">/${t.dia}</span>`);let n=await _.getLogs(_.KEYS.VITALS_LOGS);if(n.length>0){let e=n[0];e.weight&&(document.getElementById(`dash-vital-weight`).innerHTML=`${e.weight}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">kg</span>`),e.sleep&&(document.getElementById(`dash-vital-sleep`).innerHTML=`${e.sleep}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">hrs</span>`)}if(w){let e=await w.evaluateCurrentState(),t=document.getElementById(`dash-risk-banner`),n=document.getElementById(`dash-risk-icon`),r=document.getElementById(`dash-risk-text`);t&&n&&r&&(t.style.borderLeftColor=e.color,t.style.backgroundColor=`${e.color}1A`,n.style.color=e.color,r.style.color=e.color,r.textContent=`${e.band} (${e.score})`,e.band===`Critical`&&(n.setAttribute(`data-lucide`,`alert-triangle`),window.lucide&&window.lucide.createIcons({root:t})))}}};window.DashboardUI=O;var k={drawSparkline(e,t,n=`#6DA171`,r=3){let i=document.getElementById(e);if(!i||!t||t.length===0)return;let a=i.getContext(`2d`),o=i.width,s=i.height,c=window.devicePixelRatio||1;if(i.dataset.scaled||(i.style.width=o+`px`,i.style.height=s+`px`,i.width=o*c,i.height=s*c,a.scale(c,c),i.dataset.scaled=`true`),a.clearRect(0,0,o,s),t.length===1){a.beginPath(),a.arc(o/2,s/2,r,0,2*Math.PI),a.fillStyle=n,a.fill();return}let l=Math.min(...t),u=Math.max(...t),d=u-l===0?1:u-l,f=r*2,p=o-f*2,m=s-f*2,h=p/(t.length-1);a.beginPath(),a.strokeStyle=n,a.lineWidth=r,a.lineCap=`round`,a.lineJoin=`round`,t.forEach((e,t)=>{let n=f+t*h,r=(e-l)/d,i=s-f-r*m;t===0?a.moveTo(n,i):a.lineTo(n,i)}),a.stroke()}};window.Charts=k,window.Charts=k;var A={async init(){console.log(`Medical History initialized`);let e=await _.getProfile();e&&(document.getElementById(`hist-first-preg`).checked=e.isFirstPregnancy||!1,document.getElementById(`hist-multiple`).checked=e.multipleGestation||!1,document.getElementById(`hist-prior-pe`).checked=e.priorPE||!1,document.getElementById(`hist-chronic-htn`).checked=e.chronicHTN||!1,[`hist-first-preg`,`hist-multiple`,`hist-prior-pe`,`hist-chronic-htn`].forEach(e=>{document.getElementById(e).addEventListener(`change`,this.saveProfileChanges)})),await this.renderBPChart()},async saveProfileChanges(){let e=await _.getProfile()||{};e.isFirstPregnancy=document.getElementById(`hist-first-preg`).checked,e.multipleGestation=document.getElementById(`hist-multiple`).checked,e.priorPE=document.getElementById(`hist-prior-pe`).checked,e.chronicHTN=document.getElementById(`hist-chronic-htn`).checked,await _.saveProfile(e),v.showToast(`Profile updated`,`success`),w&&O&&O.init()},async renderBPChart(){let e=await _.getLogs(_.KEYS.BP_LOGS),t=document.getElementById(`hist-bp-logs`);if(!t)return;if(t.innerHTML=``,e.length===0){t.innerHTML=`<p style="text-align: center; color: var(--clr-text-muted); font-size: 14px;">No logs yet</p>`;return}e.slice(0,3).forEach(e=>{let n=document.createElement(`div`);n.style.cssText=`display: flex; justify-content: space-between; font-size: 14px;`,n.innerHTML=`
                <span style="color: var(--clr-text-muted);">${e.date||``} ${e.time||``}</span>
                <span style="font-weight: 600;">${e.sys}/${e.dia}</span>
            `,t.appendChild(n)});let n=e.slice(0,10).reverse().map(e=>e.sys);if(k){let e=document.getElementById(`bp-history-chart`);e&&e.dataset.scaled&&(e.dataset.scaled=``),k.drawSparkline(`bp-history-chart`,n,`#6DA171`,4)}}};window.MedicalHistory=A;var j={currentPage:null,history:[],async init(){if(console.log(`App Initializing...`),E&&E.init(),_&&_.initSyncEngine(),window.addEventListener(`hashchange`,this.handleRoute.bind(this)),setTimeout(()=>{let e=document.getElementById(`splash-screen`);e&&(e.classList.add(`fade-out`),setTimeout(()=>e.remove(),500))},1e3),!window.location.hash||window.location.hash===`#/`){let e=await _.getProfile()!==null;window.location.hash=e?`#/dashboard`:`#/onboarding`}else this.handleRoute()},async handleRoute(){let e=(window.location.hash||`#/`).replace(`#/`,``)||`onboarding`;console.log(`Routing to: ${e}`);let t=[`onboarding`,`signin`,`signup`].includes(e);if(await _.getProfile()===null&&!t){window.location.hash=`#/onboarding`;return}let n=document.getElementById(`page-${e}`);n||(n=await this.loadPageTemplate(e)),this.transitionTo(n,e),v.updateBottomNav(e),await this.initPage(e)},async loadPageTemplate(e){try{let g=Object.assign({"../../pages/bluetooth.html":t,"../../pages/care-guide.html":n,"../../pages/contractions.html":r,"../../pages/dashboard.html":i,"../../pages/health-hub.html":a,"../../pages/kick-counter.html":o,"../../pages/log-bp.html":s,"../../pages/log-vitals.html":c,"../../pages/medical-history.html":l,"../../pages/onboarding.html":u,"../../pages/profile.html":d,"../../pages/reminders.html":f,"../../pages/risk-assessment.html":p,"../../pages/signin.html":m,"../../pages/signup.html":h})[`../../pages/${e}.html`];if(!g)throw Error(`Page template not found for route: ${e}`);let _=document.createElement(`div`);_.innerHTML=g.trim();let v=_.firstElementChild;return(!v||!v.classList.contains(`page`))&&(v=document.createElement(`div`),v.id=`page-${e}`,v.className=`page`,v.innerHTML=g),document.getElementById(`app-root`).appendChild(v),window.lucide&&window.lucide.createIcons({root:v}),v}catch(t){return console.error(`Error loading page ${e}:`,t),null}},transitionTo(e,t){if(e){if(this.currentPage&&this.currentPage!==t){let e=document.getElementById(`page-${this.currentPage}`);e&&e.classList.remove(`active`),this.history.push(this.currentPage)}e.classList.add(`active`),this.currentPage=t,window.scrollTo(0,0),e.scrollTop=0}},goBack(){this.history.length>0?(this.history.pop(),window.history.back()):window.location.hash=`#/dashboard`},async initPage(e){switch(e){case`onboarding`:break;case`signin`:case`signup`:y&&y.init(e);break;case`bluetooth`:b&&b.init();break;case`contractions`:x&&await x.initContractions();break;case`dashboard`:O&&await O.init(),w&&(window.Scoring=w);break;case`health-hub`:D&&await D.init();break;case`kick-counter`:x&&x.init();break;case`log-vitals`:S&&S.initVitalsPage();break;case`log-bp`:S&&S.initBPPage();break;case`medical-history`:A&&await A.init();break;case`reminders`:break;case`risk-assessment`:C&&C.init();break}window.UI=v,window.Store=_;let t=document.getElementById(`bottom-nav`);t&&([`dashboard`,`health-hub`,`care-guide`,`profile`].includes(e)?(t.classList.remove(`hidden`),document.querySelectorAll(`.nav-item`).forEach(t=>{t.getAttribute(`data-target`)===e?t.classList.add(`active`):t.classList.remove(`active`)})):t.classList.add(`hidden`))}};document.addEventListener(`DOMContentLoaded`,()=>{j.init()}),window.App=j;