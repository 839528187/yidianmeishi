<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" type="primary" plain @click="createNews()">添加新闻</el-button>
      <el-select
        v-model="listQuery.schoolId"
        :remote-method="getSchoolSearch"
        :loading="listLoading"
        :value-key="schoolSearchName.schoolName"
        style="width: 200px; margin-left: 10px; margin-bottom:1px;"
        size="small"
        filterable
        remote
        clearable
        reserve-keyword
        placeholder="请输入学校名称搜索"
        @change="getList"
        @clear="getList">
        <el-option
          v-for="item in school"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
      <el-cascader :options="category" style="width: 210px; margin-left: 10px; margin-bottom:1px;" size="small" clearable placeholder="分类搜索-可以搜索分类名称" filterable @change="changeCategory"/>
      <el-input v-model="listQuery.keywords" clearable size="small" placeholder="请输入新闻标题" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item" @blur="getList" @clear="getList"/>
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
      <el-table-column label="缩略图" width="80px">
        <template slot-scope="scope">
          <img :src="scope.row.thumb" width="60px" height="60px" class="head_pic">
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" align="center"/>
      <el-table-column label="所属学校" prop="schoolName" align="center"/>
      <el-table-column label="所属分类" prop="categoryName" align="center"/>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '停用' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createdAt" align="center"/>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button type="text" circle @click="updateNews(scope.row.id)">编辑</el-button>
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
import { list, deletes } from '@/api/news'
import { newsSearch } from '@/api/category'
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      schoolSearchName: {
        schoolName: ''
      },
      school: [],
      category: [],
      listQuery: {
        page: 1,
        limit: 10,
        keywords: '',
        schoolId: '',
        categoryId: ''
      },
      temp: {
        id: '',
        title: '',
        thumb: '',
        status: '',
        createdAt: '',
        schoolId: '',
        categoryId: '',
        schoolName: '',
        categoryName: ''
      }
    }
  },

  created() {
    this.getList()
    this.getCategorySearch()
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

    // 删除新闻
    changeDelete(id) {
      this.$confirm('此操作将删除该新闻吗, 是否继续?', '提示', {
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

    // 跳转到添加新闻
    createNews() {
      this.$router.push('/news/operation')
    },

    // 跳转到编辑新闻
    updateNews(id) {
      this.$router.push('/news/operation/' + id)
    },

    // 查询分类
    getCategorySearch() {
      newsSearch().then(data => {
        this.category = data.data
      })
    },

    changeCategory(val) {
      this.listQuery.categoryId = val[val.length - 1]
      this.getList()
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

