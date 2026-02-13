# Trello MCP Server

Production-quality MCP server for [Trello](https://trello.com/) API integration with 96 comprehensive tools and 18 interactive React apps.

## Features

- **96 Tools** across 14 domains: boards, lists, cards, checklists, members, organizations, labels, actions, custom fields, notifications, search, webhooks, power-ups, and tokens
- **18 React Apps** for rich UI experiences: kanban boards, dashboards, calendars, analytics, and more
- **Full Trello API Coverage**: All major endpoints with proper error handling and rate limiting
- **Type-Safe**: Complete TypeScript types for all Trello objects
- **Production-Ready**: Proper pagination, rate limiting, and error handling

## Setup

```bash
npm install
npm run build
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TRELLO_API_KEY` | Yes | Your Trello API key |
| `TRELLO_TOKEN` | Yes | Your Trello API token |

### Getting Credentials

1. Get your API key: [https://trello.com/app-key](https://trello.com/app-key)
2. Generate a token: Click the "Token" link on the API key page
3. Authorize the token with the scopes you need

## Tools

### Boards (16 tools)
- `trello_list_boards` - List all boards for a member
- `trello_get_board` - Get board details
- `trello_create_board` - Create a new board
- `trello_update_board` - Update board properties
- `trello_delete_board` - Delete a board
- `trello_get_board_members` - Get board members
- `trello_add_board_member` - Add member to board
- `trello_remove_board_member` - Remove member from board
- `trello_get_board_labels` - Get board labels
- `trello_create_board_label` - Create a label
- `trello_get_board_lists` - Get board lists
- `trello_get_board_cards` - Get all cards on board
- `trello_get_board_checklists` - Get board checklists
- `trello_get_board_custom_fields` - Get custom fields
- `trello_get_board_power_ups` - Get enabled power-ups
- `trello_star_board` - Star/unstar a board

### Lists (7 tools)
- `trello_list_lists` - List all lists on board
- `trello_get_list` - Get list details
- `trello_create_list` - Create a new list
- `trello_update_list` - Update list properties
- `trello_archive_list` - Archive/unarchive list
- `trello_move_all_cards_in_list` - Move all cards
- `trello_sort_list` - Sort cards in list

### Cards (20 tools)
- `trello_list_cards` - List cards in a list
- `trello_get_card` - Get card details
- `trello_create_card` - Create a new card
- `trello_update_card` - Update card properties
- `trello_delete_card` - Delete a card
- `trello_move_card` - Move card to different list/board
- `trello_copy_card` - Copy a card
- `trello_add_card_member` - Assign member to card
- `trello_remove_card_member` - Remove member from card
- `trello_add_card_label` - Add label to card
- `trello_remove_card_label` - Remove label from card
- `trello_add_card_comment` - Add comment to card
- `trello_get_card_comments` - Get card comments
- `trello_add_card_attachment` - Add attachment to card
- `trello_get_card_attachments` - Get card attachments
- `trello_add_card_checklist` - Add checklist to card
- `trello_get_card_checklists` - Get card checklists
- `trello_set_card_cover` - Set card cover image
- `trello_set_card_due_date` - Set/update due date
- `trello_mark_card_notifications_read` - Mark notifications read

### Checklists (7 tools)
- `trello_get_checklist` - Get checklist details
- `trello_create_checklist` - Create a checklist
- `trello_update_checklist` - Update checklist
- `trello_delete_checklist` - Delete checklist
- `trello_add_check_item` - Add item to checklist
- `trello_update_check_item` - Update checklist item
- `trello_delete_check_item` - Delete checklist item

### Members (6 tools)
- `trello_get_member` - Get member info
- `trello_get_member_boards` - Get member's boards
- `trello_get_member_organizations` - Get member's organizations
- `trello_get_member_cards` - Get assigned cards
- `trello_get_member_actions` - Get member activity
- `trello_get_member_notifications` - Get notifications

### Organizations (9 tools)
- `trello_list_organizations` - List organizations
- `trello_get_organization` - Get organization details
- `trello_create_organization` - Create organization
- `trello_update_organization` - Update organization
- `trello_delete_organization` - Delete organization
- `trello_get_organization_members` - Get members
- `trello_add_organization_member` - Add member
- `trello_remove_organization_member` - Remove member
- `trello_get_organization_boards` - Get boards

### Labels (4 tools)
- `trello_get_label` - Get label details
- `trello_create_label` - Create a label
- `trello_update_label` - Update label
- `trello_delete_label` - Delete label

### Actions (4 tools)
- `trello_get_action` - Get action details
- `trello_list_actions` - Get activity log
- `trello_get_action_reactions` - Get reactions
- `trello_add_action_reaction` - Add reaction

### Custom Fields (7 tools)
- `trello_list_custom_fields` - List custom fields
- `trello_get_custom_field` - Get field details
- `trello_create_custom_field` - Create custom field
- `trello_update_custom_field` - Update custom field
- `trello_delete_custom_field` - Delete custom field
- `trello_set_custom_field_value` - Set value on card
- `trello_get_custom_field_values` - Get card values

### Notifications (4 tools)
- `trello_list_notifications` - List notifications
- `trello_get_notification` - Get notification details
- `trello_mark_notification_read` - Mark as read
- `trello_mark_all_notifications_read` - Mark all read

### Search (4 tools)
- `trello_search_cards` - Search for cards
- `trello_search_boards` - Search for boards
- `trello_search_members` - Search for members
- `trello_search_everything` - Universal search

### Webhooks (4 tools)
- `trello_list_webhooks` - List webhooks
- `trello_create_webhook` - Create webhook
- `trello_update_webhook` - Update webhook
- `trello_delete_webhook` - Delete webhook

### Power-Ups (3 tools)
- `trello_list_available_power_ups` - List available power-ups
- `trello_enable_power_up` - Enable power-up on board
- `trello_disable_power_up` - Disable power-up

### Tokens (1 tool)
- `trello_get_token_info` - Get token information

## React Apps

### Board Views
- **Board Kanban** - Classic Trello-style kanban with drag-drop
- **Board Dashboard** - Metrics, activity, and analytics
- **Board Table** - Table view with sorting/filtering
- **Board Analytics** - Flow analytics and completion rates

### Card Views
- **Card Detail** - Full card view with all metadata
- **Card Grid** - Grid view across boards
- **Calendar View** - Cards by due date on calendar
- **Due Date Tracker** - Upcoming and overdue cards

### Member & Organization
- **Member Dashboard** - Workload and assigned cards
- **Member Directory** - All workspace members
- **Organization Overview** - Org with boards and members

### Utilities
- **Label Manager** - Label management and usage
- **Activity Feed** - Recent actions across boards
- **Checklist Progress** - Completion tracking
- **Search Results** - Universal search interface
- **Custom Fields Manager** - Custom field management
- **Notification Center** - Notifications with actions
- **Attachment Gallery** - Visual attachment browser

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": ["/path/to/mcp-server-trello/dist/index.js"],
      "env": {
        "TRELLO_API_KEY": "your-api-key",
        "TRELLO_TOKEN": "your-token"
      }
    }
  }
}
```

## Examples

### Create a board with lists and cards
```typescript
// Create board
const board = await callTool('trello_create_board', {
  name: 'My Project',
  desc: 'Project description',
  default_lists: true
});

