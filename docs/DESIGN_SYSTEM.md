# Fortuna - Design System & UI Specification

## Design Philosophy

**Core Principles:**
- **Clarity over cleverness** - Financial data should be instantly readable
- **Calm confidence** - Reduce anxiety around money conversations
- **Delightful details** - Micro-interactions that make finances feel less boring
- **Accessible luxury** - Premium feel without pretension

**Aesthetic Direction:** "Soft Futurism"  
Think: Apple Wallet meets a meditation app. Clean, spacious, with subtle depth and gentle motion.

---

## 1. Design Tokens

### 1.1 Color Palette

#### Primary Colors
```
Fortune Green (Primary)
├── 50:  #E8F5EC
├── 100: #C6E7CE
├── 200: #A0D8AD
├── 300: #7AC98C
├── 400: #5DBD73
├── 500: #40B05A  ← Primary
├── 600: #38A050
├── 700: #2E8C44
├── 800: #257838
├── 900: #165524

Fortune Purple (Secondary/Accent)
├── 50:  #F3EEFA
├── 100: #E1D4F3
├── 200: #CDB7EB
├── 300: #B899E3
├── 400: #A883DD
├── 500: #986DD7  ← Secondary
├── 600: #8A5FCA
├── 700: #784DBA
├── 800: #663DAA
├── 900: #4A2590
```

#### Semantic Colors
```
Success:  #34C759 (Green - gains, positive)
Warning:  #FF9F0A (Amber - caution, attention)
Danger:   #FF3B30 (Red - losses, debt alerts)
Info:     #5AC8FA (Blue - neutral info)
```

#### Neutral Scale
```
Background
├── Primary:   #FAFBFC (main bg)
├── Secondary: #F2F4F6 (cards, surfaces)
├── Tertiary:  #E8EBED (dividers, borders)

Text
├── Primary:   #1A1D21 (headings, key data)
├── Secondary: #4A5056 (body text)
├── Tertiary:  #8A9199 (labels, hints)
├── Inverse:   #FFFFFF (on dark)

Dark Mode Variants
├── Background Primary:   #0D0D0F
├── Background Secondary: #1A1B1E
├── Background Tertiary:  #2A2B30
├── Text Primary:         #F5F5F7
├── Text Secondary:       #A1A1A6
├── Text Tertiary:        #636366
```

#### Vibe Profile Colors
```
Main Character Energy:  #FFD700 (Gold)
Glow Up in Progress:    #40B05A (Green)
The Balancer:           #5AC8FA (Blue)
Planting Seeds:         #986DD7 (Purple)
Debt Slayer Mode:       #FF6B35 (Orange)
Living on the Edge:     #FF3B30 (Red)
```

### 1.2 Typography

**Font Family:** SF Pro (System) + SF Pro Rounded (accents)

```
Display Large    - SF Pro Rounded Bold, 34pt, -0.4 tracking
Display Medium   - SF Pro Rounded Semibold, 28pt, -0.4 tracking
Headline         - SF Pro Semibold, 22pt, -0.3 tracking
Title 1          - SF Pro Semibold, 20pt, 0 tracking
Title 2          - SF Pro Medium, 17pt, 0 tracking
Title 3          - SF Pro Medium, 15pt, 0 tracking
Body             - SF Pro Regular, 17pt, 0 tracking
Body Bold        - SF Pro Semibold, 17pt, 0 tracking
Callout          - SF Pro Regular, 16pt, 0 tracking
Subheadline      - SF Pro Regular, 15pt, 0 tracking
Footnote         - SF Pro Regular, 13pt, 0 tracking
Caption 1        - SF Pro Regular, 12pt, 0 tracking
Caption 2        - SF Pro Regular, 11pt, 0 tracking

Money Display    - SF Pro Rounded Bold, 42pt, -0.5 tracking (for big $ numbers)
Money Secondary  - SF Pro Rounded Medium, 24pt, -0.3 tracking
```

### 1.3 Spacing Scale

```
4px   - xs (tight padding, icon gaps)
8px   - sm (inline spacing)
12px  - md (component internal padding)
16px  - lg (standard padding)
20px  - xl (section gaps)
24px  - 2xl (card padding)
32px  - 3xl (major section breaks)
48px  - 4xl (screen section gaps)
64px  - 5xl (hero spacing)
```

