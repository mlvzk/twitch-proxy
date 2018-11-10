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

const parseMessage = require("../parseMessage");

describe("parseMessage", () => {
  it("Whisper", () => {
    const rawMessage = "@badges=;color=#8A2BE2;display-name=user;emotes=;message-id=947;thread-id=123456_54645;turbo=0;user-id=123456;user-type= :user!user@user.tmi.twitch.tv WHISPER user :test";

    expect(parseMessage(rawMessage)).toMatchSnapshot();
  });

  it("Ping", () => {
    const rawMessage = "PING :tmi.twitch.tv";

    expect(parseMessage(rawMessage)).toMatchSnapshot();
  });
});
