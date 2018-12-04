<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.parentId" clearable placeholder="请选择顶级地区" size="small" style="width: 200px; margin-left: 0px; margin-bottom:1px; height:32px;" @clear="getList" @change="getList">
        <el-option
          v-for="item in options"
          :key="item.areaid"
          :label="item.name"
          :value="item.areaid"/>
      </el-select>
      <el-input v-model="listQuery.keyword" clearable size="small" placeholder="请输入搜索地区名称" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item" @keyup.enter.native="getList" @clear="getList"/>
      <!-- <el-button size="small" type="primary" style="margin-left: 10px; margin-bottom:1px;" plain @click="getList">搜索</el-button> -->
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
      <el-table-column label="id" prop="areaid" align="center" width="60px"/>
      <el-table-column label="地区名称" prop="name" align="center"/>
      <el-table-column label="上级地区" prop="parentName" align="center"/>
      <el-table-column label="地区栏目地址" prop="initials" align="center"/>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '停用' : '启用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button type="text" circle @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="text" @click="operatingData(scope.row.areaid,scope.row.status)">
              {{ scope.row.status == 1 ? "停用" : "启用" }}
            </el-button>
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
    <!--更新地区-->
    <el-dialog :visible.sync="dialogFormVisible" title="更新地区" style="width: 1110px; margin-left: auto; margin-right: auto;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="地区名称" prop="name">
          <el-input v-model="temp.name" value="name" placeholder="地区名称"/>
        </el-form-item>
        <el-form-item label="栏目连接" prop="initials">
          <el-input v-model="temp.initials" placeholder="栏目连接"/>
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
import { list, operating, update, parent } from '@/api/area'
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      options: null,
      total: null,
      dialogFormVisible: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        parentId: ''
      },
      temp: {
        areaid: '',
        name: '',
        initials: '',
        status: '',
        parentName: ''
      },
      rules: {
        name: [
          { required: true, message: '地区名称不能为空', trigger: 'change' }
        ],
        initials: [
          { required: true, message: '地区栏目连接不能为空', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.getList()
    this.getParent()
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

    getParent() {
      parent().then(data => {
        this.options = data.data
      })
    },

    // 操作地区（停用启用）
    operatingData(id, status) {
      var msgs = status === 1 ? '停用' : '启用'
      this.$confirm('您确定' + msgs + '此地区吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        operating(id).then(data => {
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
          message: '已取消' + msgs
        })
      })
    },

    // 更新地区
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.dusabked = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          update(this.temp, this.temp.areaid).then(data => {
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
