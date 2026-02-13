#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TrelloClient } from './clients/trello.js';
import { boardsTools } from './tools/boards-tools.js';
import { listsTools } from './tools/lists-tools.js';
import { cardsTools } from './tools/cards-tools.js';
import { checklistsTools } from './tools/checklists-tools.js';
import { membersTools } from './tools/members-tools.js';
import { organizationsTools } from './tools/organizations-tools.js';
import { labelsTools } from './tools/labels-tools.js';
import { actionsTools } from './tools/actions-tools.js';
import { customFieldsTools } from './tools/custom-fields-tools.js';
import { notificationsTools } from './tools/notifications-tools.js';
import { searchTools } from './tools/search-tools.js';
import { webhooksTools } from './tools/webhooks-tools.js';
import { powerUpsTools } from './tools/power-ups-tools.js';
import { tokensTools } from './tools/tokens-tools.js';

// Collect all tools
const allTools = [
  ...boardsTools,
  ...listsTools,
  ...cardsTools,
  ...checklistsTools,
  ...membersTools,
  ...organizationsTools,
  ...labelsTools,
  ...actionsTools,
  ...customFieldsTools,
  ...notificationsTools,
  ...searchTools,
  ...webhooksTools,
  ...powerUpsTools,
  ...tokensTools,
];

// Environment variables
const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

if (!TRELLO_API_KEY || !TRELLO_TOKEN) {
  console.error('Error: TRELLO_API_KEY and TRELLO_TOKEN environment variables are required');
  process.exit(1);
}

// Initialize Trello client
const trelloClient = new TrelloClient({
  apiKey: TRELLO_API_KEY,
  token: TRELLO_TOKEN,
});

// Create MCP server
const server = new Server(
  {
    name: 'mcp-server-trello',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema.shape,
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = allTools.find(t => t.name === request.params.name);
  
  if (!tool) {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  try {
    const validatedArgs = tool.inputSchema.parse(request.params.arguments);
    const result = await tool.execute(trelloClient, validatedArgs);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Tool execution failed: ${error.message}`);
  }
});

// Register resource handlers (for React apps)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'trello://app/board-kanban',
        name: 'Board Kanban View',
        description: 'Classic Trello-style kanban board with drag-drop cards',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/board-dashboard',
        name: 'Board Dashboard',
        description: 'Board overview with metrics and activity',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/board-table',
        name: 'Board Table View',
        description: 'Table view of all cards with filtering',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/card-detail',
        name: 'Card Detail View',
        description: 'Full card detail with all metadata',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/card-grid',
        name: 'Card Grid View',
        description: 'Grid view of cards across boards',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/calendar-view',
        name: 'Calendar View',
        description: 'Cards by due date on calendar',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/member-dashboard',
        name: 'Member Dashboard',
        description: 'Member workload and assigned cards',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/member-directory',
        name: 'Member Directory',
        description: 'All workspace members with board access',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/org-overview',
        name: 'Organization Overview',
        description: 'Organization with boards and members',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/label-manager',
        name: 'Label Manager',
        description: 'Labels across boards with color coding',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/activity-feed',
        name: 'Activity Feed',
        description: 'Recent actions across boards',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/checklist-progress',
        name: 'Checklist Progress',
        description: 'Checklists across cards with completion',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/search-results',
        name: 'Search Results',
        description: 'Universal search across boards and cards',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/custom-fields-manager',
        name: 'Custom Fields Manager',
        description: 'Custom fields on a board with values',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/notification-center',
        name: 'Notification Center',
        description: 'Notifications with mark-read actions',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/due-date-tracker',
        name: 'Due Date Tracker',
        description: 'Upcoming and overdue cards by urgency',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/attachment-gallery',
        name: 'Attachment Gallery',
        description: 'All attachments across cards',
        mimeType: 'application/vnd.react+json',
      },
      {
        uri: 'trello://app/board-analytics',
        name: 'Board Analytics',
        description: 'Card flow analytics and completion rates',
        mimeType: 'application/vnd.react+json',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const appName = uri.replace('trello://app/', '');
  
  // Import app dynamically
  try {
    const appModule = await import(`./ui/react-app/${appName}.js`);
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: 'application/vnd.react+json',
          text: JSON.stringify(appModule.default),
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Failed to load app ${appName}: ${error.message}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Trello MCP Server running on stdio');
  console.error(`Registered ${allTools.length} tools`);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
