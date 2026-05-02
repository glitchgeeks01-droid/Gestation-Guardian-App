// =============================================
// GESTATION GUARDIAN — App Controller v2.0
// =============================================

// --- STORAGE HELPERS ---
const GG = {
  get: (key, fallback = null) => {
    try { 
      const v = localStorage.getItem(key); 
      if (!v) return fallback;
      return JSON.parse(decodeURIComponent(escape(atob(v)))); 
    } catch(e) { console.error('GG get error:', e, 'v was:', localStorage.getItem(key)); return fallback; }
  },
  set: (key, val) => { 
    try { 
      localStorage.setItem(key, btoa(unescape(encodeURIComponent(JSON.stringify(val))))); 
    } catch(e) { console.error('GG set error:', e); } 
  },
};

// --- TIME GREETING ---
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning,';
  if (h < 17) return 'Good Afternoon,';
  return 'Good Evening,';
}

// --- GESTATIONAL WEEK CALCULATOR ---
function calcWeekInfo(lmpStr) {
  if (!lmpStr) return { week: 24, days: 112, pct: 60, trimester: 'Second Trimester' };
  const lmp = new Date(lmpStr);
  const today = new Date();
  const diffDays = Math.floor((today - lmp) / 86400000);
  const week = Math.min(Math.floor(diffDays / 7), 42);
  const totalDays = 280;
  const daysLeft = Math.max(totalDays - diffDays, 0);
  const pct = Math.min(Math.round((diffDays / totalDays) * 100), 100);
  let trimester = 'First Trimester';
  if (week >= 14 && week < 28) trimester = 'Second Trimester';
  if (week >= 28) trimester = 'Third Trimester';
  return { week, daysLeft, pct, trimester };
}

// --- SCORING ENGINE ---
function calcRiskScore(a) {
  let score = 0;
  const factors = [];

  // Q1: Age
  const age = parseInt(a.q1) || 0;
  if (age < 20 || age > 35) { score += 2; factors.push('Age is a risk factor (<20 or >35)'); }

  // Q2: First pregnancy
  if (a.q2 === 'first') { score += 2; factors.push('First pregnancy (nulliparous)'); }

  // Q3: Prior PE history
  if (a.q3 === 'yes') { score += 4; factors.push('Previous preeclampsia history'); }

  // Q4: Pre-existing hypertension
  if (a.q4 === 'yes') { score += 3; factors.push('Pre-existing hypertension'); }

  // Q5: Diabetes
  if (a.q5 === 'type1_2') { score += 2; factors.push('Type 1/2 diabetes'); }
  if (a.q5 === 'gestational') { score += 2; factors.push('Gestational diabetes'); }

  // Q6: Family history
  if (a.q6 === 'yes') { score += 2; factors.push('Family history of PE/hypertension'); }

  // Q7: BMI (height cm, weight kg)
  const h = parseFloat(a.q7_height) || 0;
  const w = parseFloat(a.q7_weight) || 0;
  if (h > 0 && w > 0) {
    const bmi = w / ((h / 100) ** 2);
    if (bmi >= 30) { score += 2; factors.push(`High BMI (${bmi.toFixed(1)})`); }
    else if (bmi >= 25) { score += 1; factors.push(`Overweight BMI (${bmi.toFixed(1)})`); }
  }

  // Q8: Booking BP
  const q8sys = parseInt(a.q8_sys) || 0;
  const q8dia = parseInt(a.q8_dia) || 0;
  if (q8sys >= 140 || q8dia >= 90) { score += 3; factors.push('High booking BP (≥140/90)'); }
  else if (q8sys >= 130 || q8dia >= 80) { score += 1; factors.push('Borderline booking BP'); }

  // Q9: Current BP
  const q9sys = parseInt(a.q9_sys) || 0;
  const q9dia = parseInt(a.q9_dia) || 0;
  if (q9sys >= 140 || q9dia >= 90) { score += 5; factors.push('Current BP ≥140/90 (hypertensive range)'); }
  else if (q9sys >= 130 || q9dia >= 80) { score += 3; factors.push('Current BP elevated (130–139/80–89)'); }

  // Q10: Symptoms (checkboxes — stored as comma-separated string)
  const symptoms = (a.q10 || '').split(',').filter(Boolean);
  if (symptoms.includes('headache')) { score += 2; factors.push('Severe headache reported'); }
  if (symptoms.includes('vision')) { score += 2; factors.push('Visual disturbances reported'); }
  if (symptoms.includes('pain')) { score += 2; factors.push('Upper abdominal pain reported'); }
  if (symptoms.includes('swelling')) { score += 1; factors.push('Sudden facial/hand swelling'); }
  if (symptoms.includes('breath')) { score += 1; factors.push('Shortness of breath at rest'); }

  // Q11: Weekly weight gain
  if (a.q11 === 'more2') { score += 1; factors.push('Rapid weight gain (≥2kg/week)'); }

  // Q12: Proteinuria
  if (a.q12 === '1plus') { score += 2; factors.push('Proteinuria 1+'); }
  if (a.q12 === '2plus') { score += 4; factors.push('Proteinuria 2+'); }
  if (a.q12 === '3plus') { score += 6; factors.push('Proteinuria 3++'); }

  // Risk band
  let band, color, advice;
  if (score <= 5) {
    band = 'Low Risk'; color = '#436746';
    advice = 'Your assessment indicates a low risk profile. Continue regular antenatal check-ups and maintain a healthy lifestyle.';
  } else if (score <= 12) {
    band = 'Moderate Risk'; color = '#80543B';
    advice = 'Some risk factors are present. Increase monitoring frequency, log BP daily, and inform your healthcare provider.';
  } else if (score <= 20) {
    band = 'High Risk'; color = '#BA1A1A';
    advice = 'Multiple significant risk factors detected. Contact your doctor promptly and follow the enhanced monitoring protocol.';
  } else {
    band = 'Critical — Seek Help'; color = '#BA1A1A';
    advice = 'Critical risk level detected. Please go to your nearest hospital or contact your doctor immediately.';
  }

  return { score, band, color, factors, advice };
}

