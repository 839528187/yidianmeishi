<template>
  <div class="createPost-container">
    <el-form ref="schoolForm" :rules="rules" :model="temp" class="form-container">

      <sticky :class-name="'sub-navbar '+postForm.status">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />-->
        <!-- <SourceUrlDropdown v-model="postForm.source_uri" />  -->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="caozuo()">提交
        </el-button>
        <!-- <el-button v-loading="loading" type="warning">草稿箱</el-button> -->
        <el-button v-loading="loading" type="info" @click="listSchool">返回列表</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="20">
            <el-form-item style="margin-bottom: 40px;" prop="schoolName">
              <MDinput v-model="temp.schoolName" :maxlength="100" value="schoolName" name="schoolName" required>
                学校名称:
              </MDinput>
            </el-form-item>

            <el-form-item style="margin-bottom: 40px;" prop="schoolName">
              <MDinput v-model="temp.address" :maxlength="100" value="address" name="address" required>
                学校地址:
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="建校时间:" prop="buildingSchoolTime" class="postInfo-container-item">
                    <el-input v-model="temp.buildingSchoolTime" size="small" style="width: 160px; margin-left: 0px;" value="buildingSchoolTime" name="buildingSchoolTime" required/>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="所属地区:" prop="areaId" class="postInfo-container-item">
                    <el-cascader :options="area" v-model="area_check" style="width: 210px; margin-left: 10px; margin-bottom:1px;" size="small" clearable placeholder="地区搜索-可以搜索地区名称" filterable @change="changeArea"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学校类别:" prop="typeId" class="postInfo-container-item">
                    <el-cascader :options="types" v-model="type_check" style="width: 210px; margin-left: 10px; margin-bottom:1px;" size="small" clearable placeholder="类型搜索-可以搜索类型名称" filterable @change="changeType"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="18">
                  <el-form-item label="办学层次" prop="schoolLevel">
                    <el-radio-group v-model="temp.schoolLevel" size="medium">
                      <el-radio border label="1">国家示范校</el-radio>
                      <el-radio border label="2">国家级重点</el-radio>
                      <el-radio border label="3">省部级重点</el-radio>
                      <el-radio border label="4">合格</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="18">
                  <el-form-item label="办学性质" prop="schoolNature">
                    <el-radio-group v-model="temp.schoolNature" size="medium">
                      <el-radio border label="1">公办</el-radio>
                      <el-radio border label="2">民办</el-radio>
                      <el-radio border label="3">企业办</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="是否推荐:" prop="isRecommend" class="postInfo-container-item">
                    <el-radio-group v-model="temp.isRecommend" size="medium">
                      <el-radio border label="1">推荐</el-radio>
                      <el-radio border label="2">不推荐</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="学校状态:" prop="status" class="postInfo-container-item">
                    <el-radio-group v-model="temp.status" size="medium">
                      <el-radio border label="2">待审核</el-radio>
                      <el-radio border label="1">发布</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <el-form-item label="学校logo:" prop="logo">
              <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :data="datas"
                :headers="uploadHeaders"
                :action="actionUrl"
                class="avatar-uploader">
                <img v-if="temp.logo" :src="temp.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
            </el-form-item>

            <div class="editor-container">
              <Tinymce ref="editor" :height="400" v-model="temp.schoolProfile" />
            </div>

          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { search } from '@/api/area'
import { create, getOne, update } from '@/api/school'
import { parent } from '@/api/type'
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput'
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'

