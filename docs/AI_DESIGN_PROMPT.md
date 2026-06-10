# Fortuna App - AI Design Generation Prompt

> **Usage:** Copy the relevant sections below into your AI design tool (Stitch, Galileo AI, Uizard, etc.) to generate consistent, on-brand UI screens. For best results, generate screens in the order listed and reference previously generated screens for consistency.

---

## 🎯 MASTER CONTEXT PROMPT

Copy this as a "system context" or initial prompt to establish the design direction:

```
Design a premium iOS mobile app called "Fortuna" - a privacy-first financial planning app for Gen Z and Millennials (ages 18-35). 

DESIGN DIRECTION:
Style: "Soft Futurism" - imagine Apple Wallet meets a meditation app. Clean, spacious layouts with subtle depth and gentle motion. Premium but approachable, not corporate or stuffy.

BRAND PERSONALITY:
- Calm and confident (reduces money anxiety)
- Friendly and non-judgmental 
- Modern with playful touches (emojis, casual language)
- Privacy-focused and trustworthy

COLOR PALETTE:
- Primary: Fortune Green #40B05A (fresh, growth, money)
- Secondary: Fortune Purple #986DD7 (premium accent)
- Background: #FAFBFC (light) / #0D0D0F (dark)
- Cards: Pure white with subtle shadows
- Success: #34C759 | Warning: #FF9F0A | Danger: #FF3B30

TYPOGRAPHY:
- Use SF Pro (system font) for body text
- Use SF Pro Rounded for headlines and money displays
- Large, bold numbers for financial figures
- Generous line spacing for readability

UI CHARACTERISTICS:
- Generous whitespace (minimum 16px padding)
- Soft rounded corners (12-20px radius)
- Subtle card shadows (not flat, not heavy)
- 44pt minimum touch targets
- Bottom tab navigation with 5 tabs
- iOS native feel with custom styling

IMAGERY STYLE:
- Emoji as primary iconography for personality
- SF Symbols for UI icons
- No stock photos
- Occasional subtle gradient backgrounds
```

---

## 📱 SCREEN-BY-SCREEN PROMPTS

### SCREEN 1: Welcome / Splash Screen

```
Design a welcome screen for Fortuna, an iOS financial planning app.

LAYOUT:
- Full screen, edge to edge
- Vertically centered content
- Bottom-aligned buttons

CONTENT (top to bottom):
1. App logo: A stylized coin or star symbol with subtle gradient (green to purple)
2. Main headline: "Your money, your vibe." in SF Pro Rounded Bold, 34pt
3. Subheadline: "Private. Personal. Powered by AI that stays on your phone." in SF Pro Regular, 17pt, gray (#4A5056)
4. Primary button: "Get Started" - full width, green (#40B05A), white text, 52px height, 12px radius
5. Secondary text link: "Already have an account? Sign in" - gray text, tappable

STYLE:
- Background: Very light gray (#FAFBFC) or subtle gradient
- Logo should have a gentle floating/breathing animation feel
- Generous spacing between elements (32-48px)
- Safe area padding at bottom (34px+)

MOOD: Welcoming, trustworthy, modern, calm
```

---

### SCREEN 2: Sign Up Screen

```
Design a sign up/registration screen for Fortuna iOS app.

LAYOUT:
- Navigation: Back chevron (top left)
- Scrollable content area
- Sticky button at bottom

CONTENT:
1. Headline: "Create your account" - SF Pro Semibold, 28pt
2. Subtext: "We only need your email to keep your progress safe." - SF Pro Regular, 15pt, gray
3. Email input field:
   - Label: "Email"
   - Placeholder: "your@email.com"
   - Style: 52px height, light gray background (#F2F4F6), 12px radius, no border default
4. Password input field:
   - Label: "Password" 
   - Placeholder: "Create a password"
   - Eye icon toggle for visibility
   - Same style as email
5. Primary button: "Continue" - full width, green, disabled state until valid
6. Divider: "or continue with" text centered between lines
7. Social buttons row: Apple and Google icons in rounded rectangle buttons, side by side

SPACING:
- 24px horizontal padding
- 20px between input fields
- 32px before button

STYLE: Clean, minimal, focused. Input fields should feel soft and approachable.
```

---

