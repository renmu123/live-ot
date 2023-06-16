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
          <el-option label="加" :value="1"> </el-option>
          <el-option label="减" :value="2"> </el-option>
          <el-option label="乘" :value="3"> </el-option>
          <el-option label="除" :value="4"> </el-option>
          <el-option label="清空" :value="5"> </el-option>
        </el-select>
        <el-input
          v-if="element.type !== 5"
          v-model.number="element.num"
          :placeholder="`${
            element.type === 1 || element.type === 2 ? '时长（秒）' : '倍率'
          }`"
          style="width: 200px"
        ></el-input>
        <span v-if="element.type === 1 || element.type === 2">
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

import Card from "@/components/ot/Card.vue";

console.log(giftData);
let globalId = ref(0);

const data = ref<
  {
    gift_id: number | undefined;
    type: 1 | 2 | 3 | 4 | 5;
    num: number | undefined;
    id: number;
  }[]
>([]);
const addItem = (index: number | undefined) => {
  console.log(index);

  if (index !== undefined) {
    data.value.splice(index + 1, 0, {
      gift_id: undefined,
      type: 1,
      num: undefined,
      id: globalId.value++,
    });
  } else {
    data.value.push({
      gift_id: undefined,
      type: 1,
      num: undefined,
      id: globalId.value++,
    });
  }
};
const removeItem = (index: number) => {
  data.value.splice(index, 1);
};

const valid = () => {
  const valid = data.value.every((item) => {
    return item.type !== 5 ? item.gift_id && item.num : item.gift_id;
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
