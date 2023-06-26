<template>
  <Card :gifts="data" v-model:remaining-time="remainingTime"></Card>

  <div style="display: flex; position: absolute; right: 20px; top: 20px">
    <el-input
      v-model.number="roomId"
      placeholder="请输入房间号"
      clearable
      style="width: 200px"
    />
    <el-button type="primary" @click="connect" style="margin-left: 10px"
      >连接</el-button
    >
    <el-button type="danger" @click="stop">断开连接</el-button>
  </div>
</template>

<script setup lang="ts">
import Card from "@/components/ot/Card.vue";
import giftData from "@/assets/data.json";
import { LiveWS } from "bilibili-live-ws";
import { parse } from "@/utils/danmu";
import { useRoute } from "vue-router";

import type { CustomData, OperationType } from "@/types/index.d.ts";
import { OperationEnum } from "@/types/enum";

const route = useRoute();

onMounted(() => {
  console.log(route.params.roomId);

  if (route.params.roomId) {
    roomId.value = Number(route.params.roomId);
  }

  if (roomId.value) {
    connect();
    ElMessage.info("正在尝试连接直播间");
  }
});

const remainingTime = ref(0);
const data = ref<
  {
    gift_name: string | undefined;
    gift_img: string | undefined;
    gift_id: number;
    type: OperationType;
    second: number;
  }[]
>([]);

const load = () => {
  const gift = localStorage.getItem("gift");
  if (gift) {
    const customData: Required<CustomData>[] = JSON.parse(gift);

    data.value = customData.map((item) => {
      const gift = giftData.find((gift) => gift.gift_id === item.gift_id);
      return {
        gift_name: gift?.gift_name,
        gift_img: gift?.img,
        gift_id: item.gift_id,

        type: item.type,
        second: item.second,
      };
    });
  }

  const remaining = localStorage.getItem("remainingTime");
  if (remaining) {
    remainingTime.value = Number(remaining);
  }
};

load();

setInterval(() => {
  localStorage.setItem("remainingTime", String(remainingTime.value));
}, 10000);

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
        if (gift.type === OperationEnum.clear) {
          remainingTime.value = 0;
        } else if (gift.type === OperationEnum.divide) {
          remainingTime.value /= item.info.num * gift.second;
        } else if (gift.type === OperationEnum.multiply) {
          remainingTime.value *= item.info.num * gift.second;
        } else if (gift.type === OperationEnum.minus) {
          remainingTime.value -= item.info.num * gift.second;
        } else if (gift.type === OperationEnum.plus) {
          remainingTime.value += item.info.num * gift.second;
        }
      }
    }
  });
};

const connect = () => {
  createLive();
};
const stop = () => {
  live.close();
};

onMounted(() => {
  if (route.query.roomId) {
    roomId.value = Number(route.query.roomId);
    connect();
  }
});
</script>

<style scoped></style>
