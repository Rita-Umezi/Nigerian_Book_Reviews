// Main Application Controller for Nigerian Book Review Website
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  activeCategory: "all",
  searchQuery: "",
  currentSlideIndex: 0,
  slideInterval: null,
  readerFontSize: 100, // percentage

  init() {
    // 1. Initialize State and Utilities
    this.initThemes();
    AIBot.init();
    
    // 2. Setup Toast Container
    this.createToastContainer();
    
    // 3. Register SPA Routes
    Router.add("#home", () => this.renderHome());
    Router.add("#explore", () => this.renderExplore());
    Router.add("#wishlist", () => this.renderWishlist());
    Router.add("#profile", () => this.renderProfile());
    Router.add("#book/:id", (params) => this.renderBookDetail(params.id));
    Router.init();
    
    // 4. Bind Global Listeners (Header Profile, Modal Triggers)
    this.bindGlobalEvents();
    this.updateHeaderProfile();

    // 5. Re-render header whenever auth changes
    window.addEventListener("auth-changed", () => {
      initStore(); // re-initialize per-user store keys
      this.updateHeaderProfile();
    });
  },

  // --- Theme Management ---
  initThemes() {
    const savedTheme = localStorage.getItem("naijareads_theme") || "light";
    this.setTheme(savedTheme);
    
    const themeSwitcher = document.getElementById("theme-switcher");
    if (themeSwitcher) {
      const buttons = themeSwitcher.querySelectorAll(".theme-btn");
      
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          const theme = btn.getAttribute("data-theme");
          this.setTheme(theme);
        });
      });
    }
  },

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("naijareads_theme", theme);
    
    // Update active button state
    const themeSwitcher = document.getElementById("theme-switcher");
    if (themeSwitcher) {
      themeSwitcher.querySelectorAll(".theme-btn").forEach(btn => {
        if (btn.getAttribute("data-theme") === theme) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }
  },

  // --- Dynamic Toast Notifications ---
  createToastContainer() {
    if (!document.getElementById("toast-container")) {
      const container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }
  },

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    const icon = type === "success" ? "✅" : "ℹ️";
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Slide out and remove toast after 3 seconds
    setTimeout(() => {
      toast.style.animation = "slide-in 0.3s forwards reverse";
      setTimeout(() => toast.remove(), 300);
    }, 2700);
  },

  // --- Reactive UI Listeners ---
  bindGlobalEvents() {
    // Sync header profile when profile changes in storage
    window.addEventListener("profile-updated", () => this.updateHeaderProfile());
    window.addEventListener("read-log-updated", () => this.updateHeaderProfile());
    
    // Bind Chapter Reader controls
    document.getElementById("reader-close-btn")?.addEventListener("click", () => this.closeReader());
    document.getElementById("reader-backdrop")?.addEventListener("click", () => this.closeReader());
    
    // Font controls
    document.getElementById("reader-zoom-in")?.addEventListener("click", () => {
      if (this.readerFontSize < 150) {
        this.readerFontSize += 10;
        this.updateReaderFontSize();
      }
    });
    
    document.getElementById("reader-zoom-out")?.addEventListener("click", () => {
      if (this.readerFontSize > 80) {
        this.readerFontSize -= 10;
        this.updateReaderFontSize();
      }
    });
  },

  updateHeaderProfile() {
    const signedIn       = AuthStore.isSignedIn();
    const signInBtn      = document.getElementById("header-sign-in-btn");
    const profileBadge   = document.getElementById("header-profile-badge");
    const signOutBtn     = document.getElementById("header-sign-out-btn");
    const headerAvatar   = document.getElementById("header-avatar");
    const headerNick     = document.getElementById("header-nickname");
    const headerRank     = document.getElementById("header-rank");

    if (signedIn) {
      const profile = ProfileStore.get();
      const stats   = ProfileStore.getStats();

      if (signInBtn)    signInBtn.style.display    = "none";
      if (profileBadge) profileBadge.style.display = "flex";
      if (signOutBtn)   signOutBtn.style.display   = "flex";

      if (headerAvatar && profile) headerAvatar.src = profile.avatar;
      if (headerNick   && profile) headerNick.textContent = profile.nickname;
      if (headerRank)              headerRank.textContent  = stats.rank;
    } else {
      if (signInBtn)    signInBtn.style.display    = "flex";
      if (profileBadge) profileBadge.style.display = "none";
      if (signOutBtn)   signOutBtn.style.display   = "none";
    }
  },

  // --- Hero Slideshow Logic ---
  initSlideshow() {
    this.stopSlideshow();
    this.currentSlideIndex = 0;
    
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    
    if (slides.length === 0) return;
    
    // Render first slide
    slides[0].classList.add("active");
    dots[0]?.classList.add("active");
    
    // Set auto rotation
    this.slideInterval = setInterval(() => {
      this.changeSlide(1);
    }, 5000);
    
    // Pause slideshow on hover
    const hero = document.getElementById("hero-section");
    hero?.addEventListener("mouseenter", () => this.stopSlideshow());
    hero?.addEventListener("mouseleave", () => {
      this.slideInterval = setInterval(() => {
        this.changeSlide(1);
      }, 5000);
    });
  },

  changeSlide(direction) {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    if (slides.length === 0) return;
    
    slides[this.currentSlideIndex].classList.remove("active");
    dots[this.currentSlideIndex]?.classList.remove("active");
    
    this.currentSlideIndex = (this.currentSlideIndex + direction + slides.length) % slides.length;
    
    slides[this.currentSlideIndex].classList.add("active");
    dots[this.currentSlideIndex]?.classList.add("active");
  },

  stopSlideshow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  },

  // --- Helper: Render Book Stars ---
  renderStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let starsHTML = "";
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHTML += `<span class="star-icon filled">★</span>`;
      } else if (i === fullStars + 1 && halfStar) {
        starsHTML += `<span class="star-icon filled" style="position:relative; display:inline-block; overflow:hidden; width:0.5em; margin-right:-0.5em;">★</span><span class="star-icon">★</span>`;
      } else {
        starsHTML += `<span class="star-icon">★</span>`;
      }
    }
    return starsHTML;
  },

  // --- Simulated PDF Chapter Reader Modal Trigger ---
  openReader(book) {
    const modal = document.getElementById("reader-modal");
    const title = document.getElementById("reader-book-title");
    const author = document.getElementById("reader-author");
    const content = document.getElementById("reader-content");
    
    if (!modal || !book) return;
    
    title.textContent = book.title;
    author.textContent = `by ${book.author}`;
    content.innerHTML = book.chapterText;
    
    // Add page indicators
    document.getElementById("reader-page-indicator").textContent = `Page 1 of 1 (Snippet Preview)`;
    
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Disable background scrolling
  },

  closeReader() {
    const modal = document.getElementById("reader-modal");
    if (modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // Re-enable scroll
    }
  },

  updateReaderFontSize() {
    const content = document.getElementById("reader-content");
    if (content) {
      content.style.fontSize = `${this.readerFontSize}%`;
    }
  },

  // --- VIEW RENDERING ENGINE ---

  // 1. HOME VIEW
  renderHome() {
    const container = document.getElementById("app-view");
    if (!container) return;

    this.activeCategory = "all";
    this.searchQuery = "";

    container.innerHTML = `
      <!-- Hero Carousel -->
      <section class="hero-section" id="hero-section">
        <div class="slider-container">
          <div class="slide">
            <div class="slide-content">
              <h2>SEE YOUR FAVOURITE BOOKS</h2>
              <p>Explore high-fidelity reviews and breakdowns of premier Nigerian literature, covering classics, comedy, biographies, and drama.</p>
              <a href="#explore" class="btn btn-primary">Start Exploring</a>
            </div>
            <div class="slide-graphic">
              <span class="graphic-icon">📚</span>
            </div>
          </div>
          <div class="slide">
            <div class="slide-content">
              <h2>REVIEW BOOKS YOU'VE READ</h2>
              <p>Log your read books, rate individual chapters, and unlock prestigious reader ranks from Noob to Literature Guru.</p>
              <a href="#profile" class="btn btn-primary">Check My Level</a>
            </div>
            <div class="slide-graphic">
              <span class="graphic-icon">⭐</span>
            </div>
          </div>
          <div class="slide">
            <div class="slide-content">
              <h2>FIND BOOK RECOMMENDATIONS</h2>
              <p>Looking for a Masobe comedy, or a Farafina classic? Chat with our intelligent Nigerian Lit Assistant down below!</p>
              <button onclick="document.getElementById('ai-chat-widget').classList.remove('collapsed'); AIBot.scrollToBottom();" class="btn btn-primary">Ask the AI Bot</button>
            </div>
            <div class="slide-graphic">
              <span class="graphic-icon">🤖</span>
            </div>
          </div>
        </div>
        <!-- Arrow Navigation -->
        <button class="slider-arrow arrow-left" id="slide-prev-btn">◀</button>
        <button class="slider-arrow arrow-right" id="slide-next-btn">▶</button>
        <!-- Dots Navigation -->
        <div class="slider-dots">
          <span class="dot active" data-index="0"></span>
          <span class="dot" data-index="1"></span>
          <span class="dot" data-index="2"></span>
        </div>
      </section>

      <!-- Category Filter Bar & Search Panel -->
      <section class="discover-toolbar">
        <div class="categories-container">
          <div class="categories-scroll" id="categories-scroll">
            <button class="category-chip active" data-category="all">All Categories</button>
            <button class="category-chip" data-category="classics">Classics</button>
            <button class="category-chip" data-category="fiction">Fiction</button>
            <button class="category-chip" data-category="historical fiction">Historical Fiction</button>
            <button class="category-chip" data-category="comedy">Comedy</button>
            <button class="category-chip" data-category="drama">Drama</button>
            <button class="category-chip" data-category="biography">Biography</button>
          </div>
        </div>
        
        <div class="search-wrapper">
          <input type="text" id="search-input" class="search-input" placeholder="Search title, author, publisher..." aria-label="Book Search">
          <button class="search-icon-btn" aria-label="Submit search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>
      </section>

      <!-- Search Status Info -->
      <div class="results-summary" id="results-summary" style="display:none;">
        <span id="results-text">Showing 0 books</span>
        <button class="clear-filter-btn" id="clear-filter-btn">Clear Filters</button>
      </div>

      <!-- Books Grid -->
      <section class="books-grid" id="books-grid">
        <!-- Rendered dynamically -->
      </section>
    `;

    // Initialize slideshow carousel
    this.initSlideshow();
    document.getElementById("slide-prev-btn")?.addEventListener("click", () => this.changeSlide(-1));
    document.getElementById("slide-next-btn")?.addEventListener("click", () => this.changeSlide(1));
    document.querySelectorAll(".dot").forEach(d => {
      d.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        this.stopSlideshow();
        const slides = document.querySelectorAll(".slide");
        const dots = document.querySelectorAll(".dot");
        slides[this.currentSlideIndex].classList.remove("active");
        dots[this.currentSlideIndex].classList.remove("active");
        this.currentSlideIndex = index;
        slides[this.currentSlideIndex].classList.add("active");
        dots[this.currentSlideIndex].classList.add("active");
      });
    });

    // Categories filter bindings
    const chips = document.querySelectorAll(".category-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        chips.forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        this.activeCategory = e.target.getAttribute("data-category");
        this.filterBooks();
      });
    });

    // Search bar bindings
    const searchField = document.getElementById("search-input");
    searchField?.addEventListener("input", (e) => {
      this.searchQuery = e.target.value;
      this.filterBooks();
    });

    // Clear filters action
    document.getElementById("clear-filter-btn")?.addEventListener("click", () => {
      this.activeCategory = "all";
      this.searchQuery = "";
      chips.forEach(c => {
        if (c.getAttribute("data-category") === "all") c.classList.add("active");
        else c.classList.remove("active");
      });
      if (searchField) searchField.value = "";
      this.filterBooks();
    });

    // Draw grid
    this.filterBooks();
  },

  filterBooks() {
    const grid = document.getElementById("books-grid");
    const summary = document.getElementById("results-summary");
    const text = document.getElementById("results-text");
    
    if (!grid) return;

    let filtered = INITIAL_BOOKS;

    // Filter by Category
    if (this.activeCategory !== "all") {
      filtered = filtered.filter(book => book.category.toLowerCase() === this.activeCategory.toLowerCase());
    }

    // Filter by Search Query
    if (this.searchQuery.trim() !== "") {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.publisher.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q)
      );
    }

    // Display summary banner
    if (this.activeCategory !== "all" || this.searchQuery.trim() !== "") {
      if (summary && text) {
        summary.style.display = "flex";
        text.textContent = `Found ${filtered.length} book(s) matching filters`;
      }
    } else {
      if (summary) summary.style.display = "none";
    }

    // Render cards
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🤷🏾‍♂️</div>
          <h3>No books found</h3>
          <p>Try searching for another title, author, or publisher house (e.g. Masobe, Farafina).</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(book => {
      const stats = ReviewStore.getBreakdown(book);
      const isWishlisted = WishlistStore.has(book.id);
      
      return `
        <article class="book-card" data-id="${book.id}">
          <a href="#book/${book.id}">
            <div class="book-cover-wrapper">
              <img src="src/assets/covers/${book.id}.jpg" class="book-cover-img" onerror="this.style.display='none';" alt="${book.title} Cover">
              <div class="book-cover-spine"></div>
              <div class="book-cover-art" style="background: ${book.coverColor}">
                <span class="cover-publisher">${book.publisher.replace("Books", "")}</span>
                <h4 class="cover-title">${book.title}</h4>
                <span class="cover-author">${book.author}</span>
              </div>
              <span class="category-badge-overlay">${book.category}</span>
              ${book.badge ? `<span class="category-rank-badge">🏆 ${book.badge.replace("Top ", "#")}</span>` : ""}
            </div>
          </a>
          
          <div class="book-card-info">
            <span class="book-publisher-label">${book.publisher}</span>
            <a href="#book/${book.id}"><h3 class="book-card-title">${book.title}</h3></a>
            <span class="book-card-author">${book.author}</span>
            
            <div class="stars-display">
              ${this.renderStarsHTML(parseFloat(stats.average))}
              <span class="rating-value">${stats.average}</span>
              <span class="reviews-count">(${stats.totalReviews})</span>
            </div>
          </div>
        </article>
      `;
    }).join("");
  },

  // 2. EXPLORE VIEW (Renders the full library list)
  renderExplore() {
    this.renderHome();
    // Scroll directly to categories bar
    setTimeout(() => {
      document.getElementById("categories-scroll")?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  },

  // 3. WISHLIST VIEW
  renderWishlist() {
    const container = document.getElementById("app-view");
    if (!container) return;

    const wishlistIds = WishlistStore.get();
    const books = INITIAL_BOOKS.filter(b => wishlistIds.includes(b.id));

    container.innerHTML = `
      <section class="page-header">
        <h2 class="page-title">My Reading Wishlist</h2>
        <p class="page-subtitle">Keep track of Nigerian books you plan to read next.</p>
      </section>
      
      <div class="books-grid" id="wishlist-grid">
        <!-- Rendered items -->
      </div>
    `;

    const grid = document.getElementById("wishlist-grid");
    if (!grid) return;

    if (books.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">📖</div>
          <h3>Your wishlist is empty</h3>
          <p>Browse through our collection on the home page and add books you want to read!</p>
          <a href="#home" class="btn btn-primary" style="display:inline-flex; margin-top:1.5rem;">Explore Books</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = books.map(book => {
      const stats = ReviewStore.getBreakdown(book);
      return `
        <article class="book-card">
          <a href="#book/${book.id}">
            <div class="book-cover-wrapper">
              <img src="src/assets/covers/${book.id}.jpg" class="book-cover-img" onerror="this.style.display='none';" alt="${book.title} Cover">
              <div class="book-cover-spine"></div>
              <div class="book-cover-art" style="background: ${book.coverColor}">
                <span class="cover-publisher">${book.publisher.replace("Books", "")}</span>
                <h4 class="cover-title">${book.title}</h4>
                <span class="cover-author">${book.author}</span>
              </div>
              <span class="category-badge-overlay">${book.category}</span>
              ${book.badge ? `<span class="category-rank-badge">🏆 ${book.badge.replace("Top ", "#")}</span>` : ""}
            </div>
          </a>
          
          <div class="book-card-info">
            <span class="book-publisher-label">${book.publisher}</span>
            <a href="#book/${book.id}"><h3 class="book-card-title">${book.title}</h3></a>
            <span class="book-card-author">${book.author}</span>
            
            <div class="stars-display">
              ${this.renderStarsHTML(parseFloat(stats.average))}
              <span class="rating-value">${stats.average}</span>
              <span class="reviews-count">(${stats.totalReviews})</span>
            </div>
          </div>
        </article>
      `;
    }).join("");
  },

  // 4. BOOK DETAIL & REVIEW VIEW
  renderBookDetail(bookId) {
    const container = document.getElementById("app-view");
    if (!container) return;

    const book = INITIAL_BOOKS.find(b => b.id === bookId);
    if (!book) {
      container.innerHTML = `<div class="no-results"><h3>Book not found</h3><a href="#home">Back to Home</a></div>`;
      return;
    }

    const ratings = ReviewStore.getBreakdown(book);
    const reviews = ReviewStore.getMerged(bookId);
    
    const isWishlisted = WishlistStore.has(bookId);
    const isReadLogged = ReadLogStore.has(bookId);

    container.innerHTML = `
      <div class="detail-back-link">
        <a href="#home" class="back-link">
          ← Back to Catalog
        </a>
      </div>

      <section class="book-detail-layout">
        <!-- Sidebar cover column -->
        <div class="detail-sidebar">
          <div class="detail-cover" style="position: relative;">
            <img src="src/assets/covers/${book.id}.jpg" class="book-cover-img" onerror="this.style.display='none';" alt="${book.title} Cover">
            <div class="book-cover-spine"></div>
            <div class="book-cover-art" style="background: ${book.coverColor}; height: 100%;">
              <span class="cover-publisher" style="font-size:0.9rem;">${book.publisher.replace("Books", "")}</span>
              <h2 class="cover-title" style="font-size:1.8rem; margin:auto 0; text-shadow:0 3px 6px rgba(0,0,0,0.5);">${book.title}</h2>
              <span class="cover-author" style="font-size:1.1rem;">${book.author}</span>
            </div>
          </div>
          
          <div class="detail-actions">
            <button class="btn btn-secondary ${isWishlisted ? "wishlisted" : ""}" id="btn-wishlist">
              ❤️ ${isWishlisted ? "On Wishlist" : "Add to Wishlist"}
            </button>
            <button class="btn btn-secondary ${isReadLogged ? "read" : ""}" id="btn-read-log">
              ✓ ${isReadLogged ? "Marked as Read" : "Mark as Read"}
            </button>
            <button class="btn btn-primary" id="btn-read-snippet">
              📖 Read First Chapter (PDF Snippet)
            </button>
          </div>
        </div>

        <!-- Main text descriptions column -->
        <div class="detail-main">
          <div class="book-title-header">
            <h1>${book.title}</h1>
            <div class="book-meta-sub">
              <span class="meta-author">by ${book.author}</span>
              <span class="meta-publisher">Publisher: <strong>${book.publisher}</strong> (${book.year})</span>
              <span class="meta-isbn">ISBN: ${book.isbn}</span>
            </div>
            
            <div class="detail-badge-row">
              <span class="badge-tag category-info">${book.category}</span>
              ${book.badge ? `<span class="badge-tag rank-award">🏆 ${book.badge}</span>` : ""}
            </div>
          </div>

          <div class="detail-section">
            <h2>About Book</h2>
            <p class="synopsis-text">${book.description}</p>
          </div>

          <!-- Google Play Style Breakdown -->
          <div class="detail-section">
            <h2>Ratings Breakdown</h2>
            <div class="rating-breakdown-card">
              <div class="breakdown-overall">
                <span class="breakdown-number">${ratings.average}</span>
                <div class="breakdown-stars">
                  ${this.renderStarsHTML(parseFloat(ratings.average))}
                </div>
                <span class="breakdown-total-reviews">${ratings.totalReviews} total reviews</span>
              </div>
              
              <div class="breakdown-bars">
                ${[5, 4, 3, 2, 1].map(stars => `
                  <div class="rating-bar-row">
                    <div class="bar-star-num">${stars} ★</div>
                    <div class="bar-track">
                      <div class="bar-fill" style="width: ${ratings.percentages[stars]}%"></div>
                    </div>
                    <div class="bar-percent">${ratings.percentages[stars]}%</div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- Review Form -->
          <div class="detail-section">
            <div class="review-form-container">
              <h3>Leave a Review</h3>
              
              <div class="form-rating-selector">
                <span class="form-rating-label">Your Rating:</span>
                <div class="interactive-stars" id="form-stars">
                  <button class="star-btn" data-value="1">★</button>
                  <button class="star-btn" data-value="2">★</button>
                  <button class="star-btn" data-value="3">★</button>
                  <button class="star-btn" data-value="4">★</button>
                  <button class="star-btn" data-value="5">★</button>
                </div>
              </div>
              
              <textarea id="form-comment" class="form-textarea" placeholder="Share your thoughts about the book, character development, or writing style..."></textarea>
              <button class="btn btn-primary" id="btn-submit-review" style="width:100%;">Submit My Review</button>
            </div>
          </div>

          <!-- Comments/Reviews List -->
          <div class="detail-section reviews-section">
            <h2>Reader Reviews (${reviews.length})</h2>
            <div class="comments-list" id="comments-list">
              ${reviews.map(rev => `
                <div class="comment-card">
                  <div class="comment-avatar-wrapper">
                    <img src="${rev.userAvatar}" alt="Avatar" class="avatar-md">
                  </div>
                  <div class="comment-card-content">
                    <div class="comment-header">
                      <div class="comment-user-info">
                        <span class="comment-user-name">${rev.userName}</span>
                        <div class="comment-user-meta">
                          <span class="comment-user-nick">@${rev.userNick}</span>
                          <span class="comment-user-rank">${rev.userRank}</span>
                        </div>
                      </div>
                      <div class="comment-header-right">
                        <div class="stars-display">
                          ${this.renderStarsHTML(rev.rating)}
                        </div>
                        <span class="comment-date">${rev.date}</span>
                      </div>
                    </div>
                    <p class="comment-body">${rev.text}</p>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </section>
    `;

    // --- Action bindings ---
    
    // 1. Wishlist click
    const btnWish = document.getElementById("btn-wishlist");
    btnWish?.addEventListener("click", () => {
      const added = WishlistStore.toggle(bookId);
      if (added) {
        btnWish.classList.add("wishlisted");
        btnWish.textContent = "❤️ On Wishlist";
        this.showToast(`"${book.title}" added to wishlist!`, "success");
      } else {
        btnWish.classList.remove("wishlisted");
        btnWish.textContent = "❤️ Add to Wishlist";
        this.showToast(`"${book.title}" removed from wishlist.`);
      }
    });

    // 2. Mark as read click
    const btnRead = document.getElementById("btn-read-log");
    btnRead?.addEventListener("click", () => {
      const marked = ReadLogStore.toggle(bookId);
      if (marked) {
        btnRead.classList.add("read");
        btnRead.textContent = "✓ Marked as Read";
        this.showToast(`Logged "${book.title}" to read history!`, "success");
      } else {
        btnRead.classList.remove("read");
        btnRead.textContent = "✓ Mark as Read";
        this.showToast(`Removed "${book.title}" from read history.`);
      }
      this.renderBookDetail(bookId); // Refresh layout to show update if user info header rank shifts
    });

    // 3. Snippet PDF reader button
    document.getElementById("btn-read-snippet")?.addEventListener("click", () => {
      this.openReader(book);
    });

    // 4. Interactive Review Stars System
    const starBtns = document.querySelectorAll("#form-stars .star-btn");
    let selectedRating = 0;

    starBtns.forEach(btn => {
      btn.addEventListener("mouseover", () => {
        const val = parseInt(btn.getAttribute("data-value"));
        starBtns.forEach(s => {
          const sVal = parseInt(s.getAttribute("data-value"));
          if (sVal <= val) s.classList.add("hovered");
          else s.classList.remove("hovered");
        });
      });

      btn.addEventListener("mouseout", () => {
        starBtns.forEach(s => s.classList.remove("hovered"));
      });

      btn.addEventListener("click", () => {
        selectedRating = parseInt(btn.getAttribute("data-value"));
        starBtns.forEach(s => {
          const sVal = parseInt(s.getAttribute("data-value"));
          if (sVal <= selectedRating) s.classList.add("selected");
          else s.classList.remove("selected");
        });
      });
    });

    // 5. Submit review button click
    const btnSubmit = document.getElementById("btn-submit-review");
    btnSubmit?.addEventListener("click", () => {
      const commentField = document.getElementById("form-comment");
      const commentText = commentField ? commentField.value.trim() : "";

      if (selectedRating === 0) {
        this.showToast("Please choose a star rating first!", "error");
        return;
      }
      if (commentText === "") {
        this.showToast("Please write a comment for your review!", "error");
        return;
      }

      ReviewStore.add(bookId, selectedRating, commentText);
      this.showToast("Review submitted successfully! E-se / Thank you.", "success");
      
      // Refresh page details dynamically
      this.renderBookDetail(bookId);
    });
  },

  // 5. USER PROFILE VIEW
  renderProfile() {
    const container = document.getElementById("app-view");
    if (!container) return;

    // ---- Auth guard: show sign-in prompt if not logged in ----
    if (!AuthStore.isSignedIn()) {
      container.innerHTML = `
        <section class="auth-guard-view">
          <div class="auth-guard-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>
          <h2>Sign in to view your profile</h2>
          <p>Create a free account to track your reading, leave reviews, and manage your wishlist.</p>
          <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; margin-top:1.5rem;">
            <button class="btn btn-primary" onclick="window.openAuthModal('signup')" style="min-width:160px;">Create Account</button>
            <button class="btn btn-secondary" onclick="window.openAuthModal('signin')" style="min-width:160px;">Sign In</button>
          </div>
        </section>
      `;
      return;
    }
    const profile = ProfileStore.get();
    const stats = ProfileStore.getStats();
    
    // Define ranks progression percentage
    let nextRankText = "";
    let progressPercent = 0;
    if (stats.readCount <= 1) {
      nextRankText = `2 books needed for Rank: Bookie`;
      progressPercent = (stats.readCount / 2) * 100;
    } else if (stats.readCount <= 4) {
      nextRankText = `5 books needed for Rank: Reviewer`;
      progressPercent = ((stats.readCount - 1) / 3) * 100;
    } else if (stats.readCount <= 8) {
      nextRankText = `9 books needed for Rank: Literature Guru`;
      progressPercent = ((stats.readCount - 4) / 4) * 100;
    } else {
      nextRankText = "You reached the ultimate Literature Guru rank!";
      progressPercent = 100;
    }

    container.innerHTML = `
      <section class="profile-card" id="profile-card-view">
        <!-- Render normal stats or edit mode depending on action -->
        <div class="profile-avatar-area">
          <img src="${profile.avatar}" alt="Avatar" class="avatar-lg" id="profile-avatar-img">
          <span class="profile-rank-badge">${stats.rank}</span>
        </div>
        
        <div class="profile-details-area" id="profile-text-area">
          <div class="profile-name-row">
            <div class="profile-titles">
              <h2 id="profile-lbl-name">${profile.name}</h2>
              <span class="profile-nickname" id="profile-lbl-nick">@${profile.nickname}</span>
            </div>
            <button class="btn btn-secondary" id="btn-edit-profile">✏️ Edit Profile</button>
          </div>
          
          <div class="profile-stats-grid">
            <div class="stat-item">
              <span class="stat-num">${stats.readCount}</span>
              <span class="stat-label">Books Read</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">${stats.wishlistCount}</span>
              <span class="stat-label">Wishlist</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">${stats.reviewsCount}</span>
              <span class="stat-label">Reviews Written</span>
            </div>
          </div>
          
          <div class="profile-level-progression">
            <div class="progression-text">
              <span>Level Progress</span>
              <span>${nextRankText}</span>
            </div>
            <div class="progression-bar-track">
              <div class="progression-bar-fill" style="width: ${progressPercent}%"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Wishlist / Written Reviews tab containers -->
      <section class="profile-tabs-section">
        <nav class="profile-tabs-nav">
          <button class="tab-nav-btn active" id="tab-btn-wish">My Wishlist</button>
          <button class="tab-nav-btn" id="tab-btn-revs">My Written Reviews</button>
        </nav>
        
        <div id="tab-content-area">
          <!-- Populated dynamically based on selected tab -->
        </div>
      </section>
    `;

    // Tab buttons functionality
    const tabBtnWish = document.getElementById("tab-btn-wish");
    const tabBtnRevs = document.getElementById("tab-btn-revs");

    tabBtnWish?.addEventListener("click", () => {
      tabBtnWish.classList.add("active");
      tabBtnRevs?.classList.remove("active");
      this.renderProfileWishlistTab();
    });

    tabBtnRevs?.addEventListener("click", () => {
      tabBtnRevs.classList.add("active");
      tabBtnWish?.classList.remove("active");
      this.renderProfileReviewsTab();
    });

    // Edit Profile form click
    const btnEdit = document.getElementById("btn-edit-profile");
    btnEdit?.addEventListener("click", () => {
      this.renderProfileEditMode();
    });

    // Default load wishlist tab
    this.renderProfileWishlistTab();
  },

  renderProfileWishlistTab() {
    const area = document.getElementById("tab-content-area");
    if (!area) return;

    const wishlistIds = WishlistStore.get();
    const books = INITIAL_BOOKS.filter(b => wishlistIds.includes(b.id));

    if (books.length === 0) {
      area.innerHTML = `
        <div class="no-results" style="padding: 2rem;">
          <p>No books on your wishlist yet.</p>
          <a href="#home" class="clear-filter-btn">Explore titles to add</a>
        </div>
      `;
      return;
    }

    area.innerHTML = `
      <div class="books-grid">
        ${books.map(book => {
          const stats = ReviewStore.getBreakdown(book);
          return `
            <article class="book-card">
              <a href="#book/${book.id}">
                <div class="book-cover-wrapper">
                  <img src="src/assets/covers/${book.id}.jpg" class="book-cover-img" onerror="this.style.display='none';" alt="${book.title} Cover">
                  <div class="book-cover-spine"></div>
                  <div class="book-cover-art" style="background: ${book.coverColor}">
                    <h4 class="cover-title">${book.title}</h4>
                    <span class="cover-author">${book.author}</span>
                  </div>
                </div>
              </a>
              <div class="book-card-info">
                <a href="#book/${book.id}"><h3 class="book-card-title">${book.title}</h3></a>
                <span class="book-card-author">${book.author}</span>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
  },

  renderProfileReviewsTab() {
    const area = document.getElementById("tab-content-area");
    if (!area) return;

    const allCustomReviews = JSON.parse(localStorage.getItem(STORE_KEYS.USER_REVIEWS)) || {};
    let reviewList = [];

    // Gather all user reviews mapped to books
    for (const bookId in allCustomReviews) {
      const book = INITIAL_BOOKS.find(b => b.id === bookId);
      if (book) {
        allCustomReviews[bookId].forEach(rev => {
          reviewList.push({ book, review: rev });
        });
      }
    }

    if (reviewList.length === 0) {
      area.innerHTML = `
        <div class="no-results" style="padding: 2rem;">
          <p>You haven't written any reviews yet.</p>
          <a href="#home" class="clear-filter-btn">Choose a book to review</a>
        </div>
      `;
      return;
    }

    // Sort by timestamp
    reviewList.sort((a, b) => b.review.id.localeCompare(a.review.id));

    area.innerHTML = `
      <div class="comments-list">
        ${reviewList.map(item => `
          <div class="comment-card">
            <div class="comment-avatar-wrapper" style="width: 50px; height: 75px; background: ${item.book.coverColor}; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 0.4rem; padding: 2px; color: white; border-left: 2px solid rgba(0,0,0,0.3); font-weight: bold; text-align: center;">
              ${item.book.title.substring(0, 15)}
            </div>
            <div class="comment-card-content">
              <div class="comment-header">
                <div>
                  <a href="#book/${item.book.id}"><span class="comment-user-name" style="color: var(--accent-color);">${item.book.title}</span></a>
                  <div class="comment-user-meta"><span class="comment-user-nick">by ${item.book.author}</span></div>
                </div>
                <div class="comment-header-right">
                  <div class="stars-display">
                    ${this.renderStarsHTML(item.review.rating)}
                  </div>
                  <span class="comment-date">${item.review.date}</span>
                </div>
              </div>
              <p class="comment-body">${item.review.text}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  },

  renderProfileEditMode() {
    const textSection = document.getElementById("profile-text-area");
    if (!textSection) return;

    const profile = ProfileStore.get();
    
    // Dicebear avatar seeds to select from
    const avatarOptions = ["Rita", "Tunde", "Adebayo", "Kemi", "Zainab", "Chinedu"];
    let selectedAvatar = profile.avatar;

    textSection.innerHTML = `
      <div class="profile-edit-form">
        <h3 style="font-family: var(--font-serif); font-size: 1.4rem;">Edit Profile Details</h3>
        
        <div class="form-row">
          <label for="edit-name">Display Name</label>
          <input type="text" id="edit-name" class="form-input" value="${profile.name}">
        </div>

        <div class="form-row">
          <label for="edit-nickname">Nickname (@)</label>
          <input type="text" id="edit-nickname" class="form-input" value="${profile.nickname}">
        </div>

        <div class="form-row">
          <label>Select Avatar</label>
          <div class="avatar-selector-grid">
            ${avatarOptions.map(seed => {
              const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
              const isSelected = selectedAvatar === url;
              return `
                <button class="avatar-select-btn ${isSelected ? "selected" : ""}" data-avatar-url="${url}">
                  <img src="${url}" alt="${seed}">
                </button>
              `;
            }).join("")}
          </div>
        </div>

        <div style="display:flex; gap:1rem; margin-top:0.8rem;">
          <button class="btn btn-primary" id="btn-save-profile" style="padding: 0.6rem 1.2rem;">Save Changes</button>
          <button class="btn btn-secondary" id="btn-cancel-edit" style="padding: 0.6rem 1.2rem;">Cancel</button>
        </div>
      </div>
    `;

    // Avatar selections
    const avatarBtns = document.querySelectorAll(".avatar-select-btn");
    avatarBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        avatarBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedAvatar = btn.getAttribute("data-avatar-url");
        // Dynamically update main photo preview during choice
        const preview = document.getElementById("profile-avatar-img");
        if (preview) preview.src = selectedAvatar;
      });
    });

    // Save profile details
    document.getElementById("btn-save-profile")?.addEventListener("click", () => {
      const nameVal = document.getElementById("edit-name").value.trim();
      const nickVal = document.getElementById("edit-nickname").value.trim().replace("@", "");

      if (nameVal === "" || nickVal === "") {
        this.showToast("Fields cannot be empty!", "error");
        return;
      }

      ProfileStore.save(nameVal, nickVal, selectedAvatar);
      this.showToast("Profile details updated successfully!", "success");
      
      // Refresh profile view
      this.renderProfile();
    });

    // Cancel edit details
    document.getElementById("btn-cancel-edit")?.addEventListener("click", () => {
      this.renderProfile();
    });
  }
};
