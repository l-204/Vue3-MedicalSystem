<template>
  <div>
    <el-button
      id="tableButton"
      icon="CirclePlus"
      @click="openAddDialog()"
      size="large"
      v-if="identity == '管理员'"
      :circle="isMobile ? true : false"
      >{{ isMobile ? "" : "添加" }}
    </el-button>

    <div style="float: right; margin-bottom: 15px">
      <el-input
        v-model="searchword"
        placeholder="请输入关键字查询"
        size="large"
        class="input-with-select"
      >
        <template #prepend>
          <el-select
            v-model="keywords"
            placeholder="请选择"
            size="large"
            style="width: 120px"
          >
            <el-option
              v-for="(item, index) in formList"
              :key="index"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </template>
        <template #append>
          <el-button icon="Search" size="large" @click="handleSearch()">
          </el-button>
        </template>
      </el-input>
    </div>

    <el-dialog
      :title="isAdd ? `添加${title}` : isEdit ? `编辑${title}` : ''"
      v-model="dialogFormVisible"
    >
      <el-form
        :model="form"
        :rules="ruleList"
        ref="formRef"
        label-width="120px"
        style="max-width: 600px; margin: auto"
      >
        <el-form-item
          v-for="item in formList"
          :prop="item.key"
          :label="item.label"
          :key="item.key"
        >
          <template v-if="item.type === 'input'">
            <el-input
              v-model="form[item.key]"
              :placeholder="'请输入' + item.label"
            ></el-input>
          </template>
          <template v-else-if="item.type === 'number'">
            <el-input
              v-model.number="form[item.key]"
              :placeholder="'请输入' + item.label"
            ></el-input>
          </template>
          <template v-else-if="item.type === 'radio'">
            <el-radio-group v-model="form[item.key]">
              <el-radio
                v-for="(option, index) in item.options"
                :key="index"
                :value="option"
                >{{ option }}</el-radio
              >
            </el-radio-group>
          </template>
          <template v-else-if="item.type === 'checkbox'">
            <el-checkbox-group v-model="form[item.key]">
              <el-checkbox
                v-for="(option, index) in item.options"
                :key="index"
                :label="option"
                >{{ option }}</el-checkbox
              >
            </el-checkbox-group>
          </template>
          <template v-else-if="item.type === 'select'">
            <el-select
              v-model="form[item.key]"
              :placeholder="'请选择' + item.label"
            >
              <el-option
                v-for="(option, index) in item.options"
                :key="index"
                :label="option"
                :value="option"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'date'">
            <el-date-picker
              v-model="form[item.key]"
              type="date"
              :placeholder="'请选择' + item.label"
            ></el-date-picker>
          </template>
          <template v-else-if="item.type === 'textarea'">
            <el-input
              autosize
              type="textarea"
              v-model="form[item.key]"
              :rows="4"
              :placeholder="'请输入' + item.label"
            ></el-input>
          </template>
          <template v-else-if="item.type === 'switch'">
            <el-switch v-model="form[item.key]"></el-switch>
          </template>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="handleReset(formRef)">重 置</el-button>
        <el-button type="primary" @click="handleSubmit(formRef)"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-table
      :data="displayedData"
      border
      style="margin-top: 20px; width: 100%"
      height="67vh"
    >
      <el-table-column type="index" label="" align="center"></el-table-column>

      <el-table-column
        v-for="(item, index) in formList"
        :key="index"
        :prop="item.key"
        align="center"
        :label="item.label"
      >
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="180px"
        align="center"
        v-if="identity == '管理员'"
      >
        <template v-slot="scope">
          &emsp;<el-button
            link
            type="primary"
            icon="Edit"
            @click="openEditDialog(scope.row)"
            >编辑</el-button
          >
          &emsp;<el-button
            link
            type="danger"
            icon="Delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin: 20px 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 40, 50, 100]"
      :page-size="pageSize"
      :layout="
        isMobile ? 'pager' : '->,total, sizes, prev, pager, next, jumper'
      "
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { useStore } from "../store/index";
import { ref, reactive, computed } from "vue";
import Writing from "../components/Writing.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getTableData, searchData, deleteData, submitData } from "../api/table";
export default {
  name: "TablePage",
  props: {
    tableName: { type: String, default: "" },
    title: { type: String, default: "" },
    formList: { type: Array, default: () => [] },
    ruleList: { type: Object, default: () => {} },
  },
  setup(props) {
    const store = useStore();
    const isMobile = computed(() => store.isMobile);

    // 获取本地存储的用户信息，并将其转为json格式
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const identity = ref(userInfo.identity);

    const keywords = ref("");
    const searchword = ref("");
    const tableList = ref([]);
    const value = ref("");
    const currentPage = ref(1); // 当前页数
    const pageSize = ref(10); // 每页显示条目数
    const total = ref(100); // 总条目数，需要从后端获取
    const isAdd = ref(false);
    const isEdit = ref(false);
    const dialogFormVisible = ref(false);
    const form = reactive({});
    const formRef = ref();

    const displayedData = computed(() => {
      // 根据currentPage和pageSize计算出当前页显示的数据
      const startIndex = (currentPage.value - 1) * pageSize.value;
      const endIndex = startIndex + pageSize.value;
      return tableList.value.slice(startIndex, endIndex);
    });

    getTableData(props.tableName).then((res) => {
      tableList.value = res;
      total.value = res.length;
    });

    const handleSizeChange = (val) => {
      pageSize.value = val;
      currentPage.value = 1; // 选择每页显示条目数后，重置当前页数为1
    };
    const handleCurrentChange = (val) => {
      currentPage.value = val;
    };
    const handleSearch = () => {
      if (!keywords.value) return ElMessage.error("请选择搜索关键词");

      const searchForm = [props.tableName, keywords.value, searchword.value];
      searchData(searchForm).then((res) => {
        tableList.value = res;
        total.value = res.length;
      });
    };

    const handleDelete = (row) => {
      ElMessageBox.confirm(`确定删除该${props.title}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteData(row.id, props.tableName).then((res) => {
            tableList.value = res;
            total.value = res.length;
            // 删除数据为当前页最后一条时，删除后将返回上一页
            total.value % pageSize.value == 0
              ? (currentPage.value -= 1)
              : currentPage.value;
            // 弹出信息
            ElMessage.success("删除成功");
          });
        })
        .catch(() => ElMessage.info("已取消删除"));
    };

    const openAddDialog = () => {
      // 使用forEach遍历formList数组，并将每个对象的key属性作为form对象的属性，并设置默认值为空字符串
      props.formList.forEach((item) => {
        form[item.key] = ""; // 假设默认值为空字符串
      });

      isAdd.value = true;
      isEdit.value = false;
      dialogFormVisible.value = true;
    };

    const openEditDialog = (row) => {
      /**
       * 使用深拷贝避免表单和表格数据引用同一内存地址
       * 否则会导致表单数据被修改时，表格数据也会被修改
       *  */
      Object.assign(form, row);
      isAdd.value = false;
      isEdit.value = true;
      dialogFormVisible.value = true;
    };

    const submitForm = () => {
      // 符合校验规则则关闭弹窗
      dialogFormVisible.value = false;
      // 保存修改信息并发送请求
      const url = isAdd.value
        ? "insert"
        : isEdit.value
        ? `update/${form.id}`
        : "";
      submitData(url, props.tableName, form).then((res) => {
        tableList.value = res;
        total.value = res.length;
        // 弹出信息
        ElMessage.success(isAdd.value ? "添加成功" : "修改成功");
      });
    };

    const handleReset = (formRef) => {
      if (!formRef) return;
      formRef.resetFields();
    };

    const handleSubmit = async () => {
      // 规则校验
      const results = await formRef.value.validate();
      if (results) {
        submitForm();
        ElMessage.success("提交成功");
      } else return ElMessage.error("提交失败");
    };

    return {
      isMobile,

      identity,

      keywords,
      searchword,

      tableList,

      value,
      currentPage,
      pageSize,
      total,

      isAdd,
      isEdit,
      dialogFormVisible,
      form,
      formRef,
      displayedData,
      handleSizeChange,
      handleCurrentChange,
      handleSearch,
      handleDelete,
      openAddDialog,
      openEditDialog,
      submitForm,
      handleReset,
      handleSubmit,
    };
  },
};
</script>

<style>
@media (max-width: 768px) {
  #tableButton {
    position: fixed;
    right: 5%;
    bottom: 2%;
    z-index: 101;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.7);
    padding: 30px;
    font-size: 40px;
    background-color: var(--el-button-bg-color);
    box-sizing: border-box;
  }
  #tableButton svg {
    color: #67c23a;
    padding-left: 10px;
  }
}
</style>
