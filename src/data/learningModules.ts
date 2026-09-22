export interface LearningModule {
  id: string;
  title: string;
  subtitle: string;
  category: "Budgeting" | "Investing" | "Savings" | "Debt & Credit" | "Taxes" | "Economics";
  readTime: string;
  level: "Beginner" | "Intermediate";
  keyTakeaways: string[];
  content: {
    sectionTitle: string;
    paragraphs: string[];
    example?: string;
  }[];
}

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: "budgeting-50-30-20",
    title: "Mastering the 50/30/20 Budget Rule",
    subtitle: "A flexible, guilt-free framework to organize your monthly income without spreadsheets.",
    category: "Budgeting",
    readTime: "4 min",
    level: "Beginner",
    keyTakeaways: [
      "50% covers mandatory Needs (rent, groceries, utilities, basic travel).",
      "30% is allocated for Wants (eating out, hobbies, subscriptions, shopping).",
      "20% is strictly saved or invested (Emergency fund, SIP, debt prepayment).",
    ],
    content: [
      {
        sectionTitle: "Why Traditional Budgeting Fails",
        paragraphs: [
          "Most people quit budgeting because logging every single cup of tea or bottle of water feels restrictive and exhausting.",
          "The 50/30/20 rule, popularized by Senator Elizabeth Warren, replaces micromanagement with macro-buckets. You only need to track three percentages.",
        ],
        example: "If you take home ₹30,000/month: ₹15,000 goes to essentials, ₹9,000 to lifestyle & hobbies, and ₹6,000 directly to investments/savings.",
      },
      {
        sectionTitle: "How to Classify Needs vs Wants",
        paragraphs: [
          "A 'Need' is anything essential for survival and maintaining basic employment: housing, essential groceries, transport to work, electricity, and health insurance.",
          "A 'Want' is any upgrade or discretionary purchase: streaming subscriptions, branded clothes, restaurant meals, and weekend outings.",
        ],
      },
    ],
  },
  {
    id: "compound-interest",
    title: "The Mathematical Wonder of Compound Interest",
    subtitle: "How starting with ₹500 in your 20s can build more wealth than ₹5,000 in your 30s.",
    category: "Investing",
    readTime: "5 min",
    level: "Beginner",
    keyTakeaways: [
      "Compound interest is interest earned on top of accumulated interest.",
      "Time in the market is drastically more decisive than your monthly contribution size.",
      "The Rule of 72 helps you calculate doubling time in seconds: 72 ÷ Return Rate = Years to Double.",
    ],
    content: [
      {
        sectionTitle: "Linear Growth vs Exponential Growth",
        paragraphs: [
          "Simple interest grows in a straight line: ₹10,000 at 10% simply earns ₹1,000 every single year.",
          "Compound interest is an exponential curve. Year 1 earns ₹1,000. Year 2 earns 10% on ₹11,000 (₹1,100). By Year 25, the annual return alone eclipses your original principal multiple times over!",
        ],
        example: "Investor A starts at age 20 putting ₹2,000/mo into a 12% index fund for 10 years, then stops. Investor B starts at age 30 putting ₹2,000/mo for 30 continuous years. Investor A ends up with MORE money despite investing for only 10 years!",
      },
    ],
  },
  {
    id: "sip-vs-lumpsum",
    title: "SIP vs Lump Sum: The Dollar/Rupee Cost Averaging Advantage",
    subtitle: "Why automated monthly investing beats trying to predict market peaks and valleys.",
    category: "Investing",
    readTime: "4 min",
    level: "Beginner",
    keyTakeaways: [
      "Trying to time market bottoms is a proven losing strategy for 95% of retail investors.",
      "SIP automates buying more units when prices dip and fewer units when prices surge.",
      "It eliminates emotional trading driven by fear and FOMO.",
    ],
    content: [
      {
        sectionTitle: "The Mechanics of Rupee-Cost Averaging",
        paragraphs: [
          "When the stock market drops 10%, a fixed ₹2,000 monthly SIP buys more fund units at a discounted price.",
          "When the market rebounds, those accumulated discounted units accelerate your overall portfolio recovery.",
        ],
      },
    ],
  },
  {
    id: "emergency-fund",
    title: "The Unshakable Emergency Fund",
    subtitle: "Your financial shock absorber against medical surprises, car repairs, and career pauses.",
    category: "Savings",
    readTime: "4 min",
    level: "Beginner",
    keyTakeaways: [
      "Aim for 3 to 6 months of mandatory living expenses.",
      "Keep it in high-yield savings or liquid mutual funds — never volatile stocks or illiquid property.",
      "Never touch this money for vacations, sales, or speculative investments.",
    ],
    content: [
      {
        sectionTitle: "Why Every Investor Needs a Cash Moat",
        paragraphs: [
          "If an unexpected ₹25,000 dental or vehicle emergency strikes and your only money is in equities during a market downturn, you are forced to sell at a loss.",
          "An emergency fund buys you peace of mind and preserves your long-term compounding assets untouched.",
        ],
      },
    ],
  },
  {
    id: "credit-cards-mastery",
    title: "Credit Scores Demystified: 30% Utilization & 36% APR Traps",
    subtitle: "Turn credit cards into interest-free reward engines instead of high-interest debt spirals.",
    category: "Debt & Credit",
    readTime: "5 min",
    level: "Intermediate",
    keyTakeaways: [
      "Always pay the 'Total Amount Due' in full each month, NEVER just the 'Minimum Amount Due'.",
      "Keep total credit utilization strictly under 30% of your limit.",
      "A 750+ credit score unlocks low interest rates on mortgages and business loans.",
    ],
    content: [
      {
        sectionTitle: "The Minimum Due Illusion",
        paragraphs: [
          "Banks set 'minimum payment' around 5% of your balance. If you only pay the minimum on a ₹50,000 card at 36-42% annual APR, it will take over 14 years to clear!",
          "Treat credit cards like debit cards: only charge what you already possess in your bank account.",
        ],
      },
    ],
  },
  {
    id: "inflation-mechanics",
    title: "Inflation: The Silent Tax on Idle Cash",
    subtitle: "Why leaving large savings in a low-interest bank account actually loses money over time.",
    category: "Economics",
    readTime: "3 min",
    level: "Beginner",
    keyTakeaways: [
      "Inflation is the sustained increase in prices, eroding purchasing power.",
      "If inflation is 6% and your savings account yields 3%, your real purchasing return is -3%.",
      "Investing in productive businesses and equities is historically the best defense against inflation.",
    ],
    content: [
      {
        sectionTitle: "Real Return vs Nominal Return",
        paragraphs: [
          "Nominal return is the number on your bank statement.",
          "Real return is Nominal Return minus Inflation. When inflation outpaces interest rates, idle cash secretly loses buying power year after year.",
        ],
      },
    ],
  },
];
