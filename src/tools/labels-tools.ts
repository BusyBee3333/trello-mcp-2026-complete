import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const labelsTools = [
  {
    name: 'trello_get_label',
    description: 'Get detailed information about a specific label',
    inputSchema: z.object({
      label_id: z.string().describe('Label ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.getLabel(args.label_id);
    },
  },
  {
    name: 'trello_create_label',
    description: 'Create a new label on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      name: z.string().describe('Label name'),
      color: z.string().optional().describe('Label color (yellow, purple, blue, red, green, orange, black, sky, pink, lime, null)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.createLabel({
        idBoard: args.board_id,
        name: args.name,
        color: args.color,
      });
    },
  },
  {
    name: 'trello_update_label',
    description: 'Update label properties',
    inputSchema: z.object({
      label_id: z.string().describe('Label ID'),
      name: z.string().optional().describe('New label name'),
      color: z.string().optional().describe('New color'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const { label_id, ...updates } = args;
      const data: any = {};
      if (args.name !== undefined) data.name = args.name;
      if (args.color !== undefined) data.color = args.color;
      return await client.updateLabel(label_id, data);
    },
  },
  {
    name: 'trello_delete_label',
    description: 'Delete a label from a board',
    inputSchema: z.object({
      label_id: z.string().describe('Label ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.deleteLabel(args.label_id);
      return { success: true, message: 'Label deleted' };
    },
  },
];