### SCREEN 3: Sign In Screen

```
Design a sign in screen for Fortuna iOS app - similar to sign up but simpler.

LAYOUT:
- Back navigation
- Centered content
- Bottom button

CONTENT:
1. Headline: "Welcome back" - SF Pro Rounded Semibold, 28pt
2. Subtext: "Sign in to access your financial profile" - gray, 15pt
3. Email input field (same style as sign up)
4. Password input field with "Forgot password?" link aligned right below
5. Primary button: "Sign In"
6. Social auth options (Apple, Google)

STYLE: Warm, welcoming. Consider a subtle wave emoji 👋 next to headline.
```

---

### SCREEN 4: Onboarding - Intro

```
Design the first onboarding screen for Fortuna - an introduction before questions begin.

LAYOUT:
- Progress indicator: 7 dots at top right, first dot active (pill shape, green)
- Back button top left
- Centered content
- Bottom button

CONTENT:
1. Large emoji or illustration: ✨ or friendly abstract graphic
2. Headline: "Let's get to know your money situation" - SF Pro Rounded Bold, 28pt, centered
3. Subtext: "No judgment, just vibes. We'll ask a few questions to understand where you're at." - SF Pro Regular, 17pt, gray, centered
4. Note card (optional): Small card with lock icon - "Everything stays on your device 🔒" - light purple background
5. Primary button: "Let's Do This"

PROGRESS INDICATOR STYLE:
- 7 small dots (8px), inactive dots are light gray (#E8EBED)
- Active dot is elongated pill (24px width), green (#40B05A)
- 8px gap between dots

MOOD: Encouraging, friendly, sets a positive tone
```

---

### SCREEN 5: Onboarding - Age Question

```
Design an onboarding question screen asking for user's age.

LAYOUT:
- Progress indicator (dot 2 of 7 active)
- Back button
- Large emoji/icon top center
- Question centered
- Input in middle
- Continue button at bottom

CONTENT:
1. Emoji: 🎂 (48pt size)
2. Question: "How old are you?" - SF Pro Rounded Semibold, 24pt
3. Age input: Large number stepper or wheel picker
   - Display current age prominently (SF Pro Rounded Bold, 64pt)
   - Plus/minus buttons or swipe to adjust
   - Range: 18-100
4. Continue button (disabled until age selected)

STYLE:
- The age number should be the focal point
- Use a custom stepper with - and + buttons in circles
- Subtle animation when number changes
```

---

### SCREEN 6: Onboarding - Employment Status

```
Design an onboarding screen asking about employment status.

LAYOUT:
- Standard onboarding layout with progress (dot 3)
- Selection chips/cards for options

CONTENT:
1. Emoji: 💼 (48pt)
2. Question: "What's your work situation?" - SF Pro Rounded Semibold, 24pt
3. Selection options as horizontal/wrapped chips or vertical cards:
   - "Employed full-time"
   - "Employed part-time"
   - "Freelance / Self-employed"
   - "Student"
   - "Between opportunities"
   - "Retired"
4. Continue button (disabled until selection made)

CHIP/CARD STYLE:
- Unselected: Light gray background (#F2F4F6), gray border (#E8EBED), dark text
- Selected: Light green background (#E8F5EC), green border (#40B05A), green checkmark
- Height: 52px for horizontal chips, or 64px for vertical cards
- Full pill radius for chips (9999px) or 12px for cards
```

---

### SCREEN 7: Onboarding - Monthly Income

```
Design an onboarding screen asking about monthly income.

LAYOUT:
- Standard onboarding layout with progress (dot 5)
- Currency input as focal point

CONTENT:
1. Emoji: 💵 (48pt)
2. Question: "What's your monthly income?" - SF Pro Rounded Semibold, 24pt
3. Subtext: "After taxes, your take-home pay" - SF Pro Regular, 15pt, gray
4. Currency input:
   - Large display: "$" + amount (SF Pro Rounded Bold, 42pt)
   - Numeric keypad or tap to edit
   - Could show as "$4,500" format
5. Helper hints below input:
   - Small chips showing ranges: "Under $3k" | "$3-5k" | "$5-8k" | "$8k+" for quick selection
6. Continue button

STYLE:
- The dollar amount should be large and prominent
- Green color for the amount when filled
- Subtle underline or card containing the input
```

