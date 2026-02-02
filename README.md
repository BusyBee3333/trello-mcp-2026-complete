> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/trello)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 🚀 Trello MCP Server — 2026 Complete Version

## 💡 What This Unlocks

**This MCP server gives AI direct access to your entire Trello workspace.** Instead of dragging cards and clicking through boards manually, you just *tell* Claude what you need—and it executes instantly across your entire Kanban workflow.

### 🎯 Trello-Specific Power Moves

The AI can directly control your Trello boards with natural language. Here are **5 real workflows** using the actual tools in this MCP server:

1. **🎯 Board Health Audits**
   - AI uses `list_boards` → `get_board` (with lists and cards) → analyzes card distribution
   - Identifies bottlenecks (too many cards in "In Progress"), stale cards (no updates in 30+ days)
   - *"Show me all my boards, find any with 10+ cards stuck in 'In Progress', and flag boards with no activity in 2 weeks"*

2. **⚡ Bulk Card Management**
   - AI calls `list_cards` with filters to find matching cards across boards
   - Uses `update_card` to batch-update properties (due dates, labels, descriptions)
   - Calls `move_card` to reorganize workflows or migrate cards between boards
   - *"Find all cards labeled 'bug' across my boards, set due date to Friday, and move them to the 'Urgent Fixes' board"*

3. **📋 Sprint Board Initialization**
   - AI uses `create_list` to build standard workflow columns ("Backlog", "To Do", "In Progress", "Review", "Done")
   - Calls `create_card` in batch to populate backlog from a template or previous sprint
   - *"Create a new sprint board with standard dev workflow lists, then create 12 cards from last sprint's backlog"*

4. **🔔 Status Update Automation**
   - AI chains `list_boards` → `list_cards` (filter: due this week) → `add_comment` to post reminders
   - Identifies overdue cards and tags assignees in comments
   - *"Check all cards due this week, add a comment on overdue ones reminding the assignee, and summarize what's at risk"*

5. **🧹 Archive & Cleanup Workflows**
   - AI uses `list_cards` (filter: "Done" or old cards) → `archive_card` to clean up completed work
   - Can also `delete_card` for test/duplicate cards
   - *"Archive all cards in 'Done' columns across my boards from last month, then delete any cards with 'test' in the title"*

### 🔗 The Real Power: Chaining Operations

AI doesn't just execute single commands—it orchestrates **multi-step workflows**:

- **Board Migration** → `list_cards` (source board) → `create_card` (destination) → `move_card` → `archive_card` (source)
- **Weekly Triage** → `list_boards` → `list_cards` (filter: no due date) → `update_card` (set dates) → `add_comment` (notify)
- **Cross-Board Search** → `list_boards` → `list_cards` (each board, filter by label/member) → Generate consolidated report

## 📦 What's Inside

**12 production-ready Trello REST API tools** covering complete Kanban board management:

| Tool | Purpose |
|------|---------|
| `list_boards` | List all boards (filter: open, closed, starred, etc.) |
| `get_board` | Get detailed board info (with lists, cards, members) |
| `list_lists` | Get all lists on a board (filter: open, closed) |
| `list_cards` | Query cards from a board or specific list (filters available) |
| `get_card` | Fetch detailed card info (members, checklists, attachments) |
| `create_card` | Create new cards with metadata (name, desc, labels, members, due dates) |
| `update_card` | Update existing cards (name, desc, due dates, archive status, position) |
| `move_card` | Move cards between lists or boards (cross-board supported) |
| `add_comment` | Add comments to cards (plain text) |
| `create_list` | Create new lists on a board (position control) |
| `archive_card` | Archive (close) a card |
| `delete_card` | Permanently delete a card (cannot be undone) |

All tools include proper error handling, automatic authentication, and full TypeScript types.

## 🚀 Quick Start

