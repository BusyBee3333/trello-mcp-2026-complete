import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const boardsTools = [
  {
    name: 'trello_list_boards',
    description: 'List all boards for a member (defaults to current user)',
    inputSchema: z.object({
      member_id: z.string().optional().describe('Member ID (default: "me")'),
      filter: z.enum(['all', 'open', 'closed', 'starred', 'organization', 'public']).optional().describe('Filter boards by status'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const boards = await client.getBoards(args.member_id || 'me', args.filter || 'all');
      return { boards, count: boards.length };
    },
  },
  {
    name: 'trello_get_board',
    description: 'Get detailed information about a specific board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      fields: z.array(z.string()).optional().describe('Specific fields to return'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.getBoard(args.board_id, args.fields);
    },
  },
  {
    name: 'trello_create_board',
    description: 'Create a new board',
    inputSchema: z.object({
      name: z.string().describe('Board name'),
      desc: z.string().optional().describe('Board description'),
      id_organization: z.string().optional().describe('Organization ID'),
      prefs_permission_level: z.enum(['private', 'org', 'public']).optional().describe('Permission level'),
      default_lists: z.boolean().optional().describe('Create default lists (To Do, Doing, Done)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.createBoard({
        name: args.name,
        desc: args.desc,
        idOrganization: args.id_organization,
        prefs_permissionLevel: args.prefs_permission_level,
        defaultLists: args.default_lists ?? true,
      });
    },
  },
  {
    name: 'trello_update_board',
    description: 'Update board properties',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      name: z.string().optional().describe('New board name'),
      desc: z.string().optional().describe('New description'),
      closed: z.boolean().optional().describe('Archive/unarchive the board'),
      prefs_permission_level: z.enum(['private', 'org', 'public']).optional().describe('Permission level'),
      prefs_comments: z.enum(['disabled', 'members', 'observers', 'org', 'public']).optional().describe('Who can comment'),
      prefs_voting: z.enum(['disabled', 'enabled']).optional().describe('Enable voting'),
      prefs_self_join: z.boolean().optional().describe('Allow members to join'),
      prefs_card_covers: z.boolean().optional().describe('Show card covers'),
      prefs_background: z.string().optional().describe('Background color or image ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const { board_id, ...updates } = args;
      const data: any = {};
      if (args.name) data.name = args.name;
      if (args.desc !== undefined) data.desc = args.desc;
      if (args.closed !== undefined) data.closed = args.closed;
      if (args.prefs_permission_level) data.prefs_permissionLevel = args.prefs_permission_level;
      if (args.prefs_comments) data.prefs_comments = args.prefs_comments;
      if (args.prefs_voting) data.prefs_voting = args.prefs_voting;
      if (args.prefs_self_join !== undefined) data.prefs_selfJoin = args.prefs_self_join;
      if (args.prefs_card_covers !== undefined) data.prefs_cardCovers = args.prefs_card_covers;
      if (args.prefs_background) data.prefs_background = args.prefs_background;
      return await client.updateBoard(board_id, data);
    },
  },
  {
    name: 'trello_delete_board',
    description: 'Permanently delete a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.deleteBoard(args.board_id);
      return { success: true, message: 'Board deleted' };
    },
  },
  {
    name: 'trello_get_board_members',
    description: 'Get all members of a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const members = await client.getBoardMembers(args.board_id);
      return { members, count: members.length };
    },
  },
  {
    name: 'trello_add_board_member',
    description: 'Add a member to a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      member_id: z.string().describe('Member ID or username'),
      type: z.enum(['admin', 'normal', 'observer']).optional().describe('Member type (default: normal)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.addBoardMember(args.board_id, args.member_id, args.type || 'normal');
      return { success: true, message: 'Member added to board' };
    },
  },
  {
    name: 'trello_remove_board_member',
    description: 'Remove a member from a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      member_id: z.string().describe('Member ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.removeBoardMember(args.board_id, args.member_id);
      return { success: true, message: 'Member removed from board' };
    },
  },
  {
    name: 'trello_get_board_labels',
    description: 'Get all labels on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const labels = await client.getBoardLabels(args.board_id);
      return { labels, count: labels.length };
    },
  },
  {
    name: 'trello_create_board_label',
    description: 'Create a new label on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      name: z.string().describe('Label name'),
      color: z.string().optional().describe('Label color (yellow, purple, blue, red, green, orange, black, sky, pink, lime, null)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.createBoardLabel(args.board_id, {
        name: args.name,
        color: args.color,
      });
    },
  },
  {
    name: 'trello_get_board_lists',
    description: 'Get all lists on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      filter: z.enum(['all', 'open', 'closed', 'none']).optional().describe('Filter lists'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const lists = await client.getBoardLists(args.board_id, args.filter || 'all');
      return { lists, count: lists.length };
    },
  },
  {
    name: 'trello_get_board_cards',
    description: 'Get all cards on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const cards = await client.getBoardCards(args.board_id);
      return { cards, count: cards.length };
    },
  },
  {
    name: 'trello_get_board_checklists',
    description: 'Get all checklists on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const checklists = await client.getBoardChecklists(args.board_id);
      return { checklists, count: checklists.length };
    },
  },
  {
    name: 'trello_get_board_custom_fields',
    description: 'Get all custom fields defined on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const customFields = await client.getBoardCustomFields(args.board_id);
      return { customFields, count: customFields.length };
    },
  },
  {
    name: 'trello_get_board_power_ups',
    description: 'Get all enabled power-ups on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const powerUps = await client.getBoardPowerUps(args.board_id);
      return { powerUps, count: powerUps.length };
    },
  },
  {
    name: 'trello_star_board',
    description: 'Star or unstar a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      starred: z.boolean().describe('True to star, false to unstar'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.starBoard(args.board_id, args.starred);
      return { success: true, starred: args.starred };
    },
  },
];
