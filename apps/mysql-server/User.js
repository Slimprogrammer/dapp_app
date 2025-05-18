const db = require("./db");
const { insertData, selectAll } = require("./db");

class User {
  wallet_address = null;
  role = null;
  user_id = null;
  has_joined = null;
  create_time = null;
  socket_id = null;
  connected_time = null;
  disconnected_time = null;
  total_asset_available = null;
  total_asset_staked = null;
  

  // Constructor
  constructor(wallet_address, role) {
    this.wallet_address = wallet_address;
    this.role = role;
    console.log(
      "User with wallet address exists:",
       this.check_if_user_exists(wallet_address)
    );
    if (!this.check_if_user_exists(wallet_address)) {
      this.create_user(wallet_address, role);
      console.log("User created with wallet address:", wallet_address);
    }

    
    
  }

  async check_if_user_exists(address) {
    const exists = await db.valueExists("users", "wallet_address", address);
    return exists;
  }

  async get_user_data(address) {
    const userData = await db.selectRow("users", { wallet_address: address });
    return userData;
  }
  async create_user(address, role) {
    const userData = await db.insertData("users", {
      wallet_address: address,
      role: role,
    });
    console.log(userData);
    /* db.assets_list.forEach((element) => {
      create_user_assets(user_id, element)
    }); */
    return userData;
  }

  async create_user_assets(user_id,asset_name) {
    await db.insertData("users", {
      wallet_address: user_id,
      role: user_id,
    });
  }
  // Dynamically generate getters and setters
  get user_id() {
    return this.user_id;
  }
  set user_id(val) {
    this.user_id = val;
  }

  get wallet_address() {
    return this.wallet_address;
  }
  set wallet_address(val) {
    this.wallet_address = val;
  }

  get has_joined() {
    return this.has_joined;
  }
  set has_joined(val) {
    this.has_joined = val;
  }

  get create_time() {
    return this.create_time;
  }
  set create_time(val) {
    this.create_time = val;
  }

  get role() {
    return this.role;
  }
  set role(val) {
    this.role = val;
  }

  get socket_id() {
    return this.socket_id;
  }
  set socket_id(val) {
    this.socket_id = val;
  }

  get connected_time() {
    return this.connected_time;
  }
  set connected_time(val) {
    this.connected_time = val;
  }

  get disconnected_time() {
    return this.disconnected_time;
  }
  set disconnected_time(val) {
    this.disconnected_time = val;
  }

  get total_asset_available() {
    return this.total_asset_available;
  }
  set total_asset_available(val) {
    this.total_asset_available = val;
  }

  get total_asset_staked() {
    return this.total_asset_staked;
  }
  set total_asset_staked(val) {
    this.total_asset_staked = val;
  }

  get total_asset_unstaked() {
    return this.total_asset_unstaked;
  }
  set total_asset_unstaked(val) {
    this.total_asset_unstaked = val;
  }

  get total_asset_withdrawn() {
    return this.total_asset_withdrawn;
  }
  set total_asset_withdrawn(val) {
    this.total_asset_withdrawn = val;
  }

  get total_asset_deposited() {
    return this.total_asset_deposited;
  }
  set total_asset_deposited(val) {
    this.total_asset_deposited = val;
  }

  get total_asset_pending() {
    return this.total_asset_pending;
  }
  set total_asset_pending(val) {
    this.total_asset_pending = val;
  }

  get total_asset_traded() {
    return this.total_asset_traded;
  }
  set total_asset_traded(val) {
    this.total_asset_traded = val;
  }

  get total_asset_earned() {
    return this.total_asset_earned;
  }
  set total_asset_earned(val) {
    this.total_asset_earned = val;
  }

  get current_asset_staked() {
    return this.current_asset_staked;
  }
  set current_asset_staked(val) {
    this.current_asset_staked = val;
  }

  // Get full key-value pair object
  toKeyValue() {
    return "";
  }
}
// Export the User class
module.exports = User;
