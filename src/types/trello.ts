// Trello API Types

export interface TrelloCredentials {
  apiKey: string;
  token: string;
}

export interface TrelloBoard {
  id: string;
  name: string;
  desc: string;
  descData: string | null;
  closed: boolean;
  idMemberCreator: string;
  idOrganization: string | null;
  pinned: boolean;
  url: string;
  shortUrl: string;
  prefs: BoardPrefs;
  labelNames: Record<string, string>;
  starred: boolean;
  limits: any;
  memberships?: Membership[];
}

export interface BoardPrefs {
  permissionLevel: 'private' | 'org' | 'public';
  hideVotes: boolean;
  voting: 'disabled' | 'enabled';
  comments: 'disabled' | 'members' | 'observers' | 'org' | 'public';
  invitations: 'members' | 'admins';
  selfJoin: boolean;
  cardCovers: boolean;
  cardAging: 'regular' | 'pirate';
  calendarFeedEnabled: boolean;
  background: string;
  backgroundImage: string | null;
  backgroundImageScaled: any[] | null;
  backgroundTile: boolean;
  backgroundBrightness: 'dark' | 'light';
  backgroundColor: string | null;
  backgroundBottomColor: string | null;
  backgroundTopColor: string | null;
  canBePublic: boolean;
  canBeEnterprise: boolean;
  canBeOrg: boolean;
  canBePrivate: boolean;
  canInvite: boolean;
}

export interface TrelloList {
  id: string;
  name: string;
  closed: boolean;
  idBoard: string;
  pos: number;
  subscribed: boolean;
  softLimit: number | null;
  limits: any;
}

export interface TrelloCard {
  id: string;
  checkItemStates: any[] | null;
  closed: boolean;
  dateLastActivity: string;
  desc: string;
  descData: any | null;
  dueReminder: number | null;
  idBoard: string;
  idList: string;
  idMembersVoted: string[];
  idShort: number;
  idAttachmentCover: string | null;
  idLabels: string[];
  manualCoverAttachment: boolean;
  name: string;
  pos: number;
  shortLink: string;
  shortUrl: string;
  start: string | null;
  subscribed: boolean;
  url: string;
  cover: CardCover;
  isTemplate: boolean;
  cardRole: string | null;
  badges: CardBadges;
  due: string | null;
  dueComplete: boolean;
  email: string | null;
  idChecklists: string[];
  idMembers: string[];
  labels: Label[];
  limits: any;
  attachments?: Attachment[];
  checklists?: Checklist[];
  customFieldItems?: CustomFieldItem[];
}

export interface CardCover {
  idAttachment: string | null;
  color: string | null;
  idUploadedBackground: string | null;
  size: 'normal' | 'full';
  brightness: 'dark' | 'light';
  idPlugin: string | null;
}

export interface CardBadges {
  attachmentsByType: {
    trello: {
      board: number;
      card: number;
    };
  };
  location: boolean;
  votes: number;
  viewingMemberVoted: boolean;
  subscribed: boolean;
  fogbugz: string;
  checkItems: number;
  checkItemsChecked: number;
  checkItemsEarliestDue: string | null;
  comments: number;
  attachments: number;
  description: boolean;
  due: string | null;
  dueComplete: boolean;
  start: string | null;
}

export interface Label {
  id: string;
  idBoard: string;
  name: string;
  color: string | null;
  uses?: number;
}

export interface Checklist {
  id: string;
  name: string;
  idBoard: string;
  idCard: string;
  pos: number;
  checkItems: CheckItem[];
  limits: any;
}

export interface CheckItem {
  id: string;
  name: string;
  nameData: any | null;
  pos: number;
  state: 'complete' | 'incomplete';
  due: string | null;
  dueReminder: number | null;
  idMember: string | null;
  idChecklist: string;
}

export interface Attachment {
  id: string;
  bytes: number | null;
  date: string;
  edgeColor: string | null;
  idMember: string;
  isUpload: boolean;
  mimeType: string;
  name: string;
  pos: number;
  previews: AttachmentPreview[];
  url: string;
  fileName?: string;
}

export interface AttachmentPreview {
  id: string;
  _id: string;
  scaled: boolean;
  url: string;
  bytes: number;
  height: number;
  width: number;
}

export interface Member {
  id: string;
  activityBlocked: boolean;
  avatarHash: string | null;
  avatarUrl: string | null;
  bio: string;
  bioData: any | null;
  confirmed: boolean;
  fullName: string;
  idEnterprise: string | null;
  idEnterprisesDeactivated: string[];
  idMemberReferrer: string | null;
  idPremOrgsAdmin: string[];
  initials: string;
  memberType: 'normal' | 'ghost';
  nonPublic: any;
  nonPublicAvailable: boolean;
  products: any[];
  url: string;
  username: string;
  status: string;
  aaId: string | null;
  aaEmail: string | null;
  avatarSource: string | null;
  email: string | null;
  gravatarHash: string | null;
  idBoards: string[];
  idOrganizations: string[];
  idEnterprisesAdmin: string[];
  limits: any;
  loginTypes: string[] | null;
  marketingOptIn: any;
  messagesDismissed: any[];
  oneTimeMessagesDismissed: string[];
  prefs: any;
  trophies: any[];
  uploadedAvatarHash: string | null;
  uploadedAvatarUrl: string | null;
  premiumFeatures: string[];
  isAaBlockSyncEnabled: boolean;
  ixUpdate: string;
  idBoardsPinned: string[] | null;
}

