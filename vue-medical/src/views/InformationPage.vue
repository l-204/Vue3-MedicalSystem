<template>
  <div>
    <!-- 调用菜单组件 -->
    <MenuPage>
      <template v-slot:default>
        <!-- 这里是需要显示在 el-main 中的内容 -->
        <el-tabs type="border-card" style="height: 100%; border: none">
          <el-tab-pane v-for="item in menuList" :key="item.id">
            <template #label>
              <span @click="currentComponent = item.currentComponent">
                <el-icon>
                  <component :is="item.icon"></component>
                </el-icon>
                {{ item.name }}
              </span>
            </template>
            <component :is="TablePage" :table-name="item.tableName" :title="item.formTitle" :form-list="item.formData"
              :rule-list="item.ruleData"></component>
          </el-tab-pane>
        </el-tabs>
      </template>
    </MenuPage>
  </div>
</template>

<script setup>
import { shallowRef, ref } from "vue";
import MenuPage from "../components/MenuPage.vue";
import TablePage from "../components/TablePage.vue";
// 信息管理
import { Patient } from "./Information/Patient";
import { Doctor } from "./Information/Doctor";
import { Room } from "./Information/Room";
import { CaseHistory } from "./Information/CaseHistory";
import { Medicine } from "./Information/Medicine";
import { Surgery } from "./Information/Surgery";
import { Nursing } from "./Information/Nursing";

const menuList = ref([
  { ...Patient },
  { ...Doctor },
  { ...Room },
  { ...CaseHistory },
  { ...Medicine },
  { ...Surgery },
  { ...Nursing },
]);
</script>

<style></style>
