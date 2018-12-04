<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" type="primary" plain @click="createFood()">新增</el-button>
      <el-input size="small" placeholder="请输入名称" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item"/>
      <el-button size="small" type="primary" style="margin-left: 10px; margin-bottom:1px;" plain >搜索</el-button>
    </div>

    <div style="margin-bottom:1px"></div>
    <!-- 表格数据 -->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
        <el-table-column label="id" prop="visitId" align="center" width="60px"></el-table-column>
        <el-table-column label="缩略图" width="80px">
          <template slot-scope="scope">
            <img :src="scope.row.thumb" width="60px" height="60px" class="head_pic"/>
         </template>
        </el-table-column>
        <el-table-column label="标题" prop="title" align="center"></el-table-column>
        <el-table-column label="所属分类" prop="cateName" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            {{ scope.row.status == 1 ? '正常' : '待审核' }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="releaseTime" align="center"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-row>
              <el-button type="text" circle @click="updateFood(scope.row.visitId)">编辑</el-button>
              <el-button type="text" @click="deleteFood(scope.row.visitId)">删除</el-button>
          </el-row>
          </template>  
        </el-table-column>
      </el-table>
      <!-- 分页 你想要什么效果哪里如果是1就是正常 否则就是审核明白了-->

      <div style="margin-bottom:20px"></div>
      <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.page"
            :page-size="listQuery.limit"
            layout="prev, pager, next, jumper"
            prev-text="上一页"
            next-text="下一页"
            :total="total"
            style="text-align: right;">
          </el-pagination>
        </div>

  </div>
</template>

<script>
import { list, deletes } from "@/api/foodNews";
export default {
  created() {
    this.getList();
  },
  //数据
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogStatus: "",
      listQuery: {
        page: 1,
        limit: 10
      },
      temp: {
        visitId: "",
        cateId: "",
        cateName: "",
        title: "",
        thumb: "",
        status: "",
        releaseTime: ""
      }
    };
  },

  //方法
  methods: {
    //获取列表
    getList() {
      this.listLoading = true;
      list(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.pageSize;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 200);
      });
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },

    //删除
    deleteFood(visitId) {
      this.listLoading = false;
      deletes(visitId).then(data => {
        if (data.code == 200) {
          this.$notify({
            message: data.msg,
            type: "success"
          });
          this.getList();
        } else {
          return false;
        }
      });
    },

    createFood() {
      this.$router.push("/foodNews/create");
    },
    
    updateFood(visitId) {
      this.$router.push("/foodNews/create/" + visitId);
    }
  }
};
</script>

