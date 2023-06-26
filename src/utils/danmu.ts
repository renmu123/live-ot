import { cloneDeep } from "lodash-es";
import { Danmu, DanmuMsg, DanmuGift, DanmuSC, DanmuGuard } from "@/types/index";

export const parse = (
  origin: any
): DanmuMsg | DanmuGift | DanmuSC | DanmuGuard => {
  // @ts-ignore
  const data: Danmu = {
    info: {},
  };
  const { cmd } = cloneDeep(origin);
  if (cmd === "DANMU_MSG") {
    data.info.user = origin.info[2][1];
    data.info.text = origin.info[1];
  } else if (cmd === "SEND_GIFT") {
    data.info.action = origin.data.action;
    data.info.giftId = origin.data.giftId;
    data.info.giftName = origin.data.giftName;
    data.info.giftType = origin.data.giftType;
    data.info.price = origin.data.price;
    data.info.num = origin.data.num;
    data.info.user = origin.data.uname;
    data.info.coinType = origin.data.coin_type; // silver||gold
  } else if (cmd === "SUPER_CHAT_MESSAGE") {
    data.info.user = origin.data.user_info.uname;
    data.info.message = origin.data.message;
    data.info.price = origin.data.price;
  } else if (cmd === "GUARD_BUY") {
    data.info = origin.data; // guard_level=3舰长，2提督，1总督
    // 'uid': 51553397,
    // 'username': 'kimikimi1721',
    // 'guard_level': 3,
    // 'num': 1,
    // 'price': 198000,
    // 'gift_id': 10003,
    // 'gift_name': '舰长',
    // 'start_time': 1650363149,
    // 'end_time': 1650363149
  }
  data["cmd"] = cmd;
  data["meta"] = origin;

  return data;
};
