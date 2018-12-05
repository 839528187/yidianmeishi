<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" type="primary" plain @click="handleCreate">添加分类</el-button>
      <!-- <el-select v-model="listQuery.parentId" size="small" clearable placeholder="请选择上级分类" style="width: 200px; margin-left: 10px; margin-bottom:1px;" @clear="getList" @change="getList">
        <el-option v-for="lo in cateList" :label="lo.cateName" :value="lo.id" :key="lo.id"/>
      </el-select> -->
      <el-input v-model="listQuery.keyword" size="small" clearable placeholder="请输入分类名称" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item" @blur="getList" @clear="getList"/>
    </div>

    <div style="margin-bottom:1px"/>
    <!-- 表格数据 -->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="id" prop="id" align="center" width="60px"/>
      <el-table-column label="分类名称" prop="name" align="center"/>
      <el-table-column label="创建时间" prop="createTime" align="center"/>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 1 ? '正常' : '待审核' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button type="text" circle @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteData(scope.row.id)">删除</el-button>
            <!-- <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button> -->
          </el-row>
        </template>

        <div slot="empty">
          <p :style="{'marginTop': '23px'}">未查询到您要的记录</p>
        </div>

      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="margin-bottom:20px"/>
    <div class="block">
      <el-pagination
        :current-page.sync="listQuery.page"
        :page-size="listQuery.limit"
        :total="total"
        layout="prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
        style="text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>

    <!-- 弹出框 -->
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" style="width: 1110px; margin-left: auto; margin-right: auto;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="分类名称" prop="name" label-width="80px">
          <el-input v-model="temp.name" value="name" placeholder="分类名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='添加分类'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { list, create, update, deletes } from '@/api/category'
export default {
  // 数据
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisible: false,
      cateList: [],
      dialogStatus: '',
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        parentId: ''
      },
      temp: {
        id: '',
        name: '',
        parentId: '',
        status: '',
        createTime: '',
        keyword: ''
      },
      rules: {
        cateName: [
          { required: true, message: '分类名称不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },

  // 方法
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.pageSize

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },

    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        parentId: '',
        status: '',
        createTime: ''
      }
    },

    // 添加分类
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '添加分类'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          create(this.temp).then(data => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.getList()
            } else {
              return false
            }
          })
        }
      })
    },

    // 编辑
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = '编辑分类'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          update(this.temp, this.temp.id).then(data => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.getList()
            } else {
              return false
            }
          })
        }
      })
    },

    // 删除类别
    deleteData(id) {
      this.$confirm('此操作将删除该分类吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletes(id).then(data => {
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: data.msg
            })
            this.getList()
          } else {
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>

