<template>
  <FormContainer>
    <div>
      Great! Your password has been reset. You can go ahead and login with your new password.
    </div>

    <template v-slot:form-extra>
      <cv-link href="javascript:;" @click="$router.push('/login')">
        Login
      </cv-link>
    </template>
  </FormContainer>
</template>

<script>
import FormContainer from '../components/form-container/FormContainer';

export default {
  name: 'PasswordResetSuccess',
  components: {
    FormContainer
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>