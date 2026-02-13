# Trello MCP React Apps

18 self-contained React applications for the Trello MCP server. Each app is a complete, standalone UI that can be run independently with Vite.

## Apps Overview

### Board Views
1. **board-kanban** (port 3000) - Classic Trello-style kanban board with drag-and-drop
2. **board-dashboard** (port 3001) - Board overview with card counts, member activity, label usage
3. **board-table** (port 3002) - Spreadsheet-style table view with sorting and filtering
4. **board-analytics** (port 3017) - Card flow analytics, completion rates, productivity metrics

### Card Management
5. **card-detail** (port 3003) - Full card view with checklists, comments, attachments, due dates
6. **card-grid** (port 3004) - Grid view of all cards across boards with filters
7. **due-date-tracker** (port 3015) - Upcoming and overdue cards with visual alerts

### Calendar & Time
8. **calendar-view** (port 3005) - Monthly calendar view of cards by due date

### Members & Teams
9. **member-dashboard** (port 3006) - Individual member workload, assigned cards, overdue items
10. **member-directory** (port 3007) - All workspace members with contact info and stats

### Organization
11. **org-overview** (port 3008) - Organization dashboard with all boards and members

### Labels & Fields
12. **label-manager** (port 3009) - Label usage across boards with color coding
13. **custom-fields-manager** (port 3013) - Custom field editor for cards

### Activity & Notifications
14. **activity-feed** (port 3010) - Recent actions across all boards
15. **notification-center** (port 3014) - Notifications with read/unread status

### Checklists & Progress
16. **checklist-progress** (port 3011) - All checklists with completion percentages

### Search & Discovery
17. **search-results** (port 3012) - Universal search across cards, boards, and members

### Attachments
18. **attachment-gallery** (port 3016) - All attachments with file type filtering

## Running an App

Each app is self-contained with its own dependencies. To run any app:

```bash
cd src/ui/react-app/{app-name}
npm install
npm run dev
```

For example:
```bash
cd src/ui/react-app/board-kanban
npm install
npm run dev
# Opens on http://localhost:3000
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** for dev server and building
- **Dark theme** throughout all apps
- **Inline styles** - no external CSS dependencies
- **Self-contained** - shared components are inlined in each app

## App Structure

Each app follows this structure:
```
{app-name}/
├── App.tsx          # Main React component with all logic
├── index.html       # HTML entry point
└── vite.config.ts   # Vite configuration
```

## Design Principles

- **Dark theme**: `#1a1a1a` background, `#2a2a2a` cards, `#fff` text
- **Self-contained**: No shared dependencies, each app is fully independent
- **Client-side first**: Mock data included for demo purposes
- **Responsive**: Grid layouts adapt to screen size
- **Interactive**: Hover effects, transitions, drag-and-drop where applicable

## Data Integration

Currently using mock data. To integrate with actual Trello MCP tools:

1. Import the MCP client in each App.tsx
2. Replace mock data loading functions with actual MCP tool calls
3. Use the 14 available Trello tools from `src/tools/`

## Available MCP Tools

The Trello server provides these tools (2680 LOC total):
- boards-tools.ts
- cards-tools.ts
- lists-tools.ts
- members-tools.ts
- labels-tools.ts
- checklists-tools.ts
- actions-tools.ts
- custom-fields-tools.ts
- notifications-tools.ts
- organizations-tools.ts
- power-ups-tools.ts
- search-tools.ts
- tokens-tools.ts
- webhooks-tools.ts

## Development

Each app runs on a different port (3000-3017) so you can run multiple apps simultaneously for testing.

## Building for Production

```bash
cd src/ui/react-app/{app-name}
npm run build
```

Outputs to `dist/` directory.
