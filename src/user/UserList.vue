<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="getUsers.query"
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表显示区 -->
      <el-table :data="usersList" stripe border>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="170px">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getUsername(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-star-off"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getUsers.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="getUsers.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.num"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @closed="addDialogClosed"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户数据 -->

    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogVisible1"
      width="30%"
       @closed="addDialogClosed1"
    >
      <el-form
        :model="UserList"
        :rules="UserListRules"
        ref="UserListRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="UserList.username" disabled></el-input>
        </el-form-item>
           <el-form-item label="邮箱" prop="email">
          <el-input v-model="UserList.email"></el-input>
        </el-form-item>
           <el-form-item label="手机号" prop="mobile">
          <el-input v-model="UserList.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="putUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import LoginVue from "../components/Login.vue";
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (regEmail.test(value)) {
        //判断邮箱是否符合正则表达
        return cb();
      }
      cb(new Error("请输入正确的邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regMobile.test(value)) {
        //判断邮箱是否符合正则表达
        return cb();
      }
      cb(new Error("请输入正确的手机号"));
    };
    return {
      getUsers: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      usersList: [],
      num: 0,
      dialogVisible: false,
      dialogVisible1: false,
      //添加用户数据项
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加用户表单验证规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //修改用户验证规则
      UserListRules: {
          email: [
            {
              required: true,
              message: "请输入邮箱",
              trigger: "blur",
            },
            { validator: checkEmail, trigger: "blur" },
          ],
          mobile: [
            {
              required: true,
              message: "请输入手机号码",
              trigger: "blur",
            },
            { validator: checkMobile, trigger: "blur" },
          ],
        },
      UserList: {},
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户数据
    getUserList() {
      this.$http
        .get("users", { params: this.getUsers })
        .then((res) => {
          console.log(res);
          this.usersList = res.data.data.users;
          this.num = res.data.data.total;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //选择下拉框数据的方法
    handleSizeChange(newChange) {
      console.log();
      this.getUsers.pagesize = newChange;
      this.getUserList();
    },
    //选择分页数据的方法
    handleCurrentChange(newCurrentChange) {
      this.getUsers.pagenum = newCurrentChange;
      this.getUserList();
    },
    //获取用户名数据
    userChange(change) {
      this.$http
        .put("users/" + change.id + "/state/" + change.mg_state)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //添加用户 界面关闭重置表单
    addDialogClosed() {
      this.$refs.addUserRef.resetFields();
    },
    //修改用户界面关闭重置表单
    addDialogClosed1() {
      this.$refs.UserListRef.resetFields();
    },
    //添加新用户
    addUser() {
      //提交前预验证
      this.$refs.addUserRef.validate((v) => {
        if (!v) return;
        this.$http
          .post("users", this.addUserForm)
          .then((res) => {
            this.$message.success(" 添加成功");
            this.dialogVisible = false;
            this.getUserList();
          })
          .catch((err) => {
            console.error(err);
          });
      });
    },
    //id获取用户信息
    getUsername(id) {
      this.$http
        .get("users/" + id)
        .then((res) => {
          console.log(res);
          this.UserList = res.data.data;
           this.dialogVisible1 = true;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    putUser(){
        this.$refs.UserListRef.validate((v)=>{
            if(!v) return 
            this.$http.put("users/"+this.UserList.id,{email:this.UserList.email,mobile:this.UserList.mobile}).then((res=>{
            this.dialogVisible1 = false
            this.getUserList()
            }))
        })
    },
     deleteUser(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$http.delete("users/"+id)
            .then(res => {
                console.log(res)
                 this.getUserList()
                 this.$message({
            type: 'success',
            message: '删除成功!'
          });
            }
            )
            .catch(err => {
                console.error(err); 
            })
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>
