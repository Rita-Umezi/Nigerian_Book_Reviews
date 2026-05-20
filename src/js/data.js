// Seed book database representing real Nigerian books, categories, and publishing houses.
const INITIAL_BOOKS = [
  {
    id: "things-fall-apart",
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    isbn: "9780385474542",
    publisher: "Heinemann Books",
    year: 1958,
    category: "Classics",
    badge: "Top 1 in Classics",
    coverColor: "linear-gradient(135deg, #4A2E1C 0%, #2A1608 100%)",
    description: "A classic narrative about all-powerful warrior Okonkwo and the clash between traditional Igbo culture and British colonialism. Widely considered the archetype of modern African literature in English.",
    ratingBreakdown: { 5: 145, 4: 35, 3: 15, 2: 3, 1: 2 },
    chapterTitle: "Chapter 1: The Fame of Okonkwo",
    chapterText: `
      <span class="dropcap">O</span>konkwo was well known throughout the nine villages and even beyond. His fame rested on solid personal achievements. As a young man of eighteen he had brought honor to his village by throwing Amalinze the Cat. Amalinze was the great wrestler who for seven years was unbeaten, from Umuofia to Mbaino. He was called the Cat because his back would never touch the earth.
      <p>It was this man that Okonkwo threw in a fight which the old men agreed was one of the fiercest since the founder of their town engaged a spirit of the wild for seven days and seven nights.</p>
      <p>The drums beat and the flutes sang and the spectators held their breath. Amalinze was a wily craftsman, but Okonkwo was as slippery as a fish in the water. Every nerve and every muscle stood out on their arms, on their backs and their thighs, and one almost heard them stretching to breaking point. In the end Okonkwo threw the Cat.</p>
      <p>That was many years ago, twenty years or more, and during this time Okonkwo’s fame had grown like a bush-fire in the harmattan. He was tall and huge, and his bushy eyebrows and wide nose gave him a very severe look. He breathed heavily, and it was said that, when he slept, his wives and children in their houses could hear him breathe. When he walked, his heels hardly touched the ground and he seemed on springs, as if he were going to pounce on somebody. And he did pounce on people quite often. He had a slight stammer and when he was angry and could not get his words out quickly enough, he would use his fists. He had no patience with unsuccessful men. He had no patience with his father.</p>
    `
  },
  {
    id: "half-of-a-yellow-sun",
    title: "Half of a Yellow Sun",
    author: "Chimamanda Ngozi Adichie",
    isbn: "9780007200283",
    publisher: "Farafina Books",
    year: 2006,
    category: "Historical Fiction",
    badge: "Top 5 in Fiction",
    coverColor: "linear-gradient(135deg, #7C1313 0%, #450A0A 100%)",
    description: "Set in Nigeria during the 1960s Biafran War, this masterpiece follows three characters—a houseboy, a revolutionary professor, and a wealthy twin sister—swept up in the turbulent events of the civil conflict.",
    ratingBreakdown: { 5: 110, 4: 28, 3: 8, 2: 2, 1: 0 },
    chapterTitle: "Chapter 1: Master's House",
    chapterText: `
      <span class="dropcap">M</span>aster was a little crazy; he had spent too many years in English schools. That was what Ugwu’s aunty said as they walked home under the white-hot Nsukka sun. But Master's house was magnificent, standing proud behind a tall hedge of bougainvillea. Ugwu had never seen anything so grand.
      <p>The living room was filled with books. There were books on the wooden tables, books on the coffee table, and shelves lining the walls from floor to ceiling. The smell of paper and old bindings was thick and comforting in the air, like dust mixed with dried leaves.</p>
      <p>“Clean the shelves with a dry cloth,” Master had told him on his first day. Master was a tall man, with hair that stood up in an uncombed bush. He spoke English with a booming voice that made Ugwu shrink back at first, but soon Ugwu learned that Master’s anger was like a brief rainstorm—loud but quickly finished.</p>
      <p>Ugwu sat on the kitchen floor and peeled yams. The skin was rough and dirty, but the inside was clean and white. He thought of his village, of the dry clay ground and the sound of his sisters laughing by the well. But here, he had chicken on Sundays and slept on a soft mat in his own room. Master was indeed crazy, but Ugwu decided he liked this madness.</p>
    `
  },
  {
    id: "baba-segis-wives",
    title: "The Secret Lives of Baba Segi's Wives",
    author: "Lola Shoneyin",
    isbn: "9781846687495",
    publisher: "Cassava Republic",
    year: 2010,
    category: "Comedy",
    badge: "Top 20 in Comedy",
    coverColor: "linear-gradient(135deg, #D97706 0%, #78350F 100%)",
    description: "A sharp, funny, and warm novel offering a modern perspective on polygamy, secrets, and family bonds in Ibadan, Nigeria. It reveals the complex internal politics of a polygamous household when a college graduate becomes the fourth wife.",
    ratingBreakdown: { 5: 80, 4: 38, 3: 12, 2: 5, 1: 1 },
    chapterTitle: "Chapter 1: The Arrival of Bolanle",
    chapterText: `
      <span class="dropcap">B</span>aba Segi was a man of substance, a merchant who ruled his household with a loud voice and a heavy stomach. But when Bolanle, his fourth wife, arrived, the peace of the household was shattered. Bolanle was a graduate, the only wife who had been to university, and her presence was a threat to the established order.
      <p>Iya Segi, the first wife, watched her from the veranda, her arms folded across her massive chest. She did not trust Bolanle's quiet manners or her books. “A university degree does not cook soup,” she whispered to Iya Tope, the second wife, who only nodded and kept her head down.</p>
      <p>Baba Segi was oblivious. He walked around the compound in his colorful dashiki, boasting to his friends about his new educated bride. He believed Bolanle would bring him prestige. He did not know that Bolanle carried a secret, one that had driven her away from her family and into his arms.</p>
      <p>In the kitchen, the wives gathered, their whispers like scorpions sliding under the door. Bolanle stood by the sink, wash-basin in hand, feeling the cold weight of their hostility. She knew she would have to fight for her place in this house, but she had survived worse.</p>
    `
  },
  {
    id: "stay-with-me",
    title: "Stay With Me",
    author: "Ayobami Adebayo",
    isbn: "9781786890160",
    publisher: "Ouida Books",
    year: 2017,
    category: "Drama",
    badge: "Top 10 in Drama",
    coverColor: "linear-gradient(135deg, #0D9488 0%, #115E59 100%)",
    description: "A heartbreaking story of marriage, love, family secrets, and the overwhelming desire to have a child in 1980s Nigeria, amidst political instability and military coups.",
    ratingBreakdown: { 5: 75, 4: 32, 3: 10, 2: 4, 1: 0 },
    chapterTitle: "Chapter 1: The Hairdresser's Salon",
    chapterText: `
      <span class="dropcap">I</span> must tell this story before it is too late, before my memory turns into dust. Yejide and Akin had been married since they met at university in Ife. They had agreed that polygamy was not for them. They were modern, educated, and in love.
      <p>But love is not enough when the cradle is empty. For four years, Yejide’s womb remained closed. She drank bitter herbs, visited white-garment churches, and endured the pitying looks of her neighbors. Akin stood by her, refusing his family's suggestions to take another wife.</p>
      <p>Then, on a hot Tuesday morning, Akin’s mother arrived at their home in Ilesa. She was not alone. Behind her stood a young girl, her face smooth and her eyes downcast. “This is Funmi,” the mother-in-law announced, pushing the girl forward. “She will be Akin’s second wife. We cannot wait forever for a child.”</p>
      <p>Yejide felt the room spin. She looked at Akin, waiting for him to object, to throw them out. But Akin stood silent, his eyes fixed on the floor. It was in that silence that the foundation of their marriage began to crumble.</p>
    `
  },
  {
    id: "son-of-the-house",
    title: "The Son of the House",
    author: "Cheluchi Onyemelukwe-Onuobia",
    isbn: "9789789793913",
    publisher: "Masobe Books",
    year: 2019,
    category: "Drama",
    badge: "Top 5 in Fiction",
    coverColor: "linear-gradient(135deg, #854D0E 0%, #422006 100%)",
    description: "Set against the backdrop of a changing Nigeria, this is a powerful saga of two women from vastly different backgrounds—one a rural maid, the other an educated city dweller—whose lives intersect during a kidnapping in Enugu.",
    ratingBreakdown: { 5: 92, 4: 25, 3: 8, 2: 2, 1: 1 },
    chapterTitle: "Chapter 1: The Kidnapping",
    chapterText: `
      <span class="dropcap">W</span>e were sitting in the dark room, our hands bound behind our backs with rough nylon rope. Outside, the rain was beating against the zinc roof, a drumming sound that filled the silence. Nwabulu looked at Julie. They had never spoken before this day.
      <p>One was a housemaid who had spent her youth scrubbing floors; the other was a wealthy lady who lived in a duplex in Enugu. But here, in this damp, concrete room with plaster peeling off the walls, they were equals, bound by fear and shared memories.</p>
      <p>“Do you think they will kill us?” Nwabulu whispered. Her voice was cracked, dry from hours of crying. Julie did not answer immediately. She shifted her weight, trying to relieve the pressure on her ankles. She looked at Nwabulu, seeing the scars on her arms, and felt a strange, sudden bond.</p>
      <p>“They want money,” Julie finally said, her voice steady despite the trembling of her hands. “They will wait for the ransom.” She did not say what would happen if the money did not arrive. In the silence that followed, they began to talk, telling their stories to pass the time and keep the shadows away.</p>
    `
  },
  {
    id: "vagabonds",
    title: "Vagabonds!",
    author: "Eloghosa Osunde",
    isbn: "9789785893304",
    publisher: "Masobe Books",
    year: 2022,
    category: "Fiction",
    badge: "Top 15 in Fiction",
    coverColor: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    description: "A chaotic, magical, and gorgeous portrait of contemporary Lagos, exploring the lives of outcasts, spirits, and the city itself, navigating through borders, power, and freedom.",
    ratingBreakdown: { 5: 68, 4: 20, 3: 12, 2: 6, 1: 4 },
    chapterTitle: "Chapter 1: Introduction to Lagos",
    chapterText: `
      <span class="dropcap">L</span>agos is not a city that asks for permission. It is a city that happens to you. It breathes, it runs, it screams, and it hides its secrets in the cracks of the asphalt. To live here, you must be a little wild, a little blind, and very brave.
      <p>In this city, the spirits walk alongside the living. There is Tata, the spirit of Lagos, who wears a sharp charcoal suit and carries a briefcase containing the names of everyone who owes the city a debt. He is not a kind spirit, but he is fair.</p>
      <p>“You think you own this city?” Tata would ask the politicians and the landlords, his voice like the grinding of metal. “This city belongs to the vagabonds, the ones who sleep under the bridges and dance in the rain. They are the ones who keep the heart beating.”</p>
      <p>The city is a beast that eats its children, but it also gives them wings. On this night, as the neon lights of Ikeja blinked through the smog, a young girl named Ékò woke up to find she could hear the thoughts of the cars stuck in traffic. It was the city's first gift.</p>
    `
  },
  {
    id: "abundance-of-scorpions",
    title: "An Abundance of Scorpions",
    author: "Hadiza El-Rufai",
    isbn: "9789785465808",
    publisher: "Masobe Books",
    year: 2017,
    category: "Drama",
    badge: "Top 30 in Biography",
    coverColor: "linear-gradient(135deg, #B45309 0%, #78350F 100%)",
    description: "An emotional and thought-provoking story about loss, resilience, and finding hope in Northern Nigeria. Tambaya navigates grief and starts a new life at an orphanage in Kaduna.",
    ratingBreakdown: { 5: 50, 4: 25, 3: 15, 2: 3, 1: 0 },
    chapterTitle: "Chapter 1: Loss",
    chapterText: `
      <span class="dropcap">T</span>he dust of Kaduna was yellow and thick in the Harmattan air, settling on the leaves of the neem trees and the windows of the houses. Tambaya sat on the veranda, her eyes fixed on the empty gravel driveway.
      <p>It had been three months since the accident on the Zaria road that took her husband and her only child. The house was too quiet, the rooms filled with their clothes and the ghost of their laughter. The grief remained a heavy stone in her chest, making it hard to breathe.</p>
      <p>But today, she made a decision. She stood up, walked into the bedroom, and dragged out her large leather suitcase. She would pack her bags, lock the door of this house, and start a new life. She had accepted a position as a matron at the orphanage in Kaduna.</p>
      <p>Her family had objected. “You need to mourn, Tambaya,” her brother had said. “You cannot run away from your grief.” But she knew that staying in this house would kill her. She needed to be useful, to care for children who, like her, had lost everything.</p>
    `
  },
  {
    id: "joys-of-motherhood",
    title: "The Joys of Motherhood",
    author: "Buchi Emecheta",
    isbn: "9780807609507",
    publisher: "Heinemann Books",
    year: 1979,
    category: "Classics",
    badge: "Top 5 in Classics",
    coverColor: "linear-gradient(135deg, #701A75 0%, #4A044E 100%)",
    description: "A touching and powerful classic highlighting the tragic life of Nnu Ego, a woman whose entire value in society is wrapped up in being a mother, set against pre- and post-colonial Lagos and Ibuza.",
    ratingBreakdown: { 5: 85, 4: 18, 3: 6, 2: 1, 1: 1 },
    chapterTitle: "Chapter 1: The Mother's Burden",
    chapterText: `
      <span class="dropcap">N</span>nu Ego lay in the dark room of her tenement in Lagos, listening to the shallow breathing of her newborn son. In the village of Ibuza, she had been raised to believe that a woman's greatest achievement, her only path to joy, was motherhood.
      <p>She had prayed for children, made sacrifices to her chi, and endured the shame of barrenness in her first marriage. But now, in the crowded, noisy streets of Lagos during the war years, the joy of motherhood felt like a heavy yoke around her neck.</p>
      <p>Her husband, Nnaife, worked as a laundryman for a white family, earning a pittance that barely bought garri. He was away for long stretches, leaving her to feed the children on what she could sell from her small market stall. She looked at her thin hands, calloused from hard work, and wondered where the joy was.</p>
      <p>“A mother must sacrifice everything for her children,” the elders had said. Nnu Ego was willing to sacrifice her body, her youth, and her pride. But she looked at the city outside her door and wondered if her children would ever thank her for the sacrifice.</p>
    `
  },
  {
    id: "blackass",
    title: "Blackass",
    author: "A. Igoni Barrett",
    isbn: "9789789479375",
    publisher: "Farafina Books",
    year: 2015,
    category: "Comedy",
    badge: "Top 25 in Comedy",
    coverColor: "linear-gradient(135deg, #854D0E 0%, #451A03 100%)",
    description: "A sharp satirical novel set in Lagos, where Furo Wariboko, a young unemployed Nigerian man, wakes up to find he has transformed into a white man, except for his rear end, exploring race and privilege in modern Nigeria.",
    ratingBreakdown: { 5: 52, 4: 35, 3: 18, 2: 8, 1: 3 },
    chapterTitle: "Chapter 1: The Metamorphosis",
    chapterText: `
      <span class="dropcap">F</span>uro Wariboko awoke on a Tuesday morning to find that his skin had turned a startling shade of pinkish-white. He sat up in bed, rubbing his eyes, thinking it was a trick of the early morning Lagos light filtering through the cheap curtains.
      <p>He looked at his hands; they were hairy and pale. He rushed to the bathroom, his heart pounding in his chest. In the cracked mirror, a stranger stared back at him—a tall, white man with red hair and blue eyes. He gasped, his mouth opening in shock.</p>
      <p>He touched his cheeks, his nose, his chin. The skin felt like his, but it was not. He turned around, checking his reflection in the glass. He froze. His entire body had turned white, except for his rear end, which remained as dark as it had always been.</p>
      <p>Furo sat on the toilet lid, head in his hands. He was supposed to go for a job interview at ten o'clock in Victoria Island. How could he walk into an office looking like this? How would his parents react? He was a black Lagos boy, and now he was a white man with a black ass.</p>
    `
  },
  {
    id: "aishatus-story",
    title: "Aishatu's Story",
    author: "Hadiza Bagudu",
    isbn: "9789785893328",
    publisher: "Masobe Books",
    year: 2021,
    category: "Biography",
    badge: "Top 10 in Biography",
    coverColor: "linear-gradient(135deg, #14532D 0%, #064E3B 100%)",
    description: "A compelling biography recounting the life of a resilient Northern Nigerian woman navigating societal expectations and family struggles in Gombe and Abuja.",
    ratingBreakdown: { 5: 38, 4: 12, 3: 4, 2: 1, 1: 0 },
    chapterTitle: "Chapter 1: The Farm in Gombe",
    chapterText: `
      <span class="dropcap">T</span>he sun rose early over the hills of Gombe, casting a warm golden light across the cornfields. Aishatu was only seven when she first accompanied her father to the harvest. She carried a small woven basket on her head, her bare feet sinking into the rich, dark soil.
      <p>It was in these fields that she learned the meaning of patience, watching small green shoots turn into tall corn stalks under the wide, blue sky. Her father was a quiet man who spoke mostly to his crops. “A farm does not lie to you, Aishatu,” he would say. “If you work hard, it will feed you.”</p>
      <p>But the world outside the farm was not so simple. Aishatu wanted to go to school, to learn to read the books her older cousins brought back from the city. In their village, however, girls were expected to marry early and tend to their husbands' households.</p>
      <p>As she sat under the shade of a mango tree, eating her lunch of boiled groundnuts, Aishatu resolved that she would find a way to the city. She did not know what Abuja looked like, but in her dreams, it was a place of tall buildings and books, waiting for her.</p>
    `
  }
];