---

### SCREEN 8: Onboarding - Debt Entry

```
Design an onboarding screen for entering debt information.

LAYOUT:
- Progress indicator (dot 7)
- Scrollable content for multiple entries

CONTENT:
1. Emoji: 💪 (48pt)
2. Headline: "Let's talk about debt" - SF Pro Rounded Semibold, 24pt
3. Subtext: "It's okay, most people have some. No shame here." - gray, 15pt
4. Debt type cards (toggleable, multi-select):
   - 🎓 Student Loans - with amount input field when selected
   - 💳 Credit Card - with amount input when selected
   - 🚗 Car Loan - with amount input when selected
   - 🏠 Mortgage - with amount input when selected
   - 📝 Other - with amount input when selected
5. "No debt" option as an alternative
6. Continue button

CARD STYLE:
- Each debt type is a card that expands when selected
- Collapsed: Icon + Label + checkbox/toggle on right
- Expanded: Shows amount input field below label
- Selected state: Light green border, green checkbox
```

---

### SCREEN 9: Onboarding - Risk Assessment Question

```
Design a risk assessment question screen with emoji-based answers.

LAYOUT:
- Progress indicator (later dots, around 5-6)
- Fun, engaging design

CONTENT:
1. Emoji: 📉 (48pt)
2. Question: "The market just dropped 20%. You..." - SF Pro Rounded Semibold, 24pt
3. Answer options as large tappable cards:
   
   Card 1: 😱 
   "Panic sell everything"
   
   Card 2: 😐
   "Do nothing, wait it out"
   
   Card 3: 🛒
   "Buy more while it's on sale"
   
   Card 4: 🤷
   "What's a market?"

4. Continue button (appears after selection)

CARD STYLE:
- Vertical stack of 4 cards
- Each card: 80px height, full width
- Large emoji on left (32pt), text on right
- Unselected: White background, subtle border
- Selected: Light green background, green border, subtle scale animation
- 12px gap between cards
```

---

### SCREEN 10: Onboarding - Processing / Loading

```
Design a loading/processing screen shown while AI generates the financial profile.

LAYOUT:
- Centered content
- No navigation (auto-advances)

CONTENT:
1. Animated element: Pulsing/spinning fortune wheel, coin, or abstract loader
2. Main text: "Calculating your vibe..." - SF Pro Rounded Semibold, 24pt
3. Rotating subtext that changes every 2 seconds:
   - "Crunching the numbers..."
   - "Analyzing your situation..."
   - "Finding your financial personality..."
   - "Almost there..."
4. Progress bar or circular progress indicator

ANIMATION SUGGESTIONS:
- Central animated icon (Lottie-style)
- Subtle particle effects or floating dollar signs
- Text fade transitions

MOOD: Anticipation, excitement, modern
```

---

### SCREEN 11: Vibe Reveal Screen

```
Design an exciting reveal screen showing the user's Financial Vibe profile result.

LAYOUT:
- Dark overlay background
- Large centered vibe card
- Results content below card
- CTA button at bottom

CONTENT:
1. Background: Dark semi-transparent overlay (#0D0D0F at 90% opacity)

2. VIBE CARD (centered, 280px wide):
   - Gradient background: Gold gradient (#FFD700 to #FFA500) for "Main Character Energy"
   - Large emoji: 💰 (64pt)
   - Vibe name: "Main Character Energy" - SF Pro Rounded Bold, 28pt, white
   - Risk badge below: Pill shape with "🦊 Calculated Risk-Taker" - white/20% background, white text
   - Card radius: 24px
   - Elevated shadow
   - Subtle glow effect matching gradient color

3. Description below card:
   "You've got solid foundations and you're not afraid to make moves."
   - SF Pro Regular, 17pt, white/80%

4. Priorities section:
   "Your top priorities:"
   - Bullet list in white:
   • "Grow that investment portfolio"
   • "Optimize your tax strategy"  
   • "Build passive income streams"

5. Primary button: "Let's Go! 🚀" - white background, green text, or green background

ANIMATION NOTES:
- Card should scale up with spring animation
- Confetti particles optional
- Elements fade in sequentially

VIBE CARD COLOR VARIANTS (for different results):
- Main Character Energy: Gold gradient (#FFD700 → #FFA500)
- Glow Up in Progress: Green gradient (#40B05A → #2E8C44)
- The Balancer: Blue gradient (#5AC8FA → #007AFF)
- Planting Seeds: Purple gradient (#986DD7 → #663DAA)
- Debt Slayer Mode: Orange gradient (#FF6B35 → #E55100)
- Living on the Edge: Red gradient (#FF3B30 → #CC2D26)
```

