import Taro, { useDidShow } from "@tarojs/taro";
import { View, Text, CommonEventFunction, Image } from "@tarojs/components";
import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtButton,
  AtIcon,
} from "taro-ui";
import { useContext, useEffect, useState } from "react";
import { getPlayerByOpenid, isMe, navigateTo } from "@/utils";
import "./index.scss";
import { AchievementGameIndex, GIFT_LIST, PlayerContext } from "@/const";
// @ts-ignore
import GoldIcon from "@/assets/imgs/gold.png";
import { updateGiftDeal_Database } from "./giftApi";
import AchievementItem from "@/Components/AchievementItem";

interface IProps {
  data: Player;
  index?: number;
  isOpened: boolean;
  onClose: CommonEventFunction<unknown>;
}

export default function Index({ data, index = -1, isOpened, onClose }: IProps) {
  const playerContext = useContext(PlayerContext);
  const { showGift, initGameIndex, playerIndex, players, gameID } =
    playerContext;

  const { openid, nickName, avatarUrl } = data;
  const me = isMe(openid);
  const realShowGift = showGift && !me;

  const [playerData, setPlayerData] = useState<Player>(null);
  const [myData, setMyData] = useState<Player>(null);
  const [waiting, setWaiting] = useState<boolean>(false);

  async function initAchievement() {
    const { openid: myOpenid } = Taro.getStorageSync("userInfo");
    const myData = await getPlayerByOpenid(myOpenid);
    const playerData = await getPlayerByOpenid(openid);

    setPlayerData(playerData);
    setMyData(myData);
  }

  useEffect(() => {
    if (isOpened) initAchievement();
  }, [isOpened]);

  useDidShow(() => {
    initAchievement();
  });

  const { achievement, wealth } = playerData || {};
  const { yahtzee, martian, cantstop, set } = achievement || {};
  const { gold } = wealth || {};

  async function sendGiftTo(gift: GiftItem) {
    if (waiting) return;
    const { type, price } = gift;
    const sender = players[playerIndex].openid;
    const receiver = players[index].openid;
    try {
      setWaiting(true);
      await updateGiftDeal_Database(sender, receiver, type, price, gameID);
    } catch (err) {
      Taro.showToast({
        title: err,
        icon: "none",
        duration: 1500,
      });
    }
    setWaiting(false);
    initAchievement();
  }

  return (
    <View className="achievement-box">
      <AtModal isOpened={isOpened} onClose={onClose}>
        <AtModalHeader>
          <View
            className="player-info-big"
            onClick={() => {
              navigateTo("", `homepage/index?openid=${openid}`);
            }}
          >
            <Image className={`avatar`} src={avatarUrl}></Image>
            <Text>{nickName}</Text>
          </View>
          {me && (
            <View className="at-row btn-row">
              <AtButton
                type="primary"
                onClick={() => {
                  navigateTo("wealth", "index");
                }}
              >
                <Image className="icon" src={GoldIcon} mode="aspectFit" />
                <Text className="icon-text">{gold || 0}</Text>
                <AtIcon value="add" size="16" color="#fff"></AtIcon>
              </AtButton>
            </View>
          )}
        </AtModalHeader>
        <AtModalContent>
          {initGameIndex === AchievementGameIndex.yahtzee && (
            <AchievementItem
              gameName="yahtzee"
              data={yahtzee}
              noTitle={true}
            ></AchievementItem>
          )}
          {initGameIndex === AchievementGameIndex.martian && (
            <AchievementItem
              gameName="martian"
              data={martian}
              noTitle={true}
            ></AchievementItem>
          )}
          {initGameIndex === AchievementGameIndex.cantstop && (
            <AchievementItem
              gameName="cantstop"
              data={cantstop}
              noTitle={true}
            ></AchievementItem>
          )}
          {initGameIndex === AchievementGameIndex.set && (
            <AchievementItem
              gameName="set"
              data={set}
              noTitle={true}
            ></AchievementItem>
          )}

          {realShowGift && (
            <View className="gift-container">
              <View className="gift-box at-row at-row__align--center">
                {GIFT_LIST.map((item) => {
                  const { icon, price } = item;
                  return (
                    <View className="item-box at-col at-col-3">
                      <View
                        className="item"
                        onClick={() => {
                          sendGiftTo(item);
                        }}
                      >
                        <View className="top">{icon()}</View>
                        <View className="bottom">
                          <Image
                            className="img"
                            src={GoldIcon}
                            mode="aspectFit"
                          />
                          {price}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              <Text className="reserved-gold">
                剩余金币 {myData?.wealth?.gold || 0}
              </Text>
            </View>
          )}
        </AtModalContent>
      </AtModal>
    </View>
  );
}
