# Fortuna - Product Requirements Document

## 1. Product Overview

**Product Name:** Fortuna  
**Tagline:** "Your vibe check for financial health"  
**Platform:** iOS (Native Swift/SwiftUI)  
**Version:** 1.0 MVP

### 1.1 Vision
Fortuna is a privacy-first financial planning app that uses on-device AI to help users understand their financial health, set goals, and make smarter money decisions. All user data stays local - no cloud storage of sensitive financial information.

### 1.2 Problem Statement
Young adults (Gen Z & Millennials) often feel overwhelmed by traditional financial planning tools. They need:
- A judgment-free zone to assess their financial situation
- Personalized advice that speaks their language
- Privacy-focused tools that don't sell their data
- Simple, actionable insights without the jargon

### 1.3 Solution
An iOS app that:
- Onboards users through conversational, friendly questions
- Generates a fun, relatable "Financial Vibe" profile using local AI
- Provides an AI chatbot for ongoing financial guidance
- Keeps ALL sensitive data on-device

---

## 2. Target Audience

### Primary
- **Age:** 18-35 (Gen Z & Young Millennials)
- **Financial Literacy:** Beginner to Intermediate
- **Tech Savvy:** High (comfortable with apps, AI)
- **Values:** Privacy, authenticity, simplicity

### User Personas

**1. "Starting Out Sarah" (22)**
- Just got first job, minimal savings
- Has student loan debt
- Wants to build good habits early
- Needs: Basic budgeting guidance, debt payoff strategy

**2. "Side Hustle Sam" (27)**
- Multiple income streams
- Some investments, some debt
- Wants to optimize and grow wealth
- Needs: Investment guidance, goal tracking

**3. "Getting Serious Gina" (32)**
- Stable income, thinking about big purchases
- Has retirement accounts, maybe a car loan
- Planning for major life events
- Needs: Long-term planning, risk assessment

---

## 3. Core Features

### 3.1 Onboarding Flow

#### Phase 1: Financial Snapshot
Questions to gather:
- Monthly income (primary job)
- Additional income sources (side hustles, passive income)
- Employment status & industry
- Age
- Dependents (yes/no, how many)
- Monthly fixed expenses estimate
- Current savings amount
- Current debt breakdown:
  - Student loans
  - Credit card debt
  - Car loan
  - Mortgage
  - Other
- Investment accounts (401k, IRA, brokerage, crypto)
- Emergency fund status

#### Phase 2: Risk Profile Assessment
5-7 scenario-based questions to gauge:
- Risk tolerance (conservative → aggressive)
- Time horizon preferences
- Reaction to market volatility
- Financial anxiety levels
- Goal prioritization style

**Example Questions:**
1. "The market just dropped 20%. You..."
   - Panic sell everything 😱
   - Do nothing, wait it out 😐
   - Buy more while it's on sale 🛒
   
2. "You get a $5,000 bonus. First instinct?"
   - Pay off debt immediately
   - Invest it all
   - Split between savings and a treat
   - YOLO vacation 🌴

3. "How do you feel about your current financial situation?"
   - Stressed, I avoid thinking about it
   - It's fine, could be better
   - Pretty confident, got a plan
   - Thriving, let's optimize

### 3.2 Financial Vibe Profiles (AI-Generated)

The local LLM analyzes onboarding data to assign a primary "Financial Vibe" with sub-attributes.

#### Primary Vibes:

| Vibe | Description | Criteria |
|------|-------------|----------|
| **💰 Main Character Energy** | High income, high savings, investments on point | Savings > 6mo expenses, investments growing, low/no bad debt |
| **📈 Glow Up in Progress** | Building wealth, on the right track | Positive net worth, consistent saving, manageable debt |
| **⚖️ The Balancer** | Juggling multiple priorities, holding steady | Mixed financial picture, some debt, some savings |
| **🌱 Planting Seeds** | Just starting out, building foundations | Low savings, possibly new debt, early career |
| **🔥 Debt Slayer Mode** | Focused on crushing debt | High debt-to-income, actively paying down |
| **🎲 Living on the Edge** | High risk, needs guardrails | Low/no emergency fund, high spending, inconsistent income |