---

### SCREEN 12: Dashboard / Home Tab

```
Design the main dashboard home screen for Fortuna app.

LAYOUT:
- Top: Greeting + profile avatar
- Scrollable content area
- Bottom: Tab bar with 5 tabs

CONTENT (top to bottom):

1. HEADER:
   - Left: "Good morning, Sarah ☀️" - SF Pro Semibold, 22pt
   - Right: Profile avatar button (40px circle, or initials)

2. VIBE CARD (hero card):
   - Full width, 160px height
   - Gradient background matching user's vibe (e.g., green for "Glow Up in Progress")
   - Content:
     - Small emoji + vibe name: "📈 Glow Up in Progress" - white, 15pt
     - Label: "Net Worth" - white/60%, 13pt
     - Value: "$23,400" - SF Pro Rounded Bold, 42pt, white
     - Change: "↑ $340 this month" - white/80%, small green badge

3. STAT CARDS (2x2 grid):
   Row 1:
   - Card 1: "Savings" label, "$8,200" value, "↑ 2%" green indicator
   - Card 2: "Debt" label, "$12,800" value, "↓ 3%" green indicator (down is good)
   Row 2:
   - Card 3: "Invested" label, "$28,000" value, "↑ 8%" green indicator
   - Card 4: "Cash Flow" label, "+$2,300" value, "/month" subtitle
   
   Card style: White background, 16px padding, 16px radius, subtle shadow

4. GOALS SECTION:
   - Section header: "Your Goals" with "+ Add" button right-aligned
   - Goal card:
     - Icon + title: "🎯 Emergency Fund"
     - Progress text: "$3,400 / $8,000"
     - Progress bar: 42% filled, green
     - White card, full width

5. AI TIP CARD:
   - Light purple background (#F3EEFA)
   - "💡" icon
   - Text: "You could hit your goal 2 months faster by increasing monthly savings by $100"
   - Tappable (leads to chat)

6. TAB BAR:
   5 tabs with icons and labels:
   - 🏠 Home (active - green)
   - 💰 Savings
   - 💳 Debt
   - 📈 Invest
   - 💬 Chat
   Tab bar: White background with blur, subtle top border, 83px total height

SPACING: 20px horizontal padding, 16px between cards, 24px between sections
```

---

### SCREEN 13: Savings Tab

```
Design the Savings tab screen for Fortuna.

LAYOUT:
- Header with title and add button
- Summary card at top
- Scrollable list of accounts
- Tab bar at bottom

CONTENT:

1. HEADER:
   - Title: "Savings" - SF Pro Semibold, 34pt
   - Right: "+ Add" button (green text or icon)

2. TOTAL CARD:
   - "Total Savings" label - gray, 13pt
   - "$8,200" - SF Pro Rounded Bold, 36pt, black
   - "↑ $150 this month" - green, 15pt

3. EMERGENCY FUND PROGRESS:
   - "Emergency Fund Progress" label
   - Progress bar (62% filled)
   - "2.5 months" current / "4 months" target
   - Light gray background section

4. SECTION DIVIDER: "Accounts" header

5. ACCOUNT LIST (white cards, stacked):
   
   Card 1:
   - Left icon: 🏦 in circle
   - Title: "High Yield Savings"
   - Subtitle: "Marcus • 4.5% APY"
   - Right: "$5,500" + chevron
   
   Card 2:
   - Left icon: 🎯
   - Title: "Vacation Fund"
   - Subtitle: "Ally"
   - Right: "$1,700" + chevron
   
   Card 3:
   - Left icon: 💰
   - Title: "Regular Checking"
   - Subtitle: "Chase"
   - Right: "$1,000" + chevron

CARD STYLE:
- White background
- 16px padding
- 12px radius
- Row height: ~72px
- Subtle shadow
- Chevron icon on right indicates tappable
```

