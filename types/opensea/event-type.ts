export interface EventType {
  next: string;
  previous: null;
  asset_events: AssetEvent[];
}

export interface AssetEvent {
  approved_account: null;
  asset: Asset;
  asset_bundle: null;
  auction_type: null | string;
  bid_amount: null | string;
  collection_slug: Slug;
  contract_address: ContractAddress;
  created_date: Date;
  custom_event_name: null;
  dev_fee_payment_event: null;
  dev_seller_fee_basis_points: number;
  duration: null | string;
  ending_price: null | string;
  event_type: Event;
  from_account: FromAccount;
  id: number;
  is_private: boolean | null;
  owner_account: null;
  payment_token: PaymentToken;
  quantity: string;
  seller: FromAccount | null;
  starting_price: null | string;
  to_account: null;
  total_price: null;
  transaction: null;
  winner_account: null;
  listing_time: Date | null;
}

export interface Asset {
  id: number;
  num_sales: number;
  background_color: null;
  image_url: string;
  image_preview_url: string;
  image_thumbnail_url: string;
  image_original_url: string;
  animation_url: null;
  animation_original_url: null;
  name: string;
  description: string;
  external_link: null | string;
  asset_contract: AssetContract;
  permalink: string;
  collection: Collection;
  decimals: number;
  token_metadata: string;
  is_nsfw: boolean;
  owner: FromAccount;
  token_id: string;
}

export interface AssetContract {
  address: AssetContractAddress;
  asset_contract_type: AssetContractType;
  created_date: Date;
  name: AssetContractName;
  nft_version: string;
  opensea_version: null;
  owner: number;
  schema_name: SchemaName;
  symbol: AssetContractSymbol;
  total_supply: string;
  description: string;
  external_link: string;
  image_url: string;
  default_to_fiat: boolean;
  dev_buyer_fee_basis_points: number;
  dev_seller_fee_basis_points: number;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: number;
  opensea_seller_fee_basis_points: number;
  buyer_fee_basis_points: number;
  seller_fee_basis_points: number;
  payout_address: PayoutAddress;
}

export enum AssetContractAddress {
  The0X0D0167A823C6619D430B1A96Ad85B888Bcf97C37 = "0x0d0167a823c6619d430b1a96ad85b888bcf97c37",
  The0Xf9C362Cdd6Eeba080Dd87845E88512Aa0A18C615 = "0xf9c362cdd6eeba080dd87845e88512aa0a18c615",
}

export enum AssetContractType {
  NonFungible = "non-fungible",
}

export enum AssetContractName {
  ExpansionPunks = "ExpansionPunks",
  MetaLegends = "Meta-Legends",
}

export enum PayoutAddress {
  The0X6Df748Fd1D9154Ffaea6F2F59D369Ccacc1C9F2C = "0x6df748fd1d9154ffaea6f2f59d369ccacc1c9f2c",
  The0Xfd36E0798F12Eb63715F7Fed4E31D658617D2995 = "0xfd36e0798f12eb63715f7fed4e31d658617d2995",
}

export enum SchemaName {
  Erc721 = "ERC721",
}

export enum AssetContractSymbol {
  Ml = "ML",
  XPUNK = "xPUNK",
}

export interface Collection {
  banner_image_url: string;
  chat_url: null;
  created_date: Date;
  default_to_fiat: boolean;
  description: string;
  dev_buyer_fee_basis_points: string;
  dev_seller_fee_basis_points: string;
  discord_url: string;
  display_data: DisplayData;
  external_url: string;
  featured: boolean;
  featured_image_url: string;
  hidden: boolean;
  safelist_request_status: SafelistRequestStatus;
  image_url: string;
  is_subject_to_whitelist: boolean;
  large_image_url: string;
  medium_username: MediumUsername;
  name: CollectionName;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: string;
  opensea_seller_fee_basis_points: string;
  payout_address: PayoutAddress;
  require_email: boolean;
  short_description: null;
  slug: Slug;
  telegram_url: null;
  twitter_username: TwitterUsername;
  instagram_username: InstagramUsername | null;
  wiki_url: null;
  is_nsfw: boolean;
}

export interface DisplayData {
  card_display_style: CardDisplayStyle;
}

export enum CardDisplayStyle {
  Contain = "contain",
}

export enum InstagramUsername {
  MetaLegends = "meta.legends/",
}

export enum MediumUsername {
  Metalegends = "metalegends",
  Posvar = "Posvar",
}

export enum CollectionName {
  ExpansionPunks = "ExpansionPunks",
  MetaLegends = "Meta Legends",
}

export enum SafelistRequestStatus {
  Approved = "approved",
}

export enum Slug {
  Expansionpunks = "expansionpunks",
  MetaLegends = "meta-legends",
}

export enum TwitterUsername {
  ExpansionPunks = "ExpansionPunks",
  Metalegendsnft = "metalegendsnft",
}

export interface FromAccount {
  user: User | null;
  profile_img_url: string;
  address: string;
  config: string;
}

export interface User {
  username: null | string;
}

export enum ContractAddress {
  The0X7F268357A8C2552623316E2562D90E642Bb538E5 = "0x7f268357a8c2552623316e2562d90e642bb538e5",
}

export enum Event {
  Created = "created",
  OfferEntered = "offer_entered",
}

export interface PaymentToken {
  symbol: PaymentTokenSymbol;
  address: PaymentTokenAddress;
  image_url: string;
  name: PaymentTokenName;
  decimals: number;
  eth_price: string;
  usd_price: string;
}

export enum PaymentTokenAddress {
  The0X0000000000000000000000000000000000000000 = "0x0000000000000000000000000000000000000000",
  The0Xc02Aaa39B223Fe8D0A0E5C4F27Ead9083C756Cc2 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
}

export enum PaymentTokenName {
  Ether = "Ether",
  WrappedEther = "Wrapped Ether",
}

export enum PaymentTokenSymbol {
  Eth = "ETH",
  Weth = "WETH",
}
