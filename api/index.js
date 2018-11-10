// Copyright (C) 2018 mlvzk
// 
// This file is part of twitch-proxy.
// 
// twitch-proxy is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// twitch-proxy is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with twitch-proxy.  If not, see <http://www.gnu.org/licenses/>.

const got = require("got");

module.exports = class TwitchApi {
  constructor (clientID, token) {
    this.baseURL = "https://api.twitch.tv/v5";
    this.defaultHeaders = {
      "client-id": clientID,
      authorization: `OAuth ${token}`,
      accept: "application/vnd.twitchtv.v5+json",
    };
    this.userInfo = {};
  }

  async prepareUserInfo () {
    const { body } = await got.get(`${this.baseURL}/user`, {
      headers: this.defaultHeaders,
      json: true,
    });

    this.userInfo = body;
  }

  async fetchUsers (logins) {
    const { body } = await got.get(`${this.baseURL}/users?login=${logins.join(",")}`, {
      headers: this.defaultHeaders,
      json: true,
    });
    return body.users;
  }

  async follow (targetChannel, notifications = false) {
    await got.put(`${this.baseURL}/users/${this.userInfo._id}/follows/channels/${targetChannel}`, {
      headers: this.defaultHeaders,
      json: true,
      body: { notifications },
    });
  }

  async unfollow (targetChannel) {
    await got.delete(`${this.baseURL}/users/${this.userInfo._id}/follows/channels/${targetChannel}`, {
      headers: this.defaultHeaders,
    });
  }

  async fetchUserFollowByChannel (userID, targetChannelID) {
    const { body } = await got.get(`${this.baseURL}/users/${userID}/follows/channels/${targetChannelID}`, {
      headers: this.defaultHeaders,
      json: true,
    });

    return body;
  }
};
