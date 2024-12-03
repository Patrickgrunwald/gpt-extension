import { loginUser, registerUser, getCurrentUser } from './src/firebase/auth.js';
import { addFolder, getFolders, updateFolder, deleteFolder } from './src/firebase/db.js';

// State management
let folders = [];
let currentUser = null;

// DOM Elements
const foldersList = document.getElementById('foldersList');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const addFolderBtn = document.getElementById('addFolderBtn');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const closeBtn = document.getElementById('closeBtn');

// Event Listeners
searchInput.addEventListener('input', filterFolders);
sortSelect.addEventListener('change', sortFolders);
addFolderBtn.addEventListener('click', addNewFolder);
closeBtn.addEventListener('click', () => window.close());

loginBtn.addEventListener('click', async () => {
  try {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    
    if (email && password) {
      currentUser = await loginUser(email, password);
      await loadFolders();
      updateUI();
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
});

signupBtn.addEventListener('click', async () => {
  try {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    
    if (email && password) {
      currentUser = await registerUser(email, password);
      updateUI();
    }
  } catch (error) {
    alert('Sign up failed: ' + error.message);
  }
});

async function loadFolders() {
  if (currentUser) {
    try {
      folders = await getFolders(currentUser.uid);
      renderFolders();
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  }
}

function updateUI() {
  if (currentUser) {
    loginBtn.textContent = 'Logout';
    signupBtn.style.display = 'none';
  } else {
    loginBtn.textContent = 'Login';
    signupBtn.style.display = 'block';
  }
}

function renderFolders() {
  foldersList.innerHTML = '';
  
  folders.forEach((folder, index) => {
    const folderElement = document.createElement('div');
    folderElement.className = 'folder-item bg-blue-600 rounded-lg p-4 text-white relative';
    
    folderElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-black bg-opacity-20 rounded-full"></div>
          <div>
            <h6 class="font-semibold">${folder.name}</h6>
            <p class="text-xs">${folder.chats.length} Chat${folder.chats.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button class="more-options hidden hover:bg-blue-700 p-1 rounded">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
          </svg>
        </button>
      </div>
    `;
    
    foldersList.appendChild(folderElement);
  });
}

function filterFolders() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchTerm) ||
    folder.chats.some(chat => chat.name.toLowerCase().includes(searchTerm))
  );
  
  renderFilteredFolders(filteredFolders);
}

function sortFolders() {
  const sortType = sortSelect.value;
  
  if (sortType === 'name') {
    folders.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === 'date') {
    folders.sort((a, b) => b.createdAt - a.createdAt);
  }
  
  renderFolders();
}

async function addNewFolder() {
  if (!currentUser) {
    alert('Please login to create folders');
    return;
  }

  const name = prompt('Enter folder name:');
  if (name) {
    try {
      const newFolder = await addFolder(currentUser.uid, {
        name,
        chats: []
      });
      folders.push(newFolder);
      renderFolders();
    } catch (error) {
      alert('Failed to create folder: ' + error.message);
    }
  }
}

function renderFilteredFolders(filteredFolders) {
  foldersList.innerHTML = '';
  filteredFolders.forEach(folder => {
    // Reuse the same folder rendering logic
    const folderElement = document.createElement('div');
    // ... (same folder element creation as in renderFolders)
  });
}