<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" size="default" @click="saveGift"
        >保存</el-button
      >
      <el-button type="primary" size="default" @click="preview">预览</el-button>
      <el-button type="primary" size="default" @click="copy"
        >复制OBS地址</el-button
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
        >
          <el-option
            v-for="item in giftData"
            :key="item.gift_id"
            :label="`${item.gift_name}（${item.price / 1000}元）`"
            :value="item.gift_id"
          >
          </el-option>
        </el-select>
        <el-select v-model="element.type" placeholder="操作" filterable>
          <el-option label="加" :value="OperationEnum.plus"> </el-option>
          <el-option label="减" :value="OperationEnum.minus"> </el-option>
          <el-option label="乘" :value="OperationEnum.multiply"> </el-option>
          <el-option label="除" :value="OperationEnum.divide"> </el-option>
          <el-option label="清空" :value="OperationEnum.clear"> </el-option>
        </el-select>
        <el-input
          v-if="element.type !== OperationEnum.clear"
          v-model.number="element.num"
          :placeholder="`${
            element.type === OperationEnum.plus ||
            element.type === OperationEnum.minus
              ? '时长（秒）'
              : '倍率'
          }`"
          style="width: 200px"
        ></el-input>
        <span
          v-if="
            element.type === OperationEnum.plus ||
            element.type === OperationEnum.minus
          "
        >
          约{{ (Number(element.num) / 60).toFixed(0) }}分钟</span
        >

        <el-button type="primary" size="default" @click="addItem(index)"
          >新增一项</el-button
        ><el-button type="danger" size="default" @click="removeItem(index)"
          >删除</el-button
        >
      </div>
    </div>

    <Card
      :gifts="previewData"
      v-model:remainingTime="remainingTime"
      v-if="previewData.length > 0"
    ></Card>
  </div>
</template>

<script setup lang="ts">
import giftData from "@/assets/data.json";
// @ts-ignore
import { ElMessage } from "element-plus";
import useClipboard from "vue-clipboard3";
import type { CustomData } from "@/types/index.d.ts";
import { OperationEnum } from "@/types/enum";
import { uuid } from "@/utils";

import Card from "@/components/ot/Card.vue";

const data = ref<CustomData[]>([]);
const addItem = (index: number | undefined) => {
  const defaultItem = {
    gift_id: undefined,
    type: OperationEnum.plus,
    num: undefined,
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
      ? item.gift_id && item.num
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
  ElMessage.success("保存成功");
};

const load = () => {
  const gift = localStorage.getItem("gift");
  if (gift) {
    data.value = JSON.parse(gift);
  } else {
    addItem(undefined);
  }
};

const { toClipboard } = useClipboard();
const copy = async () => {
  try {
    await toClipboard("ppp");
    ElMessage("复制成功，请在obs中贴入网站");
  } catch (e) {
    ElMessage("复制失败");
  }
};

const remainingTime = ref(3600);
const previewData = ref<any[]>([]);
const preview = () => {
  if (!valid()) {
    return;
  }

  remainingTime.value = 3600;

  previewData.value = data.value.map((item) => {
    const gift = giftData.find((gift) => gift.gift_id === item.gift_id);
    return {
      gift_name: gift?.gift_name,
      gift_img: gift?.img,

      type: item.type,
      num: item.num,
    };
  });
  return previewData;
};

load();
</script>

<style scoped></style>
