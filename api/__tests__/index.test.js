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

const TwitchApi = require("../index");
const got = require("got");
const sinon = require("sinon");
const chai = require("chai");

describe("TwitchApi", () => {
  const clientID = "someclientid";
  const token = "oauthtoken";
  let twitchApi;
  let gotGet;
  let gotPut;
  let gotDelete;

  const user = {
    _id: 0,
  };

  beforeEach(() => {
    twitchApi = new TwitchApi(clientID, token);
    twitchApi.userInfo = user;

    gotGet = sinon.stub(got, "get");
    gotPut = sinon.stub(got, "put");
    gotDelete = sinon.stub(got, "delete");
  });

  afterEach(() => {
    gotGet.restore();
    gotPut.restore();
    gotDelete.restore();
  });

  it("prepareUserInfo", async () => {
    gotGet.resolves({
      body: user,
    });

    await twitchApi.prepareUserInfo();

    sinon.assert.calledWith(gotGet, `${twitchApi.baseURL}/user`, {
      headers: sinon.match.object,
      json: true,
    });

    chai.assert.deepEqual(twitchApi.userInfo, user);
  });

  it("fetchUsers", async () => {
    const logins = ["someusername"];

    gotGet.resolves({
      body: {
        users: [user],
      },
    });

    const result = await twitchApi.fetchUsers(logins);

    sinon.assert.calledWith(gotGet, `${twitchApi.baseURL}/users?login=${logins.join(",")}`);

    chai.assert.deepEqual(result, [user]);
  });

  it("follow", async () => {
    const channel = "someuser";

    gotPut.resolves();

    await twitchApi.follow(channel);

    sinon.assert.calledWith(gotPut, `${twitchApi.baseURL}/users/${user._id}/follows/channels/${channel}`, {
      headers: sinon.match.object,
      json: true,
      body: { notifications: false },
    });
  });

  it("unfollow", async () => {
    const channel = "someuser";

    gotDelete.resolves();

    await twitchApi.unfollow(channel);

    sinon.assert.calledWith(gotDelete, `${twitchApi.baseURL}/users/${user._id}/follows/channels/${channel}`, {
      headers: sinon.match.object,
    });
  });

  it("fetchUserFollowByChannel", async () => {
    const userID = 0;
    const channelID = 1;

    const followData = {
      created_at: (new Date()).toJSON(),
      channel: { _id: channelID },
      notifications: true,
    };

    gotGet.resolves({
      body: followData,
    });

    const result = await twitchApi.fetchUserFollowByChannel(userID, channelID);

    sinon.assert.calledWith(gotGet, `${twitchApi.baseURL}/users/${userID}/follows/channels/${channelID}`, {
      headers: sinon.match.object,
      json: true,
    });

    chai.assert.deepEqual(result, followData);
  });
});
