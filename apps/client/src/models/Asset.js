import { getAssetLogo } from "../utils/Helpers";
import { getAssetData } from "../utils/binanceHelpers";

class Asset {
  #data = {};
  #market_data = null;
  #onChangeCallback = null;
  #logoUrl = null; // Private property to store the logo URL
  #marketData = null; // ← New private property

  constructor(assetData) {
    this.#data = { ...assetData };
    this.initialize(assetData.asset_name);
  }

   async initialize(asset_name) {
    this.logoUrl = await getAssetLogo(asset_name);

    const marketData = await getAssetData(asset_name);
    if (marketData) {
      this.#marketData = marketData;
    }
   }
   get marketData() {
    return this.#marketData;
  }


  // Set onChange callback
  onChange(callback) {
    this.#onChangeCallback = callback;
  }

  // Trigger change with additional user_id and asset_name
  #triggerChange(key, newValue, oldValue) {
    if (this.#onChangeCallback && newValue !== oldValue) {
      const { user_id, asset_name } = this.#data;
      console.log(
        "Asset data changed:",
        key,
        newValue,
        oldValue,
        user_id,
        asset_name
      );
      this.#onChangeCallback({ key, newValue, oldValue, user_id, asset_name });
    }
  }

  get id() {
    return this.#data.id;
  }
  set id(val) {
    this.#triggerChange("id", val, this.#data.id);
    this.#data.id = val;
  }
  get price() {
    return this.#market_data.price;
  }
  set price(val) {
    this.#market_data.price = val;
  }
  get volume() {
    return this.#market_data.volume;
  }
  set volume(val) {
    this.#market_data.volume = val;
  }

  get market_data() {
    return this.#market_data;
  }
  set market_data(val) {
    this.#market_data = val;
  }

  get logoUrl() {
    return this.#logoUrl;
  }
  set logoUrl(val) {
    // Added a setter if you ever need to manually set it
    // this.#triggerChange("logoUrl", val, this.#logoUrl);
    this.#logoUrl = val;
  }
  
  get user_id() {
    return this.#data.user_id;
  }
  set user_id(val) {
    this.#triggerChange("user_id", val, this.#data.user_id);
    this.#data.user_id = val;
  }

  get asset_name() {
    return this.#data.asset_name;
  }
  set asset_name(val) {
    this.#triggerChange("asset_name", val, this.#data.asset_name);
    this.#data.asset_name = val;
  }

  get total_asset_available() {
    return this.#data.total_asset_available;
  }
  set total_asset_available(val) {
    this.#triggerChange(
      "total_asset_available",
      val,
      this.#data.total_asset_available
    );
    this.#data.total_asset_available = val;
  }

  get total_asset_staked() {
    return this.#data.total_asset_staked;
  }
  set total_asset_staked(val) {
    this.#triggerChange(
      "total_asset_staked",
      val,
      this.#data.total_asset_staked
    );
    this.#data.total_asset_staked = val;
  }

  get total_asset_unstaked() {
    return this.#data.total_asset_unstaked;
  }
  set total_asset_unstaked(val) {
    this.#triggerChange(
      "total_asset_unstaked",
      val,
      this.#data.total_asset_unstaked
    );
    this.#data.total_asset_unstaked = val;
  }

  get total_asset_withdrawn() {
    return this.#data.total_asset_withdrawn;
  }
  set total_asset_withdrawn(val) {
    this.#triggerChange(
      "total_asset_withdrawn",
      val,
      this.#data.total_asset_withdrawn
    );
    this.#data.total_asset_withdrawn = val;
  }

  get total_asset_deposited() {
    return this.#data.total_asset_deposited;
  }
  set total_asset_deposited(val) {
    this.#triggerChange(
      "total_asset_deposited",
      val,
      this.#data.total_asset_deposited
    );
    this.#data.total_asset_deposited = val;
  }

  get total_asset_pending() {
    return this.#data.total_asset_pending;
  }
  set total_asset_pending(val) {
    this.#triggerChange(
      "total_asset_pending",
      val,
      this.#data.total_asset_pending
    );
    this.#data.total_asset_pending = val;
  }

  get total_asset_traded() {
    return this.#data.total_asset_traded;
  }
  set total_asset_traded(val) {
    this.#triggerChange(
      "total_asset_traded",
      val,
      this.#data.total_asset_traded
    );
    this.#data.total_asset_traded = val;
  }

  get total_asset_earned() {
    return this.#data.total_asset_earned;
  }
  set total_asset_earned(val) {
    this.#triggerChange(
      "total_asset_earned",
      val,
      this.#data.total_asset_earned
    );
    this.#data.total_asset_earned = val;
  }

  toKeyValue() {
    return {
      ...this.#data,
      logoUrl: this.#logoUrl,
      marketData: this.#marketData, // ← Include it here optionally
    };

  }
}

export default Asset;
