export type GuardType = 1 | 2 | 3; // 3舰长，2提督，1总督
export type CoinType = "silver" | "gold"; // silver||gold
export type OperationType = 1 | 2 | 3 | 4 | 5;

export interface Danmu {
  cmd: "DANMU_MSG" | "SEND_GIFT" | "SUPER_CHAT_MESSAGE" | "GUARD_BUY";
  info: any;
  meta: any;
}

// 弹幕
export interface DanmuMsg extends Danmu {
  cmd: "DANMU_MSG";
  info: {
    user: string;
    text: string;
  };
}

// 弹幕礼物
export interface DanmuGift extends Danmu {
  cmd: "SEND_GIFT";
  info: {
    action: string;
    giftId: number;
    giftName: string;
    giftType: string;
    price: number;
    num: number;
    user: string;
    coinType: CoinType;
  };
}

// SC
export interface DanmuSC extends Danmu {
  cmd: "SUPER_CHAT_MESSAGE";
  info: {
    user: string;
    message: string;
    price: number;
  };
}

// 上船
export interface DanmuGuard extends Danmu {
  cmd: "GUARD_BUY";
  info: {
    uid: number;
    username: string;
    guard_level: GuardType;
    num: number;
    price: number;
    gift_id: number;
    gift_name: string;
    start_time: number;
    end_time: number;
  };
}

export interface CustomData {
  gift_id?: number;
  type: OperationType;
  second?: number;
  id: string;
}