// =============================================
// PAGE-SPECIFIC INITIALIZERS
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body.className;

  // --- INDEX PAGE ---
  if (body.includes('onboarding') || document.querySelector('.onboarding-screen')) {
    initIndex();
  }

  // --- SIGNIN PAGE ---
  if (body === 'signin-body') initSignin();

  // --- SIGNUP PAGE ---
  if (body === 'signup-body') initSignup();

  // --- DASHBOARD ---
  if (body === 'dashboard-body') initDashboard();

  // --- HEALTH HUB ---
  if (body === 'hub-body') initHealthHub();

  // --- KICK COUNTER (dedicated page) ---
  if (body === 'kick-body') initKickCounter();

  // --- LOG BP ---
  if (body === 'log-bp-body') initLogBP();

  // --- LOG VITALS ---
  if (body === 'log-vitals-body') initLogVitals();

  // --- REMINDERS ---
  if (body === 'reminders-body') initReminders();

  // --- PROFILE ---
  if (body === 'profile-body') initProfile();

  // --- ASSESSMENT REPORT ---
  if (body === 'report-body') initReport();

  // --- Q PAGES ---
  initQPage();
});

// =============================================
// INDEX
// =============================================
function initIndex() {
  const btnStart = document.querySelector('.btn-primary');
  const btnSignin = document.querySelector('.btn-secondary');
  if (btnStart) btnStart.onclick = () => location.href = 'signup.html';
  if (btnSignin) btnSignin.onclick = () => location.href = 'signin.html';
}

// =============================================
// SIGN IN
// =============================================
function initSignin() {
  const form = document.querySelector('form.form-fields');
  const createLink = document.querySelector('.create-account');
  if (createLink) createLink.href = 'signup.html';
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      location.href = 'dashboard.html';
    });
  }
}

