// ============================================
// FIREBASE SETUP
// ============================================
let db = null;
try {
    const firebaseConfig = {
      apiKey: "AIzaSyDKqhSa-fFT-R8DGWeGq0tFsuHySTto2NU",
      authDomain: "notminechat-71bd0.firebaseapp.com",
      databaseURL: "https://notminechat-71bd0-default-rtdb.firebaseio.com",
      projectId: "notminechat-71bd0",
      storageBucket: "notminechat-71bd0.firebasestorage.app",
      messagingSenderId: "446821268917",
      appId: "1:446821268917:web:181c7ad0e0b4241b02adfc"
    };
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
} catch(e) { 
    console.error("Firebase Error: ", e); 
}

// ============================================
// SETTINGS MANAGEMENT
// ============================================
let currentUser = null;
let settings = {};

function initSettings() {
    currentUser = localStorage.getItem('nm4r-user') || 'Guest';
    document.getElementById('username-text').textContent = currentUser;
    document.getElementById('username-display').textContent = currentUser;

    const stored = localStorage.getItem('nm4r-settings');
    settings = stored ? JSON.parse(stored) : {};
    
    renderSettings();
    loadPfp();
    lucide.createIcons();
}

function updateSetting(key, value) {
    settings[key] = value;
    localStorage.setItem('nm4r-settings', JSON.stringify(settings));
    showSaveIndicator();
    if(db && currentUser !== 'Guest') {
        db.ref(`accounts/${currentUser}/settings/${key}`).set(value).catch(e => console.error(e));
    }
}

function updateProfileSetting(key, value) {
    settings[key] = value;
    localStorage.setItem('nm4r-settings', JSON.stringify(settings));
    showSaveIndicator();
    if(db && currentUser !== 'Guest') {
        db.ref(`profiles/${currentUser}/customizations/${key}`).set(value).catch(e => console.error(e));
    }
}

function renderSettings() {
    document.getElementById('status-input').value = settings.status || '';
    document.getElementById('border-radius').value = parseInt(settings.borderRadius) || 20;
    document.getElementById('border-radius-display').textContent = settings.borderRadius || '20px';
    document.getElementById('text-size').value = parseInt(settings.textSize) || 16;
    document.getElementById('text-size-display').textContent = settings.textSize || '16px';
    document.getElementById('font-base').value = settings.fontBase || "'Outfit', sans-serif";

    document.getElementById('bio-input').value = settings.bio || '';
    document.getElementById('profile-status').value = settings.statusText || '';
    document.getElementById('layout-select').value = settings.layout || 'vertical';
    document.getElementById('pfp-style').value = settings.pfpStyle || 'rounded-full';
    document.getElementById('bg-color').value = settings.bgColor || '#0a0a0a';
    document.getElementById('accent-color').value = settings.accentColor || '#a78bfa';
    document.getElementById('name-color').value = settings.nameColor || '#ffffff';
    document.getElementById('theme-preset').value = settings.theme || 'default';

    document.getElementById('tab-title').value = settings.tabTitle || 'NOTMINE4REAL';
    document.getElementById('tab-icon').value = settings.tabIcon || '';

    document.getElementById('panic-key').value = settings.panicKey || '`';
    document.getElementById('panic-url').value = settings.panicUrl || 'https://classroom.google.com';
}

function loadPfp() {
    const stored = localStorage.getItem('nm4r-settings');
    if(stored) {
        const data = JSON.parse(stored);
        if(data.profilePic) {
            document.getElementById('pfp-preview').src = data.profilePic;
        }
    }
}

// ============================================
// UI HANDLERS
// ============================================
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById('tab-' + tabName).classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.nav-btn').classList.add('active');
    window.scrollTo(0, 0);
}

function handlePfpUpload(e) {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_DIM = 128;
            let width = img.width, height = img.height;
            if(width > height) { 
                if(width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM; } 
            } else { 
                if(height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM; } 
            }
            canvas.width = width; 
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            updateSetting('profilePic', dataUrl);
            document.getElementById('pfp-preview').src = dataUrl;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function changeUsername() {
    const newName = prompt("Enter new username:");
    if(!newName) return;
    alert("Username change not yet implemented. Use main app to change.");
}

function changePassword() {
    const newPass = prompt("Enter new password:");
    if(!newPass) return;
    updateSetting('password', newPass);
    alert("Password updated!");
}

function syncData() {
    if(currentUser === 'Guest') {
        alert("Please login first!");
        return;
    }
    if(!db) {
        alert("No internet connection!");
        return;
    }
    db.ref(`accounts/${currentUser}/settings`).set(settings).then(() => {
        alert("✓ Cloud sync complete!");
        showSaveIndicator();
    }).catch(e => alert("Sync failed: " + e));
}

function logout() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('nm4r-user');
        localStorage.removeItem('nm4r-pass');
        location.href = 'index.html';
    }
}

function togglePerf() {
    const isActive = document.getElementById('perf-mode-toggle').classList.contains('active');
    updateSetting('perfMode', !isActive);
    document.getElementById('perf-mode-toggle').classList.toggle('active');
}

function toggleAnimations() {
    const isActive = document.getElementById('no-anim-toggle').classList.contains('active');
    updateSetting('noAnimations', !isActive);
    document.getElementById('no-anim-toggle').classList.toggle('active');
}

function toggleParticles() {
    const isActive = document.getElementById('no-particles-toggle').classList.contains('active');
    updateSetting('noParticles', !isActive);
    document.getElementById('no-particles-toggle').classList.toggle('active');
}

function toggleProfileFeature(feature) {
    const btn = event.currentTarget;
    const isActive = btn.classList.contains('active');
    updateProfileSetting(feature, !isActive);
    btn.classList.toggle('active');
}

function setCloak(title, icon) {
    updateSetting('tabTitle', title);
    updateSetting('tabIcon', icon);
    document.getElementById('tab-title').value = title;
    document.getElementById('tab-icon').value = icon;
}

function setPanicPreset(url) {
    updateSetting('panicUrl', url);
    document.getElementById('panic-url').value = url;
}

function setTheme(theme) {
    updateSetting('theme', theme);
    document.getElementById('theme-preset').value = theme;
}

function setAccentColor(color) {
    updateSetting('accentColor', color);
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function setCustomColor() {
    const color = prompt("Enter hex color (e.g. #ff00ff):");
    if(color) setAccentColor(color);
}

function executeCloak() {
    const settingsData = JSON.parse(localStorage.getItem('nm4r-settings') || '{}');
    const newWindow = window.open('about:blank', '_blank');
    if(newWindow) {
        newWindow.document.title = settingsData.tabTitle || 'NOTMINE4REAL';
        const iframe = newWindow.document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;border:0;';
        iframe.src = 'index.html';
        newWindow.document.body.appendChild(iframe);
    }
}

function previewProfile() {
    if(typeof profileSystem !== 'undefined' && window.opener && window.opener.profileSystem) {
        window.opener.profileSystem.showProfileModal(currentUser);
    } else {
        alert("Open from main app to preview!");
    }
}

function showSaveIndicator() {
    const indicator = document.getElementById('save-indicator');
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 2000);
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('input', (e) => {
    if(e.target.id === 'border-radius') {
        document.getElementById('border-radius-display').textContent = e.target.value + 'px';
    }
    if(e.target.id === 'text-size') {
        document.getElementById('text-size-display').textContent = e.target.value + 'px';
    }
});

window.addEventListener('load', initSettings);

// Mark settings page as loaded
window.settingsPageLoaded = true;
