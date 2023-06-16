<template>
  <div class="container">
    <div class="remaining-time">
      <div>剩余时间</div>
      <div>
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
              'gift-type-add': item.type === 1 || item.type === 3,
              'gift-type-sub':
                item.type === 2 || item.type === 4 || item.type === 5,
            }"
          >
            <span v-if="item.type === 1 || item.type === 2"
              >{{ (Number(item.num) / 60).toFixed(0) }}分钟</span
            ><span v-else-if="item.type == 3">X{{ item.num }}</span>
            <span v-else-if="item.type == 4">÷{{ item.num }}</span>
            <span v-else-if="item.type == 5">清空</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";

interface Props {
  gifts: any[];
  remainingTime: number;
}

const props = defineProps<Props>();
const emits = defineEmits(["update:remainingTime"]);

const remainingTime = useVModel(props, "remainingTime", emits);

setInterval(() => {
  if (remainingTime.value <= 0) return;
  remainingTime.value = remainingTime.value - 1;
}, 1000);

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
  .remaining-time {
    text-align: center;
    margin-bottom: 20px;
  }
  .gift-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .gift-item {
      display: flex;
      align-items: center;
      width: 50%;
      text-align: center;
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
