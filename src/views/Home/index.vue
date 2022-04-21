<template>
<el-container class="home-container">
        <!-- 头部区域 -->
    <el-header>
        <div>
            <img src="../../assets/logo.png" alt="">
            <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
        <!-- 页面主体区 -->
    <el-container>
                <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' :'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath">
             <!-- 一级菜单 -->
             <!-- index仅接受字符串不接受数字后面拼接空的字符串，字符串+数字=字符串 -->
        <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id"> 
             <!-- 一级菜单模板区  -->
            <template slot="title">
                <!-- 图标 -->
            <i class="el-icon-location"></i>
            <!-- 文本 -->
            <span>{{ item.authName}}</span>
            </template>
        <!-- el-menu-item二级菜单区 -->
        <el-menu-item :index="'/' +subItem.path + ''" v-for="subItem in item.children" :key="subItem.id"
         @click="saveNavState('/' +subItem.path)">
                <!-- 二级菜单模板区  -->
            <template slot="title">
                <!-- 二级菜单图标 -->
            <i class="el-icon-menu"></i>
            <!-- 二级菜单文本 -->
            <span>{{subItem.authName}}</span>
            </template>
        </el-menu-item>
        
      </el-submenu>
    </el-menu>
    </el-aside>
                <!-- 右侧内容主体 -->
    <el-main>
        <!-- 路由占位符显示home子组件welcome -->
        <router-view></router-view>
    </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            //左侧菜单数据
            menulist:[],
            isCollapse: false,
            //被激活的链接地址
            activePath :''
        }
    },
    //生命周期钩子初始开始调用获取所有菜单函数
    created() {
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
        logout(){
            // 调用window上的一个api清空token
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        //获取所有的菜单
        async getMenuList() {
           const {data : res} = await this.$http.get('menus')
           if(res.meta.status !== 200) return this.$message.error('res.meta.msg')
           this.menulist = res.data
           console.log(res);
        },
        //点击按钮切换菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse= !this.isCollapse;
        },
        //保存链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath = activePath

        }

        
    }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%
}
.el-header {
    display: flex;
    justify-content: space-between;
    background-color: #363d40;
    padding: 5px;
    align-content: center;
    >div {
        display: flex;
        align-items: center ;
    }

    img {
        height: 100%;
       
    }
    span {
        margin-left: 15px;
        color: #fff;
        font-size: 20px;
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
   
}
.el-main {
    background-color: #e9edf1
}

.toggle-button {
    background-color: #4A5064;
    text-align: center;
    color: #fff;
    line-height: 24px;
    font-size: 10px;
    cursor: pointer;
}
</style>