#### Risk Sub-Profiles:

| Profile | Description |
|---------|-------------|
| **🐢 Steady Eddie** | Very conservative, prefers safety |
| **🦊 Calculated Risk-Taker** | Balanced approach, thoughtful risks |
| **🦅 Bold Moves Only** | Aggressive, high risk tolerance |
| **🎭 Mood Dependent** | Risk tolerance varies with emotions |

### 3.3 Dashboard (Home Screen)

After onboarding, users land on a personalized dashboard showing:

- **Financial Vibe Badge** with risk profile
- **Net Worth Snapshot** (assets - liabilities)
- **Quick Stats Cards:**
  - Total Savings
  - Total Debt
  - Total Investments
  - Monthly Cash Flow
- **Active Goals** (progress bars)
- **AI Insight of the Day** (contextual tip)
- **Quick Actions** (Update, Chat, Set Goal)

### 3.4 Financial Tracker Tabs

#### Savings Tab
- Total savings across accounts
- Breakdown by account/purpose
- Emergency fund progress (target: 3-6 months expenses)
- Add/edit savings entries
- Historical chart

#### Debt Tab
- Total debt overview
- Breakdown by type with interest rates
- Debt-free date projection
- Payoff strategy suggestion (avalanche vs snowball)
- Add/edit debt entries
- Payment tracking

#### Investments Tab
- Total portfolio value
- Breakdown by type (retirement, brokerage, crypto)
- Simple allocation view
- Add/edit investment entries
- Growth tracking

### 3.5 Goal Setting

Users can create financial goals:
- **Goal Types:**
  - Emergency Fund
  - Debt Payoff
  - Big Purchase (car, vacation, wedding)
  - Investment Target
  - Custom

- **Goal Attributes:**
  - Target amount
  - Target date
  - Priority level
  - Linked accounts (savings/investments)

- **AI-Assisted Goal Planning:**
  - Suggests realistic timelines
  - Recommends monthly contribution
  - Adjusts based on income/expenses

### 3.6 AI Chat (Fortuna Bot)

An embedded chatbot powered by on-device LLM:

**Capabilities:**
- Answer questions about user's finances
- Provide personalized advice based on profile
- Help with "should I buy this?" decisions
- Explain financial concepts simply
- Suggest optimizations

**Context Awareness:**
- Full access to user's financial profile summary
- Understands goals and priorities
- Knows risk tolerance
- Remembers conversation history (session-based)

**Personality:**
- Friendly, non-judgmental
- Uses casual language (not stuffy finance-speak)
- Encouraging but realistic
- Adds appropriate emoji vibes

**Example Interactions:**
```
User: "I want to buy a PS5, should I?"

Fortuna: "Okay let's vibe check this purchase 🎮

Looking at your situation:
• You've got $2,400 in savings
• Your emergency fund is at 73% of goal
• No high-interest debt - nice!

A PS5 is ~$500. That would drop your savings to $1,900 
and set your emergency fund back about 2 weeks.

My take: You're in pretty solid shape. If gaming 
brings you joy and you've been responsible, treat yourself! 
Just maybe wait for a sale? 

Want me to help you find the best deal? 💰"
```

### 3.7 Profile & Settings

- View/edit financial profile
- Re-take risk assessment
- Update personal info
- Export data (JSON)
- Delete all data
- App preferences (notifications, themes)
- About & Privacy Policy

---

## 4. Technical Architecture

### 4.1 Tech Stack

| Component | Technology |
|-----------|------------|
| **Platform** | iOS 17+ |
| **Language** | Swift 5.9+ |
| **UI Framework** | SwiftUI |
| **Local Database** | SwiftData (Core Data successor) |
| **Local LLM** | Apple MLX / Core ML (Phi-3, Llama 3.2, or similar) |
| **Authentication** | Supabase Auth (optional, for backup/sync later) |
| **Charts** | Swift Charts |
| **Security** | Keychain for sensitive data |

### 4.2 Data Architecture

#### Local Storage Schema

