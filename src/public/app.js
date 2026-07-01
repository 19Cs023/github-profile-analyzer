const apiBase = '/api/profiles';

const analyzeForm = document.getElementById('analyzeForm');
const usernameInput = document.getElementById('usernameInput');
const statusText = document.getElementById('statusText');
const profilesList = document.getElementById('profilesList');
const profileDetail = document.getElementById('profileDetail');
const refreshBtn = document.getElementById('refreshBtn');

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}

function setStatus(message, type = '') {
  statusText.textContent = message;
  statusText.className = `status ${type}`.trim();
}

function escapeHtml(input) {
  const text = String(input ?? '');
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderProfileDetail(profile) {
  if (!profile) {
    profileDetail.className = 'profile-detail empty';
    profileDetail.textContent = 'Select or analyze a profile to view details.';
    return;
  }

  profileDetail.className = 'profile-detail';
  profileDetail.innerHTML = `
    <div class="detail-head">
      <img src="${escapeHtml(profile.avatar_url)}" alt="${escapeHtml(profile.username)} avatar" />
      <div>
        <h3>${escapeHtml(profile.name || profile.username)}</h3>
        <p>@${escapeHtml(profile.username)}</p>
      </div>
    </div>
    <p>${escapeHtml(profile.bio || 'No bio provided.')}</p>
    <p><a href="${escapeHtml(profile.profile_url)}" target="_blank" rel="noopener noreferrer">View GitHub Profile</a></p>
    <div class="meta">
      <div class="meta-item"><strong>${profile.public_repos ?? 0}</strong><span>Public Repos</span></div>
      <div class="meta-item"><strong>${profile.followers ?? 0}</strong><span>Followers</span></div>
      <div class="meta-item"><strong>${profile.following ?? 0}</strong><span>Following</span></div>
    </div>
  `;
}

function renderProfilesList(profiles) {
  if (!Array.isArray(profiles) || profiles.length === 0) {
    profilesList.innerHTML = '<li class="profile-item"><strong>No profiles found</strong><span>Analyze a GitHub username to begin</span></li>';
    return;
  }

  profilesList.innerHTML = profiles
    .map((profile) => `
      <li class="profile-item" data-username="${escapeHtml(profile.username)}">
        <strong>${escapeHtml(profile.name || profile.username)}</strong>
        <span>@${escapeHtml(profile.username)}</span>
      </li>
    `)
    .join('');
}

async function loadProfiles() {
  const profiles = await requestJson(apiBase);
  renderProfilesList(profiles);
  return profiles;
}

async function loadProfileByUsername(username) {
  const profile = await requestJson(`${apiBase}/${encodeURIComponent(username)}`);
  renderProfileDetail(profile);
}

analyzeForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();

  if (!username) {
    setStatus('Please enter a GitHub username.', 'error');
    return;
  }

  setStatus('Analyzing profile...');

  try {
    const payload = await requestJson(`${apiBase}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    renderProfileDetail(payload.data);
    await loadProfiles();
    setStatus('Profile analyzed and saved successfully.', 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  }
});

profilesList.addEventListener('click', async (event) => {
  const item = event.target.closest('.profile-item');
  if (!item) {
    return;
  }

  const { username } = item.dataset;
  if (!username) {
    return;
  }

  try {
    setStatus('Loading selected profile...');
    await loadProfileByUsername(username);
    setStatus('Profile loaded.', 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  }
});

refreshBtn.addEventListener('click', async () => {
  try {
    setStatus('Refreshing profiles...');
    await loadProfiles();
    setStatus('Profile list updated.', 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  }
});

(async function init() {
  try {
    setStatus('Loading profiles...');
    const profiles = await loadProfiles();

    if (profiles.length > 0) {
      await loadProfileByUsername(profiles[0].username);
      setStatus('Ready.', 'success');
    } else {
      setStatus('Ready. Start by analyzing a username.');
    }
  } catch (error) {
    setStatus(error.message, 'error');
  }
})();
