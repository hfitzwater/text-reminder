<template>
  <FormContainer>
    <cv-loading :active="loading" :overlay="true"></cv-loading>

    <div>
      Enter the email address for your Text <strong>Reminder</strong> account.
    </div>
    <br>
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
        </cv-form>
      </div>
    </ValidationObserver>

    <template v-slot:form-buttons>
      <cv-button-set>
        <cv-button kind="secondary" @click="$router.push('/login')">Back</cv-button>
        <cv-button @click="send()">Continue</cv-button>
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
  name: 'ForgotPassword',
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
        email: null
      };
    },
    async send() {
      const isValid = await this.$refs.validationObserver.validate();
      if( !isValid ) return;

      this.loading = true;

      try {
        const result = await CoreClient.forgotPassword(this.form.email);
        this.$router.push('/reset-password-sent');
      } catch( ex ) {
        console.error(ex);
      }

      this.loading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
  .cv-button-set {
    .cv-button {
      width: 50%;
      max-width: 100%;
    }
  }
</style>