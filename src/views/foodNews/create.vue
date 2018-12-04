<template>
  <div class="createPost-container">
    <el-form ref="newsForm" :rules="rules" :model="temp" class="form-container">

      <sticky :class-name="'sub-navbar '+postForm.status">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />-->
        <!-- <SourceUrlDropdown v-model="postForm.source_uri" />  -->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="caozuo()">提交
        </el-button>
        <el-button v-loading="loading" type="warning">草稿箱</el-button>
        <el-button v-loading="loading" type="info" @click="listFood()">返回列表</el-button>
      </sticky>

    <div class="createPost-main-container">
      <el-row>
        <el-col :span="18">
          <el-form-item style="margin-bottom: 40px;" prop="title">
            <MDinput v-model="temp.title" :maxlength="100" value="title" name="name" required>
              标题
            </MDinput>
          </el-form-item>  

          <div class="postInfo-container">
            <el-row>
              <el-col :span="8">
                <el-form-item label-width="60px" label="作者:" prop="author" class="postInfo-container-item">
                  <el-input v-model="temp.author" placeholder="作者" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label-width="80px" label="分类:" prop="cateId" class="postInfo-container-item">
                  <el-select v-model="temp.cateId" placeholder="请选择分类">
                    <el-option v-for="lo in cateList" :label="lo.cateName" :value="lo.id" :key="lo.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              </el-row>
          </div> 

          <el-form-item prop="keywords">
            <MDinput v-model="temp.keywords" :maxlength="100" name="name" required>
              关键词
            </MDinput>
            <!-- <el-input v-model="temp.keywords" placeholder="每个关键词用逗号隔开" style="width: 600px"/> -->
          </el-form-item>


          <el-form-item label="缩略图:" prop="thumb">
            <el-upload
              class="avatar-uploader"
              action="http://api.meishiadd.com/v1/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="temp.thumb" :src="temp.thumb" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item style="margin-bottom: 40px;" label-width="60px" label="摘要:" prop="description">
            <el-input :rows="1" v-model="temp.description" type="textarea" class="article-textarea" placeholder="输入摘要"/>
            <span class="word-counter">{{ temp.description.length }}字</span>
          </el-form-item>

          <div class="editor-container">
            <Tinymce ref="editor" :height="400" v-model="temp.content" />
          </div>


        </el-col>
      </el-row>
    </div>
    </el-form>
  </div>    
</template>

<script>
import { create, findone, update } from "@/api/foodNews";
import { list } from "@/api/category";
import Sticky from "@/components/Sticky"; // 粘性header组件
import MDinput from "@/components/MDinput";
import Tinymce from "@/components/Tinymce";

const defaultForm = {
  status: "draft",
  title: "", // 文章题目
  content: "", // 文章内容
  content_short: "", // 文章摘要
  source_uri: "", // 文章外链
  image_uri: "", // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ["a-platform"],
  comment_disabled: false,
  importance: 0
};

export default {
  components: { MDinput, Sticky, Tinymce },

  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  created() {
    this.getCateList();
    if(this.$route.params.id != null) {
      this.getFindOne();
    }
  },

  //数据
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      dialogStatus: "",
      temp: {
        cateId: "",
        title: "",
        cateName: "",
        content: "",
        thumb: "",
        author: "",
        keywords: "",
        description: "",
        visitId: "",
        imgUrl: ""
      },

      upload: {
        imgUrl: "",
        url: ""
      },

      cateList: {
        id: "",
        cateName: ""
      },

      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "change" }],
        cateName: [
          { required: true, message: "分类必须选择", trigger: "change" }
        ],
        author: [
          { required: true, message: "作者不能为空", trigger: "change" }
        ],
        keywords: [
          { required: true, message: "关键词不能为空", trigger: "change" }
        ],
        description: [
          { required: true, message: "描述不能为空", trigger: "change" }
        ]
      }
    };
  },

  //方法
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(res,file)
      this.upload.url = res.data.imgUrl
      this.temp.imgUrl = res.data.url
      this.temp.thumb = res.data.url + res.data.imgUrl
      const location = "news";
      // this.upload.imgUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$msg.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },

    listFood() {
      this.$router.push("/foodNews/list");
    },

    //获取分类
    getCateList() {
      this.listLoading = true;
      list().then(response => {
        this.cateList = response.data.data;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 200);
      });
    },

    //编辑时获取新闻
    getFindOne() {
      this.listLoading = true;
      findone(this.$route.params.id).then(response => {
        this.temp = response.data; // copy obj
        // Just to simulate the time of the request
        setTimeout(() => {
          
          this.listLoading = false;
        }, 1.5 * 200);
      });
    },

    caozuo() {
    if(this.$route.params.id != null) {
      this.updateData();
    }else {
      this.createData();
    }
  },

    //添加新闻
    createData() {
      this.dialogStatus = "添加";
      this.$refs["newsForm"].validate(valid => {
        if (valid) {
          this.temp.thumb = this.upload.url;
          this.temp.imgUrl = this.upload.url;
          create(this.temp).then(data => {
            if (data.code == 200) {
              this.$notify({
                message: data.msg,
                type: "success"
              });
              this.$router.push("/foodNews/list");
            } else {
              return false;
            }
          });
        }
      });
    },

    //编辑新闻
    updateData(food) {
      this.dialogStatus = "编辑";
      this.$refs["newsForm"].validate(valid => {
        if (valid) {
          update(this.temp.visitId,this.temp).then(data => {
            if (data.code == 200) {
              this.$notify({
                message: data.msg,
                type: "success"
              });
              this.$router.push("/foodNews/list");
            } else {
              return false;
            }
          });
        }
      });
    }
  }
};
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

