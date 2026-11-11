Product Requirements Document
MT Onboarding Stacko Question Game (Web Facilitator Tool)


Version
0.1 (Draft)
Date
11 November 2026
Status
For review
Owner
Nazhif Sulthan Aqila

1. Background
Management Trainee (MT) onboarding sessions need an ice-breaking activity that gets participants talking, thinking, and interacting with each other early in the program. This product supports a physical block-stacking game (Stacko) by providing the facilitator with a web-based question deck: every block in the tower carries a number, and each number maps to a question displayed as a flip card in the web app.
The web app is a facilitator tool. The game itself is physical; the web app never simulates the tower.
2. Objectives
Make MT onboarding sessions more engaging and interactive.
Give the facilitator one simple screen to run the entire question flow, with no paper question lists.
Guarantee question variety in a session: questions already used are visibly marked and are not repeated.
Create a shared "penalty moment" when the tower falls: everyone answers one special question together.
3. Target Users
User
Role
Facilitator (primary)
Operates the web app during the session. Clicks card numbers as blocks are drawn, reads questions aloud, triggers the special question when the tower falls.
MT participants (secondary)
Do not operate the app. They draw blocks, answer questions, and view the screen if it is projected or shared.
4. Game Flow
Participants take turns picking a random block from the tower.
Each block has a number corresponding to a specific question.
The facilitator clicks that number in the web app; the card flips and reveals the question.
The facilitator reads the question aloud and the participant answers it.
After answering, the participant places the block back on top of the tower.
If the tower falls, the facilitator triggers a Special Question in the web app, drawn at random from the special question pool. Everyone must answer that special question.
5. Scope
In scope (v1)
Number grid of 45 regular question cards.
Flip card reveal with used-card marking.
Special Question draw from a pool of 8, with used special questions marked.
Session reset.
English user interface.
Question content loaded from a content data set (45 regular + 8 special), supplied separately by the owner.
Out of scope (v1)
Any digital simulation of the Stacko tower or its physics.
Participant accounts, login, or personal data collection.
Scoring, leaderboards, and timers.
Admin panel for editing questions in the browser (content is updated in the data file).
Multiplayer or multi-device synchronization.
6. Functional Requirements
FR-1: Regular question grid
The home screen displays a grid of 45 cards, numbered 1 to 45, matching the numbers on the physical blocks.
The grid must be readable at a glance so the facilitator and participants can see which numbers are still available.
Card states: Available (default) and Opened (visually distinct, e.g. dimmed or different color).
FR-2: Flip card reveal
Clicking an available card plays a flip animation and reveals the question mapped to that number.
The revealed question is shown large and readable (suitable for projection).
Closing or dismissing the revealed question returns to the grid, and the card is now marked as Opened.
Clicking an already Opened card must not re-open its question as a new turn. (Open item: whether the facilitator may view an opened card's question again for reference. Default assumption: view-only re-open is allowed, the card stays marked Opened.)
FR-3: Used marking (regular questions)
Once a question is revealed, its card stays marked Opened for the rest of the session.
The marking must survive an accidental page refresh within the same session (store state locally in the browser).
FR-4: Special Question mode
A clearly visible "Tower Falls" control triggers the special question flow.
The app draws one question at random from the special question pool of 8, excluding special questions already used in this session.
The special question is presented with the same flip reveal treatment, visually distinct from regular questions (e.g. different card color and a "Special Question" label), because everyone in the room must answer it.
Used special questions are marked as used, and the app shows how many special questions remain in the pool.
If the pool is exhausted (all 8 used), the app informs the facilitator and offers either reshuffling the pool or ending the game. (Default assumption: offer reshuffle.)
FR-5: Session reset
A reset control clears all Opened markings (regular and special) and restores a fresh session.
Reset requires a confirmation step to prevent accidental loss of session progress mid-game.
FR-6: Question content
Question content is data, not hard-coded UI text: 45 regular questions keyed by number 1-45, and 8 special questions in a separate pool.
Content is supplied separately by the owner and loaded into the app without code changes to the layout or logic.
Suggested data format:
{
  "regular": [
    { "number": 1, "question": "..." },
    { "number": 2, "question": "..." }
  ],
  "special": [
    { "id": 1, "question": "..." },
    { "id": 2, "question": "..." }
  ]
}
7. UI / UX Requirements
Interface language: English (all labels, buttons, and system messages). Question content language follows the supplied content set.
Color palette (primary):
Deep teal #003539: primary background / base color.
Lime green #AFEE00: primary accent, used for available cards, highlights, and key actions (including the Special Question draw).
White #FFFFFF: text and card surfaces, for contrast against deep teal.
Opened cards must remain clearly distinguishable from available cards within this palette (e.g. deep teal surface with muted white text, versus lime green for available).
The Special Question presentation must stand out from regular questions while staying in palette (e.g. lime-dominant card with deep teal text).
Visual style: eye-catching and game-like, since the grid is the centerpiece of the session. The grid state (available vs opened) must be distinguishable by color at a distance.
The revealed question view prioritizes readability: large type, high contrast.
Responsive: must work on a laptop screen (primary assumption) and remain usable on a tablet or phone browser.
The Special Question control must be reachable in one click from the grid screen, because it is used in a spontaneous moment (tower just fell).
8. Non-Functional Requirements
Single web page application; no account, backend, or database required for v1.
Runs in a modern desktop browser (Chrome/Edge) without installation.
Session state stored locally in the browser (localStorage or equivalent).
Loads fast and works on venue Wi-Fi; ideally fully usable offline once loaded.
9. Success Criteria
A facilitator can run a full session using only the web app, with no paper question list.
No question is repeated within a session unless the pool is deliberately reshuffled.
Drawing a special question takes no more than two clicks from the grid.
Participants and facilitator can tell at a glance how many regular and special questions remain.
10. Assumptions and Open Items
#
Item
Current assumption
1
Display
Facilitator's laptop, optionally projected. Participants view but do not operate.
2
Block count
45 numbered blocks, matching 45 regular questions (per owner's spec).
3
Question content
Written and supplied by the owner separately: 45 regular + 8 special. Not part of this PRD.
4
Re-opening an opened card
Allowed for view-only reference; card stays marked Opened. To be confirmed.
5
Special pool exhausted
App offers reshuffle. To be confirmed.
6
Branding
Color palette defined: deep teal #003539, lime green #AFEE00, white. Logo requirements not defined yet.
7
Timer per answer
Not included in v1. Candidate for v2.
11. Future Enhancements (v2 candidates)
Optional per-question answer timer.
Facilitator notes field per participant.
Custom branding (program logo and colors).
In-browser question editor for the facilitator.
Sound effects for card flip and tower-fall moments.