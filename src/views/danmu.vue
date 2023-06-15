<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LiveWS } from "bilibili-live-ws";
import { useRoute } from "vue-router";

const route = useRoute();
console.log(route);

const roomId = ref(23555200);

onMounted(() => {
  // const id = Number(route.params.value.roomId);
  // if (id) {
  //   roomId.value = id;
  //   connect();
  // }
  connect();
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
    // 74185
  });

  // @ts-ignore
  live.on("msg", (msg: any) => {
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

const showConnect = ref(false);
const connect = () => {
  data.value = [];
  createLive();
  showConnect.value = true;
  setTimeout(() => {
    showConnect.value = false;
  }, 4000);
};

const stop = () => {
  live.close();
};
</script>

<template>
  <div>
    <p v-if="showConnect">尝试建立连接</p>
    <input v-model="roomId" placeholder="请输入room_id" />
    <button @click="connect">连接</button>
    <button @click="stop">断开连接</button>

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
  border: 1px solid #ccc;
  margin-top: 20px;
}
</style>
