import { useState } from 'react';

const BOOKS = [
  {
    id: 1, title: 'Bhagavad Gita', author: 'Vyasa', category: 'Gita',
    cover: '/bhagavad-gita-book-cover.jpg',
    accent: '#E8621A',
    tagline: 'The Song of God',
    chapters: 18, verses: 700,
    tags: ['Philosophy', 'Yoga', 'Dharma'],
    description: 'The Bhagavad Gita is a 700-verse Hindu scripture that is part of the epic Mahabharata. A timeless dialogue between Prince Arjuna and Lord Krishna on duty, righteousness, and the path to liberation.',
    preview: [
      { ch: 1, title: 'Arjuna Vishada Yoga', text: 'Dhritarashtra said: O Sanjaya, what did my sons and the sons of Pandu do when they assembled on the sacred field of Kurukshetra, eager to fight? Having seen the army of the Pandavas arrayed in military fashion, King Duryodhana approached his teacher Drona and spoke these words.' },
      { ch: 2, title: 'Sankhya Yoga', text: 'To him who was thus overwhelmed with pity, whose eyes were full of tears and who was despondent, Madhusudana spoke these words: Whence has come upon you, in this crisis, this depression, this unmanliness? Do not yield to impotence, O Arjuna. It does not become you. Shake off faint-heartedness and arise.' },
      { ch: 3, title: 'Karma Yoga', text: 'Arjuna said: If You consider that knowledge is superior to action, O Janardana, then why do You urge me to engage in this terrible action? With an apparently confused statement You seem to bewilder my intelligence. Therefore, please tell me decisively which is more beneficial.' },
    ]
  },
  {
    id: 2, title: 'Ramayana', author: 'Valmiki', category: 'Epics',
    cover: '/ramayan-book-cover.jpg',
    accent: '#DC2626',
    tagline: 'The Journey of Rama',
    chapters: 7, verses: 24000,
    tags: ['Epic', 'Dharma', 'Devotion'],
    description: 'The Ramayana is an ancient Indian epic poem narrating the struggle of the divine prince Rama to rescue his wife Sita from the demon king Ravana, aided by an army of monkeys.',
    preview: [
      { ch: 1, title: 'Bala Kanda', text: 'There was a king of great might, truthful and firm in his duties, who was the lord of all the earth — his name was Dasharatha, and he ruled from the glorious city of Ayodhya. He was equal to Indra and Kubera in wealth and power, and he was celebrated throughout the three worlds.' },
      { ch: 2, title: 'Ayodhya Kanda', text: 'The great Kaikeyi, burning with jealousy, reminded King Dasharatha of the two boons he had once granted her during a great battle. She demanded that Rama be exiled to the forest for fourteen years, and that her own son Bharata be crowned king in his place.' },
    ]
  },
  {
    id: 3, title: 'Mahabharata', author: 'Vyasa', category: 'Epics',
    cover: '/mahabharata-book-cover.jpg',
    accent: '#1D4ED8',
    tagline: 'The Great War of Bharata',
    chapters: 18, verses: 100000,
    tags: ['Epic', 'War', 'Philosophy'],
    description: 'The Mahabharata is one of the two major Sanskrit epics of ancient India. With over 100,000 shlokas it is one of the longest epic poems ever written, narrating the great Kurukshetra War.',
    preview: [
      { ch: 1, title: 'Adi Parva', text: 'I bow to Narayana and Nara, the most exalted of male beings, and also to the goddess Saraswati, and then say Jaya! This is the story of the great Bharata dynasty — the conflict that arose from the pride of kings, and the eternal dharma that governs all life.' },
      { ch: 2, title: 'Sabha Parva', text: 'The Pandavas, having heard of the great hall of assembly built by the Kurus, consulted among themselves and decided to build an even more magnificent one. The great architect Maya was summoned, and he built a hall so beautiful that it dazzled all who entered.' },
    ]
  },
  {
    id: 4, title: 'Upanishads', author: 'Various Rishis', category: 'Upanishads',
    cover: '/upanishads-book-cover.jpg',
    accent: '#7C3AED',
    tagline: 'Wisdom of the Sages',
    chapters: 108, verses: 5000,
    tags: ['Philosophy', 'Metaphysics', 'Self'],
    description: 'The Upanishads are Hindu philosophical texts forming the foundation of Vedantic philosophy, exploring the nature of Brahman, Atman, and the ultimate reality of existence.',
    preview: [
      { ch: 1, title: 'Isha Upanishad', text: 'All this — whatever exists in this changing universe — should be covered by the Lord. Protect yourself through detachment. Do not covet anyone\'s wealth. By doing your work in this life, try to live a hundred years. Thus karma will not bind you. There is no other way for you.' },
      { ch: 2, title: 'Kena Upanishad', text: 'Who sends the mind to wander afar? Who first drives life to start on its journey? Who impels us to utter these words? Who is the Spirit behind the eye and the ear? It is the ear of the ear, the mind of the mind, the speech of speech, the life of life, and the eye of the eye.' },
    ]
  },
  {
    id: 5, title: 'The Vedas', author: 'Ancient Rishis', category: 'Vedas',
    cover: '/vedas-book-cover.jpg',
    accent: '#B45309',
    tagline: 'The Oldest Sacred Knowledge',
    chapters: 4, verses: 20000,
    tags: ['Ritual', 'Hymns', 'Mantras'],
    description: 'The Vedas are the oldest scriptures of Hinduism composed in Vedic Sanskrit — Rigveda, Samaveda, Yajurveda, and Atharvaveda — containing hymns, philosophical discussions and rituals.',
    preview: [
      { ch: 1, title: 'Rigveda — Agni Sukta', text: 'I laud Agni, the chosen Priest, God, minister of sacrifice, the Hotar, lavishest of wealth. Worthy is Agni to be praised by living as by ancient seers. He shall bring hitherward the Gods. Through Agni man obtains wealth, yea, plenty waxing day by day, most rich in heroes, glorious.' },
      { ch: 2, title: 'Gayatri Mantra', text: 'Om Bhur Bhuvaḥ Swaḥ, Tat-savitur Vareñyaṃ, Bhargo Devasya Dhīmahi, Dhiyo Yonaḥ Prachodayāt — We meditate on the glory of that Being who has produced this universe; may He enlighten our minds.' },
    ]
  },
  {
    id: 6, title: 'Puranas', author: 'Vyasa', category: 'Puranas',
    cover: '/puranas-book-cover.jpg',
    accent: '#065F46',
    tagline: 'Ancient Stories of Creation',
    chapters: 18, verses: 400000,
    tags: ['Cosmology', 'Mythology', 'History'],
    description: 'The Puranas are a vast body of Hindu literature about the history of the universe from creation to destruction, genealogies of kings, heroes and demigods, and descriptions of Hindu cosmology.',
    preview: [
      { ch: 1, title: 'Bhagavata Purana', text: 'O wise one, the Supreme Personality of Godhead is the ultimate resting place and source of everything. He alone is the subject of all scriptures. Sages who are free from all material association find their complete satisfaction in hearing topics about Him.' },
      { ch: 2, title: 'Vishnu Purana', text: 'From Brahma\'s mind were born the four Kumaras — Sanaka, Sanandana, Sanatana and Sanatkumara — pure and celibate from birth. When Brahma asked them to help in creation, they refused, their minds absorbed in the contemplation of Brahman.' },
    ]
  },
];

