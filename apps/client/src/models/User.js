class User {
  #data = {};
  #onChangeCallback = null;

  constructor(userData) {
    this.#data = { ...userData };
  }

  // Set onChange callback
  onChange(callback) {
    this.#onChangeCallback = callback;
  }

  // Trigger change
  #triggerChange(key, newValue, oldValue) {
    if (this.#onChangeCallback && newValue !== oldValue) {
      console.log("User data changed:", key, newValue, oldValue);
      // Call the callback with the changed data
      // this.#onChangeCallback({ key, newValue, oldValue });
      // Call the callback with the entire user data
      // this.#onChangeCallback(this.#data);
      this.#onChangeCallback({ key, newValue, oldValue });
    }
  }

  // Dynamically generate getters and setters
  get user_id() {
    return this.#data.user_id;
  }
  set user_id(val) {
    this.#triggerChange("user_id", val, this.#data.user_id);
    this.#data.user_id = val;
  }

  get wallet_address() {
    return this.#data.wallet_address;
  }
  set wallet_address(val) {
    this.#triggerChange("wallet_address", val, this.#data.wallet_address);
    this.#data.wallet_address = val;
  }

  get has_joined() {
    return this.#data.has_joined;
  }
  set has_joined(val) {
    this.#triggerChange("has_joined", val, this.#data.has_joined);
    this.#data.has_joined = val;
  }

  get create_time() {
    return this.#data.create_time;
  }
  set create_time(val) {
    this.#triggerChange("create_time", val, this.#data.create_time);
    this.#data.create_time = val;
  }

  get role() {
    return this.#data.role;
  }
  set role(val) {
    this.#triggerChange("role", val, this.#data.role);
    this.#data.role = val;
  }

  get socket_id() {
    return this.#data.socket_id;
  }
  set socket_id(val) {
    this.#triggerChange("socket_id", val, this.#data.socket_id);
    this.#data.socket_id = val;
  }

  get connected_time() {
    return this.#data.connected_time;
  }
  set connected_time(val) {
    this.#triggerChange("connected_time", val, this.#data.connected_time);
    this.#data.connected_time = val;
  }

  get disconnected_time() {
    return this.#data.disconnected_time;
  }
  set disconnected_time(val) {
    this.#triggerChange("disconnected_time", val, this.#data.disconnected_time);
    this.#data.disconnected_time = val;
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
    this.#triggerChange("total_asset_staked", val, this.#data.total_asset_staked);
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
    this.#triggerChange("total_asset_pending", val, this.#data.total_asset_pending);
    this.#data.total_asset_pending = val;
  }

  get total_asset_traded() {
    return this.#data.total_asset_traded;
  }
  set total_asset_traded(val) {
    this.#triggerChange("total_asset_traded", val, this.#data.total_asset_traded);
    this.#data.total_asset_traded = val;
  }

  get total_asset_earned() {
    return this.#data.total_asset_earned;
  }
  set total_asset_earned(val) {
    this.#triggerChange("total_asset_earned", val, this.#data.total_asset_earned);
    this.#data.total_asset_earned = val;
  }

  get current_asset_staked() {
    return this.#data.current_asset_staked;
  }
  set current_asset_staked(val) {
    this.#triggerChange(
      "current_asset_staked",
      val,
      this.#data.current_asset_staked
    );
    this.#data.current_asset_staked = val;
  }


  // Get full key-value pair object
  toKeyValue() {
    return { ...this.#data };
  }
}
// Export the User class
export default User;