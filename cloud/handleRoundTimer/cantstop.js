const cloud = require("wx-server-sdk");
const ENV = "prod-0gjpxr644f6d941d";

async function execHandleExceptionCantStop(db) {
  const _ = db.command;
  // 处理【最近1小时的】【未结束的】游戏
  const ONE_HOUR = 1 * 60 * 60 * 1000;
  const TIME = new Date(Date.now() - ONE_HOUR);
  const list = await db
    .collection("cantstop_games")
    .where({
      _updateTime: _.gt(TIME),
      end: _.neq(true),
    })
    .limit(1000) // TODO 分页查询
    .get()
    .then((res) => res.data);

  list.forEach((item) => {
    handleExceptionCantStop(db, item);
  });
}

async function handleExceptionCantStop(db, game) {
  const _ = db.command;
  const { _id, roundPlayer, players, start, roundSum } = game;
  const realPlayers = players.filter((item) => item && item.openid);
  const redundantPlayers = realPlayers.length < players.length;
  const updateData = {};
  // 纠正玩家离开房间后，更新了在线时间戳
  if (redundantPlayers) {
    updateData.players = realPlayers;
  }

  // 纠正在开始游戏的瞬间，玩家离开了房间
  if (start && roundPlayer >= realPlayers.length) {
    updateData.roundPlayer = 0;
  }

  // 强制结束回合数过长的游戏
  if (start && roundSum > 200) {
    updateData.end = true;
    updateData.endTime = new Date();
    updateData.winner = -1;
  }

  if (Object.keys(updateData).length > 0) {
    await db.collection("cantstop_games").doc(_id).update({
      data: updateData,
    });
  }
}

async function execHandleRoundTimerCantStop(db) {
  const _ = db.command;
  // 处理所有【开始的】【多人的】游戏
  const list = await db
    .collection("cantstop_games")
    .where({
      start: true,
      end: _.neq(true),
      "players.1": _.exists(1),
    })
    .limit(1000) // TODO 分页查询
    .get()
    .then((res) => res.data);

  list.forEach((item) => {
    handleRoundTimerCantStop(item);
  });
}

function handleRoundTimerCantStop(game) {
  const ROUND_TIME_LIMIT = 65 * 1000;

  const { _id, round } = game;
  const { roundTimeStamp } = round;
  const outOfTime = Date.now() - (roundTimeStamp || 0) > ROUND_TIME_LIMIT;

  if (outOfTime) {
    // 结束回合
    cloud.callFunction({
      name: "cantstopUpdateGame",
      data: {
        env: ENV,
        id: _id,
        action: "endRoundByTimer",
      },
    });
  }
}

module.exports = {
  execHandleRoundTimerCantStop,
  execHandleExceptionCantStop,
};
