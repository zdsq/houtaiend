<template>
  <div>
      <!-- 头部面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <el-row>
            <el-col >
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
            <zk-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border>
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag type="primary" v-if="scope.row.cat_level === 0 " size="mini">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
                    <el-tag type="warning" v-else size="mini">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </zk-table>
        <!-- 分页区域 -->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed">
        <!-- 添加分类的表单 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>

            <el-form-item label="父级分类:" >
                <!-- options用来指定数据源 -->
                <!-- props用来指定配置对象 -->
                <el-cascader
                   
                    :options="parentCateList"
                    :props="{ expandTrigger:'hover',...cascaderProps,}"
                    v-model="selectedKeys"
                    @change="parentCateChanged"
                    clearable
                    change-on-select
                    >
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            //查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize: 5
            },
            //商品分类的数据列表，默认为空
            catelist:[],
            //总数据条数
            total: 0,
            //为table指定列的定义
            columns: [
                {
                label:'分类名称',
                prop: 'cat_name'
                },
                {
                    label:'是否有效',
                    //表示将当前列定义为模板列
                    type:'template',
                    //表示当前这一列使用的模板名称
                    template:'isok'
                },
                 {
                    label:'排序',
                    //表示将当前列定义为模板列
                    type:'template',
                    //表示当前这一列使用的模板名称
                    template:'order'
                },
                {
                    label:'操作',
                    //表示将当前列定义为模板列
                    type:'template',
                    //表示当前这一列使用的模板名称
                    template:'opt'
                }
            ],
            //控制添加分类对话框的显示与隐藏
            addCateDialogVisible : false,
            //添加分类的表单数据对象
            addCateForm: {
                //将要添加的分类的名称
                cat_form:'',
                // 父级分类的id
                cat_pid: 0 ,
                // 分类的等级，默认要添加的是一级分类
                cat_level :0,
                },
            //添加分类表单的验证规则对象
            addCateFormRules :{
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                },
            //父级分类的列表
            parentCateList:[],
            //指定级联选择器的配置对象
            cascaderProps:{
                // expandTrigger:'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children',
                
            },
            //选中的父级分类的id数组
            selectedKeys:[]
        }

    },

    created() {
            this.getCateList()
        },
    methods:{
        //获取商品分类数据
        async getCateList() {
            const {data:res} = await this.$http.get('categories', { params: this.queryInfo})
            if(res.meta.status !== 200) {return this.$message.error('获取商品分类失败')}
            //把数据列表赋值给 catelist
            this.catelist = res.data.result
            console.log(this.catelist)
            //为总数据条数赋值
            this.total = res.data.total

        },
        //监听pagesize改变
        handleSizeChange(newSize) {
            //赋值
            this.queryInfo.pagesize = newSize
            //重新获取数据
            this.getCateList()

        },
        //监听pagenum改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()

        },
        //点击按钮，展示添加分类的对话框
        showAddCateDialog() {
            //先获取父级分类的数据列表
            this.getParentCateList()
            //再展示出对话框
            this.addCateDialogVisible = true
        },
        //获取父级分类的数据列表
        async getParentCateList() {
            const {data:res} = await this.$http.get('categories', {params:{type:2}})
            console.log('777',res)
            if(res.meta.status!==200) {return this.$message.error('获取分类数据失败')}
            this.parentCateList = res.data
            console.log('888',this.parentCateList)


        },
        //选择项发生变化触发这个函数
        parentCateChanged() {
            console.log('99',this.selectedKeys)
            //如果selectedKeys数组的length大于0，证明选中的父级分类
            //反之就说明没有选中任何父级分类
            if(this.selectedKeys.length > 0) {
                //父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys
                this.selectedKeys[this.selectedKeys.length - 1]
                //为当前的分类等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else{
                //父级分类的id
                this.addCateForm.cat_pid = 0
                
                //为当前的分类等级赋值
                this.addCateForm.cat_level = 0
            }
        },
        //点击按钮，添加新的分类
        addCate() {
            console.log(this.addCateForm)
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                console.log(res)
                if(res.meta.status !==201) {return this.$message.error('添加分类失败')}
                this.$message.success('添加分类成功')
                this.getCateList()
                this.addCateDialogVisible = false
            })

        },
        //监听对话框的关闭事件，重置表单数据
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        }
        
    }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
.el-cascader{      height: 250px;  }

</style>