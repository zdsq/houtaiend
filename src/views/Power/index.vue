<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- table数据源:data -->
      <el-table :data="rightsList" style="width: 100%" border stripe> 
        <el-table-column type="index" prop="prop" label="#" width="width"></el-table-column>
        <el-table-column  prop="authName" label="权限名称" width="width"></el-table-column>
        <el-table-column  prop="path" label="路径" width="width"></el-table-column>
        <el-table-column  prop="level" label="权限等级" width="width">
          <!-- 自定义插槽来展示我们想展示的数据绑定scope属性 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '2'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
      return {
        //权限列表
        rightsList:[]
      }
    },
    created(){
      //获取所有权限
      this.getRighstList()
    },
    methods:{
      //获取权限列表 
      async getRighstList() {
        const {data:res} = await this.$http.get('rights/list')
        console.log(res)
        if(res.meta.status !== 200) {
          return this.$message.error('获取权限列表失败')
        }
        this.rightsList = res.data
      }
    }
}
</script>

<style lang="less" scoped>

</style>