<template>
  <FormContainer>
    <div>
      Ok. Check your email for the next steps to reset your password. 
    </div>

    <template v-slot:form-extra>
      <cv-link href="javascript:;" @click="$router.push('/')">
        Back
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