// =============================================
// SIGN UP
// =============================================
function initSignup() {
  const form = document.querySelector('.signup-form');
  const signinLink = document.querySelector('.login-link a');
  if (signinLink) signinLink.href = 'signin.html';

  // Auto-calculate EDD from LMP
  const lmpInput = document.querySelector('.lmp-card input[type="date"]');
  const eddInput = document.querySelector('.edd-card input[type="date"]');
  if (lmpInput && eddInput) {
    lmpInput.addEventListener('change', () => {
      if (lmpInput.value) {
        const lmp = new Date(lmpInput.value);
        const edd = new Date(lmp.getTime() + 280 * 86400000);
        eddInput.value = edd.toISOString().split('T')[0];
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('input[type="text"]')?.value || 'Friend';
      const lmp = lmpInput?.value || '';
      const edd = eddInput?.value || '';
      GG.set('gg_profile', { name, lmp, edd });
      location.href = 'dashboard.html';
    });
  }
}

// =============================================
// DASHBOARD
// =============================================
function initDashboard() {
  const profile = GG.get('gg_profile', { name: 'Sarah', lmp: '' });
  const info = calcWeekInfo(profile.lmp);

  // Greeting
  const greetTime = document.querySelector('.greeting');
  const greetName = document.querySelector('.user-name');
  if (greetTime) greetTime.textContent = getGreeting();
  if (greetName) greetName.textContent = profile.name || 'Sarah';

  // Week card
  const trimEl = document.querySelector('.label-caps');
  const weekEl = document.querySelector('.week-number');
  const daysEl = document.querySelector('.days-left');
  const barEl = document.querySelector('.progress-fill');
  if (trimEl) trimEl.textContent = info.trimester;
  if (weekEl) weekEl.textContent = `Week ${info.week}`;
  if (daysEl) daysEl.textContent = `${info.daysLeft} days to go`;
  if (barEl) barEl.style.width = `${info.pct}%`;

  // Risk banner
  const answers = GG.get('gg_q_answers', {});
  const hasAnswers = Object.keys(answers).length > 0;
  if (hasAnswers) {
    const result = calcRiskScore(answers);
    const scoreEl = document.querySelector('.score-num');
    const riskTitle = document.querySelector('.risk-text h3');
    if (scoreEl) scoreEl.textContent = result.score;
    if (riskTitle) riskTitle.textContent = `Preeclampsia Risk: ${result.band}`;
  }

  // Latest Vitals
  const bpLogs = GG.get('gg_bp_logs', []);
  const bpVal = document.getElementById('dash-bp');
  if (bpVal && bpLogs.length > 0) {
    const latest = bpLogs[bpLogs.length - 1];
    bpVal.textContent = `${latest.sys}/${latest.dia}`;
  }

  const vitalsLogs = GG.get('gg_vitals_logs', []);
  const weightEl = document.getElementById('dash-weight');
  const sleepEl = document.getElementById('dash-sleep');
  if (vitalsLogs.length > 0) {
    const latestV = vitalsLogs[vitalsLogs.length - 1];
    if (weightEl && latestV.weight) weightEl.innerHTML = `${latestV.weight} <small>kg</small>`;
    if (sleepEl && latestV.sleep) sleepEl.innerHTML = `${latestV.sleep} <small>hrs</small>`;
  }

  // Red Alert banner
  injectRedAlert(bpLogs);

  // Nav links
  document.querySelectorAll('.bento-card').forEach(btn => {
    const label = btn.textContent.trim();
    if (label.includes('Log BP')) btn.onclick = () => location.href = 'log-bp.html';
    if (label.includes('Kick')) btn.onclick = () => location.href = 'kick-counter.html';
    if (label.includes('Vital')) btn.onclick = () => location.href = 'log-vitals.html';
    if (label.includes('AI Assistant')) btn.onclick = () => location.href = 'health-hub.html';
    if (label.includes('Reports')) btn.onclick = () => location.href = 'assessment-report.html';
    if (label.includes('Reminders')) btn.onclick = () => location.href = 'reminders.html';
  });

  const logBtn = document.querySelector('.btn-dashed-log');
  if (logBtn) logBtn.onclick = () => location.href = 'log-vitals.html';

  // Bottom nav
  fixBottomNav();
}

// =============================================
// HEALTH HUB
// =============================================
function initHealthHub() {
  // --- Kick Counter Hub Logic ---
  const kicks = GG.get('gg_kicks', { count: 0 });
  const countEl = document.querySelector('.kick-count');
  const tapBtn = document.getElementById('hub-kick-btn');
  
  if (countEl) countEl.textContent = kicks.count;
  if (tapBtn && countEl) {
    tapBtn.addEventListener('click', () => {
      kicks.count++;
      countEl.textContent = kicks.count;
      GG.set('gg_kicks', kicks);
    });
  }

  // --- Latest BP ---
  const bpLogs = GG.get('gg_bp_logs', []);
  const bpEl = document.querySelector('.bp-value');
  if (bpEl && bpLogs.length > 0) {
    const l = bpLogs[bpLogs.length - 1];
    bpEl.textContent = `${l.sys}/${l.dia}`;
  }

  // --- Hydration Tracker ---
  const hydrationInputs = document.querySelectorAll('input[name="hydration"]');
  const hydrationBanner = document.querySelector('.hydration-status-banner');
  const savedHydration = GG.get('gg_hydration_lvl', '1');

  hydrationInputs.forEach(input => {
    if (input.value === savedHydration) input.checked = true;
    input.addEventListener('change', (e) => {
      const val = e.target.value;
      GG.set('gg_hydration_lvl', val);
      if (hydrationBanner) {
        if (val <= 2) hydrationBanner.textContent = "Perfectly Hydrated — You're doing great!";
        else if (val <= 5) hydrationBanner.textContent = "Mildly Dehydrated — Drink a glass of water.";
        else hydrationBanner.textContent = "Significantly Dehydrated — Focus on fluids now.";
      }
    });
  });

  // --- Medication Log Persistence ---
  const medCheckboxes = document.querySelectorAll('.med-item input[type="checkbox"]');
  const medStates = GG.get('gg_med_states', {});

  medCheckboxes.forEach((cb, idx) => {
    const medKey = `med_${idx}`;
    if (medStates[medKey]) {
      cb.checked = true;
      cb.closest('.med-item').classList.add('checked');
    }
    cb.addEventListener('change', (e) => {
      medStates[medKey] = e.target.checked;
      GG.set('gg_med_states', medStates);
      if (e.target.checked) cb.closest('.med-item').classList.add('checked');
      else cb.closest('.med-item').classList.remove('checked');
    });
  });

  fixBottomNav();
}

// =============================================
// KICK COUNTER (dedicated page)
// =============================================
function initKickCounter() {
  const kicks = GG.get('gg_kicks', { count: 0, sessionStart: Date.now() });
  if (!kicks.sessionStart) { kicks.sessionStart = Date.now(); GG.set('gg_kicks', kicks); }

  const bigNum = document.querySelector('.big-number');
  const currentGoal = document.querySelector('.goal-numbers .current');
  const progressFill = document.querySelector('.daily-goal-card .progress-bar-fill');
  const sessionEl = document.querySelector('.session-info');
  const addBtn = document.querySelector('.btn-add-kick');
  const manualInput = document.querySelector('.manual-input');
  const timerEl = document.querySelector('.info-pill span');

  const GOAL = 10;
  const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours

  function updateUI() {
    const c = kicks.count;
    if (bigNum) bigNum.textContent = c;
    if (currentGoal) currentGoal.textContent = c;
    if (progressFill) progressFill.style.width = `${Math.min((c / GOAL) * 100, 100)}%`;

    // Celebration
    if (c >= GOAL && bigNum) {
      bigNum.style.color = '#436746';
      bigNum.style.textShadow = '0 0 20px rgba(67,103,70,0.5)';
    }
  }

  // Session timer
  function updateTimer() {
    const elapsed = Date.now() - kicks.sessionStart;
    const mins = Math.floor(elapsed / 60000);
    const secs = Math.floor((elapsed % 60000) / 1000);
    if (sessionEl) sessionEl.textContent = `SESSION STARTED ${mins}m ${secs}s AGO`;

    const remaining = Math.max(0, SESSION_DURATION - elapsed);
    const remMins = Math.floor(remaining / 60000);
    if (timerEl) timerEl.textContent = `Active timer: ${remMins}m remaining`;
  }

  updateUI();
  updateTimer();
  setInterval(updateTimer, 1000);

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      kicks.count++;
      GG.set('gg_kicks', kicks);
      updateUI();
    });
  }

  if (manualInput) {
    manualInput.addEventListener('change', () => {
      const v = parseInt(manualInput.value) || 0;
      if (v > 0) {
        kicks.count = v;
        GG.set('gg_kicks', kicks);
        updateUI();
        manualInput.value = '';
      }
    });
  }
}

