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
const { handler } = require("../unfollow");

describe("Follow Command", () => {
  it("handler", async () => {
    const argv = {
      twitchApi: {
        fetchUsers: sinon.stub(),
        unfollow: sinon.fake(),
      },
      reply: sinon.fake(),
      channels: ["user", "user2"],
    };

    const users = [{
      _id: 0,
    }, {
      _id: 1,
    }];
    argv.twitchApi.fetchUsers.resolves(users);

    await handler(argv);

    sinon.assert.calledWith(argv.twitchApi.fetchUsers, argv.channels);

    for (const user of users) {
      sinon.assert.calledWith(argv.twitchApi.unfollow, user._id);
    }

    sinon.assert.calledWith(argv.reply, `Unfollowed ${argv.channels.join(", ")}`);
  });
});
