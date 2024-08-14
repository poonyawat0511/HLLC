<script setup lang="ts">
  const dialogStudent = defineModel<boolean>({ default: false })
  const props = defineProps<{
    users: string[];
  }>();
  const emit = defineEmits(['confirm']);
  const selectedUsers = ref<string[]>([])


  const confirmSelection = () => {
    emit('confirm', { type: 'INDIVIDUAL', target: selectedUsers.value});
    dialogStudent.value = false;
  };
</script>
<template>
  <v-dialog 
    v-model="dialogStudent" 
    max-width="700px"
  >
    <v-card 
      class="rounded-xl " 
      elevation="4"
    >
      <v-card 
        class="mb-3 " 
        elevation="0" 
        color="primary"
      >
        <template #title> Add User </template>

      </v-card>
      
        <v-form-card class="mb-3 mt-8 ma-16" >

          <v-autocomplete
            v-model="selectedUsers"
            :items="users"
            label="User"
            multiple
            chips
            clearable
            closable-chips
            variant="outlined"
            persistent-hint
            hint="Select users"
          ></v-autocomplete>

        </v-form-card>
        
      
      <v-card-actions 
        class="d-flex justify-center mt-4">
        <v-btn
          class="px-4"
          variant="flat"
          rounded="lg"
          text="Cancel"
          @click="dialogStudent = false"
        />
        <v-btn
          class="px-4"
          color="primary"
          variant="flat"
          rounded="lg"
          text="Continue"
          @click="confirmSelection"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>