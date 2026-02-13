import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const webhooksTools = [
  {
    name: 'trello_list_webhooks',
    description: 'List all webhooks for the current token',
    inputSchema: z.object({
      token: z.string().optional().describe('Token ID (default: current token)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const webhooks = await client.getWebhooks(args.token || 'me');
      return { webhooks, count: webhooks.length };
    },
  },
  {
    name: 'trello_create_webhook',
    description: 'Create a new webhook for a board, card, or other model',
    inputSchema: z.object({
      callback_url: z.string().describe('URL to receive webhook notifications'),
      model_id: z.string().describe('ID of the model to watch (board, card, etc.)'),
      description: z.string().optional().describe('Webhook description'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.createWebhook({
        callbackURL: args.callback_url,
        idModel: args.model_id,
        description: args.description,
      });
    },
  },
  {
    name: 'trello_update_webhook',
    description: 'Update webhook properties',
    inputSchema: z.object({
      webhook_id: z.string().describe('Webhook ID'),
      callback_url: z.string().optional().describe('New callback URL'),
      description: z.string().optional().describe('New description'),
      active: z.boolean().optional().describe('Enable/disable webhook'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const { webhook_id, ...updates } = args;
      const data: any = {};
      if (args.callback_url) data.callbackURL = args.callback_url;
      if (args.description !== undefined) data.description = args.description;
      if (args.active !== undefined) data.active = args.active;
      return await client.updateWebhook(webhook_id, data);
    },
  },
  {
    name: 'trello_delete_webhook',
    description: 'Delete a webhook',
    inputSchema: z.object({
      webhook_id: z.string().describe('Webhook ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.deleteWebhook(args.webhook_id);
      return { success: true, message: 'Webhook deleted' };
    },
  },
];
