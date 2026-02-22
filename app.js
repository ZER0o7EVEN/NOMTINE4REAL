// Global State
const app = {
  currentUser: null,
  users: {},
  settings: {},
  shops: {
    ranks: [
      {
        id: 'member',
        name: 'Member',
        price: 0,
        description: 'Default rank for all users',
        color: '#a78bfa',
        features: ['Access to public profiles', 'Join games', 'Chat'],
        icon: '👤'
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 999,
        description: 'Enhanced features and visibility',
        color: '#10b981',
        features: ['Custom profile customizations', 'Priority matchmaking', 'Special badge', 'Custom avatar color'],
        icon: '⭐'
      },
      {
        id: 'elite',
        name: 'Elite',
        price: 2499,
        description: 'Exclusive club with special perks',
        color: '#3b82f6',
        features: ['All Premium benefits', 'Custom background', 'Emote pack', 'Direct message priority', 'Badge showcase'],
        icon: '💎'
      },
      {
        id: 'legendary',
        name: 'Legendary',
        price: 4999,
        description: 'The highest achievement',
        color: '#f59e0b',
        features: ['All Elite benefits', 'Custom theme', 'Exclusive profile animations', 'VIP badge', 'Support priority'],
        icon: '👑'
      },
      {
        id: 'admin',
        name: 'Admin',
        price: 0,
        description: 'Administrative role (Owner only)',
        color: '#ef4444',
        features: ['Manage reports', 'Ban/kick users', 'View analytics', 'Manage ranks', 'Special badge'],
        icon: '🔴',
        special: true
      },
      {
        id: 'owner',
        name: 'Owner',
        price: 0,
        description: 'Owner of the platform',
        color: '#fbbf24',
        features: ['Full admin access', 'Grant admin status', 'Manage all users', 'Custom branded badge', 'Complete analytics'],
        icon: '👑',
        special: true
      }
    ]
  },
  CUSTOMIZATION_OPTIONS: [
    { id: 'bg-color', label: 'Profile Background Color', type: 'color', default: '#1a1a2e' },
    { id: 'text-color', label: 'Text Color', type: 'color', default: '#ffffff' },
    { id: 'accent-color', label: 'Accent Color', type: 'color', default: '#7c3aed' },
    { id: 'font-style', label: 'Font Style', type: 'select', options: ['Modern', 'Classic', 'Gaming', 'Minimal'], default: 'Modern' },
    { id: 'border-style', label: 'Border Style', type: 'select', options: ['Solid', 'Dashed', 'Dotted', 'None'], default: 'Solid' },
    { id: 'corner-radius', label: 'Corner Radius', type: 'range', min: '0', max: '50', default: '12' },
    { id: 'opacity', label: 'Card Opacity', type: 'range', min: '0.5', max: '1', step: '0.1', default: '0.9' },
    { id: 'glow-effect', label: 'Glow Effect', type: 'toggle', default: true },
    { id: 'animations', label: 'Enable Animations', type: 'toggle', default: true },
    { id: 'dark-mode', label: 'Dark Mode', type: 'toggle', default: true },
    { id: 'show-stats', label: 'Show Game Stats', type: 'toggle', default: true },
    { id: 'show-activity', label: 'Show Activity Timeline', type: 'toggle', default: true },
    { id: 'profile-gradient', label: 'Use Gradient Background', type: 'toggle', default: true },
    { id: 'gradient-color-1', label: 'Gradient Start Color', type: 'color', default: '#7c3aed' },
    { id: 'gradient-color-2', label: 'Gradient End Color', type: 'color', default: '#2d1b69' },
    { id: 'showcase-badges', label: 'Show Badge Collection', type: 'toggle', default: true },
    { id: 'bio-text', label: 'Custom Bio', type: 'textarea', default: 'No bio yet' },
    { id: 'favorite-game', label: 'Favorite Game', type: 'text', default: 'Not set' },
    { id: 'theme-preset', label: 'Theme Preset', type: 'select', options: ['Dark', 'Light', 'Neon', 'Forest', 'Ocean', 'Sunset'], default: 'Dark' },
    { id: 'profile-layout', label: 'Profile Layout', type: 'select', options: ['Standard', 'Compact', 'Extended', 'Minimal'], default: 'Standard' }
  ]
};

// Initialize App
function initApp() {
  loadUsersFromStorage();
  checkLoggedInUser();
  setupEventListeners();
  renderPage();
}

function loadUsersFromStorage() {
  const stored = localStorage.getItem('users');
  if (stored) {
    app.users = JSON.parse(stored);
  } else {
    // Create owner user
    app.users['Owner'] = {
      username: 'Owner',
      rank: 'owner',
      avatar: '👑',
      createdAt: new Date().toISOString(),
      currentGame: null,
      activity: [],
      customizations: {}
    };
    saveUsersToStorage();
  }
}