```swift
// User Profile
struct UserProfile {
    id: UUID
    createdAt: Date
    age: Int
    employmentStatus: String
    industry: String
    dependents: Int
    monthlyIncome: Decimal
    additionalIncome: Decimal
    monthlyExpenses: Decimal
    financialVibe: String
    riskProfile: String
    lastUpdated: Date
}

// Financial Summary (AI-consumable context)
struct FinancialContext {
    netWorth: Decimal
    totalSavings: Decimal
    totalDebt: Decimal
    totalInvestments: Decimal
    emergencyFundMonths: Float
    debtToIncomeRatio: Float
    savingsRate: Float
    riskScore: Int (1-10)
    vibeProfile: String
    topPriorities: [String]
    generatedSummary: String // AI-generated text summary
}

// Savings Accounts
struct SavingsEntry {
    id: UUID
    name: String
    amount: Decimal
    category: SavingsCategory
    lastUpdated: Date
}

// Debt Entries
struct DebtEntry {
    id: UUID
    name: String
    totalAmount: Decimal
    remainingAmount: Decimal
    interestRate: Float
    minimumPayment: Decimal
    category: DebtCategory
    lastUpdated: Date
}

// Investment Entries
struct InvestmentEntry {
    id: UUID
    name: String
    currentValue: Decimal
    category: InvestmentCategory
    lastUpdated: Date
}

// Goals
struct FinancialGoal {
    id: UUID
    title: String
    targetAmount: Decimal
    currentAmount: Decimal
    targetDate: Date
    category: GoalCategory
    priority: Int
    isActive: Bool
}

// Chat History (session-based)
struct ChatMessage {
    id: UUID
    role: MessageRole // user, assistant
    content: String
    timestamp: Date
}
```

### 4.3 AI Context Management

To efficiently feed context to the local LLM:

1. **On Profile Change:** Regenerate `FinancialContext.generatedSummary`
2. **Summary Format:**
```
User Profile Summary:
- Age: 27, works in tech, no dependents
- Monthly income: $5,500, expenses: ~$3,200
- Financial Vibe: "Glow Up in Progress" 📈
- Risk Profile: "Calculated Risk-Taker" 🦊

Current Snapshot:
- Net Worth: $23,400
- Savings: $8,200 (2.5 months emergency fund)
- Debt: $12,800 (student loans @ 5.2%)
- Investments: $28,000 (401k + brokerage)
- Savings Rate: 18%

Active Goals:
1. Build emergency fund to 4 months ($4,800 to go)
2. Max out 401k this year ($8,500 remaining)

Key Context:
- Solid foundation, room to grow
- Good debt management
- Could increase investment contributions
```

3. **Chat Context:** Prepend summary to every chat interaction
4. **Update Triggers:** Summary regenerates when any financial data changes

### 4.4 Security Considerations

- All financial data stored in encrypted local database
- Sensitive values (actual $ amounts) stored in Keychain
- No financial data transmitted to external servers
- Supabase only stores: user ID, email, auth tokens
- Optional: iCloud backup (encrypted, user opt-in)

---

## 5. User Flows

### 5.1 First-Time User Flow
```
App Launch → Welcome Screen → Sign Up (Supabase) → 
Onboarding Intro → Financial Questions (Phase 1) → 
Risk Assessment (Phase 2) → AI Processing → 
Vibe Reveal Animation → Dashboard
```

### 5.2 Returning User Flow
```
App Launch → Face ID/Passcode → Dashboard
```

### 5.3 Update Financial Data Flow
```
Dashboard → Select Tab (Savings/Debt/Investments) → 
Edit Entry → Save → AI Context Regenerates → 
Return to Tab (updated)
```

### 5.4 Chat Flow
```
Dashboard → Chat Tab → View History → 
Type Message → AI Processes with Context → 
Response Displayed → Continue or Exit
```

### 5.5 Goal Creation Flow
```
Dashboard → "Add Goal" → Select Type → 
Enter Details → AI Suggests Timeline → 
Confirm → Goal Added to Dashboard
```

---

## 6. MVP Scope (v1.0)

