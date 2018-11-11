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

const sinon = require("sinon");
const { handler } = require("../followage");

describe("Followage Command", () => {
  it("handler", async () => {
    const user = {
      name: "someusername",
      _id: 0,
    };
    const channel = {
      name: "somechannelname",
      _id: 1,
    };
    const users = [channel, user];

    const followData = {
      created_at: (new Date()).toJSON(),
      channel,
      notifications: true,
    };

    const argv = {
      twitchApi: {
        fetchUsers: sinon.fake.resolves(users),
        fetchUserFollowByChannel: sinon.fake.resolves(followData),
      },
      reply: sinon.fake(),
      user: user.name,
      channel: channel.name,
    };

    await handler(argv);

    sinon.assert.calledWith(argv.twitchApi.fetchUsers, [user.name, channel.name]);
    sinon.assert.calledWith(argv.twitchApi.fetchUserFollowByChannel, user._id, channel._id);
    sinon.assert.calledWith(argv.reply, sinon.match.string);
  });
});
