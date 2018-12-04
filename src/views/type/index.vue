<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" type="primary" plain @click="handleCreate">添加类别</el-button>
      <el-cascader
        :options="parentType"
        style="width: 300px; margin-left: 10px; margin-bottom:1px;"
        size="small"
        change-on-select
        clearable
        placeholder="类型搜索-可以搜索类型名称"
        filterable
        @change="changeParentSecah"/>
      <el-input v-model="listQuery.keyword" clearable size="small" placeholder="请输入名称" style="width: 210px; margin-left: 10px; margin-bottom:1px;" class="filter-item" @blur="getList" @clear="getList"/>
      <!-- <el-button size="small" type="primary" style="margin-left: 10px; margin-bottom:1px;" plain @click="getList">搜索</el-button> -->
    </div>

    <div style="margin-bottom:1px"/>
    <!-- 表格数据 -->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="id" prop="id" align="center" width="60px"/>
      <el-table-column label="类别名称" prop="name" align="center"/>
      <el-table-column label="上级类别" prop="parentName" align="center"/>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '停用' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column label="是否有下级" prop="isChild" align="center">
        <template slot-scope="scope">
          {{ scope.row.isChild == 2 ? '没有' : '有' }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createdAt" align="center"/>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button size="small" type="text" circle @click="handleUpdate(scope.row,scope.row.id)">编辑</el-button>
            <el-button size="small" type="text" style="margin-left: 0px; margin-bottom:1px;" circle @click="deleteData(scope.row.id)">删除</el-button>
            <el-dropdown szie="small" style="margin-left: 0px; margin-bottom:1px;">
              <el-button :disabled="scope.row.disableds" type="text" size="small">
                更多<i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item type split-button @click.native="changeIntroduce(scope.row.id)">专业介绍</el-dropdown-item>
                <el-dropdown-item type split-button divided @click.native="changeCourse(scope.row.id)">专业课程</el-dropdown-item>
                <el-dropdown-item type split-button divided @click.native="changeProspect(scope.row.id)">就业前景</el-dropdown-item>
                <el-dropdown-item type split-button divided @click.native="changeDirection(scope.row.id)"> 就业方向</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="上级类别" prop="praentId">
          <el-cascader
            :options="parentType"
            v-model="type_check"
            style="width: 300px; margin-left: 10px; margin-bottom:1px;"
            size="small"
            change-on-select
            clearable
            placeholder="类型搜索-可以搜索类型名称"
            filterable
            @change="changeParentType"/>
        </el-form-item>

        <el-form-item label="是否有下级" prop="isChild" label-width="98px">
          <div style="margin-top: 0px">
            <el-radio-group v-model="temp.isChild" size="small">
              <el-radio border label="1">有</el-radio>
              <el-radio border label="2">没有</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item label="类别名称" prop="name">
          <el-input v-model="temp.name" value="name" placeholder="类别名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='添加类别'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>

    <!--专业介绍-->
    <div v-if="introduceFormVisible">
      <el-dialog :visible.sync="introduceFormVisible" title="专业介绍" style="width: 100%; margin-left: auto; margin-right: auto;">
        <el-form ref="introduceForm" :model="mapping" label-position="left" label-width="0px" style="width: 90%; margin-left:50px;">
          <el-form-item prop="introduce">
            <div class="editor-container">
              <Tinymce ref="editor" :height="200" :with="200" v-model="mapping.introduce" style="line-height: 29px;" />
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ChangeCancel">取消</el-button>
          <el-button type="primary" @click="introduceOperation()">提交</el-button>
        </div>
      </el-dialog>
    </div>

    <!--专业课程-->
    <div v-if="courseFormVisible">
      <el-dialog :visible.sync="courseFormVisible" title="专业课程" style="width: 100%; margin-left: auto; margin-right: auto;">
        <el-form ref="courseForm" :model="mapping" label-position="left" label-width="0px" style="width: 90%; margin-left:50px;">
          <el-form-item prop="course">
            <div class="editor-container">
              <Tinymce ref="editor" :height="200" :with="200" v-model="mapping.course" style="line-height: 29px;" />
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ChangeCancel">取消</el-button>
          <el-button type="primary" @click="courseOperation()">提交</el-button>
        </div>
      </el-dialog>
    </div>

    <!--就业前景-->
    <div v-if="prospectFormVisible">
      <el-dialog :visible.sync="prospectFormVisible" title="就业前景" style="width: 100%; margin-left: auto; margin-right: auto;">
        <el-form ref="prospectForm" :model="mapping" label-position="left" label-width="0px" style="width: 90%; margin-left:50px;">
          <el-form-item prop="prospect">
            <div class="editor-container">
              <Tinymce ref="editor" :height="200" :with="200" v-model="mapping.prospect" style="line-height: 29px;" />
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ChangeCancel">取消</el-button>
          <el-button type="primary" @click="prospectOperation()">提交</el-button>
        </div>
      </el-dialog>
    </div>

    <!--就业方向-->
    <div v-if="directionFormVisible">
      <el-dialog :visible.sync="directionFormVisible" title="就业方向" style="width: 100%; margin-left: auto; margin-right: auto;">
        <el-form ref="directionForm" :model="mapping" label-position="left" label-width="0px" style="width: 90%; margin-left:50px;">
          <el-form-item prop="direction">
            <div class="editor-container">
              <Tinymce ref="editor" :height="200" :with="200" v-model="mapping.direction" style="line-height: 29px;" />
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ChangeCancel">取消</el-button>
          <el-button type="primary" @click="directionOperation()">提交</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { list, parent, create, update, deletes } from '@/api/type'
import { typeIntroduce, typeCourse, typeProspect, typeDirection, getOne } from '@/api/typeMapping'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },

  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      options: null,
      dialogStatus: '',
      dialogFormVisible: false,
      introduceFormVisible: false,
      courseFormVisible: false,
      prospectFormVisible: false,
      directionFormVisible: false,
      parentType: [],
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        parentId: ''
      },
      temp: {
        id: '',
        name: '',
        praentId: '',
        status: '',
        createdAt: '',
        parentName: '',
        isChild: '2'
      },

      mapping: {
        id: '',
        typeId: '',
        introduce: '',
        course: '',
        prospect: '',
        direction: ''
      },

      type_check: [],
      rules: {
        name: [
          { required: true, message: '地区名称不能为空', trigger: 'change' }
        ]
      }
    }
  },

  async created() {
    await this.getList()
    this.getParent()
  },

  methods: {
    // 获取列表
    async getList() {
      this.listLoading = true
      try {
        var response = await list(this.listQuery)
        this.list = response.data.data
        this.total = response.data.pageSize
        // Just to simulate the time of the request
        if (this.list != null && this.list.length > 0) {
          this.list.forEach(e => {
            if (e.isChild === 2) {
              e.disableds = false
            } else {
              e.disableds = true
            }
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      } catch (error) {
        return
      }
    },

    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        praentId: '',
        isChild: '2'
      }
    },

    // 查询所有父级学校类别
    getParent() {
      parent().then(data => {
        data.data.unshift({ label: '顶级类别', value: 0 })
        data.data.forEach(e => {
          if (e.children && e.children.length > 0) {
            e.children.forEach(i => {
              if (i.children && i.children.length <= 0) {
                delete i.children
              }
            })
          } else {
            delete e.children
          }
        })
        this.parentType = data.data
      }).catch(() => {

      })
    },

    changeParentType(val) {
      this.temp.praentId = val[val.length - 1]
    },

    changeParentSecah(val) {
      this.listQuery.parentId = val[val.length - 1]
      this.getList()
    },

    resetTemps() {
      this.mapping = {
        id: '',
        typeId: '',
        introduce: '',
        course: '',
        prospect: '',
        direction: ''
      }
    },

    ChangeCancel() {
      this.introduceFormVisible = false
      this.resetTemps()
    },

    async getFindOne(id) {
      try {
        var data = await getOne(id)
        this.mapping = data.data
        this.mapping.typeId = id
      } catch (error) {
        console.log(error)
      }
    },

    // 专业介绍
    changeIntroduce(id) {
      this.mapping.typeId = id
      this.getFindOne(id)
      this.introduceFormVisible = true
      this.$nextTick(() => {
        this.$refs['introduceForm'].clearValidate()
      })
    },

    async introduceOperation() {
      try {
        console.log(this.mapping.typeId)
        var data = await typeIntroduce(this.mapping)
        this.introduceFormVisible = false
        if (data.code === 200) {
          this.$message({
            type: 'success',
            message: data.msg
          })
        }
        this.getList()
      } catch (error) {
        console.log(error)
      }
    },

    // 专业课程
    changeCourse(id) {
      this.getFindOne(id)
      this.mapping.typeId = id
      this.courseFormVisible = true
      this.$nextTick(() => {
        this.$refs['courseForm'].clearValidate()
      })
    },

    async courseOperation() {
      try {
        var data = await typeCourse(this.mapping)
        this.courseFormVisible = false
        if (data.code === 200) {
          this.$message({
            type: 'success',
            message: data.msg
          })
        }
        this.getList()
      } catch (error) {
        console.log(error)
      }
    },

    // 就业前景
    changeProspect(id) {
      this.getFindOne(id)
      this.mapping.typeId = id
      this.prospectFormVisible = true
      this.$nextTick(() => {
        this.$refs['prospectForm'].clearValidate()
      })
    },

    async prospectOperation() {
      try {
        var data = await typeProspect(this.mapping)
        this.prospectFormVisible = false
        if (data.code === 200) {
          this.$message({
            type: 'success',
            message: data.msg
          })
        }
        this.getList()
      } catch (error) {
        console.log(error)
      }
    },

    // 就业方向
    changeDirection(id) {
      this.getFindOne(id)
      this.mapping.typeId = id
      this.directionFormVisible = true
      this.$nextTick(() => {
        this.$refs['directionForm'].clearValidate()
      })
    },

    async directionOperation() {
      try {
        var data = await typeDirection(this.mapping)
        this.directionFormVisible = false
        if (data.code === 200) {
          this.$message({
            type: 'success',
            message: data.msg
          })
        }
        this.getList()
      } catch (error) {
        console.log(error)
      }
    },

    // 添加类别
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '添加类别'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          create(this.temp).then(data => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            if (data.code === 200) {
              this.$message({
                type: 'success',
                message: data.msg
              })
              this.getList()
              this.getParent()
            } else {
              return false
            }
          })
        }
      })
    },

    // 编辑类别
    handleUpdate(row) {
      this.parentType.forEach(m => {
        if (m.value === row.praentId) {
          this.type_check = [m.value]
        } else if (m.children) {
          m.children.forEach(h => {
            if (h.value === row.praentId) {
              this.type_check = [m.value, h.value]
            } else if (h.children) {
              h.children.forEach(j => {
                if (j.value === row.praentId) {
                  this.type_check = [m.value, h.value, j.value]
                }
              })
            }
          })
        }
      })
      this.temp = Object.assign({}, row) // copy obj
      this.temp.isChild = JSON.stringify(this.temp.isChild)
      this.dialogStatus = '编辑类别'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm']
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // this.temp.isChild = isChild
          update(this.temp, this.temp.id).then(data => {
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

    // 删除类别
    deleteData(id) {
      this.$confirm('此操作将删除该类别吗, 是否继续?', '提示', {
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

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
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
