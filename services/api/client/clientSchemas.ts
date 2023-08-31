/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
export type PaginatedDto = {
  total: number;
  limit: number;
  offset: number;
  count: number;
  results: any[];
};

export type ChainDto = {
  id: string;
  name: string;
  description?: string | null;
};

export type UserInvoiceDto = {
  user_id: string;
  /**
   * @format date-time
   */
  created_at: string;
  invoice_pdf: string;
};

export type RegisterUserDto = {
  email?: string;
  wallet_address: string;
  chain_id: string;
  wallet_type: "Ramper" | "SelfCreated";
};

export type ProfileDto = {
  id: string;
  wallet_address: string;
  chain_id: string;
  user_id: string;
  balance: number;
  created_by_id: string;
  /**
   * @format date-time
   */
  created_at?: string;
  /**
   * @format date-time
   */
  updated_at?: string;
};

export type UserDto = {
  id: string;
  email: string;
  username: string;
  role: "Admin" | "User" | "Member";
  provider?: "Apple" | "Facebook" | "Google";
  provider_id?: string;
  organization_id?: string;
  profile?: ProfileDto;
  status?: "Pending" | "Active";
};

export type UserLoginDto = {
  id_token: string;
  account_id: string;
};

export type JwtTokenDto = {
  token: string;
};

export type CampaignTypeDto = {
  id: string;
  name: string;
  description?: string | null;
};

export type FileDto = {
  id: string;
  name: string;
  tags: string[];
  mime_type: string;
  url: string;
  key: string;
  campaign_id: string;
  created_by_id: string;
  updated_by_id?: string;
  /**
   * @format date-time
   */
  created_at?: string;
  /**
   * @format date-time
   */
  updated_at?: string;
};

export type NftTypeDto = {
  id: string;
  name: string;
  description?: string | null;
};

export type NftDto = {
  id: string;
  campaign_id?: string | null;
  campaign?: Record<string, any> | null;
  nft_type: NftTypeDto;
  name: string;
  nft_initiated?: boolean;
  description?: string | null;
  properties?: Record<string, any> | null;
  supply?: number | null;
  file: FileDto;
};

export type CampaignOrderDto = {
  id: string;
  campaign_id: string;
  price: number;
  /**
   * @format date-time
   */
  created_at: string;
};

export type CampaignDto = {
  id: string;
  name: string;
  /**
   * @format date-time
   */
  start_date: string;
  campaign_type: CampaignTypeDto;
  chain: ChainDto;
  /**
   * @format date-time
   */
  end_date?: string | null;
  description?: string | null;
  additional_description?: string | null;
  organization_id?: string | null;
  files?: FileDto[];
  nfts: NftDto[] | null;
  status: "Created" | "Started" | "Paused" | "Ended";
  payment_type?: "CreatorPays" | "BothPay";
  campaign_order?: CampaignOrderDto;
};

export type NearNftAttribute = {
  trait_type: string;
  value: string;
};

export type NearNftAttributes = {
  attributes: NearNftAttribute[];
};

export type NftOrderDto = {
  id: string;
  nft_id: string;
  price: number;
  /**
   * @format date-time
   */
  created_at: string;
};

export type UserNftDto = {
  nft_id: string;
  user_id: string;
  is_burned: boolean;
  campaign?: CampaignDto;
  nft_type: NftTypeDto;
  name: string;
  description?: string | null;
  properties?: NearNftAttributes;
  supply?: number | null;
  file: FileDto;
  nft_order?: NftOrderDto;
};

export type NftCostDto = {
  nft_id: string;
  campaign_id: string;
  price: number;
};

export type NftOrderRequestDto = {
  nft_id: string;
  account_id: string;
};

export type StreamableFile = {};

export type ProductDto = {
  id: string;
  name: string;
  price?: number;
  currency: string;
  payment_url: string;
};
