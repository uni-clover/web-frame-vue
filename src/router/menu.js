export default [
  {
    path: "/home",
    meta: { title: "首页", icon: "home", noClose: true }
  },
  {
    path: "/user",
    meta: {
      title: "用户管理",
      icon: "user"
    },
    children: [
      {
        path: "staff",
        meta: {
          title: "员工管理",
          icon: "user-staff"
        }
      }
    ]
  }
];
