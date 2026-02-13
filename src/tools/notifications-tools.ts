import { z } from 'zod';
import type { TrelloClient } from '../clients/trello.js';

export const notificationsTools = [
  {
    name: 'trello_list_notifications',
    description: 'List notifications for a member',
    inputSchema: z.object({
      member_id: z.string().optional().describe('Member ID (default: "me")'),
      filter: z.enum(['all', 'unread']).optional().describe('Filter notifications'),
      limit: z.number().optional().describe('Maximum number of notifications (default: 50)'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      const notifications = await client.getNotifications(
        args.member_id || 'me',
        args.filter || 'all',
        args.limit || 50
      );
      return { notifications, count: notifications.length };
    },
  },
  {
    name: 'trello_get_notification',
    description: 'Get detailed information about a specific notification',
    inputSchema: z.object({
      notification_id: z.string().describe('Notification ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      return await client.getNotification(args.notification_id);
    },
  },
  {
    name: 'trello_mark_notification_read',
    description: 'Mark a notification as read',
    inputSchema: z.object({
      notification_id: z.string().describe('Notification ID'),
    }),
    execute: async (client: TrelloClient, args: any) => {
      await client.markNotificationRead(args.notification_id);
      return { success: true, message: 'Notification marked as read' };
    },
  },
  {
    name: 'trello_mark_all_notifications_read',
    description: 'Mark all notifications as read for the current user',
    inputSchema: z.object({}),
    execute: async (client: TrelloClient, args: any) => {
      await client.markAllNotificationsRead();
      return { success: true, message: 'All notifications marked as read' };
    },
  },
];