const CATEGORIES = ['All', 'Vedas', 'Gita', 'Upanishads', 'Epics', 'Puranas'];

export default function Library() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [saved, setSaved] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [hoveredBook, setHoveredBook] = useState(null);

  const filtered = activeCategory === 'All' ? BOOKS : BOOKS.filter(b => b.category === activeCategory);

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSaved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const openBook = (book) => { setSelectedBook(book); setActiveChapter(0); };

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'Inter', sans-serif" }}>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        @key- frames fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .book-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; cursor: pointer; }
        .book-card:hover { transform: translateY(-10px) scale(1.02); }
        .book-img { transition: transform 0.5s ease; }
        .book-card:hover .book-img { transform: scale(1.08); }
        .book-overlay { transition: opacity 0.3s ease; }
        .cat-pill { transition: all 0.2s ease; cursor: pointer; border: none; font-family:'Inter',sans-serif; }
        .cat-pill.active { background: linear-gradient(135deg,#f97316,#ea580c) !important; color:#fff !important; box-shadow: 0 4px 16px rgba(249,115,22,0.4); }
        .cat-pill:hover:not(.active) { background: rgba(255,255,255,0.12) !important; color:#fff !important; }
        .save-btn { transition: transform 0.2s ease, background 0.2s ease; border:none; cursor:pointer; }
        .save-btn:hover { transform: scale(1.2); }
        .read-btn { transition: all 0.2s ease; border:none; cursor:pointer; font-family:'Inter',sans-serif; }
        .read-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(249,115,22,0.4) !important; }
        .ch-btn { transition: all 0.15s; border:none; cursor:pointer; font-family:'Inter',sans-serif; }
        .ch-btn.active { background: rgba(249,115,22,0.15) !important; color:#f97316 !important; border-color: rgba(249,115,22,0.4) !important; }
        .ch-btn:hover:not(.active) { background: rgba(255,255,255,0.08) !important; color:#fff !important; }
        .modal-scroll::-webkit-scrollbar { width:6px; }
        .modal-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.4); border-radius:3px; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', padding: '80px 64px 80px', overflow: 'hidden', background: 'linear-gradient(160deg, #1A0F00 0%, #2D1A00 50%, #1A0F00 100%)' }}>
        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 50, right: 100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,149,42,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -50, right: -50, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Decorative Sanskrit Om */}
        <div style={{ position: 'absolute', right: 64, top: '50%', transform: 'translateY(-50%)', fontSize: 240, opacity: 0.03, color: '#f97316', fontFamily: 'serif', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>ॐ</div>

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40 }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', animation: 'shimmer 2s infinite' }}></div>
              <span style={{ color: '#FB923C', fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sacred Texts Collection</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 60, fontWeight: 700, color: '#fff', margin: '0 0 20px', lineHeight: 1.1 }}>
              Vedic<br /><span style={{ color: '#f97316', fontStyle: 'italic' }}>Library</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, lineHeight: 1.8, margin: '0 0 36px', maxWidth: 500 }}>
              Immerse yourself in thousands of years of sacred Hindu wisdom. From the Vedas to the Puranas — all in one place.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 28px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: '#f97316' }}>{BOOKS.length}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Scriptures</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 28px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: '#C9952A' }}>6</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Categories</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 28px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: '#22C55E' }}>Free</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>To Read</div>
              </div>
            </div>
          </div>

          {/* Featured book stack */}
          <div style={{ position: 'relative', width: 280, height: 320, flexShrink: 0 }}>
            {BOOKS.slice(0, 3).map((b, i) => (
              <div key={b.id} style={{ position: 'absolute', width: 180, height: 240, borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                transform: i === 0 ? 'rotate(-8deg) translate(-20px, 20px)' : i === 1 ? 'rotate(-2deg) translate(20px, 40px)' : 'rotate(6deg) translate(60px, 0px)',
                zIndex: 3 - i }}>
                <img src={b.cover} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${b.accent}88, transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '20px 64px', position: 'sticky', top: 64, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              style={{ background: 'rgba(0,0,0,0.05)', borderRadius: 100, padding: '8px 20px', fontSize: 14, fontWeight: 500, color: '#555' }}>
              {cat}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => {}}
              style={{ background: saved.length > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)', border: '1px solid ' + (saved.length > 0 ? 'rgba(239,68,68,0.3)' : 'transparent'), borderRadius: 100, padding: '8px 20px', fontSize: 14, fontWeight: 500, color: saved.length > 0 ? '#f87171' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Inter' }}>
              <i className="fas fa-heart me-2" style={{ fontSize: 12 }}></i>{saved.length} Saved
            </button>
          </div>
        </div>
      </div>

      {/* ── BOOKS GRID ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {filtered.map((book) => (
            <div key={book.id} className="book-card"
              onMouseEnter={() => setHoveredBook(book.id)}
              onMouseLeave={() => setHoveredBook(null)}
              onClick={() => openBook(book)}
              style={{ borderRadius: 20, overflow: 'hidden', background: '#fff', border: '1px solid rgba(255,255,255,0.07)', boxShadow: hoveredBook === book.id ? `0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px ${book.accent}44` : '0 8px 32px rgba(0,0,0,0.4)' }}>

              {/* Book cover image */}
              <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
                <img className="book-img" src={book.cover} alt={book.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, #16110A 0%, rgba(0,0,0,0.3) 50%, transparent 100%)` }} />
                {/* Accent top line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${book.accent}, transparent)` }} />

                {/* Save button */}
                <button className="save-btn" onClick={e => toggleSave(book.id, e)}
                  style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`${saved.includes(book.id) ? 'fas' : 'far'} fa-heart`}
                    style={{ color: saved.includes(book.id) ? '#f87171' : 'rgba(255,255,255,0.7)', fontSize: 15 }}></i>
                </button>

                {/* Category badge */}
                <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: `1px solid ${book.accent}44`, borderRadius: 100, padding: '4px 12px', fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                  {book.category}
                </div>
              </div>

              {/* Card content */}
              <div style={{ padding: '20px 22px 22px' }}>
                <div style={{ marginBottom: 14 }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#1A0F00', margin: '0 0 4px', lineHeight: 1.3 }}>{book.title}</h3>
                  <p style={{ color: '#f97316', fontSize: 12, fontWeight: 500, margin: '0 0 6px', fontStyle: 'italic' }}>{book.tagline}</p>
                  <p style={{ color: '#9B7355', fontSize: 12, margin: 0 }}>by {book.author}</p>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                  {book.tags.map(t => (
                    <span key={t} style={{ background: 'rgba(255,255,255,0.06)', color: '#6B7280', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 18, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1A0F00' }}>{book.chapters}</div>
                    <div style={{ fontSize: 11, color: '#9B7355' }}>Chapters</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1A0F00' }}>{book.verses.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: '#9B7355' }}>Verses</div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="read-btn"
                    onClick={e => { e.stopPropagation(); openBook(book); }}
                    style={{ flex: 1, background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <i className="fas fa-book-open" style={{ fontSize: 13 }}></i>Read Now
                  </button>
                  <button onClick={e => e.stopPropagation()}
                    style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: '11px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                    <i className="fas fa-download" style={{ fontSize: 13 }}></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SAVED SECTION ── */}
        {saved.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#1A0F00', margin: 0 }}>Saved Scriptures</h2>
              <span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', borderRadius: 100, padding: '4px 12px', fontSize: 13, fontWeight: 600 }}>{saved.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {BOOKS.filter(b => saved.includes(b.id)).map(book => (
                <div key={book.id} className="book-card"
                  onClick={() => openBook(book)}
                  style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                    <img className="book-img" src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #fff, transparent)' }} />
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: '#1A0F00', margin: '0 0 3px' }}>{book.title}</h3>
                    <p style={{ color: '#9B7355', fontSize: 12, margin: '0 0 12px' }}>by {book.author}</p>
                    <button className="read-btn"
                      style={{ width: '100%', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', borderRadius: 8, padding: '9px', fontSize: 13, fontWeight: 600 }}>
                      Read Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── READING MODAL ── */}
      {selectedBook && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(12px)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedBook(null); }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 920, maxHeight: '88vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 48px 120px rgba(0,0,0,0.8)', overflow: 'hidden' }}>

            {/* Modal header */}
            <div style={{ position: 'relative', padding: '0', height: 140, overflow: 'hidden', flexShrink: 0 }}>
              <img src={selectedBook.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${selectedBook.accent}44, transparent)` }} />
              <div style={{ position: 'absolute', inset: 0, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{selectedBook.category}</div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{selectedBook.title}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: 14 }}>by {selectedBook.author} · {selectedBook.verses.toLocaleString()} verses</p>
                </div>
                <button onClick={() => setSelectedBook(null)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 38, height: 38, color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Body: sidebar + content */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Chapter sidebar */}
              <div className="modal-scroll" style={{ width: 220, background: '#F3F4F6', borderRight: '1px solid rgba(0,0,0,0.08)', padding: '20px 12px', overflowY: 'auto', flexShrink: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9B7355', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, paddingLeft: 8 }}>Chapters</div>
                {selectedBook.preview.map((ch, i) => (
                  <button key={i} className={`ch-btn ${activeChapter === i ? 'active' : ''}`}
                    onClick={() => setActiveChapter(i)}
                    style={{ width: '100%', background: 'transparent', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', marginBottom: 4, color: '#555', border: '1px solid transparent' }}>
                    <div style={{ fontSize: 10, marginBottom: 3, opacity: 0.6 }}>Chapter {ch.ch}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, textAlign: 'left' }}>{ch.title}</div>
                  </button>
                ))}
                <div style={{ marginTop: 16, padding: '14px 12px', background: 'rgba(249,115,22,0.06)', borderRadius: 10, border: '1px solid rgba(249,115,22,0.12)' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>FULL BOOK</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f97316' }}>{selectedBook.chapters} chapters</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{selectedBook.verses.toLocaleString()} verses</div>
                </div>
              </div>

              {/* Reading area */}
              <div className="modal-scroll" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: '#fff' }}>
                {/* Description */}
                <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.12)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(249,115,22,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>About this Scripture</div>
                  <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{selectedBook.description}</p>
                </div>

                {/* Chapter content */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${selectedBook.accent}, ${selectedBook.accent}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {selectedBook.preview[activeChapter].ch}
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>
                    {selectedBook.preview[activeChapter].title}
                  </h3>
                </div>

                <p style={{ color: '#374151', fontSize: 16, lineHeight: 1.9, marginBottom: 32, borderLeft: `2px solid ${selectedBook.accent}66`, paddingLeft: 20, fontStyle: 'italic' }}>
                  {selectedBook.preview[activeChapter].text}
                </p>

                {/* Preview note */}
                <div style={{ background: 'rgba(249,115,22,0.04)', borderRadius: 12, padding: '20px', textAlign: 'center', border: '1px solid rgba(249,115,22,0.12)' }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>📖</div>
                  <p style={{ color: '#9B7355', fontSize: 14, margin: '0 0 16px' }}>Full content available for download as PDF</p>
                  <button style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}>
                    <i className="fas fa-download me-2"></i>Download Full PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#F3F4F6', display: 'flex', gap: 10, flexShrink: 0 }}>
              <button onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
                disabled={activeChapter === 0}
                style={{ background: '#fff', color: '#555', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: activeChapter === 0 ? 'not-allowed' : 'pointer', opacity: activeChapter === 0 ? 0.4 : 1, fontFamily: 'Inter' }}>
                <i className="fas fa-chevron-left me-1"></i>Prev
              </button>
              <button onClick={() => setActiveChapter(Math.min(selectedBook.preview.length - 1, activeChapter + 1))}
                disabled={activeChapter === selectedBook.preview.length - 1}
                style={{ background: '#fff', color: '#555', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: activeChapter === selectedBook.preview.length - 1 ? 'not-allowed' : 'pointer', opacity: activeChapter === selectedBook.preview.length - 1 ? 0.4 : 1, fontFamily: 'Inter' }}>
                Next <i className="fas fa-chevron-right ms-1"></i>
              </button>
              <button onClick={e => toggleSave(selectedBook.id, e)}
                style={{ background: saved.includes(selectedBook.id) ? 'rgba(239,68,68,0.1)' : '#fff', color: saved.includes(selectedBook.id) ? '#DC2626' : '#555', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}>
                <i className={`${saved.includes(selectedBook.id) ? 'fas' : 'far'} fa-heart me-1`}></i>
                {saved.includes(selectedBook.id) ? 'Saved' : 'Save'}
              </button>
              <button style={{ flex: 1, background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}>
                <i className="fas fa-download me-2"></i>Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}