const defaultForm = {
  status: '',
  schoolName: '', // 文章题目
  logo: '', // 文章内容
  areaId: '', // 文章摘要
  typeId: '', // 文章外链
  schoolLevel: '', // 文章图片
  schoolNature: '', // 文章图片
  isRecommend: '', // 文章图片
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

  // 数据
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      types: [],
      area: [],
      dialogStatus: '',
      actionUrl: this.uploadUrl, // 上传图片链接
      temp: {
        areaId: '',
        typeId: '',
        schoolName: '',
        logo: '',
        schoolLevel: '',
        schoolNature: '',
        isRecommend: '1',
        status: '2',
        schoolProfile: '',
        address: '',
        imgUrl: '',
        buildingSchoolTime: ''
      },
      area_check: [],
      type_check: [],

      upload: {
        imgUrl: '',
        url: ''
      },
      uploadHeaders: {
        'usertoken': getToken()
      },

      datas: {
        'location': 'school'
      },

      cateList: {
        id: '',
        cateName: ''
      },

      rules: {
        schoolName: [{ required: true, message: '学校名称不能为空', trigger: 'change' }],
        areaId: [
          { required: true, message: '地区不能为空', trigger: 'change' }
        ],
        typeId: [
          { required: true, message: '学校类型不能为空', trigger: 'change' }
        ],
        schoolLevel: [
          { required: true, message: '办学层次不能为空', trigger: 'change' }
        ],
        schoolNature: [
          { required: true, message: '办学性质不能为空', trigger: 'change' }
        ],
        logo: [
          { required: true, message: '学校logo不能为空', trigger: 'change' }
        ],
        schoolProfile: [
          { required: true, message: '学校简介不能为空', trigger: 'change' }
        ],
        buildingSchoolTime: [
          { required: true, message: '建校时间不能为空', trigger: 'change' }
        ]
      }
    }
  },

  async created() {
    if (this.$route.params.id != null) {
      await this.getFindOne()
    }
    this.getAreaList()
    this.getTypeList()
  },

  // 方法
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      this.upload.url = res.data.imgUrl
      this.temp.imgUrl = res.data.imgUrl
      this.temp.logo = res.data.url + res.data.imgUrl
      // this.upload.imgUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$msg.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },

    // 根据id查询学校详情
    async getFindOne() {
      try {
        var data = await getOne(this.$route.params.id)
        this.temp = data.data
        this.temp.isRecommend = JSON.stringify(this.temp.isRecommend)
        this.temp.status = JSON.stringify(this.temp.status)
        this.temp.schoolLevel = JSON.stringify(this.temp.schoolLevel)
        this.temp.schoolNature = JSON.stringify(this.temp.schoolNature)
      } catch (error) {
        console.log(error)
      }
    },

    listSchool() {
      this.$router.push('/school/list')
    },

    changeArea(val) {
      this.temp.areaId = val[val.length - 1]
    },

    changeType(val) {
      this.temp.typeId = val[val.length - 1]
    },

    // 地区筛选
    async getAreaList() {
      var data = await search()
      this.area = data.data
      this.area.forEach(e => {
        if (e.value === this.temp.areaId) {
          this.area_check = [e.value]
        } else if (e.children) {
          e.children.forEach(i => {
            if (i.value === this.temp.areaId) {
              this.area_check = [e.value, i.value]
            }
          })
        }
      })
    },

    caozuo() {
      if (this.$route.params.id != null) {
        this.changeUpdate()
      } else {
        this.changeCreate()
      }
    },

    // 添加学校
    changeCreate() {
      this.$refs['schoolForm'].validate(valid => {
        if (valid) {
          this.temp.logo = this.upload.url
          this.temp.imgUrl = this.upload.url
          create(this.temp).then(data => {
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.$router.push('/school/list')
            }
          })
        }
      })
    },

    // 编辑学校
    changeUpdate() {
      this.$refs['schoolForm'].validate(valid => {
        if (valid) {
          this.temp.logo = this.temp.imgUrl
          update(this.temp.id, this.temp).then(data => {
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.$router.push('/school/list')
            }
          })
        }
      })
    },

    // 类型筛选
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
        this.types.forEach(u => {
          if (u.value === this.temp.typeId) {
            this.type_check = [u.value]
          } else if (u.children) {
            u.children.forEach(p => {
              if (p.value === this.temp.typeId) {
                this.type_check = [u.value, p.value]
              } else if (p.children) {
                p.children.forEach(k => {
                  if (k.value === this.temp.typeId) {
                    this.type_check = [u.value, p.value, k.value]
                  }
                })
              }
            })
          }
        })
      } catch (error) {
        console.log(error)
      }
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

