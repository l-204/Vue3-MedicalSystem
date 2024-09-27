<template>
  <Layout>
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
  </Layout>
</template>

<script setup>
import { shallowRef, ref } from "vue";
import Layout from "@/layout/index.vue";
import TablePage from "@/components/TablePage.vue";
// 信息管理
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";
import { Room } from "./Room";
import { CaseHistory } from "./CaseHistory";
import { Medicine } from "./Medicine";
import { Surgery } from "./Surgery";
import { Nursing } from "./Nursing";

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
