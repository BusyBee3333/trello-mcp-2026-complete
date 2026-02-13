import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const cardsTools = [
  {
    name: 'trello_list_cards',
    description: 'List all cards in a list',
    inputSchema: z.object({
      list_id: z.string().describe('List ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const cards = await client.getCards(args.list_id);
      return { cards, count: cards.length };
    },
  },
  {
    name: 'trello_get_card',
    description: 'Get detailed information about a specific card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      fields: z.array(z.string()).optional().describe('Specific fields to return'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.getCard(args.card_id, args.fields);
    },
  },
  {
    name: 'trello_create_card',
    description: 'Create a new card',
    inputSchema: z.object({
      name: z.string().describe('Card name/title'),
      list_id: z.string().describe('List ID where card should be created'),
      desc: z.string().optional().describe('Card description'),
      pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional().describe('Position in list'),
      due: z.string().optional().describe('Due date (ISO 8601 format)'),
      start: z.string().optional().describe('Start date (ISO 8601 format)'),
      member_ids: z.array(z.string()).optional().describe('Array of member IDs to assign'),
      label_ids: z.array(z.string()).optional().describe('Array of label IDs to add'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.createCard({
        name: args.name,
        idList: args.list_id,
        desc: args.desc,
        pos: args.pos,
        due: args.due,
        start: args.start,
        idMembers: args.member_ids,
        idLabels: args.label_ids,
      });
    },
  },
  {
    name: 'trello_update_card',
    description: 'Update card properties',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      name: z.string().optional().describe('New card name'),
      desc: z.string().optional().describe('New description'),
      closed: z.boolean().optional().describe('Archive/unarchive the card'),
      due: z.string().optional().describe('Due date (ISO 8601 format)'),
      due_complete: z.boolean().optional().describe('Mark due date as complete'),
      start: z.string().optional().describe('Start date (ISO 8601 format)'),
      pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional().describe('Position in list'),
      subscribed: z.boolean().optional().describe('Subscribe to card updates'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const { card_id, ...updates } = args;
      const data: any = {};
      if (args.name) data.name = args.name;
      if (args.desc !== undefined) data.desc = args.desc;
      if (args.closed !== undefined) data.closed = args.closed;
      if (args.due !== undefined) data.due = args.due;
      if (args.due_complete !== undefined) data.dueComplete = args.due_complete;
      if (args.start !== undefined) data.start = args.start;
      if (args.pos !== undefined) data.pos = args.pos;
      if (args.subscribed !== undefined) data.subscribed = args.subscribed;
      return await client.updateCard(card_id, data);
    },
  },
  {
    name: 'trello_delete_card',
    description: 'Permanently delete a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.deleteCard(args.card_id);
      return { success: true, message: 'Card deleted' };
    },
  },
  {
    name: 'trello_move_card',
    description: 'Move a card to a different list or board',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      list_id: z.string().describe('Target list ID'),
      board_id: z.string().optional().describe('Target board ID (if moving to different board)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.moveCard(args.card_id, args.list_id, args.board_id);
    },
  },
  {
    name: 'trello_copy_card',
    description: 'Copy a card to a different list or board',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID to copy'),
      list_id: z.string().describe('Target list ID'),
      board_id: z.string().optional().describe('Target board ID (if copying to different board)'),
      name: z.string().optional().describe('Name for the new card (default: copy of original)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.copyCard(args.card_id, {
        idList: args.list_id,
        idBoard: args.board_id,
        name: args.name,
      });
    },
  },
  {
    name: 'trello_add_card_member',
    description: 'Assign a member to a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      member_id: z.string().describe('Member ID to assign'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.addCardMember(args.card_id, args.member_id);
      return { success: true, message: 'Member assigned to card' };
    },
  },
  {
    name: 'trello_remove_card_member',
    description: 'Remove a member from a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      member_id: z.string().describe('Member ID to remove'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.removeCardMember(args.card_id, args.member_id);
      return { success: true, message: 'Member removed from card' };
    },
  },
  {
    name: 'trello_add_card_label',
    description: 'Add a label to a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      label_id: z.string().describe('Label ID to add'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.addCardLabel(args.card_id, args.label_id);
      return { success: true, message: 'Label added to card' };
    },
  },
  {
    name: 'trello_remove_card_label',
    description: 'Remove a label from a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      label_id: z.string().describe('Label ID to remove'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.removeCardLabel(args.card_id, args.label_id);
      return { success: true, message: 'Label removed from card' };
    },
  },
  {
    name: 'trello_add_card_comment',
    description: 'Add a comment to a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      text: z.string().describe('Comment text'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.addCardComment(args.card_id, args.text);
    },
  },
  {
    name: 'trello_get_card_comments',
    description: 'Get all comments on a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const comments = await client.getCardComments(args.card_id);
      return { comments, count: comments.length };
    },
  },
  {
    name: 'trello_add_card_attachment',
    description: 'Add an attachment to a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      url: z.string().describe('URL of the attachment'),
      name: z.string().optional().describe('Attachment name'),
      mime_type: z.string().optional().describe('MIME type'),
      set_cover: z.boolean().optional().describe('Set this attachment as card cover'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.addCardAttachment(args.card_id, {
        url: args.url,
        name: args.name,
        mimeType: args.mime_type,
        setCover: args.set_cover,
      });
    },
  },
  {
    name: 'trello_get_card_attachments',
    description: 'Get all attachments on a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const attachments = await client.getCardAttachments(args.card_id);
      return { attachments, count: attachments.length };
    },
  },
  {
    name: 'trello_add_card_checklist',
    description: 'Add a checklist to a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      name: z.string().describe('Checklist name'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.addCardChecklist(args.card_id, args.name);
    },
  },
  {
    name: 'trello_get_card_checklists',
    description: 'Get all checklists on a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const checklists = await client.getCardChecklists(args.card_id);
      return { checklists, count: checklists.length };
    },
  },
  {
    name: 'trello_set_card_cover',
    description: 'Set the cover image for a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      color: z.string().optional().describe('Cover color (yellow, purple, blue, red, green, orange, black, sky, pink, lime)'),
      attachment_id: z.string().optional().describe('Attachment ID to use as cover'),
      size: z.enum(['normal', 'full']).optional().describe('Cover size'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.setCardCover(args.card_id, {
        color: args.color,
        idAttachment: args.attachment_id,
        size: args.size,
      });
    },
  },
  {
    name: 'trello_set_card_due_date',
    description: 'Set or update the due date for a card',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
      due: z.string().nullable().describe('Due date (ISO 8601 format) or null to remove'),
      due_complete: z.boolean().optional().describe('Mark due date as complete'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.setCardDueDate(args.card_id, args.due, args.due_complete ?? false);
    },
  },
  {
    name: 'trello_mark_card_notifications_read',
    description: 'Mark all notifications for a card as read',
    inputSchema: z.object({
      card_id: z.string().describe('Card ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.markCardNotificationsRead(args.card_id);
      return { success: true, message: 'Card notifications marked as read' };
    },
  },
];