### Option 1: Claude Desktop (Local)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/Trello-MCP-2026-Complete.git
   cd trello-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your Trello API credentials:**
   
   Trello uses **API Key + Token** authentication:
   
   - **Get API Key:** Visit [https://trello.com/power-ups/admin](https://trello.com/power-ups/admin)
     - Click "New" to generate a Power-Up (or use existing)
     - Copy your **API Key** (32-character hex string)
   
   - **Generate Token:** Visit this URL (replace `YOUR_API_KEY`):
     ```
     https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=MCPEngage-Server&key=YOUR_API_KEY
     ```
     - Click "Allow" to authorize
     - Copy the **Token** (64-character hex string)

3. **Configure Claude Desktop:**
   
   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "trello": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/trello-mcp-2026-complete/dist/index.js"],
         "env": {
           "TRELLO_API_KEY": "your_32_char_api_key",
           "TRELLO_TOKEN": "your_64_char_token"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop** — the 🔌 icon should show "trello" connected

### Option 2: Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/trello-mcp)

1. Click the button above
2. Set `TRELLO_API_KEY` and `TRELLO_TOKEN` in Railway dashboard
3. Use the Railway URL as your MCP server endpoint

### Option 3: Docker

```bash
docker build -t trello-mcp .
docker run -p 3000:3000 \
  -e TRELLO_API_KEY=your_api_key \
  -e TRELLO_TOKEN=your_token \
  trello-mcp
```

## 🔐 Authentication

**Trello uses API Key + Token** for authentication (OAuth also available but not implemented here).

- **API Key:** Permanent, identifies your app/integration (get from Power-Ups admin)
- **Token:** User-specific, grants read/write access to boards (generate via authorize URL)
- **Permissions:** Token scope controls access (`read`, `write`, `account`)
- **Expiration:** Tokens can be set to never expire (recommended for automation)

📖 **Official docs:** [Trello REST API Authentication](https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/)

The MCP server automatically appends `key` and `token` query parameters to all API requests.

## 🎯 Example Prompts for Kanban Workflows

Once connected to Claude, use these natural language prompts:

**Board Management:**
- *"Show me all my Trello boards, list the number of cards in each, and highlight any with 30+ open cards"*
- *"Get the 'Product Roadmap' board with all lists and cards—show me what's in the backlog"*

**Card Operations:**
- *"Create 3 cards in the 'To Do' list on my Engineering board: 'API integration', 'UI mockups', and 'Database schema'"*
- *"Find all cards with label 'urgent' across my boards and set their due dates to tomorrow"*
- *"Move all cards from 'In Review' to 'Done' on the Sprint 12 board"*

**Workflow Automation:**
- *"List all cards on the Marketing board with no due date, set due dates based on priority labels, and add a comment reminding owners"*
- *"Archive all cards in 'Done' columns across my boards that were completed more than 30 days ago"*
- *"Find cards assigned to me across all boards that are overdue, and add a comment asking for status updates"*

**Board Setup:**
- *"Create a new board for Q2 Planning, add lists for Backlog, In Progress, Review, and Shipped"*
- *"Copy all cards from the 'Backlog' list on Sprint 11 board to the 'To Do' list on Sprint 12 board"*

**Cleanup & Maintenance:**
- *"Show me all archived cards on the Engineering board from last quarter—delete any with 'test' or 'draft' in the title"*
- *"Find boards I haven't accessed in 3 months and list their card counts so I can decide which to close"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Trello account with Power-Ups admin access

### Setup

```bash
git clone https://github.com/BusyBee3333/Trello-MCP-2026-Complete.git
cd trello-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your Trello API key and token
npm run build
npm start
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Project Structure

```
trello-mcp-2026-complete/
├── src/
│   └── index.ts          # Main MCP server + Trello REST API client
├── dist/                 # Compiled JavaScript (after build)
├── package.json
├── tsconfig.json
└── .env.example
```

## 🐛 Troubleshooting

### "Authentication failed" or 401 errors
- Verify both `TRELLO_API_KEY` (32 chars) and `TRELLO_TOKEN` (64 chars) are set
- Check token wasn't revoked at [https://trello.com/my/account](https://trello.com/my/account)
- Ensure token has `read,write` scope (check the authorize URL you used)

### "Board not found" errors
- Board IDs are case-sensitive—use `list_boards` to get exact IDs or shortLinks
- Some boards may be private/inaccessible to your token—check sharing settings

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating config
- Verify paths in `claude_desktop_config.json` are **absolute**
- Check `dist/index.js` exists after build
- View logs: macOS `~/Library/Logs/Claude/mcp*.log`

### Rate limits
- Trello API limits: 300 requests per 10 seconds per token (free tier)
- Paid Trello plans may have higher limits
- Add delays between bulk operations if hitting rate limits

### Cards not moving between boards
- `move_card` requires both `list_id` (destination) and optionally `board_id` for cross-board moves
- Ensure destination list is on the target board
- Trello API automatically handles board migration when moving to a list on a different board

## 📖 Resources

- **[Trello REST API Documentation](https://developer.atlassian.com/cloud/trello/rest/)** — Official API reference
- **[Trello API Introduction](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/)** — Getting started guide
- **[Trello Power-Ups Admin](https://trello.com/power-ups/admin)** — Generate API keys
- **[MCP Protocol Specification](https://modelcontextprotocol.io/)** — How MCP servers work
- **[Claude Desktop Documentation](https://claude.ai/desktop)** — Configure AI integrations

## 🤝 Contributing

Contributions are welcome! Missing a Trello feature? Want to add webhooks, Power-Ups, or Butler automation? Open a PR.

**How to contribute:**

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/add-checklists`)
3. Add your tool definition in `src/index.ts` (follow existing patterns)
4. Test locally with Claude Desktop
5. Commit your changes (`git commit -m 'Add checklist management tools'`)
6. Push to your fork (`git push origin feature/add-checklists`)
7. Open a Pull Request with details

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

You're free to use, modify, and distribute this MCP server for personal or commercial projects.

## 🙏 Credits

Built by **[MCPEngage](https://mcpengage.com)** — AI infrastructure for business software.

This server is part of the **MCPEngage 2026 Complete Series**, providing production-ready MCP servers for 30+ business platforms.

**Want more?** Check out our full catalog:
- [Asana MCP Server](https://github.com/BusyBee3333/Asana-MCP-2026-Complete) — Project management
- [ClickUp MCP Server](https://github.com/BusyBee3333/ClickUp-MCP-2026-Complete) — All-in-one PM
- [Jira MCP Server](https://github.com/BusyBee3333/Jira-MCP-2026-Complete) — Issue tracking
- [Wrike MCP Server](https://github.com/BusyBee3333/Wrike-MCP-2026-Complete) — Work management
- ...and 26 more at [mcpengage.com](https://mcpengage.com)

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage) (invite on mcpengine.pages.dev).
