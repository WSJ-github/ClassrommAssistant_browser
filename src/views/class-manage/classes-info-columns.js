export default [
  {
    label:'班级名称',
    prop:'className',
    majorKey:true,
    width:250
  },
  {
    label:'年级',
    prop:'classGrade',
    width:100
  },
  {
    label:'辅导员',
    prop:'classInstructor',
    width:100
  },
  {
    label:'人数',
    prop:'classNum',
    width:100
  },
  {
    label:'学院名称',
    prop:'insName',
    width:200,
    select:true //有select说明是通过select选择器来选择的（用在注册班级时）
  },
  {
    label:'专业名称',
    prop:'majorName',
    width:180,
    select:true, //有select说明是通过select选择器来选择的（用在注册班级时）
  },
  {
    label:"操作",
    operate:true, //操作特有的属性
    width:200
  }
]