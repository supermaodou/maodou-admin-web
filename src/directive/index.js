import hasRole from './permission/hasRole'; // 引入角色指令
import hasPermi from './permission/hasPermi'; // 引入权限指令

const install = (app) => {
  // 注册全局指令
  app.directive('hasRole', hasRole);
  app.directive('hasPermi', hasPermi);
};

export default install;