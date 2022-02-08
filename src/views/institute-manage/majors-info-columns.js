export default [
  {
    label:'专业名称',
    prop:'majorName',
    majorKey:true, //指定为主键
    width:200
  },
  {
    label:'所属学院',
    prop:'insName',
    static:true, //设为静态说明这个值是不可写的，刚开始就确定的（用来在注册专业的时候固定学院）
    width:200
  },
  {
    label:'操作',
    operate:true,
    width:200
  }
]