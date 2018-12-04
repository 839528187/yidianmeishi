<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" size="small" placeholder="请输入手机号" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item"/>
      <el-button size="small" type="primary" style="margin-left: 10px; margin-bottom:1px;" plain @click="getList">搜索</el-button>
      <el-date-picker
        :default-time="['00:00:00', '23:59:59']"
        v-model="value13"
        size="small"
        style="margin-left: 10px; margin-bottom:1px; width:400px;"
        type="daterange"
        format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="getList"/>
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
      <el-table-column label="姓名" prop="name" align="center"/>
      <el-table-column label="手机号" prop="phone" align="center"/>
      <el-table-column label="来源" prop="ref" align="center"/>
      <el-table-column label="地区" prop="areaName" align="center"/>
      <el-table-column label="所属学校" prop="sSchoolName" align="center"/>
      <el-table-column label="类型" prop="type" align="center">
        <template slot-scope="scope">
          {{ scope.row.type == 2 ? '无效留言' : '有效留言' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '已处理' : '未处理' }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createdAt" align="center"/>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button type="text" @click="getView(scope.row.id)">查看</el-button>
            <el-button :disabled="scope.row.disposes" type="text" @click="getDispose(scope.row.id)">处理留言</el-button>
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

    <!--详情-->
    <el-dialog :visible.sync="dialogFormVisibles" title="留言详情" style="width: 100%; margin-left: auto; margin-right: auto;">
      <div class="liuyan_box">
        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.name">
            <template slot="prepend">真实姓名:</template>
          </el-input>
        </div>

        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.phone">
            <template slot="prepend">留言手机号:</template>
          </el-input>
        </div>

        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.areaName">
            <template slot="prepend">留言地区:</template>
          </el-input>
        </div>

        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.address">
            <template slot="prepend">家庭地址:</template>
          </el-input>
        </div>

        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.sSchoolName">
            <template slot="prepend">留言学校:</template>
          </el-input>
        </div>

        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.schoolName">
            <template slot="prepend">毕业学校:</template>
          </el-input>
        </div>

        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.specialty">
            <template slot="prepend">意向专业:</template>
          </el-input>
        </div>

        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.qq">
            <template slot="prepend">qq号码:</template>
          </el-input>
        </div>

        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.score">
            <template slot="prepend">分数线:</template>
          </el-input>
        </div>

        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.status">
            <template slot="prepend">留言状态:</template>
          </el-input>
        </div>

        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.type">
            <template slot="prepend">留言类型:</template>
          </el-input>
        </div>

        <div class="liuyan">
          <el-input :readonly="readonly" v-model="temp.createdAt">
            <template slot="prepend">添加时间:</template>
          </el-input>
        </div>
        <div class="liuyan_w">
          <el-input :readonly="readonly" v-model="temp.education">
            <template slot="prepend">学历:</template>
          </el-input>
        </div>
        <div style="margin-bottom:10px"/>
        <div class="liuyan_w">
          <el-input :readonly="readonly" :autosize="autosize" v-model="temp.remark" label="备注" type="textarea"/>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { list, view, dispose } from '@/api/leave'
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisibles: false,
      autosize: false,
      readonly: false,
      value13: [],
      listQuery: {
        page: 1,
        limit: 10,
        keyword: ''
      },
      temp: {
        id: '',
        name: '',
        phone: '',
        status: '',
        createdAt: '',
        type: '',
        specialty: '',
        qq: '',
        address: '',
        score: '',
        education: '',
        schoolId: '',
        remark: '',
        scloolName: '',
        areaId: '',
        ref: '',
        ip: '',
        areaName: '',
        sSchoolName: ''
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
      if (this.value13 && this.value13.length > 0) {
        this.listQuery.startTime = this.value13[0]
        this.listQuery.endTime = this.value13[1]
      }
      list(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.pageSize
        if (this.list != null) {
          this.list.forEach(x => {
            if (x.status === 2) {
              x.disposes = true
            } else {
              x.disposes = false
            }
          })
        }
        this.listQuery.startTime = null
        this.listQuery.endTime = null
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },

    getView(id) {
      this.listLoading = false
      this.dialogFormVisibles = true
      this.readonly = true
      this.autosize = true
      view(id).then(response => {
        if (response.code === 200) {
          this.temp = response.data
          this.temp.status = response.data.status === 2 ? '已处理' : '未处理'
          this.temp.type = response.data.type === 1 ? '有效留言' : '无效留言'
        } else {
          return false
        }
      })
    },

    // 处理留言
    getDispose(id) {
      this.$confirm('此操作将处理该留言, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dispose(id).then(data => {
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
          message: '已取消处理'
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

<style>

.liuyan_box{
  overflow: hidden;
}
.liuyan{
  width: 45%;
  float: left;
  margin: 0 5% 10px 0
}
.liuyan_w{
  margin-right: 5%;
}
</style>

