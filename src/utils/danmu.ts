const parse = (origin: any) => {
  const data: any = {
    info: {},
  };
  const { cmd } = origin;
  if (cmd === "DANMU_MSG") {
    // const [_, _, _, _, _, _, _, _, user, _, _, _, _, _, _, _, _, _, msg] = info;
    // data["user"] = user;
    // data["msg"] = msg;
    // const [_, _, _, _, _, _, _, _, user, _, _, _, _, _, _, _, _, _, msg] = info;
    data.info.user = origin.info[2][1];
    data.info.text = origin.info[1];
  } else if (cmd === "SEND_GIFT") {
    data["giftId"] = origin.data.giftId;
    data["giftType"] = origin.data.giftType;
    data["price"] = origin.data.price;
    data["num"] = origin.data.num;
  }
  data["cmd"] = cmd;
  data["meta"] = origin;

  return data;
};
