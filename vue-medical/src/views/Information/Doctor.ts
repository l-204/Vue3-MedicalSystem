const DoctorData = {
  name: "医生管理",
  id: 2,
  icon: "CirclePlus",
  currentComponent: "Doctor",
  tableName: "doctors",
  formTitle: "医生",

  // formData 的 key 必须与数据库字段保持一致
  formData: [
    { label: "工号", type: "input", key: "doctor_id", value: "" },
    { label: "姓名", type: "input", key: "doctor_name", value: "" },
    { label: "性别", type: "radio", key: "gender", options: ["男", "女"] },
    { label: "年龄", type: "number", key: "age", value: "" },
    { label: "联系方式", type: "input", key: "phone_number", value: "" },
    { label: "职称", type: "select", key: "title", options: [] },
    { label: "专长", type: "select", key: "specialty", options: [] },
    {
      label: "出诊日期",
      type: "select",
      key: "schedule_info",
      options: ["周一", "周二", "周三", "周四", "周五"],
    },
  ],
  // ruleData 的 prop 必须与 formData 的 key 一致
  ruleData: {
    doctor_id: [
      { required: true, message: "工号不能为空", trigger: "blur" },
      {
        pattern: /^201[12345]\d{4}$/,
        message: "工号格式：201+职称号+编号",
        trigger: "blur",
      },
    ],
    doctor_name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
    gender: [{ required: true, message: "性别不能为空", trigger: "blur" }],
    age: [
      { required: true, message: "年龄不能为空", trigger: "blur" },
      { type: "number", message: "年龄必须为数字值", trigger: "blur" },
      {
        pattern: /^[2-5]\d$/,
        message: "年龄必须为20-59岁",
        trigger: "blur",
      },
    ],
    phone_number: [
      { required: true, message: "请输入手机号", trigger: "blur" },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: "手机号格式不正确",
        trigger: "blur",
      },
    ],
  },
};

import { getTablesData } from "../../api/table";
function handleData() {
  const tableNames = ["rooms", "positions"];
  getTablesData(tableNames).then((res: any) => {
    // 将科室表每条记录的科室名提取到 specialtyList 里作为专长选项
    const specialtyList = res[0].map((obj: any) => obj.room_name);
    // 使用 filter() 方法筛选满足条件的对象,医生的 position_id 在2011-2019
    const filteredData = res[1].filter(
      (item: any) => item.position_id > 2010 && item.position_id < 2020
    );
    // 将职位表每条记录的职位名提取到 titleList 里作为职称选项
    const titleList = filteredData.map((item: any) => item.position_name);

    // 将 titleList 赋值给职称选项
    DoctorData.formData[5].options = titleList;
    // 将 specialtyList 赋值给专长选项
    DoctorData.formData[6].options = specialtyList;
  });
}

// 处理数据
handleData();

export const Doctor = DoctorData;
