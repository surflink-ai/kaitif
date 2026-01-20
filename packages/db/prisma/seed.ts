import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================
// HELPER FUNCTIONS
// ============================================

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBarcode(): string {
  return `KTF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

// ============================================
// DEMO DATA
// ============================================

const DEMO_USERS = [
  // Super Admin & Admins
  { name: "Marcus Chen", email: "marcus@kaitifskatepark.com", role: "SUPERADMIN", bio: "Park manager & lifelong skater. 20+ years on the board.", xp: 15000, level: 18, streak: 45 },
  { name: "Keisha Williams", email: "keisha@kaitifskatepark.com", role: "ADMIN", bio: "Event coordinator & competition organizer. Let's shred!", xp: 8500, level: 12, streak: 30 },
  { name: "Devon Clarke", email: "devon@kaitifskatepark.com", role: "ADMIN", bio: "Head coach & trick instructor. Teaching the next generation.", xp: 7200, level: 11, streak: 22 },
  
  // Power Users (High XP)
  { name: "Zara Thompson", email: "zara.t@gmail.com", role: "USER", bio: "Street skater turned park rat. Always pushing limits.", xp: 12500, level: 16, streak: 67 },
  { name: "Jaylen Baptiste", email: "jaylen.b@outlook.com", role: "USER", bio: "BMX & skate. Can't choose one, won't choose one.", xp: 9800, level: 13, streak: 42 },
  { name: "Aaliyah Springer", email: "aaliyah.s@gmail.com", role: "USER", bio: "Scooter queen 👑 Competing nationally since 2022.", xp: 8900, level: 12, streak: 38 },
  { name: "Tyrese Walcott", email: "tyrese.w@yahoo.com", role: "USER", bio: "Vert specialist. The higher, the better.", xp: 7500, level: 11, streak: 25 },
  { name: "Mia Hinds", email: "mia.hinds@gmail.com", role: "USER", bio: "Started at 8, still going strong at 22. Skate is life.", xp: 6800, level: 10, streak: 19 },
  
  // Regular Users
  { name: "Cameron Brathwaite", email: "cam.brath@gmail.com", role: "USER", bio: "Weekend warrior. Software dev by day, skater by night.", xp: 4200, level: 7, streak: 12 },
  { name: "Destiny Moore", email: "destiny.m@outlook.com", role: "USER", bio: "Learning new tricks every session. Progress over perfection.", xp: 3500, level: 6, streak: 8 },
  { name: "Rasheed King", email: "rasheed.k@gmail.com", role: "USER", bio: "Old school meets new school. Flatground forever.", xp: 3200, level: 6, streak: 5 },
  { name: "Brianna Chase", email: "bri.chase@yahoo.com", role: "USER", bio: "Bowl rider & pool skater. Smooth lines only.", xp: 2800, level: 5, streak: 14 },
  { name: "Darnell Holder", email: "darnell.h@gmail.com", role: "USER", bio: "Filming & skating. Check my YouTube!", xp: 2500, level: 5, streak: 3 },
  { name: "Jade Alleyne", email: "jade.a@outlook.com", role: "USER", bio: "Just here to have fun and meet cool people.", xp: 2100, level: 4, streak: 7 },
  { name: "Terrence Gill", email: "terrence.g@gmail.com", role: "USER", bio: "Dad skater. Teaching my kids the way.", xp: 1800, level: 4, streak: 2 },
  { name: "Simone Blackman", email: "simone.b@yahoo.com", role: "USER", bio: "Longboard cruiser getting into tricks.", xp: 1500, level: 3, streak: 4 },
  { name: "Andre Gibbs", email: "andre.g@gmail.com", role: "USER", bio: "Fresh to the scene. 6 months in and loving it.", xp: 1200, level: 3, streak: 6 },
  { name: "Natasha Worrell", email: "natasha.w@outlook.com", role: "USER", bio: "Ex-dancer turned skater. Flow is everything.", xp: 1000, level: 2, streak: 1 },
  { name: "Ryan Carter", email: "ryan.c@gmail.com", role: "USER", bio: "Relocated from Toronto. Missing the indoor parks!", xp: 850, level: 2, streak: 9 },
  { name: "Kiara Prescod", email: "kiara.p@yahoo.com", role: "USER", bio: "Night session regular. The park hits different after dark.", xp: 700, level: 2, streak: 3 },
  
  // Newer Users
  { name: "Marcus Jordan", email: "marcus.j@gmail.com", role: "USER", bio: "Just started skating last month!", xp: 450, level: 1, streak: 2 },
  { name: "Alexis Forde", email: "alexis.f@outlook.com", role: "USER", bio: "Trying to learn kickflips. Any tips?", xp: 380, level: 1, streak: 1 },
  { name: "Devon Richards", email: "devon.r@gmail.com", role: "USER", bio: "Scooter kid transitioning to skateboard.", xp: 320, level: 1, streak: 0 },
  { name: "Jasmine Hunte", email: "jasmine.h@yahoo.com", role: "USER", bio: "Here for the vibes and community.", xp: 280, level: 1, streak: 1 },
  { name: "Isaiah Best", email: "isaiah.b@gmail.com", role: "USER", bio: "BMX beginner. Learning bunny hops.", xp: 220, level: 1, streak: 0 },
  { name: "Amara Sealy", email: "amara.s@outlook.com", role: "USER", bio: "Protective gear advocate. Safety first!", xp: 180, level: 1, streak: 2 },
  { name: "Malik Brewster", email: "malik.b@gmail.com", role: "USER", bio: "Photographer documenting the local scene.", xp: 150, level: 1, streak: 0 },
  { name: "Tiana Weekes", email: "tiana.w@yahoo.com", role: "USER", bio: "Just signed up. Excited to meet everyone!", xp: 100, level: 1, streak: 0 },
  { name: "Chris Applewhaite", email: "chris.a@gmail.com", role: "USER", bio: "Longboard dancer from Christ Church.", xp: 75, level: 1, streak: 1 },
  { name: "Naomi Grant", email: "naomi.g@outlook.com", role: "USER", bio: "New to Barbados. Looking for skate friends!", xp: 50, level: 1, streak: 0 },
  
  // More variety
  { name: "Jordan Belgrave", email: "jordan.belg@gmail.com", role: "USER", bio: "Tech skater. Ledges and rails are my playground.", xp: 5500, level: 9, streak: 21 },
  { name: "Shania Phillips", email: "shania.p@outlook.com", role: "USER", bio: "Roller skater exploring the skateboard world.", xp: 900, level: 2, streak: 4 },
  { name: "Kofi Beckles", email: "kofi.b@gmail.com", role: "USER", bio: "Transition master. Bowls, pools, mini ramps.", xp: 4800, level: 8, streak: 16 },
  { name: "Rihanna Small", email: "rihanna.s@yahoo.com", role: "USER", bio: "Yes, that's my real name. No, not that one. 😂", xp: 2200, level: 4, streak: 5 },
  { name: "Tremaine Sobers", email: "tremaine.s@gmail.com", role: "USER", bio: "Descendant of Sir Garfield. Skating at his complex!", xp: 3800, level: 6, streak: 11 },
  { name: "Keegan Haynes", email: "keegan.h@outlook.com", role: "USER", bio: "Mini ramp enthusiast. Building one in my backyard.", xp: 2600, level: 5, streak: 8 },
  { name: "Sade Cumberbatch", email: "sade.c@gmail.com", role: "USER", bio: "Artist & skater. Custom deck designs available!", xp: 1700, level: 3, streak: 3 },
  { name: "Jaden Greenidge", email: "jaden.g@yahoo.com", role: "USER", bio: "Competition focused. Training for Caribbean Games.", xp: 6200, level: 10, streak: 28 },
  { name: "Nia Stuart", email: "nia.s@gmail.com", role: "USER", bio: "Cruising and carving. Low-key sessions only.", xp: 1100, level: 2, streak: 2 },
  { name: "Xavier Cadogan", email: "xavier.c@outlook.com", role: "USER", bio: "Vertical specialist. Drop-ins are my meditation.", xp: 4100, level: 7, streak: 15 },
  
  // International skaters who visit
  { name: "Tyler Brooks", email: "tyler.brooks@gmail.com", role: "USER", bio: "Visiting from Miami. This park is amazing!", xp: 3400, level: 6, streak: 0 },
  { name: "Emma Rodriguez", email: "emma.rod@yahoo.com", role: "USER", bio: "Canadian snowboarder. Skating in the off-season.", xp: 2900, level: 5, streak: 0 },
  { name: "Liam O'Connor", email: "liam.oc@gmail.com", role: "USER", bio: "Irish skater on holiday. Living the dream!", xp: 1600, level: 3, streak: 0 },
  { name: "Sofia Martinez", email: "sofia.m@outlook.com", role: "USER", bio: "Brazilian street skater. First time in the Caribbean!", xp: 5100, level: 8, streak: 0 },
  { name: "Jamal Washington", email: "jamal.w@gmail.com", role: "USER", bio: "NYC skater. Impressed by the local talent here.", xp: 4500, level: 7, streak: 0 },
  
  // Youth skaters
  { name: "Aiden Marshall", email: "aiden.m.parent@gmail.com", role: "USER", bio: "12 years old and already sending it! (Parent account)", xp: 2400, level: 4, streak: 18 },
  { name: "Maya Thompson", email: "maya.t.parent@outlook.com", role: "USER", bio: "10yo prodigy. Watch this space! (Parent managed)", xp: 1900, level: 4, streak: 12 },
  { name: "Ethan Lewis", email: "ethan.l.parent@gmail.com", role: "USER", bio: "14 and fearless. Bowl skating is my thing.", xp: 3100, level: 5, streak: 9 },
  { name: "Zoe Barrow", email: "zoe.b.parent@yahoo.com", role: "USER", bio: "8yo just starting out. Loves the scooter for now!", xp: 400, level: 1, streak: 5 },
  { name: "Noah Williams", email: "noah.w.parent@gmail.com", role: "USER", bio: "15yo competing in junior divisions. Let's go!", xp: 5800, level: 9, streak: 24 },
];

const DEMO_BADGES = [
  // Visit-based (Common to Epic)
  { name: "First Drop", description: "Complete your first visit to Kaitif Skatepark", imageUrl: "/badges/first-drop.png", rarity: "COMMON", criteria: JSON.stringify({ type: "visits", count: 1 }) },
  { name: "Regular", description: "Visit the park 10 times", imageUrl: "/badges/regular.png", rarity: "COMMON", criteria: JSON.stringify({ type: "visits", count: 10 }) },
  { name: "Dedicated", description: "Visit the park 50 times", imageUrl: "/badges/dedicated.png", rarity: "RARE", criteria: JSON.stringify({ type: "visits", count: 50 }) },
  { name: "Park Rat", description: "Visit the park 100 times", imageUrl: "/badges/park-rat.png", rarity: "EPIC", criteria: JSON.stringify({ type: "visits", count: 100 }) },
  { name: "Living Legend", description: "Visit the park 500 times", imageUrl: "/badges/legend.png", rarity: "LEGENDARY", criteria: JSON.stringify({ type: "visits", count: 500 }) },
  
  // Streak badges
  { name: "Week Warrior", description: "Maintain a 7-day visit streak", imageUrl: "/badges/week-warrior.png", rarity: "COMMON", criteria: JSON.stringify({ type: "streak", days: 7 }) },
  { name: "Month Master", description: "Maintain a 30-day visit streak", imageUrl: "/badges/month-master.png", rarity: "RARE", criteria: JSON.stringify({ type: "streak", days: 30 }) },
  { name: "Iron Will", description: "Maintain a 100-day visit streak", imageUrl: "/badges/iron-will.png", rarity: "LEGENDARY", criteria: JSON.stringify({ type: "streak", days: 100 }) },
  
  // Challenge badges
  { name: "Challenger", description: "Complete your first challenge", imageUrl: "/badges/challenger.png", rarity: "COMMON", criteria: JSON.stringify({ type: "challenges", count: 1 }) },
  { name: "Trick Master", description: "Complete 5 challenges", imageUrl: "/badges/trick-master.png", rarity: "RARE", criteria: JSON.stringify({ type: "challenges", count: 5 }) },
  { name: "Unstoppable", description: "Complete 20 challenges", imageUrl: "/badges/unstoppable.png", rarity: "EPIC", criteria: JSON.stringify({ type: "challenges", count: 20 }) },
  
  // Event badges
  { name: "Socialite", description: "Attend 5 events", imageUrl: "/badges/socialite.png", rarity: "COMMON", criteria: JSON.stringify({ type: "events", count: 5 }) },
  { name: "Community Pillar", description: "Attend 20 events", imageUrl: "/badges/community-pillar.png", rarity: "RARE", criteria: JSON.stringify({ type: "events", count: 20 }) },
  
  // Marketplace badges
  { name: "First Sale", description: "Complete your first marketplace sale", imageUrl: "/badges/first-sale.png", rarity: "COMMON", criteria: JSON.stringify({ type: "sales", count: 1 }) },
  { name: "Trusted Seller", description: "Complete 10 marketplace sales", imageUrl: "/badges/trusted-seller.png", rarity: "RARE", criteria: JSON.stringify({ type: "sales", count: 10 }) },
  
  // Special badges
  { name: "Early Adopter", description: "Joined the platform in its first months", imageUrl: "/badges/early-adopter.png", rarity: "EPIC", criteria: JSON.stringify({ type: "join_date", before: "2026-03-01" }) },
  { name: "Founding Member", description: "One of the very first Kaitif app users", imageUrl: "/badges/founding-member.png", rarity: "LEGENDARY", criteria: JSON.stringify({ type: "join_date", before: "2026-02-01" }) },
];

const DEMO_CHALLENGES = [
  // Beginner (50 XP)
  { title: "Ollie", description: "Land a clean ollie on flat ground. The foundation of street skating!", difficulty: "BEGINNER", xpReward: 50, videoRequired: true },
  { title: "Kickturn", description: "Execute a smooth kickturn on the mini ramp or quarter pipe.", difficulty: "BEGINNER", xpReward: 50, videoRequired: true },
  { title: "Manual", description: "Hold a manual for at least 10 feet without touching down.", difficulty: "BEGINNER", xpReward: 50, videoRequired: true },
  { title: "Drop In", description: "Drop in on the quarter pipe or mini ramp. Commit!", difficulty: "BEGINNER", xpReward: 50, videoRequired: true },
  { title: "Rock to Fakie", description: "Rock to fakie on any transition. Style points count!", difficulty: "BEGINNER", xpReward: 50, videoRequired: true },
  
  // Intermediate (100 XP)
  { title: "Kickflip", description: "Land a kickflip on flat. The classic flip trick!", difficulty: "INTERMEDIATE", xpReward: 100, videoRequired: true },
  { title: "Heelflip", description: "Land a heelflip on flat. Goofy footed flip trick.", difficulty: "INTERMEDIATE", xpReward: 100, videoRequired: true },
  { title: "50-50 Grind", description: "Land a 50-50 grind on any ledge or rail.", difficulty: "INTERMEDIATE", xpReward: 100, videoRequired: true },
  { title: "Boardslide", description: "Land a frontside or backside boardslide.", difficulty: "INTERMEDIATE", xpReward: 100, videoRequired: true },
  { title: "Axle Stall", description: "Axle stall on the coping. Hold it clean!", difficulty: "INTERMEDIATE", xpReward: 100, videoRequired: true },
  { title: "Frontside 180", description: "Land a frontside 180 ollie on flat or off a ramp.", difficulty: "INTERMEDIATE", xpReward: 100, videoRequired: true },
  
  // Advanced (250 XP)
  { title: "Tre Flip", description: "Land a 360 flip (tre flip) on flat ground.", difficulty: "ADVANCED", xpReward: 250, videoRequired: true },
  { title: "Backside Tailslide", description: "Land a backside tailslide on a ledge.", difficulty: "ADVANCED", xpReward: 250, videoRequired: true },
  { title: "Frontside Bluntslide", description: "Land a frontside bluntslide on a ledge.", difficulty: "ADVANCED", xpReward: 250, videoRequired: true },
  { title: "Kickflip 50-50", description: "Kickflip into a 50-50 grind.", difficulty: "ADVANCED", xpReward: 250, videoRequired: true },
  { title: "Smith Grind", description: "Land a smith grind on a ledge or rail.", difficulty: "ADVANCED", xpReward: 250, videoRequired: true },
  
  // Expert (500 XP)
  { title: "Hardflip", description: "Land a hardflip on flat. Frontside flip with a kickflip.", difficulty: "EXPERT", xpReward: 500, videoRequired: true },
  { title: "Nollie Tre Flip", description: "Land a nollie 360 flip. Switch stance difficulty!", difficulty: "EXPERT", xpReward: 500, videoRequired: true },
  { title: "Kickflip Backside Tailslide", description: "Kickflip into a backside tailslide.", difficulty: "EXPERT", xpReward: 500, videoRequired: true },
  { title: "360 Flip Noseslide", description: "Tre flip into a noseslide. Technical mastery required.", difficulty: "EXPERT", xpReward: 500, videoRequired: true },
];

const DEMO_EVENTS = [
  // Upcoming events (next 2 months)
  { title: "Saturday Session", description: "Weekly open session. All skill levels welcome! Come hang out, practice, and meet fellow skaters.", category: "OPEN_SESSION", daysFromNow: 2, hours: 3, xpReward: 25, hypeLevel: 45, capacity: null },
  { title: "Beginner's Workshop", description: "Learn the basics with Coach Devon. Helmets and pads provided. Perfect for first-timers!", category: "WORKSHOP", daysFromNow: 4, hours: 2, xpReward: 50, hypeLevel: 65, capacity: 15 },
  { title: "Friday Night Lights", description: "Night session under the lights. Music, vibes, and good times. Bring your A-game!", category: "SPECIAL", daysFromNow: 5, hours: 4, xpReward: 35, hypeLevel: 78, capacity: null },
  { title: "Mini Ramp Jam", description: "Mini ramp session with prizes for best trick. All ages welcome. $5 entry includes raffle ticket.", category: "COMPETITION", daysFromNow: 8, hours: 3, xpReward: 100, hypeLevel: 85, capacity: 30 },
  { title: "Ladies Night", description: "Women and girls only session. Supportive environment to learn and progress together.", category: "COMMUNITY", daysFromNow: 10, hours: 2, xpReward: 30, hypeLevel: 55, capacity: 20 },
  { title: "Advanced Tricks Workshop", description: "Learn advanced flip tricks with Jaylen. Must be able to land kickflips consistently.", category: "WORKSHOP", daysFromNow: 12, hours: 2, xpReward: 75, hypeLevel: 70, capacity: 10 },
  { title: "Sunday Funday", description: "Family-friendly session. Parents skate free with paid child entry!", category: "OPEN_SESSION", daysFromNow: 9, hours: 4, xpReward: 25, hypeLevel: 40, capacity: null },
  { title: "Best Trick Contest", description: "Show your best trick on the big quarter. Prizes for top 3. Registration required.", category: "COMPETITION", daysFromNow: 15, hours: 3, xpReward: 150, hypeLevel: 92, capacity: 25 },
  { title: "Scooter Saturday", description: "Scooter-focused session. Tricks, tips, and good times for scooter riders.", category: "OPEN_SESSION", daysFromNow: 16, hours: 3, xpReward: 25, hypeLevel: 38, capacity: null },
  { title: "BMX Jam", description: "BMX riders take over! Bring your bike and show us what you got.", category: "OPEN_SESSION", daysFromNow: 17, hours: 3, xpReward: 25, hypeLevel: 52, capacity: null },
  { title: "Youth Competition", description: "Under 16 competition. Skateboard, scooter, and BMX divisions. Medals and prizes!", category: "COMPETITION", daysFromNow: 22, hours: 4, xpReward: 125, hypeLevel: 88, capacity: 40 },
  { title: "Transition Workshop", description: "Master the art of transition skating. Bowls, quarters, and half pipes.", category: "WORKSHOP", daysFromNow: 18, hours: 2, xpReward: 60, hypeLevel: 58, capacity: 12 },
  { title: "Full Moon Session", description: "Special night session during the full moon. Mystical vibes and good skating.", category: "SPECIAL", daysFromNow: 25, hours: 3, xpReward: 40, hypeLevel: 72, capacity: null },
  { title: "Game of S.K.A.T.E", description: "Classic game of SKATE tournament. Single elimination. Winner takes all!", category: "COMPETITION", daysFromNow: 29, hours: 3, xpReward: 100, hypeLevel: 80, capacity: 32 },
  { title: "Birthday Rental - Private", description: "Private party rental (booked)", category: "PRIVATE_RENTAL", daysFromNow: 20, hours: 2, xpReward: 0, hypeLevel: 0, capacity: 15 },
  { title: "Corporate Team Building", description: "Private corporate event (booked)", category: "PRIVATE_RENTAL", daysFromNow: 26, hours: 3, xpReward: 0, hypeLevel: 0, capacity: 25 },
  { title: "Valentine's Skate", description: "Couples and singles welcome! Special Valentine's themed session with refreshments.", category: "SPECIAL", daysFromNow: 35, hours: 3, xpReward: 50, hypeLevel: 68, capacity: null },
  { title: "Learn to Ollie", description: "Dedicated ollie workshop. The first trick you need to learn!", category: "WORKSHOP", daysFromNow: 11, hours: 1.5, xpReward: 40, hypeLevel: 48, capacity: 20 },
  { title: "Pro Demo Day", description: "Guest pro skater demonstration and meet & greet. Special one-time event!", category: "SPECIAL", daysFromNow: 45, hours: 4, xpReward: 75, hypeLevel: 95, capacity: 100 },
  { title: "Photo/Video Day", description: "Bring your camera! Professional photographer on site. Get clips for your reel.", category: "COMMUNITY", daysFromNow: 23, hours: 4, xpReward: 30, hypeLevel: 62, capacity: null },
  { title: "Deck Swap Meet", description: "Bring decks, wheels, trucks to trade. Marketplace in person!", category: "COMMUNITY", daysFromNow: 30, hours: 3, xpReward: 25, hypeLevel: 55, capacity: null },
  { title: "Independence Day Jam", description: "Celebrate Barbados Independence with an epic skate jam! Free entry all day.", category: "SPECIAL", daysFromNow: 50, hours: 6, xpReward: 100, hypeLevel: 90, capacity: null },
  { title: "Groms Session", description: "Kids under 12 session. Patient instructors. Fun guaranteed!", category: "WORKSHOP", daysFromNow: 13, hours: 2, xpReward: 35, hypeLevel: 42, capacity: 25 },
  { title: "Park Cleanup Day", description: "Help us clean the park! Volunteers get free day pass + special badge.", category: "COMMUNITY", daysFromNow: 37, hours: 2, xpReward: 100, hypeLevel: 35, capacity: 20 },
  { title: "Bowl Bash", description: "Bowl skating contest. Flow, style, and tricks judged equally.", category: "COMPETITION", daysFromNow: 40, hours: 3, xpReward: 125, hypeLevel: 82, capacity: 20 },
];

const DEMO_LISTINGS = [
  // Skateboards
  { title: "Element Section Complete", description: "Barely used Element complete. 8.0 deck, great for beginners. Only rode it a few times before switching to a bigger size.", category: "SKATEBOARD", condition: "LIKE_NEW", price: 12000 },
  { title: "Baker Brand Logo Deck 8.25", description: "Baker deck, never gripped. Changed my mind on the graphic. Brand new in shrink wrap.", category: "SKATEBOARD", condition: "NEW", price: 6500 },
  { title: "Independent Stage 11 Trucks", description: "Indy trucks, 149mm. Some scratches from grinds but still spin perfect. Bushings replaced recently.", category: "SKATEBOARD", condition: "GOOD", price: 4500 },
  { title: "Spitfire Formula Four 52mm", description: "Used Spitfires, maybe 60% life left. Slight flat spots but still roll fine.", category: "SKATEBOARD", condition: "FAIR", price: 1500 },
  { title: "Girl Skateboards Deck 8.0", description: "Well loved Girl deck. Some chips but tons of pop still. Great backup deck.", category: "SKATEBOARD", condition: "FAIR", price: 2500 },
  { title: "Complete Pro Setup", description: "Full pro setup: Real deck 8.38, Thunder trucks, Bones STF wheels, Bronson bearings. Selling because upgrading.", category: "SKATEBOARD", condition: "GOOD", price: 18000 },
  { title: "Toy Machine Deck", description: "Toy Machine monster deck. 8.25. Small razor tail starting but plenty of life left.", category: "SKATEBOARD", condition: "GOOD", price: 3500 },
  { title: "Bones Swiss Bearings", description: "Genuine Bones Swiss bearings. Only used for a month. Too fast for me honestly!", category: "SKATEBOARD", condition: "LIKE_NEW", price: 5000 },
  { title: "Santa Cruz Classic Dot Complete", description: "Classic Santa Cruz complete. Great beginner board. 7.75 width.", category: "SKATEBOARD", condition: "NEW", price: 13500 },
  { title: "Venture Trucks 5.25 Hi", description: "Venture trucks, high version. Some wear but grind smooth.", category: "SKATEBOARD", condition: "GOOD", price: 3800 },
  
  // Scooters
  { title: "Envy Prodigy S9 Complete", description: "Top of the line Envy scooter. Only 3 months old. Upgrading to custom.", category: "SCOOTER", condition: "LIKE_NEW", price: 35000 },
  { title: "Lucky Crew Complete", description: "Great beginner scooter. Minor scratches on deck. Spins smooth.", category: "SCOOTER", condition: "GOOD", price: 15000 },
  { title: "Root Industries AIR Wheels", description: "Pair of Root Industries wheels. 120mm. Barely used, sold scooter.", category: "SCOOTER", condition: "LIKE_NEW", price: 4500 },
  { title: "Ethic Pandemonium Deck", description: "Ethic deck with cut. Some scratches from tricks. Strong as ever.", category: "SCOOTER", condition: "GOOD", price: 12000 },
  { title: "Proto Sliders Grips", description: "Brand new proto grips. Wrong color for my setup.", category: "SCOOTER", condition: "NEW", price: 800 },
  { title: "Custom Pro Scooter", description: "Full custom build: Tilt deck, North wheels, Oath forks. Show stopper!", category: "SCOOTER", condition: "GOOD", price: 42000 },
  { title: "Fuzion Z250 Complete", description: "Entry level Fuzion. Perfect first scooter. Used but functional.", category: "SCOOTER", condition: "FAIR", price: 8000 },
  
  // BMX
  { title: "Kink Whip XL Complete", description: "2024 Kink Whip XL. Chromoly frame. Ridden for 6 months.", category: "BMX", condition: "GOOD", price: 45000 },
  { title: "Sunday Primer Complete", description: "Sunday Primer 20.5 TT. Great starter BMX. Some scratches.", category: "BMX", condition: "GOOD", price: 35000 },
  { title: "Odyssey Twisted PC Pedals", description: "Odyssey pedals. Still grippy. Selling because upgraded to metals.", category: "BMX", condition: "GOOD", price: 1800 },
  { title: "BSD Donnasqueak Frame", description: "BSD frame, 21 TT. Raw finish. Minor scratches from pegs.", category: "BMX", condition: "GOOD", price: 25000 },
  { title: "Cult Vans Tire", description: "New Cult x Vans tire. 2.4 width. Never mounted.", category: "BMX", condition: "NEW", price: 3500 },
  
  // Protective Gear
  { title: "Triple 8 Certified Helmet", description: "Triple 8 helmet, size L. Worn twice. Bought wrong size.", category: "PROTECTIVE_GEAR", condition: "LIKE_NEW", price: 4500 },
  { title: "187 Killer Pads Pro Knee", description: "187 knee pads, size M. Some scuffs from slides. Very protective.", category: "PROTECTIVE_GEAR", condition: "GOOD", price: 6000 },
  { title: "Pro-Tec Classic Helmet", description: "Pro-Tec helmet, matte black, size M. Classic style. Minor scratches.", category: "PROTECTIVE_GEAR", condition: "GOOD", price: 3500 },
  { title: "Smith Scabs Elbow Pads", description: "Elbow pads, size S. Barely used. Great for park skating.", category: "PROTECTIVE_GEAR", condition: "LIKE_NEW", price: 2500 },
  { title: "Full Pad Set - Youth", description: "Complete youth pad set: helmet, knee, elbow, wrist. Outgrew them.", category: "PROTECTIVE_GEAR", condition: "GOOD", price: 5000 },
  { title: "TSG Meta Helmet", description: "Premium TSG helmet with MIPS. Size L. Top safety rating.", category: "PROTECTIVE_GEAR", condition: "NEW", price: 12000 },
  
  // Apparel
  { title: "Thrasher Hoodie Large", description: "Classic Thrasher flame hoodie. Size L. Worn a few times.", category: "APPAREL", condition: "LIKE_NEW", price: 6000 },
  { title: "Vans Sk8-Hi Pro Size 10", description: "Vans Sk8-Hi in black/white. Some wear on soles. Still comfy.", category: "APPAREL", condition: "GOOD", price: 5500 },
  { title: "Nike SB Janoski Size 9", description: "Janoski in all black. Barely worn. Wrong size for me.", category: "APPAREL", condition: "LIKE_NEW", price: 8000 },
  { title: "Santa Cruz Tee Medium", description: "Screaming hand tee. Size M. Classic.", category: "APPAREL", condition: "NEW", price: 2500 },
  { title: "Dickies 874 Work Pants 32", description: "Dickies 874 in khaki. Size 32. The skater staple.", category: "APPAREL", condition: "GOOD", price: 3500 },
  { title: "Emerica Wino G6 Size 11", description: "Emerica skate shoes. Size 11. Grip tape wore down suede but lots of life.", category: "APPAREL", condition: "FAIR", price: 4000 },
  { title: "Palace Skateboards Tee L", description: "Authentic Palace tri-ferg tee. Large. Rare colorway.", category: "APPAREL", condition: "GOOD", price: 7500 },
  
  // Accessories
  { title: "Shake Junt Hardware", description: "Shake Junt allen hardware. 7/8 inch. Never opened.", category: "ACCESSORIES", condition: "NEW", price: 500 },
  { title: "Mob Grip Tape Sheet", description: "Full sheet of Mob grip. Standard black.", category: "ACCESSORIES", condition: "NEW", price: 600 },
  { title: "Bones Reds Bearings", description: "Bones Reds, brand new in package. Bought extra.", category: "ACCESSORIES", condition: "NEW", price: 2000 },
  { title: "Skate Tool", description: "All-in-one skate tool. Works great. Selling because got a nicer one.", category: "ACCESSORIES", condition: "GOOD", price: 800 },
  { title: "Risers 1/4 inch", description: "Pack of 1/4 inch risers. Prevent wheel bite.", category: "ACCESSORIES", condition: "NEW", price: 300 },
  { title: "Wax Block", description: "Homemade skate wax. Works better than store bought!", category: "ACCESSORIES", condition: "NEW", price: 200 },
  { title: "GoPro Hero 8 Mount Set", description: "GoPro mounts for filming skating. Helmet, chest, pole mounts.", category: "ACCESSORIES", condition: "GOOD", price: 3500 },
  { title: "Deck Wall Mount x3", description: "Three deck wall mounts. Display your boards in style.", category: "ACCESSORIES", condition: "NEW", price: 1500 },
  
  // Other
  { title: "Skateboard Backpack", description: "Backpack with board straps. Holds full setup.", category: "OTHER", condition: "GOOD", price: 3000 },
  { title: "Session DVD Collection", description: "Classic skate video collection. 15 DVDs. Nostalgia trip.", category: "OTHER", condition: "GOOD", price: 2000 },
  { title: "Fingerboard Setup", description: "Tech Deck setup with ramps. Fun desk toy.", category: "OTHER", condition: "LIKE_NEW", price: 1500 },
  { title: "Kaitif Skatepark Sticker Pack", description: "10 Kaitif Skatepark stickers. Rep the park!", category: "OTHER", condition: "NEW", price: 500 },
];

const DEMO_EVENT_SUGGESTIONS = [
  { title: "Midnight Madness", description: "Late night session from 10pm-2am. Extended hours for the night owls!", category: "SPECIAL" },
  { title: "Oldheads Session", description: "30+ only session. No pressure, no kids, just vibes.", category: "COMMUNITY" },
  { title: "Flat Ground Friday", description: "Weekly flatground trick session. No ramps, pure street.", category: "OPEN_SESSION" },
  { title: "Filming Workshop", description: "Learn to film skating. Angles, lighting, editing tips.", category: "WORKSHOP" },
  { title: "Reggae Jam", description: "Skate session with live reggae music!", category: "SPECIAL" },
];

// ============================================
// SEED FUNCTION
// ============================================

async function seed() {
  console.log("🌱 Starting seed...\n");

  // Clear existing data (in correct order for foreign keys)
  console.log("🧹 Clearing existing data...");
  await prisma.message.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.eventSuggestionVote.deleteMany();
  await prisma.eventSuggestion.deleteMany();
  await prisma.eventMedia.deleteMany();
  await prisma.eventAttendance.deleteMany();
  await prisma.eventRSVP.deleteMany();
  await prisma.event.deleteMany();
  await prisma.challengeCompletion.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.listingReport.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.passScan.deleteMany();
  await prisma.pass.deleteMany();
  await prisma.waiver.deleteMany();
  await prisma.waiverVersion.deleteMany();
  await prisma.pushSubscription.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log("👥 Creating users...");
  const users = await Promise.all(
    DEMO_USERS.map((user) =>
      prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          bio: user.bio,
          role: user.role as "USER" | "ADMIN" | "SUPERADMIN",
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
        },
      })
    )
  );
  console.log(`   ✓ Created ${users.length} users`);

  // Create Badges
  console.log("🏅 Creating badges...");
  const badges = await Promise.all(
    DEMO_BADGES.map((badge) =>
      prisma.badge.create({
        data: {
          name: badge.name,
          description: badge.description,
          imageUrl: badge.imageUrl,
          rarity: badge.rarity as "COMMON" | "RARE" | "EPIC" | "LEGENDARY",
          criteria: badge.criteria,
        },
      })
    )
  );
  console.log(`   ✓ Created ${badges.length} badges`);

  // Assign badges to users based on their stats
  console.log("🎖️ Assigning badges to users...");
  let badgeCount = 0;
  for (const user of users) {
    const earnedBadges: string[] = [];
    
    // High XP users get more badges
    if (user.xp >= 1) earnedBadges.push("First Drop");
    if (user.xp >= 1000) earnedBadges.push("Regular");
    if (user.xp >= 3000) earnedBadges.push("Challenger");
    if (user.xp >= 5000) earnedBadges.push("Dedicated", "Week Warrior");
    if (user.xp >= 7500) earnedBadges.push("Trick Master", "Socialite");
    if (user.xp >= 10000) earnedBadges.push("Park Rat", "Month Master");
    if (user.xp >= 12000) earnedBadges.push("Community Pillar", "Early Adopter");
    if (user.xp >= 15000) earnedBadges.push("Founding Member");

    for (const badgeName of earnedBadges) {
      const badge = badges.find((b) => b.name === badgeName);
      if (badge) {
        await prisma.userBadge.create({
          data: {
            userId: user.id,
            badgeId: badge.id,
            earnedAt: new Date(Date.now() - randomBetween(1, 60) * 24 * 60 * 60 * 1000),
          },
        });
        badgeCount++;
      }
    }
  }
  console.log(`   ✓ Assigned ${badgeCount} badges`);

  // Create Challenges
  console.log("🎯 Creating challenges...");
  const challenges = await Promise.all(
    DEMO_CHALLENGES.map((challenge) =>
      prisma.challenge.create({
        data: {
          title: challenge.title,
          description: challenge.description,
          difficulty: challenge.difficulty as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
          xpReward: challenge.xpReward,
          videoRequired: challenge.videoRequired,
          isActive: true,
        },
      })
    )
  );
  console.log(`   ✓ Created ${challenges.length} challenges`);

  // Create Challenge Completions for some users
  console.log("✅ Creating challenge completions...");
  const highXpUsers = users.filter((u) => u.xp >= 2000);
  let completionCount = 0;
  for (const user of highXpUsers) {
    const numCompletions = Math.min(randomBetween(1, 8), challenges.length);
    const shuffledChallenges = [...challenges].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numCompletions; i++) {
      const challenge = shuffledChallenges[i];
      await prisma.challengeCompletion.create({
        data: {
          userId: user.id,
          challengeId: challenge.id,
          status: "APPROVED",
          xpAwarded: challenge.xpReward,
          videoUrl: `https://example.com/videos/${user.id}/${challenge.id}.mp4`,
          submittedAt: new Date(Date.now() - randomBetween(1, 90) * 24 * 60 * 60 * 1000),
          reviewedAt: new Date(Date.now() - randomBetween(1, 30) * 24 * 60 * 60 * 1000),
        },
      });
      completionCount++;
    }
  }
  console.log(`   ✓ Created ${completionCount} challenge completions`);

  // Create Waiver Version
  console.log("📜 Creating waiver version...");
  const waiverVersion = await prisma.waiverVersion.create({
    data: {
      version: 1,
      content: `KAITIF SKATEPARK LIABILITY WAIVER AND RELEASE OF CLAIMS

PLEASE READ CAREFULLY BEFORE SIGNING

I, the undersigned participant (or parent/guardian of a minor participant), hereby acknowledge and agree to the following:

1. ASSUMPTION OF RISK
I understand that skateboarding, BMX riding, scootering, inline skating, and related activities at Kaitif Skatepark involve inherent risks including but not limited to: falls, collisions with other participants, equipment failure, and contact with obstacles or surfaces. I voluntarily assume all such risks and accept personal responsibility for any injury or damage resulting from my participation.

2. RELEASE AND WAIVER
I, for myself and on behalf of my heirs, assigns, personal representatives and next of kin, hereby release, indemnify and hold harmless Kaitif Skatepark, its owners, operators, employees, agents, and sponsors from any and all liability, claims, demands, actions or causes of action whatsoever arising out of or related to any loss, damage or injury, including death, that may be sustained by me or any property belonging to me while participating in such activity, or while on or upon the premises where the activity is being conducted.

3. RULES AND REGULATIONS
I agree to abide by all rules and regulations of Kaitif Skatepark, including but not limited to:
- Wearing appropriate safety gear (helmet required for all participants)
- Respecting other park users and staff
- Not engaging in reckless or dangerous behavior
- Following all posted signs and instructions from staff

4. MEDICAL AUTHORIZATION
In the event of an emergency, I authorize Kaitif Skatepark staff to obtain medical treatment for myself or the minor participant. I understand that I am responsible for all costs associated with any medical treatment.

5. PHOTO AND VIDEO RELEASE
I grant Kaitif Skatepark permission to use any photographs or video footage of me or the minor participant for promotional purposes without compensation.

6. ACKNOWLEDGMENT
I have read this waiver and fully understand its terms. I understand that I am giving up substantial rights, including my right to sue. I acknowledge that I am signing this agreement freely and voluntarily, and intend by my signature to be a complete and unconditional release of all liability to the greatest extent allowed by law.

FOR PARTICIPANTS UNDER 18 YEARS OF AGE:
As the parent or legal guardian of the above-named minor, I hereby consent to this waiver and release on behalf of the minor and agree to be bound by its terms.

This waiver is valid for one (1) year from the date of signing. Upon expiration, a new waiver must be signed to continue accessing Kaitif Skatepark facilities.

By signing below, you confirm that you have read, understood, and agree to all terms of this waiver.`,
      isActive: true,
    },
  });
  console.log(`   ✓ Created waiver version ${waiverVersion.version}`);

  // Create Waivers and Passes for active users
  console.log("📋 Creating waivers and passes...");
  const activeUsers = users.filter((u) => u.xp >= 500);
  let waiverCount = 0;
  let passCount = 0;
  
  for (const user of activeUsers) {
    // Create waiver
    await prisma.waiver.create({
      data: {
        userId: user.id,
        waiverVersionId: waiverVersion.id,
        signature: `data:image/png;base64,${Buffer.from(user.name).toString("base64")}`,
        signedAt: new Date(Date.now() - randomBetween(1, 180) * 24 * 60 * 60 * 1000),
        expiresAt: addDays(new Date(), 365),
      },
    });
    waiverCount++;

    // Create pass for some users
    if (Math.random() > 0.3) {
      const passTypes = ["DAY", "WEEK", "MONTH", "ANNUAL"] as const;
      const passType = passTypes[randomBetween(0, 3)];
      const durations = { DAY: 1, WEEK: 7, MONTH: 30, ANNUAL: 365 };
      
      await prisma.pass.create({
        data: {
          userId: user.id,
          type: passType,
          status: "ACTIVE",
          barcodeId: generateBarcode(),
          purchasedAt: new Date(Date.now() - randomBetween(1, 30) * 24 * 60 * 60 * 1000),
          expiresAt: addDays(new Date(), durations[passType]),
        },
      });
      passCount++;
    }
  }
  console.log(`   ✓ Created ${waiverCount} waivers`);
  console.log(`   ✓ Created ${passCount} passes`);

  // Create Events
  console.log("📅 Creating events...");
  const now = new Date();
  const events = await Promise.all(
    DEMO_EVENTS.map((event) => {
      const startTime = addDays(now, event.daysFromNow);
      startTime.setHours(14 + randomBetween(0, 4), 0, 0, 0);
      const endTime = addHours(startTime, event.hours);

      return prisma.event.create({
        data: {
          title: event.title,
          description: event.description,
          category: event.category as any,
          startTime,
          endTime,
          capacity: event.capacity,
          xpReward: event.xpReward,
          hypeLevel: event.hypeLevel,
          isPublished: event.category !== "PRIVATE_RENTAL",
        },
      });
    })
  );
  console.log(`   ✓ Created ${events.length} events`);

  // Create RSVPs for events
  console.log("🙋 Creating event RSVPs...");
  let rsvpCount = 0;
  for (const event of events) {
    if (event.category === "PRIVATE_RENTAL") continue;
    
    const numRsvps = randomBetween(5, Math.min(25, event.capacity || 50));
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numRsvps; i++) {
      const statuses = ["GOING", "GOING", "GOING", "MAYBE"] as const;
      await prisma.eventRSVP.create({
        data: {
          userId: shuffledUsers[i].id,
          eventId: event.id,
          status: statuses[randomBetween(0, 3)],
          friendCount: Math.random() > 0.7 ? randomBetween(1, 3) : 0,
        },
      });
      rsvpCount++;
    }
  }
  console.log(`   ✓ Created ${rsvpCount} RSVPs`);

  // Create Listings
  console.log("🛍️ Creating marketplace listings...");
  const listings = [];
  for (const listing of DEMO_LISTINGS) {
    const seller = users[randomBetween(3, users.length - 1)]; // Skip admins/staff
    const created = await prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category as any,
        condition: listing.condition as any,
        status: Math.random() > 0.9 ? "SOLD" : "ACTIVE",
        images: [`https://picsum.photos/seed/${listing.title.replace(/\s/g, "")}/400/300`],
      },
    });
    listings.push(created);
  }
  console.log(`   ✓ Created ${listings.length} listings`);

  // Create some transactions and reviews for sold items
  console.log("💰 Creating transactions and reviews...");
  const soldListings = listings.filter((l) => l.status === "SOLD");
  let txCount = 0;
  let reviewCount = 0;
  
  for (const listing of soldListings) {
    const buyer = users.find((u) => u.id !== listing.sellerId && u.xp >= 500);
    if (!buyer) continue;

    const transaction = await prisma.transaction.create({
      data: {
        listingId: listing.id,
        buyerId: buyer.id,
        sellerId: listing.sellerId,
        amount: listing.price,
        status: "COMPLETED",
        completedAt: new Date(Date.now() - randomBetween(1, 30) * 24 * 60 * 60 * 1000),
      },
    });
    txCount++;

    // Add review
    await prisma.review.create({
      data: {
        transactionId: transaction.id,
        reviewerId: buyer.id,
        revieweeId: listing.sellerId,
        rating: randomBetween(4, 5),
        comment: randomFromArray([
          "Great seller, fast communication!",
          "Item exactly as described. Thanks!",
          "Smooth transaction, would buy again.",
          "Perfect condition, very happy!",
          "Quick meetup, great person!",
        ]),
      },
    });
    reviewCount++;
  }
  console.log(`   ✓ Created ${txCount} transactions`);
  console.log(`   ✓ Created ${reviewCount} reviews`);

  // Create Event Suggestions
  console.log("💡 Creating event suggestions...");
  const suggestions = [];
  for (const suggestion of DEMO_EVENT_SUGGESTIONS) {
    const suggestor = users[randomBetween(5, users.length - 1)];
    const created = await prisma.eventSuggestion.create({
      data: {
        userId: suggestor.id,
        title: suggestion.title,
        description: suggestion.description,
        category: suggestion.category as any,
        voteCount: randomBetween(3, 25),
      },
    });
    suggestions.push(created);
  }
  console.log(`   ✓ Created ${suggestions.length} event suggestions`);

  // Add votes to suggestions
  console.log("🗳️ Creating suggestion votes...");
  let voteCount = 0;
  for (const suggestion of suggestions) {
    const numVotes = randomBetween(3, 15);
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numVotes && i < shuffledUsers.length; i++) {
      if (shuffledUsers[i].id === suggestion.userId) continue;
      try {
        await prisma.eventSuggestionVote.create({
          data: {
            userId: shuffledUsers[i].id,
            suggestionId: suggestion.id,
          },
        });
        voteCount++;
      } catch {
        // Skip duplicate votes
      }
    }
  }
  console.log(`   ✓ Created ${voteCount} votes`);

  // Create Conversations and Messages
  console.log("💬 Creating conversations and messages...");
  
  // Group chat for regulars
  const groupChat = await prisma.conversation.create({
    data: {
      type: "GROUP",
      name: "Kaitif Regulars 🛹",
      isAnnouncement: false,
    },
  });

  // Add top 20 users to group chat
  const regularUsers = users.slice(0, 20);
  for (const user of regularUsers) {
    await prisma.conversationMember.create({
      data: {
        conversationId: groupChat.id,
        userId: user.id,
      },
    });
  }

  // Add some group messages
  const groupMessages = [
    "Who's hitting the park today?",
    "Saturday session is going to be lit! 🔥",
    "Anyone got spare bearings? Mine are shot",
    "Did you guys see the new mini ramp they're building?",
    "Best trick contest next week, who's entering?",
    "Looking for someone to film some clips with",
    "The bowl is so smooth after that resurface!",
    "GG everyone from tonight's session!",
    "Weather looking perfect for tomorrow",
    "New member here! When's the best time to come?",
    "Friday nights are the best, just saying",
    "Anyone selling size 9 skate shoes?",
    "That backside air was insane!! 👀",
    "Workshop tomorrow, don't forget!",
    "Park is empty right now, come through!",
  ];

  for (let i = 0; i < groupMessages.length; i++) {
    const sender = regularUsers[randomBetween(0, regularUsers.length - 1)];
    await prisma.message.create({
      data: {
        conversationId: groupChat.id,
        senderId: sender.id,
        content: groupMessages[i],
        createdAt: new Date(Date.now() - (groupMessages.length - i) * 3600000),
      },
    });
  }

  // Create some DM conversations
  const dmPairs = [
    [0, 5], [1, 8], [3, 10], [4, 12], [6, 15],
    [7, 18], [2, 20], [9, 14], [11, 22], [13, 25],
  ];

  for (const [idx1, idx2] of dmPairs) {
    if (!users[idx1] || !users[idx2]) continue;
    
    const dm = await prisma.conversation.create({
      data: { type: "DM" },
    });

    await prisma.conversationMember.createMany({
      data: [
        { conversationId: dm.id, userId: users[idx1].id },
        { conversationId: dm.id, userId: users[idx2].id },
      ],
    });

    // Add a few messages
    const dmMessages = [
      { sender: idx1, content: "Hey! You going to the park later?" },
      { sender: idx2, content: "Yeah probably around 4, you?" },
      { sender: idx1, content: "Same! See you there 🤙" },
    ];

    for (let i = 0; i < dmMessages.length; i++) {
      await prisma.message.create({
        data: {
          conversationId: dm.id,
          senderId: users[dmMessages[i].sender].id,
          content: dmMessages[i].content,
          createdAt: new Date(Date.now() - (3 - i) * 1800000),
        },
      });
    }
  }

  // Announcement channel
  const announcements = await prisma.conversation.create({
    data: {
      type: "GROUP",
      name: "📢 Kaitif Announcements",
      isAnnouncement: true,
    },
  });

  // Add all users to announcements
  for (const user of users) {
    await prisma.conversationMember.create({
      data: {
        conversationId: announcements.id,
        userId: user.id,
      },
    });
  }

  // Admin announcements
  const admin = users.find((u) => u.role === "ADMIN")!;
  const announcementMessages = [
    "Welcome to the new Kaitif app! 🎉 We're excited to have you here.",
    "Park hours updated: Now open until 10pm on Fridays and Saturdays!",
    "New helmets available for rent at the front desk. Safety first! 🛡️",
    "Best Trick Contest coming up January 25th. Register now in the Events section!",
    "Pro Demo Day announced! Mark your calendars for February 28th. 🌟",
  ];

  for (let i = 0; i < announcementMessages.length; i++) {
    await prisma.message.create({
      data: {
        conversationId: announcements.id,
        senderId: admin.id,
        content: announcementMessages[i],
        createdAt: new Date(Date.now() - (announcementMessages.length - i) * 86400000),
      },
    });
  }

  console.log(`   ✓ Created conversations and messages`);

  console.log("\n✨ Seed completed successfully!\n");
  console.log("Summary:");
  console.log(`   • ${users.length} users`);
  console.log(`   • ${badges.length} badges (${badgeCount} awarded)`);
  console.log(`   • ${challenges.length} challenges (${completionCount} completions)`);
  console.log(`   • ${events.length} events (${rsvpCount} RSVPs)`);
  console.log(`   • ${listings.length} marketplace listings`);
  console.log(`   • ${suggestions.length} event suggestions`);
  console.log(`   • Multiple conversations with messages`);
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { seed };
