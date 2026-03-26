import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── DESIGN TOKENS (Bahun.Com theme) ─────────────────────────────────── */
const T = {
  bg: '#FDFBF7',
  surface: '#F8F5F0',
  card: '#ffffff',
  gold: '#C9952A',
  goldDim: '#9B7355',
  orange: '#f97316',
  orangeDark: '#ea580c',
  dark: '#1A0F00',
  muted: '#9B7355',
  cream: '#2D1A00',
  line: 'rgba(249,115,22,0.15)',
  lineGold: 'rgba(201,149,42,0.2)',
};

/* ─── SVG ICON LIBRARY ───────────────────────────────────────────────── */
const Icon = ({ id, size = 16, color = T.orange, stroke = 1.5 }) => {
  const paths = {
    sun: (<><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /><line x1="4.22" y1="4.22" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.78" y2="19.78" /><line x1="4.22" y1="19.78" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.78" y2="4.22" /></>),
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
    star: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />,
    planet: (<><circle cx="12" cy="12" r="7" /><path d="M3 12c0-1.5 4-4 9-4s9 2.5 9 4-4 4-9 4-9-2.5-9-4z" opacity=".4" /></>),
    flame: <path d="M12 2c0 6-6 8-6 13a6 6 0 0 0 12 0c0-5-6-7-6-13zM9.5 16a2.5 2.5 0 0 0 5 0c0-2-2.5-3-2.5-5-.5 2-2.5 3-2.5 5z" />,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    work: (<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>),
    leaf: <path d="M2 22 17 7M17 7c2-3 5-5 5-5s-2 3-5 5M17 7s-1 4-4 6-8 3-11 9" />,
    back: (<><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>),
    grid: (<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>),
    eye: (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>),
    lotus: (<><path d="M12 22c0-5-4-8-4-12a4 4 0 0 1 8 0c0 4-4 7-4 12z" /><path d="M6 18c-2-2-2-5 0-7 1 2 3 4 6 5" /><path d="M18 18c2-2 2-5 0-7-1 2-3 4-6 5" /></>),
    sparkle: (<><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" /><path d="M5 16l.7 2.3L8 19l-2.3.7L5 22l-.7-2.3L2 19l2.3-.7z" opacity=".5" /><path d="M19 1l.5 1.5L21 3l-1.5.5L19 5l-.5-1.5L17 3l1.5-.5z" opacity=".5" /></>),
    ring: <circle cx="12" cy="12" r="9" />,
    arrow: (<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      {paths[id]}
    </svg>
  );
};

/* ─── ZODIAC DATA ─────────────────────────────────────────────────────── */
const ZODIAC = [
  { name: 'Aries',       sym: '♈', range: 'Mar 21–Apr 19', el: 'Fire',  lord: 'Mars',    col: '#C0392B', icon: 'flame',   nep: 'मेष' },
  { name: 'Taurus',      sym: '♉', range: 'Apr 20–May 20', el: 'Earth', lord: 'Venus',   col: '#27AE60', icon: 'lotus',   nep: 'वृष' },
  { name: 'Gemini',      sym: '♊', range: 'May 21–Jun 20', el: 'Air',   lord: 'Mercury', col: '#D4AC0D', icon: 'sparkle', nep: 'मिथुन' },
  { name: 'Cancer',      sym: '♋', range: 'Jun 21–Jul 22', el: 'Water', lord: 'Moon',    col: '#2471A3', icon: 'moon',    nep: 'कर्कट' },
  { name: 'Leo',         sym: '♌', range: 'Jul 23–Aug 22', el: 'Fire',  lord: 'Sun',     col: '#E67E22', icon: 'sun',     nep: 'सिंह' },
  { name: 'Virgo',       sym: '♍', range: 'Aug 23–Sep 22', el: 'Earth', lord: 'Mercury', col: '#229954', icon: 'leaf',    nep: 'कन्या' },
  { name: 'Libra',       sym: '♎', range: 'Sep 23–Oct 22', el: 'Air',   lord: 'Venus',   col: '#C0392B', icon: 'ring',    nep: 'तुला' },
  { name: 'Scorpio',     sym: '♏', range: 'Oct 23–Nov 21', el: 'Water', lord: 'Mars',    col: '#6C3483', icon: 'eye',     nep: 'वृश्चिक' },
  { name: 'Sagittarius', sym: '♐', range: 'Nov 22–Dec 21', el: 'Fire',  lord: 'Jupiter', col: '#884EA0', icon: 'flame',   nep: 'धनु' },
  { name: 'Capricorn',   sym: '♑', range: 'Dec 22–Jan 19', el: 'Earth', lord: 'Saturn',  col: '#2E4053', icon: 'star',    nep: 'मकर' },
  { name: 'Aquarius',    sym: '♒', range: 'Jan 20–Feb 18', el: 'Air',   lord: 'Saturn',  col: '#1F618D', icon: 'sparkle', nep: 'कुम्भ' },
  { name: 'Pisces',      sym: '♓', range: 'Feb 19–Mar 20', el: 'Water', lord: 'Jupiter', col: '#148F77', icon: 'lotus',   nep: 'मीन' },
];

/* ─── HOROSCOPE DATA ──────────────────────────────────────────────────── */
const HDATA = {
  Aries: { daily: { ov: 'Mars ignites your path. Step forward without hesitation — the cosmos rewards bold action today.', love: 'A spontaneous gesture will leave a lasting impression. Singles: someone fierce enters your orbit.', work: 'Leadership is yours to claim. A stalled project needs your fire to move again.', health: 'Channel your high energy into movement. Impulsiveness peaks — pause before you act.', lucky: ['3','7','21'], color: 'Crimson', mood: 'Bold' }, weekly: { ov: 'A week charged with momentum. Your confidence magnetizes people toward you effortlessly.', love: 'Deep conversations unlock new levels of closeness with your partner.', work: 'Mid-week brings an opening — seize it the moment you sense it.', health: 'Peak energy lands Tuesday to Thursday. Fill those hours with your hardest tasks.', lucky: ['1','9','18'], color: 'Scarlet', mood: 'Fierce' }, monthly: { ov: 'Jupiter turns favorable. Seeds planted months ago finally break through soil.', love: 'A new romantic chapter — or a decisive deepening — arrives under the new moon.', work: 'A salary conversation goes your way. Financial momentum builds.', health: 'Consistency is your power. Build habits that will carry you through winter.', lucky: ['3','12','27'], color: 'Orange', mood: 'Triumphant' } },
  Taurus: { daily: { ov: 'Venus wraps your day in beauty. Let creativity and financial clarity flow naturally.', love: 'Plan something intentional tonight. Romance rewards your effort.', work: 'Patience bears visible fruit. A long project shows real movement.', health: 'Your body craves restoration. Nourish it slowly, beautifully.', lucky: ['2','6','15'], color: 'Emerald', mood: 'Serene' }, weekly: { ov: 'Stability and quiet growth. What you build this week will last.', love: 'Sensual energy surrounds you — express affection through touch and presence.', work: 'Review your finances now. The structure you create today protects next year.', health: 'Walk in nature. Tend something growing. Your spirit knows what it needs.', lucky: ['4','8','22'], color: 'Forest', mood: 'Grounded' }, monthly: { ov: 'Venus and Jupiter cooperate. Both love and material abundance answer your patience.', love: 'Old bonds deepen. New ones form around shared values.', work: 'A significant opportunity appears. Trust your instinct.', health: 'Routine is medicine. Anchor your sleep and meals and everything else follows.', lucky: ['6','11','20'], color: 'Gold', mood: 'Abundant' } },
  Gemini: { daily: { ov: 'Mercury sharpens every thought. Words come easily — use them to create, not just converse.', love: 'Wit wins hearts today. Be open, be playful, be present.', work: 'Speak up in the meeting. Your idea lands better than you expect.', health: 'Mind runs fast today. Wind it down deliberately this evening.', lucky: ['5','14','23'], color: 'Amber', mood: 'Electric' }, weekly: { ov: 'Ideas and connections flow like water. Stay adaptable — the best path shifts.', love: 'Interesting people enter your circle. Enjoy the options without rushing.', work: 'Networking — online or in person — opens unexpected doors.', health: 'Short walks and slow breathing balance your restless nervous system.', lucky: ['3','7','16'], color: 'Sky', mood: 'Curious' }, monthly: { ov: 'Your words carry unusual power. A month for learning, speaking, and expanding.', love: 'Communication IS the relationship this month. Listen as deeply as you speak.', work: 'Writing, teaching, presenting — any of these could bring real recognition.', health: 'Arms and shoulders need attention. Stretch consciously and rest often.', lucky: ['5','9','18'], color: 'Lavender', mood: 'Inspired' } },
  Cancer: { daily: { ov: 'The Moon pulls you inward. Your intuition is sharper than any analysis today.', love: 'Create a quiet, intimate moment. Your presence is the gift.', work: 'Empathy solves what logic cannot. You see what others have missed.', health: 'Hydrate. Eat slowly. Let your body catch up to your emotions.', lucky: ['2','7','11'], color: 'Silver', mood: 'Intuitive' }, weekly: { ov: 'Home and family take center stage. Domestic clarity brings unexpected peace.', love: 'Shared vulnerability draws you closer than any grand gesture could.', work: 'Memory and detail are your edges this week. Colleagues notice.', health: 'Digestive health needs care. Slow meals and calm evenings restore you.', lucky: ['4','13','22'], color: 'Pearl', mood: 'Tender' }, monthly: { ov: 'A deeply healing month. Old wounds finally close under this quiet sky.', love: 'A milestone arrives in your relationship. Meet it with open hands.', work: 'Lead with empathy, memory, and patience. Those are your real strengths.', health: 'Rest is not laziness. Schedule it like a meeting you cannot cancel.', lucky: ['2','16','29'], color: 'Moonstone', mood: 'Healing' } },
  Leo: { daily: { ov: 'The Sun amplifies everything that makes you magnetic. You are impossible to ignore.', love: 'Warmth is your love language. Give it extravagantly.', work: 'Step into the front. Leadership offered today leads somewhere worth going.', health: 'Heart and spine need attention. Stand tall. Move with intention.', lucky: ['1','5','19'], color: 'Gold', mood: 'Radiant' }, weekly: { ov: 'Your star power is simply undeniable. Others look to you for direction.', love: 'Grand gestures are favored. Do not hold back your affection.', work: 'A presentation or performance earns you the recognition you deserve.', health: 'Back and posture need care. Core work pays dividends beyond the physical.', lucky: ['3','10','21'], color: 'Amber', mood: 'Majestic' }, monthly: { ov: 'A royal month. Every effort you have made is becoming visible reward.', love: 'Romance blazes bright whether single or partnered.', work: 'Promotions, awards, visibility — this month delivers.', health: 'Sleep schedules and outdoor time are the pillars of your energy now.', lucky: ['1','9','28'], color: 'Copper', mood: 'Sovereign' } },
  Virgo: { daily: { ov: 'Mercury sharpens your eye. Precision and care bring results no one else achieves.', love: 'Small acts of service mean everything. Your partner feels deeply seen.', work: 'You catch the error no one else caught. You save more than you know.', health: 'Digestion is strong. Support it with clean food and unhurried meals.', lucky: ['6','14','23'], color: 'Sage', mood: 'Precise' }, weekly: { ov: 'A week for refinement. The smallest adjustments create the biggest improvements.', love: 'Future-facing conversations bring clarity and closeness.', work: 'Systems you improve this week save months of time ahead.', health: 'Consistency is your superpower. Lock in sleep, food, and movement.', lucky: ['5','11','20'], color: 'Ivory', mood: 'Diligent' }, monthly: { ov: 'Mastery arrives this month. Discipline has compounded into something real.', love: 'Relationships rooted in respect flourish without effort.', work: 'A detailed project earns professional recognition that surprises you.', health: 'Mental health deserves as much tending as physical. Journal. Breathe.', lucky: ['4','17','26'], color: 'Moss', mood: 'Accomplished' } },
  Libra: { daily: { ov: 'Venus brings perfect balance. Beauty, fairness, and harmony align in your favor.', love: 'Your charm today is disarming. A deepening or new encounter is likely.', work: 'You resolve the conflict that has been slowing everything down.', health: 'Balance is literal: rest as much as you move, solitude as much as company.', lucky: ['6','15','24'], color: 'Rose', mood: 'Harmonious' }, weekly: { ov: 'Partnerships and social connections bring both joy and real opportunity.', love: 'A conversation about the future arises. Speak from the deepest part of yourself.', work: 'Collaboration is your edge. You see all sides and create breakthroughs.', health: 'Lower back and kidneys need gentle attention. Hydrate more than you think.', lucky: ['3','9','18'], color: 'Blush', mood: 'Balanced' }, monthly: { ov: 'Your social and artistic star peaks this month.', love: 'A major milestone — commitment, proposal, or declaration — arrives.', work: 'Your reputation for elegance and fairness opens important doors.', health: 'Beauty rituals are not vanity. They are medicine for a Libran soul.', lucky: ['6','15','24'], color: 'Petal', mood: 'Flourishing' } },
  Scorpio: { daily: { ov: 'Pluto heightens your perception. You see truths hidden from everyone else.', love: 'Vulnerability is the door. Trust your partner enough to open it.', work: 'Instinct leads you to something important. Follow it completely.', health: 'Intense emotion needs physical release. Let exercise be your alchemy.', lucky: ['8','11','22'], color: 'Obsidian', mood: 'Intense' }, weekly: { ov: 'Transformation and revelation define this week. What was hidden comes to light.', love: 'Emotional intimacy reaches a depth you did not expect possible.', work: 'Research and investigation deliver critical information for a major decision.', health: 'Detox — physical and emotional — supports everything else now.', lucky: ['4','13','21'], color: 'Crimson', mood: 'Transforming' }, monthly: { ov: 'Rebirth. What ends this month makes space for something extraordinary.', love: 'A relationship either breaks through or breaks. Both are gifts.', work: 'Power and influence grow. Behind-the-scenes effort finally pays.', health: 'Immune and rest are your medicine this month. Take them seriously.', lucky: ['8','17','26'], color: 'Burgundy', mood: 'Powerful' } },
  Sagittarius: { daily: { ov: 'Jupiter opens every horizon. Adventure, learning, and optimism are your superpowers.', love: 'Laughter is its own form of love. Plan something spontaneous.', work: 'Cross-cultural connections bring an unexpected opportunity.', health: 'Nature restores you completely. Seek it out.', lucky: ['3','9','27'], color: 'Violet', mood: 'Free' }, weekly: { ov: 'Expansion in every direction. Travel, knowledge, and growth accelerate in parallel.', love: 'Someone who matches your adventure brings deep joy this week.', work: 'Higher education, publishing, or international work opens its door.', health: 'Hips and thighs need stretching. Yoga pays off for you specifically.', lucky: ['5','14','22'], color: 'Teal', mood: 'Expansive' }, monthly: { ov: 'Philosophy, travel, higher understanding. Your worldview widens dramatically.', love: 'Long-distance romance or meeting someone entirely different is strongly favored.', work: 'Publishing, teaching, or founding something new — all supported.', health: 'Nature retreats recharge your spirit more than anything else this month.', lucky: ['3','12','21'], color: 'Indigo', mood: 'Soaring' } },
  Capricorn: { daily: { ov: 'Saturn rewards your discipline. Every hour of hard work is becoming a visible result.', love: 'Actions over words. Stability is your love language today.', work: 'A senior figure notices your reliability. Advancement is close.', health: 'Bones and joints need care. Gentle stretching and calcium protect you.', lucky: ['4','8','13'], color: 'Slate', mood: 'Steady' }, weekly: { ov: 'Professional achievement and personal responsibility bring rare satisfaction.', love: 'Building a future together is the theme. Brick by brick.', work: 'Additional responsibility this week translates to reward next month.', health: 'Consistent sleep and structured meals are the engine of your output.', lucky: ['2','10','19'], color: 'Stone', mood: 'Resolute' }, monthly: { ov: 'A landmark career month. Everything you have built is now paying returns.', love: 'Commitment deepens. Maturity and mutual respect reach a new level.', work: 'Recognition arrives. Public acknowledgment of long private effort.', health: 'Dental and skeletal health deserve a check. Prevention over cure.', lucky: ['4','13','22'], color: 'Charcoal', mood: 'Achieving' } },
  Aquarius: { daily: { ov: 'Uranus sparks pure innovation. Your ideas today are ahead of everyone in the room.', love: 'Mental connection is as intimate as physical for you. Share what is in your mind.', work: 'A single idea you present changes how the team sees the whole problem.', health: 'Circulation and nervous system: gentle movement and fresh air are the remedy.', lucky: ['7','11','29'], color: 'Cobalt', mood: 'Visionary' }, weekly: { ov: 'Groundbreaking ideas and causes you believe in energize everything you touch.', love: 'A friendship becomes something deeper and more lasting.', work: 'Technology and social innovation projects see real breakthroughs.', health: 'Group fitness or team sports bring body benefits and genuine connection.', lucky: ['4','11','22'], color: 'Electric', mood: 'Revolutionary' }, monthly: { ov: 'A month of vision and collective impact. Your ideas reach further than ever.', love: 'An unconventional romantic connection surprises and delights you.', work: 'Pioneering work earns unexpected recognition beyond your usual circle.', health: 'Mental health flourishes with intellectual challenge, creation, community.', lucky: ['7','16','25'], color: 'Silver', mood: 'Transcendent' } },
  Pisces: { daily: { ov: 'Neptune opens every creative and spiritual channel. Dreams and intuition flood in.', love: 'Your empathy creates intimacy that most people never find. Your partner feels it.', work: 'Creative solutions to practical problems leave everyone quietly amazed.', health: 'Water and sleep are not luxuries — they are structure for you.', lucky: ['2','7','12'], color: 'Aqua', mood: 'Dreaming' }, weekly: { ov: 'Spiritual and creative energies run extraordinarily high this week.', love: 'A soulmate connection — or its deepening — is within reach.', work: 'Creative work receives support and appreciation that surprises you.', health: 'Feet and immune system need care. Rest and water are still the answer.', lucky: ['3','9','18'], color: 'Seafoam', mood: 'Mystical' }, monthly: { ov: 'A sacred month. Your connection to what is beyond the ordinary deepens.', love: 'A soul-level connection transforms your understanding of what love is.', work: 'Compassion and creativity open professional doors that logic never could.', health: 'Meditation, yoga, prayer — spiritual practice is literally healing you now.', lucky: ['2','11','20'], color: 'Ocean', mood: 'Transcendent' } },
};

const RASHIFAL = {
  Aries: { year: '2082 B.S. brings significant transformation for Mesh rashi. Saturn\'s transit through your 10th house brings career advancement after initial delays. Jupiter supports financial growth mid-year. Be cautious in partnerships around Ashadh. Your natural leadership will be tested and refined.', gem: 'Red Coral', deity: 'Lord Hanuman', fasting: 'Tuesday', favorable: 'Tuesday, Saturday', color: 'Red & Gold' },
  Taurus: { year: 'Vrishabha rashi enjoys Venus\'s blessing through most of 2082. Domestic happiness peaks around Shrawan. A property-related decision proves wise. Romance flourishes for singles in Chaitra. Saturn demands patience in career but rewards those who persist quietly.', gem: 'Diamond / White Sapphire', deity: 'Goddess Lakshmi', fasting: 'Friday', favorable: 'Friday, Wednesday', color: 'White & Green' },
  Gemini: { year: 'Mithuna rashi faces Mercury\'s dual influence — sharp intellect paired with restless energy. Business communication brings unexpected opportunities in Baisakh. Avoid signing contracts in Falgun. Travel expands both mind and income. A sibling or close friend plays a pivotal role.', gem: 'Emerald', deity: 'Lord Vishnu', fasting: 'Wednesday', favorable: 'Wednesday, Monday', color: 'Green & Yellow' },
  Cancer: { year: 'Karka rashi experiences deep emotional evolution in 2082. Moon\'s influence intensifies family bonds — both joys and tensions. A property or home matter resolves favorably by Ashwin. Career requires patience through Baisakh-Jestha. Your intuitive gifts open spiritual doors.', gem: 'Pearl / Moonstone', deity: 'Goddess Durga', fasting: 'Monday', favorable: 'Monday, Thursday', color: 'White & Silver' },
  Leo: { year: 'Simha rashi commands attention throughout 2082. Sun\'s strength brings public recognition around Shrawan-Bhadra. Political, administrative, or creative fields see advancement. A romantic relationship reaches a decisive milestone. Health requires attention in Chaitra — rest is not weakness.', gem: 'Ruby', deity: 'Lord Shiva', fasting: 'Sunday', favorable: 'Sunday, Tuesday', color: 'Gold & Orange' },
  Virgo: { year: 'Kanya rashi sees Mercury\'s precision rewarded this year. Professional growth comes through mastery rather than opportunity. A health routine established in Baisakh transforms your wellbeing by year\'s end. Relationships deepen through honest, careful communication. Avoid overthinking decisions in Poush.', gem: 'Emerald / Green Tourmaline', deity: 'Goddess Saraswati', fasting: 'Wednesday', favorable: 'Wednesday, Friday', color: 'Navy & Green' },
  Libra: { year: 'Tula rashi finds Venus bringing artistic and romantic blessings. Partnerships — business and personal — prove fruitful when chosen wisely. A legal or financial matter resolves by Ashadh. Creative ventures receive public appreciation. Saturn asks you to choose depth over breadth this year.', gem: 'Diamond / Opal', deity: 'Goddess Lakshmi', fasting: 'Friday', favorable: 'Friday, Saturday', color: 'Pink & Sky Blue' },
  Scorpio: { year: 'Vrishchika rashi undergoes profound internal transformation in 2082. Mars and Ketu demand that you release what no longer serves. Hidden resources surface mid-year. Deep research or investigation leads to important discovery. Relationships either solidify completely or end with clarity — both are liberation.', gem: 'Red Coral / Hessonite', deity: 'Lord Bhairav', fasting: 'Tuesday', favorable: 'Tuesday, Monday', color: 'Dark Red & Black' },
  Sagittarius: { year: 'Dhanu rashi expands under Jupiter\'s direct gaze through most of 2082. Higher education, publishing, and travel all receive cosmic support. A teacher or guru figure plays a transformative role. Income from foreign sources or distant places grows. Maintain philosophical balance when Saturn tests your idealism.', gem: 'Yellow Sapphire', deity: 'Lord Dattatreya', fasting: 'Thursday', favorable: 'Thursday, Sunday', color: 'Purple & Gold' },
  Capricorn: { year: 'Makara rashi experiences Saturn\'s full authority this year — your own ruling planet demands disciplined elevation. Career recognition comes but requires more sustained effort. Avoid shortcuts in Falgun-Chaitra. Family responsibilities increase and are met with your characteristic steadiness. Financial prudence now builds a decade of security.', gem: 'Blue Sapphire / Amethyst', deity: 'Lord Shani', fasting: 'Saturday', favorable: 'Saturday, Friday', color: 'Black & Navy' },
  Aquarius: { year: 'Kumbha rashi receives Uranus and Saturn\'s combined influence — innovation meets discipline. A technological or social project finds traction and recognition. Unconventional relationships or unusual opportunities prove genuine. The collective good and personal ambition align unusually well this year. Trust your original vision.', gem: 'Blue Sapphire / Amethyst', deity: 'Lord Vishnu', fasting: 'Saturday', favorable: 'Saturday, Wednesday', color: 'Electric Blue & Silver' },
  Pisces: { year: 'Meena rashi deepens spiritually throughout 2082. Neptune and Jupiter open inner doors that outer effort cannot. Creative and healing vocations are especially blessed. A period of retreat or solitude around Poush-Magh proves profoundly clarifying. Love based in soul-level recognition arrives for those ready to receive it.', gem: 'Yellow Sapphire / Pearl', deity: 'Lord Vishnu', fasting: 'Thursday', favorable: 'Thursday, Monday', color: 'Sea Green & White' },
};

/* ─── KUNDALI ENGINE ───────────────────────────────────────────────────── */
const LAHIRI = 23.85;
const PMETA = [
  { id: 'su', name: 'Sun',     sym: '☉', col: '#E67E22' },
  { id: 'mo', name: 'Moon',    sym: '☽', col: '#2471A3' },
  { id: 'ma', name: 'Mars',    sym: '♂', col: '#C0392B' },
  { id: 'me', name: 'Mercury', sym: '☿', col: '#27AE60' },
  { id: 'ju', name: 'Jupiter', sym: '♃', col: '#C9952A' },
  { id: 've', name: 'Venus',   sym: '♀', col: '#E91E8C' },
  { id: 'sa', name: 'Saturn',  sym: '♄', col: '#6C7A89' },
  { id: 'ra', name: 'Rahu',    sym: '☊', col: '#8E44AD' },
  { id: 'ke', name: 'Ketu',    sym: '☋', col: '#9B7355' },
];
const RS  = ['Ar','Ta','Ge','Ca','Le','Vi','Li','Sc','Sa','Cp','Aq','Pi'];
const RF  = ['Mesh','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena'];
const NK  = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
const NL  = ['Ke','Ve','Su','Mo','Ma','Ra','Ju','Sa','Me','Ke','Ve','Su','Mo','Ma','Ra','Ju','Sa','Me','Ke','Ve','Su','Mo','Ma','Ra','Ju','Sa','Me'];
const DY  = { Su:6, Mo:10, Ma:7, Ra:18, Ju:16, Sa:19, Me:17, Ke:7, Ve:20 };
const DO  = ['Ke','Ve','Su','Mo','Ma','Ra','Ju','Sa','Me'];
const DN  = { Su:'Sun', Mo:'Moon', Ma:'Mars', Ra:'Rahu', Ju:'Jupiter', Sa:'Saturn', Me:'Mercury', Ke:'Ketu', Ve:'Venus' };
const EX  = { su:0, mo:1, ma:9, me:5, ju:3, ve:11, sa:6 };
const DB  = { su:6, mo:7, ma:3, me:11, ju:9, ve:5, sa:0 };
const CITIES = { kathmandu:[27.7,85.3], pokhara:[28.2,84.0], lalitpur:[27.7,85.3], delhi:[28.6,77.2], mumbai:[19.1,72.9], kolkata:[22.6,88.4], london:[51.5,-0.1], 'new york':[40.7,-74.0] };

function jd(y,m,d,h){if(m<=2){y--;m+=12;}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+h/24+B-1524.5;}
function n360(x){return((x%360)+360)%360;}
function sid(x){return n360(x-LAHIRI);}
function ri(d){return Math.floor(n360(d)/30);}
function di(d){return(n360(d)%30).toFixed(1);}
function coords(pob){const k=pob.toLowerCase().split(',')[0].trim();return CITIES[k]||[27.7,85.3];}
function navOf(d){return(ri(d)*9+Math.floor((n360(d)%30)/3.3334))%12;}
function getNak(d){const i=Math.floor(n360(d)/13.3333)%27;return{name:NK[i],pada:Math.floor((n360(d)%13.3333)/3.3334)+1,lord:NL[i]};}
function calcPlanets(y,m,d,h,tz){const ut=h-tz,J=jd(y,m,d,ut),T=(J-2451545)/36525;const r={su:n360(280.46646+36000.76983*T),mo:n360(218.3165+481267.881*T),ma:n360(355.433+19141.6964*T),me:n360(252.2509+149472.6749*T),ju:n360(34.351+3034.9057*T),ve:n360(181.9798+58517.8156*T),sa:n360(50.0774+1222.1138*T),ra:n360(125.0445-1934.1362*T)};const Ms=((357.5291+35999.0503*T)*Math.PI)/180;r.su=n360(r.su+1.9146*Math.sin(Ms)+0.02*Math.sin(2*Ms));const Mm=((134.9634+477198.8676*T)*Math.PI)/180,Ds=((280.46646+36000.76983*T)*Math.PI)/180;r.mo=n360(r.mo+6.289*Math.sin(Mm)-1.274*Math.sin(2*Ds-Mm));r.ke=n360(r.ra+180);const s={};for(const p in r)s[p]=sid(r[p]);return s;}
function calcLagna(y,m,d,h,tz,lat,lon){const ut=h-tz,J=jd(y,m,d,ut),T=(J-2451545)/36525;const GMST=n360(280.46061837+360.98564736629*(J-2451545)),LST=n360(GMST+lon);const ob=((23.4393-0.013*T)*Math.PI)/180,LR=(LST*Math.PI)/180,laR=(lat*Math.PI)/180;const asc=(Math.atan2(Math.cos(LR),-(Math.sin(LR)*Math.cos(ob)+Math.tan(laR)*Math.sin(ob)))*180)/Math.PI;return sid(n360(asc));}
function calcDashas(moonDeg,dob){const nak=getNak(moonDeg),lord=nak.lord,total=DY[lord];const rem=(1-(n360(moonDeg)%13.3333)/13.3333)*total;const si=DO.indexOf(lord);const das=[];let cur=new Date(dob);for(let i=0;i<9;i++){const pl=DO[(si+i)%9],yrs=i===0?rem:DY[pl],end=new Date(cur.getTime()+yrs*365.25*86400000);das.push({planet:pl,years:DY[pl],dur:+yrs.toFixed(1),start:new Date(cur),end});cur=new Date(end);}return das;}
function fmtD(d){return d.getFullYear()+'/'+(d.getMonth()+1).toString().padStart(2,'0');}
function yogas(p,ls){const y=[];const mo=ri(p.mo),su=ri(p.su),ju=ri(p.ju),ve=ri(p.ve);if([0,3,6,9].includes((mo-ju+12)%12))y.push('Gaja Kesari');if(su===ri(p.me))y.push('Budhaditya');if([1,6,11].includes(ve))y.push('Malavya');if([8,11,3].includes(ju))y.push('Hamsa');y.push('Raj Yoga');return y.slice(0,4);}

function buildKundali(form){
  const [y,m,d]=form.dob.split('-').map(Number),[hr,mn]=form.tob.split(':').map(Number);
  const h=hr+mn/60,tz=parseFloat(form.tz)||5.75,[lat,lon]=coords(form.pob);
  const P=calcPlanets(y,m,d,h,tz),L=calcLagna(y,m,d,h,tz,lat,lon),ls=ri(L);
  const PL=['su','mo','ma','me','ju','ve','sa','ra','ke'];
  const houses=Array.from({length:12},(_,i)=>({house:i+1,rashi:(ls+i)%12,planets:[]}));
  PL.forEach(pid=>{const ps=ri(P[pid]),hi=(ps-ls+12)%12;const mt=PMETA.find(p=>p.id===pid);houses[hi].planets.push({...mt,deg:P[pid],rashi:ps});});
  const navL=navOf(L);
  const navH=Array.from({length:12},(_,i)=>({house:i+1,rashi:(navL+i)%12,planets:[]}));
  PL.forEach(pid=>{const ns=navOf(P[pid]),hi=(ns-navL+12)%12;const mt=PMETA.find(p=>p.id===pid);navH[hi].planets.push({...mt,rashi:ns});});
  const moonNak=getNak(P.mo),dashas=calcDashas(P.mo,new Date(form.dob));
  const curDasha=dashas.find(d=>new Date()>=d.start&&new Date()<d.end)||dashas[0];
  const yg=yogas(P,ls);
  const rows=PL.map(pid=>{const mt=PMETA.find(p=>p.id===pid),deg=P[pid],rs=ri(deg),nak=getNak(deg),house=((rs-ls+12)%12)+1,st=EX[pid]===rs?'Exalted':DB[pid]===rs?'Debilited':'';return{...mt,deg,rs,nak,house,st};});
  return{ls,lagna:L,houses,navH,navL,moonNak,dashas,curDasha,yogas:yg,rows,lagnaFull:RF[ls],moRashi:RF[ri(P.mo)],suRashi:RF[ri(P.su)]};
}

/* ─── KUNDALI SVG ───────────────────────────────────────────────────────── */
function KundaliSVG({ houses, size = 290 }) {
  const S=size,M=S*0.04,W=S-2*M,Q=W/4;
  const x0=M,x1=M+Q,x2=M+2*Q,x3=M+3*Q,x4=M+4*Q;
  const y0=M,y1=M+Q,y2=M+2*Q,y3=M+3*Q,y4=M+4*Q;
  const polys=[`${x2},${y1} ${x3},${y2} ${x2},${y3} ${x1},${y2}`,`${x2},${y0} ${x4},${y0} ${x3},${y2} ${x2},${y1}`,`${x3},${y0} ${x4},${y0} ${x4},${y1}`,`${x4},${y0} ${x4},${y2} ${x3},${y2}`,`${x4},${y2} ${x4},${y4} ${x3},${y2}`,`${x4},${y4} ${x2},${y4} ${x3},${y2}`,`${x2},${y3} ${x3},${y2} ${x2},${y4} ${x1},${y4}`,`${x0},${y4} ${x2},${y4} ${x1},${y2}`,`${x0},${y2} ${x0},${y4} ${x1},${y2}`,`${x0},${y0} ${x0},${y2} ${x1},${y2}`,`${x0},${y0} ${x1},${y0} ${x1},${y2}`,`${x0},${y0} ${x2},${y0} ${x1},${y2} ${x2},${y1}`];
  const ctrs=[{x:x2,y:y2},{x:(x2+x4)/2,y:y0+Q*0.65},{x:x4-Q*0.28,y:y0+Q*0.45},{x:x4-Q*0.32,y:y2},{x:x4-Q*0.28,y:y4-Q*0.45},{x:(x2+x4)/2,y:y4-Q*0.65},{x:x2,y:y4-Q*0.35},{x:(x0+x2)/2,y:y4-Q*0.65},{x:x0+Q*0.28,y:y4-Q*0.45},{x:x0+Q*0.32,y:y2},{x:x0+Q*0.28,y:y0+Q*0.45},{x:(x0+x2)/2,y:y0+Q*0.65}];
  const fs=Math.max(6.5,S/42),fsn=Math.max(5.5,S/52),fsp=Math.max(5,S/54);
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} xmlns="http://www.w3.org/2000/svg" style={{display:'block',maxWidth:'100%'}}>
      <rect x={M} y={M} width={W} height={W} fill="none" stroke={T.orange} strokeWidth="1" opacity=".3"/>
      {[[x0,y0,x4,y4],[x4,y0,x0,y4],[x2,y0,x0,y2],[x2,y0,x4,y2],[x2,y4,x0,y2],[x2,y4,x4,y2],[x2,y1,x1,y2],[x2,y1,x3,y2],[x2,y3,x1,y2],[x2,y3,x3,y2]].map(([ax,ay,bx,by],i)=>(
        <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={T.orange} strokeWidth={i<2?'0.8':'0.4'} opacity={i<2?'.25':'.15'}/>
      ))}
      {houses.map((h,i)=>{
        const isL=h.house===1;
        return (<g key={i}>
          <polygon points={polys[i]} fill={isL?'rgba(249,115,22,0.06)':'transparent'} stroke={T.orange} strokeWidth=".4" opacity=".6"/>
          {isL&&<text x={ctrs[i].x} y={ctrs[i].y-fs*1.8} textAnchor="middle" fontSize={fsn} fill={T.orange} fontFamily="serif" fontWeight="700" opacity=".9">Lagna</text>}
          <text x={ctrs[i].x} y={ctrs[i].y-fs*0.4} textAnchor="middle" fontSize={fsn} fill={T.goldDim} fontFamily="serif">{h.house}</text>
          <text x={ctrs[i].x} y={ctrs[i].y+fs*0.5} textAnchor="middle" fontSize={fs} fill={T.dark} fontFamily="serif">{RS[h.rashi]}</text>
          {h.planets.map((p,pi)=>(
            <text key={pi} x={ctrs[i].x} y={ctrs[i].y+fs*0.5+fsp*(pi+1)*1.2} textAnchor="middle" fontSize={fsp} fill={p.col} fontFamily="serif" fontWeight="bold">{p.sym}</text>
          ))}
        </g>);
      })}
      <text x={x2} y={y2+fs*0.3} textAnchor="middle" dominantBaseline="middle" fontSize={fs*0.9} fill={T.orange} fontFamily="serif" opacity=".25">ॐ</text>
    </svg>
  );
}

