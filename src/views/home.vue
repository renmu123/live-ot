<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" size="default" @click="saveGift"
        >保存</el-button
      >
      <el-button type="primary" size="default" @click="copy"
        >复制OBS地址</el-button
      >
    </div>
    <div
      v-for="(item, index) in data"
      :key="index"
      style="display: flex; gap: 10px; margin-bottom: 10px"
    >
      <el-select v-model="item.gift_id" placeholder="请选择礼物" filterable>
        <el-option
          v-for="item in giftData"
          :key="item.gift_id"
          :label="`${item.gift_name}（${item.price / 1000}元）`"
          :value="item.gift_id"
        >
        </el-option>
      </el-select>
      <el-select v-model="item.type" placeholder="加减时长" filterable>
        <el-option label="加时长" :value="1"> </el-option>
        <el-option label="减时长" :value="2"> </el-option>
      </el-select>
      <el-input
        v-model.number="item.minute"
        placeholder="时长（分钟）"
        style="width: 200px"
      ></el-input>

      <el-button type="primary" size="default" @click="addItem"
        >新增一项</el-button
      ><el-button type="danger" size="default" @click="removeItem(index)"
        >删除</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import giftData from "@/assets/data.json";
// @ts-ignore
import { ElMessage } from "element-plus";
import useClipboard from "vue-clipboard3";
import draggable from "@/vuedraggable";

console.log(giftData);

const data = ref<
  {
    gift_id: number | undefined;
    type: 1 | 2;
    minute: number | undefined;
  }[]
>([]);
const addItem = () => {
  data.value.push({
    gift_id: undefined,
    type: 1,
    minute: undefined,
  });
};
const removeItem = (index: number) => {
  data.value.splice(index, 1);
};

const valid = () => {
  const valid = data.value.every((item) => {
    return item.gift_id && item.minute;
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
    addItem();
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

load();
</script>

<style scoped></style>
