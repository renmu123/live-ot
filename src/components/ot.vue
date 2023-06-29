<template>
  <Card :gifts="data" v-model:remaining-time="remainingTime"></Card>
</template>

<script setup lang="ts">
import Card from "./Card.vue";
import giftData from "@/assets/data.json";
import { LiveWS } from "bilibili-live-ws";
import { parse } from "@/utils/danmu";

import type { CustomData, OperationType } from "@/types/index.d.ts";
import { OperationEnum } from "@/types/enum";

const remainingTime = ref(0);
const data = ref<
  {
    gift_name: string | undefined;
    gift_img: string | undefined;
    gift_id: number;
    type: OperationType;
    param: number;
  }[]
>([]);

const load = () => {
  const gift = localStorage.getItem("gift");
  if (gift) {
    const customData: Required<CustomData>[] = JSON.parse(gift);

    data.value = customData.map((item) => {
      let param = item.param;
      if (
        item.type === OperationEnum.plus ||
        item.type === OperationEnum.minus
      ) {
        param = item.hour * 3600 + item.minute * 60 + item.second;
      }

      const gift = giftData.find((gift) => gift.gift_id === item.gift_id);
      return {
        gift_name: gift?.gift_name,
        gift_img: gift?.img,
        gift_id: item.gift_id,

        type: item.type,
        param: param,
      };
    });
  }

  const remaining = localStorage.getItem("remainingTime");
  if (remaining) {
    remainingTime.value = Number(remaining);
  }
};

const roomId = ref();
let live: LiveWS;
const createLive = () => {
  live = new LiveWS(roomId.value);
  // @ts-ignore
  live.on("open", () => console.log("Connection is established"));
  // @ts-ignore
  live.on("live", () => {
    // @ts-ignore
    live.on("heartbeat", console.log);
    ElMessage.success("连接直播间成功");
  });

  // @ts-ignore
  live.on("msg", (msg: any) => {
    const item = parse(msg);

    if (item.cmd === "SEND_GIFT") {
      const gift = data.value.find((gift) => gift.gift_id === item.info.giftId);
      if (gift) {
        const time = item.info.num * (gift.param ?? 0);
        if (gift.type === OperationEnum.clear) {
          remainingTime.value = 0;
        } else if (gift.type === OperationEnum.divide) {
          remainingTime.value /= time;
        } else if (gift.type === OperationEnum.multiply) {
          remainingTime.value *= time;
        } else if (gift.type === OperationEnum.minus) {
          remainingTime.value -= time;
        } else if (gift.type === OperationEnum.plus) {
          remainingTime.value += time;
        }
      }
    }
  });
};

const connect = () => {
  createLive();
};
const unconnect = () => {
  live.close();
  // live = null;
};

const runing = ref(false);
const start = (id: number) => {
  roomId.value = id;
  load();
  if (!runing.value) {
    connect();
    runing.value = true;
  }
};

const stop = () => {
  if (runing.value) {
    unconnect();
    runing.value = false;
    localStorage.setItem("remainingTime", String(remainingTime.value));
  }
};

const setTime = (time: number) => {
  remainingTime.value = time;
  localStorage.setItem("remainingTime", String(remainingTime.value));
};

setInterval(() => {
  if (runing.value) {
    localStorage.setItem("remainingTime", String(remainingTime.value));
  }
}, 10000);

setInterval(() => {
  if (!runing.value) return;
  if (remainingTime.value <= 0) return;
  remainingTime.value = remainingTime.value - 1;
}, 1000);

defineExpose({
  start,
  stop,
  setTime,
});

onMounted(() => {
  const remaining = localStorage.getItem("remainingTime");
  if (remaining) {
    remainingTime.value = Number(remaining);
  }
});
</script>

<style scoped></style>
