<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-col>
        <v-data-table
          class="elevation-1"
          dense
          :headers="headers"
          :items="contracts"
          :server-items-length="totalContracts"
          :loading="loading"
          @update:page="getPage"
          @update:options="setOptions"
          :footer-props="{
            showCurrentPage: true,
          }">
          <template v-slot:top>
            <v-text-field
              v-model="search"
              @input="getPage(1)"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              class="mx-4"
            ></v-text-field>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
      headers: [
        {
          text: 'Address',
          value: 'id',
          sortable: true,
        },
        {
          text: 'Name',
          value: 'name',
          sortable: true,
          filterable: true,
        },
        {
          text: 'Symbol',
          value: 'symbol',
          sortable: true,
        }
      ],
      contracts: [
        {
          id: 'vuetify-loader',
          name: 'https://github.com/vuetifyjs/vuetify-loader',
          symbol: 'foo'
        },
        {
          id: 'github',
          name: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          id: 'awesome-vuetify',
          name: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
      loading: true,
      itemsPerPage: 10,
      sortBy: undefined,
      sortDesc: undefined,
      search: '',
      totalContracts: 2274,
    }),

    mounted () {
      this.getPage(1);
    },

    methods: {
      setOptions(options) {
        console.log(options.sortBy, options.sortDesc)
        this.sortBy = options.sortBy[0];
        this.sortDesc = options.sortDesc[0];
        this.itemsPerPage = options.itemsPerPage;
        this.getPage(options.page);
      },
      getPage(n) {
        this.loading = true;
        fetch('https://api.thegraph.com/subgraphs/name/wmhilton/erc721-contracts', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          "query": 
            `{
              contracts(
                first: ${this.itemsPerPage},
                skip: ${(n - 1) * this.itemsPerPage}${this.sortBy ? `,
                orderBy: ${this.sortBy},
                orderDirection: ${this.sortDesc ? 'desc' : 'asc'}` : ''}${this.search ? `,
                where: { name_contains: "${this.search.replaceAll('"', '\\"')}" }` : ''}) {
                id
                name
                symbol
              }
            }`
          })
        })
          .then(response => response.json())
          .then(data => {
            this.contracts = data.data.contracts;
            this.loading = false;
          });
      }
    }
  }
</script>