// =============================================
// LOG BP
// =============================================
function initLogBP() {
  const sysInput = document.querySelector('input[placeholder="120"]');
  const diaInput = document.querySelector('input[placeholder="80"]');
  const dateInput = document.querySelector('.dt-input-wrapper input[type="text"]');
  const timeInput = document.querySelectorAll('.dt-input-wrapper input[type="text"]')[1];
  const saveBtn = document.querySelector('.btn-save');

  // Auto-fill date/time
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (dateInput) dateInput.value = dateStr;
  if (timeInput) timeInput.value = timeStr;

  // Inline BP warning
  function checkBP() {
    const sys = parseInt(sysInput?.value) || 0;
    const dia = parseInt(diaInput?.value) || 0;
    let warn = document.getElementById('bp-warn');
    if (!warn) {
      warn = document.createElement('div');
      warn.id = 'bp-warn';
      warn.style.cssText = 'margin:8px 0;padding:10px 14px;border-radius:12px;font-size:13px;font-weight:600;display:none;';
      sysInput?.closest('section')?.after(warn);
    }
    if (sys >= 140 || dia >= 90) {
      warn.style.display = 'block';
      warn.style.background = '#FDECEA';
      warn.style.color = '#BA1A1A';
      warn.textContent = '⚠️ Hypertensive range (≥140/90) — contact your doctor today.';
    } else if (sys >= 130 || dia >= 80) {
      warn.style.display = 'block';
      warn.style.background = '#FFF3E0';
      warn.style.color = '#80543B';
      warn.textContent = '⚡ Borderline elevated — monitor closely.';
    } else if (sys > 0 || dia > 0) {
      warn.style.display = 'block';
      warn.style.background = '#E8F5E9';
      warn.style.color = '#436746';
      warn.textContent = '✓ Reading looks normal.';
    } else {
      warn.style.display = 'none';
    }
  }

  if (sysInput) sysInput.addEventListener('input', checkBP);
  if (diaInput) diaInput.addEventListener('input', checkBP);

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const sys = parseInt(sysInput?.value);
      const dia = parseInt(diaInput?.value);
      if (!sys || !dia || sys < 60 || sys > 250 || dia < 40 || dia > 150) {
        alert('Please enter valid systolic (60–250) and diastolic (40–150) values.');
        return;
      }
      const pos = document.querySelector('input[name="body_position"]:checked')?.value || 'sitting';
      const logs = GG.get('gg_bp_logs', []);
      logs.push({ sys, dia, position: pos, date: dateStr, time: timeStr });
      GG.set('gg_bp_logs', logs);
      alert(`BP ${sys}/${dia} mmHg saved!`);
      history.back();
    });
  }
}

// =============================================
// LOG VITALS
// =============================================
function initLogVitals() {
  const saveBtn = document.getElementById('btn-save-vitals');
  const weightInp = document.getElementById('vital-weight');
  const sleepInp = document.getElementById('vital-sleep');
  const stressInp = document.getElementById('vital-stress');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const weight = parseFloat(weightInp?.value);
      const sleep = parseFloat(sleepInp?.value);
      const stress = parseInt(stressInp?.value);

      if (!weight && !sleep) {
        alert('Please enter at least weight or sleep data.');
        return;
      }

      const logs = GG.get('gg_vitals_logs', []);
      logs.push({ 
        weight: weight || null, 
        sleep: sleep || null, 
        stress: stress || null,
        date: new Date().toISOString()
      });
      GG.set('gg_vitals_logs', logs);
      
      alert('Vitals updated successfully!');
      history.back();
    });
  }
}

