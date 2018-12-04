<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" type="primary" plain @click="changePresent">添加学校专业</el-button>
      <el-input v-model="listQuery.keyword" size="small" placeholder="请输入名称" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item" @blur="getList" @clear="getList"/>
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
      <el-table-column label="所属学校" prop="schoolName" align="center"/>
      <el-table-column label="专业名称" prop="name" align="center"/>
      <el-table-column label="是否推荐" prop="isGroom" align="center">
        <template slot-scope="scope">
          {{ scope.row.isGroom == 2 ? '不推荐' : '推荐' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '停用' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createdAt" align="center"/>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button type="text" @click="changePresentUpdate(scope.row)">编辑</el-button>
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

    <div v-if="presentFormVisible">
      <el-dialog :visible.sync="presentFormVisible" :title="dialogStatus" style="width: 120%; margin-left: auto; margin-right: auto;">
        <el-form ref="presentForm" :model="temp" label-position="left" label-width="80px" style="width: 90%; margin-left:50px;">
          <el-form-item label="专业名称:" prop="name">
            <el-input v-model="temp.name" value="name" placeholder="专业名称"/>
          </el-form-item>
          <el-form-item label="是否推荐:" prop="isGroom" label-width="80px">
            <div style="margin-top: 0px">
              <el-radio-group v-model="temp.isGroom" size="small">
                <el-radio border label="1">推荐</el-radio>
                <el-radio border label="2">不推荐</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item prop="present" label="专业介绍:">
            <div class="editor-container">
              <Tinymce ref="editor" :height="200" :with="300" v-model="temp.present" style="line-height: 29px;" />
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ChangeCancel">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='添加专业'?changeCreate():changeUpdate()">提交</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { list, create, update, deletes } from '@/api/present'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogStatus: '',
      presentFormVisible: false,
      listQuery: {
        schoolId: this.$route.params.id,
        page: 1,
        limit: 10,
        keyword: ''
      },
      temp: {
        id: '',
        name: '',
        schoolId: this.$route.params.id,
        present: '',
        isGroom: '2',
        schoolName: '',
        status: '',
        createdAt: ''
      },
      rules: {
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {

    // 获取学校专业类别
    async getList() {
      this.listLoading = true
      var data = await list(this.listQuery)
      this.list = data.data.data
      this.total = data.data.pageSize
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 200)
    },

    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        schoolId: this.$route.params.id,
        present: '',
        isGroom: '2',
        schoolName: '',
        status: '',
        createdAt: ''
      }
    },

    // 添加专业
    changePresent() {
      this.resetTemp()
      this.dialogStatus = '添加专业'
      this.presentFormVisible = true
      this.$nextTick(() => {
        this.$refs['presentForm']
      })
    },

    changeCreate() {
      this.$refs['presentForm'].validate(valid => {
        if (valid) {
          create(this.temp).then(data => {
            // this.list.unshift(this.temp)
            this.presentFormVisible = false
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

    // 编辑专业
    changePresentUpdate(row) {
      this.temp = Object.assign({}, row) // copy ob
      this.temp.isGroom = JSON.stringify(this.temp.isGroom)
      this.dialogStatus = '编辑专业'
      this.presentFormVisible = true
      this.$nextTick(() => {
        this.$refs['presentForm']
      })
    },

    changeUpdate() {
      this.$refs['presentForm'].validate(valid => {
        if (valid) {
          update(this.temp.id, this.temp).then(data => {
            this.list.unshift(this.temp)
            this.presentFormVisible = false
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

    // 删除学校专业
    deleteData(id) {
      this.$confirm('此操作将删除该专业吗, 是否继续?', '提示', {
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

    ChangeCancel() {
      this.introduceFormVisible = false
      this.resetTemps()
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
