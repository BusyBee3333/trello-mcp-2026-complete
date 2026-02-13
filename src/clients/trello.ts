import type {
  TrelloCredentials,
  TrelloBoard,
  TrelloList,
  TrelloCard,
  Checklist,
  CheckItem,
  Label,
  Member,
  Organization,
  Action,
  Notification,
  CustomField,
  CustomFieldItem,
  Webhook,
  PowerUp,
  Token,
  SearchResults,
  Attachment,
  PaginationParams,
} from '../types/trello.js';

export class TrelloClient {
  private apiKey: string;
  private token: string;
  private baseUrl = 'https://api.trello.com/1';
  private rateLimitRemaining = 300;
  private rateLimitReset = Date.now();

  constructor(credentials: TrelloCredentials) {
    this.apiKey = credentials.apiKey;
    this.token = credentials.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Rate limiting
    if (this.rateLimitRemaining < 10 && Date.now() < this.rateLimitReset) {
      const waitTime = this.rateLimitReset - Date.now();
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('key', this.apiKey);
    url.searchParams.append('token', this.token);

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Update rate limit info from headers
    const remaining = response.headers.get('X-Rate-Limit-Remaining');
    const reset = response.headers.get('X-Rate-Limit-Reset');
    if (remaining) this.rateLimitRemaining = parseInt(remaining, 10);
    if (reset) this.rateLimitReset = parseInt(reset, 10) * 1000;

    if (!response.ok) {
      const error: any = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Trello API Error: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  private buildQueryString(params: Record<string, any>): string {
    const filtered = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => {
        if (Array.isArray(v)) {
          return `${k}=${v.join(',')}`;
        }
        return `${k}=${encodeURIComponent(v)}`;
      });
    return filtered.length > 0 ? `?${filtered.join('&')}` : '';
  }

  // Boards
  async getBoards(memberId: string = 'me', filter = 'all'): Promise<TrelloBoard[]> {
    return this.request(`/members/${memberId}/boards?filter=${filter}`);
  }

  async getBoard(boardId: string, fields?: string[]): Promise<TrelloBoard> {
    const query = fields ? `?fields=${fields.join(',')}` : '';
    return this.request(`/boards/${boardId}${query}`);
  }

  async createBoard(data: {
    name: string;
    desc?: string;
    idOrganization?: string;
    prefs_permissionLevel?: string;
    defaultLists?: boolean;
  }): Promise<TrelloBoard> {
    const query = this.buildQueryString(data);
    return this.request(`/boards/${query}`, { method: 'POST' });
  }

  async updateBoard(boardId: string, data: Record<string, any>): Promise<TrelloBoard> {
    const query = this.buildQueryString(data);
    return this.request(`/boards/${boardId}${query}`, { method: 'PUT' });
  }

  async deleteBoard(boardId: string): Promise<void> {
    return this.request(`/boards/${boardId}`, { method: 'DELETE' });
  }

  async getBoardMembers(boardId: string): Promise<Member[]> {
    return this.request(`/boards/${boardId}/members`);
  }

  async addBoardMember(boardId: string, memberId: string, type: 'admin' | 'normal' | 'observer' = 'normal'): Promise<void> {
    return this.request(`/boards/${boardId}/members/${memberId}?type=${type}`, { method: 'PUT' });
  }

  async removeBoardMember(boardId: string, memberId: string): Promise<void> {
    return this.request(`/boards/${boardId}/members/${memberId}`, { method: 'DELETE' });
  }

  async getBoardLabels(boardId: string): Promise<Label[]> {
    return this.request(`/boards/${boardId}/labels`);
  }

  async createBoardLabel(boardId: string, data: { name: string; color?: string }): Promise<Label> {
    const query = this.buildQueryString(data);
    return this.request(`/boards/${boardId}/labels${query}`, { method: 'POST' });
  }

  async getBoardLists(boardId: string, filter = 'all'): Promise<TrelloList[]> {
    return this.request(`/boards/${boardId}/lists?filter=${filter}`);
  }

  async getBoardCards(boardId: string): Promise<TrelloCard[]> {
    return this.request(`/boards/${boardId}/cards`);
  }

  async getBoardChecklists(boardId: string): Promise<Checklist[]> {
    return this.request(`/boards/${boardId}/checklists`);
  }

  async getBoardCustomFields(boardId: string): Promise<CustomField[]> {
    return this.request(`/boards/${boardId}/customFields`);
  }

  async getBoardPowerUps(boardId: string): Promise<PowerUp[]> {
    return this.request(`/boards/${boardId}/boardPlugins`);
  }

  async starBoard(boardId: string, starred: boolean): Promise<void> {
    return this.request(`/boards/${boardId}/starred?value=${starred}`, { method: 'PUT' });
  }

  // Lists
  async getLists(boardId: string, filter = 'all'): Promise<TrelloList[]> {
    return this.getBoardLists(boardId, filter);
  }

  async getList(listId: string): Promise<TrelloList> {
    return this.request(`/lists/${listId}`);
  }

  async createList(data: { name: string; idBoard: string; pos?: number | string }): Promise<TrelloList> {
    const query = this.buildQueryString(data);
    return this.request(`/lists${query}`, { method: 'POST' });
  }

  async updateList(listId: string, data: Record<string, any>): Promise<TrelloList> {
    const query = this.buildQueryString(data);
    return this.request(`/lists/${listId}${query}`, { method: 'PUT' });
  }

  async archiveList(listId: string, closed = true): Promise<TrelloList> {
    return this.request(`/lists/${listId}/closed?value=${closed}`, { method: 'PUT' });
  }

  async moveAllCardsInList(listId: string, targetBoardId: string, targetListId: string): Promise<void> {
    return this.request(`/lists/${listId}/moveAllCards?idBoard=${targetBoardId}&idList=${targetListId}`, {
      method: 'POST',
    });
  }

  async sortList(listId: string, sortBy: 'name' | 'dateLastActivity'): Promise<void> {
    return this.request(`/lists/${listId}/sortCards?by=${sortBy}`, { method: 'POST' });
  }

  // Cards
  async getCards(listId: string): Promise<TrelloCard[]> {
    return this.request(`/lists/${listId}/cards`);
  }

  async getCard(cardId: string, fields?: string[]): Promise<TrelloCard> {
    const query = fields ? `?fields=${fields.join(',')}` : '';
    return this.request(`/cards/${cardId}${query}`);
  }

  async createCard(data: {
    name: string;
    idList: string;
    desc?: string;
    pos?: number | string;
    due?: string;
    start?: string;
    idMembers?: string[];
    idLabels?: string[];
  }): Promise<TrelloCard> {
    const query = this.buildQueryString(data);
    return this.request(`/cards${query}`, { method: 'POST' });
  }

  async updateCard(cardId: string, data: Record<string, any>): Promise<TrelloCard> {
    const query = this.buildQueryString(data);
    return this.request(`/cards/${cardId}${query}`, { method: 'PUT' });
  }

  async deleteCard(cardId: string): Promise<void> {
    return this.request(`/cards/${cardId}`, { method: 'DELETE' });
  }

  async moveCard(cardId: string, idList: string, idBoard?: string): Promise<TrelloCard> {
    const params: any = { idList };
    if (idBoard) params.idBoard = idBoard;
    const query = this.buildQueryString(params);
    return this.request(`/cards/${cardId}${query}`, { method: 'PUT' });
  }

  async copyCard(cardId: string, data: { idList: string; idBoard?: string; name?: string }): Promise<TrelloCard> {
    const query = this.buildQueryString({ ...data, idCardSource: cardId, keepFromSource: 'all' });
    return this.request(`/cards${query}`, { method: 'POST' });
  }

  async addCardMember(cardId: string, memberId: string): Promise<void> {
    return this.request(`/cards/${cardId}/idMembers?value=${memberId}`, { method: 'POST' });
  }

  async removeCardMember(cardId: string, memberId: string): Promise<void> {
    return this.request(`/cards/${cardId}/idMembers/${memberId}`, { method: 'DELETE' });
  }

  async addCardLabel(cardId: string, labelId: string): Promise<void> {
    return this.request(`/cards/${cardId}/idLabels?value=${labelId}`, { method: 'POST' });
  }

  async removeCardLabel(cardId: string, labelId: string): Promise<void> {
    return this.request(`/cards/${cardId}/idLabels/${labelId}`, { method: 'DELETE' });
  }

  async addCardComment(cardId: string, text: string): Promise<Action> {
    return this.request(`/cards/${cardId}/actions/comments?text=${encodeURIComponent(text)}`, {
      method: 'POST',
    });
  }

  async getCardComments(cardId: string): Promise<Action[]> {
    return this.request(`/cards/${cardId}/actions?filter=commentCard`);
  }

  async addCardAttachment(
    cardId: string,
    data: { name?: string; url?: string; mimeType?: string; setCover?: boolean }
  ): Promise<Attachment> {
    const query = this.buildQueryString(data);
    return this.request(`/cards/${cardId}/attachments${query}`, { method: 'POST' });
  }

  async getCardAttachments(cardId: string): Promise<Attachment[]> {
    return this.request(`/cards/${cardId}/attachments`);
  }

  async addCardChecklist(cardId: string, name: string): Promise<Checklist> {
    return this.request(`/cards/${cardId}/checklists?name=${encodeURIComponent(name)}`, { method: 'POST' });
  }

  async getCardChecklists(cardId: string): Promise<Checklist[]> {
    return this.request(`/cards/${cardId}/checklists`);
  }

  async setCardCover(cardId: string, data: { color?: string; idAttachment?: string; size?: string }): Promise<TrelloCard> {
    const query = this.buildQueryString(data);
    return this.request(`/cards/${cardId}/cover${query}`, { method: 'PUT' });
  }

  async setCardDueDate(cardId: string, due: string | null, dueComplete = false): Promise<TrelloCard> {
    return this.updateCard(cardId, { due, dueComplete });
  }

  async markCardNotificationsRead(cardId: string): Promise<void> {
    return this.request(`/cards/${cardId}/markAssociatedNotificationsRead`, { method: 'POST' });
  }

  // Checklists
  async getChecklist(checklistId: string): Promise<Checklist> {
    return this.request(`/checklists/${checklistId}`);
  }

  async createChecklist(data: { idCard: string; name: string; pos?: number | string }): Promise<Checklist> {
    const query = this.buildQueryString(data);
    return this.request(`/checklists${query}`, { method: 'POST' });
  }

  async updateChecklist(checklistId: string, data: Record<string, any>): Promise<Checklist> {
    const query = this.buildQueryString(data);
    return this.request(`/checklists/${checklistId}${query}`, { method: 'PUT' });
  }

  async deleteChecklist(checklistId: string): Promise<void> {
    return this.request(`/checklists/${checklistId}`, { method: 'DELETE' });
  }

  async addCheckItem(checklistId: string, name: string, pos?: number | string): Promise<CheckItem> {
    const params: any = { name };
    if (pos) params.pos = pos;
    const query = this.buildQueryString(params);
    return this.request(`/checklists/${checklistId}/checkItems${query}`, { method: 'POST' });
  }

  async updateCheckItem(
    cardId: string,
    checkItemId: string,
    data: { name?: string; state?: string; pos?: number | string }
  ): Promise<CheckItem> {
    const query = this.buildQueryString(data);
    return this.request(`/cards/${cardId}/checkItem/${checkItemId}${query}`, { method: 'PUT' });
  }

  async deleteCheckItem(checklistId: string, checkItemId: string): Promise<void> {
    return this.request(`/checklists/${checklistId}/checkItems/${checkItemId}`, { method: 'DELETE' });
  }

  // Members
  async getMember(memberId: string = 'me'): Promise<Member> {
    return this.request(`/members/${memberId}`);
  }

  async getMemberBoards(memberId: string = 'me', filter = 'all'): Promise<TrelloBoard[]> {
    return this.getBoards(memberId, filter);
  }

  async getMemberOrganizations(memberId: string = 'me'): Promise<Organization[]> {
    return this.request(`/members/${memberId}/organizations`);
  }

  async getMemberCards(memberId: string = 'me', filter = 'visible'): Promise<TrelloCard[]> {
    return this.request(`/members/${memberId}/cards?filter=${filter}`);
  }

  async getMemberActions(memberId: string = 'me', filter?: string): Promise<Action[]> {
    const query = filter ? `?filter=${filter}` : '';
    return this.request(`/members/${memberId}/actions${query}`);
  }

  async getMemberNotifications(memberId: string = 'me', filter = 'all'): Promise<Notification[]> {
    return this.request(`/members/${memberId}/notifications?filter=${filter}`);
  }

  // Organizations
  async getOrganizations(memberId: string = 'me'): Promise<Organization[]> {
    return this.getMemberOrganizations(memberId);
  }

  async getOrganization(orgId: string): Promise<Organization> {
    return this.request(`/organizations/${orgId}`);
  }

  async createOrganization(data: { displayName: string; desc?: string; name?: string; website?: string }): Promise<Organization> {
    const query = this.buildQueryString(data);
    return this.request(`/organizations${query}`, { method: 'POST' });
  }

  async updateOrganization(orgId: string, data: Record<string, any>): Promise<Organization> {
    const query = this.buildQueryString(data);
    return this.request(`/organizations/${orgId}${query}`, { method: 'PUT' });
  }

  async deleteOrganization(orgId: string): Promise<void> {
    return this.request(`/organizations/${orgId}`, { method: 'DELETE' });
  }

  async getOrganizationMembers(orgId: string): Promise<Member[]> {
    return this.request(`/organizations/${orgId}/members`);
  }

  async addOrganizationMember(orgId: string, email: string, fullName?: string, type = 'normal'): Promise<void> {
    const params: any = { email, type };
    if (fullName) params.fullName = fullName;
    const query = this.buildQueryString(params);
    return this.request(`/organizations/${orgId}/members${query}`, { method: 'PUT' });
  }

  async removeOrganizationMember(orgId: string, memberId: string): Promise<void> {
    return this.request(`/organizations/${orgId}/members/${memberId}`, { method: 'DELETE' });
  }

  async getOrganizationBoards(orgId: string, filter = 'all'): Promise<TrelloBoard[]> {
    return this.request(`/organizations/${orgId}/boards?filter=${filter}`);
  }

  // Labels
  async getLabel(labelId: string): Promise<Label> {
    return this.request(`/labels/${labelId}`);
  }

  async createLabel(data: { name: string; color?: string; idBoard: string }): Promise<Label> {
    const query = this.buildQueryString(data);
    return this.request(`/labels${query}`, { method: 'POST' });
  }

  async updateLabel(labelId: string, data: { name?: string; color?: string }): Promise<Label> {
    const query = this.buildQueryString(data);
    return this.request(`/labels/${labelId}${query}`, { method: 'PUT' });
  }

  async deleteLabel(labelId: string): Promise<void> {
    return this.request(`/labels/${labelId}`, { method: 'DELETE' });
  }

  // Actions
  async getAction(actionId: string): Promise<Action> {
    return this.request(`/actions/${actionId}`);
  }

  async getActions(params: { boardId?: string; cardId?: string; memberId?: string; filter?: string; limit?: number }): Promise<Action[]> {
    if (params.boardId) {
      const query = params.filter ? `?filter=${params.filter}` : '';
      return this.request(`/boards/${params.boardId}/actions${query}`);
    } else if (params.cardId) {
      const query = params.filter ? `?filter=${params.filter}` : '';
      return this.request(`/cards/${params.cardId}/actions${query}`);
    } else if (params.memberId) {
      return this.getMemberActions(params.memberId, params.filter);
    }
    throw new Error('Must provide boardId, cardId, or memberId');
  }

  async getActionReactions(actionId: string): Promise<any[]> {
    return this.request(`/actions/${actionId}/reactions`);
  }

  async addActionReaction(actionId: string, emoji: string): Promise<void> {
    return this.request(`/actions/${actionId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ shortName: emoji }),
    });
  }

  // Custom Fields
  async getCustomFields(boardId: string): Promise<CustomField[]> {
    return this.getBoardCustomFields(boardId);
  }

  async getCustomField(fieldId: string): Promise<CustomField> {
    return this.request(`/customFields/${fieldId}`);
  }

  async createCustomField(data: {
    idModel: string;
    modelType: string;
    name: string;
    type: string;
    pos?: number | string;
    options?: any[];
  }): Promise<CustomField> {
    return this.request(`/customFields`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomField(fieldId: string, data: Record<string, any>): Promise<CustomField> {
    return this.request(`/customFields/${fieldId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomField(fieldId: string): Promise<void> {
    return this.request(`/customFields/${fieldId}`, { method: 'DELETE' });
  }

  async setCustomFieldValueOnCard(cardId: string, fieldId: string, value: any): Promise<CustomFieldItem> {
    return this.request(`/cards/${cardId}/customField/${fieldId}/item`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }

  async getCustomFieldItemsOnCard(cardId: string): Promise<CustomFieldItem[]> {
    return this.request(`/cards/${cardId}/customFieldItems`);
  }

  // Notifications
  async getNotifications(memberId: string = 'me', filter = 'all', limit = 50): Promise<Notification[]> {
    return this.request(`/members/${memberId}/notifications?filter=${filter}&limit=${limit}`);
  }

  async getNotification(notificationId: string): Promise<Notification> {
    return this.request(`/notifications/${notificationId}`);
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    return this.request(`/notifications/${notificationId}/unread?value=false`, { method: 'PUT' });
  }

  async markAllNotificationsRead(): Promise<void> {
    return this.request(`/notifications/all/read`, { method: 'POST' });
  }

  // Search
  async search(query: string, params?: {
    modelTypes?: string[];
    boardFields?: string[];
    boardsLimit?: number;
    cardFields?: string[];
    cardsLimit?: number;
    cardsPage?: number;
    cardBoard?: boolean;
    cardList?: boolean;
    cardMembers?: boolean;
    cardStickers?: boolean;
    cardAttachments?: boolean | string;
    organizationsLimit?: number;
    membersLimit?: number;
    partial?: boolean;
  }): Promise<SearchResults> {
    const searchParams = new URLSearchParams({ query, ...(params as any) });
    return this.request(`/search?${searchParams.toString()}`);
  }

  async searchCards(query: string, limit = 20): Promise<TrelloCard[]> {
    const result = await this.search(query, { modelTypes: ['cards'], cardsLimit: limit });
    return result.cards || [];
  }

  async searchBoards(query: string, limit = 20): Promise<TrelloBoard[]> {
    const result = await this.search(query, { modelTypes: ['boards'], boardsLimit: limit });
    return result.boards || [];
  }

  async searchMembers(query: string, limit = 20): Promise<Member[]> {
    const result = await this.search(query, { modelTypes: ['members'], membersLimit: limit });
    return result.members || [];
  }

  // Webhooks
  async getWebhooks(token: string): Promise<Webhook[]> {
    return this.request(`/tokens/${token}/webhooks`);
  }

  async createWebhook(data: { callbackURL: string; idModel: string; description?: string }): Promise<Webhook> {
    return this.request(`/webhooks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWebhook(webhookId: string, data: Record<string, any>): Promise<Webhook> {
    const query = this.buildQueryString(data);
    return this.request(`/webhooks/${webhookId}${query}`, { method: 'PUT' });
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    return this.request(`/webhooks/${webhookId}`, { method: 'DELETE' });
  }

  // Power-Ups
  async getAvailablePowerUps(): Promise<PowerUp[]> {
    return this.request(`/plugins`);
  }

  async enablePowerUp(boardId: string, powerUpId: string): Promise<void> {
    return this.request(`/boards/${boardId}/boardPlugins?idPlugin=${powerUpId}`, { method: 'POST' });
  }

  async disablePowerUp(boardId: string, powerUpId: string): Promise<void> {
    return this.request(`/boards/${boardId}/boardPlugins/${powerUpId}`, { method: 'DELETE' });
  }

  // Tokens
  async getTokenInfo(token: string = 'me'): Promise<Token> {
    return this.request(`/tokens/${token}`);
  }
}