### 1.4 Border Radius

```
4px   - xs (small buttons, tags)
8px   - sm (input fields)
12px  - md (cards, standard)
16px  - lg (large cards)
20px  - xl (modals, sheets)
9999px - full (pills, avatars)
```

### 1.5 Shadows

```
Subtle:
  0 1px 2px rgba(0, 0, 0, 0.04),
  0 1px 3px rgba(0, 0, 0, 0.06)

Card:
  0 2px 4px rgba(0, 0, 0, 0.04),
  0 4px 12px rgba(0, 0, 0, 0.06)

Elevated:
  0 4px 6px rgba(0, 0, 0, 0.05),
  0 10px 24px rgba(0, 0, 0, 0.10)

Modal:
  0 8px 16px rgba(0, 0, 0, 0.08),
  0 20px 40px rgba(0, 0, 0, 0.16)
```

---

## 2. Component Library

### 2.1 Buttons

#### Primary Button
```
Height: 52px
Padding: 16px 24px
Background: Fortune Green 500
Text: White, Body Bold
Border Radius: 12px (md)
Shadow: Subtle

States:
- Hover: Fortune Green 600
- Pressed: Fortune Green 700, scale(0.98)
- Disabled: opacity 0.5
```

#### Secondary Button
```
Height: 52px
Padding: 16px 24px
Background: Transparent
Border: 1.5px Fortune Green 500
Text: Fortune Green 500, Body Bold
Border Radius: 12px (md)

States:
- Hover: Fortune Green 50 bg
- Pressed: Fortune Green 100 bg
```

#### Ghost Button
```
Height: 44px
Padding: 12px 16px
Background: Transparent
Text: Text Secondary, Body
Border Radius: 8px (sm)

States:
- Hover: Background Secondary bg
- Pressed: Background Tertiary bg
```

#### Icon Button
```
Size: 44px x 44px
Background: Background Secondary
Icon: 24px, Text Secondary
Border Radius: 12px (md)
```

### 2.2 Cards

#### Standard Card
```
Background: White (dark: Background Secondary)
Border Radius: 16px (lg)
Padding: 20px
Shadow: Card

Content Structure:
├── Header (optional): Icon + Title
├── Body: Flexible content
└── Footer (optional): Actions
```

#### Stat Card
```
Background: White
Border Radius: 16px (lg)
Padding: 16px
Min Width: 160px

Content:
├── Label: Caption 1, Text Tertiary
├── Value: Money Secondary or Title 1
└── Change Indicator (optional): Caption + arrow
```

#### Vibe Card (Profile Badge)
```
Background: Gradient (vibe color 400 → 600)
Border Radius: 20px (xl)
Padding: 24px
Shadow: Elevated

Content:
├── Emoji: 48pt
├── Title: Display Medium, White
├── Subtitle: Subheadline, White/80%
└── Risk Badge: Pill with icon
```

### 2.3 Input Fields

#### Text Input
```
Height: 52px
Padding: 16px
Background: Background Secondary
Border: 1.5px transparent (focused: Fortune Green 500)
Border Radius: 12px (md)
Text: Body, Text Primary
Placeholder: Body, Text Tertiary

States:
- Default: No border
- Focused: Green border, subtle green shadow
- Error: Red border, red shadow
- Disabled: opacity 0.5
```

#### Currency Input
```
Same as Text Input +
├── Currency Symbol: Title 2, Text Tertiary, left aligned
└── Value: Money Secondary, right aligned
```

#### Selection Chips
```
Height: 40px
Padding: 10px 16px
Background: Background Secondary (selected: Fortune Green 100)
Border: 1.5px Background Tertiary (selected: Fortune Green 500)
Border Radius: 9999px (full)
Text: Subheadline

Arrangement: Horizontal scroll or wrap
Gap: 8px
```

### 2.4 Progress Indicators

#### Linear Progress
```
Height: 8px
Background: Background Tertiary
Fill: Fortune Green 500 (or semantic color)
Border Radius: 4px

Animated: Fill animates on value change
```

#### Circular Progress (Goal)
```
Size: 64px - 120px
Stroke Width: 6px - 10px
Track: Background Tertiary
Fill: Fortune Green 500
Center: Percentage or Icon
```

