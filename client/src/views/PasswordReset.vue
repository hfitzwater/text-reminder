<template>
  <FormContainer>
    <div>
      Set a new password for you Text <strong>Reminder</strong> account.
    </div>

    <br>

    <ValidationObserver ref="validationObserver">
      <div @keyup.enter="login">
        <cv-form>
          <ValidationProvider rules="required|min:6" name="Password" v-slot="{ errors }">
            <cv-text-input
              :class="{
                error: hasError('Password')
              }"
              v-focus
              label="Password"
              type="password"
              placeholder="Must have at least 6 characters"
              v-model="form.password">
            </cv-text-input>
            <div class="form-error">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
      
          <ValidationProvider rules="required|min:6" name="Password Confirmation" v-slot="{ errors }">
            <cv-text-input
              :class="{
                error: hasError('Password Confirmation')
              }"
              ref="confirmInput"
              label="Confirm Password"
              type="password"
              placeholder="Must have at least 6 characters"
              v-model="form.passwordConfirmed">
            </cv-text-input>
            <div class="form-error">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </cv-form>
      </div>
    </ValidationObserver>

    <template v-slot:form-extra>
      <cv-button-set>
        <cv-button kind="secondary" @click="$router.push('/login')">Back</cv-button>
        <cv-button @click="reset()">Reset</cv-button>
      </cv-button-set>
    </template>
  </FormContainer>
</template>

<script>
import CoreClient from '../services/core';
import { USER_ACTIONS } from '../store/modules/UserStore';
import FormContainer from '../components/form-container/FormContainer';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, min } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: '{_field_} is required'
});

extend('min', {
  ...min,
  message: '{_field_} must be at least 6 characters'
});

export default {
  name: 'PasswordReset',
  components: {
    FormContainer,
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      form: this.getEmptyForm()
    };
  },
  computed: {
    hasError() {
      const vm = this;
      return (key) => {
        const errors = vm.$refs.validationObserver
          ? vm.$refs.validationObserver.errors
          : null;
        return errors && errors[key] && errors[key].length;
      };
    },
  },
  methods: {
    getEmptyForm() {
      return {
        password: null,
        passwordConfirmed: null
      };
    },
    async reset() {
      const isValid = await this.$refs.validationObserver.validate();
      if( !isValid ) return;

      try {
        const result = await CoreClient.resetPassword(this.form.password, this.$route.query.code);
        this.$router.push('/reset-password-success');
      } catch( ex ) {
        console.error(ex);
      }      
    }
  }
}
</script>

<style lang="scss" scoped>

</style>