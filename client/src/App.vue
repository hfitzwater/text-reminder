<template>
  <div>
    <cv-content id="#main-content">
      <router-view/>
    </cv-content>
    <footer>
       <cv-link href="javascript:;"> Contact </cv-link> | <cv-link href="javascript:;"> Terms </cv-link> | <cv-link href="javascript:;"> Privacy Policy </cv-link> | © 2020 Text <strong>Reminder</strong>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {}
}
</script>

<style lang="scss">
  .margin-auto {
    margin: auto;
  }

  .form-error {
    margin-bottom: 10px;
    color: lightcoral;
    padding: 4px;
    font-size: 0.9em;
  }
  
  footer {
    text-align: center;
    box-sizing: border-box;
    padding: 8px !important;
    width: 100%;
    position: absolute;
    bottom: 0px;
  }

  .cv-button-set {
    .cv-button {
      width: 50% !important;
      max-width: 100% !important;
    }
  }

  .bx--form-item {
    &.error {
      .bx--text-input__field-wrapper {
        input {
          border-bottom: 1px solid lightcoral !important;
        }
        
      }
    }
  }
</style>
