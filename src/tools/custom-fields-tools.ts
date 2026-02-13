import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const customFieldsTools = [
  {
    name: 'trello_list_custom_fields',
    description: 'List all custom fields defined on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const customFields = await client.getCustomFields(args.board_id);
      return { customFields, count: customFields.length };
    },
  },
  {
    name: 'trello_get_custom_field',
    description: 'Get detailed information about a custom field',
    inputSchema: z.object({
      field_id: z.string().describe('Custom field ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.getCustomField(args.field_id);
    },
  },
  {
    name: 'trello_create_custom_field',
    description: 'Create a new custom field on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      name: z.string().describe('Field name'),
      type: z.enum(['checkbox', 'date', 'list', 'number', 'text']).describe('Field type'),
      pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional().describe('Position'),
      options: z.array(z.object({
        value: z.object({ text: z.string() }),
        color: z.string(),
      })).optional().describe('Options for list type fields'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.createCustomField({
        idModel: args.board_id,
        modelType: 'board',
        name: args.name,
        type: args.type,
        pos: args.pos,
        options: args.options,
      });
    },
  },
  {
    name: 'trello_update_custom_field',
    description: 'Update custom field properties',
    inputSchema: z.object({
      field_id: z.string().describe('Custom field ID'),
      name: z.string().optional().describe('New field name'),
      pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional().describe('New position'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const { field_id, ...updates } = args;
      const data: any = {};
      if (args.name) data.name = args.name;
      if (args.pos !== undefined) data.pos = args.pos;
      return await client.updateCustomField(field_id, data);
    },
  },
  {
    name: 'trello_delete_custom_field',
    description: 'Delete a custom field from a board',
    inputSchema: z.object({
      field_id: z.string().describe('Custom field ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.deleteCustomField(args.field_id);
      return { success: true, message: 'Custom field deleted' };
    },
  },
  {
    name: 'trello_set_custom_field_value',
    description: 'Set the value of a custom field on a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      field_id: z.string().describe('Custom field ID'),
      value: z.any().describe('Field value (format depends on field type)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.setCustomFieldValueOnCard(args.card_id, args.field_id, args.value);
    },
  },
  {
    name: 'trello_get_custom_field_values',
    description: 'Get all custom field values on a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const items = await client.getCustomFieldItemsOnCard(args.card_id);
      return { customFieldItems: items, count: items.length };
    },
  },
];
