#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "trello";
const MCP_VERSION = "1.0.0";
const API_BASE_URL = "https://api.trello.com/1";

// ============================================
// API CLIENT - Trello REST API
// ============================================
class TrelloClient {
  private apiKey: string;
  private token: string;
  private baseUrl: string;

  constructor(apiKey: string, token: string) {
    this.apiKey = apiKey;
    this.token = token;
    this.baseUrl = API_BASE_URL;
  }

  private addAuth(url: string): string {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}key=${this.apiKey}&token=${this.token}`;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = this.addAuth(`${this.baseUrl}${endpoint}`);
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Trello API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    // Handle 200 OK with no content
    const text = await response.text();
    if (!text) return { success: true };
    return JSON.parse(text);
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

// ============================================
// TOOL DEFINITIONS - Trello API
// ============================================
const tools = [
  {
    name: "list_boards",
    description: "List all boards for the authenticated user",
    inputSchema: {
      type: "object" as const,
      properties: {
        filter: { 
          type: "string", 
          enum: ["all", "closed", "members", "open", "organization", "public", "starred"],
          description: "Filter boards by type" 
        },
        fields: { type: "string", description: "Comma-separated list of fields to return (default: name,url)" },
      },
    },
  },
  {
    name: "get_board",
    description: "Get a specific board by ID with detailed information",
    inputSchema: {
      type: "object" as const,
      properties: {
        board_id: { type: "string", description: "The board ID or shortLink" },
        lists: { type: "string", enum: ["all", "closed", "none", "open"], description: "Include lists on the board" },
        cards: { type: "string", enum: ["all", "closed", "none", "open", "visible"], description: "Include cards on the board" },
        members: { type: "boolean", description: "Include board members" },
      },
      required: ["board_id"],
    },
  },
  {
    name: "list_lists",
    description: "List all lists on a board",
    inputSchema: {
      type: "object" as const,
      properties: {
        board_id: { type: "string", description: "The board ID" },
        filter: { type: "string", enum: ["all", "closed", "none", "open"], description: "Filter lists" },
        cards: { type: "string", enum: ["all", "closed", "none", "open"], description: "Include cards in each list" },
      },
      required: ["board_id"],
    },
  },
  {
    name: "list_cards",
    description: "List all cards on a board or in a specific list",
    inputSchema: {
      type: "object" as const,
      properties: {
        board_id: { type: "string", description: "The board ID (required if no list_id)" },
        list_id: { type: "string", description: "The list ID (optional, filters to specific list)" },
        filter: { type: "string", enum: ["all", "closed", "none", "open", "visible"], description: "Filter cards" },
        fields: { type: "string", description: "Comma-separated list of fields to return" },
      },
    },
  },
  {
    name: "get_card",
    description: "Get a specific card by ID with detailed information",
    inputSchema: {
      type: "object" as const,
      properties: {
        card_id: { type: "string", description: "The card ID or shortLink" },
        members: { type: "boolean", description: "Include card members" },
        checklists: { type: "string", enum: ["all", "none"], description: "Include checklists" },
        attachments: { type: "boolean", description: "Include attachments" },
      },
      required: ["card_id"],
    },
  },
  {
    name: "create_card",
    description: "Create a new card on a list",
    inputSchema: {
      type: "object" as const,
      properties: {
        list_id: { type: "string", description: "The list ID to create the card in" },
        name: { type: "string", description: "Card name/title" },
        desc: { type: "string", description: "Card description (supports Markdown)" },
        pos: { type: "string", description: "Position: 'top', 'bottom', or a positive number" },
        due: { type: "string", description: "Due date (ISO 8601 format or null)" },
        dueComplete: { type: "boolean", description: "Whether the due date is complete" },
        idMembers: { type: "array", items: { type: "string" }, description: "Member IDs to assign" },
        idLabels: { type: "array", items: { type: "string" }, description: "Label IDs to apply" },
        urlSource: { type: "string", description: "URL to attach to the card" },
      },
      required: ["list_id", "name"],
    },
  },
  {
    name: "update_card",
    description: "Update an existing card's properties",
    inputSchema: {
      type: "object" as const,
      properties: {
        card_id: { type: "string", description: "The card ID" },
        name: { type: "string", description: "New card name" },
        desc: { type: "string", description: "New description" },
        closed: { type: "boolean", description: "Archive/unarchive the card" },
        due: { type: "string", description: "New due date (ISO 8601 format or null to remove)" },
        dueComplete: { type: "boolean", description: "Mark due date complete/incomplete" },
        pos: { type: "string", description: "New position: 'top', 'bottom', or a positive number" },
      },
      required: ["card_id"],
    },
  },
  {
    name: "move_card",
    description: "Move a card to a different list or board",
    inputSchema: {
      type: "object" as const,
      properties: {
        card_id: { type: "string", description: "The card ID to move" },
        list_id: { type: "string", description: "Destination list ID" },
        board_id: { type: "string", description: "Destination board ID (optional, for cross-board moves)" },
        pos: { type: "string", description: "Position in destination list: 'top', 'bottom', or number" },
      },
      required: ["card_id", "list_id"],
    },
  },
  {
    name: "add_comment",
    description: "Add a comment to a card",
    inputSchema: {
      type: "object" as const,
      properties: {
        card_id: { type: "string", description: "The card ID" },
        text: { type: "string", description: "Comment text" },
      },
      required: ["card_id", "text"],
    },
  },
  {
    name: "create_list",
    description: "Create a new list on a board",
    inputSchema: {
      type: "object" as const,
      properties: {
        board_id: { type: "string", description: "The board ID" },
        name: { type: "string", description: "List name" },
        pos: { type: "string", description: "Position: 'top', 'bottom', or a positive number" },
      },
      required: ["board_id", "name"],
    },
  },
  {
    name: "archive_card",
    description: "Archive (close) a card",
    inputSchema: {
      type: "object" as const,
      properties: {
        card_id: { type: "string", description: "The card ID to archive" },
      },
      required: ["card_id"],
    },
  },
  {
    name: "delete_card",
    description: "Permanently delete a card (cannot be undone)",
    inputSchema: {
      type: "object" as const,
      properties: {
        card_id: { type: "string", description: "The card ID to delete" },
      },
      required: ["card_id"],
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: TrelloClient, name: string, args: any) {
  switch (name) {
    case "list_boards": {
      const params = new URLSearchParams();
      params.append("filter", args.filter || "open");
      params.append("fields", args.fields || "name,url,shortLink,desc,closed");
      return await client.get(`/members/me/boards?${params.toString()}`);
    }

    case "get_board": {
      const { board_id, lists, cards, members } = args;
      const params = new URLSearchParams();
      if (lists) params.append("lists", lists);
      if (cards) params.append("cards", cards);
      if (members) params.append("members", "true");
      const queryString = params.toString();
      return await client.get(`/boards/${board_id}${queryString ? '?' + queryString : ''}`);
    }

    case "list_lists": {
      const { board_id, filter, cards } = args;
      const params = new URLSearchParams();
      if (filter) params.append("filter", filter);
      if (cards) params.append("cards", cards);
      const queryString = params.toString();
      return await client.get(`/boards/${board_id}/lists${queryString ? '?' + queryString : ''}`);
    }

    case "list_cards": {
      const { board_id, list_id, filter, fields } = args;
      const params = new URLSearchParams();
      if (filter) params.append("filter", filter);
      if (fields) params.append("fields", fields);
      const queryString = params.toString();
      
      if (list_id) {
        return await client.get(`/lists/${list_id}/cards${queryString ? '?' + queryString : ''}`);
      } else if (board_id) {
        return await client.get(`/boards/${board_id}/cards${queryString ? '?' + queryString : ''}`);
      } else {
        throw new Error("Either board_id or list_id is required");
      }
    }

    case "get_card": {
      const { card_id, members, checklists, attachments } = args;
      const params = new URLSearchParams();
      if (members) params.append("members", "true");
      if (checklists) params.append("checklists", checklists);
      if (attachments) params.append("attachments", "true");
      const queryString = params.toString();
      return await client.get(`/cards/${card_id}${queryString ? '?' + queryString : ''}`);
    }

    case "create_card": {
      const { list_id, name, desc, pos, due, dueComplete, idMembers, idLabels, urlSource } = args;
      const params = new URLSearchParams();
      params.append("idList", list_id);
      params.append("name", name);
      if (desc) params.append("desc", desc);
      if (pos) params.append("pos", pos);
      if (due) params.append("due", due);
      if (dueComplete !== undefined) params.append("dueComplete", String(dueComplete));
      if (idMembers) params.append("idMembers", idMembers.join(","));
      if (idLabels) params.append("idLabels", idLabels.join(","));
      if (urlSource) params.append("urlSource", urlSource);
      return await client.post(`/cards?${params.toString()}`);
    }

    case "update_card": {
      const { card_id, name, desc, closed, due, dueComplete, pos } = args;
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (desc !== undefined) params.append("desc", desc);
      if (closed !== undefined) params.append("closed", String(closed));
      if (due !== undefined) params.append("due", due || "null");
      if (dueComplete !== undefined) params.append("dueComplete", String(dueComplete));
      if (pos) params.append("pos", pos);
      return await client.put(`/cards/${card_id}?${params.toString()}`);
    }

    case "move_card": {
      const { card_id, list_id, board_id, pos } = args;
      const params = new URLSearchParams();
      params.append("idList", list_id);
      if (board_id) params.append("idBoard", board_id);
      if (pos) params.append("pos", pos);
      return await client.put(`/cards/${card_id}?${params.toString()}`);
    }

    case "add_comment": {
      const { card_id, text } = args;
      const params = new URLSearchParams();
      params.append("text", text);
      return await client.post(`/cards/${card_id}/actions/comments?${params.toString()}`);
    }

    case "create_list": {
      const { board_id, name, pos } = args;
      const params = new URLSearchParams();
      params.append("name", name);
      params.append("idBoard", board_id);
      if (pos) params.append("pos", pos);
      return await client.post(`/lists?${params.toString()}`);
    }

    case "archive_card": {
      const { card_id } = args;
      return await client.put(`/cards/${card_id}?closed=true`);
    }

    case "delete_card": {
      const { card_id } = args;
      return await client.delete(`/cards/${card_id}`);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const apiKey = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;

  if (!apiKey || !token) {
    console.error("Error: Required environment variables:");
    console.error("  TRELLO_API_KEY - Your Trello API key");
    console.error("  TRELLO_TOKEN   - Your Trello auth token");
    console.error("\nGet your API key from: https://trello.com/power-ups/admin");
    console.error("Generate a token from: https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=MCP-Server&key=YOUR_API_KEY");
    process.exit(1);
  }

  const client = new TrelloClient(apiKey, token);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
