<template>
  <el-container class="top">
    <el-header>
      <div>
        <img src="../assets/img/1624780020073.gif" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'" >
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
           :collapse='this.isCollapse'
           :collapse-transition='false'
           router
           :default-active="activePuth"
        >
        <div class="button" @click="logg">
          | | |
        </div>
          <el-submenu :index="i.id+''" v-for="i in lists" :key="i.id">
            <template slot="title">
              <i :class="iconObj[i.id]"></i>
              <span>{{i.authName}}</span>
            </template>
            <el-menu-item :index="'/'+index.path" v-for="index in i.children" :key="index.id" @click="activePuths('/'+index.path)">
                <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{index.authName}}</span>
              </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      lists:[],
      iconObj:{
        "125":"el-icon-user-solid",
        "103":"el-icon-coin",
        "101":"el-icon-s-cooperation",
        "102":"el-icon-s-order",
        "145":"el-icon-s-marketing"
      },
      isCollapse:false,
      activePuth:""
    };
  },
  created(){
    this.getNavLists()
    this.activePuth=window.sessionStorage.getItem('activePuth')
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    getNavLists(){
    this.$http.get("menus")
    .then(res => {
      this.lists=res.data.data
      console.log(this.lists);
    })
    .catch(err => {
      console.error(err); 
    })
    },
    logg(){
      this.isCollapse=!this.isCollapse
    },
    activePuths(activePuth){
      window.sessionStorage.setItem("activePuth", activePuth);
      this.activePuth=activePuth
    }
  },
};
</script>
<style lang="less" scoped>
.top {
  height: 100%;
}
.el-header {
  background-color: rgb(66, 66, 66);
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    align-items: center;

    img {
      width: 40px;
    }
  }
  span {
    color: #fff;
    margin-left: 10px;
    font-size: 18px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
      border-right: none;
      .button{
        background-color: #4a5064;
        color: #fff;
        line-height: 24px;
        cursor: pointer;
        text-align: center;
      }
  }
}
.el-main {
  background-color: rgb(233, 237, 240);
}
</style>
