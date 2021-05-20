<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="NFT Logo"
          class="shrink mr-2"
          contain
          src="https://upload.wikimedia.org/wikipedia/commons/2/24/NFT_Icon.png"
          transition="scale-transition"
          width="40"
        />

        ERC721 Contracts
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://thegraph.com/explorer/subgraph/wmhilton/erc721-contracts"
        target="_blank"
        text
      >
        <span class="mr-2">GraphQL API</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <ContractTable/>
    </v-main>
  </v-app>
</template>

<script>
import ContractTable from './components/ContractTable';

export default {
  name: 'App',

  components: {
    ContractTable,
  },

  data: () => ({
    //
  }),
};
</script>