/* ─── MANDALA ─────────────────────────────────────────────────────────── */
function Mandala({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ animation: 'slowSpin 30s linear infinite', display: 'block' }}>
      <circle cx="60" cy="60" r="55" fill="none" stroke={T.orange} strokeWidth=".8" opacity=".2"/>
      <circle cx="60" cy="60" r="40" fill="none" stroke={T.orange} strokeWidth=".6" opacity=".15"/>
      {Array.from({length:12},(_,i)=>{const a=(i*30*Math.PI)/180,x1=60+40*Math.cos(a),y1=60+40*Math.sin(a),x2=60+55*Math.cos(a),y2=60+55*Math.sin(a);return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.orange} strokeWidth=".5" opacity=".15"/>;})}
      {Array.from({length:8},(_,i)=>{const a=(i*45*Math.PI)/180,x=60+40*Math.cos(a),y=60+40*Math.sin(a);return <circle key={i} cx={x} cy={y} r="2" fill="none" stroke={T.orange} strokeWidth=".6" opacity=".25"/>;})}
      <text x="60" y="68" textAnchor="middle" fontSize="24" fill={T.orange} fontFamily="serif" opacity=".5">ॐ</text>
    </svg>
  );
}

export default function Horoscope() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('horoscope');
  const [sign, setSign] = useState('Aries');
  const [period, setPeriod] = useState('daily');
  const [subTab, setSubTab] = useState('reading');
  const [form, setForm] = useState({ name: '', dob: '', tob: '', pob: 'Kathmandu, Nepal', gender: '', tz: '5.75' });
  const [kundali, setKundali] = useState(null);
  const [loading, setLoading] = useState(false);

  const Z = ZODIAC.find(z => z.name === sign);
  const HD = HDATA[sign]?.[period];
  const RF2 = RASHIFAL[sign];

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      try { setKundali({ ...buildKundali(form), form }); }
      catch (err) { alert('Error: ' + err.message); }
      setLoading(false);
    }, 1800);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');
    @keyframes slowSpin{to{transform:rotate(360deg)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
    .fade-up{animation:fadeUp .5s ease both}
    .sign-btn{background:transparent;border:none;cursor:pointer;transition:all .25s ease;font-family:'Inter',sans-serif}
    .sign-btn:hover .sign-inner{border-color:rgba(249,115,22,0.4);background:rgba(249,115,22,0.04)}
    .sign-btn.active .sign-inner{border-color:#f97316;background:rgba(249,115,22,0.08)}
    .sign-btn.active .sign-sym{color:#f97316}
    .period-btn{background:transparent;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;padding:10px 22px;color:#9B7355;border-bottom:2px solid transparent;transition:all .2s ease}
    .period-btn.active{color:#f97316;border-bottom-color:#f97316}
    .tab-btn{background:transparent;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:#9B7355;padding:12px 28px;transition:all .2s ease;position:relative;letter-spacing:.04em}
    .tab-btn::after{content:'';position:absolute;bottom:0;left:50%;right:50%;height:2px;background:#f97316;transition:all .3s ease}
    .tab-btn.active{color:#f97316}
    .tab-btn.active::after{left:16%;right:16%}
    .sub-btn{background:transparent;border:1px solid rgba(0,0,0,0.1);cursor:pointer;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;color:#9B7355;padding:7px 18px;border-radius:20px;transition:all .2s ease}
    .sub-btn.active{color:#f97316;border-color:#f97316;background:rgba(249,115,22,0.06)}
    .form-in{background:transparent;border:none;border-bottom:1.5px solid rgba(0,0,0,0.1);color:#1A0F00;font-family:'Inter',sans-serif;font-size:15px;padding:10px 0;width:100%;transition:border-color .2s ease;outline:none}
    .form-in:focus{border-bottom-color:#f97316}
    .form-in::placeholder{color:#9B7355;font-style:italic}
    .gender-btn{background:transparent;border:1.5px solid rgba(0,0,0,0.1);border-radius:8px;color:#9B7355;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;padding:9px 0;cursor:pointer;transition:all .2s ease;flex:1}
    .gender-btn.active{border-color:#f97316;color:#f97316;background:rgba(249,115,22,0.06)}
    .main-btn{width:100%;background:linear-gradient(135deg,#f97316,#ea580c);border:none;color:#fff;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;padding:14px;cursor:pointer;border-radius:12px;margin-top:8px;transition:all .2s ease}
    .main-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(249,115,22,0.35)}
    .main-btn:disabled{opacity:.4;cursor:not-allowed}
    .planet-row{border-bottom:1px solid rgba(0,0,0,0.05);transition:background .15s}
    .planet-row:hover{background:rgba(249,115,22,0.03)}
    .dasha-card{border:1px solid rgba(0,0,0,0.06);border-radius:12px;padding:14px;transition:all .2s}
    .dasha-card.active-dasha{border-color:rgba(249,115,22,0.35);background:rgba(249,115,22,0.04)}
    .scroll-x{overflow-x:auto;-webkit-overflow-scrolling:touch}
  `;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Inter',sans-serif", paddingTop: 64 }}>
      <style>{css}</style>

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(135deg,#1A0F00 0%,#2D1A00 50%,#1A0F00 100%)', padding: '64px 48px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.08),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: 60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(201,149,42,0.06),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Mandala size={80} /></div>
        <div style={{ fontSize: 11, fontFamily: "'Inter',sans-serif", letterSpacing: '.18em', color: 'rgba(249,115,22,0.7)', marginBottom: 12, textTransform: 'uppercase' }}>Vedic Astrology · Jyotish</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(36px,5vw,58px)', fontWeight: 700, color: '#fff', margin: '0 0 12px', lineHeight: 1.1 }}>
          Rashifal & <em style={{ color: '#f97316', fontStyle: 'italic' }}>Kundali</em>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.7, fontWeight: 300 }}>
          Your birth chart and cosmic guidance, rooted in ancient Vedic wisdom
        </p>
        <div style={{ display: 'inline-flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {[{k:'horoscope',l:'Horoscope'},{k:'kundali',l:'Kundali'}].map(({k,l}) => (
            <button key={k} className={`tab-btn ${tab===k?'active':''}`} onClick={() => setTab(k)}
              style={{ color: tab===k ? '#f97316' : 'rgba(255,255,255,0.5)' }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 32px' }}>

        {/* ══ HOROSCOPE TAB ══ */}
        {tab === 'horoscope' && (
          <div className="fade-up">
            {/* Zodiac grid */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px', marginBottom: 28, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: T.dark, marginBottom: 16 }}>Select Your Sign</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
                {ZODIAC.map(z => (
                  <button key={z.name} className={`sign-btn ${sign===z.name?'active':''}`} onClick={() => setSign(z.name)}>
                    <div className="sign-inner" style={{ border: `1.5px solid ${sign===z.name?'#f97316':'rgba(0,0,0,0.08)'}`, borderRadius: 12, padding: '12px 6px', textAlign: 'center', transition: 'all .25s ease' }}>
                      <div className="sign-sym" style={{ fontSize: 26, marginBottom: 4, color: sign===z.name?'#f97316':'#9B7355', transition: 'color .25s', display: 'block' }}>{z.sym}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: sign===z.name?T.dark:'#9B7355', marginBottom: 2, letterSpacing: '.04em' }}>{z.name.slice(0,3).toUpperCase()}</div>
                      <div style={{ fontSize: 9, color: T.goldDim }}>{z.nep}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sign header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: T.goldDim, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Icon id={Z.icon} size={13} color={T.goldDim} /> {Z.el} · Ruling Planet: {Z.lord}
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, color: T.dark, marginBottom: 4 }}>
                {Z.name} <em style={{ color: '#f97316' }}>{Z.sym}</em>
              </h2>
              <div style={{ fontSize: 14, color: T.muted }}>{Z.range}</div>
              <div style={{ width: 40, height: 2, background: '#f97316', margin: '14px auto', borderRadius: 2, opacity: 0.5 }} />
            </div>

            {/* Sub tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
              {[{k:'reading',l:'Daily Reading'},{k:'rashifal',l:'Rashifal 2082'}].map(({k,l}) => (
                <button key={k} className={`sub-btn ${subTab===k?'active':''}`} onClick={() => setSubTab(k)}>{l}</button>
              ))}
            </div>

            {subTab === 'reading' && (
              <>
                {/* Period tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: 28 }}>
                  {['daily','weekly','monthly'].map(p => (
                    <button key={p} className={`period-btn ${period===p?'active':''}`} onClick={() => setPeriod(p)}>
                      {p.charAt(0).toUpperCase()+p.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Overview */}
                <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 32px' }}>
                  <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderLeft: '3px solid #f97316', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(16px,2vw,19px)', fontWeight: 400, lineHeight: 1.8, color: T.dark, fontStyle: 'italic', margin: 0 }}>
                      "{HD.ov}"
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
                    {[{l:'Lucky Numbers',v:HD.lucky.join(' · ')},{l:'Lucky Color',v:HD.color},{l:'Mood',v:HD.mood}].map(s=>(
                      <div key={s.l} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{s.l}</div>
                        <div style={{ fontWeight: 600, color: T.dark, fontSize: 15 }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Life areas */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  {[{icon:'heart',label:'Love',text:HD.love},{icon:'work',label:'Career',text:HD.work},{icon:'leaf',label:'Health',text:HD.health}].map((item,i) => (
                    <div key={item.label} style={{ background: '#fff', borderRadius: 16, padding: '22px 20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: `fadeUp .5s ease ${i*0.1}s both` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Icon id={item.icon} size={16} color="#f97316" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em' }}>{item.label}</span>
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.75, color: '#555', margin: 0 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {subTab === 'rashifal' && (
              <div style={{ animation: 'fadeUp .5s ease both' }}>
                <div style={{ background: '#fff', borderRadius: 20, padding: '28px', marginBottom: 20, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>
                    <Icon id="star" size={12} color={T.goldDim} /> Yearly Rashifal · 2082 B.S.
                  </div>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, lineHeight: 1.85, color: T.dark, fontStyle: 'italic', margin: 0 }}>"{RF2.year}"</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
                  {[{icon:'sparkle',label:'Gemstone',val:RF2.gem},{icon:'lotus',label:'Deity',val:RF2.deity},{icon:'moon',label:'Fasting Day',val:RF2.fasting},{icon:'sun',label:'Favorable Days',val:RF2.favorable},{icon:'eye',label:'Lucky Colors',val:RF2.color}].map((item,i) => (
                    <div key={item.label} style={{ background: '#fff', borderRadius: 14, padding: '18px 14px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)', animation: `fadeUp .4s ease ${i*0.08}s both` }}>
                      <div style={{ marginBottom: 8 }}><Icon id={item.icon} size={18} color="#f97316" /></div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: T.dark, lineHeight: 1.4, fontWeight: 500 }}>{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ KUNDALI TAB ══ */}
        {tab === 'kundali' && (
          <div className="fade-up">
            {!kundali && !loading && (
              <div style={{ maxWidth: 520, margin: '0 auto' }}>
                <div style={{ background: '#fff', borderRadius: 20, padding: '36px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><Mandala size={60} /></div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: T.dark, margin: '0 0 8px' }}>Your Janma Kundali</h2>
                    <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>Sidereal zodiac · Lahiri Ayanamsa · Whole Sign houses</p>
                  </div>
                  <form onSubmit={handleGenerate}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                      {[{f:'name',label:'Full Name',type:'text',ph:'Ram Prasad Sharma'},{f:'dob',label:'Date of Birth',type:'date',ph:''},{f:'tob',label:'Time of Birth',type:'time',ph:''}].map(({f,label,type,ph}) => (
                        <div key={f}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 8 }}>{label}</label>
                          <input className="form-in" type={type} value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} placeholder={ph} required style={{colorScheme:'light'}} />
                        </div>
                      ))}
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 8 }}>Place of Birth</label>
                          <input className="form-in" type="text" value={form.pob} onChange={e=>setForm(p=>({...p,pob:e.target.value}))} placeholder="Kathmandu, Nepal" required />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 8 }}>Timezone</label>
                          <input className="form-in" type="number" step=".25" value={form.tz} onChange={e=>setForm(p=>({...p,tz:e.target.value}))} placeholder="5.75" />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 10 }}>Gender</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                          {['Male','Female','Other'].map(g => (
                            <button type="button" key={g} className={`gender-btn ${form.gender===g?'active':''}`} onClick={() => setForm(p=>({...p,gender:g}))}>{g}</button>
                          ))}
                        </div>
                      </div>
                      <button type="submit" className="main-btn" disabled={!form.gender||!form.dob||!form.tob}>
                        Generate Kundali 🪐
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><Mandala size={70} /></div>
                <p style={{ fontSize: 13, color: T.goldDim, letterSpacing: '.1em', textTransform: 'uppercase', animation: 'shimmer 1.5s ease infinite' }}>Computing Planetary Positions…</p>
              </div>
            )}

            {kundali && !loading && (
              <div style={{ animation: 'fadeUp .6s ease both' }}>
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg,#1A0F00,#2D1A00)', borderRadius: 20, padding: '24px 28px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6 }}>Janma Kundali · Sidereal · Lahiri</div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{kundali.form.name}</h2>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{kundali.form.dob} · {kundali.form.tob} · {kundali.form.pob}</p>
                  </div>
                  <button onClick={() => setKundali(null)}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 10, padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon id="back" size={13} color="#fff" /> New Chart
                  </button>
                </div>

                {/* Key stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
                  {[{icon:'arrow',label:'Lagna',val:kundali.lagnaFull},{icon:'moon',label:'Moon Rashi',val:kundali.moRashi},{icon:'sun',label:'Sun Rashi',val:kundali.suRashi},{icon:'star',label:'Nakshatra',val:`${kundali.moonNak.name} P${kundali.moonNak.pada}`}].map((s,i) => (
                    <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '18px 14px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                      <div style={{ marginBottom: 8 }}><Icon id={s.icon} size={16} color="#f97316" /></div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontWeight: 600, color: T.dark, fontSize: 13, lineHeight: 1.3 }}>{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* D1 + D9 Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  {[{houses:kundali.houses,lbl:'Rashi Chart (D1)'},{houses:kundali.navH,lbl:'Navamsa (D9)'}].map(({houses,lbl}) => (
                    <div key={lbl} style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>{lbl}</div>
                      <KundaliSVG houses={houses} size={260} />
                    </div>
                  ))}
                </div>

                {/* Planets table */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon id="planet" size={15} color="#f97316" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em' }}>Planetary Positions</span>
                  </div>
                  <div className="scroll-x">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 560 }}>
                      <thead>
                        <tr style={{ background: '#FDFBF7' }}>
                          {['Planet','Degree','Rashi','Nakshatra','Pada','House','Status'].map(h => (
                            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {kundali.rows.map(p => (
                          <tr key={p.id} className="planet-row">
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ color: p.col, marginRight: 6, fontSize: 15 }}>{p.sym}</span>
                              <span style={{ color: T.dark, fontWeight: 500 }}>{p.name}</span>
                            </td>
                            <td style={{ padding: '10px 14px', color: T.muted, fontFamily: 'monospace', fontSize: 12 }}>{di(p.deg)}°</td>
                            <td style={{ padding: '10px 14px', color: T.dark }}>{RS[p.rs]}</td>
                            <td style={{ padding: '10px 14px', color: T.dark, fontSize: 12 }}>{p.nak.name}</td>
                            <td style={{ padding: '10px 14px', color: T.muted }}>P{p.nak.pada}</td>
                            <td style={{ padding: '10px 14px', color: '#f97316', fontWeight: 700, fontSize: 12 }}>H{p.house}</td>
                            <td style={{ padding: '10px 14px' }}>
                              {p.st==='Exalted' && <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>Exalted ↑</span>}
                              {p.st==='Debilited' && <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 600 }}>Debilited ↓</span>}
                              {!p.st && <span style={{ color: T.muted }}>—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Yogas */}
                <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Icon id="sparkle" size={15} color="#f97316" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em' }}>Active Yogas</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {kundali.yogas.map(y => (
                      <span key={y} style={{ background: 'rgba(249,115,22,0.08)', color: '#c2410c', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 500 }}>{y}</span>
                    ))}
                  </div>
                </div>

                {/* Dasha */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon id="planet" size={15} color="#f97316" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em' }}>Vimshottari Dasha Timeline</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, padding: '16px' }}>
                    {kundali.dashas.map((d,i) => {
                      const isA = d===kundali.curDasha;
                      return (
                        <div key={i} className={`dasha-card ${isA?'active-dasha':''}`}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: isA?'#f97316':T.dark }}>{DN[d.planet]}</span>
                            {isA && <span style={{ fontSize: 10, fontWeight: 700, color: '#f97316', background: 'rgba(249,115,22,0.1)', borderRadius: 10, padding: '2px 8px' }}>NOW</span>}
                          </div>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>{d.years}yr period</div>
                          <div style={{ fontSize: 11, color: T.goldDim, fontFamily: 'monospace' }}>{fmtD(d.start)} → {fmtD(d.end)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 12 Bhavas */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon id="grid" size={15} color="#f97316" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.goldDim, textTransform: 'uppercase', letterSpacing: '.08em' }}>12 Houses (Bhavas)</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                    {kundali.houses.map((h,i) => (
                      <div key={i} style={{ padding: '12px 14px', borderLeft: i%4>0?'1px solid rgba(0,0,0,0.05)':'none', borderTop: i>3?'1px solid rgba(0,0,0,0.05)':'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#f97316' }}>H{h.house}</span>
                          {h.planets.length>0 && <span style={{ fontSize: 13 }}>{h.planets.map(p=>p.sym).join(' ')}</span>}
                        </div>
                        <div style={{ fontSize: 13, color: T.dark, fontWeight: 500 }}>{RF[h.rashi]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 16, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <h5 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: T.dark, margin: '0 0 6px' }}>Want a deeper reading?</h5>
                    <p style={{ fontSize: 14, color: T.muted, margin: 0 }}>Consult a verified Vedic astrologer-pandit for a personalized interpretation.</p>
                  </div>
                  <button onClick={() => navigate('/pandits')}
                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', flexShrink: 0, fontFamily: 'Inter', boxShadow: '0 4px 16px rgba(249,115,22,0.3)' }}>
                    Find a Pandit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}