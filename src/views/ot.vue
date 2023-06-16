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

const route = useRoute();
const remainingTime = ref(0);
const data = ref<any[]>([]);
const load = () => {
  const gift = localStorage.getItem("gift");
  if (gift) {
    data.value = JSON.parse(gift);

    data.value = data.value.map((item) => {
      const gift = giftData.find((gift) => gift.gift_id === item.gift_id);
      return {
        gift_name: gift?.gift_name,
        gift_img: gift?.img,

        type: item.type,
        num: item.num,
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
}, 5000);

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
    // console.log(msg);
    const parsedItem = parse(msg);
    if (parsedItem.cmd === "SEND_GIFT") {
      console.log(parsedItem, "parsedItem");
      // console.log(msg);
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
