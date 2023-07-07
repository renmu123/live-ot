<template>
  <Ot ref="otRef" class="ot"></Ot>

  <div class="config-container">
    <div style="margin-bottom: 20px">
      房间号：
      <el-input
        v-model.number="roomId"
        placeholder="请输入房间号"
        clearable
        style="width: 200px"
      />
      <el-button type="primary" @click="connect" style="margin-left: 10px"
        >开始加班！</el-button
      >
      <el-button type="primary" @click="stop" style="margin-left: 10px"
        >暂停一下</el-button
      >
      <div style="display: inline-flex; align-items: center; margin-left: 10px">
        关于作 者<a
          href="https://space.bilibili.com/10995238"
          target="_blank"
          class="author"
        ></a>
      </div>
    </div>
    <div style="margin-bottom: 20px">
      初始时长：<el-input
        v-model.number="initTime.hour"
        placeholder="小时"
        clearable
        style="width: 100px"
      />
      <el-input
        v-model.number="initTime.minute"
        placeholder="分钟"
        clearable
        style="width: 100px; margin-left: 5px"
      />
      <el-input
        v-model.number="initTime.second"
        placeholder="秒"
        clearable
        style="width: 100px; margin-left: 5px"
      />
      <el-button type="warning" @click="resetTime" style="margin-left: 10px"
        >设置时长</el-button
      >
      <el-button type="primary" @click="showLiveTime"
        >切换开播时长显示</el-button
      >
    </div>
    <div v-for="(element, index) in data" :key="index">
      <div
        style="
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        "
      >
        <el-select
          v-model="element.gift_id"
          placeholder="请选择礼物"
          filterable
          class="width-medium"
        >
          <el-option
            v-for="item in giftData"
            :key="item.gift_id"
            :label="`${item.gift_name}（${item.price / 1000}元）`"
            :value="item.gift_id"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="element.type"
          placeholder="操作"
          filterable
          style="width: 80px"
        >
          <el-option label="加" :value="OperationEnum.plus"> </el-option>
          <el-option label="减" :value="OperationEnum.minus"> </el-option>
          <el-option label="乘" :value="OperationEnum.multiply"> </el-option>
          <el-option label="除" :value="OperationEnum.divide"> </el-option>
          <el-option label="清空" :value="OperationEnum.clear"> </el-option>
        </el-select>
        <template
          v-if="
            element.type === OperationEnum.plus ||
            element.type === OperationEnum.minus
          "
        >
          <el-input
            v-model.number="element.hour"
            placeholder="小时"
            style="width: 100px"
            title="小时"
          ></el-input>
          <el-input
            v-model.number="element.minute"
            placeholder="分钟"
            style="width: 100px"
            title="分钟"
          ></el-input>
          <el-input
            v-model.number="element.second"
            placeholder="秒"
            style="width: 100px"
            title="秒"
          ></el-input>
        </template>
        <template
          v-if="
            element.type === OperationEnum.multiply ||
            element.type === OperationEnum.divide
          "
        >
          <el-input
            v-model="element.param"
            placeholder="倍率"
            style="width: 100px"
          ></el-input>
        </template>

        <el-button type="primary" size="default" @click="addItem(index)"
          >新增一项</el-button
        ><el-button
          type="danger"
          size="default"
          @click="removeItem(index)"
          v-if="data.length !== 1"
          >删除</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import giftData from "@/assets/data.json";
// @ts-ignore
import { ElMessage } from "element-plus";
import type { CustomData } from "@/types/index.d.ts";
import { OperationEnum } from "@/types/enum";
import { uuid } from "@/utils";

import Ot from "@/components/ot.vue";

const data = ref<CustomData[]>([]);
const addItem = (index: number | undefined) => {
  const defaultItem = {
    gift_id: undefined,
    type: OperationEnum.plus,
    hour: undefined,
    minute: undefined,
    second: undefined,
    id: uuid(),
  };
  if (index !== undefined) {
    data.value.splice(index + 1, 0, defaultItem);
  } else {
    data.value.push(defaultItem);
  }
};
const removeItem = (index: number) => {
  data.value.splice(index, 1);
};

const valid = () => {
  let valid = true;
  data.value.forEach((item) => {
    if (item.type !== OperationEnum.clear) {
      if (
        item.type === OperationEnum.plus ||
        item.type === OperationEnum.minus
      ) {
        if (item.hour === undefined) {
          item.hour = 0;
        }
        if (item.minute === undefined) {
          item.minute = 0;
        }
        if (item.second === undefined) {
          item.second = 0;
        }
        if (
          isNaN(Number(item.hour)) ||
          isNaN(Number(item.minute)) ||
          isNaN(Number(item.second))
        ) {
          valid = false;
        }
      } else if (
        item.type === OperationEnum.multiply ||
        item.type === OperationEnum.divide
      ) {
        if (item.param === undefined) {
          item.param = 1;
        }
        if (isNaN(Number(item.param))) {
          valid = false;
        }
      }
    }
  });

  if (!valid) {
    const msg = "数据不完整或格式有误";
    ElMessage.error(msg);
    throw new Error(msg);
  }
  return valid;
};

const saveGift = () => {
  valid();

  localStorage.setItem("gift", JSON.stringify(data.value));
  ElMessage.success("保存配置成功");
};

const load = () => {
  const gift = localStorage.getItem("gift");
  if (gift) {
    data.value = JSON.parse(gift);
  } else {
    addItem(undefined);
  }
};

load();

const route = useRoute();
const router = useRouter();
const roomId = ref();

onMounted(() => {
  if (route.query.id) {
    roomId.value = Number(route.query.id);
  }
});

const otRef = ref();
const connect = async () => {
  if (!roomId.value) {
    ElMessage.error("请先输入房间号");
    return;
  }
  router.push({
    query: {
      id: roomId.value,
    },
  });
  await nextTick();
  saveGift();
  otRef.value.start(roomId.value);
};
const stop = () => {
  otRef.value.stop();
};

const initTime = ref<{
  hour?: number;
  minute?: number;
  second?: number;
}>({
  hour: undefined,
  minute: undefined,
  second: undefined,
});

const resetTime = () => {
  if (initTime.value.hour === undefined) {
    initTime.value.hour = 0;
  }
  if (initTime.value.minute === undefined) {
    initTime.value.minute = 0;
  }
  if (initTime.value.second === undefined) {
    initTime.value.second = 0;
  }

  if (
    isNaN(Number(initTime.value.hour)) ||
    isNaN(Number(initTime.value.minute)) ||
    isNaN(Number(initTime.value.second))
  ) {
    ElMessage.error("时间必须为数字");
    return;
  }
  // const status = window.confirm("确定要重置时间吗？重置后无法恢复");
  // if (!status) return;
  const seconds =
    (initTime.value.hour ?? 0) * 3600 +
    (initTime.value.minute ?? 0) * 60 +
    (initTime.value.second ?? 0);
  otRef.value.setTime(seconds);
};

const showLiveTime = () => {
  otRef.value.setConfig("showDuration", !otRef.value.config.showDuration);
};
</script>

<style scoped lang="scss">
.config-container {
  margin-top: 50px;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  .author {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: url("../assets/author.jpg") no-repeat;
    display: inline-block;
    background-size: cover;
    margin-left: 5px;
  }
  .width-medium {
    width: 160px;
  }
}

.ot {
  margin: 20px;
}
</style>