#### Step Indicator (Onboarding)
```
Dot Size: 8px
Active Dot: 24px width, pill shape
Gap: 8px
Colors: Background Tertiary (inactive), Fortune Green 500 (active/complete)
```

### 2.5 Navigation

#### Tab Bar
```
Height: 83px (including safe area)
Background: White/95% blur (dark: Background Secondary/95%)
Border Top: 0.5px Background Tertiary
Shadow: Subtle (inverted, top)

Tab Item:
├── Icon: 24px SF Symbols
├── Label: Caption 2
├── Active: Fortune Green 500
└── Inactive: Text Tertiary
```

#### Navigation Bar
```
Height: 44px (content) + safe area
Background: Transparent or blur
Title: Headline, centered
Leading/Trailing: Icon buttons or text actions
```

### 2.6 Chat Components

#### User Message Bubble
```
Background: Fortune Green 500
Text: White, Body
Border Radius: 18px, 18px, 4px, 18px
Max Width: 80%
Padding: 12px 16px
Alignment: Right
```

#### AI Message Bubble
```
Background: Background Secondary
Text: Text Primary, Body
Border Radius: 18px, 18px, 18px, 4px
Max Width: 85%
Padding: 12px 16px
Alignment: Left

Optional: AI avatar (Fortuna logo, 28px)
```

#### Chat Input
```
Background: Background Secondary
Border Radius: 24px
Padding: 8px 8px 8px 16px
Min Height: 48px

├── Text Field: Expandable
└── Send Button: 36px circle, Fortune Green 500
```

---

## 3. Screen Inventory & Flows

### 3.1 Screen Map

```
┌─────────────────────────────────────────────────────────────┐
│                        APP STRUCTURE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐                                           │
│  │   Welcome    │ → Auth Flow                               │
│  └──────────────┘                                           │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────┐                                           │
│  │  Onboarding  │ (10-12 screens)                           │
│  │    Flow      │                                           │
│  └──────────────┘                                           │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    MAIN APP                           │   │
│  │  ┌─────────┬─────────┬─────────┬─────────┬────────┐  │   │
│  │  │  Home   │ Savings │  Debt   │ Invest  │  Chat  │  │   │
│  │  │(Dashboard)│       │         │         │        │  │   │
│  │  └─────────┴─────────┴─────────┴─────────┴────────┘  │   │
│  │       │                                      │        │   │
│  │       ├── Goal Detail                        │        │   │
│  │       ├── Add Goal                           │        │   │
│  │       └── Profile/Settings                   │        │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Screen Details

---

#### SCREEN: Welcome
**Purpose:** First impression, value prop, entry point

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         [Fortuna Logo]          │
│         Animated coin/star      │
│                                 │
│      ─────────────────────      │
│                                 │
│        "Your money,             │
│         your vibe."             │
│                                 │
│      Subtext about privacy      │
│      and local AI               │
│                                 │
│                                 │
│                                 │
│      ┌─────────────────────┐    │
│      │   Get Started       │    │
│      └─────────────────────┘    │
│                                 │
│      Already have account?      │
│      Sign in                    │
│                                 │
│─────────────────────────────────│
│            (safe area)          │
└─────────────────────────────────┘
```

**Components:**
- Animated logo (Lottie)
- Display Large headline
- Subheadline body text
- Primary Button
- Ghost text button

**Interactions:**
- Logo has subtle floating animation
- Button has haptic feedback on tap

---

#### SCREEN: Sign Up / Sign In
**Purpose:** Authentication via Supabase

```
┌─────────────────────────────────┐
│ ←                               │
│                                 │
│                                 │
│      Create your account        │
│                                 │
│      We only need your email    │
│      to keep your progress      │
│      safe.                      │
│                                 │
│      ┌─────────────────────┐    │
│      │ Email               │    │
│      └─────────────────────┘    │
│                                 │
│      ┌─────────────────────┐    │
│      │ Password            │    │
│      └─────────────────────┘    │
│                                 │
│      ┌─────────────────────┐    │
│      │   Continue          │    │
│      └─────────────────────┘    │
│                                 │
│      ──── or continue with ──── │
│                                 │
│      [Apple]    [Google]        │
│                                 │
│─────────────────────────────────│
└─────────────────────────────────┘
```

