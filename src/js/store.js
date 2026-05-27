// ============================================================
// Store — Per-user localStorage state management
// All keys are scoped to the signed-in user via AuthStore.userKey()
// ============================================================

// Compute per-user storage keys dynamically
const STORE_KEYS = {
  get PROFILE()      { return AuthStore.userKey("profile"); },
  get USER_REVIEWS() { return AuthStore.userKey("custom_reviews"); },
  get WISHLIST()     { return AuthStore.userKey("wishlist"); },
  get READ_LOG()     { return AuthStore.userKey("read_log"); },
};

// Initialize per-user state when called (after sign-in)
function initStore() {
  const user = AuthStore.getCurrent();

  // If no user is signed in, do nothing (home/explore still work, profile is gated)
  if (!user) return;

  // Seed fresh profile from auth account data if not already saved
  if (!localStorage.getItem(STORE_KEYS.PROFILE)) {
    const defaultProfile = {
      name: user.name,
      nickname: user.nickname,
      avatar: user.avatar,
    };
    localStorage.setItem(STORE_KEYS.PROFILE, JSON.stringify(defaultProfile));
  }

  if (!localStorage.getItem(STORE_KEYS.USER_REVIEWS)) {
    localStorage.setItem(STORE_KEYS.USER_REVIEWS, JSON.stringify({}));
  }

  if (!localStorage.getItem(STORE_KEYS.WISHLIST)) {
    localStorage.setItem(STORE_KEYS.WISHLIST, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORE_KEYS.READ_LOG)) {
    localStorage.setItem(STORE_KEYS.READ_LOG, JSON.stringify([]));
  }
}

// Run on script load
initStore();

// ---- Profile Store ----
const ProfileStore = {
  get() {
    const user = AuthStore.getCurrent();
    if (!user) return null;
    const stored = localStorage.getItem(STORE_KEYS.PROFILE);
    if (stored) return JSON.parse(stored);
    // Fallback: synthesize from auth account
    return { name: user.name, nickname: user.nickname, avatar: user.avatar };
  },

  save(name, nickname, avatar) {
    const profile = { name, nickname, avatar };
    localStorage.setItem(STORE_KEYS.PROFILE, JSON.stringify(profile));

    // Also keep auth account in sync
    AuthStore.updateProfile(name, nickname, avatar);

    window.dispatchEvent(new CustomEvent("profile-updated", { detail: profile }));
  },

  getRank(readCount) {
    if (readCount <= 1) return "Noob Bookworm";
    if (readCount <= 4) return "Bookie";
    if (readCount <= 8) return "Reviewer";
    return "Literature Guru";
  },

  getStats() {
    const wishlist = WishlistStore.get();
    const readLog  = ReadLogStore.get();
    const reviews  = ReviewStore.getAllCustomReviewsCount();

    return {
      wishlistCount: wishlist.length,
      readCount: readLog.length,
      reviewsCount: reviews,
      rank: this.getRank(readLog.length),
    };
  },
};

// ---- Wishlist Store ----
const WishlistStore = {
  get() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.WISHLIST)) || [];
  },

  toggle(bookId) {
    const wishlist = this.get();
    const index = wishlist.indexOf(bookId);
    let added = false;

    if (index === -1) {
      wishlist.push(bookId);
      added = true;
    } else {
      wishlist.splice(index, 1);
    }

    localStorage.setItem(STORE_KEYS.WISHLIST, JSON.stringify(wishlist));
    window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { bookId, added } }));
    return added;
  },

  has(bookId) {
    return this.get().includes(bookId);
  },
};

// ---- Read Log Store ----
const ReadLogStore = {
  get() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.READ_LOG)) || [];
  },

  toggle(bookId) {
    const readLog = this.get();
    const index = readLog.indexOf(bookId);
    let markedRead = false;

    if (index === -1) {
      readLog.push(bookId);
      markedRead = true;
    } else {
      readLog.splice(index, 1);
    }

    localStorage.setItem(STORE_KEYS.READ_LOG, JSON.stringify(readLog));
    window.dispatchEvent(new CustomEvent("read-log-updated", { detail: { bookId, markedRead } }));
    window.dispatchEvent(new CustomEvent("profile-updated", { detail: ProfileStore.get() }));
    return markedRead;
  },

  has(bookId) {
    return this.get().includes(bookId);
  },
};

// ---- Review Store ----
const ReviewStore = {
  getCustom(bookId) {
    const allReviews = JSON.parse(localStorage.getItem(STORE_KEYS.USER_REVIEWS)) || {};
    return allReviews[bookId] || [];
  },

  getAllCustomReviewsCount() {
    const allReviews = JSON.parse(localStorage.getItem(STORE_KEYS.USER_REVIEWS)) || {};
    let count = 0;
    for (const key in allReviews) count += allReviews[key].length;
    return count;
  },

  getMerged(bookId) {
    const seed   = INITIAL_REVIEWS[bookId] || [];
    const custom = this.getCustom(bookId);
    return [...custom, ...seed];
  },

  add(bookId, rating, commentText) {
    const profile = ProfileStore.get();
    const stats   = ProfileStore.getStats();

    const newReview = {
      id: "rev-custom-" + Date.now(),
      userName:   profile ? profile.name     : "Anonymous",
      userNick:   profile ? profile.nickname : "reader",
      userRank:   stats.rank,
      userAvatar: profile ? profile.avatar   : "https://api.dicebear.com/7.x/bottts/svg?seed=guest",
      rating:     parseInt(rating),
      date:       new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      text:       commentText,
    };

    const allReviews = JSON.parse(localStorage.getItem(STORE_KEYS.USER_REVIEWS)) || {};
    if (!allReviews[bookId]) allReviews[bookId] = [];
    allReviews[bookId].unshift(newReview);
    localStorage.setItem(STORE_KEYS.USER_REVIEWS, JSON.stringify(allReviews));

    window.dispatchEvent(new CustomEvent("reviews-updated", { detail: { bookId, review: newReview } }));
    return newReview;
  },

  getBreakdown(book) {
    const bookId    = book.id;
    const breakdown = { ...book.ratingBreakdown };

    const customReviews = this.getCustom(bookId);
    customReviews.forEach(rev => {
      const star = rev.rating;
      breakdown[star] = (breakdown[star] || 0) + 1;
    });

    let totalReviews = 0;
    let weightedSum  = 0;

    for (let stars = 1; stars <= 5; stars++) {
      const count = breakdown[stars] || 0;
      totalReviews += count;
      weightedSum  += count * stars;
    }

    const average = totalReviews > 0 ? (weightedSum / totalReviews).toFixed(1) : "0.0";

    const percentages = {};
    for (let stars = 1; stars <= 5; stars++) {
      const count = breakdown[stars] || 0;
      percentages[stars] = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    }

    return { average, totalReviews, breakdown, percentages };
  },
};
