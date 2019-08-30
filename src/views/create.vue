<template>
  <div class="view">
    <div v-show="deleteMode" class="panel">
      <h1>Are you sure you want to delete this paste?</h1>
      <p>Make sure both ID and editCode are populated before continuing.</p>
      <input type="button" value="I changed my mind" @click="deleteMode = false;"/>
      <input type="button" value="Delete" class="delete" @click="deletePaste"/>
    </div>
    <div v-show="!deleteMode && editCode" class="panel">
      <h1>Paste has been uploaded</h1>
      <h3>Edit Code: <pre>{{editCode}}</pre></h3>
      <p>Remember this code, you're going to need it if you ever need to change this document. This ID is NOT the same as your paste-ID.</p>
      <router-link :to="'/' + id">View Paste</router-link>
    </div>
    <div v-show="!deleteMode && !editCode">
      <div v-show="errors.length" class="errors">
        <p>There were errors when trying to validate or send this paste:</p>
        <ul>
          <li v-for="(error, key) in errors" :key="key">{{error}}</li>
        </ul>
      </div>
      <form @submit.prevent="validateForm">
        <textarea rows="40" required autocomplete="off" name="content" v-model="paste.content"/>
        <label for="name">Name / Title
          <input type="text" name="name" required v-model="paste.title">
        </label>
        <label for="editcode">Edit code (empty for new paste)
          <input type="text" name="editcode" v-model="paste.editCode">
        </label>
        <label for="id">ID (empty for new paste)
          <input type="text" name="id" v-model="paste.id">
        </label>

        <input type="submit" :value="submitValue" :disabled="submitted"/>

        <input type="button" @click="deleteMode = true;" value="Delete Paste" class="delete right" :disabled="!(paste.editCode && paste.id)"/>
      </form>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';

export default {
  name: 'create-paste',
  data() {
    return {
      submitted: false,
      errors: [],
      editCode: '',
      id: '',
      deleteMode: false,
      paste: this.$store.getters.getCachedPaste
    }
  },
  computed: {
    submitValue() {
      if (this.submitted)
        return 'Please wait..';
      if (this.paste.editCode)
        return 'Edit';
      return 'Create';
    }
  },
  watch: {
    paste: {
      handler(val) {
       this.dOnInputUpdate();
      },
      deep: true
    }
  },
  methods: {
    async validateForm(submit = true) {
      this.errors = [];

      if (!this.paste.content) {
        this.errors.push('The field \'content\' cannot be left blank.');
      }
      if (!this.paste.title) {
        this.errors.push('The field \'title\' cannot be left blank.');
      }

      if (this.paste.content && (this.paste.content.length < 8 || this.paste.content.length > 16384)) {
        this.addLengthError('content', 8, 16384);
      }
      if (this.paste.title && (this.paste.title.length < 2 || this.paste.title.length > 64)) {
        this.addLengthError('title', 2, 64);
      }
      if (this.paste.editCode && this.paste.editCode.length !== 32) {
        this.addLengthError('editcode', 32, 32);
      }
      if (this.paste.id && this.paste.id.length > 32) {
        this.addLengthError('id', 0, 32);
      }
      if ((this.paste.id || this.paste.editCode) && !(this.paste.id && this.paste.editCode)) {
        this.errors.push('Both \'id\' and \'editCode\' must be populated when editing existing paste.');
      }

      if (this.errors.length) {
        if (submit) {
          this.scrollToTop();
        }
        return;
      }
      if (!submit) {
        return;
      }
      await this.submitForm();
    },
    async submitForm() {
      this.submitted = true;
      try {
        const self = this;
        const response = await this.$http({
          method: this.paste.id && this.paste.editCode ? 'put' : 'post',
          url: this.paste.id || '',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          transformRequest(data, headers) {
            var params = new URLSearchParams();
            for (var propName in self.paste) {
              params.append(propName, self.paste[propName]);
            }
            return params;
          },
        })
        this.$store.commit('setCachedPaste', {});
        
        if (this.paste.id && this.paste.editCode) {
          this.$router.push('/' + this.paste.id);
          this.paste = {};
          return;
        }
        this.paste = {};
        this.editCode = response.data.editCode;
        this.id = response.data.id;
      }
      catch (ex) {
        this.errors.push(ex.response.data);
        this.scrollToTop();
      }
      finally {
        this.submitted = false;
      }
    },
    onInputUpdate() {
      this.validateForm(false);
      this.$store.commit('setCachedPaste', this.paste);
    },
    addLengthError(field, min, max) {
      if (min === max) {
        this.errors.push(`The field '${field}' length must be exactly ${min} characters long.`)
        return;
      }
      this.errors.push(`The field '${field}' length must be between ${min} and ${max} characters long.`)
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async deletePaste() {
      const self = this;
      try {
        const response = await this.$http({
          method: 'delete',
          url: this.paste.id,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          transformRequest(data, headers) {
            var params = new URLSearchParams();
            params.append('editCode', self.paste['editCode']);
            return params;
          },
        })
        this.$store.commit('setCachedPaste', {});
        this.paste = {};
        this.errors = [];
      }
      catch(ex) {
        this.errors.push(ex.response.data);
      }
      finally {
        this.deleteMode = false;
      }
    }
  },
  async mounted() {
    document.title = 'Pastr - Create new';
  },
  created() {
    this.dOnInputUpdate = debounce(this.onInputUpdate, 500);
  }
}
</script>

<style lang="scss">
@import "@/scss/global.scss";

textarea {
  background-color: map-get($colors, background);
  width: 98.1%;
  max-width: 98.1%;
  min-width: 98.1%;
  height: 100%;
  min-height: 400px;
}
</style>

<style lang="scss" scoped>
@import "@/scss/global.scss";

form {
  margin-left: map-get($margins, default-left);
  margin-bottom: 30px;
}
input[type="text"],
input[type="password"] {
  display: block; 
  vertical-align: top;
  width: 30%;
  padding: 8px 20px;
  margin: 8px 0 40px map-get($margins, input-left);
  box-sizing: border-box;
  font-size: 24px;
  border: none;
  background-color: darken(map-get($colors, background), 2%);
  &:invalid {
    border-bottom: 2px solid map-get($colors, invalidinput-border);
  }
}
input[type="button"],
input[type="submit"],
input[type="reset"] {
  margin-left: map-get($margins, input-left);
  background-color: map-get($colors, button);
  border: none;
  color: black;
  padding: 12px 20px;
  text-decoration: none;
  cursor: pointer;
  font-size: 24px;
  &:disabled {
    cursor: not-allowed;
    background-color: map-get($colors, disabled);
  }
}
input[type="button"].delete {
  background-color: map-get($colors, button-delete);
  &.right {
    float: right;
    margin-right: 30px;
  }
}
.errors {
  margin-left: map-get($margins, default-left);
  p {
    color: red;
  }
  li {
   list-style-type: none; 
  }
}
.panel {
  margin-left: map-get($margins, default-left);
  pre {
    display: inline;
  }
  a {
    font-size: 2em;
  }
}
</style>
