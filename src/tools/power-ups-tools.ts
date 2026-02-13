import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const powerUpsTools = [
  {
    name: 'trello_list_available_power_ups',
    description: 'List all available power-ups (plugins)',
    inputSchema: z.object({}),
    execute: async (client: TrelloClient, args: any) => {
      const powerUps = await client.getAvailablePowerUps();
      return { powerUps, count: powerUps.length };
    },
  },
  {
    name: 'trello_enable_power_up',
    description: 'Enable a power-up on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      power_up_id: z.string().describe('Power-up ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.enablePowerUp(args.board_id, args.power_up_id);
      return { success: true, message: 'Power-up enabled on board' };
    },
  },
  {
    name: 'trello_disable_power_up',
    description: 'Disable a power-up on a board',
    inputSchema: z.object({
      board_id: z.string().describe('Board ID'),
      power_up_id: z.string().describe('Power-up ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.disablePowerUp(args.board_id, args.power_up_id);
      return { success: true, message: 'Power-up disabled on board' };
    },
  },
];
