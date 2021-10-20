import Taro from "@tarojs/taro";
import { useShareAppMessage } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import "./index.scss";
import { getUserProfile, navigateTo, VERSION } from "../../utils";
import MyPlayer from "../../Components/MyPlayer";

export default function Index() {
  // 设置分享
  useShareAppMessage(() => {
    const title = "骰子桌游大全，各种骰子游戏，快来玩吧！";
    return {
      title,
      path: `/pages/home/index`,
      imageUrl: "https://cdn.renwuming.cn/static/yahtzee/imgs/cover.jpg",
    };
  });

  function gotoJmz() {
    Taro.navigateToMiniProgram({
      appId: "wxfe74b714bde12b3f",
    });
  }

  return (
    <View className="home">
      <Image
        className="cover"
        src="https://cdn.renwuming.cn/static/yahtzee/imgs/cover.jpg"
      ></Image>
      <Text className="version">{VERSION}</Text>
      <MyPlayer></MyPlayer>
      <View className="btn-list">
        <AtButton
          circle
          type="secondary"
          onClick={() => {
            getUserProfile(() => {
              navigateTo("", `seasonRank/index`);
            });
          }}
        >
          排行榜
        </AtButton>
        <AtButton
          circle
          type="primary"
          onClick={() => {
            getUserProfile(() => {
              navigateTo("CantStop", `hall/index`);
            });
          }}
        >
          <Image src="https://cdn.renwuming.cn/static/cantstop/imgs/cantstop-share.jpg"></Image>
          欲罢不能
        </AtButton>
        <AtButton
          circle
          type="primary"
          onClick={() => {
            getUserProfile(() => {
              navigateTo("Martian", `hall/index`);
            });
          }}
        >
          <Image src="https://cdn.renwuming.cn/static/martian/imgs/martian-share.jpg"></Image>
          火星骰
        </AtButton>
        <AtButton
          circle
          type="primary"
          onClick={() => {
            getUserProfile(() => {
              navigateTo("Yahtzee", `hall/index`);
            });
          }}
        >
          <Image src="https://cdn.renwuming.cn/static/yahtzee/imgs/share.png"></Image>
          快艇骰子
        </AtButton>
        <AtButton
          circle
          type="primary"
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
