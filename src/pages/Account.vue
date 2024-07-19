<template>
  <main
    class="mx-auto w-full max-w-7xl px-6 pt-8 pb-16 md:py-16 sm:px-6 lg:px-8"
  >
    <!-- title and button -->
    <div class="flex items-center">
      <span class="text-2xl font-medium">Учетные записи</span>
      <button
        @click="create"
        class="ml-5 relative inline-flex items-center rounded-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
      >
        +
      </button>
    </div>

    <div
      v-for="(item, index) in table"
      :key="index"
      class="mt-5 grid-container"
    >
      <div class="flex-col">
        <label
          v-if="index === 0"
          for="tags"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Метки</label
        >
        <input
          v-model="item.tags"
          maxlength="50"
          id="tags"
          class="block mt-2 w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div class="flex-col">
        <Listbox as="div" v-model="item.selectedRecordType">
          <ListboxLabel
            v-if="index === 0"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Тип записи</ListboxLabel
          >
          <div class="relative mt-2 min-w-[140px]">
            <ListboxButton
              class="block w-full cursor-pointer rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
            >
              <span class="block truncate">{{
                item.selectedRecordType.name
              }}</span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <ChevronUpDownIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  as="template"
                  v-for="type in item.optionsRecordType"
                  :key="type.id"
                  :value="type"
                  @click="removePassword(item.id, type.id)"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      active ? 'bg-blue-600 text-white' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-semibold' : 'font-normal',
                        'block truncate',
                      ]"
                      >{{ type.name }}</span
                    >

                    <span
                      v-if="selected"
                      :class="[
                        active ? 'text-white' : 'text-indigo-600',
                        'absolute inset-y-0 right-0 flex items-center pr-4',
                      ]"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
      <div
        class="flex-col"
        :class="item.selectedRecordType.id === 1 && 'col-span-2'"
      >
        <label
          for="login"
          class="block text-sm font-medium leading-6 text-gray-900"
          v-if="index === 0"
          >Логин</label
        >
        <input
          v-model="item.login"
          maxlength="100"
          id="login"
          @blur="logValidate(item.id)"
          @input="logValidate(item.id)"
          class="block mt-2 w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          :class="
            item.isErrorLogin ? 'border-red-600 focus:border-red-600' : ''
          "
        />
        <span v-if="item.isErrorLogin" class="text-red-600 text-sm"
          >Заполните поле "Логин"</span
        >
      </div>
      <div v-if="item.selectedRecordType.id !== 1" class="flex-col">
        <label
          v-if="index === 0"
          class="block text-sm font-medium leading-6 text-gray-700"
          >Пароль</label
        >
        <div class="relative">
          <input
            name="password"
            id="password"
            maxlength="100"
            v-model="item.password"
            :type="item.isPassType"
            @blur="pasValidate(item.id)"
            @input="pasValidate(item.id)"
            class="block mt-2 w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            :class="
              item.isErrorPas ? 'border-red-600 focus:border-red-600' : ''
            "
          />
          <div class="pass-visible" @click="visiblePass(item.id)">
            <svg
              v-if="!item?.isPassVisible"
              class="ico-pass-visible"
              width="20"
              height="15"
              viewBox="0 0 22 15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 0C3 0 0 8 0 8C0 8 3 16 11 16C19 16 22 8 22 8C22 8 19 0 11 0ZM11 3C13.761 3 16 5.239 16 8C16 10.761 13.761 13 11 13C8.239 13 6 10.761 6 8C6 5.239 8.239 3 11 3ZM11 5C10.2044 5 9.44129 5.31607 8.87868 5.87868C8.31607 6.44129 8 7.20435 8 8C8 8.79565 8.31607 9.55871 8.87868 10.1213C9.44129 10.6839 10.2044 11 11 11C11.7956 11 12.5587 10.6839 13.1213 10.1213C13.6839 9.55871 14 8.79565 14 8C14 7.20435 13.6839 6.44129 13.1213 5.87868C12.5587 5.31607 11.7956 5 11 5Z"
              />
            </svg>
            <svg
              v-else
              class="ico-pass-visible"
              width="20"
              height="18"
              viewBox="0 0 22 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.9903 0.990234C2.79137 0.990287 2.59697 1.04967 2.43196 1.16078C2.26695 1.27189 2.13883 1.42969 2.06397 1.614C1.98911 1.79832 1.97093 2.00077 2.01173 2.19547C2.05253 2.39017 2.15048 2.56828 2.29304 2.70703L4.07624 4.49023C2.14437 6.04173 0.891589 7.94401 0.271553 9.06055C-0.0604472 9.65855 -0.0495409 10.3785 0.275459 10.9805C1.43046 13.1185 4.75107 18 11.0001 18C13.0756 18 14.8061 17.4547 16.2423 16.6562L18.293 18.707C18.3852 18.803 18.4956 18.8796 18.6177 18.9324C18.7398 18.9852 18.8712 19.0131 19.0043 19.0144C19.1373 19.0158 19.2693 18.9906 19.3925 18.9403C19.5157 18.89 19.6276 18.8157 19.7216 18.7216C19.8157 18.6275 19.8901 18.5156 19.9404 18.3924C19.9907 18.2692 20.0159 18.1373 20.0145 18.0042C20.0132 17.8712 19.9853 17.7397 19.9325 17.6176C19.8797 17.4955 19.8031 17.3851 19.7071 17.293L3.7071 1.29297C3.61391 1.19717 3.50247 1.12103 3.37935 1.06903C3.25624 1.01704 3.12395 0.990242 2.9903 0.990234ZM11.0001 2C9.78807 2 8.70586 2.19972 7.71687 2.51172L10.2774 5.07227C10.5144 5.03727 10.7531 5 11.0001 5C13.7611 5 16.0001 7.239 16.0001 10C16.0001 10.247 15.9628 10.4857 15.9278 10.7227L19.3575 14.1523C20.4315 12.9603 21.2176 11.7513 21.6876 10.9473C22.0416 10.3433 22.0401 9.60133 21.7051 8.98633C20.5361 6.83333 17.2191 2 11.0001 2ZM6.83405 7.24805L8.29694 8.71094C8.10823 9.10083 8.00007 9.53657 8.00007 10C8.00007 11.657 9.34307 13 11.0001 13C11.4635 13 11.8992 12.8918 12.2891 12.7031L13.754 14.168C12.7604 14.8268 11.5207 15.1424 10.1993 14.9375C8.10129 14.6115 6.38857 12.8988 6.06257 10.8008C5.85774 9.48 6.17582 8.24139 6.83405 7.24805Z"
              />
            </svg>
          </div>
          <span v-if="item.isErrorPas" class="text-red-600 text-sm"
            >Заполните поле "Пароль"</span
          >
        </div>
      </div>
      <div class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-7 cursor-pointer"
          @click="deleted(item.id)"
          :class="index === 0 && 'mt-6'"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ChevronLeftIcon,
} from "@heroicons/vue/20/solid";

