const images = [
  // Nature
  { id: 1,  category: 'nature', title: 'Mountain Lake',      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
  { id: 2,  category: 'nature', title: 'Forest Path',        src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80' },
  { id: 3,  category: 'nature', title: 'Ocean Sunset',       src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
  { id: 4,  category: 'nature', title: 'Snowy Peak',         src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
  // City
  { id: 5,  category: 'city',   title: 'City Lights',        src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80' },
  { id: 6,  category: 'city',   title: 'Rainy Street',       src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80' },
  { id: 7,  category: 'city',   title: 'Bridge at Night',    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80' },
  { id: 8,  category: 'city',   title: 'Aerial Downtown',    src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80' },
  // Tech
  { id: 9,  category: 'tech',   title: 'Code on Screen',     src: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80' },
  { id: 10, category: 'tech',   title: 'Circuit Board',      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80' },
  { id: 11, category: 'tech',   title: 'Laptop & Coffee',    src: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80' },
  { id: 12, category: 'tech',   title: 'Server Room',        src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80' },
];

let activeFilter  = 'all';
let lightboxIndex = 0;        // index within currently filtered list
let filteredList  = [...images];

// ─── Render ───────────────────────────────────────────

function renderGallery() {
  const gallery = document.getElementById('gallery');
  const empty   = document.getElementById('empty');

  gallery.innerHTML = '';

  filteredList = activeFilter === 'all'
    ? [...images]
    : images.filter(img => img.category === activeFilter);

  if (filteredList.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  filteredList.forEach((img, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${img.src}" alt="${img.title}" loading="lazy" />
      <div class="overlay">
        <span class="img-title">${img.title}</span>
        <span class="img-category">${capitalize(img.category)}</span>
      </div>
    `;
    item.addEventListener('click', () => openLightbox(index));
    gallery.appendChild(item);
  });
}

// ─── Filter ───────────────────────────────────────────

function filterGallery(category, btn) {
  activeFilter = category;

  // Update active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Fade out → re-render → fade in
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => item.classList.add('hide'));

  setTimeout(() => renderGallery(), 250);
}

// ─── Lightbox ─────────────────────────────────────────

function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  document.getElementById('lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}

function navigate(dir) {
  lightboxIndex = (lightboxIndex + dir + filteredList.length) % filteredList.length;
  updateLightbox();
}

function updateLightbox() {
  const img = filteredList[lightboxIndex];
  document.getElementById('lb-img').src       = img.src;
  document.getElementById('lb-img').alt       = img.title;
  document.getElementById('lb-title').textContent   = img.title;
  document.getElementById('lb-counter').textContent =
    `${lightboxIndex + 1} / ${filteredList.length}`;
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (lb.classList.contains('hidden')) return;

  if (e.key === 'ArrowRight') navigate(1);
  if (e.key === 'ArrowLeft')  navigate(-1);
  if (e.key === 'Escape')     closeLightbox();
});

// ─── Helpers ──────────────────────────────────────────

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Init
renderGallery();