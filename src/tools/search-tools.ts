import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const searchTools = [
  {
    name: 'trello_search_cards',
    description: 'Search for cards across all boards',
    inputSchema: z.object({
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results (default: 20)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const cards = await client.searchCards(args.query, args.limit || 20);
      return { cards, count: cards.length };
    },
  },
  {
    name: 'trello_search_boards',
    description: 'Search for boards',
    inputSchema: z.object({
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results (default: 20)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const boards = await client.searchBoards(args.query, args.limit || 20);
      return { boards, count: boards.length };
    },
  },
  {
    name: 'trello_search_members',
    description: 'Search for members',
    inputSchema: z.object({
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results (default: 20)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const members = await client.searchMembers(args.query, args.limit || 20);
      return { members, count: members.length };
    },
  },
  {
    name: 'trello_search_everything',
    description: 'Search across all Trello objects (cards, boards, members, organizations)',
    inputSchema: z.object({
      query: z.string().describe('Search query'),
      model_types: z.array(z.enum(['actions', 'boards', 'cards', 'members', 'organizations'])).optional().describe('Types to search'),
      boards_limit: z.number().optional().describe('Max boards to return'),
      cards_limit: z.number().optional().describe('Max cards to return'),
      members_limit: z.number().optional().describe('Max members to return'),
      organizations_limit: z.number().optional().describe('Max organizations to return'),
      partial: z.boolean().optional().describe('Enable partial matching'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const results = await client.search(args.query, {
        modelTypes: args.model_types,
        boardsLimit: args.boards_limit,
        cardsLimit: args.cards_limit,
        membersLimit: args.members_limit,
        organizationsLimit: args.organizations_limit,
        partial: args.partial,
      });
      return results;
    },
  },
];
