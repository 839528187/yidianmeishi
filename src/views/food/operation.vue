<template>
  <div class="createPost-container">
    <el-form ref="newsForm" :rules="rules" :model="temp" class="form-container">
      <sticky :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="caozuo()">提交</el-button>
        <el-button v-loading="loading" type="info" @click="skipNewsList">返回列表</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="23">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="temp.title" :maxlength="100" value="title" name="name" required>
                标题
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="temp.seoTitle" :maxlength="100" value="seoTitle" name="name" required>
                SEO标题
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="keywords">
              <MDinput v-model="temp.keyword" :maxlength="100" placeholder="每个关键词用空格隔开" value="keyword" name="name" required>
                关键词
              </MDinput>
            </el-form-item>

            <el-form-item label="缩略图:" prop="thumb">
              <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :data="datas"
                :headers="uploadHeaders"
                :action="actionUrl"
                class="avatar-uploader">
                <img v-if="temp.thumb" :src="temp.thumb" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
            </el-form-item>

            <el-form-item style="margin-bottom: 40px;" label-width="60px" label="描述:" prop="description">
              <el-input :rows="1" v-model="temp.description" type="textarea" class="article-textarea" placeholder="输入描述"/>
              <span class="word-counter">{{ temp.description.length }}字符</span>
            </el-form-item>

            <div class="editor-container">
              食材相克
              <Tinymce ref="editor" :height="400" :with="300" v-model="temp.phase" />
            </div>

            <div class="editor-container">
              食材相宜
              <Tinymce ref="editor" :height="400" :with="300" v-model="temp.fit" />
            </div>

            <div class="editor-container">
              食材功效
              <Tinymce ref="editor" :height="400" :with="300" v-model="temp.effect" />
            </div>

            <div class="editor-container">
              食材营业价值
              <Tinymce ref="editor" :height="400" :with="300" v-model="temp.diet" />
            </div>

          </el-col>
        </el-row>
      </div>

    </el-form>
  </div>
</template>

<script>
import { create, findOne, update } from '@/api/food'
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput'
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'

const defaultForm = {
  status: '',
  title: '',
  seoTitle: '',
  keyword: '',
  thumb: '',
  description: '',
  phase: '',
  fit: '',
  effect: '',
  diet: '',
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  components: { MDinput, Sticky, Tinymce },

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
        title: '',
        keyword: '',
        description: '',
        thumb: '',
        seoTitle: '',
        imgUrl: '',
        urlThumb: '',
        phase: '',
        fit: '',
        effect: '',
        diet: '',
      },

      uploadHeaders: {
        'usertoken': getToken()
      },

      upload: {
        imgUrl: '',
        url: ''
      },

      datas: {
        'location': 'food'
      },

      category_check: [],

      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        seoTitle: [{ required: true, message: 'seo标题不能为空', trigger: 'change' }],
        thumb: [{ required: true, message: '缩略图不能为空', trigger: 'change' }],
        description: [{ required: true, message: '描述不能为空', trigger: 'change' }],
        phase: [{ required: true, message: '食物相克不能为空', trigger: 'change' }],
        fit: [{ required: true, message: '食物相宜不能为空', trigger: 'change' }],
        effect: [{ required: true, message: '食物功效不能为空', trigger: 'change' }],
        diet: [{ required: true, message: '食物营养价值不能为空', trigger: 'change' }]
      }
    }
  },

  async created() {
    if (this.$route.params.id != null) {
      await this.getFindOne()
    }
  },

  methods: {

    skipNewsList() {
      this.$router.push('/food/list')
    },

    caozuo() {
      if (this.$route.params.id != null) {
        this.updateData()
      } else {
        this.createData()
      }
    },

    // 添加食物相克
    createData() {
      this.dialogStatus = '添加'
      this.$refs['newsForm'].validate(valid => {
        if (valid) {
          this.temp.thumb = this.upload.url
          this.temp.imgUrl = this.upload.url
          create(this.temp).then(data => {
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.$router.push('/food/list')
            } else {
              return false
            }
          })
        }
      })
    },

    // 编辑时获取新闻
    getFindOne() {
      this.listLoading = true
      findOne(this.$route.params.id).then(response => {
        this.temp = response.data // copy obj
        // Just to simulate the time of the request 
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },

    // 编辑新闻
    updateData(food) {
      this.dialogStatus = '编辑'
      this.$refs['newsForm'].validate(valid => {
        this.temp.thumb = this.temp.urlThumb
        if (valid) {
          update(this.temp.id, this.temp).then(data => {
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.$router.push('/food/list')
            } else {
              return false
            }
          })
        }
      })
    },

    changeCategory(val) {
      this.temp.categoryId = val[val.length - 1]
    },

    handleAvatarSuccess(res, file) {
      this.upload.url = res.data.imgUrl
      this.temp.imgUrl = res.data.url
      this.temp.thumb = res.data.url + res.data.imgUrl
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