---

### SCREEN 14: Debt Tab

```
Design the Debt management tab screen for Fortuna.

LAYOUT:
- Similar structure to Savings tab
- Additional strategy selector

CONTENT:

1. HEADER: "Debt" + "+ Add" button

2. TOTAL CARD:
   - "Total Debt" label
   - "$12,800" - large, bold
   - "↓ $400 this month 🎉" - green with celebration emoji

3. DEBT-FREE PROJECTION:
   - White card with:
   - "📅 Debt-free by March 2028"
   - "26 months to go"
   - Strategy toggle: "Avalanche ⚡️" selected | "Snowball ❄️" option
   - Small info button explaining strategies

4. DEBT LIST:

   Card 1 - Student Loan:
   - Icon: 🎓
   - Title: "Student Loan"
   - "$10,500 remaining"
   - "5.2% APR • $220/mo minimum"
   - Progress bar showing payoff progress
   - Chevron right
   
   Card 2 - Credit Card:
   - Icon: 💳
   - Title: "Credit Card"
   - "$2,300 remaining"
   - "19.9% APR • $100/mo minimum"
   - Progress bar (smaller progress)
   - Red/orange accent since high interest
   - Chevron right

5. AI TIP CARD:
   - "💡 Pay extra $50 on your credit card to save $340 in interest"
   - Light purple card

SPECIAL: For high-interest debt (>15% APR), add subtle orange/red indicator
```

---

### SCREEN 15: Investments Tab

```
Design the Investments tab screen for Fortuna.

LAYOUT:
- Similar header pattern
- Donut chart for allocation
- Account list

CONTENT:

1. HEADER: "Investments" + "+ Add"

2. TOTAL CARD:
   - "Total Invested" label
   - "$28,000" - large bold
   - "↑ $2,100 all time" - green

3. ALLOCATION CHART:
   - Donut/ring chart (160px diameter)
   - Center: Total amount or "Allocation" label
   - Segments with colors:
     - Retirement (71%): Blue
     - Brokerage (21%): Purple
     - Crypto (8%): Orange
   - Legend below or beside chart

4. ACCOUNTS LIST:

   Card 1 - 401(k):
   - Icon: 🏛️
   - "401(k)"
   - "$20,000"
   - "Fidelity"
   - Blue accent indicator
   
   Card 2 - Brokerage:
   - Icon: 📈
   - "Brokerage"
   - "$5,800"
   - "Robinhood"
   - Purple accent
   
   Card 3 - Crypto:
   - Icon: ₿ or 🪙
   - "Crypto"
   - "$2,200"
   - "Coinbase"
   - Orange accent

CHART STYLE:
- Clean donut chart
- White center
- Smooth segment edges
- Percentage labels on segments or in legend
```

---

### SCREEN 16: Chat Tab

```
Design the AI chat interface for Fortuna.

LAYOUT:
- Header with AI name/status
- Scrollable message area
- Input field fixed at bottom
- Tab bar below

CONTENT:

1. HEADER:
   - "Fortuna" - SF Pro Semibold, 20pt
   - Subtitle: "Your financial bestie 💚" - gray, 13pt
   - Optional: Green dot indicating "active"

2. CHAT MESSAGES:

   AI Message (left aligned):
   - Small Fortuna icon/avatar (28px)
   - Bubble: Light gray background (#F2F4F6)
   - "Hey! How can I help with your money today?"
   - Rounded corners (18px, with sharp bottom-left corner for tail effect)
   - Max width 85%
   
   User Message (right aligned):
   - Bubble: Green background (#40B05A)
   - White text
   - "I want to buy a new laptop. Is it a good idea?"
   - Rounded corners (18px, sharp bottom-right)
   - Max width 80%
   
   AI Response:
   - Multiple lines showing formatted response:
   "Ooh laptop shopping! 💻 Let me check your situation...

   You've got:
   • $8,200 in savings
   • Emergency fund at 2.5 months
   
   What's the budget you're thinking?"

3. CHAT INPUT:
   - Pill-shaped container (24px radius)
   - Light gray background
   - Placeholder: "Type a message..."
   - Send button: Green circle (36px) with white arrow icon
   - Input expands vertically for long messages
   - Min height: 48px

MESSAGE SPACING: 12px between messages, 8px between consecutive same-sender messages
```

