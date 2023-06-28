<template>
  <div>
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
    </div>
    <div style="margin-bottom: 20px">
      初始时间（秒）：<el-input
        v-model.number="initTime.hour"
        placeholder="时间（小时）"
        clearable
        style="width: 100px"
      />
      <el-input
        v-model.number="initTime.minute"
        placeholder="时间（分钟）"
        clearable
        style="width: 100px; margin-left: 5px"
      />
      <el-input
        v-model.number="initTime.second"
        placeholder="时间（秒）"
        clearable
        style="width: 100px; margin-left: 5px"
      />
      <el-button type="warning" @click="resetTime" style="margin-left: 10px"
        >重置时间</el-button
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
        <el-input
          v-if="element.type !== OperationEnum.clear"
          v-model.number="element.second"
          :placeholder="`${
            element.type === OperationEnum.plus ||
            element.type === OperationEnum.minus
              ? '时长（秒）'
              : '倍率'
          }`"
          style="width: 100px"
        ></el-input>
        <span
          v-if="
            element.type === OperationEnum.plus ||
            element.type === OperationEnum.minus
          "
        >
          约{{ (Number(element.second) / 60).toFixed(0) }}分钟</span
        >

        <el-button type="primary" size="default" @click="addItem(index)"
          >新增一项</el-button
        ><el-button type="danger" size="default" @click="removeItem(index)"
          >删除</el-button
        >
      </div>
    </div>

    <Ot ref="otRef" class="ot"></Ot>
  </div>
</template>

<script setup lang="ts">
import giftData from "@/assets/data.json";
// @ts-ignore
import { ElMessage } from "element-plus";
// import useClipboard from "vue-clipboard3";
import type { CustomData } from "@/types/index.d.ts";
import { OperationEnum } from "@/types/enum";
import { uuid } from "@/utils";

// import Card from "@/components/Card.vue";
import Ot from "@/components/ot.vue";

const data = ref<CustomData[]>([]);
const addItem = (index: number | undefined) => {
  const defaultItem = {
    gift_id: undefined,
    type: OperationEnum.plus,
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
  const valid = data.value.every((item) => {
    return item.type !== OperationEnum.clear
      ? item.gift_id && item.second
      : item.gift_id;
  });
  if (!valid) {
    ElMessage.error("请将数据填写完整");
  }
  return valid;
};

const saveGift = () => {
  if (!valid()) {
    return;
  }
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
  saveGift();
  await nextTick();
  otRef.value.start();
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
  if (
    isNaN(Number(initTime.value.hour)) ||
    isNaN(Number(initTime.value.minute)) ||
    isNaN(Number(initTime.value.second))
  ) {
    ElMessage.error("时间必须为数字");
    return;
  }
  const status = window.confirm("确定要重置时间吗？重置后无法恢复");
  if (!status) return;
  const seconds =
    (initTime.value.hour ?? 0) * 3600 +
    (initTime.value.minute ?? 0) * 60 +
    (initTime.value.second ?? 0);
  otRef.value.setTime(seconds);
};
</script>

<style scoped lang="scss">
.width-medium {
  width: 160px;
}

.ot {
  position: absolute;
  right: 0;
  top: 20px;
}
</style>