export interface Organization {
  id: string;
  name: string;
  displayName: string;
  desc: string;
  descData: any | null;
  url: string;
  website: string | null;
  logoHash: string | null;
  logoUrl: string | null;
  products: any[];
  powerUps: any[];
  idBoards: string[];
  idMemberCreator: string | null;
  billableMemberCount: number;
  activeMembershipCount: number;
  prefs: OrganizationPrefs;
  premiumFeatures: string[];
}

export interface OrganizationPrefs {
  permissionLevel: 'private' | 'public';
  orgInviteRestrict: any[];
  externalMembersDisabled: boolean;
  associatedDomain: string | null;
  googleAppsVersion: number;
  boardVisibilityRestrict: {
    private: string;
    org: string;
    public: string;
  };
  boardDeleteRestrict: {
    private: string;
    org: string;
    public: string;
  };
  attachmentRestrictions: any[] | null;
}

export interface Membership {
  id: string;
  idMember: string;
  memberType: 'admin' | 'normal' | 'observer';
  unconfirmed: boolean;
  deactivated: boolean;
}

export interface Action {
  id: string;
  idMemberCreator: string;
  data: any;
  type: string;
  date: string;
  limits: any;
  display: {
    translationKey: string;
    entities: any;
  };
  memberCreator: Member;
}

export interface Notification {
  id: string;
  unread: boolean;
  type: string;
  date: string;
  dateRead: string | null;
  data: any;
  idMemberCreator: string;
  idAction: string;
  reactions: any[];
  memberCreator: Member;
}

export interface CustomField {
  id: string;
  idModel: string;
  modelType: 'board';
  fieldGroup: string;
  name: string;
  pos: number;
  options?: CustomFieldOption[];
  type: 'checkbox' | 'date' | 'list' | 'number' | 'text';
  display: {
    cardFront: boolean;
  };
}

export interface CustomFieldOption {
  id: string;
  idCustomField: string;
  value: {
    text: string;
  };
  color: string;
  pos: number;
}

export interface CustomFieldItem {
  id: string;
  value: any;
  idCustomField: string;
  idModel: string;
  modelType: 'card';
}

export interface Webhook {
  id: string;
  description: string;
  idModel: string;
  callbackURL: string;
  active: boolean;
  consecutiveFailures: number;
  firstConsecutiveFailDate: string | null;
}

export interface PowerUp {
  id: string;
  idOrganizationOwner: string;
  name: string;
  public: boolean;
}

export interface Token {
  id: string;
  identifier: string;
  idMember: string;
  dateCreated: string;
  dateExpires: string | null;
  permissions: TokenPermission[];
}

export interface TokenPermission {
  idModel: string;
  modelType: 'Member' | 'Board' | 'Organization';
  read: boolean;
  write: boolean;
}

export interface SearchResults {
  cards?: TrelloCard[];
  boards?: TrelloBoard[];
  members?: Member[];
  organizations?: Organization[];
  options?: {
    terms: any[];
    modifiers: any[];
  };
}

export interface TrelloError {
  message: string;
  error: string;
}

export interface PaginationParams {
  limit?: number;
  before?: string;
  since?: string;
  page?: number;
}

export interface BoardFields {
  name?: string;
  desc?: string;
  closed?: boolean;
  idOrganization?: string;
  idBoardSource?: string;
  prefs_permissionLevel?: 'private' | 'org' | 'public';
  prefs_voting?: 'disabled' | 'enabled';
  prefs_comments?: 'disabled' | 'members' | 'observers' | 'org' | 'public';
  prefs_invitations?: 'members' | 'admins';
  prefs_selfJoin?: boolean;
  prefs_cardCovers?: boolean;
  prefs_background?: string;
  prefs_cardAging?: 'regular' | 'pirate';
}

export interface ListFields {
  name?: string;
  closed?: boolean;
  idBoard?: string;
  pos?: number | 'top' | 'bottom';
  subscribed?: boolean;
}

export interface CardFields {
  name?: string;
  desc?: string;
  closed?: boolean;
  idMembers?: string[];
  idLabels?: string[];
  idList?: string;
  idBoard?: string;
  pos?: number | 'top' | 'bottom';
  due?: string | null;
  dueComplete?: boolean;
  start?: string | null;
  subscribed?: boolean;
  idCardSource?: string;
  keepFromSource?: string;
  cover?: Partial<CardCover>;
}

export interface ChecklistFields {
  name?: string;
  idCard?: string;
  pos?: number | 'top' | 'bottom';
  idChecklistSource?: string;
}

export interface CheckItemFields {
  name?: string;
  pos?: number | 'top' | 'bottom';
  state?: 'complete' | 'incomplete';
  due?: string | null;
  idMember?: string | null;
}

export interface LabelFields {
  name?: string;
  color?: string | null;
}

export interface OrganizationFields {
  name?: string;
  displayName?: string;
  desc?: string;
  website?: string;
  prefs_permissionLevel?: 'private' | 'public';
  prefs_orgInviteRestrict?: string[];
  prefs_externalMembersDisabled?: boolean;
  prefs_associatedDomain?: string;
}

export interface WebhookFields {
  description?: string;
  callbackURL?: string;
  idModel?: string;
  active?: boolean;
}

export interface CommentData {
  text: string;
}

export interface AttachmentData {
  name?: string;
  file?: any;
  url?: string;
  mimeType?: string;
  setCover?: boolean;
}
