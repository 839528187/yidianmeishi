<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" type="primary" plain @click="handleCreate">添加账户</el-button>
      <el-input v-model="listQuery.keyword" size="small" placeholder="请输入账户名称" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item"/>
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
      <el-table-column label="用户名" prop="username" align="center"/>
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
            <el-button type="text" @click="getDispose(scope.row.id)">停用</el-button>
            <!-- <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button> -->
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <div>
        <el-pagination v-show="total>10" :current-page="listQuery.page" :page-size="listQuery.limit" :total="total" background layout="prev, pager, next" style="text-align: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
      </div> -->

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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" :disabled="dusabked" value="username" placeholder="用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password" placeholder="密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='添加账户'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>

    <!-- 更改账户密码 -->
    <el-dialog :visible.sync="dialogFormVisibles" title="更改账户密码" style="width: 1110px; margin-left: auto; margin-right: auto;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" :disabled="dusabked" value="username" placeholder="用户名"/>
        </el-form-item>
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="temp.oldPassword" type="password" placeholder="密码"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password" placeholder="密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { list, create, update, disable } from '@/api/admin'
export default {
  // 数据
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogFormVisibles: false,
      dusabked: false,
      dialogStatus: '',
      listQuery: {
        page: 1,
        limit: 10,
        keyword: ''
      },
      temp: {
        id: '',
        username: '',
        password: '',
        status: '',
        createTime: '',
        keyword: '',
        oldPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ],
        oldPassword: [
          { required: true, message: '原密码不能为空', trigger: 'change' }
        ],
        email: [{ required: true, message: '邮箱', trigger: 'change' }]
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
      list(this.listQuery, this.temp.keyword).then(response => {
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
        username: '',
        password: '',
        oldPassword: ''
      }
    },

    // 添加用户
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '添加账户'
      this.dialogFormVisible = true
      this.dialogFormVisibles = false
      this.dusabked = false
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

    // 更改用户密码
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = false
      this.dialogFormVisibles = true
      this.dusabked = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          update(this.temp, this.temp.id).then(data => {
            this.list.unshift(this.temp)
            this.dialogFormVisibles = false
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

    // 停用账户
    getDispose(id) {
      this.$confirm('此操作将停用账户, 是否继续?', '提示', {
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
          message: '已取消停用账户'
        })
      })
    }

  }
}
</script>