// Интерфейсы для данных
interface RecordType {
  id: number;
  name: string;
}

interface TableEntry {
  id: number;
  tags: string;
  selectedRecordType: RecordType;
  optionsRecordType: RecordType[];
  login: string;
  password: string | null;
  isPassVisible: boolean;
  isPassType: string;
  isErrorPas: boolean;
  isErrorLogin: boolean;
}

// Инициализация ref с типом
const table: Ref<TableEntry[]> = ref([
  {
    id: 1,
    tags: "",
    selectedRecordType: { id: 2, name: "Локальная" },
    optionsRecordType: [
      { id: 1, name: "LDAP" },
      { id: 2, name: "Локальная" },
    ],
    login: "",
    password: null,
    isPassVisible: false,
    isPassType: "password",
    isErrorPas: false,
    isErrorLogin: false,
  },
]);

// Функция для смены видимости пароля
const visiblePass = (id: number): void => {
  table.value =
    table.value?.map((item: TableEntry) => {
      if (item.id === id) {
        return {
          ...item,
          isPassVisible: !item.isPassVisible,
          isPassType: item.isPassVisible ? "password" : "input",
        };
      }
      return item;
    }) || [];
};

// Функция для удаления пароля
const removePassword = (id: number, typeId: number): void => {
  if (typeId === 1) {
    table.value =
      table.value?.map((item: TableEntry) => {
        if (item.id === id) {
          return {
            ...item,
            password: null,
          };
        }
        return item;
      }) || [];
  }
};

// Функция для проверки пароля
const pasValidate = (id: number): void => {
  table.value =
    table.value?.map((item: TableEntry) => {
      if (item.id === id) {
        return {
          ...item,
          isErrorPas: !item.password?.length,
        };
      }
      return item;
    }) || [];
};

// Функция для проверки логина
const logValidate = (id: number): void => {
  table.value =
    table.value?.map((item: TableEntry) => {
      if (item.id === id) {
        return {
          ...item,
          isErrorLogin: !item.login?.length,
        };
      }
      return item;
    }) || [];
};

// Функция для создания новой записи
const create = (): void => {
  let newId = 0;
  if (table?.value?.length) {
    newId =
      table?.value?.reduce((a: TableEntry, b: TableEntry) =>
        a?.id > b?.id ? a : b
      )?.id || 1;
  }
  const newValue: TableEntry = {
    id: newId + 1,
    tags: "",
    selectedRecordType: { id: 2, name: "Локальная" },
    optionsRecordType: [
      { id: 1, name: "LDAP" },
      { id: 2, name: "Локальная" },
    ],
    login: "",
    password: null,
    isPassVisible: false,
    isPassType: "password",
    isErrorPas: false,
    isErrorLogin: false,
  };
  table.value.push(newValue);
};

// Функция для удаления записи
const deleted = (id: number): void => {
  table.value = table.value?.filter((item: TableEntry) => item.id !== id);
};
</script>

<style scoped>
.pass-visible {
  position: absolute;
  top: 8px;
  right: 10px;
  height: 21px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.ico-pass-visible {
  fill: #1e1e1e;
  opacity: 0.2;
  margin-right: 5px;
}
[dir="rtl"] .pass-visible {
  right: auto;
  left: 0;
}
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 50px;
  gap: 1rem;
}
</style>