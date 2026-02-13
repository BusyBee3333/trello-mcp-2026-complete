import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const listsTools = [
  {
    name: 'trello_list_lists',
    description: 'List all lists on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      filter: z.enum(['all', 'open', 'closed', 'none']).optional().describe('Filter lists by status'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const lists = await client.getLists(args.board_id, args.filter || 'all');
      return { lists, count: lists.length };
    },
  },
  {
    name: 'trello_get_list',
    description: 'Get detailed information about a specific list',
    inputSchema: z.object({
      list_id: z.string().describe('List ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.getList(args.list_id);
    },
  },
  {
    name: 'trello_create_list',
    description: 'Create a new list on a board',
    inputSchema: z.object({
      name: z.string().describe('List name'),
      board_id: z.string().describe('Board ID'),
      pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional().describe('Position (number or "top"/"bottom")'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.createList({
        name: args.name,
        idBoard: args.board_id,
        pos: args.pos,
      });
    },
  },
  {
    name: 'trello_update_list',
    description: 'Update list properties',
    inputSchema: z.object({
      list_id: z.string().describe('List ID'),
      name: z.string().optional().describe('New list name'),
      closed: z.boolean().optional().describe('Archive/unarchive the list'),
      pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional().describe('New position'),
      subscribed: z.boolean().optional().describe('Subscribe to list updates'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const { list_id, ...updates } = args;
      const data: any = {};
      if (args.name) data.name = args.name;
      if (args.closed !== undefined) data.closed = args.closed;
      if (args.pos !== undefined) data.pos = args.pos;
      if (args.subscribed !== undefined) data.subscribed = args.subscribed;
      return await client.updateList(list_id, data);
    },
  },
  {
    name: 'trello_archive_list',
    description: 'Archive or unarchive a list',
    inputSchema: z.object({
      list_id: z.string().describe('List ID'),
      closed: z.boolean().optional().describe('True to archive, false to unarchive (default: true)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.archiveList(args.list_id, args.closed ?? true);
    },
  },
  {
    name: 'trello_move_all_cards_in_list',
    description: 'Move all cards from one list to another',
    inputSchema: z.object({
      source_list_id: z.string().describe('Source list ID'),
      target_board_id: z.string().describe('Target board ID'),
      target_list_id: z.string().describe('Target list ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.moveAllCardsInList(args.source_list_id, args.target_board_id, args.target_list_id);
      return { success: true, message: 'All cards moved' };
    },
  },
  {
    name: 'trello_sort_list',
    description: 'Sort all cards in a list',
    inputSchema: z.object({
      list_id: z.string().describe('List ID'),
      sort_by: z.enum(['name', 'dateLastActivity']).describe('Sort cards by name or last activity date'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.sortList(args.list_id, args.sort_by);
      return { success: true, message: `Cards sorted by ${args.sort_by}` };
    },
  },
];
