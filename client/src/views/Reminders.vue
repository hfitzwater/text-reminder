<template>
  <div class="reminders">
    <div style="float:right;text-align:right;" v-if="user">
      <div class="user-data">
        <strong style="margin-right:8px;">{{ user.username }}</strong>
        [
        <cv-link href="javascript:;" @click="logout()">
          Logout
        </cv-link>
        ]
      </div>
      <div class="user-data" v-if="user.phoneNumber">
        <cv-link href="javascript:;">
          {{ formatPhone( user.phoneNumber.number ) }}
        </cv-link>
      </div>
    </div>
    <h2>
      Text <strong>Reminder</strong>
    </h2>
    <div style="clear:both;"></div>
    
    <br>

    <cv-modal
      ref="modal"
      @primary-click="save"
      @secondary-click="cancelEdit"
      :auto-hide-off="false">
      <template slot="label">Reminder</template>
      <template slot="title">Reminder</template>
      <template slot="content">
        <ValidationObserver ref="validationObserver">
          <div @keyup.enter="save">
            <cv-form>
              <ValidationProvider rules="required" name="Message" v-slot="{ errors }">
                <cv-text-input
                  :class="{
                    error: hasError('Message')
                  }"
                  id="reminderMessage"
                  label="Message"
                  placeholder="Reminder message..."
                  v-model="editable.message">
                </cv-text-input>
                <div class="form-error">
                  {{ errors[0] }}
                </div>
              </ValidationProvider>
              
              <ValidationProvider rules="required" name="Date" v-slot="{ errors }">
                <cv-date-picker
                  :class="{
                    error: hasError('Date')
                  }"
                  kind="single"
                  v-model="editable.pickerDate">
                </cv-date-picker>
                <div class="form-error">
                  {{ errors[0] }}
                </div>
              </ValidationProvider>
              
              <ValidationProvider name="Time" v-slot="{ errors }">
                <cv-time-picker
                  :class="{
                    error: hasError('Time')
                  }"
                  :time="editable.pickerTime"
                  :ampm="editable.pickerAmPm"
                  @update:time="onTimeChanged"
                  @update:ampm="onAmPmChanged"/>
                <div class="form-error">
                  {{ errors[0] }}
                </div>
              </ValidationProvider>
              
              <ValidationProvider rules="required" name="Repeat" v-slot="{ errors }">
                <cv-select
                  :class="{
                    error: hasError('Repeat')
                  }"
                  label="Repeat"
                  v-model="editable.repeat">
                  <cv-select-option disabled hidden>
                    Choose an option
                  </cv-select-option>
                  <cv-select-option value="none">
                    None
                  </cv-select-option>
                  <cv-select-option value="daily">
                    Daily
                  </cv-select-option>
                  <cv-select-option value="weekly">
                    Weekly
                  </cv-select-option>
                  <cv-select-option value="monthly">
                    Montly
                  </cv-select-option>
                </cv-select>
                <div class="form-error">
                  {{ errors[0] }}
                </div>
              </ValidationProvider>
            </cv-form>
          </div>
        </ValidationObserver>
      </template>
      <template slot="secondary-button">
        Cancel
      </template>
      <template slot="primary-button">
        Save
      </template>
    </cv-modal>

    <div>
      <cv-loading
        :active="isLoading"
        :overlay="true">
      </cv-loading>

      <div>
        <cv-button @click="edit()" :icon="AddFilled32" style="float:right" v-if="reminders && reminders.length > 0">
          Add Reminder
        </cv-button>
        <div style="clear:both"></div>
      </div>

      <br>

      <cv-structured-list v-if="reminders && reminders.length > 0">
        <template slot="headings">
          <cv-structured-list-heading>
            Message
          </cv-structured-list-heading>
          <cv-structured-list-heading>
            Time
          </cv-structured-list-heading>
          <cv-structured-list-heading>
            Repeated
          </cv-structured-list-heading>
          <cv-structured-list-heading>
            <!-- Empty -->
          </cv-structured-list-heading>
        </template>
        <template slot="items">
          <cv-structured-list-item v-for="reminder of reminders" :key="reminder.id">
            <cv-structured-list-data>
              {{ reminder.message }}
            </cv-structured-list-data>
            <cv-structured-list-data>
              {{ moment(reminder.time).format("dddd, MMMM Do YYYY @ h:mm a") }}
            </cv-structured-list-data>
            <cv-structured-list-data>
              <template v-if="reminder.repeat === 'none'">
                -
              </template>
              <template v-else>
                {{ reminder.repeat }}
              </template>
            </cv-structured-list-data>
            <cv-structured-list-data>
              <cv-overflow-menu
                :flip-menu="true"
                label="Actions"
                tip-position="left"
                tip-alignment="center">
                <cv-overflow-menu-item primary @click="edit(reminder)">
                  Edit
                </cv-overflow-menu-item>
                <cv-overflow-menu-item danger @click="requestRemove(reminder)">
                  Remove
                </cv-overflow-menu-item>
              </cv-overflow-menu>
            </cv-structured-list-data>
          </cv-structured-list-item>
        </template>
      </cv-structured-list>

      <div v-if="!reminders || reminders.length === 0">
        <cv-tile theme="light" class="empty-state" v-show="!user.phoneNumber.confirmed">
          <h3>
            Start by verifying your phone number
          </h3>
          <p>
            Enter the <strong>confirmation code</strong> sent to {{ formatPhone(user.phoneNumber.number) }}
          </p>
          <br>
          <cv-text-input
            type="number"
            max="999999"
            v-model="code">
          </cv-text-input>
          <br>
          <cv-button @click="confirmCode()">
            Confirm
          </cv-button>
        </cv-tile>
        <cv-tile theme="light" class="empty-state" v-show="user.phoneNumber.confirmed && !isLoading">
          <h3>
            Now add a reminder
          </h3>
          <p>
            Click <strong>Add Reminder</strong> to create a new reminder
          </p>
          <br>
          <cv-button @click="edit()" :icon="AddFilled32">
            Add Reminder
          </cv-button>
        </cv-tile>
      </div>
    </div>
  </div>
