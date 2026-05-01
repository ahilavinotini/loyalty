// articles.js — Article data store and utilities

const CATEGORIES = [
  'Loyalty Programmes',
  'Demographics & Generational Behaviour',
  'Technology in Loyalty',
  'Merchant Strategy',
  "What Works / What Doesn't",
];

/**
 * Generates a URL-safe slug from an article title and publication date.
 * Format: YYYY-MM-{kebab-title}
 * @param {string} title
 * @param {string} publicationDate — ISO date string (YYYY-MM-DD)
 * @returns {string}
 */
function generateSlug(title, publicationDate) {
  const yearMonth = publicationDate.slice(0, 7); // YYYY-MM
  const kebab = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${yearMonth}-${kebab}`;
}

/**
 * Validates an article object against all required field and constraint rules.
 * @param {object} article
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateArticle(article) {
  const errors = [];

  // Required fields must be non-empty strings
  const requiredFields = ['title', 'author', 'publicationDate', 'category', 'body'];
  for (const field of requiredFields) {
    if (!article || typeof article[field] !== 'string' || article[field].trim() === '') {
      errors.push(field);
    }
  }

  // excerpt must be ≤ 160 characters (if provided)
  if (article && article.excerpt !== undefined && article.excerpt !== null) {
    if (typeof article.excerpt !== 'string' || article.excerpt.length > 160) {
      errors.push('excerpt');
    }
  }

  // category must be one of the CATEGORIES values (only check if category passed the non-empty check)
  if (
    article &&
    typeof article.category === 'string' &&
    article.category.trim() !== '' &&
    !CATEGORIES.includes(article.category)
  ) {
    errors.push('category');
  }

  // publicationDate must be a valid ISO date string (YYYY-MM-DD, parseable as a real date)
  if (
    article &&
    typeof article.publicationDate === 'string' &&
    article.publicationDate.trim() !== ''
  ) {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDatePattern.test(article.publicationDate)) {
      errors.push('publicationDate');
    } else {
      const parsed = new Date(article.publicationDate);
      if (isNaN(parsed.getTime())) {
        errors.push('publicationDate');
      } else {
        // Ensure the date components round-trip correctly (e.g. rejects 2025-02-30)
        const [year, month, day] = article.publicationDate.split('-').map(Number);
        if (
          parsed.getUTCFullYear() !== year ||
          parsed.getUTCMonth() + 1 !== month ||
          parsed.getUTCDate() !== day
        ) {
          errors.push('publicationDate');
        }
      }
    }
  }

  // Deduplicate errors (category and publicationDate could appear twice if both checks fail)
  const uniqueErrors = [...new Set(errors)];

  return uniqueErrors.length === 0
    ? { valid: true, errors: [] }
    : { valid: false, errors: uniqueErrors };
}

// Sample article data
const articles = [
  {
    slug: generateSlug('From Stamp Cards to Super Apps: A Malaysian SME Loyalty Guide', '2025-02-05'),
    title: 'From Stamp Cards to Super Apps: A Malaysian SME Loyalty Guide',
    author: 'The Loyalty Desk',
    publicationDate: '2025-02-05',
    category: 'Merchant Strategy',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    imageAlt: 'Small business owner at a shop counter',
    excerpt: 'Malaysian SMEs have more loyalty tools available than ever — but most are still using a stamp card. Here\'s a practical guide to levelling up.',
    body: `<h2>Where Most SMEs Start — and Get Stuck</h2>
<p>The stamp card is the default loyalty tool for small businesses across Malaysia. Walk into any independent café, dry cleaner, or neighbourhood sundry shop and you will likely find a stack of them near the register. They are cheap to print, require no technology, and customers understand them instantly. For a business just starting to think about loyalty, they are a perfectly reasonable first step.</p>
<p>The problem is that most SMEs never move beyond them. The stamp card becomes the loyalty programme, year after year, even as the business grows and customer expectations shift. The reasons are understandable — time, cost, and the fear of complexity — but the cost of staying put is real. A stamp card tells you nothing about your customers. You cannot contact them between visits. You cannot identify your most valuable regulars. You cannot measure whether the programme is actually driving repeat visits or just rewarding customers who would have come back anyway.</p>
<h2>The Digital Step-Up: eWallet Merchant Programmes</h2>
<p>For Malaysian SMEs ready to move beyond the stamp card, the lowest-friction upgrade is joining an existing eWallet merchant rewards programme. Touch 'n Go eWallet, Boost, and MAE all offer merchant-facing loyalty layers that require minimal setup — typically just a QR code at the counter. Customers earn cashback or points automatically when they pay, and the merchant receives transaction data through a simple dashboard.</p>
<p>The cost is a small merchant discount rate on qualifying transactions, typically between 0.5% and 1.5% depending on the programme and transaction volume. For most SMEs, this is comparable to or lower than the cost of printing and managing physical stamp cards when staff time is factored in. The data advantage alone — knowing how often individual customers visit, what they spend, and when they last transacted — is worth the switch for any business serious about growth.</p>
<h2>Building Your Own Programme: When It Makes Sense</h2>
<p>A standalone loyalty programme — your own app, your own points currency, your own redemption catalogue — makes sense for SMEs that have outgrown coalition programmes and want direct relationships with their customers. The threshold is roughly 500 to 1,000 active members: below that, the overhead of running a standalone programme outweighs the benefits.</p>
<p>For businesses at that scale, several affordable platforms cater specifically to Malaysian SMEs. Stamp Me, Perx, and various white-label solutions from local fintech providers offer monthly subscription models starting from RM150 to RM500, with no upfront development cost. The key features to prioritise are: mobile-first member experience, automated birthday and anniversary rewards, and a simple dashboard that shows member activity without requiring a data analyst to interpret it.</p>
<h2>The One Thing That Matters More Than the Technology</h2>
<p>Across every loyalty programme format — stamp card, eWallet, standalone app — the single biggest predictor of success for Malaysian SMEs is staff engagement. A programme that frontline staff actively mention, explain, and encourage will outperform a technically superior programme that staff ignore. Before investing in any loyalty technology, invest in a 30-minute briefing with your team. Explain what the programme does, why it matters, and what you want them to say to customers. That conversation will deliver more ROI than any feature upgrade.</p>`,
  },
  {
    slug: generateSlug('Why Malaysia\'s Loyalty Programmes Are Failing Millennials', '2025-03-10'),
    title: "Why Malaysia's Loyalty Programmes Are Failing Millennials",
    author: 'The Loyalty Desk',
    publicationDate: '2025-03-10',
    category: 'Demographics & Generational Behaviour',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    imageAlt: 'Young people using smartphones in a mall',
    excerpt: 'Malaysian millennials are abandoning loyalty programmes in droves. Here\'s what the data says — and what brands keep getting wrong.',
    body: `<h2>The Millennial Loyalty Gap</h2>
<p>Walk into any Malaysian shopping mall and you will be handed a loyalty card within minutes. Petrol stations, pharmacies, supermarkets, and coffee chains all compete for a slot in your wallet. Yet survey after survey shows that Malaysian millennials — broadly those born between 1981 and 1996 — are the demographic most likely to sign up for a programme and then never use it again.</p>
<p>The reasons are structural, not attitudinal. Millennials are not disloyal by nature; they are time-poor and expectation-rich. They grew up watching their parents clip coupons and save Green Shield stamps, and they absorbed the lesson that loyalty should be rewarded. What they reject is the friction: the physical card that gets lost, the points that expire before they accumulate to anything meaningful, the redemption catalogue full of items nobody wants.</p>
<h2>What the Numbers Show</h2>
<p>A 2024 study by a regional consultancy found that the average Malaysian millennial is enrolled in 4.7 loyalty programmes but actively engages with fewer than two. The gap between enrolment and engagement is the real problem. Brands celebrate sign-up numbers while ignoring the silent churn happening in the months that follow.</p>
<p>The programmes that do retain millennial members share a few traits: instant gratification (cashback credited the same day), mobile-first redemption (no physical card required), and personalisation that goes beyond a birthday discount. Programmes that still require a physical card or a minimum spend of RM200 before any reward is visible are fighting a losing battle with this cohort.</p>
<h2>The Path Forward</h2>
<p>Brands that want to win back disengaged millennials need to start by auditing their redemption experience. If a member cannot redeem a reward in under three taps on a smartphone, the programme is already behind. The second step is shortening the time-to-first-reward: the longer a new member waits to feel the benefit, the less likely they are to stay. Some of the most successful programmes in the region now offer a welcome reward redeemable on the first transaction — a small cost that pays for itself in lifetime engagement.</p>`,
  },
  {
    slug: generateSlug('Five Affordable Loyalty Tools Built for Malaysian SMEs', '2025-06-18'),
    title: 'Five Affordable Loyalty Tools Built for Malaysian SMEs',
    author: 'The Loyalty Desk',
    publicationDate: '2025-06-18',
    category: 'Merchant Strategy',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    imageAlt: 'Mobile payment and loyalty app on smartphone',
    excerpt: 'You don\'t need a big budget to run a real loyalty programme. These five tools are built for Malaysian SMEs and won\'t break the bank.',
    body: `<h2>The Budget Myth</h2>
<p>One of the most persistent misconceptions among Malaysian small business owners is that a proper loyalty programme requires a significant technology budget. This was true a decade ago. It is not true today. The market for SME loyalty tools has matured considerably, and there are now several platforms specifically designed for businesses with fewer than 10 staff, a single location, and a monthly marketing budget measured in hundreds rather than thousands of ringgit.</p>
<p>What follows is a practical overview of five tools that Malaysian SME owners are using right now, with honest assessments of what each does well and where it falls short.</p>
<h2>1. Touch 'n Go eWallet Merchant Rewards</h2>
<p>The simplest entry point for most Malaysian SMEs. Customers earn DuitNow points or cashback automatically when they pay via TNG eWallet. Setup requires nothing more than a merchant QR code, which most businesses already have. The merchant dashboard shows transaction history and basic customer frequency data. The limitation is that you are participating in TNG's ecosystem, not building your own — you cannot contact customers directly or customise the reward structure.</p>
<p><strong>Best for:</strong> F&B, retail, and service businesses that already accept TNG eWallet payments and want a zero-effort loyalty layer.</p>
<h2>2. Stamp Me</h2>
<p>A digital stamp card platform that replicates the familiar stamp card mechanic on a smartphone. Customers download the Stamp Me app, scan a QR code at your counter to collect stamps, and redeem a reward when their card is full. The merchant dashboard shows active members, stamp activity, and redemption rates. Pricing starts at around RM80 per month for a single location.</p>
<p><strong>Best for:</strong> Businesses whose customers are already comfortable with stamp cards and want a digital version with basic analytics.</p>
<h2>3. Perx</h2>
<p>A more fully featured loyalty platform with support for points, tiers, and targeted campaigns. Perx is used by a mix of SMEs and mid-market brands across SEA, and its Malaysian merchant base includes F&B chains, gyms, and specialty retailers. The platform includes a customer-facing app, push notification campaigns, and a reasonably powerful segmentation tool. Pricing is higher than Stamp Me — expect RM300 to RM800 per month depending on member volume — but the feature set justifies the cost for businesses with an active member base above 500.</p>
<p><strong>Best for:</strong> Growing SMEs that want to run targeted promotions and have the staff capacity to manage a more active programme.</p>
<h2>4. Boost Biz</h2>
<p>Boost's merchant-facing product includes a loyalty component that integrates with the Boost eWallet. Similar to TNG's offering, it provides automatic cashback for customers who pay via Boost, with a merchant dashboard for transaction analytics. Boost Biz also includes basic invoicing and inventory tools, making it a reasonable all-in-one option for very small businesses that want to consolidate their tools.</p>
<p><strong>Best for:</strong> Micro-businesses that want loyalty as part of a broader business management tool rather than a standalone programme.</p>
<h2>5. WhatsApp + Google Sheets (The Manual Option)</h2>
<p>Not a platform, but worth including because it is what many successful small Malaysian businesses actually use. A WhatsApp broadcast list for communicating with regulars, combined with a simple Google Sheet tracking customer visits and rewards, costs nothing and can be surprisingly effective for businesses with fewer than 200 active customers. The ceiling is low — it does not scale and offers no automation — but for a hawker stall, a home baker, or a single-chair salon, it is often the right tool for the stage of the business.</p>
<p><strong>Best for:</strong> Very early-stage businesses or those with a tight-knit regular customer base where personal relationships are the primary loyalty driver.</p>
<h2>Choosing the Right Tool</h2>
<p>The right tool depends on three things: your current customer volume, your staff's capacity to manage the programme, and how much you want to own the customer relationship versus participate in someone else's ecosystem. Start with the simplest option that gives you data. You can always upgrade; the harder problem is getting customers enrolled in the first place.</p>`,
  },
  {
    slug: generateSlug('AI-Powered Personalisation in Loyalty: Hype vs Reality', '2025-08-15'),
    title: 'AI-Powered Personalisation in Loyalty: Hype vs Reality',
    author: 'The Loyalty Desk',
    publicationDate: '2025-08-15',
    category: 'Technology in Loyalty',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    imageAlt: 'AI and data visualisation concept',
    excerpt: 'Every loyalty vendor now promises AI personalisation. But what does it actually deliver — and where does it still fall short for SEA markets?',
    body: `<h2>The Personalisation Promise</h2>
<p>Spend ten minutes at any loyalty industry conference and you will hear the word "personalisation" more times than you can count. Vendors promise AI engines that know what each member wants before the member does, delivering the right offer at the right moment through the right channel. The pitch is compelling. The reality, for most programmes operating in Malaysia and the broader South East Asian market, is considerably more modest.</p>
<p>The gap between promise and delivery is not primarily a technology problem. The algorithms exist and they work. The gap is a data problem. Effective personalisation requires clean, longitudinal transaction data — ideally two or more years of purchase history per member, linked across channels. Most loyalty programmes in the region do not have this. They have fragmented data spread across point-of-sale systems, mobile apps, and third-party delivery platforms that do not talk to each other.</p>
<h2>Where AI Is Actually Delivering Value</h2>
<p>Despite the data challenges, there are areas where AI-driven personalisation is producing measurable results in SEA loyalty programmes. Churn prediction is the most mature application: models trained on engagement patterns can identify members who are likely to lapse 60 to 90 days before they actually do, giving programme managers time to intervene with a targeted retention offer. Brands that have deployed churn models consistently report a 15 to 25 percent improvement in retention rates among the at-risk segment.</p>
<p>Next-best-offer engines are the second area of genuine progress. Rather than sending the same promotion to every member, these systems score each member against a catalogue of available offers and select the one most likely to drive a transaction. The lift over blanket promotions is real, though it requires a minimum member base of around 50,000 active members before the models have enough signal to outperform a well-segmented manual approach.</p>
<h2>What to Watch in the Next Two Years</h2>
<p>The most significant near-term development is the integration of large language models into loyalty communications. Several regional programmes are piloting LLM-generated email and push notification copy that adapts tone and content to individual member profiles. Early results suggest meaningful improvements in open and click-through rates. The risk — and it is a real one — is that poorly governed LLM outputs can produce communications that feel intrusive or culturally tone-deaf in markets as diverse as Malaysia, Indonesia, and the Philippines. Brands moving into this space need robust human review processes before they scale.</p>`,
  },
  {
    slug: generateSlug('The Small Merchant Loyalty Playbook: What Actually Works', '2025-11-03'),
    title: 'The Small Merchant Loyalty Playbook: What Actually Works',
    author: 'The Loyalty Desk',
    publicationDate: '2025-11-03',
    category: 'Merchant Strategy',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    imageAlt: 'Independent retail shop interior',
    excerpt: 'Independent F&B and retail merchants in Malaysia are finding that simple, well-executed loyalty beats complex programmes every time.',
    body: `<h2>Why Small Merchants Struggle with Loyalty</h2>
<p>The loyalty industry has a large-merchant bias. Most of the research, most of the vendor solutions, and most of the case studies focus on programmes run by banks, telcos, airlines, and national retail chains. Independent merchants — the kopitiam owner, the neighbourhood pharmacy, the single-outlet fashion boutique — are largely left to figure it out on their own, usually with a stamp card and a prayer.</p>
<p>The stamp card is not inherently bad. It is simple, requires no technology, and is immediately understood by customers of every age and background. The problem is that it offers no data, no ability to communicate with members between visits, and no protection against the customer who photographs a completed card and prints copies. For merchants who want to grow beyond a single location or understand their customer base, the stamp card hits a ceiling quickly.</p>
<h2>The Coalition Option</h2>
<p>The most cost-effective loyalty strategy for small Malaysian merchants is joining an existing coalition programme rather than building a standalone scheme. Programmes like Boost, Touch 'n Go eWallet's rewards layer, and various bank-linked merchant networks allow independent merchants to offer earn-and-burn functionality without any upfront technology investment. The merchant pays a small percentage of each qualifying transaction; the programme operator handles everything else.</p>
<p>The trade-off is data ownership. In a coalition programme, the merchant typically receives aggregated transaction data but not individual member profiles. This is sufficient for understanding peak trading periods and average basket sizes, but insufficient for personalised outreach. Merchants who want to build direct relationships with their best customers will eventually need a standalone CRM layer on top of any coalition participation.</p>
<h2>Three Things That Work Regardless of Programme Type</h2>
<p>Across the independent merchants that have built genuinely loyal customer bases in Malaysia, three practices appear consistently. First, staff training: the most technically sophisticated loyalty programme fails if frontline staff do not mention it, explain it, or encourage sign-up. Second, visible progress: customers who can see how close they are to their next reward visit more frequently than those who cannot. Third, surprise rewards: occasional unexpected bonuses — a free item on a quiet Tuesday, double points during a slow period — generate disproportionate goodwill and social sharing. None of these require expensive technology. All of them require consistent execution.</p>`,
  },
  {
    slug: generateSlug('Points Expiry: The Loyalty Programme Feature Members Hate Most', '2026-01-12'),
    title: "Points Expiry: The Loyalty Programme Feature Members Hate Most",
    author: 'The Loyalty Desk',
    publicationDate: '2026-01-12',
    category: "What Works / What Doesn't",
    image: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800&q=80',
    imageAlt: 'Expired loyalty card and frustrated customer',
    excerpt: 'Points expiry is a liability management tool dressed up as a programme feature. Here\'s why it destroys trust — and what to do instead.',
    body: `<h2>The Expiry Problem</h2>
<p>Ask any loyalty programme member in Malaysia what frustrates them most and points expiry will appear near the top of almost every list. The scenario is familiar: a member accumulates points over several months, gets close to a meaningful redemption threshold, and then receives a notification that their points are about to expire — or worse, discovers after the fact that they already have. The emotional response is not mild disappointment. It is betrayal.</p>
<p>Programme operators defend expiry policies on financial grounds, and the argument has merit. Unredeemed points are a liability on the balance sheet. If every member redeemed every point simultaneously, most programmes would face a significant cash outflow. Expiry policies manage this liability by forcing redemption or cancelling the obligation. From a treasury perspective, this is rational. From a member experience perspective, it is corrosive.</p>
<h2>The Trust Cost of Expiry</h2>
<p>The financial logic of expiry ignores a more important number: the lifetime value of a member who feels cheated versus one who feels valued. Research across multiple markets consistently shows that members who experience a negative expiry event — losing points they were actively saving — are significantly more likely to disengage from the programme entirely. The short-term liability reduction is real; the long-term revenue loss from disengagement is larger.</p>
<p>The programmes that have moved away from hard expiry policies and replaced them with activity-based extensions — points remain valid as long as the member transacts at least once every 12 months — report higher engagement rates and lower churn. The liability is still managed, because inactive members are by definition not earning new points, but the member experience is transformed. Instead of a punitive deadline, the programme communicates a simple, fair rule: stay active and your points stay alive.</p>
<h2>Better Alternatives to Hard Expiry</h2>
<p>For programme operators who cannot eliminate expiry entirely, several approaches reduce the trust damage. Generous advance notice — 90 days minimum, not 14 — gives members time to plan a redemption. Partial redemption options, allowing members to use points for small rewards rather than requiring a large minimum, reduce the likelihood that points accumulate to an expiry-vulnerable balance. And expiry reminders framed as opportunities ("Your points are worth RM12 — here's what you can do with them") perform significantly better than those framed as threats. The underlying policy may be the same; the member's experience of it is entirely different.</p>`,
  },
  {
    slug: generateSlug('Gen Z and Loyalty Programmes: Building for the Next Wave', '2026-07-01'),
    title: 'Gen Z and Loyalty Programmes: Building for the Next Wave',
    author: 'The Loyalty Desk',
    publicationDate: '2026-07-01',
    category: 'Demographics & Generational Behaviour',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
    imageAlt: 'Gen Z using social media on smartphones',
    excerpt: 'Gen Z in Malaysia and SEA are entering peak spending years. Loyalty programmes built for boomers and millennials will need to change to keep up.',
    body: `<h2>Who Is Gen Z in the SEA Context?</h2>
<p>Generation Z — broadly those born between 1997 and 2012 — is the first cohort in South East Asia to have grown up entirely in the smartphone era. For Malaysian Gen Z consumers, the smartphone is not a device they adopted; it is the primary lens through which they experience commerce, entertainment, and social connection. This has profound implications for loyalty programme design, most of which the industry has not yet fully absorbed.</p>
<p>Unlike millennials, who remember a pre-digital retail world and can contextualise digital loyalty against physical predecessors, Gen Z has no such reference point. A loyalty programme that requires any interaction outside a smartphone — a physical card, a printed voucher, a phone call to customer service — is not merely inconvenient for this cohort. It is conceptually strange, like being asked to send a fax.</p>
<h2>Values-Based Loyalty</h2>
<p>The more significant difference between Gen Z and previous cohorts is not technological but values-driven. Research across SEA markets consistently shows that Gen Z consumers place higher weight on brand values alignment when deciding where to spend. A loyalty programme that offers good financial rewards but is associated with a brand perceived as environmentally irresponsible or socially indifferent will struggle to retain Gen Z members regardless of its earn rate.</p>
<p>This creates an opportunity for programmes that can credibly connect loyalty participation to positive outcomes beyond personal financial benefit. Programmes that allow members to donate points to verified charitable causes, offset carbon through redemptions, or earn bonus points for sustainable purchasing choices are seeing stronger Gen Z engagement than those offering purely transactional rewards. The challenge is authenticity: Gen Z consumers are highly attuned to greenwashing and performative social responsibility, and a poorly executed values programme can do more damage than no values programme at all.</p>
<h2>Designing for Gen Z Without Alienating Everyone Else</h2>
<p>The practical challenge for programme managers is that Gen Z is not yet the dominant spending cohort — that remains millennials and Gen X — but will be within a decade. Programmes that redesign entirely around Gen Z preferences risk alienating their current most valuable members. The answer is layered design: a mobile-first core experience that satisfies Gen Z expectations, with optional physical touchpoints retained for members who prefer them. The programme's values positioning should be genuine and consistent, not a campaign layer applied over a transactional foundation. Brands that get this balance right in the next three to five years will be well positioned as the generational spending shift accelerates.</p>`,
  },
];
