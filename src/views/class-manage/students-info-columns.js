export default [
  {
    label:'学号',
    prop:'stuID',
    majorKey:true,
    width:120
  },
  {
    label:'姓名',
    prop:'stuName',
    width:100
  },
  {
    label:'班级名称',
    prop:'className',
    static:true, //静态数据，即在注册学生时该学生肯定是隶属于某个班级的
    width:250
  },
  {
    label:'学院名称',
    prop:'insName',
    width:180,
    static:true //静态
  },
  {
    label:'照片',
    prop:'stuPhoto',
    picture:'base64',
    width:200,
  },
  {
    label:"操作",
    operate:true, //操作特有的属性
    width:100
  }
]