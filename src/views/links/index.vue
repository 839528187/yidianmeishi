<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" type="primary" plain @click="handleCreate">添加链接</el-button>
      <el-input v-model="listQuery.keyword" size="small" placeholder="请输入名称" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item"/>
      <el-button size="small" type="primary" style="margin-left: 10px; margin-bottom:1px;" plain @click="getList">搜索</el-button>
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
      <el-table-column label="友情链接名称" prop="name" align="center"/>
      <el-table-column label="友情链接地址" prop="url" align="center"/>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '停用' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createdAt" align="center"/>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="text" @click="disableData(scope.row.id)">
              {{ scope.row.status == 1 ? "停用" : "启用" }}
            </el-button>
            <el-button type="text" @click="deleteData(scope.row.id)">删除</el-button>
          </el-row>
        </template>
      </el-table-column>

      <div slot="empty">
        <p :style="{'marginTop': '23px'}">未查询到您要的记录</p>
      </div>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="链接名称" prop="name">
          <el-input v-model="temp.name" value="name" placeholder="名称"/>
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="temp.url" type="url" placeholder="地址"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='添加友情链接'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { list, create, update, disable, deletes } from '@/api/links'
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      listQuery: {
        page: 1,
        limit: 10,
        keyword: ''
      },
      temp: {
        id: '',
        name: '',
        url: '',
        status: '',
        createdAt: ''
      },
      rules: {
        name: [
          { required: true, message: '连接名称不能为空', trigger: 'change' }
        ],
        url: [
          { required: true, message: '连接地址不能为空', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.getList()
  },

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

    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        url: ''
      }
    },

    // 添加连接
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '添加友情链接'
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
                type: 'success',
                message: data.msg
              })
              this.getList()
            } else {
              return false
            }
          })
        }
      })
    },

    // 编辑连接
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = '编辑友情链接'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm']
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
                type: 'success',
                message: data.msg
              })
              this.getList()
            } else {
              return false
            }
          })
        }
      })
    },

    // 停用启用友情链接
    disableData(id) {
      this.$confirm('此操作将操作该链接吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disable(id).then(data => {
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
          message: '已取消操作'
        })
      })
    },

    // 删除友情链接
    deleteData(id) {
      this.$confirm('此操作将删除该链接吗, 是否继续?', '提示', {
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
    }
  }

}
</script>
