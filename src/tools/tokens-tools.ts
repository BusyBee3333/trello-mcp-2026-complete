import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const tokensTools = [
  {
    name: 'trello_get_token_info',
    description: 'Get information about the current API token',
    inputSchema: z.object({
      token: z.string().optional().describe('Token ID (default: current token)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.getTokenInfo(args.token || 'me');
    },
  },
];