function checkLoggedInUser() {
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    app.currentUser = JSON.parse(stored);
  } else {
    app.currentUser = app.users['Owner'];
    localStorage.setItem('currentUser', JSON.stringify(app.currentUser));
  }
}

function saveUsersToStorage() {
  localStorage.setItem('users', JSON.stringify(app.users));
}

function setupEventListeners() {
  // Navigation
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-nav]')) {
      navigateTo(e.target.dataset.nav);
      e.preventDefault();
    }
    if (e.target.matches('[data-profile]')) {
      viewProfile(e.target.dataset.profile);
    }
  });
}

function navigateTo(page) {
  const main = document.getElementById('app-main');
  main.innerHTML = '';

  switch (page) {
    case 'home':
      renderHome(main);
      break;
    case 'shop':
      renderShop(main);
      break;
    case 'settings':
      renderSettings(main);
      break;
    case 'profiles':
      renderProfiles(main);
      break;
    case 'admin':
      if (app.currentUser.rank === 'owner' || app.currentUser.rank === 'admin') {
        renderAdmin(main);
      } else {
        showNotification('Access denied', 'danger');
      }
      break;
    default:
      renderHome(main);
  }
}

function renderPage() {
  const main = document.getElementById('app-main');
  renderHome(main);
}

function renderHome(container) {
  container.innerHTML = `
    <div class="fade-in">
      <div class="profile-header">
        <div class="profile-avatar">${app.currentUser.avatar}</div>
        <div class="profile-name">${app.currentUser.username}</div>
        <div class="profile-status">
          ${app.currentUser.currentGame ? `Playing: ${app.currentUser.currentGame}` : 'Offline'}
        </div>
        <div class="profile-badges">
          <span class="rank-badge rank-${app.currentUser.rank}">${app.currentUser.rank.toUpperCase()}</span>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <h2 style="margin-bottom: 1rem; color: var(--secondary);">Quick Stats</h2>
          <div style="display: grid; gap: 1rem;">
            <div>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">Member Since</div>
              <div style="font-weight: 600;">${new Date(app.currentUser.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">Current Rank</div>
              <div style="font-weight: 600;">${app.currentUser.rank.toUpperCase()}</div>
            </div>
            <div>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">Activity Level</div>
              <div style="font-weight: 600;">${app.currentUser.activity?.length || 0} activities</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 style="margin-bottom: 1rem; color: var(--secondary);">Quick Actions</h2>
          <button class="btn btn-primary" onclick="navigateTo('settings')" style="width: 100%; margin-bottom: 0.5rem;">Customize Profile</button>
          <button class="btn btn-secondary" onclick="navigateTo('shop')" style="width: 100%; margin-bottom: 0.5rem;">Browse Shop</button>
          <button class="btn btn-secondary" onclick="navigateTo('profiles')" style="width: 100%;">View Players</button>
        </div>
      </div>

      ${app.currentUser.activity && app.currentUser.activity.length > 0 ? `
        <div class="card" style="margin-top: 2rem;">
          <h2 style="margin-bottom: 1rem; color: var(--secondary);">Recent Activity</h2>
          ${app.currentUser.activity.slice(-5).map(activity => `
            <div class="activity-item">
              <div class="activity-icon">🎮</div>
              <div class="activity-text">
                <div class="activity-game">${activity.game}</div>
                <div class="activity-time">${new Date(activity.timestamp).toLocaleDateString()}</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function renderShop(container) {
  container.innerHTML = `
    <div class="fade-in">
      <h1 style="margin-bottom: 2rem; font-size: 2rem;">Rank Shop</h1>
      
      <div class="grid grid-2">
        ${app.shops.ranks.map(rank => `
          <div class="rank-card ${rank.id === 'owner' ? 'owner' : rank.id === 'admin' ? 'admin' : ''}">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${rank.icon}</div>
            <div class="rank-name">${rank.name}</div>
            <div class="rank-description">${rank.description}</div>
            ${rank.price > 0 ? `<div class="rank-price">${rank.price} coins</div>` : '<div class="rank-price">Special</div>'}
            <ul class="rank-features">
              ${rank.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
              ${app.currentUser.rank === rank.id ? 'Currently Using' : 'Purchase'}
            </button>
            ${app.currentUser.rank === rank.id ? '<div class="badge-owned">OWNED</div>' : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSettings(container) {
  container.innerHTML = `
    <div class="fade-in">
      <h1 style="margin-bottom: 2rem; font-size: 2rem;">Profile Customization</h1>
      
      <div class="tabs">
        <button class="tab-btn active" data-tab="appearance">Appearance</button>
        <button class="tab-btn" data-tab="bio">Bio & Info</button>
        <button class="tab-btn" data-tab="preferences">Preferences</button>
      </div>

      <div id="appearance" class="tab-content active">
        ${renderCustomizationGroup(container, 'appearance')}
      </div>
      <div id="bio" class="tab-content">
        ${renderCustomizationGroup(container, 'bio')}
      </div>
      <div id="preferences" class="tab-content">
        ${renderCustomizationGroup(container, 'preferences')}
      </div>

      <div style="margin-top: 2rem;">
        <button class="btn btn-primary" onclick="saveCustomizations()">Save Changes</button>
      </div>
    </div>
  `;

  setupTabListeners(container);
}

function renderCustomizationGroup(container, group) {
  let html = '';
  const groupedOptions = {
    appearance: app.CUSTOMIZATION_OPTIONS.slice(0, 7),
    bio: app.CUSTOMIZATION_OPTIONS.slice(17, 20),
    preferences: app.CUSTOMIZATION_OPTIONS.slice(7, 17)
  };

  groupedOptions[group].forEach(option => {
    const current = app.currentUser.customizations?.[option.id] || option.default;
    
    let input = '';
    if (option.type === 'color') {
      input = `<input type="color" class="color-picker" value="${current}" data-setting="${option.id}">`;
    } else if (option.type === 'range') {
      input = `<input type="range" min="${option.min}" max="${option.max}" step="${option.step || '1'}" value="${current}" data-setting="${option.id}" style="width: 200px;">`;
    } else if (option.type === 'toggle') {
      input = `<div class="toggle ${current ? 'active' : ''}" data-setting="${option.id}" onclick="toggleSetting(this)"><div class="toggle-dot"></div></div>`;
    } else if (option.type === 'select') {
      input = `<select data-setting="${option.id}">
        ${option.options.map(opt => `<option ${opt === current ? 'selected' : ''}>${opt}</option>`).join('')}
      </select>`;
    } else if (option.type === 'textarea') {
      input = `<textarea data-setting="${option.id}" rows="3">${current}</textarea>`;
    } else {
      input = `<input type="text" value="${current}" data-setting="${option.id}">`;
    }

    html += `
      <div class="setting-item">
        <div>
          <div class="setting-label">${option.label}</div>
        </div>
        ${input}
      </div>
    `;
  });

  return html;
}

function renderProfiles(container) {
  container.innerHTML = `
    <div class="fade-in">
      <h1 style="margin-bottom: 2rem; font-size: 2rem;">Players</h1>
      
      <div class="grid">
        ${Object.values(app.users).map(user => `
          <div class="card" style="cursor: pointer; text-align: center;" onclick="viewProfile('${user.username}')">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${user.avatar}</div>
            <h3 style="margin-bottom: 0.5rem;">${user.username}</h3>
            <span class="rank-badge rank-${user.rank}">${user.rank.toUpperCase()}</span>
            <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
              ${user.currentGame ? `Playing: ${user.currentGame}` : 'Offline'}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function viewProfile(username) {
  const user = app.users[username];
  if (!user) {
    showNotification('User not found', 'danger');
    return;
  }

  const modal = document.getElementById('profile-modal');
  const content = modal.querySelector('.modal-content');
  
  const customizations = user.customizations || {};
  const bgColor = customizations['bg-color'] || '#1a1a2e';
  const textColor = customizations['text-color'] || '#ffffff';
  const accentColor = customizations['accent-color'] || '#7c3aed';
  const bio = customizations['bio-text'] || 'No bio yet';
  const favoriteGame = customizations['favorite-game'] || 'Not set';

  content.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">${username}'s Profile</h2>
      <button class="modal-close" onclick="document.getElementById('profile-modal').classList.remove('active')">✕</button>
    </div>
    
    <div style="background: ${bgColor}; padding: 2rem; border-radius: 12px; text-align: center; color: ${textColor};">
      <div style="font-size: 4rem; margin-bottom: 1rem;">${user.avatar}</div>
      <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${username}</h3>
      <span class="rank-badge rank-${user.rank}">${user.rank.toUpperCase()}</span>
      
      <div style="margin-top: 2rem; border-top: 2px solid ${accentColor}; padding-top: 1.5rem;">
        <div style="margin-bottom: 1.5rem;">
          <div style="color: ${textColor}; opacity: 0.7; font-size: 0.9rem; margin-bottom: 0.5rem;">Bio</div>
          <div>${bio}</div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <div style="color: ${textColor}; opacity: 0.7; font-size: 0.9rem; margin-bottom: 0.5rem;">Favorite Game</div>
          <div>${favoriteGame}</div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <div style="color: ${textColor}; opacity: 0.7; font-size: 0.9rem; margin-bottom: 0.5rem;">Status</div>
          <div>${user.currentGame ? `🎮 Playing: ${user.currentGame}` : 'Offline'}</div>
        </div>
      </div>

      ${user.activity && user.activity.length > 0 ? `
        <div style="margin-top: 2rem; border-top: 2px solid ${accentColor}; padding-top: 1.5rem;">
          <h4 style="margin-bottom: 1rem;">Recent Activity</h4>
          ${user.activity.slice(-5).map(activity => `
            <div style="margin-bottom: 0.5rem; opacity: 0.8;">
              🎮 ${activity.game} - ${new Date(activity.timestamp).toLocaleDateString()}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
  
  modal.classList.add('active');
}

function renderAdmin(container) {
  if (app.currentUser.rank !== 'owner' && app.currentUser.rank !== 'admin') {
    container.innerHTML = '<div class="card"><h2>Access Denied</h2></div>';
    return;
  }

  container.innerHTML = `
    <div class="fade-in">
      <h1 style="margin-bottom: 2rem; font-size: 2rem;">
        ${app.currentUser.rank === 'owner' ? 'Owner Menu' : 'Admin Menu'}
      </h1>

      ${app.currentUser.rank === 'owner' ? `
        <div class="settings-group">
          <h3>Manage Admins</h3>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem;">Select user to make admin:</label>
            <select id="admin-select">
              <option value="">Choose a user...</option>
              ${Object.entries(app.users).filter(([_, u]) => u.rank !== 'admin' && u.rank !== 'owner').map(([name, _]) => 
                `<option value="${name}">${name}</option>`
              ).join('')}
            </select>
          </div>
          <button class="btn btn-primary" onclick="makeAdmin()">Grant Admin Status</button>
        </div>
      ` : ''}

      <div class="settings-group">
        <h3>Manage Users</h3>
        <div style="display: grid; gap: 1rem;">
          ${Object.entries(app.users).map(([name, user]) => `
            <div style="background: rgba(124, 58, 237, 0.1); padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>${name}</strong> - <span class="rank-badge rank-${user.rank}">${user.rank.toUpperCase()}</span>
              </div>
              ${app.currentUser.rank === 'owner' ? `
                <button class="btn btn-danger" onclick="removeUser('${name}')" style="padding: 0.5rem 1rem;">Remove</button>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function makeAdmin() {
  const select = document.getElementById('admin-select');
  const username = select.value;

  if (!username) {
    showNotification('Please select a user', 'danger');
    return;
  }

  if (app.currentUser.rank !== 'owner') {
    showNotification('Only owner can grant admin status', 'danger');
    return;
  }

  app.users[username].rank = 'admin';
  saveUsersToStorage();
  showNotification(`${username} is now an Admin!`, 'success');
  renderAdmin(document.getElementById('app-main'));
}

function removeUser(username) {
  if (app.currentUser.rank !== 'owner') {
    showNotification('Access denied', 'danger');
    return;
  }

  if (confirm(`Are you sure you want to remove ${username}?`)) {
    delete app.users[username];
    saveUsersToStorage();
    showNotification(`${username} has been removed`, 'success');
    renderAdmin(document.getElementById('app-main'));
  }
}

function saveCustomizations() {
  if (!app.currentUser.customizations) {
    app.currentUser.customizations = {};
  }

  document.querySelectorAll('[data-setting]').forEach(el => {
    const setting = el.dataset.setting;
    let value = el.value;

    if (el.classList.contains('toggle')) {
      value = el.classList.contains('active');
    }

    app.currentUser.customizations[setting] = value;
  });

  app.users[app.currentUser.username] = app.currentUser;
  saveUsersToStorage();
  localStorage.setItem('currentUser', JSON.stringify(app.currentUser));
  showNotification('Customizations saved successfully!', 'success');
}

function toggleSetting(el) {
  el.classList.toggle('active');
}

function setupTabListeners(container) {
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : '#7c3aed'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function addGameActivity(game) {
  if (!app.currentUser.activity) {
    app.currentUser.activity = [];
  }

  app.currentUser.activity.push({
    game: game,
    timestamp: new Date().toISOString()
  });

  if (app.currentUser.activity.length > 20) {
    app.currentUser.activity.shift();
  }

  app.users[app.currentUser.username] = app.currentUser;
  saveUsersToStorage();
}

// Initialize on load
window.addEventListener('DOMContentLoaded', initApp);
