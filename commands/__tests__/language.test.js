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
const { handler } = require("../language");

describe("Language command", () => {
  it("handler", async () => {
    const user = {
      name: "someusername",
      _id: 0,
    };

    const argv = {
      twitchApi: {
        fetchUsers: sinon.fake.resolves([user]),
        fetchAllUserFollows: sinon.fake.resolves([{
          channel: {
            broadcaster_language: "en",
          },
        }]),
      },
      reply: sinon.fake(),
      user: user.name,
    };

    await handler(argv);

    sinon.assert.calledWith(argv.twitchApi.fetchUsers, [user.name]);
    sinon.assert.calledWith(argv.twitchApi.fetchAllUserFollows, user._id);
    sinon.assert.calledWith(argv.reply, sinon.match.string);
  });
});
