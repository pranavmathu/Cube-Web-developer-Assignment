
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileMenu').classList.toggle('open');
}


const galleryImages = [
  '../assets/Perfume.png',
  '../assets/thumb1.jpg',
  '../assets/thumb2.jpg',
  '../assets/thumb3.jpg',
  '../assets/thumb4.jpg'
];

let currentIndex = 0;
const mainImage = document.getElementById('mainImage');
const dots = document.querySelectorAll('.dot');
const thumbs = document.querySelectorAll('.thumb');
const THUMB_COUNT = thumbs.length;

function goToSlide(index) {
  currentIndex = (index + galleryImages.length) % galleryImages.length;

  
  mainImage.classList.add('fade');
  setTimeout(() => {
    mainImage.src = galleryImages[currentIndex];
    mainImage.classList.remove('fade');
  }, 150);

  
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex % 4);
  });

  
  const remainingImages = galleryImages.filter((_, i) => i !== currentIndex);

  
  thumbs.forEach((thumb, i) => {
    const img = remainingImages[i % remainingImages.length]; // 🔥 repeat
    thumb.src = img;
    thumb.dataset.index = galleryImages.indexOf(img);
    thumb.classList.remove('active');
  });
}

document.getElementById('prevBtn').addEventListener('click', () => goToSlide(currentIndex - 1));
document.getElementById('nextBtn').addEventListener('click', () => goToSlide(currentIndex + 1));

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => goToSlide(i));
});
thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    goToSlide(parseInt(thumb.dataset.index));
  });
});

goToSlide(0);

// 3. STATE
let currentSubscription = 'single';
let selectedFragrances = {
  single:  'original',
  double1: 'original',
  double2: 'original'
};

// 4. ALL CART LINKS
const cartLinks = {
  'single|original':          '/cart/single-original',
  'single|lily':              '/cart/single-lily',
  'single|rose':              '/cart/single-rose',
  'double|original|original': '/cart/double-original-original',
  'double|original|lily':     '/cart/double-original-lily',
  'double|original|rose':     '/cart/double-original-rose',
  'double|lily|original':     '/cart/double-lily-original',
  'double|lily|lily':         '/cart/double-lily-lily',
  'double|lily|rose':         '/cart/double-lily-rose',
  'double|rose|original':     '/cart/double-rose-original',
  'double|rose|lily':         '/cart/double-rose-lily',
  'double|rose|rose':         '/cart/double-rose-rose',
};

// 5. SUBSCRIPTION TOGGLE
function selectSubscription(type) {
  const singleEl    = document.getElementById('subSingle');
  const doubleEl    = document.getElementById('subDouble');
  const radioSingle = document.getElementById('radioSingle');
  const radioDouble = document.getElementById('radioDouble');

  if (type === 'single') {
    singleEl.classList.add('active');
    doubleEl.classList.remove('active');
    radioSingle.classList.add('selected');
    radioDouble.classList.remove('selected');
    currentSubscription = 'single';
  } else {
    doubleEl.classList.add('active');
    singleEl.classList.remove('active');
    radioDouble.classList.add('selected');
    radioSingle.classList.remove('selected');
    currentSubscription = 'double';
  }
  updateCartLink();
}

// 6. FRAGRANCE SELECTION
function selectFragrance(event, group, fragrance) {
  event.stopPropagation();

  selectedFragrances[group] = fragrance;

  const prefix = group === 'single'  ? 'single-frag'
               : group === 'double1' ? 'double-frag1'
               :                       'double-frag2';

  ['original', 'lily', 'rose'].forEach(f => {
    const card = document.getElementById(`${prefix}-${f}`);
    if (!card) return;
    card.classList.remove('selected');
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = false;
  });

  const chosen = document.getElementById(`${prefix}-${fragrance}`);
  if (chosen) {
    chosen.classList.add('selected');
    const radio = chosen.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  }

  updateCartLink();
}

// 7. UPDATE CART LINK
function updateCartLink() {
  let key;
  if (currentSubscription === 'single') {
    key = `single|${selectedFragrances.single}`;
  } else {
    key = `double|${selectedFragrances.double1}|${selectedFragrances.double2}`;
  }
  const href = cartLinks[key] || '#';
  document.getElementById('addToCartBtn').href = href;
  console.log('Cart link →', href);
}

updateCartLink();

// 8. ACCORDION
function toggleAccordion(header) {
  const row    = header.parentElement;
  const icon   = header.querySelector('.accordion-icon');
  const isOpen = row.classList.contains('open');
  document.querySelectorAll('.accordion-row').forEach(r => {
    r.classList.remove('open');
    r.querySelector('.accordion-icon').innerHTML = '&#43;';
  });
  if (!isOpen) { row.classList.add('open'); icon.innerHTML = '&#8722;'; }
}


let countUpDone = false;

function startCountUp() {
  document.querySelectorAll('.count-up').forEach(counter => {
    const target    = parseInt(counter.dataset.target);
    const suffix    = counter.dataset.suffix || '';
    const increment = target / (1800 / 16);
    let current     = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      counter.textContent = Math.floor(current) + suffix;
    }, 16);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countUpDone) {
      countUpDone = true;
      startCountUp();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

statsObserver.observe(document.querySelector('.stats-section'));






document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', (e) => {

    const text = link.textContent.trim().toLowerCase();

    
    if (text.includes('shop')) {
      return;
    }

    e.preventDefault();

    if (text.includes('home')) {
      window.location.href = '/home';
    } else if (text.includes('fragrances')) {
      window.location.href = '/fragrances';
    } else if (text.includes('about')) {
      window.location.href = '/about';
    } else if (text.includes('blog')) {
      window.location.href = '/blog';
    } else if (text.includes('contact')) {
      window.location.href = '/contact';
    }

  });
});


document.querySelectorAll('.btn, .hero-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = '/shop';
  });
});



const searchIcon = document.querySelector('.search');

searchIcon.addEventListener('click', () => {
  const query = prompt("Enter search term:");

  if (!query) return;

  const found = document.body.innerText.toLowerCase().includes(query.toLowerCase());

  if (found) alert("Found: " + query);
  else alert("Not found: " + query);
});



document.querySelectorAll('.social-item').forEach(item => {
  item.addEventListener('click', () => {
    const text = item.innerText.toLowerCase();

    if (text.includes('facebook')) window.open('https://facebook.com', '_blank');
    if (text.includes('instagram')) window.open('https://instagram.com', '_blank');
    if (text.includes('x')) window.open('https://x.com', '_blank');
  });
});



document.querySelectorAll('.footer-col a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/' + link.textContent.toLowerCase().replace(/\s+/g, '');
  });
});


const shopLink = document.getElementById('shopLink');
const shopDropdown = document.getElementById('shopDropdown');

shopLink.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  if (shopDropdown.style.display === 'flex') {
    shopDropdown.style.display = 'none';
  } else {
    shopDropdown.style.display = 'flex';
  }
});

document.querySelectorAll('#shopDropdown a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.stopPropagation(); // prevent dropdown from closing too early
    window.location.href = link.getAttribute('href'); // go to dummy link
  });
});

document.addEventListener('click', function (e) {
  if (!shopDropdown.contains(e.target) && e.target !== shopLink) {
    shopDropdown.style.display = 'none';
  }
});