**Components:**
- Back button (nav bar)
- Title 1 headline
- Subheadline description
- Text inputs with validation
- Primary button
- Divider with text
- Social auth buttons (icons in rounded rects)

---

#### SCREENS: Onboarding Flow (Multi-step)

**General Layout for Question Screens:**

```
┌─────────────────────────────────┐
│ ←               ○ ○ ● ○ ○ ○ ○   │
│                                 │
│                                 │
│         [Relevant emoji         │
│          or illustration]       │
│                                 │
│      ─────────────────────      │
│                                 │
│      Question text here,        │
│      friendly and clear?        │
│                                 │
│                                 │
│      [Input component           │
│       varies by question]       │
│                                 │
│                                 │
│                                 │
│                                 │
│                                 │
│      ┌─────────────────────┐    │
│      │   Continue          │    │
│      └─────────────────────┘    │
│                                 │
│─────────────────────────────────│
└─────────────────────────────────┘
```

**Onboarding Screens Sequence:**

| # | Screen | Question | Input Type |
|---|--------|----------|------------|
| 1 | Intro | "Let's get to know your money situation. No judgment, just vibes ✨" | None (just continue) |
| 2 | Age | "How old are you?" | Number stepper |
| 3 | Employment | "What's your work situation?" | Single select chips (Employed FT, PT, Freelance, Student, Between jobs) |
| 4 | Industry | "What industry are you in?" | Searchable list / chips |
| 5 | Income | "What's your monthly income? (after taxes)" | Currency input |
| 6 | Other Income | "Any other income sources?" | Toggle + Currency input if yes |
| 7 | Dependents | "Anyone depending on you financially?" | Number stepper (0+) |
| 8 | Expenses | "Rough monthly expenses estimate?" | Currency input with slider |
| 9 | Savings | "How much do you have in savings?" | Currency input with range hints |
| 10 | Debt | "Let's talk about debt 💪" | Multi-entry form (debt types) |
| 11 | Investments | "Any investments?" | Multi-select + amounts |
| 12 | Risk Q1 | "Market drops 20%. You..." | Single select (emoji options) |
| 13 | Risk Q2 | "$5k bonus. First move?" | Single select |
| 14 | Risk Q3 | "Financial anxiety level?" | Slider 1-5 |
| 15 | Risk Q4 | "Preferred timeline for goals?" | Single select |
| 16 | Risk Q5 | "How do you feel right now?" | Emoji select |
| 17 | Processing | "Calculating your vibe..." | Loading animation |
| 18 | Reveal | "Your Financial Vibe is..." | Animated reveal |

---

#### SCREEN: Vibe Reveal (Post-Onboarding)
**Purpose:** Exciting reveal of user's financial profile

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│      ┌─────────────────────┐    │
│      │                     │    │
│      │    💰               │    │
│      │                     │    │
│      │  Main Character     │    │
│      │     Energy          │    │
│      │                     │    │
│      │  Calculated Risk    │    │
│      │     Taker 🦊        │    │
│      │                     │    │
│      └─────────────────────┘    │
│           (vibe card)           │
│                                 │
│      "You've got solid          │
│       foundations and           │
│       you're not afraid         │
│       to make moves."           │
│                                 │
│      Your top priorities:       │
│      • Grow that investment     │
│      • Optimize tax strategy    │
│      • Build passive income     │
│                                 │
│      ┌─────────────────────┐    │
│      │  Let's Go! 🚀       │    │
│      └─────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Animation Sequence:**
1. Dark overlay fades in
2. Card scales up from center with spring animation
3. Emoji pulses
4. Text fades in staggered
5. Confetti particles (subtle)
6. Button appears last

---

#### SCREEN: Dashboard (Home Tab)
**Purpose:** Overview of financial health, quick actions