---

### SCREEN 17: Add/Edit Entry Sheet

```
Design a bottom sheet modal for adding or editing a financial entry (savings account, debt, etc.).

LAYOUT:
- Bottom sheet presentation (slides up from bottom)
- Drag handle at top
- Scrollable form content
- Sticky save button at bottom

CONTENT:

1. DRAG HANDLE: Centered gray pill (36px wide, 4px tall)

2. TITLE: "Add Savings Account" - SF Pro Semibold, 20pt

3. FORM FIELDS:

   Field 1 - Account Name:
   - Label: "Account Name"
   - Input: Text field, placeholder "e.g., Emergency Fund"
   
   Field 2 - Current Balance:
   - Label: "Current Balance"
   - Input: Currency input with "$" prefix, large number display
   
   Field 3 - Category:
   - Label: "Category"
   - Options: Radio buttons or chips
     ○ Emergency
     ○ General
     ○ Goal-specific
     ○ Other
   
   Field 4 - Institution (optional):
   - Label: "Institution (optional)"
   - Input: Text field, placeholder "e.g., Marcus, Ally"

4. SAVE BUTTON:
   - Full width, green background
   - "Save" text
   - Bottom padding for safe area

5. DELETE OPTION (for edit mode):
   - "Delete Account" - red text, centered below save button
   - Only visible when editing existing entry

SHEET STYLE:
- White background
- 20px border radius on top corners
- 24px horizontal padding
- Subtle shadow at top edge
- Dismissible by drag down or tap outside
```

---

### SCREEN 18: Settings / Profile Screen

```
Design the settings and profile screen for Fortuna.

LAYOUT:
- Navigation bar with back button and title
- Scrollable content
- Grouped list sections

CONTENT:

1. NAV BAR: "←" back button | "Settings" title centered

2. PROFILE HEADER CARD:
   - Avatar: Large circle (80px) with initials or emoji
   - Name: "Sarah Johnson" - SF Pro Semibold, 20pt
   - Email: "sarah@email.com" - gray, 15pt
   - White card with padding

3. VIBE CARD:
   - Shows current vibe: "📈 Glow Up in Progress"
   - Risk profile: "🦊 Calculated Risk-Taker"
   - "Retake Quiz →" link/button
   - Light gradient background matching vibe

4. SECTION: "Financial Profile"
   List items:
   - "Income & Work" → chevron (subtitle: "Update your earnings")
   - "Personal Details" → chevron (subtitle: "Age, dependents")

5. SECTION: "App Settings"
   List items:
   - "Appearance" → chevron (shows current: "System")
   - "Notifications" → chevron
   - "Export My Data" → chevron
   - "Privacy Policy" → chevron
   - "About Fortuna" → chevron

6. SIGN OUT BUTTON:
   - Secondary button style (outlined or light background)
   - "Sign Out" text

7. DELETE DATA:
   - "Delete All Data" - red text link at bottom
   - Small note: "This cannot be undone"

LIST STYLE:
- White cards for each section
- Items have subtle dividers between them
- Chevron icons on right
- 52px row height
```

---

## 🎨 COMPONENT GENERATION PROMPTS

Use these for generating individual components or component libraries:

### Buttons

```
Design a button component library for Fortuna iOS app.

Create 4 button variants:

1. PRIMARY BUTTON:
   - Height: 52px
   - Background: #40B05A (green)
   - Text: White, SF Pro Semibold, 17pt
   - Radius: 12px
   - Full width
   - States: Default, Pressed (darker green, slight scale down), Disabled (50% opacity)

2. SECONDARY BUTTON:
   - Height: 52px
   - Background: Transparent
   - Border: 1.5px #40B05A
   - Text: #40B05A, SF Pro Semibold, 17pt
   - Radius: 12px
   - States: Default, Pressed (light green fill), Disabled

3. GHOST BUTTON:
   - Height: 44px
   - Background: Transparent
   - Text: #4A5056 (gray), SF Pro Regular, 17pt
   - Radius: 8px
   - Used for secondary actions like "Skip" or "Cancel"

4. ICON BUTTON:
   - Size: 44x44px
   - Background: #F2F4F6 (light gray)
   - Icon: 24px, #4A5056
   - Radius: 12px
   - Used for navigation and actions
```

