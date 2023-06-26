<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LiveWS } from "bilibili-live-ws";
import { useRoute } from "vue-router";
// @ts-ignore
import { ElMessage } from "element-plus";
import { parse } from "@/utils/danmu";

const route = useRoute();

const roomId = ref();

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

let live: LiveWS;
const createLive = () => {
  live = new LiveWS(roomId.value);
  // @ts-ignore
  live.on("open", () => console.log("Connection is established"));
  // @ts-ignore
  live.on("live", () => {
    ElMessage.success("连接直播间成功");
  });

  live.on("msg", (msg: any) => {
    let data = parse(msg);
    if (data.cmd === "DANMU_MSG") {
      const item = {
        user: data.info.user,
        text: data.info.text,
      };
      dataPush(item);
    } else if (data.cmd === "SEND_GIFT") {
      if (data.info.coinType === "gold") {
        const item = {
          user: data.info.user,
          text: `${data.info.action} ${data.info.num}个 ${data.info.giftName}`,
        };
        console.log(data);

        dataPush(item);
      }
    } else if (data.cmd === "SUPER_CHAT_MESSAGE") {
      const item = {
        user: data.info.user,
        text: `${data.info.price}元SC 【${data.info.message}】`,
      };
      console.log(data);

      dataPush(item);
    } else if (data.cmd === "GUARD_BUY") {
      const guardMap = {
        1: "总督",
        2: "提督",
        3: "舰长",
      };
      const item = {
        user: data.info.username,
        text: `成为${guardMap[data.info.guard_level]}`,
      };
      console.log(data);

      dataPush(item);
    }
  });
};

const data = ref<{ user: string; text: string }[]>([]);

// 创建最大数量为大小为30的队列
const dataPush = (item: any) => {
  if (data.value.length >= 30) {
    data.value.shift();
  }
  data.value.push(item);
  // window.scrollTo(0, document.body.scrollHeight);
};

const connect = () => {
  data.value = [];
  createLive();
};
const stop = () => {
  live.close();
};
</script>

<template>
  <div>
    <div style="display: flex">
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

    <div class="damu-container">
      <p class="danmu" v-for="(item, index) in data" :key="index">
        <span>
          <span style="color: red">{{ item.user }}：</span>
          {{ item.text }}
        </span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.damu-container {
  width: 100%;
  overflow: auto;
  border: 1px solid hsl(0, 0%, 80%);
  margin-top: 20px;
  min-height: 40px;
  border-radius: 12px;
  padding-left: 20px;
}
</style>
