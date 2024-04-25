export const Surgery = {
  name: "手术管理",
  id: 6,
  icon: "Remove",
  currentComponent: "Surgery",
  tableName: "surgeries",
  formTitle: "手术",

  // formData 的 key 必须与数据库字段保持一致
  formData: [
    { label: "主治医生", type: "input", key: "doctor_name", value: "" },
    { label: "医生工号", type: "input", key: "doctor_id", value: "" },
    { label: "患者姓名", type: "input", key: "patient_name", value: "" },
    { label: "手术类型", type: "input", key: "surgery_name", value: "" },
  ],
  // ruleData 的 prop 必须与 formData 的 key 一致
  ruleData: {
    doctor_name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
    doctor_id: [
      { required: true, message: "工号不能为空", trigger: "blur" },
      {
        pattern: /^201[12345]\d{4}$/,
        message: "工号格式：201+职称号+编号",
        trigger: "blur",
      },
    ],
    patient_name: [
      { required: true, message: "姓名不能为空", trigger: "blur" },
    ],
    surgery_name: [],
  },
};