</template>

<script>
import AddFilled32 from '@carbon/icons-vue/es/add--filled/32';
import Edit32 from '@carbon/icons-vue/es/edit/32';
import TrashCan32 from '@carbon/icons-vue/es/trash-can/32';
import CoreClient from '../services/core';
import moment from 'moment';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import { REMINDER_ACTIONS } from '../store/modules/ReminderStore';
import { USER_ACTIONS } from '../store/modules/UserStore';
import { mapState } from 'vuex';

extend('required', {
  ...required,
  message: '{_field_} is required'
});

export default {
  name: 'Reminders',
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      moment,
      Edit32,
      TrashCan32,
      AddFilled32,
      isLoading: true,
      editable: {},
      code: null
    }
  },
  mounted() {
    this.isLoading = true;
    this.$store.dispatch(REMINDER_ACTIONS.GET_USER_REMINDERS)
      .finally(() => {
        this.isLoading = false;
      });
  },
  methods: {
    edit( reminder ) {
      this.editable = this.getEditableReminder(reminder);
      this.$refs.modal.show();

      setTimeout(() => {
        document.querySelector('#reminderMessage').focus();
      }, 150 );
    },
    getEditableReminder( reminder={} ) {
      const time = reminder ? moment(reminder.time) : moment();

      const month = time.get('month') + 1;
      const date = time.get('date');
      const year = time.get('year');

      let ampm = 'AM';
      let hour = time.get('hour') - 12;
      let minute = time.get('minute');
      if( hour >= 12 ) {
        hour = hour - 12;
      }

      if( hour > 0 ) {
        ampm = 'PM'
      } else {
        hour = Math.abs(hour);
      }

      if( hour < 10 ) {
        hour = `0${hour}`;
      }

      if( minute < 10 ) {
        minute = `0${minute}`;
      }

      const isNew = !reminder.id;
      return {
        id: reminder.id || null,
        message: reminder.message,
        pickerDate: `${month}/${date}/${year}`,
        pickerTime: `${hour}:${minute}`,
        pickerAmPm: ampm,
        repeat: reminder.repeat || 'none'
      }
    },
    cancelEdit() {
      this.$refs.modal.hide();
    },
    onTimeChanged(time) {
      this.editable.pickerTime = time;
    },
    onAmPmChanged(ampm) {
      this.editable.pickerAmPm = ampm;
    },
    async save() {
      const isValid = await this.$refs.validationObserver.validate();
      if( !isValid ) return;

      const d = `${this.editable.pickerDate} ${this.editable.pickerTime} ${this.editable.pickerAmPm}`;
      let dateTime = moment(d, 'MM/DD/YYYY LT');

      const dto = {
        id: this.editable.id,
        message: this.editable.message,
        time: dateTime.utc().format(),
        repeat: this.editable.repeat
      };

      let action = null;
      if( this.editable.id ) {
        action = REMINDER_ACTIONS.UPDATE_REMINDER;
      } else {
        action = REMINDER_ACTIONS.CREATE_REMINDER;
      }

      await this.$store.dispatch(action, dto);

      this.cancelEdit();
    },
    async requestRemove(reminder) {      
      const confirmed = window.confirm('Are you sure that you would like to remove this reminder?');
      
      if(confirmed) {
        this.remove(reminder.id);
      }
    },
    async remove(reminderId) {
      await this.$store.dispatch(REMINDER_ACTIONS.DELETE_REMINDER, reminderId);
    },
    formatPhone(number) {
      try {
      const numberStr = `${number}`;
        const parts = [
          numberStr.substring(0,3),
          numberStr.substring(3,6),
          numberStr.substring(6)
        ];

        return parts.join('-');
      } catch( ex ) {
        console.error(ex);
        return number;
      }
    },
    async confirmCode() {
      await this.$store.dispatch(USER_ACTIONS.CONFIRM_PHONE, this.code);
      
      setTimeout(() => {
        if( !this.user.phoneNumber.confirmed ) {
          alert('Incorrect confirmation code');
        }
      });
    },
    logout() {
      this.$store.dispatch(USER_ACTIONS.LOGOUT);  
      this.$router.push('/');
    }
  },
  // computed: mapState({
  //   user: state => state.user.active,
  //   reminders: state => state.reminders.all,
  // })
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
    user() {
      return this.$store.state.user.active;
    },
    reminders() {
      return this.$store.state.reminders.all;
    }
  }
}
</script>

<style lang="scss" scoped>
  .reminders {
    max-width: 800px;
    margin: auto;
  }

  .user-data {
    margin-bottom: 10px;
  }

  .empty-state {
    padding: 20px;
    max-width: 600px;
  }
</style>
