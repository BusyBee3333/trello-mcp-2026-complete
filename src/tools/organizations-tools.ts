import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const organizationsTools = [
  {
    name: 'trello_list_organizations',
    description: 'List all organizations for a member',
    inputSchema: z.object({
      member_id: z.string().optional().describe('Member ID or username (default: "me")'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const organizations = await client.getOrganizations(args.member_id || 'me');
      return { organizations, count: organizations.length };
    },
  },
  {
    name: 'trello_get_organization',
    description: 'Get detailed information about an organization',
    inputSchema: z.object({
      organization_id: z.string().describe('Organization ID or name'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.getOrganization(args.organization_id);
    },
  },
  {
    name: 'trello_create_organization',
    description: 'Create a new organization (workspace)',
    inputSchema: z.object({
      display_name: z.string().describe('Organization display name'),
      desc: z.string().optional().describe('Description'),
      name: z.string().optional().describe('Short name (URL-friendly)'),
      website: z.string().optional().describe('Website URL'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.createOrganization({
        displayName: args.display_name,
        desc: args.desc,
        name: args.name,
        website: args.website,
      });
    },
  },
  {
    name: 'trello_update_organization',
    description: 'Update organization properties',
    inputSchema: z.object({
      organization_id: z.string().describe('Organization ID'),
      display_name: z.string().optional().describe('Display name'),
      desc: z.string().optional().describe('Description'),
      name: z.string().optional().describe('Short name'),
      website: z.string().optional().describe('Website URL'),
      prefs_permission_level: z.enum(['private', 'public']).optional().describe('Permission level'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const { organization_id, ...updates } = args;
      const data: any = {};
      if (args.display_name) data.displayName = args.display_name;
      if (args.desc !== undefined) data.desc = args.desc;
      if (args.name) data.name = args.name;
      if (args.website !== undefined) data.website = args.website;
      if (args.prefs_permission_level) data.prefs_permissionLevel = args.prefs_permission_level;
      return await client.updateOrganization(organization_id, data);
    },
  },
  {
    name: 'trello_delete_organization',
    description: 'Delete an organization',
    inputSchema: z.object({
      organization_id: z.string().describe('Organization ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.deleteOrganization(args.organization_id);
      return { success: true, message: 'Organization deleted' };
    },
  },
  {
    name: 'trello_get_organization_members',
    description: 'Get all members of an organization',
    inputSchema: z.object({
      organization_id: z.string().describe('Organization ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const members = await client.getOrganizationMembers(args.organization_id);
      return { members, count: members.length };
    },
  },
  {
    name: 'trello_add_organization_member',
    description: 'Add a member to an organization',
    inputSchema: z.object({
      organization_id: z.string().describe('Organization ID'),
      email: z.string().describe('Member email address'),
      full_name: z.string().optional().describe('Member full name'),
      type: z.enum(['admin', 'normal']).optional().describe('Member type (default: normal)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.addOrganizationMember(
        args.organization_id,
        args.email,
        args.full_name,
        args.type || 'normal'
      );
      return { success: true, message: 'Member invited to organization' };
    },
  },
  {
    name: 'trello_remove_organization_member',
    description: 'Remove a member from an organization',
    inputSchema: z.object({
      organization_id: z.string().describe('Organization ID'),
      member_id: z.string().describe('Member ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.removeOrganizationMember(args.organization_id, args.member_id);
      return { success: true, message: 'Member removed from organization' };
    },
  },
  {
    name: 'trello_get_organization_boards',
    description: 'Get all boards in an organization',
    inputSchema: z.object({
      organization_id: z.string().describe('Organization ID'),
      filter: z.enum(['all', 'open', 'closed', 'public']).optional().describe('Filter boards'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const boards = await client.getOrganizationBoards(args.organization_id, args.filter || 'all');
      return { boards, count: boards.length };
    },
  },
];
