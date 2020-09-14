<template>
  <div class="margin-auto form">
    <h2>
      Text <strong>Reminder</strong>
    </h2>
    <div class="form-content">
      <slot>
        <!-- Main Content -->
      </slot>
      <div class="form-buttons">
        <slot name="form-buttons">
            <!-- Actoin Buttons -->
        </slot>
      </div>
      <div class="form-extra">
        <slot name="form-extra">
          <!-- Special Actions -->
        </slot>
      </div>
    </div>
  </div>  
</template>

<script>
  export default {
    name: 'FormContainer'
  }
</script>

<style lang="scss" scoped>
  .form {
    max-width: 500px;
  }

  .form-content, .form-buttons, .form-extra {
    margin-top: 15px;
  }

  .form-extra {
    text-align: center;
  }
</style>