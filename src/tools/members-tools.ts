import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const membersTools = [
  {
    name: 'trello_get_member',
    description: 'Get information about a member',
    inputSchema: z.object({
      member_id: z.string().optional().describe('Member ID or username (default: "me" for current user)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.getMember(args.member_id || 'me');
    },
  },
  {
    name: 'trello_get_member_boards',
    description: 'Get all boards for a member',
    inputSchema: z.object({
      member_id: z.string().optional().describe('Member ID or username (default: "me")'),
      filter: z.enum(['all', 'open', 'closed', 'starred', 'organization', 'public']).optional().describe('Filter boards'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const boards = await client.getMemberBoards(args.member_id || 'me', args.filter || 'all');
      return { boards, count: boards.length };
    },
  },
  {
    name: 'trello_get_member_organizations',
    description: 'Get all organizations a member belongs to',
    inputSchema: z.object({
      member_id: z.string().optional().describe('Member ID or username (default: "me")'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const organizations = await client.getMemberOrganizations(args.member_id || 'me');
      return { organizations, count: organizations.length };
    },
  },
  {
    name: 'trello_get_member_cards',
    description: 'Get all cards assigned to a member',
    inputSchema: z.object({
      member_id: z.string().optional().describe('Member ID or username (default: "me")'),
      filter: z.enum(['all', 'visible', 'open', 'closed']).optional().describe('Filter cards'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const cards = await client.getMemberCards(args.member_id || 'me', args.filter || 'visible');
      return { cards, count: cards.length };
    },
  },
  {
    name: 'trello_get_member_actions',
    description: 'Get activity/actions for a member',
    inputSchema: z.object({
      member_id: z.string().optional().describe('Member ID or username (default: "me")'),
      filter: z.string().optional().describe('Filter actions by type (e.g., "createCard,updateCard")'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const actions = await client.getMemberActions(args.member_id || 'me', args.filter);
      return { actions, count: actions.length };
    },
  },
  {
    name: 'trello_get_member_notifications',
    description: 'Get notifications for a member',
    inputSchema: z.object({
      member_id: z.string().optional().describe('Member ID or username (default: "me")'),
      filter: z.enum(['all', 'unread']).optional().describe('Filter notifications'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const notifications = await client.getMemberNotifications(args.member_id || 'me', args.filter || 'all');
      return { notifications, count: notifications.length };
    },
  },
];
