<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" type="primary" plain @click="createSchool()">添加学校</el-button>
      <el-input v-model="listQuery.keyword" clearable size="small" placeholder="请输入学校名称" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item" @blur="getList" @clear="getList"/>
      <!-- <el-button size="small" type="primary" style="margin-left: 10px; margin-bottom:1px;" plain @click="getList">搜索</el-button> -->
      <el-cascader :options="area" style="width: 210px; margin-left: 10px; margin-bottom:1px;" size="small" change-on-select clearable placeholder="地区搜索-可以搜索地区名称" filterable @change="getList"/>
      <el-cascader :options="types" style="width: 300px; margin-left: 10px; margin-bottom:1px;" size="small" clearable placeholder="类型搜索-可以搜索类型名称" filterable @change="changetypes"/>
    </div>

    <div style="margin-bottom:1px"/>
    <!-- 表格数据 -->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="id" prop="id" align="center" width="60px"/>
      <el-table-column label="logo" width="80px">
        <template slot-scope="scope">
          <img :src="scope.row.logo" width="60px" height="60px" class="head_pic">
        </template>
      </el-table-column>
      <el-table-column label="学校名称" prop="schoolName" align="center"/>
      <el-table-column label="地区" prop="areaName" align="center"/>
      <el-table-column label="类别" prop="typeName" align="center"/>
      <el-table-column label="是否推荐" prop="isRecommend" align="center">
        <template slot-scope="scope">
          {{ scope.row.isRecommend == 2 ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createdAt" align="center"/>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '待审核' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button size="small" type="text" @click="updateSchool(scope.row.id)">编辑</el-button>
            <el-button size="small" type="text" @click="changeDelete(scope.row.id)">删除</el-button>
            <el-dropdown style="margin-left: 10px; margin-bottom:1px;">
              <el-button type="text" size="small">
                更多<i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item size="small" @click.native="present(scope.row.id)">招生专业</el-dropdown-item>
                <el-dropdown-item divided size="small" @click.native="milieu(scope.row.id)">校园环境</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
import { list, deletes } from '@/api/school'
import { search } from '@/api/area'
import { parent } from '@/api/type'
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisible: false,
      area: [],
      types: [],
      dialogStatus: '',
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        areaId: ''
      },
      temp: {
        id: '',
        areaId: '',
        typeId: '',
        schoolName: '',
        logo: '',
        schoolLevel: '',
        schoolNature: '',
        browseNum: '',
        isRecommend: '',
        status: '',
        createdAt: '',
        areaName: '',
        typeName: ''
      }
    }
  },

  created() {
    this.getList()
    this.getAreaLists()
    this.getTypeList()
  },

  methods: {

    // 获取列表
    getList(val) {
      if (val) {
        this.listQuery.areaId = val[val.length - 1]
      }
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

    // 地区筛选
    getAreaLists() {
      search().then(data => {
        this.area = data.data
      }).catch(e => {
        console.log(e)
      })
    },

    changeDelete(id) {
      this.$confirm('此操作将删除该学校吗, 是否继续?', '提示', {
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

    // 学校环境
    milieu(id) {
      this.$router.push('/school/milieu/' + id)
    },

    // 学校专业
    present(id) {
      this.$router.push('/school/present/' + id)
    },

    // 学校列表搜索栏使用学校类型筛选
    async getTypeList() {
      try {
        var data = await parent()
        data.data.forEach(e => {
          if (e.children && e.children.length > 0) {
            e.children.forEach(i => {
              if (i.children && i.children.length > 0) {
                i.children.forEach(k => {
                  if (k.children && k.children.length <= 0) {
                    delete k.children
                  }
                })
              } else {
                delete i.children
              }
            })
          } else {
            delete e.children
          }
        })
        this.types = data.data
      } catch (error) {
        console.log(error)
      }
    },

    changetypes(val) {
      this.listQuery.typeId = val[val.length - 1]
      this.getList()
    },
    createSchool() {
      this.$router.push('/school/create')
    },

    updateSchool(id) {
      this.$router.push('/school/create/' + id)
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
