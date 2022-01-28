<template>
  <div>
    <Menu />

    <b-row class="text-center justify-content-center">
      <b-col cols="12" lg="6">
        <b-card
          class="mx-auto border-0 shadow p-lg-3 mb-2 mb-lg-5 mt-lg-3 bg-white rounded"
        >
          <b-form @submit="editUser">
            <b-form-group>
              <div class="d-flex align-items-center">
                <b-col sm="2" class="d-none d-lg-block p-0">
                  <label for="username">Username</label>
                </b-col>
                <b-col sm="10">
                  <b-form-input
                    id="username"
                    type="text"
                    placeholder="User Name"
                    v-model="input.username"
                    class="text-dark mb-2 pl-lg-3"
                  ></b-form-input>
                </b-col>
              </div>
              <div class="d-flex align-items-center">
                <b-col sm="2" class="d-none d-lg-block p-0">
                  <label for="firstName">First Name</label>
                </b-col>
                <b-col sm="10">
                  <b-form-input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    v-model="input.firstName"
                    class="text-dark mb-2 pl-lg-3"
                  ></b-form-input>
                </b-col>
              </div>
              <div class="d-flex align-items-center">
                <b-col sm="2" class="d-none d-lg-block p-0">
                  <label for="lastName">Last Name</label>
                </b-col>
                <b-col sm="10">
                  <b-form-input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    v-model="input.lastName"
                    class="text-dark mb-2 pl-lg-3"
                  ></b-form-input>
                </b-col>
              </div>
              <div class="d-flex align-items-center">
                <b-col sm="2" class="d-none d-lg-block p-0">
                  <label for="email"> Email </label>
                </b-col>
                <b-col sm="10">
                  <b-form-input
                    id="email"
                    type="email"
                    placeholder="Email"
                    v-model="input.email"
                    class="mb-2 pl-lg-3"
                    disabled
                  ></b-form-input>
                </b-col>
              </div>
              <div v-if="userData.admin" class="d-flex align-items-center">
                <b-col sm="2" class="d-none d-lg-block p-0">
                  <label for="admin"> Status </label>
                </b-col>
                <b-col sm="10">
                  <b-form-input
                    id="admin"
                    type="text"
                    placeholder="Admin"
                    class="mb-2 pl-lg-3"
                    disabled
                  ></b-form-input>
                </b-col>
              </div>
            </b-form-group>
            <button
              type="submit"
              :class="`save-btn ${emptyInput ? 'disabled' : ''}`"
              :disabled="emptyInput"
              aria-label="Save"
            >
              Save
            </button>
          </b-form>

          <UserDeleteAccount />
        </b-card>
      </b-col>
    </b-row>

    <PostsList :userId="userData.userId" />
  </div>
</template>

<script>
import { apiClient } from '../services/ApiClient'
import PostsList from '../components/PostsList'
import Menu from '../components/Menu'
import UserDeleteAccount from '../components/UserDeleteAccount'

export default {
  name: 'Profile',
  components: {
    PostsList,
    Menu,
    UserDeleteAccount
  },
  data () {
    const userData = JSON.parse(localStorage.getItem('userData'))
    return {
      userData,
      content: '',
      input: {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        imageUrl: userData.imageUrl
      },
      selectedFile: null,
      url: null
    }
  },

  methods: {
    onFileSelected (event) {
      this.url = URL.createObjectURL(event.target.files[0])
      this.selectedFile = event.target.files[0]
    },

    triggerInput () {
      this.$refs.fileUpload.click()
    },

    editUser (event) {
      let body = this.input

      const isFormData = !!this.selectedFile

      if (isFormData) {
        const formData = new FormData()
        formData.append('image', this.selectedFile)
        formData.append('user', JSON.stringify(body))
        body = formData
      }
      apiClient.put('api/auth/edit', body, { isFormData }).then(res => {
        localStorage.setItem('userData', JSON.stringify(res.user))
        this.userData = res.user
        window.location.reload()
      })
    }
  },
  computed: {
    emptyInput () {
      return (
        !this.input.firstName.trim().length ||
        !this.input.lastName.trim().length
      )
    }
  }
}
</script>

<style lang="scss">
.row {
  margin-left: 0;
  margin-right: 0;
}

.div-main-picture {
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
}

.profile-main-picture {
  height: 100px;
}

.custom-file-label {
  text-align: left;
}

.save-btn {
  background-color: rgba(253, 45, 6, 0.8);
  color: white;
  border-radius: 1rem;
  border: none;
  margin-bottom: 1rem;
  padding: 0.375rem 0.75rem;
  &:hover,
  &:focus,
  &:active {
    background-color: rgb(253, 45, 6);
    color: white;
    outline: none;
  }
}

.card-body {
  padding-bottom: 0;
}

@media screen and (min-width: 280px) and (max-width: 769px) {
  .create-button {
    width: 100% !important;
  }

  .div-main-picture {
    width: 75px;
    height: 75px;
  }

  .profile-main-picture {
    height: 75px;
  }

  .shadow {
    box-shadow: 0rem 0.2rem 0.5rem rgba(0, 0, 0, 0.08) !important;
  }
}
</style>