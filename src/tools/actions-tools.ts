import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const actionsTools = [
  {
    name: 'trello_get_action',
    description: 'Get detailed information about a specific action',
    inputSchema: z.object({
      action_id: z.string().describe('Action ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.getAction(args.action_id);
    },
  },
  {
    name: 'trello_list_actions',
    description: 'Get activity log/actions for a board, card, or member',
    inputSchema: z.object({
      board_id: z.string().optional().describe('Board ID to get actions for'),
      card_id: z.string().optional().describe('Card ID to get actions for'),
      member_id: z.string().optional().describe('Member ID to get actions for'),
      filter: z.string().optional().describe('Comma-separated list of action types (e.g., "createCard,updateCard,commentCard")'),
      limit: z.number().optional().describe('Maximum number of actions to return'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const actions = await client.getActions({
        boardId: args.board_id,
        cardId: args.card_id,
        memberId: args.member_id,
        filter: args.filter,
        limit: args.limit,
      });
      return { actions, count: actions.length };
    },
  },
  {
    name: 'trello_get_action_reactions',
    description: 'Get reactions (emoji) on an action',
    inputSchema: z.object({
      action_id: z.string().describe('Action ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const reactions = await client.getActionReactions(args.action_id);
      return { reactions, count: reactions.length };
    },
  },
  {
    name: 'trello_add_action_reaction',
    description: 'Add a reaction (emoji) to an action',
    inputSchema: z.object({
      action_id: z.string().describe('Action ID'),
      emoji: z.string().describe('Emoji short name (e.g., "thumbsup", "heart", "smile")'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.addActionReaction(args.action_id, args.emoji);
      return { success: true, message: 'Reaction added' };
    },
  },
];
