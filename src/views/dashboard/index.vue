<template>
  <div class="dashboard-container">
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="always">
          昨日发布新闻量 {{ tj.newsNum }} 条
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          昨日留言量 {{ tj.leaveNum }} 条
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          昨日入驻学校 {{ tj.schoolNum }} 家
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { indexs } from '@/api/index'

export default {
  data() {
    return {
      tj: {
        newsNum: 0,
        leaveNum: 0,
        schoolNum: 0
      }
    }
  },

  methods: {


  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
