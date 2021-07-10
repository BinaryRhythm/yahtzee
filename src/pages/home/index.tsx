import Taro from "@tarojs/taro";
import { useShareAppMessage } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/modal.scss";
import "./index.scss";
import {
  CallCloudFunction,
  forceGetUserProfile,
  getUserProfile,
  navigateTo,
  VERSION,
} from "../../utils";
import LoadPage from "../../Components/LoadPage";
import Player from "../../Components/Player";
import { useEffect, useState } from "react";

export default function Index() {
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    refresh && setTimeout(() => setRefresh(false));
  }, [refresh]);

  const userInfo = Taro.getStorageSync("userInfo");

  // 设置分享
  useShareAppMessage(() => {
    return {
      title: "快艇骰子，一决高下！",
      path: `/pages/home/index`,
      imageUrl: "http://cdn.renwuming.cn/static/yahtzee/imgs/share.png",
    };
  });

  async function createGame() {
    const { _id } = await CallCloudFunction({
      name: "yahtzeeCreateGame",
    });
    navigateTo(`game/index?id=${_id}`);
  }

  function gotoJmz() {
    Taro.navigateToMiniProgram({
      appId: "wxfe74b714bde12b3f",
    });
  }

  return (
    <View className="home">
      <LoadPage></LoadPage>
      <Image
        className="cover"
        src="http://cdn.renwuming.cn/static/yahtzee/imgs/share.png"
      ></Image>
      <Text className="version">{VERSION}</Text>
      <View className="user-info">
        <Player data={userInfo}></Player>
      </View>
      <View className="btn-list">
        <AtButton
          type="primary"
          onClick={() => {
            getUserProfile(createGame);
            setRefresh(true);
          }}
        >
          开始
        </AtButton>
        {/* <AtButton
          type="secondary"
          onClick={() => {
            navigateTo(`gamelist/index`);
            setRefresh(true);
          }}
        >
          房间列表
        </AtButton> */}
        <AtButton
          type="secondary"
          onClick={() => {
            navigateTo(`ranking/index`);
            setRefresh(true);
          }}
        >
          排行榜
        </AtButton>
        <AtButton
          type="secondary"
          onClick={() => {
            forceGetUserProfile();
            setRefresh(true);
          }}
        >
          更新头像
        </AtButton>
        <AtButton
          circle
          type="secondary"
          onClick={() => {
            gotoJmz();
          }}
        >
          <Image src="https://cdn.renwuming.cn/static/jmz/icon.jpg"></Image>
          截码战
        </AtButton>
      </View>
    </View>
  );
}
