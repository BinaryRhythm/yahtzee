// 云函数入口文件
const cloud = require("wx-server-sdk");

const setHandleFn = require("./set");

const handleFnMap = {
  set_games: setHandleFn,
};

const ENV = "prod-0gjpxr644f6d941d";
// 云函数入口函数
exports.main = async (event) => {
  const { id, action, data, gameDbName } = event;
  cloud.init({
    env: ENV,
  });

  if (!action || !gameDbName) return;

  if (action === "findOne") {
    return await findOne(gameDbName, id);
  } else if (action === "create") {
    return await handleFnMap[gameDbName].create(gameDbName);
  } else {
    return await handleFnMap[gameDbName].handleGame(
      id,
      action,
      data,
      gameDbName
    );
  }
};

async function findOne(gameDbName, id) {
  const db = cloud.database();
  const data = await db
    .collection(gameDbName)
    .doc(id)
    .get()
    .then((res) => res.data);
  return data;
}
