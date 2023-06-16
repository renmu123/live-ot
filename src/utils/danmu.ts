export const parse = (origin: any) => {
  const data: any = {
    info: {},
  };
  const { cmd } = origin;
  if (cmd === "DANMU_MSG") {
    data.info.user = origin.info[2][1];
    data.info.text = origin.info[1];
  } else if (cmd === "SEND_GIFT") {
    data.info.giftId = origin.data.giftId;
    data.info.giftName = origin.data.giftName;
    data.info.giftType = origin.data.giftType;
    data.info.price = origin.data.price;
    data.info.num = origin.data.num;
    data.info.user = origin.data.uname;
  }
  data["cmd"] = cmd;
  data["meta"] = origin;

  return data;
};