```
┌─────────────────────────────────┐
│                          [👤]   │
│                                 │
│  Good morning, Sarah ☀️         │
│                                 │
│  ┌─────────────────────────┐    │
│  │  📈 Glow Up in Progress │    │
│  │     Net Worth           │    │
│  │     $23,400             │    │
│  │     ↑ $340 this month   │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌────────┐ ┌────────┐          │
│  │Savings │ │  Debt  │          │
│  │ $8,200 │ │$12,800 │          │
│  │   ↑2%  │ │   ↓3%  │          │
│  └────────┘ └────────┘          │
│  ┌────────┐ ┌────────┐          │
│  │Invested│ │ Cash   │          │
│  │$28,000 │ │ Flow   │          │
│  │   ↑8%  │ │+$2,300 │          │
│  └────────┘ └────────┘          │
│                                 │
│  Your Goals                     │
│  ┌─────────────────────────┐    │
│  │ 🎯 Emergency Fund       │    │
│  │ $3,400 / $8,000         │    │
│  │ ████████░░░░░░ 42%      │    │
│  └─────────────────────────┘    │
│                                 │
│  💡 Tip: You could hit your     │
│     goal 2 months faster by...  │
│                                 │
│─────────────────────────────────│
│  🏠    💰    💳    📈    💬    │
└─────────────────────────────────┘
```

**Components:**
- Greeting with time-based emoji
- Profile avatar button → Settings
- Large Vibe Card with net worth
- 2x2 Stat Card grid
- Goal progress card(s)
- AI tip card
- Tab bar

**Interactions:**
- Pull to refresh
- Stat cards tap → respective tab
- Goal card tap → Goal detail
- Vibe card tap → Profile detail
- Tip card tap → Chat with context

---

#### SCREEN: Savings Tab
**Purpose:** View and manage savings accounts

```
┌─────────────────────────────────┐
│  Savings              [+ Add]   │
│                                 │
│  ┌─────────────────────────┐    │
│  │  Total Savings          │    │
│  │  $8,200                 │    │
│  │  ↑ $150 this month      │    │
│  └─────────────────────────┘    │
│                                 │
│  Emergency Fund Progress        │
│  ████████████░░░░░ 2.5 months   │
│  Target: 4 months               │
│                                 │
│  ─────────────────────────      │
│                                 │
│  Accounts                       │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🏦 High Yield Savings   │    │
│  │    $5,500               │ >  │
│  │    Marcus • 4.5% APY    │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🎯 Vacation Fund        │    │
│  │    $1,700               │ >  │
│  │    Ally                 │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 💰 Regular Checking     │    │
│  │    $1,000               │ >  │
│  │    Chase                │    │
│  └─────────────────────────┘    │
│                                 │
│─────────────────────────────────│
│  🏠    💰    💳    📈    💬    │
└─────────────────────────────────┘
```

**Interactions:**
- Add button → Add savings sheet
- Account row tap → Edit sheet
- Swipe left on row → Delete (with confirm)

---

#### SCREEN: Debt Tab
**Purpose:** View and manage debts

```
┌─────────────────────────────────┐
│  Debt                 [+ Add]   │
│                                 │
│  ┌─────────────────────────┐    │
│  │  Total Debt             │    │
│  │  $12,800                │    │
│  │  ↓ $400 this month 🎉   │    │
│  └─────────────────────────┘    │
│                                 │
│  Debt-Free Projection           │
│  📅 March 2028 (26 months)      │
│  Strategy: Avalanche ⚡️         │
│  [Switch to Snowball]           │
│                                 │
│  ─────────────────────────      │
│                                 │
│  Debts                          │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🎓 Student Loan         │    │
│  │    $10,500 remaining    │ >  │
│  │    5.2% APR • $220/mo   │    │
│  │    ████████████░░░░     │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 💳 Credit Card          │    │
│  │    $2,300 remaining     │ >  │
│  │    19.9% APR • $100/mo  │    │
│  │    ████░░░░░░░░░░░░     │    │
│  └─────────────────────────┘    │
│                                 │
│  💡 Pay extra $50 on CC to      │
│     save $340 in interest       │
│                                 │
│─────────────────────────────────│
│  🏠    💰    💳    📈    💬    │
└─────────────────────────────────┘
```

**Features:**
- Debt-free countdown
- Strategy toggle (avalanche vs snowball)
- Progress bars per debt
- AI optimization tips

---

#### SCREEN: Investments Tab
**Purpose:** View investment holdings

