// AI Book Recommendation Assistant logic for Nigerian Book Review Website
const AIBot = {
  chatHistory: [],
  botName: "NaijaReads AI",
  
  // Initialize AI chatbot
  init() {
    this.chatHistory = [
      {
        sender: "ai",
        text: "Kọ́lé / Hello! I am your <strong>NaijaReads AI Assistant</strong>. 🇳🇬📚 I can help you find your next great Nigerian read. You can ask for books by genre, author, publisher, or mood!",
        hasSuggestions: true
      }
    ];
    this.renderMessages();
    this.bindEvents();
  },
  
  // Bind UI Events
  bindEvents() {
    const toggleBtn = document.getElementById("ai-chat-toggle");
    const closeBtn = document.getElementById("ai-chat-close");
    const sendBtn = document.getElementById("ai-chat-send");
    const inputField = document.getElementById("ai-chat-input");
    const widget = document.getElementById("ai-chat-widget");
    
    // Toggle chat window visibility
    toggleBtn?.addEventListener("click", () => {
      widget?.classList.remove("collapsed");
      this.scrollToBottom();
      // Clear alert dot when opened
      const pulse = toggleBtn.querySelector(".pulse-indicator");
      if (pulse) pulse.style.display = "none";
    });
    
    closeBtn?.addEventListener("click", () => {
      widget?.classList.add("collapsed");
    });
    
    // Send Message events
    sendBtn?.addEventListener("click", () => this.handleUserInput());
    inputField?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleUserInput();
      }
    });
    
    // Quick suggestion clicks inside message bubble
    document.addEventListener("click", (e) => {
      if (e.target && e.target.classList.contains("quick-option-chip")) {
        const query = e.target.getAttribute("data-query");
        if (query) {
          this.submitQuery(query);
        }
      }
    });
  },
  
  // Submit user query programmatically
  submitQuery(text) {
    const inputField = document.getElementById("ai-chat-input");
    if (inputField) {
      inputField.value = text;
      this.handleUserInput();
    }
  },
  
  // Handle User Input Submission
  handleUserInput() {
    const inputField = document.getElementById("ai-chat-input");
    if (!inputField) return;
    
    const text = inputField.value.trim();
    if (!text) return;
    
    // Add user message
    this.chatHistory.push({
      sender: "user",
      text: text
    });
    
    inputField.value = "";
    this.renderMessages();
    this.scrollToBottom();
    
    // Trigger typing response simulation
    this.simulateTypingResponse(text);
  },
  
  // Simulate AI Typing
  simulateTypingResponse(query) {
    // Render an empty "typing..." bubble
    const messagesContainer = document.getElementById("ai-chat-messages");
    if (!messagesContainer) return;
    
    const typingBubble = document.createElement("div");
    typingBubble.className = "msg msg-ai typing-indicator";
    typingBubble.innerHTML = "<span></span><span></span><span></span>";
    typingBubble.style.padding = "0.8rem 1.2rem";
    messagesContainer.appendChild(typingBubble);
    this.scrollToBottom();
    
    setTimeout(() => {
      // Remove typing bubble
      typingBubble.remove();
      
      // Get AI response
      const response = this.generateResponse(query);
      this.chatHistory.push(response);
      
      this.renderMessages();
      this.scrollToBottom();
    }, 800 + Math.random() * 600); // Dynamic latency
  },
  
  // Generate intelligent recommendations based on keywords
  generateResponse(query) {
    const cleanQuery = query.toLowerCase();
    let replyText = "";
    let recommendedBooks = [];
    
    // 1. Search books matching parameters
    const matches = INITIAL_BOOKS.filter(book => {
      const title = book.title.toLowerCase();
      const author = book.author.toLowerCase();
      const cat = book.category.toLowerCase();
      const pub = book.publisher.toLowerCase();
      const desc = book.description.toLowerCase();
      
      return (
        cleanQuery.includes(title) ||
        cleanQuery.includes(author.split(" ").pop()) || // matches last names like Achebe, Adichie
        cleanQuery.includes(cat) ||
        cleanQuery.includes(pub.replace("books", "").trim()) || // matches "masobe", "farafina", etc.
        (cleanQuery.includes("wrestl") && book.id === "things-fall-apart") ||
        (cleanQuery.includes("war") && book.id === "half-of-a-yellow-sun") ||
        (cleanQuery.includes("polygamy") && book.id === "baba-segis-wives") ||
        (cleanQuery.includes("kidnap") && book.id === "son-of-the-house") ||
        (cleanQuery.includes("magic") && book.id === "vagabonds")
      );
    });
    
    // 2. Draft response based on matches found
    if (cleanQuery.includes("hello") || cleanQuery.includes("hi ") || cleanQuery.includes("how far") || cleanQuery.includes("yo")) {
      replyText = "Aba! How far? Glad to chat. What kind of books are you looking to review or explore today? Oya, tell me!";
    } else if (cleanQuery.includes("masobe")) {
      recommendedBooks = INITIAL_BOOKS.filter(b => b.publisher.includes("Masobe"));
      replyText = "Ah, **Masobe Books**! They publish some of the most vibrant contemporary voices in Nigeria. Here are the Masobe novels in our catalogue:";
    } else if (cleanQuery.includes("farafina")) {
      recommendedBooks = INITIAL_BOOKS.filter(b => b.publisher.includes("Farafina"));
      replyText = "Excellent taste! **Farafina Books** is legendary for publishing award-winning literature. Check out these titles:";
    } else if (cleanQuery.includes("cassava") || cleanQuery.includes("republic")) {
      recommendedBooks = INITIAL_BOOKS.filter(b => b.publisher.includes("Cassava"));
      replyText = "Fantastic! **Cassava Republic** is renowned for changing how we think about African writing. Take a look at this masterpiece:";
    } else if (cleanQuery.includes("comedy") || cleanQuery.includes("funny") || cleanQuery.includes("humor") || cleanQuery.includes("laugh")) {
      recommendedBooks = INITIAL_BOOKS.filter(b => b.category === "Comedy");
      replyText = "Looking for a laugh? 🎭 Nigerian writers have a top-tier sense of humor! These books will definitely put a smile on your face:";
    } else if (cleanQuery.includes("classic") || cleanQuery.includes("old") || cleanQuery.includes("traditional")) {
      recommendedBooks = INITIAL_BOOKS.filter(b => b.category === "Classics");
      replyText = "Ah, going back to the roots! 🏛️ These are foundational pillars of African literature. You cannot call yourself a bookie without reviewing these classics:";
    } else if (cleanQuery.includes("drama") || cleanQuery.includes("family") || cleanQuery.includes("marriage")) {
      recommendedBooks = INITIAL_BOOKS.filter(b => b.category === "Drama");
      replyText = "Drama & family sagas hit close to home. 💔 These books portray Nigerian marriages, secrets, and family dynamics with deep emotion:";
    } else if (cleanQuery.includes("historical") || cleanQuery.includes("history") || cleanQuery.includes("civil war") || cleanQuery.includes("biafra")) {
      recommendedBooks = INITIAL_BOOKS.filter(b => b.category === "Historical Fiction");
      replyText = "Exploring our history helps us understand today. 📜 Here is a stunning historical masterpiece set during the Biafran war:";
    } else if (cleanQuery.includes("biography") || cleanQuery.includes("memoir") || cleanQuery.includes("life")) {
      recommendedBooks = INITIAL_BOOKS.filter(b => b.category === "Biography");
      replyText = "Inspiring life stories! 👤 Review the lives and struggles of resilient Nigerians through these biographies:";
    } else if (matches.length > 0) {
      recommendedBooks = matches.slice(0, 3);
      replyText = `Oya! I found ${matches.length} book(s) related to your search. Take a look:`;
    } else {
      // General fallbacks
      replyText = "No vex, I couldn't find an exact match for that keyword. But no wahala! Here are two highly-recommended books you should review:";
      // Suggest two popular books
      recommendedBooks = [
        INITIAL_BOOKS.find(b => b.id === "things-fall-apart"),
        INITIAL_BOOKS.find(b => b.id === "son-of-the-house")
      ];
    }
    
    return {
      sender: "ai",
      text: replyText,
      books: recommendedBooks
    };
  },
  
  // Render message arrays into HTML container
  renderMessages() {
    const container = document.getElementById("ai-chat-messages");
    if (!container) return;
    
    container.innerHTML = "";
    
    this.chatHistory.forEach(msg => {
      const bubble = document.createElement("div");
      bubble.className = `msg ${msg.sender === "ai" ? "msg-ai" : "msg-user"}`;
      
      // Parse markdown bold and newlines simply
      let formattedText = msg.text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
      
      bubble.innerHTML = `<span class="message-text">${formattedText}</span>`;
      
      // If AI message contains recommendation books, append card elements
      if (msg.sender === "ai" && msg.books && msg.books.length > 0) {
        msg.books.forEach(book => {
          const recCard = document.createElement("a");
          recCard.href = `#book/${book.id}`;
          recCard.className = "ai-recommendation-card";
          
          // Small inline CSS styling cover
          recCard.innerHTML = `
            <div class="rec-cover-mini" style="background: ${book.coverColor}; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.4rem; padding: 2px; border-left: 2px solid rgba(0,0,0,0.3); font-weight: bold; text-align: center;">
              ${book.title.substring(0, 15)}...
            </div>
            <div class="rec-info-mini">
              <span class="rec-title-mini">${book.title}</span>
              <span class="rec-author-mini">${book.author}</span>
              <span class="rec-badge-mini">${book.category}</span>
            </div>
          `;
          
          // Close chatbot when recommended card is clicked to reveal book details
          recCard.addEventListener("click", () => {
            document.getElementById("ai-chat-widget")?.classList.add("collapsed");
          });
          
          bubble.appendChild(recCard);
        });
      }
      
      // Add suggestion chips on the first message
      if (msg.sender === "ai" && msg.hasSuggestions) {
        const chipsContainer = document.createElement("div");
        chipsContainer.className = "quick-options-container";
        
        const options = [
          { text: "Recommend Comedy 🎭", query: "Show me a comedy book" },
          { text: "Masobe Novels 📚", query: "Show me books from Masobe Books" },
          { text: "Classics 🏛️", query: "Give me classic books" },
          { text: "Drama 🎭", query: "Show me drama books" }
        ];
        
        options.forEach(opt => {
          const chip = document.createElement("button");
          chip.className = "quick-option-chip";
          chip.setAttribute("data-query", opt.query);
          chip.textContent = opt.text;
          chipsContainer.appendChild(chip);
        });
        
        bubble.appendChild(chipsContainer);
      }
      
      container.appendChild(bubble);
    });
  },
  
  // Auto-scroll chat body
  scrollToBottom() {
    const container = document.getElementById("ai-chat-messages");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
};
