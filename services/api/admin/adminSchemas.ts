/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
export type GoogleVerificationDto = {
  token: string;
};

export type PaginatedDto = {
  total: number;
  limit: number;
  offset: number;
  count: number;
  results: any[];
};

export type NearNftAttribute = {
  trait_type: string;
  value: string;
};

export type NearNftAttributes = {
  attributes: NearNftAttribute[];
};

export type CreateNftDto = {
  name: string;
  nft_type_id: string;
  file_id: string;
  description?: string | null;
  properties?: NearNftAttributes;
  supply?: number | null;
};

export type CreateCampaingDto = {
  name: string;
  campaign_type_id: string;
  chain_id: string;
  /**
   * @format date-time
   */
  start_date: string;
  /**
   * @format date-time
   */
  end_date?: string | null;
  description?: string | null;
  additional_description?: string | null;
  nfts: CreateNftDto[];
  file_ids?: string[];
};

export type CampaignTypeDto = {
  id: string;
  name: string;
  description?: string | null;
};

export type ChainDto = {
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
  files?: FileDto[];
  nfts: NftDto[] | null;
  status: "Created" | "Started" | "Paused" | "Ended";
};

export type UpdateCampaignDto = {
  name?: string | null;
  description?: string | null;
  additional_description?: string | null;
  campaign_type_id?: string | null;
  chain_id?: string | null;
  /**
   * @format date-time
   */
  start_date?: string | null;
  /**
   * @format date-time
   */
  end_date?: string | null;
  file_ids: string[] | null;
};

export type CampaignStatusDto = {
  status: "Ended" | "Paused" | "Started";
};
