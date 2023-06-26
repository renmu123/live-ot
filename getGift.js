import axios from "axios";
import { keyBy } from "lodash-es";
import fs from "fs";

const getAllGift = async () => {
  const res1 = await axios.get(
    "https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig?platform=pc&room_id=10882247&area_parent_id=11&area_id=377"
  );
  const giftList = res1.data.data.list;
  const giftMap = keyBy(giftList, "id");
  // console.log(giftMap);

  const res2 = await axios.get(
    "https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftData?room_id=10882247&ruid=10995238&area_id=377&area_parent_id=11&platform=pc&source=live"
  );

  let roomGiftList = res2.data.data.room_gift_list.gold_list;
  console.log(roomGiftList);
  roomGiftList = roomGiftList.map((item) => {
    return {
      ...item,
      gift_name: giftMap[item.gift_id]["name"],
      price: giftMap[item.gift_id]["price"],
      coin_type: giftMap[item.gift_id]["coin_type"],
      img: giftMap[item.gift_id]["img_basic"],
    };
  });

  const guardData = [
    {
      gift_id: 10003,
      gift_name: "舰长",
      price: 198000,
      coin_type: "gold",
      img: "",
    },
    {
      gift_id: 10002,
      gift_name: "提督",
      price: 1980000,
      coin_type: "gold",
      img: "",
    },
    {
      gift_id: 10001,
      gift_name: "总督",
      price: 19800000,
      coin_type: "gold",
      img: "",
    },
  ];

  fs.writeFileSync(
    "data.json",
    JSON.stringify([...guardData, ...roomGiftList])
  );
};

getAllGift();