// =============================================
// REMINDERS
// =============================================
function initReminders() {
  const listEl = document.getElementById('reminders-list');
  const btnAdd = document.querySelector('.btn-add-reminder');
  const btnClear = document.getElementById('btn-clear-reminders');
  const modal = document.getElementById('add-reminder-modal');
  const btnSave = document.getElementById('btn-save-reminder');
  const btnCancel = document.getElementById('btn-cancel-reminder');
  const titleInp = document.getElementById('new-reminder-title');
  const timeInp = document.getElementById('new-reminder-time');

  function renderReminders() {
    if (!listEl) return;
    const reminders = GG.get('gg_reminders', [
      { id: 1, title: 'Blood Pressure Log', time: '09:00', active: true },
      { id: 2, title: 'Prenatal Vitamins', time: '20:00', active: true }
    ]);
    
    if (reminders.length === 0) {
      listEl.innerHTML = '<p style="text-align:center;color:#8E938E;margin:20px 0;">No active reminders.</p>';
      return;
    }

    listEl.innerHTML = reminders.map(r => {
      let icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#436746" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>';
      if (r.title.toLowerCase().includes('blood pressure')) {
        icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#436746" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>';
      } else if (r.title.toLowerCase().includes('vitamin')) {
        icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#436746" stroke-width="2"><path d="M8 8h8v8H8zM12 5v14M5 12h14"/></svg>';
      }

      return `
        <div class="reminder-card">
          <div class="card-left">
            <div class="icon-wrapper-circle">
              ${icon}
            </div>
            <div class="card-text">
              <h4 class="reminder-title">${r.title}</h4>
              <p class="reminder-time">Daily at ${r.time}</p>
            </div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" data-id="${r.id}" ${r.active ? 'checked' : ''}>
            <span class="slider-round"></span>
          </label>
        </div>
      `;
    }).join('');

    // Toggle logic
    document.querySelectorAll('#reminders-list input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = parseInt(e.target.dataset.id);
        const rems = GG.get('gg_reminders', []);
        const target = rems.find(x => x.id === id);
        if (target) {
          target.active = e.target.checked;
          GG.set('gg_reminders', rems);
        }
      });
    });
  }

  if (btnAdd) btnAdd.addEventListener('click', () => { modal.style.display = 'flex'; });
  if (btnCancel) btnCancel.addEventListener('click', () => { modal.style.display = 'none'; titleInp.value=''; timeInp.value=''; });
  
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const title = titleInp.value.trim();
      const time = timeInp.value;
      if (!title || !time) return alert('Please provide a title and time.');
      
      const rems = GG.get('gg_reminders', [
        { id: 1, title: 'Blood Pressure Log', time: '09:00', active: true },
        { id: 2, title: 'Prenatal Vitamins', time: '20:00', active: true }
      ]);
      rems.push({ id: Date.now(), title, time, active: true });
      GG.set('gg_reminders', rems);
      
      modal.style.display = 'none';
      titleInp.value = '';
      timeInp.value = '';
      renderReminders();
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('Clear all reminders?')) {
        GG.set('gg_reminders', []);
        renderReminders();
      }
    });
  }

  renderReminders();
}

// =============================================
// PROFILE
// =============================================
function initProfile() {
  const profile = GG.get('gg_profile', {});
  const nameInput = document.querySelector('input[type="text"][value="Aditi Sharma"]') ||
                    document.querySelector('.input-group input[type="text"]');
  const saveBtn = document.querySelector('.btn-save');
  const signoutBtn = document.querySelector('.btn-signout');
  const exportBtn = document.getElementById('btn-export-data');
  const nameDisplay = document.querySelector('.profile-name');
  const weekBadge = document.querySelector('.week-badge span');

  if (profile.name) {
    if (nameDisplay) nameDisplay.textContent = profile.name;
    if (nameInput) nameInput.value = profile.name;
  }
  if (profile.lmp) {
    const info = calcWeekInfo(profile.lmp);
    if (weekBadge) weekBadge.textContent = `Week ${info.week}`;
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      profile.name = nameInput?.value || profile.name;
      GG.set('gg_profile', profile);
      alert('Profile saved!');
    });
  }
  
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = {
        profile: GG.get('gg_profile', {}),
        reminders: GG.get('gg_reminders', []),
        kicks: GG.get('gg_kicks', {}),
        bpLogs: GG.get('gg_bp_logs', []),
        vitals: GG.get('gg_vitals_logs', []),
        questionnaire: GG.get('gg_q_answers', {})
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Gestation_Guardian_Data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
      if (confirm('Sign out?')) {
        localStorage.clear();
        location.href = 'index.html';
      }
    });
  }
}

