<template>
  <div class="createPost-container">
    <el-form ref="topicForm" :rules="rules" :model="temp" class="form-container">
      <sticky :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="caozuo()">提交</el-button>
        <el-button v-loading="loading" type="info" @click="skipNewsList">返回列表</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="23">
            <el-form-item style="margin-bottom: 40px;" prop="topicName">
              <MDinput v-model="temp.topicName" :maxlength="100" value="topicName" name="name" required>
                专题名称
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="seoTitle">
              <MDinput v-model="temp.seoTitle" :maxlength="100" placeholder="每个关键词用空格隔开" value="seoTitle" name="name" required>
                专题seo标题
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="seoKeyword">
              <MDinput v-model="temp.seoKeyword" :maxlength="100" placeholder="每个关键词用空格隔开" value="seoKeyword" name="name" required>
                专题seo关键词
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="seoDescription">
              <MDinput v-model="temp.seoDescription" :maxlength="1000" placeholder="每个关键词用空格隔开" value="seoDescription" name="name" required>
                专题seo描述
              </MDinput>
            </el-form-item>
            <el-form-item label="专题顶部banner图片:" prop="banner">
              <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :data="datas"
                :headers="uploadHeaders"
                :action="actionUrl"
                class="avatar-uploader">
                <img v-if="temp.banner" :src="temp.banner" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
            </el-form-item>

          </el-col>
        </el-row>
      </div>

    </el-form>
  </div>
</template>

<script>
import { create, findOne, update } from '@/api/topic'
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput'
import { getToken } from '@/utils/auth'

const defaultForm = {
  topicName: '',
  seoTitle: '',
  seoKeyword: '',
  seoDescription: '',
  banner: '',
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  components: { MDinput, Sticky},

  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      category: [],
      actionUrl: this.uploadUrl, // 上传图片链接
      temp: {
        id: '',
        topicName: '',
        seoTitle: '',
        seoKeyword: '',
        seoDescription: '',
        banner: '',
        urlThumb:''
      },

      uploadHeaders: {
        'usertoken': getToken()
      },

      upload: {
        imgUrl: '',
        url: ''
      },

      datas: {
        'location': 'topic'
      },

      category_check: [],

      rules: {
        topicName: [{ required: true, message: '专题名称不能为空', trigger: 'change' }],
        seoTitle: [{ required: true, message: '专题seo标题不能为空', trigger: 'change' }],
        seoKeyword: [{ required: true, message: '专题seo关键词不能为空', trigger: 'change' }],
        seoDescription: [{ required: true, message: '专题描述不能为空', trigger: 'change' }],
        banner: [{ required: true, message: '专题banner图片不能为空', trigger: 'change' }]
      }
    }
  },

  async created() {
    await this.getFindOne()
  },

  methods: {

    skipNewsList() {
      this.$router.push('/topic/list')
    },

    caozuo() {
      if (this.$route.params.id != null) {
        this.updateData()
      } else {
        this.createData()
      }
    },

    // 添加专题
    createData() {
      this.dialogStatus = '添加'
      this.$refs['topicForm'].validate(valid => {
        if (valid) {
          this.temp.banner = this.temp.urlThumb
          create(this.temp).then(data => {
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.$router.push('/topic/list')
            } else {
              return false
            }
          })
        }
      })
    },

    // 编辑时获取专题
    getFindOne() {
      this.listLoading = true
      findOne(this.$route.params.id).then(response => {
        this.temp = response.data // copy obj
        this.temp.isRecommend = JSON.stringify(this.temp.isRecommend)
        // Just to simulate the time of the request 
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },

    // 编辑专题
    updateData(food) {
      this.dialogStatus = '编辑'
      this.$refs['topicForm'].validate(valid => {
        this.temp.banner = this.temp.urlThumb
        if (valid) {
          update(this.temp.id, this.temp).then(data => {
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.$router.push('/topic/list')
            } else {
              return false
            }
          })
        }
      })
    },

    handleAvatarSuccess(res, file) {
      this.upload.url = res.data.url
      this.temp.imgUrl = res.data.imgUrl
      this.temp.banner = res.data.url + res.data.imgUrl
      this.temp.urlThumb = res.data.imgUrl
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

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
        width: 303px;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>

