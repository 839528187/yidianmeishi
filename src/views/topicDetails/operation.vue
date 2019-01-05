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
            <el-form-item style="margin-bottom: 40px;" prop="shortTitle">
              <MDinput v-model="temp.shortTitle" :maxlength="100" value="shortTitle" name="name" required>
                专题菜品短标题
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="temp.title" :maxlength="100" placeholder="专题seo标题" value="title" name="name" required>
                菜品标题
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="keyword">
              <MDinput v-model="temp.keyword" :maxlength="100" placeholder="每个关键词用空格隔开" value="keyword" name="name" required>
                关键词
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="bannerColor">
              <MDinput v-model="temp.bannerColor" :maxlength="100" placeholder="每个关键词用空格隔开" value="bannerColor" name="name" required>
                专题banner底层色
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="description">
              描述:
              <el-input type="textarea" :rows="5" placeholder="专题seo描述" v-model="temp.description" label="专题seo描述" name="name" required></el-input>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="9">
                  <el-form-item label="所属专题:" prop="topicId" class="postInfo-container-item">
                    <el-cascader :options="topic" v-model="topic_check" style="width: 210px; margin-left: 10px; margin-bottom:1px;" size="small" clearable placeholder="专题搜索-可以搜索专题名称" filterable @change="changeTopic"/>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="美食热度:" prop="heat" class="postInfo-container-item">
                    <el-rate v-model="temp.heat" void-color="#dc143c" :colors="['#dc143c', '#dc143c', '#dc143c']" style="line-height: 2.6;"></el-rate>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="9">
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
                </el-col>
              </el-row>
            </div>

            <div class="editor-container">
              专题底层饮食文化:

              <Tinymce ref="editor" :height="600" :with="400" v-model="temp.culture" />
            </div>

            <div class="editor-container">
              专题底层做法:

              <Tinymce ref="editor" :height="600" :with="400" v-model="temp.practice" />
            </div>

            <div class="editor-container">
              专题底层功效:

              <Tinymce ref="editor" :height="600" :with="400" v-model="temp.efficacy" />
            </div>
              专题底层相克:

            <div class="editor-container">
              <Tinymce ref="editor" :height="600" :with="400" v-model="temp.phase" />
            </div>
              专题底层营养价值:

            <div class="editor-container">
              <Tinymce ref="editor" :height="600" :with="400" v-model="temp.nutritional" />
            </div>
          </el-col>
        </el-row>
      </div>

    </el-form>
  </div>
</template>

<script>
import { create, findOne, update } from '@/api/topicDetails'
import { seach } from '@/api/topic'
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput'
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'

const defaultForm = {
  topicId: '',
  shortTitle: '',
  title: '',
  keyword: '',
  description: '',
  thumb:'',
  heat:'',
  culture:'',
  practice:'',
  efficacy:'',
  phase:'',
  nutritional:'',
  bannerColor:'',
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  components: { MDinput, Sticky, Tinymce},

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
      topic: [],
      actionUrl: this.uploadUrl, // 上传图片链接
      temp: {
        id: '',
        topicId: '',
        shortTitle: '',
        title: '',
        keyword: '',
        description: '',
        thumb:'',
        heat:0,
        culture:'',
        practice:'',
        efficacy:'',
        phase:'',
        nutritional:'',
        urlThumb:'',
        bannerColor:''
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

      topic_check: [],

      rules: {
        topicId: [{ required: true, message: '所属专题id不能为空', trigger: 'change' }],
        shortTitle: [{ required: true, message: '专题菜品短标题不能为空', trigger: 'change' }],
        title: [{ required: true, message: '专题标题不能为空', trigger: 'change' }],
        keyword: [{ required: true, message: '关键词不能为空', trigger: 'change' }],
        description: [{ required: true, message: '描述不能为空', trigger: 'change' }],
        thumb: [{ required: true, message: '缩略图不能为空', trigger: 'change' }],
        heat: [{ required: true, message: '美食热度不能为空', trigger: 'change' }],
        culture: [{ required: true, message: '饮食文化不能为空', trigger: 'change' }],
        practice: [{ required: true, message: '做法不能为空', trigger: 'change' }],
        efficacy: [{ required: true, message: '功效不能为空', trigger: 'change' }],
        phase: [{ required: true, message: '相克不能为空', trigger: 'change' }],
        nutritional: [{ required: true, message: '营养价值不能为空', trigger: 'change' }],
        bannerColor: [{ required: true, message: 'banner底色不能为空', trigger: 'change' }],
      }
    }
  },

  async created() {
    if (this.$route.params.id != null) {
      await this.getFindOne()
    } else {
      this.getTopicSearch()
    }
  },

  methods: {

    skipNewsList() {
      this.$router.push('/topicDetails/list')
    },

    // 查询专题
    getTopicSearch() {
      seach().then(data => {
        this.topic = data.data
        this.topic.forEach(e => {
          if(e.value === this.temp.topicId) {
              this.topic_check = [e.value]
          }
        })
      })
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
          this.temp.thumb = this.temp.urlThumb
          create(this.temp).then(data => {
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.$router.push('/topicDetails/list')
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
        // Just to simulate the time of the request 
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
        this.getTopicSearch()
      })
    },

    // 编辑专题
    updateData(food) {
      this.dialogStatus = '编辑'
      this.$refs['topicForm'].validate(valid => {
        this.temp.thumb = this.temp.urlThumb
        if (valid) {
          update(this.temp.id, this.temp).then(data => {
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.$router.push('/topicDetails/list')
            } else {
              return false
            }
          })
        }
      })
    },

    changeTopic(val) {
      this.temp.topicId = val[val.length - 1]
    },

    handleAvatarSuccess(res, file) {
      this.upload.url = res.data.url
      this.temp.imgUrl = res.data.imgUrl
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

