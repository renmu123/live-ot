<template>
  <div class="container">
    <div class="remaining-time-container">
      <div class="remaining-time-title">距离下班时间</div>
      <div class="remaining-time-value">
        {{ remainingText }}
      </div>

      <p class="duration" v-if="props?.config?.showDuration">
        已开播：{{ duration }}
      </p>
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
import { formatTime } from "@/utils/index.ts";

interface Props {
  gifts: {
    gift_img?: string;
    gift_name?: string;
    type: OperationType;
    param: number;
  }[];
  remainingTime: number;
  duration: number;
  config?: {
    showDuration?: boolean;
  };
}

const props = defineProps<Props>();
const emits = defineEmits(["update:remainingTime"]);

const remainingTime = useVModel(props, "remainingTime", emits);

const remainingText = computed(() => {
  return formatTime(remainingTime.value);
});

const duration = computed(() => {
  return formatTime(props.duration);
});
</script>

<style scoped lang="scss">
.container {
  width: 300px;
  .remaining-time-container {
    text-align: center;
    margin-bottom: 15px;

    .duration {
      margin: 0;
      margin-top: 5px;
    }
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