```
┌─────────────────────────────────┐
│  Investments          [+ Add]   │
│                                 │
│  ┌─────────────────────────┐    │
│  │  Total Invested         │    │
│  │  $28,000                │    │
│  │  ↑ $2,100 all time      │    │
│  └─────────────────────────┘    │
│                                 │
│  Allocation                     │
│  ┌─────────────────────────┐    │
│  │    [Donut Chart]        │    │
│  │    Retirement: 71%      │    │
│  │    Brokerage: 21%       │    │
│  │    Crypto: 8%           │    │
│  └─────────────────────────┘    │
│                                 │
│  ─────────────────────────      │
│                                 │
│  Accounts                       │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🏛️ 401(k)               │    │
│  │    $20,000              │ >  │
│  │    Fidelity             │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📈 Brokerage            │    │
│  │    $5,800               │ >  │
│  │    Robinhood            │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ ₿ Crypto                │    │
│  │    $2,200               │ >  │
│  │    Coinbase             │    │
│  └─────────────────────────┘    │
│                                 │
│─────────────────────────────────│
│  🏠    💰    💳    📈    💬    │
└─────────────────────────────────┘
```

**Features:**
- Total with all-time gain/loss
- Simple donut chart for allocation
- List of accounts with values

---

#### SCREEN: Chat Tab
**Purpose:** AI financial assistant

```
┌─────────────────────────────────┐
│  Fortuna                        │
│  Your financial bestie 💚       │
│                                 │
│  ─────────────────────────      │
│                                 │
│  ┌─────────────────────┐        │
│  │ Hey! How can I help │        │
│  │ with your money     │        │
│  │ today?              │        │
│  └─────────────────────┘ 🌟     │
│                                 │
│            ┌───────────────────┐│
│            │ I want to buy a   ││
│            │ new laptop. Is it ││
│            │ a good idea?      ││
│            └───────────────────┘│
│                                 │
│  ┌─────────────────────┐        │
│  │ Ooh laptop shopping! │       │
│  │ Let me check your   │        │
│  │ situation... 💻      │        │
│  │                     │        │
│  │ You've got:         │        │
│  │ • $8,200 in savings │        │
│  │ • Emergency fund at │        │
│  │   2.5 months        │        │
│  │                     │        │
│  │ What's the budget   │        │
│  │ you're thinking?    │        │
│  └─────────────────────┘ 🌟     │
│                                 │
│            ┌───────────────────┐│
│            │ Around $1,500     ││
│            └───────────────────┘│
│                                 │
│  ┌─────────────────────────┐    │
│  │ Type a message...   [→] │    │
│  └─────────────────────────┘    │
│                                 │
│─────────────────────────────────│
│  🏠    💰    💳    📈    💬    │
└─────────────────────────────────┘
```

**Features:**
- Persistent chat history (session)
- Typing indicator for AI
- Quick action chips (optional)
- Context-aware responses

---

#### SCREEN: Add/Edit Entry Sheet
**Purpose:** Create or modify financial entries

```
┌─────────────────────────────────┐
│  ──────────                     │
│                                 │
│  Add Savings Account            │
│                                 │
│  Account Name                   │
│  ┌─────────────────────────┐    │
│  │ Emergency Fund          │    │
│  └─────────────────────────┘    │
│                                 │
│  Current Balance                │
│  ┌─────────────────────────┐    │
│  │ $                  5,500│    │
│  └─────────────────────────┘    │
│                                 │
│  Category                       │
│  ○ Emergency  ○ General         │
│  ○ Goal-specific  ○ Other       │
│                                 │
│  Institution (optional)         │
│  ┌─────────────────────────┐    │
│  │ Marcus by Goldman       │    │
│  └─────────────────────────┘    │
│                                 │
│                                 │
│      ┌─────────────────────┐    │
│      │   Save              │    │
│      └─────────────────────┘    │
│                                 │
│      [Delete Account]           │
│                                 │
└─────────────────────────────────┘
```

**Presentation:** Bottom sheet, drag to dismiss

---

#### SCREEN: Profile & Settings
**Purpose:** View profile, adjust settings

```
┌─────────────────────────────────┐
│ ←              Settings         │
│                                 │
│  ┌─────────────────────────┐    │
│  │    [Avatar/Emoji]       │    │
│  │    Sarah Johnson        │    │
│  │    sarah@email.com      │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  📈 Glow Up in Progress │    │
│  │  🦊 Calculated Risk     │    │
│  │      [Retake Quiz →]    │    │
│  └─────────────────────────┘    │
│                                 │
│  Financial Profile              │
│  ┌─────────────────────────┐    │
│  │ Income & Work        →  │    │
│  │ Update your earnings    │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Personal Details     →  │    │
│  │ Age, dependents         │    │
│  └─────────────────────────┘    │
│                                 │
│  App Settings                   │
│  ┌─────────────────────────┐    │
│  │ Appearance           →  │    │
│  │ Notifications        →  │    │
│  │ Export My Data       →  │    │
│  │ Privacy Policy       →  │    │
│  │ About Fortuna        →  │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │    Sign Out             │    │
│  └─────────────────────────┘    │
│                                 │
│  [Delete All Data]              │
│                                 │
└─────────────────────────────────┘
```

