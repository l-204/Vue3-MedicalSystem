<template>
  <div class="img-verify" style="width: 120px; height: 40px">
    <canvas
      ref="verify"
      :width="width"
      :height="height"
      @click="handleDraw()"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const verify = ref();
const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const width = ref(120);
const height = ref(40);
const imgCode = ref("");

// 初始化验证码
onMounted(() => {
  handleDraw()
})
// 在父组件设置@verify将imgCode传递过去
const emit = defineEmits(['verify'])
const childToParent = () => {
    emit('verify',imgCode.value)
}
// 点击图片重新绘制
const handleDraw = () => {
  imgCode.value = draw();
  // 点击时传递imgCode
  childToParent()
};
// 随机数
const randomNum = (min, max) => {
  return parseInt(Math.random() * (max - min) + min);
};
// 随机颜色
const randomColor = (min, max) => {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
};
// 绘制图片
const draw = () => {
  const ctx = verify.value.getContext("2d");
  ctx.fillStyle = randomColor(180, 230);
  ctx.fillRect(0, 0, width.value, height.value);
  let imgCode = "";
  for (let i = 0; i < 4; i++) {
    const text = pool[randomNum(0, pool.length)];
    imgCode += text;
    const fontSize = randomNum(18, 40);
    const deg = randomNum(-30, 30);
    ctx.font = fontSize + "px Simhei";
    ctx.textBaseline = "top";
    ctx.fillStyle = randomColor(80, 150);
    ctx.save();
    ctx.translate(30 * i + 15, 15);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(text, -15 + 5, -15);
    ctx.restore();
  }
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(randomNum(0, width.value), randomNum(0, height.value));
    ctx.lineTo(randomNum(0, width.value), randomNum(0, height.value));
    ctx.strokeStyle = randomColor(180, 230);
    ctx.closePath();
    ctx.stroke();
  }
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.arc(randomNum(0, width.value), randomNum(0, height.value), 1, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = randomColor(150, 200);
    ctx.fill();
  }
  return imgCode;
};

</script>

<style type="text/css">
.img-verify canvas {
  cursor: pointer;
}
</style>
