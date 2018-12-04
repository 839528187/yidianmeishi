<template>
  <div class="dashboard-container">
    <el-row>
        <el-button :loading="loading" type="success" @click="getWebRedis()">更新主页缓存</el-button>
        <el-button :loading="loading" type="success" @click="getWebType()">更新类别缓存</el-button>
        <el-button :loading="loading" type="success" @click="getWebArea()">更新地区缓存</el-button>
</el-row>
  </div>
</template>

<script>
import { webRedis, webType, webArea } from '@/api/index'
export default {
    data() {
        return {
            loading: false,
        }
    },

    methods: {
        async getWebRedis() {
            try {
                this.loading = true
                var data = await webRedis()
                if(data.code === 200) {
                    this.loading = false
                    this.$message({
                        type: 'success',
                        message: data.msg
                    })
                }
            } catch (error) {
                console.log(error)
            }
        },

        async getWebType() {
            try {
                this.loading = true
                var data = await webType()
                if(data.code === 200) {
                    this.loading = false
                    this.$message({
                        type: 'success',
                        message: data.msg
                    })
                }
            } catch (error) {
                console.log(error)
            }
        },

        async getWebArea() {
            try {
                this.loading = true
                var data = await webArea()
                if(data.code === 200) {
                    this.loading = false
                    this.$message({
                        type: 'success',
                        message: data.msg
                    })
                }
            } catch (error) {
                console.log(error)
            }
        },
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