### Input Fields

```
Design input field components for Fortuna iOS app.

1. TEXT INPUT:
   - Height: 52px
   - Background: #F2F4F6 (light gray)
   - Border: None default, 1.5px #40B05A when focused
   - Radius: 12px
   - Padding: 16px horizontal
   - Label above (optional): 13pt, gray
   - Placeholder: 17pt, #8A9199
   - Value: 17pt, #1A1D21
   - States: Default, Focused (green border + subtle shadow), Error (red border), Disabled

2. CURRENCY INPUT:
   - Same base as text input
   - "$" symbol on left, gray
   - Value right-aligned, larger text (24pt)
   - Numeric keypad activation

3. SELECTION CHIPS:
   - Height: 40px
   - Pill radius (9999px)
   - Padding: 10px 16px
   - Unselected: #F2F4F6 bg, #E8EBED border, #1A1D21 text
   - Selected: #E8F5EC bg, #40B05A border, #40B05A text, checkmark icon
```

### Cards

```
Design card components for Fortuna iOS app.

1. STAT CARD (for dashboard grid):
   - Size: Flexible width, ~100px height
   - Background: White
   - Radius: 16px
   - Shadow: 0 2px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)
   - Content:
     - Label: 12pt, gray (#8A9199)
     - Value: 24pt, bold, black
     - Indicator: Small arrow + percentage, green/red

2. VIBE CARD (hero profile card):
   - Width: Full or 280px
   - Height: 160px
   - Background: Gradient (varies by vibe type)
   - Radius: 20px
   - Shadow: Elevated
   - Content: Emoji, vibe name, subtitle, net worth value
   - All text white

3. LIST ITEM CARD:
   - Height: 72px
   - Background: White
   - Radius: 12px
   - Layout: Icon (40px circle) | Title + Subtitle | Value + Chevron
   - Subtle shadow

4. TIP CARD:
   - Background: Light purple (#F3EEFA)
   - Radius: 12px
   - Padding: 16px
   - Content: 💡 icon + text
   - Tappable indicator
```

---

## 🔄 USER FLOW PROMPT

Use this to generate a connected prototype flow:

```
Create a user flow prototype for Fortuna iOS app covering the complete onboarding to dashboard journey.

FLOW SEQUENCE:
1. Welcome Screen → tap "Get Started"
2. Sign Up Screen → enter email/password → tap "Continue"
3. Onboarding Intro → tap "Let's Do This"
4. Age Question → adjust stepper → tap "Continue"
5. Employment Question → select chip → tap "Continue"
6. Income Question → enter amount → tap "Continue"
7. Debt Question → toggle debt types, enter amounts → tap "Continue"
8. Risk Question 1 → select answer card → auto-advance
9. Risk Question 2 → select answer → auto-advance
10. Processing Screen → auto-advance after 3 seconds
11. Vibe Reveal Screen → tap "Let's Go! 🚀"
12. Dashboard (Home Tab) → user can navigate via tab bar

TRANSITIONS:
- Most screens: Slide left (push navigation)
- Vibe Reveal: Fade in with card scale animation
- Tab switches: Cross-fade

Show tappable hotspots and flow connections.
```

---

## 💡 TIPS FOR BEST RESULTS

1. **Generate in order**: Start with Welcome, then Sign Up, then Onboarding screens in sequence. This helps AI maintain consistency.

2. **Reference previous screens**: When generating later screens, mention "consistent with previously generated screens" or "same style as the dashboard."

3. **Specify exact colors**: Always include hex codes, don't just say "green" - say "#40B05A".

4. **Include dimensions**: Specify heights (52px buttons, 72px list items) for accurate sizing.

5. **State variations**: Ask for hover/pressed/disabled states when generating components.

6. **Dark mode**: Generate dark mode variants by changing:
   - Background: #0D0D0F
   - Cards: #1A1B1E
   - Text: #F5F5F7

7. **Export settings**: Request designs at 1x, 2x, 3x for iOS asset generation.

---

*Prompt Version: 1.0*
*For use with: Stitch, Galileo AI, Uizard, Figma AI, or similar tools*
*App: Fortuna iOS*
