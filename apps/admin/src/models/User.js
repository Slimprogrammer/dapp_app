export class User {
  constructor({ wallet_address, has_joined, create_time, user_id }) {
    this._wallet_address = wallet_address;
    this._has_joined = has_joined;
    this._create_time = new Date(create_time);
    this._user_id = user_id;
  }

  // Wallet Address
  get wallet_address() {
    return this._wallet_address;
  }

  set wallet_address(value) {
    this._wallet_address = value;
  }

  // Has Joined
  get has_joined() {
    return this._has_joined;
  }

  set has_joined(value) {
    this._has_joined = value;
  }

  // Create Time
  get create_time() {
    return this._create_time;
  }

  set create_time(value) {
    this._create_time = new Date(value);
  }

  // User ID
  get user_id() {
    return this._user_id;
  }

  set user_id(value) {
    this._user_id = value;
  }

  // Helpers
  hasJoined() {
    return this._has_joined === 1;
  }

  getFormattedCreateTime() {
    return this._create_time.toLocaleString();
  }
}
