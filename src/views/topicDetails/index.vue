<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" type="primary" plain @click="createTopic()">添加专题菜品</el-button>
      <el-input v-model="listQuery.keywords" clearable size="small" placeholder="请输入专题菜品名称" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item" @blur="getList" @clear="getList"/>
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
      <el-table-column label="所属专题" prop="topicName" align="center"/>
      <el-table-column label="短标题" prop="shortTitle" align="center"/>
      <el-table-column label="美食热度">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.heat" disabled :colors="['#dc143c', '#dc143c', '#dc143c']"></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '停用' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createTime" align="center"/>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button style="padding: 12px 1px;" type="text" circle @click="handleUpdateBanner(scope.row)">上传banner</el-button>
            <el-button style="padding: 12px 1px;" type="text" circle @click="updateTopic(scope.row.id)">编辑</el-button>
            <el-button style="padding: 12px 1px;" type="text" circle @click="milieu(scope.row.id)">图集</el-button>
            <el-button style="padding: 12px 1px;" type="text" circle @click="changeDelete(scope.row.id)">删除</el-button>
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
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="缩略图:" prop="banner">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :data="datas"
            :headers="uploadHeaders"
            :action="actionUrl"
            class="avatar-uploader">
            <img v-if="temp.banner" :src="temp.banner" class="avatar" style="width:100%;">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
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
import { list, banners, deletes } from '@/api/topicDetails'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisible: false,
      actionUrl: this.uploadUrl, // 上传图片链接
      dusabked: false,
      dialogStatus: '更新banner图',
      listQuery: {
        page: 1,
        limit: 10,
        keywords: '',
      },
      temp: {
        id: '',
        topicId: '',
        shortTitle: '',
        status: '',
        title:'',
        thumb:'',
        banner:'',
        heat:'',
        topicName:'',
        createTime: '',
        urlThumb:'',
        bannerUrl:'',
        thumbUrl:''
      },

      upload: {
        imgUrl: '',
        url: ''
      },

      uploadHeaders: {
        'usertoken': getToken()
      },

      datas: {
        'location': 'topicDetails'
      },
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

    milieu(id) {
      this.$router.push('/atlas/list/' + id)
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

    resetTemp() {
      this.temp = {
        id: '',
        banner: '',
      }
    },

    handleUpdateBanner(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.dusabked = true
      this.$nextTick(() => {
        this.$refs['dataForm']
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.banner = this.temp.bannerUrl
          this.temp.thumb = this.temp.thumbUrl
          banners(this.temp.id, this.temp).then(data => {
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

    changeDelete(id) {
      this.$confirm('你确定要删除吗？', '提示', {
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
      this.$router.push('/topicDetails/operation')
    },

    // 跳转到编辑专题
    updateTopic(id) {
      this.$router.push('/topicDetails/operation/' + id)
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
    handleAvatarSuccess(res, file) {
      this.upload.url = res.data.url
      this.temp.imgUrl = res.data.imgUrl
      this.temp.banner = res.data.url + res.data.imgUrl
      this.temp.bannerUrl = res.data.imgUrl
      // this.upload.imgUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
    //   const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$msg.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    }
  }

}
</script>

