<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--添加角色按钮区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="rolesDialog= true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表-->
      <el-table :data="roleList" border stripe>
        <!-- 展开列-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bdbottom',i1===0 ? 'bdbottom' : '','vcenter']" v-for="(item1,i1) in scope.row.children"
                    :key="item1.id">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--通过for循环 嵌套二级权限-->
                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" @close="removeRightById(scope.row,item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="removeRightById(scope.row,item3.id)" closable type="warning"
                            v-for="(item3,i3) in item2.children"
                            :key="item3.id">
                      {{ item3.authName }}
                    </el-tag>

                  </el-col>
                </el-row>
              </el-col>
            </el-row>

          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="showRolesEditDialog(scope.row.id)">修改
            </el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeRolesById(scope.row.id)">删除
            </el-button>
            <!--分配角色按钮-->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">
              分配角色
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加角色对话框-->
    <el-dialog
        title="添加角色"
        :visible.sync="rolesDialog"
        width="30%">
      <el-form ref="addRolesRef" :model="addRolesForm" label-width="80px" :rules="addRolesRules">
        <el-form-item label="角色姓名" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="closeAddRoles">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
    </el-dialog>

    <!--修改角色对话框-->
    <el-dialog
        title="修改角色对话框"
        :visible.sync="changeRolesDialog"
        width="30%">
      <el-form ref="addRolesRef" :model="changeRolesForm" label-width="80px" :rules="addRolesRules">
        <el-form-item label="角色姓名" prop="roleName">
          <el-input v-model="changeRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="changeRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="changeRolesDialog = false">取 消</el-button>
    <el-button type="primary" @click="changeRoles">确 定</el-button>
  </span>
    </el-dialog>

    <!--分配权限对话框-->
    <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
    >
      <!--树形空间-->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
               :default-checked-keys="defKeys" ref="treeRef">

      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      //  所有角色的列表数据
      roleList: [],
      //  添加角色对话框是否开启
      rolesDialog: false,
      // 添加角色列表
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      //  添加角色列表规则
      addRolesRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ]
      },
      // 修改角色对话框是否开启
      changeRolesDialog: false,
      //  修改角色的数据列表
      changeRolesForm: {
        roleName: '',
        roleDesc: '',
      },
      //  查询到的用户信息
      editForm: {},
      //  是否展示分配权限的对话框
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的id值
      defKeys: [],
      // 即将分配权限的角色id
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色
    async getRolesList() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.roleList = res.data

    },
    // 关闭添加角色对话框
    closeAddRoles() {
      this.rolesDialog = false
      this.$refs.addRolesRef.resetFields()
    },
    // 添加角色
    addRoles() {
      this.$refs.addRolesRef.validate(async (valid) => {
        if (valid) {
          this.rolesDialog = false
          const {data: res} = await this.$http.post('roles', this.addRolesForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          } else {
            this.$message.success('添加角色成功')
            await this.getRolesList()
          }

        } else {
          this.$message.error('不符合要求，请重新输入')
          this.$refs.addRolesRef.resetFields()
        }
      });
    },
    // 打开角色对话框
    async showRolesEditDialog(id) {
      this.changeRolesDialog = true
      const {data: res} = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户数据失败')
      this.editForm = res.data

    },
    // 修改角色
    async changeRoles() {
      const {data: res} = await this.$http.put('roles/' + this.editForm.roleId, this.changeRolesForm)
      if (res.meta.status !== 200) return this.$message.error('修改角色失败')
      this.$message.success('修改成功')
      await this.getRolesList()
      this.changeRolesDialog = false
    },
    // 删除角色
    async removeRolesById(id) {
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果用户确认删除则返回字符串
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      } else {
        const {data: res} = await this.$http.delete('roles/' + id)

        if (res.meta.status !== 200) return this.$message.error('删除失败')
        await this.getRolesList()
        return this.$message.info('删除成功')
      }

      // await this.$http.delete('roles/' + id)
    },
    // 根据id删除对应的权限
    async removeRightById(rode, rightId) {

      // 弹框提示用户是否删除
      const result = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      if (result !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const {data: res} = await this.$http.delete(`roles/${rode.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // await this.getRolesList()
      rode.children = res.data
    },
    //  展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id

      // 获取所有权限数据
      const {data: res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限数据失败')

      // 把获取到的权限数据保存到data中
      this.rightsList = res.data

      this.setRightDialogVisible = true
    },
    //  监听分配限权
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      await this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style scoped lang="less">
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eeeeee;
}

.bdbottom {
  border-bottom: 1px solid #eeeeee;
}

.vcenter {
  display: flex;
  align-items: center;
}


</style>