const INITIAL_REVIEWS = {
  "things-fall-apart": [
    {
      id: "rev-tfa-1",
      userName: "Tunde Alabi",
      userNick: "BookLover99",
      userRank: "Literature Guru",
      userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Tunde",
      rating: 5,
      date: "May 12, 2026",
      text: "An absolute masterpiece. Achebe's storytelling captures the essence of pre-colonial Igbo life beautifully. Every character feels alive, and the clash of cultures is portrayed with incredible tragic power. A must-read for every Nigerian."
    },
    {
      id: "rev-tfa-2",
      userName: "Chidi Nwachukwu",
      userNick: "ChidiReadz",
      userRank: "Reviewer",
      userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Chidi",
      rating: 4,
      date: "April 28, 2026",
      text: "A heartbreaking read. The tragedy of Okonkwo is told with such restraint and power. The writing style is simple yet profound. The book shows how division within our own community made it easy for colonial forces to break our society."
    }
  ],
  "half-of-a-yellow-sun": [
    {
      id: "rev-hys-1",
      userName: "Amara Obi",
      userNick: "LitQueen",
      userRank: "Reviewer",
      userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Amara",
      rating: 5,
      date: "May 08, 2026",
      text: "Adichie's best book by far. Ugwu is one of the most well-written characters in African literature. The book shows the horror of the Biafran war but focuses so deeply on the human relationships that you feel every loss personally."
    }
  ],
  "baba-segis-wives": [
    {
      id: "rev-bsw-1",
      userName: "Kemi Adeleke",
      userNick: "KemiReads",
      userRank: "Bookie",
      userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Kemi",
      rating: 5,
      date: "May 15, 2026",
      text: "So funny yet so deep! Shoneyin writes the wives with such rich humor, but as the book goes on, you see the pain and secrets that drove each of them into Baba Segi's compound. Bolanle's character is a breath of fresh air."
    }
  ],
  "stay-with-me": [
    {
      id: "rev-swm-1",
      userName: "Fatima Bello",
      userNick: "FatimaB",
      userRank: "Bookie",
      userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Fatima",
      rating: 4,
      date: "May 01, 2026",
      text: "A beautifully painful look at family expectations and childlessness. The perspective switches between Yejide and Akin are done perfectly, and the historical background of 1980s Nigerian coups adds a great sense of tension."
    }
  ],
  "son-of-the-house": [
    {
      id: "rev-soth-1",
      userName: "Nneka Okafor",
      userNick: "NnekaReads",
      userRank: "Reviewer",
      userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Nneka",
      rating: 5,
      date: "May 10, 2026",
      text: "A masterpiece that links the struggles of women in past and modern generations. Nwabulu and Julie are unforgettable. I read the whole book in one night, I just couldn't put it down."
    }
  ]
};
