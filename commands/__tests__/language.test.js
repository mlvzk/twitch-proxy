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
