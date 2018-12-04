<template>
  <div class="app-container">
    <el-upload
      v-loading="listLoading"
      ref="upload"
      :action="actionUrl"
      :data="datas"
      :headers="uploadHeaders"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="list"
      :limit="limit"
      :on-change="onSuccess"
      :on-exceed="onExceed"
      :auto-upload="false"
      list-type="picture-card">
      <i class="el-icon-plus"/>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :title="temp.title">
      <img :src="temp.url" width="100%" alt="">
    </el-dialog>

    <!--上传环境图片输入名称-->
    <div v-if="entourageListVisible">
      <el-dialog :visible.sync="entourageListVisible" title="专业介绍" style="width: 50%; margin-left: auto; margin-right: auto;">
        <el-form ref="dataForm" :model="datas" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="环境名称" prop="title">
            <el-input v-model="datas.title" value="title" placeholder="环境名称"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ChangeCancel">取消</el-button>
          <el-button type="primary" @click="submitUpload()">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { getToken } from '@/utils/auth'
import { list, deletes } from '@/api/entourage'
export default {
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      entourageListVisible: false,
      limit: 6,
      count: 0,
      isVisible: 1,
      list: [],
      actionUrl: this.entourageUrl, // 上传图片链接
      listQuery: {
        schoolId: this.$route.params.id
      },
      datas: {
        'title': '',
        'location': 'milieus',
        'schoolId': this.$route.params.id
      },
      temp: {
        'url': '',
        'title': '',
        'id': ''
      },
      uploadHeaders: {
        'usertoken': getToken()
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    // 环境图片列表
    async getList() {
      this.listLoading = true
      var data = await list(this.listQuery)
      this.list = data.data
      this.count = data.count
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 200)
    },

    resetTemps() {
      this.temp = {
        id: '',
        name: '',
        url: ''
      }
    },

    ChangeCancel() {
      this.entourageListVisible = false
      this.resetTemps()
    },

    submitUpload() {
      this.entourageListVisible = false
      this.isVisible = 2
      this.$refs.upload.submit()
      setTimeout(() => {
        this.isVisible = 1
      }, 300)
    },

    handleRemove(file, fileList) {
      console.log(file)
      this.$confirm('此操作将删除该环境吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletes(file.id).then(data => {
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: data.msg
            })
          } else {
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.getList()
      })
    },
    handlePictureCardPreview(file) {
      this.temp = file
      this.dialogVisible = true
    },

    onSuccess() {
      if (this.isVisible === 1) {
        this.entourageListVisible = true
      }
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message({
          message: '上传图片大小不能超过 1MB!',
          type: 'error'
        })
      }
      if (!isJPG && !isPNG) {
        this.$message({
          message: '上传的图片必须是JGP,PNG格式',
          type: 'error'
        })
      }
      return isLt2M && (isJPG || isPNG)
    },

    onExceed() {
      this.$message({
        message: '环境最多上传' + this.limit + '张图片',
        type: 'error'
      })
    }

  }
}
</script>
