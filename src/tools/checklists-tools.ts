import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const checklistsTools = [
  {
    name: 'trello_get_checklist',
    description: 'Get detailed information about a specific checklist',
    inputSchema: z.object({
      checklist_id: z.string().describe('Checklist ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.getChecklist(args.checklist_id);
    },
  },
  {
    name: 'trello_create_checklist',
    description: 'Create a new checklist on a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      name: z.string().describe('Checklist name'),
      pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional().describe('Position'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.createChecklist({
        idCard: args.card_id,
        name: args.name,
        pos: args.pos,
      });
    },
  },
  {
    name: 'trello_update_checklist',
    description: 'Update checklist properties',
    inputSchema: z.object({
      checklist_id: z.string().describe('Checklist ID'),
      name: z.string().optional().describe('New checklist name'),
      pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional().describe('New position'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const { checklist_id, ...updates } = args;
      const data: any = {};
      if (args.name) data.name = args.name;
      if (args.pos !== undefined) data.pos = args.pos;
      return await client.updateChecklist(checklist_id, data);
    },
  },
  {
    name: 'trello_delete_checklist',
    description: 'Delete a checklist',
    inputSchema: z.object({
      checklist_id: z.string().describe('Checklist ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.deleteChecklist(args.checklist_id);
      return { success: true, message: 'Checklist deleted' };
    },
  },
  {
    name: 'trello_add_check_item',
    description: 'Add an item to a checklist',
    inputSchema: z.object({
      checklist_id: z.string().describe('Checklist ID'),
      name: z.string().describe('Check item name'),
      pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional().describe('Position'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.addCheckItem(args.checklist_id, args.name, args.pos);
    },
  },
  {
    name: 'trello_update_check_item',
    description: 'Update a checklist item',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      check_item_id: z.string().describe('Check item ID'),
      name: z.string().optional().describe('New item name'),
      state: z.enum(['complete', 'incomplete']).optional().describe('Item state'),
      pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional().describe('New position'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const data: any = {};
      if (args.name) data.name = args.name;
      if (args.state) data.state = args.state;
      if (args.pos !== undefined) data.pos = args.pos;
      return await client.updateCheckItem(args.card_id, args.check_item_id, data);
    },
  },
  {
    name: 'trello_delete_check_item',
    description: 'Delete a checklist item',
    inputSchema: z.object({
      checklist_id: z.string().describe('Checklist ID'),
      check_item_id: z.string().describe('Check item ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.deleteCheckItem(args.checklist_id, args.check_item_id);
      return { success: true, message: 'Check item deleted' };
    },
  },
];
