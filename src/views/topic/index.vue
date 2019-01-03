<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" type="primary" plain @click="createTopic()">添加专题</el-button>
      <el-input v-model="listQuery.keywords" clearable size="small" placeholder="请输入专题" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item" @blur="getList" @clear="getList"/>
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
      <el-table-column label="id" prop="id" align="center" width="60px"/>
      <el-table-column label="专题名称" prop="topicName" align="center"/>
      <el-table-column label="专题seo标题" prop="seoTitle" align="center"/>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '停用' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createTime" align="center"/>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button type="text" circle @click="updateTopic(scope.row.id)">编辑</el-button>
            <el-button type="text" circle @click="changeDelete(scope.row.id)">删除</el-button>
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

  </div>
</template>

<script>
import { list, deletes} from '@/api/topic'
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keywords: '',
      },
      temp: {
        id: '',
        topicName: '',
        seoTitle: '',
        status: '',
        createTime: '',
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
        if (response.data.pageSize) {
          this.total = response.data.pageSize
        } else {
          this.total = 0
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      }).catch(() => {

      })
    },

    //删除专题
    changeDelete(id) {
      this.$confirm('此操作将删除该专题吗, 是否继续?', '提示', {
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

    // 跳转到添加专题
    createTopic() {
      this.$router.push('/topic/operation')
    },

    // 跳转到编辑专题
    updateTopic(id) {
      this.$router.push('/topic/operation/' + id)
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

