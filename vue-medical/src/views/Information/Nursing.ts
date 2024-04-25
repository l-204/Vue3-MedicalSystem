export const Nursing = {
  name: "护理管理",
  id: 7,
  icon: "Suitcase",
  currentComponent: "Nursing",
  tableName: "nursing",
  formTitle: "护士",

  // formData 的 key 必须与数据库字段保持一致
  formData: [
    { label: "工号", type: "input", key: "nurse_id", value: "" },
    { label: "姓名", type: "input", key: "nurse_name", value: "" },
    { label: "性别", type: "radio", key: "gender", options: ["男", "女"] },
    { label: "年龄", type: "number", key: "age", value: "" },
    { label: "联系方式", type: "input", key: "phone_number", value: "" },
    { label: "职称", type: "select", key: "title", options: [] },
    { label: "患者", type: "input", key: "patient_name", value: "" },
    { label: "护理内容", type: "textarea", key: "nursing_content", value: "" },
  ],
  // ruleData 的 prop 必须与 formData 的 key 一致
  ruleData: {
    nurse_id: [
      { required: true, message: "工号不能为空", trigger: "blur" },
      {
        pattern: /^202[12345]\d{4}$/,
        message: "工号格式：202+职称号+编号",
        trigger: "blur",
      },
    ],
    nurse_name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
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
    patient_name: [],
  },
};
