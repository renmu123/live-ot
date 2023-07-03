<template>
  <div class="container">
    <div class="remaining-time-container">
      <div class="remaining-time-title">距离下班时间</div>
      <div class="remaining-time-value">
        {{ remainingText }}
      </div>
    </div>
    <div class="gift-container">
      <div class="gift-item" v-for="(item, index) in gifts" :key="index">
        <div class="gift-img-container">
          <img :src="item.gift_img" alt="" class="gift-img" />
        </div>
        <div>
          <div class="gift-name">
            {{ item.gift_name }}
          </div>
          <div
            class="gift-type"
            :class="{
              'gift-type-add':
                item.type === OperationEnum.plus ||
                item.type === OperationEnum.multiply,
              'gift-type-sub':
                item.type === OperationEnum.minus ||
                item.type === OperationEnum.divide ||
                item.type === OperationEnum.clear,
            }"
          >
            <span v-if="item.type === OperationEnum.plus"
              >+{{ (Number(item.param) / 60).toFixed(0) }}分钟</span
            ><span v-else-if="item.type === OperationEnum.minus"
              >-{{ (Number(item.param) / 60).toFixed(0) }}分钟</span
            ><span v-else-if="item.type == OperationEnum.multiply"
              >X{{ item.param }}</span
            >
            <span v-else-if="item.type == OperationEnum.divide"
              >÷{{ item.param }}</span
            >
            <span v-else-if="item.type == OperationEnum.clear">清空</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import type { OperationType } from "@/types/index.d.ts";
import { OperationEnum } from "@/types/enum";

interface Props {
  gifts: {
    gift_img?: string;
    gift_name?: string;
    type: OperationType;
    param: number;
  }[];
  remainingTime: number;
}

const props = defineProps<Props>();
const emits = defineEmits(["update:remainingTime"]);

const remainingTime = useVModel(props, "remainingTime", emits);

const remainingText = computed(() => {
  const hour = Math.floor(remainingTime.value / 3600);
  const minute = Math.floor((remainingTime.value % 3600) / 60);
  const second = remainingTime.value % 60;
  return `${hour}小时${minute}分${second}秒`;
});
</script>

<style scoped lang="scss">
.container {
  width: 300px;
  .remaining-time-container {
    text-align: center;
    margin-bottom: 15px;
  }
  .gift-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .gift-item {
      display: flex;
      align-items: center;
      width: 48%;
      text-align: center;
      margin-top: 5px;
      .gift-img-container {
        margin-right: 10px;
        .gift-img {
          width: 20px;
          height: 20px;
        }
      }

      .gift-name {
      }
      .gift-type {
      }
      .gift-type-add {
        color: red;
      }
      .gift-type-sub {
        color: skyblue;
      }
    }
  }
}
</style>
