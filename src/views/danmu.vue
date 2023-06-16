<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LiveWS } from "bilibili-live-ws";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
// 27952647

const roomId = ref();

onMounted(() => {
  console.log(route.params.roomId);

  // @ts-ignore
  if (route.params.roomId) {
    // @ts-ignore
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
    // @ts-ignore
    live.on("heartbeat", console.log);
    ElMessage.success("连接直播间成功");
  });

  // @ts-ignore
  live.on("msg", (msg: any) => {
    // console.log(msg);
    if (msg.cmd === "DANMU_MSG") {
      msg.user = msg.info[2][1];
      msg.text = msg.info[1];
      dataPush(msg);
    } else if (msg.cmd === "SEND_GIFT") {
      console.log(msg);
    }
  });
};

const data = ref<any[]>([]);

// 创建最大数量为大小为30的队列
const dataPush = (item: any) => {
  if (data.value.length >= 30) {
    data.value.shift();
  }
  data.value.push(item);
  window.scrollTo(0, document.body.scrollHeight);
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
        placeholder="请输入room_id"
        clearable
        style="width: 200px"
      />
      <el-button type="primary" @click="connect" style="margin-left: 10px"
        >连接</el-button
      >
      <el-button type="danger" @click="stop">断开连接</el-button>
    </div>

    <div class="damu-container">
      <p class="danmu" v-for="item in data" :key="item.info[0]">
        <span v-if="item.cmd === 'DANMU_MSG'">
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
}
</style>
