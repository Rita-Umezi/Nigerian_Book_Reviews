// Dynamic Client-side SPA Router for Nigerian Book Review Website
const Router = {
  routes: {},
  
  // Register a route and its handler
  add(path, handler) {
    this.routes[path] = handler;
  },
  
  // Initialize router listeners
  init() {
    window.addEventListener("hashchange", () => this.handleRoute());
    window.addEventListener("load", () => this.handleRoute());
  },
  
  // Resolve current route and execute corresponding render function
  handleRoute() {
    const hash = window.location.hash || "#home";
    const viewContainer = document.getElementById("app-view");
    
    if (!viewContainer) return;
    
    let matchedHandler = null;
    let params = {};
    
    // 1. Direct Exact Match
    if (this.routes[hash]) {
      matchedHandler = this.routes[hash];
    } else {
      // 2. Dynamic Match (e.g. #book/:id matches #book/things-fall-apart)
      for (const routePattern in this.routes) {
        if (routePattern.includes("/:")) {
          const parts = routePattern.split("/:");
          const baseRoute = parts[0]; // e.g. "#book"
          const paramName = parts[1]; // e.g. "id"
          
          if (hash.startsWith(baseRoute + "/")) {
            matchedHandler = this.routes[routePattern];
            const paramValue = hash.substring(baseRoute.length + 1);
            params[paramName] = paramValue;
            break;
          }
        }
      }
    }
    
    // Update active nav menu highlighting
    this.updateNavbar(hash);
    
    // Execute route transition
    if (matchedHandler) {
      // Apply fade transition
      viewContainer.style.opacity = "0";
      
      setTimeout(() => {
        matchedHandler(params);
        viewContainer.style.opacity = "1";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 150); // Matches CSS transition timings
    } else {
      // Fallback redirect to home if route doesn't match
      window.location.hash = "#home";
    }
  },
  
  // Highlight currently active page inside header
  updateNavbar(hash) {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => link.classList.remove("active"));
    
    if (hash === "#home" || hash === "") {
      document.getElementById("nav-link-home")?.classList.add("active");
    } else if (hash === "#explore" || hash.startsWith("#book")) {
      document.getElementById("nav-link-explore")?.classList.add("active");
    } else if (hash === "#wishlist") {
      document.getElementById("nav-link-wishlist")?.classList.add("active");
    } else if (hash === "#profile") {
      document.getElementById("nav-link-profile")?.classList.add("active");
    }
  },
  
  // Programmatic navigation utility
  navigate(hash) {
    window.location.hash = hash;
  }
};
