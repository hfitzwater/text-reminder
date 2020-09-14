<template>
  <FormContainer>
    <cv-loading :active="loading" :overlay="true"></cv-loading>

    <ValidationObserver ref="validationObserver">
      <div @keyup.enter="signup">
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
    
          <ValidationProvider rules="required|numeric|length:10" name="Phone Number" v-slot="{ errors }">
            <cv-text-input
              :class="{
                error: hasError('Phone Number')
              }"
              ref="phoneInput"
              label="Phone Number (US only, 10 digits)"
              type="number"
              placeholder="5555555555"
              v-model="form.phoneNumber">
            </cv-text-input>
            <div class="form-error">
              {{ errors[0] }}
            </div>
          </ValidationProvider>

          <ValidationProvider rules="required|min:6" name="Password" v-slot="{ errors }">
            <cv-text-input
              :class="{
                error: hasError('Password')
              }"
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

    <template v-slot:form-buttons>
      <cv-button-set>
        <cv-button kind="secondary" @click="$router.push('/')">Back</cv-button>
        <cv-button @click="signup()" type="submit">Sign Up</cv-button>
      </cv-button-set>
    </template>

    <template v-slot:form-extra>
      Already have an account?
      <cv-link href="javascript:;" @click="$router.push('/login')">
        Login
      </cv-link>
    </template>
  </FormContainer>
</template>

<script>
import CoreClient from '../services/core';
import { USER_ACTIONS } from '../store/modules/UserStore';
import FormContainer from '../components/form-container/FormContainer';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email, numeric, min, length } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: '{_field_} is required'
});

extend('email', {
  ...email,
  message: '{_field_} must be a valid email address'
});

extend('numeric', {
  ...numeric,
  message: '{_field_} must be a valid US phone number'
});

extend('min', {
  ...min,
  message: '{_field_} must have at least 6 characters'
});

extend('length', {
  ...length,
  message: '{_field_} must be 10 digits'
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
        phoneNumber: null,
        password: null,
        passwordConfirmed: null
      };
    },
    async signup() {
      const isValid = await this.$refs.validationObserver.validate();
      if( !isValid ) return;

      this.loading = true;

      try {
        await this.$store.dispatch(USER_ACTIONS.SIGNUP, {
          email: this.form.email,
          phoneNumber: this.form.phoneNumber,
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