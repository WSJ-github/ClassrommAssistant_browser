export default [
  {
    label:'课程号',
    prop:'couID',
    majorKey:true,
    width:120
  },
  {
    label:'课程名称',
    prop:'couName',
    width:100
  },
  {
    label:'任课老师', //任课老师应该有一个教师表来存储所有教师的信息，以后可以完善
    prop:'couTeacher',
    width:100
  },
  {
    label:'课时',
    prop:'couHour',
    select:true, //课时使用选择框来选择
    width:100,
  },
  {
    label:'学分',
    prop:'couCredit',
    width:100,
  },
  {
    label:'人数',
    prop:'couNum',
    width:100,
  },
  {
    label:'任课教室',
    prop:'couClassroom',
    width:100,
    hidden:true, //说明在列表中不直接显示（下面带hidden属性的都是列表详情项）
    extra:true, //说明这是额外对象(在注册组件中用得到)
    majorKey:true,
  },
  {
    label:'任课星期',
    prop:'couWeek',
    width:100,
    select:true,
    hidden:true,
    extra:true, //说明这是额外对象(在注册组件中用得到)
    majorKey:true,
  },
  {
    label:'开始时间',
    prop:'couTimeBegin',
    select:true,
    width:100,
    hidden:true,
    extra:true, //说明这是额外对象
    majorKey:true,
  },
  {
    label:'结束时间',
    prop:'couTimeEnd',
    select:true, //select设置为true是给自己看的，程序里没什么用
    width:100, //static设置也没什么用，主要是看传给Register-Dialog组件staticList或者optionList中的内容
    hidden:true,
    extra:true, //说明这是额外对象
    majorKey:true,
  },
  {
    label:'学院名称',
    prop:'insName',
    select:true,
    // static:true, 对普通教秘是静态数据(因为教秘只会属于某个学院)，但是对于超级管理员来说就是可选的select数据
    width:100,
    hidden:true, //虽然这个不是列表详情项中的，但是也说明先不显示在展示列表中先
    majorKey:true,
  },
  {
    label:"操作",
    operate:true, //操作特有的属性
    width:300
  }
]