// Create a card
await callTool('trello_create_card', {
  name: 'First task',
  list_id: 'list-id',
  desc: 'Task description',
  due: '2024-12-31',
  member_ids: ['member-id']
});
```

### Search and organize
```typescript
// Search for cards
const results = await callTool('trello_search_cards', {
  query: 'bug fix',
  limit: 10
});

// Add labels and members
await callTool('trello_add_card_label', {
  card_id: 'card-id',
  label_id: 'label-id'
});

await callTool('trello_add_card_member', {
  card_id: 'card-id',
  member_id: 'member-id'
});
```

### Manage checklists
```typescript
// Add checklist to card
const checklist = await callTool('trello_add_card_checklist', {
  card_id: 'card-id',
  name: 'Tasks'
});

// Add items
await callTool('trello_add_check_item', {
  checklist_id: checklist.id,
  name: 'Complete documentation'
});
```

## API Reference

The server uses the official Trello REST API v1:
- Base URL: `https://api.trello.com/1`
- Authentication: API Key + Token (query parameters)
- Rate Limiting: Automatically handled with backoff
- Documentation: [https://developer.atlassian.com/cloud/trello/rest/](https://developer.atlassian.com/cloud/trello/rest/)

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type check
tsc --noEmit
```

## Architecture

```
trello/
├── src/
│   ├── clients/
│   │   └── trello.ts          # Trello API client
│   ├── tools/
│   │   ├── boards-tools.ts     # Board management tools
│   │   ├── lists-tools.ts      # List management tools
│   │   ├── cards-tools.ts      # Card management tools
│   │   ├── checklists-tools.ts # Checklist tools
│   │   ├── members-tools.ts    # Member tools
│   │   ├── organizations-tools.ts # Organization tools
│   │   ├── labels-tools.ts     # Label tools
│   │   ├── actions-tools.ts    # Activity/action tools
│   │   ├── custom-fields-tools.ts # Custom field tools
│   │   ├── notifications-tools.ts # Notification tools
│   │   ├── search-tools.ts     # Search tools
│   │   ├── webhooks-tools.ts   # Webhook tools
│   │   ├── power-ups-tools.ts  # Power-up tools
│   │   └── tokens-tools.ts     # Token tools
│   ├── types/
│   │   └── trello.ts           # TypeScript type definitions
│   ├── ui/
│   │   └── react-app/          # 18 React apps
│   └── index.ts                # MCP server entry point
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR on GitHub.

## Support

For issues and questions:
- GitHub Issues: [https://github.com/BusyBee3333/mcpengine](https://github.com/BusyBee3333/mcpengine)
- Trello API Docs: [https://developer.atlassian.com/cloud/trello/](https://developer.atlassian.com/cloud/trello/)