---

## 4. Animation & Motion Guidelines

### 4.1 Principles
- **Purposeful:** Motion should guide, not distract
- **Quick:** Most animations 200-350ms
- **Natural:** Use spring physics for organic feel
- **Consistent:** Same element = same animation

### 4.2 Timing Functions
```swift
// Standard easing
Animation.easeOut(duration: 0.25)

// Bouncy/playful (reveals, celebrations)
Animation.spring(response: 0.5, dampingFraction: 0.7)

// Smooth slide (sheets, navigation)
Animation.spring(response: 0.35, dampingFraction: 0.85)
```

### 4.3 Common Animations

| Element | Animation | Duration |
|---------|-----------|----------|
| Screen transition | Slide + fade | 350ms |
| Card appear | Scale 0.95→1 + fade | 250ms |
| Button press | Scale 0.98 | 100ms |
| Number change | Count up/down | 400ms |
| Progress bar | Width tween | 500ms |
| Sheet present | Slide up + spring | 400ms |
| Toast/tip appear | Slide + fade | 200ms |
| Tab switch | Cross-fade | 150ms |
| Chat message | Slide up + fade | 250ms |
| Vibe reveal | Multi-stage, 2s total | - |

### 4.4 Micro-interactions
- Haptic feedback on button taps (light)
- Haptic on successful save (medium)
- Haptic on errors (error pattern)
- Subtle pulse on important updates
- Confetti on milestones (goal complete, vibe reveal)

---

## 5. Iconography

### 5.1 Style
- **Primary:** SF Symbols (Apple system icons)
- **Weight:** Regular for UI, Semibold for emphasis
- **Size:** 20-24px for navigation, 16-20px inline

### 5.2 Icon Usage

| Context | Icon Examples |
|---------|---------------|
| Tab: Home | house.fill |
| Tab: Savings | banknote.fill |
| Tab: Debt | creditcard.fill |
| Tab: Invest | chart.line.uptrend.xyaxis |
| Tab: Chat | bubble.left.and.bubble.right.fill |
| Add | plus |
| Settings | gearshape.fill |
| Back | chevron.left |
| Forward/Detail | chevron.right |
| Edit | pencil |
| Delete | trash |
| Success | checkmark.circle.fill |
| Warning | exclamationmark.triangle.fill |
| Info | info.circle.fill |

---

## 6. Accessibility

### 6.1 Requirements
- VoiceOver support for all interactive elements
- Dynamic Type support (accessibility sizes)
- Minimum touch targets: 44x44pt
- Color contrast ratio: 4.5:1 minimum
- Reduce Motion support (disable animations)
- Bold Text support

### 6.2 Implementation Notes
- All images have descriptive alt text
- Currency values announced clearly
- Progress bars include percentage labels
- Charts have text alternatives
- No essential info conveyed by color alone

---

## 7. Dark Mode

All screens fully support dark mode with inverted surfaces:

| Element | Light | Dark |
|---------|-------|------|
| Background | #FAFBFC | #0D0D0F |
| Card surface | #FFFFFF | #1A1B1E |
| Elevated surface | #FFFFFF | #2A2B30 |
| Primary text | #1A1D21 | #F5F5F7 |
| Secondary text | #4A5056 | #A1A1A6 |
| Accent colors | Same | Same (slightly desaturated) |

---

## 8. Responsive Considerations

### Device Support
- iPhone SE (3rd gen) and newer
- Minimum iOS 17
- Support all iPhone screen sizes

### Layout Adaptations
- Stack cards vertically on SE
- 2-column stat grid scales to full width on SE
- Sheet heights adapt to content + safe areas
- Text truncates gracefully with "..."

---

*Design System Version: 1.0*  
*For: Fortuna iOS App*  
*Last Updated: January 2026*
