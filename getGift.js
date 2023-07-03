import axios from "axios";
import { keyBy } from "lodash-es";
import fs from "fs";
import path from "path";

const getAllGift = async () => {
  const ROOM_ID = 10882247; // 房间号
  const AREA_PARENT_ID = 11; // 大分区ID
  const AREA_ID = 377; // 小分区ID

  const res1 = await axios.get(
    `https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig?platform=pc&room_id=${ROOM_ID}&area_parent_id=${AREA_PARENT_ID}&area_id=${AREA_ID}`
  );
  const giftList = res1.data.data.list;
  const giftMap = keyBy(giftList, "id");

  const res2 = await axios.get(
    `https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftData?room_id=${ROOM_ID}&ruid=${AREA_PARENT_ID}&area_id=377&area_parent_id=${AREA_ID}&platform=pc&source=live`
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
  roomGiftList = roomGiftList.sort((a, b) => a.price - b.price);

  const guardData = [
    {
      gift_id: 10003,
      gift_name: "舰长",
      price: 198000,
      coin_type: "gold",
      img: "https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon-l-3.402ac8f..png",
    },
    {
      gift_id: 10002,
      gift_name: "提督",
      price: 1980000,
      coin_type: "gold",
      img: "https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon-l-2.6f68d77..png",
    },
    {
      gift_id: 10001,
      gift_name: "总督",
      price: 19800000,
      coin_type: "gold",
      img: "https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon-l-1.fde1190..png",
    },
  ];

  fs.writeFileSync(
    path.join("src", "assets", "data.json"),
    JSON.stringify([...guardData, ...roomGiftList])
  );
};

getAllGift();
