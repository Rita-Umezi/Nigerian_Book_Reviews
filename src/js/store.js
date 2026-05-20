// Local Storage state management for the Nigerian Book Review Website
const STORE_KEYS = {
  PROFILE: "naijareads_profile",
  USER_REVIEWS: "naijareads_custom_reviews",
  WISHLIST: "naijareads_wishlist",
  READ_LOG: "naijareads_read_log"
};

// Initialize State in LocalStorage if not exists
function initStore() {
  if (!localStorage.getItem(STORE_KEYS.PROFILE)) {
    const defaultProfile = {
      name: "Rita Ojo",
      nickname: "RitaReads",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rita"
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
    // Seed with two default read books so the user doesn't start at 0
    localStorage.setItem(STORE_KEYS.READ_LOG, JSON.stringify(["things-fall-apart", "son-of-the-house"]));
  }
}

// Initialize on script load
initStore();

// --- Profile Store ---
const ProfileStore = {
  get() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.PROFILE));
  },
  
  save(name, nickname, avatar) {
    const profile = { name, nickname, avatar };
    localStorage.setItem(STORE_KEYS.PROFILE, JSON.stringify(profile));
    
    // Dispatch an event so components know profile has changed
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
    const readLog = ReadLogStore.get();
    const reviews = ReviewStore.getAllCustomReviewsCount();
    
    return {
      wishlistCount: wishlist.length,
      readCount: readLog.length,
      reviewsCount: reviews,
      rank: this.getRank(readLog.length)
    };
  }
};

// --- Wishlist Store ---
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
  }
};

// --- Read Log Store ---
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
  }
};

// --- Review Store ---
const ReviewStore = {
  // Get custom reviews from LocalStorage
  getCustom(bookId) {
    const allReviews = JSON.parse(localStorage.getItem(STORE_KEYS.USER_REVIEWS)) || {};
    return allReviews[bookId] || [];
  },
  
  // Get total count of custom reviews written by the user
  getAllCustomReviewsCount() {
    const allReviews = JSON.parse(localStorage.getItem(STORE_KEYS.USER_REVIEWS)) || {};
    let count = 0;
    for (const key in allReviews) {
      count += allReviews[key].length;
    }
    return count;
  },
  
  // Get merged reviews: Seed + Custom
  getMerged(bookId) {
    const seed = INITIAL_REVIEWS[bookId] || [];
    const custom = this.getCustom(bookId);
    return [...custom, ...seed]; // Custom user reviews show up at the top
  },
  
  // Add a review
  add(bookId, rating, commentText) {
    const profile = ProfileStore.get();
    const stats = ProfileStore.getStats();
    
    const newReview = {
      id: "rev-custom-" + Date.now(),
      userName: profile.name,
      userNick: profile.nickname,
      userRank: stats.rank,
      userAvatar: profile.avatar,
      rating: parseInt(rating),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      text: commentText
    };
    
    const allReviews = JSON.parse(localStorage.getItem(STORE_KEYS.USER_REVIEWS)) || {};
    if (!allReviews[bookId]) {
      allReviews[bookId] = [];
    }
    
    allReviews[bookId].unshift(newReview); // Add to beginning of user list
    localStorage.setItem(STORE_KEYS.USER_REVIEWS, JSON.stringify(allReviews));
    
    window.dispatchEvent(new CustomEvent("reviews-updated", { detail: { bookId, review: newReview } }));
    return newReview;
  },
  
  // Calculate dynamic rating breakdown
  getBreakdown(book) {
    const bookId = book.id;
    // Base breakdown from seed data
    const breakdown = { ...book.ratingBreakdown };
    
    // Aggregate user-submitted reviews
    const customReviews = this.getCustom(bookId);
    customReviews.forEach(rev => {
      const star = rev.rating;
      if (breakdown[star] !== undefined) {
        breakdown[star] += 1;
      } else {
        breakdown[star] = 1;
      }
    });
    
    // Calculations
    let totalReviews = 0;
    let weightedSum = 0;
    
    for (let stars = 1; stars <= 5; stars++) {
      const count = breakdown[stars] || 0;
      totalReviews += count;
      weightedSum += count * stars;
    }
    
    const average = totalReviews > 0 ? (weightedSum / totalReviews).toFixed(1) : "0.0";
    
    // Compute percentages
    const percentages = {};
    for (let stars = 1; stars <= 5; stars++) {
      const count = breakdown[stars] || 0;
      percentages[stars] = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    }
    
    return {
      average,
      totalReviews,
      breakdown,
      percentages
    };
  }
};
