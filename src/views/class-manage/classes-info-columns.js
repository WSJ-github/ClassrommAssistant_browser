export default [
  {
    label:'班级名称',
    prop:'className',
    majorKey:true,
    width:210
  },
  {
    label:'用户组ID', //百度AI用
    prop:'group_id',
    majorKey:true,
    width:80
  },
  {
    label:'年级',
    prop:'classGrade',
    width:80
  },
  {
    label:'辅导员',
    prop:'classInstructor',
    width:100
  },
  {
    label:'人数',
    prop:'classNum',
    width:50
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
    width:120,
    select:true, //有select说明是通过select选择器来选择的（用在注册班级时）
  },
  {
    label:"操作",
    operate:true, //操作特有的属性
    width:280
  }
]