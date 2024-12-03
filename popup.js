// State management
let folders = [];

// Load folders from storage
chrome.storage.local.get(['folders'], function(result) {
  folders = result.folders || [];
  renderFolders();
});

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

loginBtn.addEventListener('click', () => {
  // Implement login logic
  alert('Login functionality to be implemented');
});

signupBtn.addEventListener('click', () => {
  // Implement signup logic
  alert('Signup functionality to be implemented');
});

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

function addNewFolder() {
  const name = prompt('Enter folder name:');
  if (name) {
    const newFolder = {
      id: Date.now(),
      name,
      chats: [],
      createdAt: Date.now()
    };
    
    folders.push(newFolder);
    chrome.storage.local.set({ folders }, renderFolders);
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