// =============================================
// ASSESSMENT REPORT
// =============================================
function initReport() {
  const answers = GG.get('gg_q_answers', {});
  const result = calcRiskScore(answers);

  // Score ring
  const scoreNum = document.getElementById('report-score');
  const ringFill = document.getElementById('ring-fill');
  const bandEl = document.getElementById('risk-band');
  const adviceEl = document.getElementById('risk-advice');
  const factorsList = document.getElementById('factors-list');

  if (scoreNum) scoreNum.textContent = result.score;
  if (bandEl) { bandEl.textContent = result.band; bandEl.style.color = result.color; }
  if (adviceEl) adviceEl.textContent = result.advice;

  // SVG ring (circumference 2π×80 ≈ 503)
  if (ringFill) {
    const circ = 503;
    const maxScore = 35;
    const offset = circ - (Math.min(result.score, maxScore) / maxScore) * circ;
    ringFill.setAttribute('stroke', result.color);
    setTimeout(() => ringFill.setAttribute('stroke-dashoffset', offset.toFixed(1)), 80);
  }

  if (factorsList && result.factors.length > 0) {
    factorsList.innerHTML = result.factors.map(f =>
      `<li style="padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.06);">${f}</li>`
    ).join('');
  } else if (factorsList) {
    factorsList.innerHTML = '<li>No significant risk factors detected.</li>';
  }

  // ── SOS Button (High / Critical only) ──────────────────────
  const bpLogs = GG.get('gg_bp_logs', []);
  let latestBpIsHypertensive = false;
  if (bpLogs.length > 0) {
    const lat = bpLogs[bpLogs.length - 1];
    if (lat.sys >= 140 || lat.dia >= 90) latestBpIsHypertensive = true;
  }

  const isCritical = result.band.includes('High') || result.band.includes('Critical') || latestBpIsHypertensive;
  if (isCritical) {
    // Mark screen state
    document.querySelector('.report-screen')?.classList.add('critical-state');

    // Inject SOS button
    const sosZone = document.getElementById('sos-zone');
    if (sosZone) {
      const sos = document.createElement('button');
      sos.id = 'btn-sos';
      sos.style.cssText = 'position:fixed;bottom:20px;left:20px;right:20px;z-index:9999;box-shadow:0 12px 32px rgba(186,26,26,0.6);width:calc(100% - 40px);max-width:390px;margin:0 auto;height:64px;';
      sos.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        SOS — EMERGENCY CALL`;
      sos.addEventListener('click', () => {
        if (confirm('This will dial emergency services. Continue?')) {
          window.location.href = 'tel:108';
        }
      });
      sosZone.appendChild(sos);
    }
  }

  // ── Share with Doctor modal ─────────────────────────────────
  const shareBtn = document.getElementById('btn-print');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => openShareModal(result, answers));
  }

  const homeBtn = document.getElementById('btn-dashboard');
  if (homeBtn) homeBtn.addEventListener('click', () => location.href = 'dashboard.html');
}

// ── Share-with-Doctor Modal ─────────────────────────────────────
function openShareModal(result, answers) {
  // Remove any existing
  document.getElementById('share-modal-overlay')?.remove();

  const profile = GG.get('gg_profile', { name: 'Patient' });
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const weekInfo = calcWeekInfo(profile.lmp);

  const summary = [
    `🚨 ER TRIAGE SUMMARY - PREECLAMPSIA SUSPECTED`,
    `=============================================`,
    `Patient: ${profile.name}`,
    `Age: ${answers.q1 || 'Unknown'} | GA: ${weekInfo.week} Weeks`,
    `Date/Time: ${today} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
    ``,
    `[ VITALS ]`,
    `Latest BP: ${answers.q9_sys || '—'}/${answers.q9_dia || '—'} mmHg`,
    `Booking BP: ${answers.q8_sys || '—'}/${answers.q8_dia || '—'} mmHg`,
    `Proteinuria: ${answers.q12 || 'Not tested'}`,
    ``,
    `[ RISK ASSESSMENT ]`,
    `Score: ${result.score} / 35`,
    `Band: ${result.band.toUpperCase()}`,
    ``,
    `[ IDENTIFIED RISK FACTORS ]`,
    ...result.factors.map(f => `  • ${f}`),
    ``,
    `[ CLINICAL HISTORY ]`,
    `  First Pregnancy: ${answers.q2 === 'first' ? 'Yes' : 'No'}`,
    `  Prior PE History: ${answers.q3 === 'yes' ? 'Yes' : 'No'}`,
    `  Pre-existing HTN: ${answers.q4 === 'yes' ? 'Yes' : 'No'}`,
    ``,
    `Auto-generated by Gestation Guardian`,
  ].join('\n');

  const overlay = document.createElement('div');
  overlay.id = 'share-modal-overlay';
  overlay.innerHTML = `
    <div id="share-modal">
      <h2>Share with Doctor</h2>
      <p class="share-sub">Copy this summary and paste it in a message or print it.</p>
      <pre id="share-summary">${summary}</pre>
      <div class="share-modal-btns">
        <button id="btn-copy-share">📋 Copy Summary</button>
        <button id="btn-close-share">Close</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  document.getElementById('btn-copy-share').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary);
      document.getElementById('btn-copy-share').textContent = '✓ Copied!';
      setTimeout(() => { document.getElementById('btn-copy-share').textContent = '📋 Copy Summary'; }, 2000);
    } catch {
      window.print();
    }
  });
  document.getElementById('btn-close-share').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}


// =============================================
// Q PAGES — Save answers & validate Next btn
// =============================================
function initQPage() {
  const body = document.body.className;
  if (!body.includes('q') || body.includes('hub')) return;

  // Detect which Q page
  const match = body.match(/q(\d+)-body/);
  if (!match) return;
  const qNum = parseInt(match[1]);

  const answers = GG.get('gg_q_answers', {});

  // Find the Next/action button (the last primary btn with onclick to next q)
  const nextBtns = document.querySelectorAll('button[onclick], footer button, section button, .q-actions button, .action-area button, .q2-footer button, .q3 button, div button');

  // Save answer helper
  function saveAnswer(val, key) {
    answers[key || `q${qNum}`] = val;
    GG.set('gg_q_answers', answers);
  }

  // Wire radio buttons to save
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => saveAnswer(radio.value));
  });

  // Wire checkboxes (Q10 multi-select)
  if (qNum === 10) {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = [...document.querySelectorAll('input[type="checkbox"]:checked')]
          .map(c => c.value).filter(v => v !== 'none').join(',');
        saveAnswer(checked);
      });
    });
  }

  // Wire number inputs
  document.querySelectorAll('input[type="number"]').forEach((inp, i) => {
    inp.addEventListener('input', () => {
      if (qNum === 7) {
        const inputs = document.querySelectorAll('input[type="number"]');
        saveAnswer(inputs[0]?.value, 'q7_height');
        saveAnswer(inputs[1]?.value, 'q7_weight');
        // Live BMI
        const h = parseFloat(inputs[0]?.value) || 0;
        const w = parseFloat(inputs[1]?.value) || 0;
        const bmiBox = document.querySelector('.bmi-value, .bmi-display-box');
        if (h > 0 && w > 0 && bmiBox) {
          const bmi = (w / ((h / 100) ** 2)).toFixed(1);
          let bmiNum = document.querySelector('.bmi-number');
          if (!bmiNum) {
            bmiNum = document.createElement('span');
            bmiNum.className = 'bmi-number';
            bmiNum.style.cssText = 'font-size:2rem;font-weight:700;color:#436746;';
            bmiBox.innerHTML = '';
            bmiBox.appendChild(bmiNum);
          }
          bmiNum.textContent = bmi;
        }
      } else if (qNum === 8) {
        const inputs = document.querySelectorAll('input[type="number"]');
        saveAnswer(inputs[0]?.value, 'q8_sys');
        saveAnswer(inputs[1]?.value, 'q8_dia');
      } else if (qNum === 9) {
        const inputs = document.querySelectorAll('input[type="number"]');
        saveAnswer(inputs[0]?.value, 'q9_sys');
        saveAnswer(inputs[1]?.value, 'q9_dia');
      } else {
        saveAnswer(inp.value);
      }
    });
  });

  // Fix Q12 Next → assessment-report.html
  if (qNum === 12) {
    document.querySelectorAll('button').forEach(btn => {
      if (btn.getAttribute('onclick')?.includes('health-hub')) {
        btn.setAttribute('onclick', "location.href='assessment-report.html'");
      }
    });
    document.querySelectorAll('label.q12-choice input[type="radio"]').forEach(r => {
      r.addEventListener('change', () => saveAnswer(r.value));
    });
  }
}

// =============================================
// BOTTOM NAV FIXER
// =============================================
function fixBottomNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    const span = item.querySelector('span');
    if (!span) return;
    const label = span.textContent.trim();
    item.querySelector('a')?.remove();
    if (label === 'Home') item.onclick = () => location.href = 'dashboard.html';
    if (label === 'Health') item.onclick = () => location.href = 'health-hub.html';
    if (label === 'Learn') item.onclick = () => location.href = 'care-guide.html';
    if (label === 'Profile') item.onclick = () => location.href = 'profile.html';
    item.style.cursor = 'pointer';
  });
}

// =============================================
// RED ALERT BANNER (Dashboard)
// =============================================
function injectRedAlert(bpLogs) {
  const zone = document.getElementById('red-alert-zone');
  if (!zone) return;
  if (!bpLogs || bpLogs.length === 0) return;

  const latest = bpLogs[bpLogs.length - 1];
  const isHypertensive = latest.sys >= 140 || latest.dia >= 90;
  const isBorderline = !isHypertensive && (latest.sys >= 130 || latest.dia >= 80);

  if (!isHypertensive && !isBorderline) return;

  const bg = isHypertensive ? 'linear-gradient(135deg,#BA1A1A,#D94040)' : 'linear-gradient(135deg,#80543B,#A0733A)';
  const icon = isHypertensive ? '🚨' : '⚡';
  const title = isHypertensive ? 'Hypertensive Alert' : 'Borderline BP Detected';
  const msg = isHypertensive
    ? `Last reading ${latest.sys}/${latest.dia} mmHg is in hypertensive range. Contact your doctor immediately.`
    : `Last reading ${latest.sys}/${latest.dia} mmHg is elevated. Monitor closely and consult your provider.`;

  zone.innerHTML = `
    <div id="bp-red-alert" style="
      margin:0 0 12px;padding:16px 18px;border-radius:18px;
      background:${bg};color:#fff;
      box-shadow:0 6px 24px rgba(186,26,26,0.3);
      display:flex;align-items:flex-start;gap:12px;
      cursor:pointer;
    " onclick="location.href='log-bp.html'">
      <span style="font-size:22px;flex-shrink:0;margin-top:2px;">${icon}</span>
      <div>
        <div style="font-size:14px;font-weight:700;margin-bottom:3px;">${title}</div>
        <div style="font-size:12px;opacity:0.9;line-height:1.4;">${msg}</div>
      </div>
      <svg style="flex-shrink:0;margin-left:auto;margin-top:2px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>`;
}

// =============================================
// BP SPARKLINE (Dashboard, pure SVG, no libs)
// =============================================
function renderBPSparkline(bpLogs) {
  const section = document.getElementById('bp-sparkline-section');
  const svg = document.getElementById('bp-sparkline-svg');
  const xLabels = document.getElementById('sparkline-x-labels');
  const latestLabel = document.getElementById('sparkline-latest-label');
  if (!section || !svg || !bpLogs || bpLogs.length < 2) return;

  section.style.display = 'block';

  // Take last 5 logs
  const data = bpLogs.slice(-5);
  const W = 300, H = 80, PAD = 12;

  // Extract systolic values
  const sysList = data.map(d => d.sys);
  const diaList = data.map(d => d.dia);
  const allVals = [...sysList, ...diaList];
  const minV = Math.min(...allVals) - 10;
  const maxV = Math.max(...allVals) + 10;

  const scaleX = i => PAD + (i / (data.length - 1)) * (W - PAD * 2);
  const scaleY = v => H - PAD - ((v - minV) / (maxV - minV)) * (H - PAD * 2);

  // Color per point based on M5 thresholds
  function bpColor(sys, dia) {
    if (sys >= 140 || dia >= 90) return '#BA1A1A'; // Red
    if (sys >= 130 || dia >= 80) return '#80543B'; // Amber
    return '#436746'; // Green
  }

  // Build polyline points string
  const sysPoints = sysList.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(' ');
  const diaPoints = diaList.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(' ');

  // Grid line at 140 (hypertensive threshold)
  const threshY = scaleY(140);

  svg.innerHTML = `
    <!-- Threshold line @ 140 -->
    <line x1="${PAD}" y1="${threshY}" x2="${W - PAD}" y2="${threshY}"
      stroke="#BA1A1A" stroke-width="1" stroke-dasharray="4 3" opacity="0.4"/>
    <text x="${W - PAD + 2}" y="${threshY + 4}" font-size="8" fill="#BA1A1A" opacity="0.6">140</text>

    <!-- Diastolic polyline (thin, dashed) -->
    <polyline points="${diaPoints}" fill="none" stroke="#8DB48E" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.7"/>

    <!-- Systolic polyline (solid) -->
    <polyline points="${sysPoints}" fill="none" stroke="#436746" stroke-width="2"/>

    <!-- Data points — colored by threshold -->
    ${sysList.map((v, i) => {
      const cx = scaleX(i), cy = scaleY(v);
      const col = bpColor(v, diaList[i]);
      return `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${col}" stroke="#fff" stroke-width="1.5"/>`;
    }).join('')}

    <!-- Legend -->
    <line x1="${PAD}" y1="6" x2="${PAD + 16}" y2="6" stroke="#436746" stroke-width="2"/>
    <text x="${PAD + 20}" y="10" font-size="9" fill="#436746">Systolic</text>
    <line x1="${PAD + 62}" y1="6" x2="${PAD + 78}" y2="6" stroke="#8DB48E" stroke-width="1.5" stroke-dasharray="4 2"/>
    <text x="${PAD + 82}" y="10" font-size="9" fill="#8DB48E">Diastolic</text>
  `;

  // X-axis date labels
  if (xLabels) {
    xLabels.innerHTML = data.map(d => `<span>${d.date || '—'}</span>`).join('');
  }

  // Latest reading label chip
  const lat = data[data.length - 1];
  if (latestLabel) {
    const col = bpColor(lat.sys, lat.dia);
    const colBg = lat.sys >= 140 || lat.dia >= 90 ? '#FDECEA' : lat.sys >= 130 || lat.dia >= 80 ? '#FFF3E0' : '#E8F5E9';
    latestLabel.textContent = `Latest: ${lat.sys}/${lat.dia}`;
    latestLabel.style.background = colBg;
    latestLabel.style.color = col;
  }
}

// =============================================
// WEIGHT SPARKLINE (Dashboard, pure SVG, no libs)
// =============================================
function renderWeightSparkline(vitalsLogs) {
  const section = document.getElementById('weight-sparkline-section');
  const svg = document.getElementById('weight-sparkline-svg');
  const xLabels = document.getElementById('weight-sparkline-x-labels');
  const latestLabel = document.getElementById('weight-sparkline-latest-label');
  
  // Filter logs to only those with weight
  const weightLogs = (vitalsLogs || []).filter(l => l.weight);
  if (!section || !svg || weightLogs.length < 2) return;

  section.style.display = 'block';

  // Take last 5 weight logs
  const data = weightLogs.slice(-5);
  const W = 300, H = 80, PAD = 12;

  const wList = data.map(d => parseFloat(d.weight));
  const minV = Math.min(...wList) - 1;
  const maxV = Math.max(...wList) + 1;

  const scaleX = i => PAD + (i / (data.length - 1)) * (W - PAD * 2);
  const scaleY = v => H - PAD - ((v - minV) / (maxV - minV)) * (H - PAD * 2);

  // Calculate if there's a rapid gain (>2kg jump)
  function isRapidGain(v, i) {
    if (i === 0) return false;
    const prev = wList[i - 1];
    return (v - prev) >= 2;
  }

  function weightColor(v, i) {
    return isRapidGain(v, i) ? '#BA1A1A' : '#436746'; // Red for rapid gain, Green for normal
  }

  // Build polyline points string
  const wPoints = wList.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(' ');

  svg.innerHTML = `
    <!-- Weight polyline (solid) -->
    <polyline points="${wPoints}" fill="none" stroke="#436746" stroke-width="2"/>

    <!-- Data points — colored by threshold -->
    ${wList.map((v, i) => {
      const cx = scaleX(i), cy = scaleY(v);
      const col = weightColor(v, i);
      return `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${col}" stroke="#fff" stroke-width="1.5"/>`;
    }).join('')}
  `;

  // X-axis date labels
  if (xLabels) {
    xLabels.innerHTML = data.map(d => {
      const dt = new Date(d.date);
      const str = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `<span>${str}</span>`;
    }).join('');
  }

  // Latest reading label chip
  const lat = data[data.length - 1];
  const lastIndex = data.length - 1;
  if (latestLabel) {
    const rapid = isRapidGain(wList[lastIndex], lastIndex);
    const col = rapid ? '#BA1A1A' : '#436746';
    const colBg = rapid ? '#FDECEA' : '#E8F5E9';
    latestLabel.textContent = `Latest: ${lat.weight} kg`;
    latestLabel.style.background = colBg;
    latestLabel.style.color = col;
  }
}