### In Scope ✅
- Complete onboarding flow
- Financial vibe + risk profile generation
- Dashboard with key metrics
- Savings/Debt/Investments tracking (basic)
- One active goal
- AI chatbot (basic context awareness)
- Local data storage
- Basic Supabase auth

### Out of Scope (v1.x+) ❌
- Bank account linking
- Automatic transaction import
- Multiple goals with dependencies
- Notification reminders
- Widget support
- Apple Watch companion
- Social features
- Advanced analytics
- Export to financial advisors
- iCloud sync

---

## 7. Success Metrics

### Engagement
- Onboarding completion rate > 70%
- Daily active users returning 3+ times/week
- Average session duration > 3 minutes
- Chat interactions per user per week > 5

### Retention
- Day 1 retention > 60%
- Day 7 retention > 40%
- Day 30 retention > 25%

### Feature Usage
- % users with active goal > 80%
- % users updating data weekly > 50%
- % users using chat feature > 60%

---

## 8. Timeline Estimate

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Design** | 2 weeks | UI/UX designs, prototypes |
| **Core Infrastructure** | 2 weeks | Data models, storage, basic UI shell |
| **Onboarding** | 2 weeks | All onboarding screens, flow logic |
| **AI Integration** | 2 weeks | Local LLM setup, profile generation, chat |
| **Dashboard & Tracking** | 2 weeks | Dashboard, tabs, CRUD operations |
| **Goals & Polish** | 1 week | Goal feature, animations, edge cases |
| **Testing & Launch** | 1 week | QA, TestFlight, App Store submission |

**Total: ~12 weeks for MVP**

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Local LLM performance on older devices | Poor UX | Support iPhone 12+ only, optimize model |
| Users don't complete onboarding | Low adoption | Make it engaging, show progress, allow skip |
| AI gives bad financial advice | Trust loss, liability | Add disclaimers, limit to general guidance |
| Data loss if phone lost | User frustration | Optional encrypted iCloud backup |
| Competitor launches similar | Market share | Focus on personality/vibe differentiation |

---

## 10. Legal & Compliance

- **Privacy Policy:** Clear disclosure that all data is local
- **Disclaimer:** "Not financial advice" - educational tool only
- **Data Handling:** GDPR/CCPA compliant (minimal data collection)
- **Age Restriction:** 18+ (financial data sensitivity)

---

## Appendix A: Competitor Analysis

| App | Strengths | Weaknesses | Fortuna Differentiator |
|-----|-----------|------------|------------------------|
| Mint | Full automation, bank linking | Privacy concerns, ads, overwhelming | Privacy-first, simpler |
| YNAB | Great methodology | Steep learning curve, subscription | More accessible, AI help |
| Copilot | Beautiful UI, smart | Expensive, requires bank link | Free core, local-only option |
| Cleo | AI chat, fun tone | Subscription, data concerns | Local AI, one-time or free |

---

## Appendix B: AI Prompt Templates

### Profile Generation Prompt
```
Based on the following financial data, generate a "Financial Vibe" profile.

User Data:
{onboarding_data_json}

Assign:
1. Primary Vibe (from: Main Character Energy, Glow Up in Progress, The Balancer, Planting Seeds, Debt Slayer Mode, Living on the Edge)
2. Risk Profile (from: Steady Eddie, Calculated Risk-Taker, Bold Moves Only, Mood Dependent)
3. A 2-3 sentence personalized summary in casual, encouraging Gen Z tone
4. Top 3 financial priorities for this user

Respond in JSON format.
```

### Chat System Prompt
```
You are Fortuna, a friendly AI financial buddy. You help users understand their money and make better decisions.

User's Financial Context:
{financial_context_summary}

Guidelines:
- Be casual, warm, and non-judgmental
- Use occasional emojis but don't overdo it
- Give personalized advice based on their specific situation
- If asked about specific investments, remind them you're not a licensed advisor
- Encourage good habits without being preachy
- Keep responses concise (under 150 words usually)
- Reference their Financial Vibe when relevant
```

---

*Document Version: 1.0*  
*Last Updated: January 2026*  
*Author: Fortuna Team*
