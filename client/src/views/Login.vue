<template>
  <FormContainer>
    <cv-loading :active="loading" :overlay="true"></cv-loading>

    <ValidationObserver ref="validationObserver">
      <div @keyup.enter="login">
        <cv-form>
          <ValidationProvider rules="required|email" name="Email Address" v-slot="{ errors }">
            <cv-text-input
              :class="{
                error: hasError('Email Address')
              }"
              v-focus
              ref="emailInput"
              label="Email Address"
              placeholder="example@host.com"
              v-model="form.email">
            </cv-text-input>
            <div class="form-error">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
          
          <ValidationProvider rules="required" name="Password" v-slot="{ errors }">
            <cv-text-input
              :class="{
                error: hasError('Password')
              }"
              ref="passwordInput"
              label="Password"
              type="password"
              v-model="form.password">
            </cv-text-input>
            <div class="form-error">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </cv-form>
      </div>
    </ValidationObserver>

    <template v-slot:form-buttons>
      <cv-button-set>
        <cv-button kind="secondary" @click="$router.push('/')">Back</cv-button>
        <cv-button @click="login()">Login</cv-button>
      </cv-button-set>
    </template>

    <template v-slot:form-extra>
      <div>
        Don't have an account?
        <cv-link @click="$router.push('/signup')" href="javascript:;">
          Signup
        </cv-link>
      </div>
      <br>
      <div>
        <cv-link @click="$router.push('/forgot-password')" href="javascript:;">
          Forgot Password
        </cv-link>
      </div>
    </template>
  </FormContainer>
</template>

<script>
import CoreClient from '../services/core';
import { USER_ACTIONS } from '../store/modules/UserStore';
import FormContainer from '../components/form-container/FormContainer';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: '{_field_} is required'
});

extend('email', {
  ...email,
  message: '{_field_} must be a valid email address'
});

export default {
  name: 'Login',
  components: {
    FormContainer,
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      form: this.getEmptyForm(),
      loading: false
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
        email: null,
        password: null
      };
    },
    async login() {
      const isValid = await this.$refs.validationObserver.validate();
      if( !isValid ) return;

      this.loading = true;

      try {
        await this.$store.dispatch(USER_ACTIONS.LOGIN, {
          email: this.form.email,
          password: this.form.password
        });

        this.$router.push('reminders');
      } catch( ex ) {
        console.error( ex );
      }

      this.loading = false;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>