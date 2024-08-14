<script setup lang="ts">
  const dialogMajor = defineModel<boolean>({ default: false });
  const props = defineProps<{
    schools: ISchool[];
  }>();

  const emit = defineEmits(['confirm']);

  interface ISchool {
    id: string;
    name: {
      en: string;
      th: string;
    };
    acronym: string;
    majors: Array<IMajor>;
    selection?: Array<string>;
  }

  interface IMajor {
    id: string;
    name: {
      th: string;
      en: string;
    };
    acronym: string;
    school: string;
  }

  const majorHeaders = [
    { title: 'Major', align: 'start', value: 'name.en' },
  ];

  const confirmSelection = () => {
    let type = 'SCHOOL';
    const target: string[] = [];

    props.schools.forEach(school => {
      if (school.selection && school.selection.length === school.majors.length) {
        target.push(school.acronym);
      } else if (school.selection && school.selection.length > 0) {
        target.push(...school.selection);     
        type = 'MAJOR';
      }
    });

    if (target.some(item => props.schools.some(school => school.acronym === item)) && type !== 'SCHOOL') {
      type = 'MAJOR';
    }

    emit('confirm', { type, target });

    dialogMajor.value = false;
  };
</script>
<template>
    <v-dialog 
      v-model="dialogMajor" 
      max-width="800px" 
      persistent
    >

      <v-card class="rounded-xl">

        <v-card-title class="primary white--text">Select Major</v-card-title>

        <v-card-text>

          <v-form class="mt-5">
            <v-expansion-panels variant="accordion">
              <v-expansion-panel v-for="(school, i) in schools" :key="i">
                <v-expansion-panel-title>
                  <v-row>
                    <v-col cols="8" class="align-self-center">{{ school.name.en }}</v-col>
                    <v-col cols="4">
                      <v-chip>select: {{ school.selection?.length || 0 }}</v-chip>
                    </v-col>
                  </v-row>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-data-table
                    v-model="school.selection"
                    :headers="majorHeaders"
                    :items="school.majors"
                    item-value="acronym"
                    show-select
                    disable-pagination
                    hide-default-footer
                  ></v-data-table>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>

      </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogMajor = false" rounded color="primary">
            Cancel
          </v-btn>
          <v-btn @click="confirmSelection" rounded color="primary">
            Confirm
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </template>